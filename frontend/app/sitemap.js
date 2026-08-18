import { SITE_URL } from '@/lib/content';

export default function sitemap() {
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
    { path: '/contact', priority: 0.9, freq: 'monthly' },
    { path: '/avis', priority: 0.8, freq: 'weekly' },
    { path: '/photographe-mariage-valenciennes', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-lille', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-douai', priority: 0.8, freq: 'monthly' },
    { path: '/photographe-mariage-cambrai', priority: 0.8, freq: 'monthly' },
    { path: '/politique-de-confidentialite', priority: 0.3, freq: 'yearly' },
    { path: '/mentions-legales', priority: 0.3, freq: 'yearly' },
  ];
  return routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));
}
