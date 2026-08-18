import { SITE_URL } from '@/lib/content';

const INTERNAL_API = 'http://localhost:8001/api';

export default async function sitemap() {
  const now = new Date();
  const routes = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/a-propos', priority: 0.8, freq: 'monthly' },
    { path: '/portfolio', priority: 0.9, freq: 'weekly' },
    { path: '/prestations', priority: 0.9, freq: 'monthly' },
    { path: '/prestations/mariage', priority: 0.9, freq: 'monthly' },
    { path: '/prestations/corporate', priority: 0.7, freq: 'monthly' },
    { path: '/prestations/photobooth', priority: 0.7, freq: 'monthly' },
    { path: '/prestations/formation', priority: 0.7, freq: 'monthly' },
    { path: '/blog', priority: 0.9, freq: 'weekly' },
    { path: '/contact', priority: 0.9, freq: 'monthly' },
    { path: '/avis', priority: 0.8, freq: 'weekly' },
    { path: '/photographe-mariage-valenciennes', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-lille', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-douai', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-cambrai', priority: 0.8, freq: 'monthly' },
    { path: '/politique-de-confidentialite', priority: 0.3, freq: 'yearly' },
    { path: '/mentions-legales', priority: 0.3, freq: 'yearly' },
  ];

  // Articles de blog publiés + pages de pagination — ajoutés automatiquement
  let blogEntries = [];
  try {
    const res = await fetch(`${INTERNAL_API}/blog/sitemap`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const paginated = Array.from({ length: Math.max(0, (data.pages || 1) - 1) }, (_, i) => ({
        url: `${SITE_URL}/blog/page/${i + 2}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.5,
      }));
      const posts = (data.posts || []).map((p) => ({
        url: `${SITE_URL}/blog/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      }));
      blogEntries = [...paginated, ...posts];
    }
  } catch (e) {
    // backend indisponible — sitemap statique uniquement
  }

  return [
    ...routes.map((r) => ({
      url: `${SITE_URL}${r.path}`,
      lastModified: now,
      changeFrequency: r.freq,
      priority: r.priority,
    })),
    ...blogEntries,
  ];
}
