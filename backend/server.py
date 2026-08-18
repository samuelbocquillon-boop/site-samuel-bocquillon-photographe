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
