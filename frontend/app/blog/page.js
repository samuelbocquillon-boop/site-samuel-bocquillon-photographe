import { BlogListing, loadBlogListing } from '@/components/blog/BlogListing';
import { BLOG_CATEGORIES } from '@/lib/blog';

export const metadata = {
  title: 'Blog — Histoires vraies, émotions immortelles',
  description:
    "Découvrez les plus beaux mariages, événements et lieux immortalisés par Samuel Bocquillon : châteaux, domaines et salles de réception du Nord, du Pas-de-Calais et des Hauts-de-France.",
  alternates: { canonical: '/blog' },
};

export default async function BlogPage({ searchParams }) {
  const sp = (await searchParams) || {};
  const requested = typeof sp.categorie === 'string' ? sp.categorie : 'tous';
  const category = BLOG_CATEGORIES.some((c) => c.id === requested) ? requested : 'tous';
  const props = await loadBlogListing(1, category);
  return <BlogListing {...props} />;
}
