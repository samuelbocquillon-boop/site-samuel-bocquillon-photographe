"""POC test — core workflows: auth JWT, image upload + Pillow optimization (WebP/srcset), alt edit, contact + email flag, settings."""
import requests, io, sys
from PIL import Image

BASE = 'http://localhost:8001/api'
results = []

def check(name, cond, detail=''):
    results.append((name, cond, detail))
    print(('PASS' if cond else 'FAIL') + f' — {name} {detail}')

# 1. Auth
r = requests.post(f'{BASE}/auth/login', json={'username': 'admin', 'password': 'wrong'})
check('Login rejects bad password', r.status_code == 401)
r = requests.post(f'{BASE}/auth/login', json={'username': 'admin', 'password': 'SamuelB2025!'})
check('Login success', r.status_code == 200, str(r.status_code))
token = r.json().get('access_token', '')
H = {'Authorization': f'Bearer {token}'}
r = requests.get(f'{BASE}/auth/me', headers=H)
check('Auth /me works', r.status_code == 200)

# 2. Image upload — generate a big raw test image (3000x2000 JPEG)
img = Image.new('RGB', (3000, 2000))
for x in range(0, 3000, 100):
    for y in range(0, 2000, 100):
        img.paste(Image.new('RGB', (50, 50), ((x*7) % 255, (y*3) % 255, 120)), (x, y))
buf = io.BytesIO()
img.save(buf, 'JPEG', quality=95)
raw = buf.getvalue()
print(f'Test image size: {len(raw)/1024:.0f} KB')

r = requests.post(f'{BASE}/images/upload',
                  data={'slot_key': 'poc-test-slot', 'alt': 'Photo de test mariage'},
                  files={'file': ('test.jpg', raw, 'image/jpeg')}, headers=H)
check('Upload with auth', r.status_code == 200, str(r.status_code))
doc = r.json()
opt = doc.get('optimized', {})
variants = opt.get('variants', [])
check('Multiple sizes generated (srcset)', len(variants) >= 3, f'{len(variants)} variants: {[v["width"] for v in variants]}')
check('WebP format', all(v['url'].endswith('.webp') for v in variants))
check('JPEG fallback present', opt.get('fallback', '').endswith('.jpg'))
check('Compression effective', variants[-1]['bytes'] < len(raw), f"{variants[-1]['bytes']/1024:.0f}KB vs {len(raw)/1024:.0f}KB original")
check('srcset string built', ' 480w' in opt.get('srcset', ''))

# Verify file is served
r = requests.get('http://localhost:8001' + variants[0]['url'])
check('Optimized image served', r.status_code == 200 and r.headers.get('content-type') == 'image/webp')

# Upload without auth must fail
r = requests.post(f'{BASE}/images/upload', data={'slot_key': 'x'}, files={'file': ('t.jpg', raw, 'image/jpeg')})
check('Upload without auth rejected', r.status_code in (401, 403))

# 3. Alt update + public read
r = requests.put(f'{BASE}/images/poc-test-slot/alt', json={'alt': 'Nouveau texte alternatif'}, headers=H)
check('Alt update', r.status_code == 200)
r = requests.get(f'{BASE}/images/poc-test-slot')
check('Public image read w/ alt', r.status_code == 200 and r.json()['alt'] == 'Nouveau texte alternatif')

# 4. Contact
r = requests.post(f'{BASE}/contact', json={
    'name': 'Clara Test', 'email': 'clara@test.fr', 'phone': '0612345678',
    'wedding_date': '2026-06-20', 'wedding_location': 'Lille', 'message': 'Bonjour, nous aimerions un devis.'})
check('Contact submission', r.status_code == 200 and r.json()['ok'])
check('Email feature-flag off (no SMTP creds)', r.json().get('emailed') is False)
r = requests.get(f'{BASE}/contacts', headers=H)
check('Admin reads contacts', r.status_code == 200 and any(c['name'] == 'Clara Test' for c in r.json()))

# 5. Settings
r = requests.get(f'{BASE}/settings')
check('Settings public read', r.status_code == 200 and r.json()['city'] == 'Valenciennes')

# Cleanup
requests.delete(f'{BASE}/images/poc-test-slot', headers=H)

failed = [n for n, c, d in results if not c]
print(f'\n{"="*50}\n{len(results)-len(failed)}/{len(results)} PASSED')
if failed:
    print('FAILED:', failed); sys.exit(1)
print('POC CORE: ALL PASSED')
