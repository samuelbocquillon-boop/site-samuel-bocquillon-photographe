import { redirect, notFound } from 'next/navigation';
import { BlogListing, loadBlogListing } from '@/components/blog/BlogListing';

export async function generateMetadata({ params }) {
  const { num } = await params;
  return {
    title: `Blog — Page ${num}`,
    description: `Reportages de mariage et articles de Samuel Bocquillon — page ${num}. Châteaux, domaines et lieux de réception des Hauts-de-France.`,
    alternates: { canonical: `/blog/page/${num}` },
  };
}

export default async function BlogPagedPage({ params }) {
  const { num } = await params;
  const page = parseInt(num, 10);
  if (!Number.isFinite(page) || page < 1 || String(page) !== num) notFound();
  if (page === 1) redirect('/blog');
  const props = await loadBlogListing(page, 'tous');
  if (page > (props.data.pages || 1)) notFound();
  return <BlogListing {...props} />;
}
