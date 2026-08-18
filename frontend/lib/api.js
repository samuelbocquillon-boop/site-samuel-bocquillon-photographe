// API helpers — server (SSR) + client
export const INTERNAL_API = 'http://localhost:8001/api';
export const PUBLIC_API = '/api'; // same-origin — ingress routes /api to backend

async function ssrFetch(path) {
  try {
    const res = await fetch(`${INTERNAL_API}${path}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export async function getSettings() {
  const s = await ssrFetch('/settings');
  return (
    s || {
      business_name: 'Samuel Bocquillon — Photographe de mariage',
      city: 'Valenciennes',
      region: 'Hauts-de-France',
      address: 'Valenciennes, Nord (59), France',
      postal_code: '59300',
      country: 'FR',
      phone: '+33 6 12 34 56 78',
      email: 'contact@samuelbocquillon.fr',
      instagram: '#',
      facebook: '#',
      pinterest: '',
      ga_id: '',
      latitude: 50.3579,
      longitude: 3.5235,
      response_delay: 'Réponse sous 24h garantie',
    }
  );
}

export async function getImages() {
  const data = await ssrFetch('/images');
  const map = {};
  if (data && data.slots) {
    for (const s of data.slots) map[s.slot_key] = s;
  }
  return map;
}

export async function getTestimonials() {
  const t = await ssrFetch('/testimonials');
  return t || [];
}
