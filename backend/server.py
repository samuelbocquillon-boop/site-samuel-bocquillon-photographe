"""Samuel Bocquillon — Backend FastAPI (POC core)
Auth admin JWT + Image upload/optimization (Pillow: WebP multi-tailles) + Settings + Contact.
"""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import io
import logging
import uuid
from pathlib import Path
from datetime import datetime, timezone, timedelta
from typing import Optional, List
from pydantic import BaseModel, Field
from jose import jwt, JWTError
from passlib.context import CryptContext
from PIL import Image, ImageOps
import smtplib
from email.mime.text import MIMEText
from slots import IMAGE_SLOTS, PAGE_ORDER, DEFAULT_TESTIMONIALS
from blog_seed import DEMO_POSTS

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

JWT_SECRET = os.environ.get('JWT_SECRET', 'sb-photo-secret-change-me')
JWT_ALGO = 'HS256'
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'SamuelB2025!')

pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
security = HTTPBearer()

app = FastAPI(title='Samuel Bocquillon API')
api_router = APIRouter(prefix='/api')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------- Helpers ----------------

def serialize_doc(doc):
    """Convert Mongo doc to JSON-safe dict (datetime -> isoformat, drop _id)."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        out = {}
        for k, v in doc.items():
            if k == '_id':
                continue
            out[k] = serialize_doc(v)
        return out
    if isinstance(doc, datetime):
        return doc.isoformat()
    return doc


def create_token(username: str) -> str:
    payload = {'sub': username, 'exp': datetime.now(timezone.utc) + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


async def get_current_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGO])
        username = payload.get('sub')
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=401, detail='Invalid token')
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid or expired token')


# ---------------- Image optimization (Pillow) ----------------
SIZES = [480, 960, 1600, 2400]
WEBP_QUALITY = 82


def optimize_image(raw: bytes, slot_key: str) -> dict:
    """Compress + convert to WebP + generate multiple widths for srcset.
    Returns dict with variants [{width, url, bytes}] and original dims."""
    img = Image.open(io.BytesIO(raw))
    img = ImageOps.exif_transpose(img)
    if img.mode in ('RGBA', 'P', 'LA'):
        img = img.convert('RGB')
    orig_w, orig_h = img.size
    uid = uuid.uuid4().hex[:10]
    variants = []
    for target_w in SIZES:
        if target_w > orig_w and variants:
            break
        w = min(target_w, orig_w)
        h = round(orig_h * w / orig_w)
        resized = img.resize((w, h), Image.LANCZOS) if w < orig_w else img
        fname = f'{slot_key}-{uid}-{w}.webp'
        fpath = UPLOAD_DIR / fname
        resized.save(fpath, 'WEBP', quality=WEBP_QUALITY, method=4)
        variants.append({'width': w, 'url': f'/api/uploads/{fname}', 'bytes': fpath.stat().st_size})
        if w == orig_w:
            break
    # JPEG fallback (largest size) for very old browsers
    largest = min(1600, orig_w)
    h = round(orig_h * largest / orig_w)
    fb = img.resize((largest, h), Image.LANCZOS) if largest < orig_w else img
    fb_name = f'{slot_key}-{uid}-fallback.jpg'
    fb.save(UPLOAD_DIR / fb_name, 'JPEG', quality=85, optimize=True, progressive=True)
    return {
        'variants': variants,
        'fallback': f'/api/uploads/{fb_name}',
        'width': orig_w,
        'height': orig_h,
        'srcset': ', '.join(f"{v['url']} {v['width']}w" for v in variants),
        'url': variants[-1]['url'] if variants else f'/api/uploads/{fb_name}',
    }


# ---------------- Models ----------------
class LoginRequest(BaseModel):
    username: str
    password: str


class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    wedding_date: Optional[str] = None
    wedding_location: Optional[str] = None
    message: str
    subject: Optional[str] = None


class AltUpdate(BaseModel):
    alt: str


# ---------------- Routes: health/settings ----------------
@api_router.get('/')
async def root():
    return {'message': 'Samuel Bocquillon API', 'status': 'ok'}


DEFAULT_SETTINGS = {
    'id': 'site-settings',
    'business_name': 'Samuel Bocquillon — Photographe de mariage',
    'city': 'Valenciennes',
    'region': 'Hauts-de-France',
    'address': 'Valenciennes, Nord (59), France',
    'postal_code': '59300',
    'country': 'FR',
    'phone': '+33 6 12 34 56 78',
    'email': 'contact@samuelbocquillon.fr',
    'instagram': 'https://instagram.com/samuelbocquillon',
    'facebook': 'https://facebook.com/samuelbocquillon',
    'pinterest': '',
    'ga_id': '',
    'latitude': 50.3579,
    'longitude': 3.5235,
    'response_delay': 'Réponse sous 24h garantie',
}


@api_router.get('/settings')
async def get_settings():
    doc = await db.settings.find_one({'id': 'site-settings'})
    if not doc:
        await db.settings.insert_one(dict(DEFAULT_SETTINGS))
        return DEFAULT_SETTINGS
    return serialize_doc(doc)


@api_router.put('/settings')
async def update_settings(payload: dict, admin: str = Depends(get_current_admin)):
    payload.pop('_id', None)
    payload['id'] = 'site-settings'
    await db.settings.update_one({'id': 'site-settings'}, {'$set': payload}, upsert=True)
    doc = await db.settings.find_one({'id': 'site-settings'})
    return serialize_doc(doc)


# ---------------- Routes: auth ----------------
@api_router.post('/auth/login')
async def login(req: LoginRequest):
    if req.username == ADMIN_USERNAME and req.password == ADMIN_PASSWORD:
        return {'access_token': create_token(req.username), 'token_type': 'bearer'}
    raise HTTPException(status_code=401, detail='Identifiants incorrects')


@api_router.get('/auth/me')
async def me(admin: str = Depends(get_current_admin)):
    return {'username': admin}


# ---------------- Routes: images ----------------
def merge_slot(slot: dict, uploaded: Optional[dict]) -> dict:
    """Merge slot registry definition with uploaded override (if any)."""
    out = {
        'slot_key': slot['slot_key'],
        'page': slot['page'],
        'label': slot['label'],
        'description': slot['description'],
        'default_url': slot['default_url'],
        'default_alt': slot['default_alt'],
        'custom': False,
        'url': slot['default_url'],
        'alt': slot['default_alt'],
        'srcset': None,
        'fallback': None,
    }
    if uploaded:
        opt = uploaded.get('optimized') or {}
        out.update({
            'custom': True,
            'url': opt.get('url') or slot['default_url'],
            'alt': uploaded.get('alt') or slot['default_alt'],
            'srcset': opt.get('srcset'),
            'fallback': opt.get('fallback'),
            'width': opt.get('width'),
            'height': opt.get('height'),
            'original_name': uploaded.get('original_name'),
            'updated_at': serialize_doc(uploaded.get('updated_at')),
        })
    return out


@api_router.get('/images')
async def list_images():
    """All image slots (registry) merged with uploaded overrides — grouped for admin & site."""
    docs = await db.images.find().to_list(500)
    by_key = {d['slot_key']: d for d in docs}
    merged = [merge_slot(s, by_key.get(s['slot_key'])) for s in IMAGE_SLOTS]
    return {'slots': merged, 'pages': PAGE_ORDER}


@api_router.get('/images/{slot_key}')
async def get_image(slot_key: str):
    slot = next((s for s in IMAGE_SLOTS if s['slot_key'] == slot_key), None)
    doc = await db.images.find_one({'slot_key': slot_key})
    if slot:
        return merge_slot(slot, doc)
    if not doc:
        raise HTTPException(status_code=404, detail='Image slot not found')
    return serialize_doc(doc)


@api_router.post('/images/upload')
async def upload_image(
    slot_key: str = Form(...),
    alt: str = Form(''),
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin),
):
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='Le fichier doit être une image')
    raw = await file.read()
    if len(raw) > 40 * 1024 * 1024:
        raise HTTPException(status_code=400, detail='Image trop lourde (max 40 Mo)')
    try:
        result = optimize_image(raw, slot_key)
    except Exception as e:
        logger.error(f'Image optimization failed: {e}')
        raise HTTPException(status_code=400, detail='Format d\'image non supporté')
    doc = {
        'id': str(uuid.uuid4()),
        'slot_key': slot_key,
        'alt': alt,
        'original_name': file.filename,
        'original_size': len(raw),
        'optimized': result,
        'updated_at': datetime.now(timezone.utc),
    }
    await db.images.update_one({'slot_key': slot_key}, {'$set': doc}, upsert=True)
    return serialize_doc(doc)


@api_router.put('/images/{slot_key}/alt')
async def update_alt(slot_key: str, payload: AltUpdate, admin: str = Depends(get_current_admin)):
    res = await db.images.update_one({'slot_key': slot_key}, {'$set': {'alt': payload.alt}})
    if res.matched_count == 0:
        # Slot has no uploaded image yet — store alt-only override
        slot = next((s for s in IMAGE_SLOTS if s['slot_key'] == slot_key), None)
        if not slot:
            raise HTTPException(status_code=404, detail='Image slot not found')
        await db.images.update_one(
            {'slot_key': slot_key},
            {'$set': {'slot_key': slot_key, 'alt': payload.alt, 'optimized': {'url': slot['default_url'], 'srcset': None, 'fallback': None}, 'updated_at': datetime.now(timezone.utc)}},
            upsert=True,
        )
    return {'ok': True}


@api_router.delete('/images/{slot_key}')
async def delete_image(slot_key: str, admin: str = Depends(get_current_admin)):
    await db.images.delete_one({'slot_key': slot_key})
    return {'ok': True}


# ---------------- Routes: contact ----------------
def send_email_notification(contact: dict, settings: dict):
    """Send email via Gmail SMTP if credentials configured (feature-flag)."""
    smtp_user = os.environ.get('SMTP_USER', '')
    smtp_pass = os.environ.get('SMTP_PASSWORD', '')
    if not smtp_user or not smtp_pass:
        logger.info('SMTP not configured — skipping email notification')
        return False
    try:
        body = (
            f"Nouvelle demande de contact :\n\n"
            f"Nom : {contact.get('name')}\n"
            f"Email : {contact.get('email')}\n"
            f"Téléphone : {contact.get('phone') or '-'}\n"
            f"Date du mariage : {contact.get('wedding_date') or '-'}\n"
            f"Lieu : {contact.get('wedding_location') or '-'}\n\n"
            f"Message :\n{contact.get('message')}\n"
        )
        msg = MIMEText(body, 'plain', 'utf-8')
        msg['Subject'] = f"Nouvelle demande — {contact.get('name')}"
        msg['From'] = smtp_user
        msg['To'] = settings.get('email', smtp_user)
        with smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=15) as server:
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        return True
    except Exception as e:
        logger.error(f'Email send failed: {e}')
        return False


@api_router.post('/contact')
async def submit_contact(req: ContactRequest):
    doc = req.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc)
    doc['read'] = False
    await db.contacts.insert_one(dict(doc))
    settings = await db.settings.find_one({'id': 'site-settings'}) or DEFAULT_SETTINGS
    emailed = send_email_notification(doc, settings)
    return {'ok': True, 'id': doc['id'], 'emailed': emailed}


@api_router.get('/contacts')
async def list_contacts(admin: str = Depends(get_current_admin)):
    docs = await db.contacts.find().sort('created_at', -1).to_list(500)
    return serialize_doc(docs)


@api_router.put('/contacts/{contact_id}/read')
async def mark_read(contact_id: str, admin: str = Depends(get_current_admin)):
    await db.contacts.update_one({'id': contact_id}, {'$set': {'read': True}})
    return {'ok': True}


@api_router.delete('/contacts/{contact_id}')
async def delete_contact(contact_id: str, admin: str = Depends(get_current_admin)):
    await db.contacts.delete_one({'id': contact_id})
    return {'ok': True}


# ---------------- Routes: testimonials ----------------
class TestimonialIn(BaseModel):
    author: str
    role: Optional[str] = ''
    text: str
    rating: int = 5
    category: str = 'mariage'
    featured: bool = False


async def ensure_testimonials_seed():
    count = await db.testimonials.count_documents({})
    if count == 0:
        for t in DEFAULT_TESTIMONIALS:
            doc = dict(t)
            doc['created_at'] = datetime.now(timezone.utc)
            await db.testimonials.insert_one(doc)


@api_router.get('/testimonials')
async def list_testimonials():
    await ensure_testimonials_seed()
    docs = await db.testimonials.find().to_list(200)
    return serialize_doc(docs)


@api_router.post('/testimonials')
async def create_testimonial(payload: TestimonialIn, admin: str = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc)
    await db.testimonials.insert_one(dict(doc))
    return serialize_doc(doc)


@api_router.put('/testimonials/{tid}')
async def update_testimonial(tid: str, payload: TestimonialIn, admin: str = Depends(get_current_admin)):
    res = await db.testimonials.update_one({'id': tid}, {'$set': payload.model_dump()})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Témoignage introuvable')
    return {'ok': True}


@api_router.delete('/testimonials/{tid}')
async def delete_testimonial(tid: str, admin: str = Depends(get_current_admin)):
    await db.testimonials.delete_one({'id': tid})
    return {'ok': True}


import re

CLOUDINARY_URL_RE = re.compile(r'^(https?://res\.cloudinary\.com/[^/]+/image/upload/)(.+)$')


def url_image_optimized(url: str) -> dict:
    """Prépare l'override d'un slot à partir d'une URL.
    Si l'URL est Cloudinary, injecte f_auto,q_auto + largeurs responsives (srcset)
    via les transformations d'URL — aucune image stockée localement."""
    m = CLOUDINARY_URL_RE.match(url)
    if m:
        base, rest = m.groups()
        def variant(w):
            return f'{base}f_auto,q_auto,w_{w}/{rest}'
        srcset = ', '.join(f'{variant(w)} {w}w' for w in (480, 960, 1600, 2400))
        return {'url': variant(1600), 'srcset': srcset, 'fallback': variant(1600), 'width': None, 'height': None}
    return {'url': url, 'srcset': None, 'fallback': url, 'width': None, 'height': None}


@api_router.put('/images/{slot_key}/url')
async def set_image_url(slot_key: str, payload: dict, admin: str = Depends(get_current_admin)):
    """Remplace l'image d'un emplacement par un lien (Cloudinary recommandé) — sans upload."""
    slot = next((s for s in IMAGE_SLOTS if s['slot_key'] == slot_key), None)
    if not slot:
        raise HTTPException(status_code=404, detail='Emplacement introuvable')
    url = str(payload.get('url') or '').strip()
    if not url.lower().startswith(('http://', 'https://')):
        raise HTTPException(status_code=400, detail='URL invalide — elle doit commencer par http(s)://')
    alt = str(payload.get('alt') or '').strip() or slot['default_alt']
    doc = {
        'slot_key': slot_key,
        'alt': alt,
        'source': 'url',
        'original_name': url.split('?')[0].split('/')[-1][:120],
        'optimized': url_image_optimized(url),
        'updated_at': datetime.now(timezone.utc),
    }
    await db.images.update_one({'slot_key': slot_key}, {'$set': doc}, upsert=True)
    return merge_slot(slot, doc)


# ---------------- Routes: blog ----------------
import re
import math
import unicodedata

BLOG_PAGE_SIZE = 9
BLOG_CATEGORIES = ['mariages', 'corporate', 'photobooth', 'formations', 'conseils', 'inspiration']


def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text or '').encode('ascii', 'ignore').decode('ascii')
    text = re.sub(r"[^a-zA-Z0-9]+", '-', text).strip('-').lower()
    return text or uuid.uuid4().hex[:8]


class BlogLocation(BaseModel):
    venue: str = ''
    city: str = ''
    postal_code: str = ''
    department: str = ''
    region: str = 'Hauts-de-France'
    country: str = 'France'


class BlogSeo(BaseModel):
    meta_title: str = ''
    meta_description: str = ''
    keyword: str = ''
    og_image: str = ''
    canonical: str = ''
    noindex: bool = False


class BlogPostIn(BaseModel):
    title: str
    slug: str = ''
    excerpt: str = ''
    category: str = 'mariages'
    cover: dict = Field(default_factory=lambda: {'url': '', 'alt': ''})
    date: str = ''
    author: str = 'Samuel Bocquillon'
    tags: List[str] = Field(default_factory=list)
    location: BlogLocation = Field(default_factory=BlogLocation)
    seo: BlogSeo = Field(default_factory=BlogSeo)
    blocks: List[dict] = Field(default_factory=list)
    status: str = 'draft'


async def ensure_blog_seed():
    count = await db.blog_posts.count_documents({})
    if count == 0:
        now = datetime.now(timezone.utc)
        for p in DEMO_POSTS:
            doc = dict(p)
            doc['created_at'] = now
            doc['updated_at'] = now
            doc['published_at'] = now
            await db.blog_posts.insert_one(doc)


def build_blog_query(category: Optional[str], lieu: Optional[str], q: Optional[str], status: str = 'published'):
    clauses = [{'status': status}]
    if category and category not in ('tous', ''):
        clauses.append({'category': category})
    if lieu and lieu not in ('tous', ''):
        rx = {'$regex': f'^{re.escape(lieu)}$', '$options': 'i'}
        clauses.append({'$or': [
            {'location.venue': rx}, {'location.city': rx},
            {'location.department': rx}, {'location.region': rx},
        ]})
    if q:
        rx = {'$regex': re.escape(q.strip()), '$options': 'i'}
        clauses.append({'$or': [
            {'title': rx}, {'excerpt': rx}, {'tags': rx}, {'category': rx},
            {'location.venue': rx}, {'location.city': rx}, {'location.department': rx}, {'location.region': rx},
            {'blocks.text': rx},
        ]})
    return {'$and': clauses} if len(clauses) > 1 else clauses[0]


def blog_card(doc: dict) -> dict:
    """Version allégée pour les listes (sans blocs)."""
    d = serialize_doc(doc)
    d.pop('blocks', None)
    return d


@api_router.get('/blog/posts')
async def blog_list(category: Optional[str] = None, lieu: Optional[str] = None, q: Optional[str] = None, page: int = 1, limit: int = BLOG_PAGE_SIZE):
    await ensure_blog_seed()
    limit = max(1, min(limit, 24))
    page = max(1, page)
    query = build_blog_query(category, lieu, q)
    total = await db.blog_posts.count_documents(query)
    docs = await db.blog_posts.find(query).sort([('date', -1), ('created_at', -1)]).skip((page - 1) * limit).to_list(limit)
    return {
        'posts': [blog_card(d) for d in docs],
        'total': total,
        'page': page,
        'pages': max(1, math.ceil(total / limit)),
        'categories': BLOG_CATEGORIES,
    }


@api_router.get('/blog/locations')
async def blog_locations():
    await ensure_blog_seed()
    docs = await db.blog_posts.find({'status': 'published'}).to_list(1000)
    venues, cities, departments = [], [], []
    for d in docs:
        loc = d.get('location') or {}
        if loc.get('venue') and loc['venue'] not in venues:
            venues.append(loc['venue'])
        if loc.get('city') and loc['city'] not in cities:
            cities.append(loc['city'])
        if loc.get('department') and loc['department'] not in departments:
            departments.append(loc['department'])
    return {'venues': sorted(venues), 'cities': sorted(cities), 'departments': sorted(departments)}


@api_router.get('/blog/sitemap')
async def blog_sitemap():
    await ensure_blog_seed()
    docs = await db.blog_posts.find({'status': 'published', 'seo.noindex': {'$ne': True}}).sort('date', -1).to_list(2000)
    total = await db.blog_posts.count_documents({'status': 'published'})
    return {
        'posts': [{'slug': d['slug'], 'updated_at': serialize_doc(d.get('updated_at')), 'date': d.get('date')} for d in docs],
        'pages': max(1, math.ceil(total / BLOG_PAGE_SIZE)),
    }


def score_related(post: dict, other: dict) -> int:
    score = 0
    pl, ol = post.get('location') or {}, other.get('location') or {}
    if pl.get('venue') and pl.get('venue') == ol.get('venue'):
        score += 8
    if pl.get('city') and pl.get('city') == ol.get('city'):
        score += 4
    if pl.get('region') and pl.get('region') == ol.get('region'):
        score += 2
    if post.get('category') == other.get('category'):
        score += 1
    return score


@api_router.get('/blog/posts/{slug}')
async def blog_detail(slug: str):
    await ensure_blog_seed()
    doc = await db.blog_posts.find_one({'slug': slug, 'status': 'published'})
    if not doc:
        raise HTTPException(status_code=404, detail='Article introuvable')
    others = await db.blog_posts.find({'status': 'published', 'slug': {'$ne': slug}}).sort([('date', -1)]).to_list(200)
    ranked = sorted(others, key=lambda o: -score_related(doc, o))  # tri stable : garde date desc à score égal
    related = ranked[:3]
    related_slugs = {r['slug'] for r in related}
    discover = [o for o in others if o['slug'] not in related_slugs][:3]
    return {
        'post': serialize_doc(doc),
        'related': [blog_card(r) for r in related],
        'discover': [blog_card(d) for d in discover],
    }


# ---- Admin blog ----
@api_router.get('/blog/admin/posts')
async def blog_admin_list(admin: str = Depends(get_current_admin)):
    await ensure_blog_seed()
    docs = await db.blog_posts.find().sort([('date', -1), ('created_at', -1)]).to_list(1000)
    return [blog_card(d) for d in docs]


@api_router.get('/blog/admin/posts/{pid}')
async def blog_admin_get(pid: str, admin: str = Depends(get_current_admin)):
    doc = await db.blog_posts.find_one({'id': pid})
    if not doc:
        raise HTTPException(status_code=404, detail='Article introuvable')
    return serialize_doc(doc)


async def unique_slug(base: str, exclude_id: Optional[str] = None) -> str:
    slug = slugify(base)
    candidate = slug
    i = 2
    while True:
        query = {'slug': candidate}
        if exclude_id:
            query['id'] = {'$ne': exclude_id}
        exists = await db.blog_posts.find_one(query)
        if not exists:
            return candidate
        candidate = f'{slug}-{i}'
        i += 1


@api_router.post('/blog/admin/posts')
async def blog_admin_create(payload: BlogPostIn, admin: str = Depends(get_current_admin)):
    doc = payload.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['slug'] = await unique_slug(doc['slug'] or doc['title'])
    if not doc['date']:
        doc['date'] = datetime.now(timezone.utc).strftime('%Y-%m-%d')
    now = datetime.now(timezone.utc)
    doc['created_at'] = now
    doc['updated_at'] = now
    doc['published_at'] = now if doc['status'] == 'published' else None
    await db.blog_posts.insert_one(dict(doc))
    return serialize_doc(doc)


@api_router.put('/blog/admin/posts/{pid}')
async def blog_admin_update(pid: str, payload: BlogPostIn, admin: str = Depends(get_current_admin)):
    existing = await db.blog_posts.find_one({'id': pid})
    if not existing:
        raise HTTPException(status_code=404, detail='Article introuvable')
    doc = payload.model_dump()
    doc['slug'] = await unique_slug(doc['slug'] or doc['title'], exclude_id=pid)
    doc['updated_at'] = datetime.now(timezone.utc)
    if doc['status'] == 'published' and not existing.get('published_at'):
        doc['published_at'] = datetime.now(timezone.utc)
    await db.blog_posts.update_one({'id': pid}, {'$set': doc})
    out = await db.blog_posts.find_one({'id': pid})
    return serialize_doc(out)


@api_router.put('/blog/admin/posts/{pid}/status')
async def blog_admin_status(pid: str, payload: dict, admin: str = Depends(get_current_admin)):
    status = payload.get('status')
    if status not in ('published', 'draft'):
        raise HTTPException(status_code=400, detail='Statut invalide')
    update = {'status': status, 'updated_at': datetime.now(timezone.utc)}
    if status == 'published':
        update['published_at'] = datetime.now(timezone.utc)
    res = await db.blog_posts.update_one({'id': pid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Article introuvable')
    return {'ok': True, 'status': status}


@api_router.post('/blog/admin/posts/{pid}/duplicate')
async def blog_admin_duplicate(pid: str, admin: str = Depends(get_current_admin)):
    doc = await db.blog_posts.find_one({'id': pid})
    if not doc:
        raise HTTPException(status_code=404, detail='Article introuvable')
    doc.pop('_id', None)
    doc['id'] = str(uuid.uuid4())
    doc['title'] = f"{doc.get('title', '')} (copie)"
    doc['slug'] = await unique_slug(f"{doc.get('slug', '')}-copie")
    doc['status'] = 'draft'
    doc['demo'] = False
    now = datetime.now(timezone.utc)
    doc['created_at'] = now
    doc['updated_at'] = now
    doc['published_at'] = None
    await db.blog_posts.insert_one(dict(doc))
    return serialize_doc(doc)


@api_router.delete('/blog/admin/posts/{pid}')
async def blog_admin_delete(pid: str, admin: str = Depends(get_current_admin)):
    await db.blog_posts.delete_one({'id': pid})
    return {'ok': True}


@api_router.post('/blog/upload')
async def blog_upload(file: UploadFile = File(...), alt: str = Form(''), admin: str = Depends(get_current_admin)):
    """Upload d'une image d'article — optimisation WebP identique aux slots."""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail='Le fichier doit être une image')
    raw = await file.read()
    if len(raw) > 40 * 1024 * 1024:
        raise HTTPException(status_code=400, detail='Image trop lourde (max 40 Mo)')
    try:
        result = optimize_image(raw, f'blog-{uuid.uuid4().hex[:8]}')
    except Exception as e:
        logger.error(f'Blog image optimization failed: {e}')
        raise HTTPException(status_code=400, detail="Format d'image non supporté")
    return {'url': result['url'], 'srcset': result['srcset'], 'fallback': result['fallback'], 'width': result['width'], 'height': result['height'], 'alt': alt}


# ---------------- Routes: admin dashboard (Phase A CMS) ----------------
STATIC_PAGES_REGISTRY = [
    {'title': 'Accueil', 'slug': '/', 'page_key': 'accueil'},
    {'title': 'À propos', 'slug': '/a-propos', 'page_key': 'a-propos'},
    {'title': 'Portfolio', 'slug': '/portfolio', 'page_key': 'portfolio'},
    {'title': 'Prestations', 'slug': '/prestations', 'page_key': 'prestations'},
    {'title': 'Mariage', 'slug': '/prestations/mariage', 'page_key': 'mariage'},
    {'title': 'Corporate', 'slug': '/prestations/corporate', 'page_key': 'corporate'},
    {'title': 'Photobooth', 'slug': '/prestations/photobooth', 'page_key': 'photobooth'},
    {'title': 'Formation', 'slug': '/prestations/formation', 'page_key': 'formation'},
    {'title': 'Blog', 'slug': '/blog', 'page_key': 'blog'},
    {'title': 'Contact', 'slug': '/contact', 'page_key': 'contact'},
    {'title': 'Avis clients', 'slug': '/avis', 'page_key': 'avis'},
    {'title': 'Photographe mariage Valenciennes', 'slug': '/photographe-mariage-valenciennes', 'page_key': 'ville-valenciennes'},
    {'title': 'Photographe mariage Lille', 'slug': '/photographe-mariage-lille', 'page_key': 'ville-lille'},
    {'title': 'Photographe mariage Douai', 'slug': '/photographe-mariage-douai', 'page_key': 'ville-douai'},
    {'title': 'Photographe mariage Cambrai', 'slug': '/photographe-mariage-cambrai', 'page_key': 'ville-cambrai'},
    {'title': 'Mentions légales', 'slug': '/mentions-legales', 'page_key': 'mentions-legales'},
    {'title': 'Politique de confidentialité', 'slug': '/politique-de-confidentialite', 'page_key': 'confidentialite'},
]

HOME_SECTIONS_SEED = [
    {'key': 'hero', 'name': 'Hero — Accroche principale', 'type': 'Image de fond'},
    {'key': 'a-propos', 'name': 'À propos', 'type': 'Texte + Image'},
    {'key': 'portfolio', 'name': 'Portfolio — Sélection', 'type': 'Galerie'},
    {'key': 'prestations', 'name': 'Prestations — Collections', 'type': 'Grille de services'},
    {'key': 'temoignages', 'name': 'Témoignages', 'type': 'Slider'},
    {'key': 'cta', 'name': 'Appel à l\'action', 'type': 'Texte + Bouton'},
    {'key': 'contact', 'name': 'Formulaire de contact', 'type': 'Formulaire'},
]


async def ensure_home_sections():
    count = await db.home_sections.count_documents({'page': 'accueil'})
    if count == 0:
        now = datetime.now(timezone.utc)
        for i, s in enumerate(HOME_SECTIONS_SEED):
            await db.home_sections.insert_one({
                'id': str(uuid.uuid4()), 'page': 'accueil', 'key': s['key'],
                'name': s['name'], 'type': s['type'], 'actif': True,
                'ordre': i, 'created_at': now, 'updated_at': now,
            })


def month_start() -> datetime:
    now = datetime.now(timezone.utc)
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


@api_router.get('/admin/stats')
async def admin_stats(admin: str = Depends(get_current_admin)):
    await ensure_blog_seed()
    ms = month_start()
    articles_published = await db.blog_posts.count_documents({'status': 'published'})
    articles_month = await db.blog_posts.count_documents({'status': 'published', 'published_at': {'$gte': ms}})
    demandes_total = await db.contacts.count_documents({})
    demandes_unread = await db.contacts.count_documents({'read': {'$ne': True}})
    uploads_total = await db.images.count_documents({})
    uploads_month = await db.images.count_documents({'updated_at': {'$gte': ms}})
    # Bibliothèque = slots du site + images d'articles uploadées
    blog_uploads = 0
    try:
        blog_uploads = len([f for f in os.listdir(UPLOAD_DIR) if f.startswith('blog-') and f.endswith('.webp') and '-2400' in f])
    except Exception:
        pass
    return {
        'articles_published': articles_published,
        'articles_month': articles_month,
        'pages_active': len(STATIC_PAGES_REGISTRY),
        'pages_up_to_date': True,
        'demandes_total': demandes_total,
        'demandes_unread': demandes_unread,
        'images_total': len(IMAGE_SLOTS) + uploads_total + blog_uploads,
        'images_month': uploads_month,
    }


@api_router.get('/admin/pages')
async def admin_pages(admin: str = Depends(get_current_admin)):
    return {'pages': STATIC_PAGES_REGISTRY}


@api_router.get('/admin/sections')
async def admin_sections(admin: str = Depends(get_current_admin)):
    await ensure_home_sections()
    docs = await db.home_sections.find({'page': 'accueil'}).sort('ordre', 1).to_list(50)
    return [serialize_doc(d) for d in docs]


@api_router.put('/admin/sections/order')
async def admin_sections_order(payload: dict, admin: str = Depends(get_current_admin)):
    ids = payload.get('ids') or []
    for i, sid in enumerate(ids):
        await db.home_sections.update_one({'id': sid}, {'$set': {'ordre': i, 'updated_at': datetime.now(timezone.utc)}})
    return {'ok': True}


@api_router.put('/admin/sections/{sid}')
async def admin_section_update(sid: str, payload: dict, admin: str = Depends(get_current_admin)):
    update = {k: v for k, v in payload.items() if k in ('actif', 'name', 'type')}
    update['updated_at'] = datetime.now(timezone.utc)
    res = await db.home_sections.update_one({'id': sid}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Section introuvable')
    doc = await db.home_sections.find_one({'id': sid})
    return serialize_doc(doc)


PIPELINE_STATUSES = ['nouvelle', 'a_traiter', 'confirmee', 'payee', 'terminee', 'annulee']


@api_router.put('/contacts/{contact_id}/pipeline')
async def contact_pipeline(contact_id: str, payload: dict, admin: str = Depends(get_current_admin)):
    status = payload.get('status')
    if status not in PIPELINE_STATUSES:
        raise HTTPException(status_code=400, detail='Statut invalide')
    update = {'pipeline_status': status, 'updated_at': datetime.now(timezone.utc)}
    if 'note' in payload:
        update['pipeline_note'] = str(payload.get('note') or '')
    if 'amount' in payload:
        update['pipeline_amount'] = str(payload.get('amount') or '')
    res = await db.contacts.update_one({'id': contact_id}, {'$set': update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail='Demande introuvable')
    doc = await db.contacts.find_one({'id': contact_id})
    return serialize_doc(doc)


@api_router.get('/admin/media/recent')
async def admin_media_recent(limit: int = 6, admin: str = Depends(get_current_admin)):
    docs = await db.images.find().sort('updated_at', -1).to_list(limit)
    out = []
    for d in docs:
        opt = d.get('optimized') or {}
        if opt.get('url'):
            out.append({'url': opt['url'], 'alt': d.get('alt') or '', 'slot_key': d.get('slot_key')})
    if len(out) < limit:
        for s in IMAGE_SLOTS:
            if len(out) >= limit:
                break
            out.append({'url': s['default_url'], 'alt': s['default_alt'], 'slot_key': s['slot_key']})
    return out[:limit]


# ---------------- Mount ----------------
app.include_router(api_router)
app.mount('/api/uploads', StaticFiles(directory=str(UPLOAD_DIR)), name='uploads')

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=['*'],
    allow_headers=['*'],
)


@app.on_event('shutdown')
async def shutdown_db_client():
    client.close()
