// Utilitaires Blog — catégories, formats de dates et localisation SEO

export const BLOG_CATEGORIES = [
  { id: 'tous', label: 'Toutes les catégories' },
  { id: 'mariages', label: 'Mariages' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'photobooth', label: 'Photobooth' },
  { id: 'formations', label: 'Formations' },
  { id: 'conseils', label: 'Conseils' },
  { id: 'inspiration', label: 'Inspiration' },
];

// Libellé affiché sur les cartes article (petites capitales cognac)
export const CATEGORY_CARD_LABEL = {
  mariages: 'Mariage',
  corporate: 'Corporate',
  photobooth: 'Photobooth',
  formations: 'Formation',
  conseils: 'Conseils',
  inspiration: 'Inspiration',
};

export const categoryLabel = (id) => (BLOG_CATEGORIES.find((c) => c.id === id) || {}).label || id;

export function formatDateFr(iso) {
  if (!iso) return '';
  try {
    const d = new Date(`${iso}T12:00:00`);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      .format(d)
      .toUpperCase()
      .replace(/\u202f|\u00a0/g, ' ');
  } catch {
    return iso;
  }
}

export function deptNumber(loc) {
  const m = ((loc && loc.department) || '').match(/\d+/);
  if (m) return m[0];
  return ((loc && loc.postal_code) || '').slice(0, 2);
}

// « Aubry-du-Hainaut (59) » — carte article
export function cardLocation(post) {
  const loc = (post && post.location) || {};
  if (!loc.city) return '';
  const n = deptNumber(loc);
  return n ? `${loc.city} (${n})` : loc.city;
}

// « Aubry-du-Hainaut — Nord » — hero article
export function heroLocation(post) {
  const loc = (post && post.location) || {};
  const dept = (loc.department || '').split('–')[0].trim();
  return [loc.city, dept].filter(Boolean).join(' — ');
}
