import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getImages, getSettings } from '@/lib/api';
import { SITE_URL } from '@/lib/content';
import { categoryLabel, CATEGORY_CARD_LABEL, heroLocation, formatDateFr, cardLocation } from '@/lib/blog';
import { BlockRenderer } from '@/components/blog/BlockRenderer';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogPreFooter } from '@/components/blog/BlogPreFooter';
import { CTASection } from '@/components/CTASection';
import { Reveal } from '@/components/Reveal';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await getBlogPost(slug);
  if (!data || !data.post) return { title: 'Article introuvable' };
  const p = data.post;
  const seo = p.seo || {};
  const title = seo.meta_title || `${p.title}${p.location && p.location.city ? ` à ${p.location.city}` : ''}`;
  const description = seo.meta_description || p.excerpt;
  return {
    title,
    description,
    alternates: { canonical: seo.canonical || `/blog/${p.slug}` },
    ...(seo.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'fr_FR',
      images: [seo.og_image || (p.cover && p.cover.url)].filter(Boolean),
    },
  };
}

function blogPostingJsonLd(p) {
  const loc = p.location || {};
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: p.title,
    image: [p.cover && p.cover.url].filter(Boolean),
    author: { '@type': 'Person', name: p.author || 'Samuel Bocquillon', url: `${SITE_URL}/a-propos` },
    publisher: { '@id': `${SITE_URL}/#business` },
    datePublished: p.date,
    dateModified: (p.updated_at || '').slice(0, 10) || p.date,
    description: (p.seo && p.seo.meta_description) || p.excerpt,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${p.slug}` },
    ...(loc.city || loc.venue
      ? {
          contentLocation: {
            '@type': 'Place',
            name: loc.venue || loc.city,
            address: {
              '@type': 'PostalAddress',
              addressLocality: loc.city,
              postalCode: loc.postal_code,
              addressRegion: loc.region,
              addressCountry: 'FR',
            },
          },
        }
      : {}),
  };
}

function breadcrumbJsonLd(p) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: categoryLabel(p.category), item: `${SITE_URL}/blog?categorie=${p.category}` },
      { '@type': 'ListItem', position: 4, name: p.title, item: `${SITE_URL}/blog/${p.slug}` },
    ],
  };
}

export default async function BlogArticlePage({ params }) {
  const { slug } = await params;
  const [data, images, settings] = await Promise.all([getBlogPost(slug), getImages(), getSettings()]);
  if (!data || !data.post) notFound();
  const post = data.post;
  const location = heroLocation(post);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd(post)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(post)) }} />

      {/* ============ FIL D'ARIANE ============ */}
      <nav className="sb-container pt-7" aria-label="Fil d'Ariane" data-testid="article-breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-charbon/50">
          <li><Link href="/" className="hover:text-cuir transition-colors">Accueil</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href="/blog" className="hover:text-cuir transition-colors">Blog</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href={`/blog?categorie=${post.category}`} className="hover:text-cuir transition-colors">{categoryLabel(post.category)}</Link></li>
          <li aria-hidden="true">›</li>
          <li className="text-charbon/75" aria-current="page">{post.title}</li>
        </ol>
      </nav>

      {/* ============ HERO ARTICLE ============ */}
      <header className="sb-container text-center pt-10 sm:pt-12 pb-10" data-testid="article-hero">
        <p className="label-caps !text-[10.5px] !tracking-[0.26em] text-cognac">{CATEGORY_CARD_LABEL[post.category] || post.category}</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl lg:text-[58px] leading-[1.08] tracking-[-0.01em] text-charbon mt-4 max-w-3xl mx-auto" data-testid="article-title">
          {post.title}
        </h1>
        {location && (
          <p className="label-caps !text-[11px] text-charbon/55 mt-5" data-testid="article-location">{location}</p>
        )}
        <p className="text-[12px] text-charbon/40 mt-3">
          {formatDateFr(post.date)} · {post.author || 'Samuel Bocquillon'}
        </p>
      </header>
      <div className="sb-container" data-testid="article-cover">
        <img
          src={post.cover && post.cover.url}
          alt={(post.cover && post.cover.alt) || post.title}
          loading="eager"
          decoding="sync"
          className="w-full aspect-[16/9] sm:aspect-[21/10] object-cover"
        />
      </div>

      {/* ============ CONTENU ÉDITORIAL ============ */}
      <article className="sb-container py-12 sm:py-16" data-testid="article-content">
        <BlockRenderer blocks={post.blocks || []} />
      </article>

      {/* ============ CTA LOCAL SEO ============ */}
      <section className="bg-ivoire" data-testid="article-local-cta">
        <div className="sb-container py-14 sm:py-16 text-center">
          <p className="label-caps text-cognac">Et vous ?</p>
          <h2 className="font-serif font-medium text-3xl sm:text-4xl lg:text-[42px] leading-[1.15] mt-4 max-w-2xl mx-auto">
            Vous recherchez un photographe de mariage à Valenciennes ?
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.8] text-charbon/70 max-w-xl mx-auto">
            Basé à Valenciennes, j'interviens dans tout le Nord, le Pas-de-Calais et les Hauts-de-France —
            et partout où votre histoire me mène.
          </p>
          <Link href="/contact" className="btn-primary !rounded-none mt-8" data-testid="article-local-cta-button">
            Parlons de votre mariage <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ============ VOUS AIMEREZ ÉGALEMENT ============ */}
      {data.related && data.related.length > 0 && (
        <section className="bg-white" data-testid="article-related">
          <div className="sb-container py-14 sm:py-16">
            <Reveal>
              <p className="label-caps !text-[10.5px] text-charbon/55 flex items-center gap-3">
                Pour continuer la lecture <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
              </p>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl mt-4">Vous aimerez également</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-9">
              {data.related.map((p) => (
                <BlogCard key={p.id || p.slug} post={p} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ D'AUTRES HISTOIRES À DÉCOUVRIR ============ */}
      {data.discover && data.discover.length > 0 && (
        <section className="bg-ivoire" data-testid="article-discover">
          <div className="sb-container py-14 sm:py-16">
            <Reveal>
              <h2 className="font-serif font-medium text-3xl sm:text-4xl text-center">D'autres histoires à découvrir</h2>
            </Reveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mt-10">
              {data.discover.map((p) => (
                <Link key={p.id || p.slug} href={`/blog/${p.slug}`} className="group block" data-testid={`article-discover-${p.slug}`}>
                  <div className="overflow-hidden">
                    <img
                      src={p.cover && p.cover.url}
                      alt={(p.cover && p.cover.alt) || p.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <h3 className="font-serif font-medium text-[22px] leading-[1.2] mt-5 group-hover:text-cuir transition-colors duration-200">{p.title}</h3>
                  {cardLocation(p) && <p className="text-[13px] text-charbon/60 mt-1">{cardLocation(p)}</p>}
                </Link>
              ))}
            </div>
            {/* Maillage interne discret */}
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[12px] text-charbon/50 mt-12" data-testid="article-internal-links">
              Voir aussi :
              <Link href="/prestations/mariage" className="underline underline-offset-4 decoration-charbon/20 hover:text-cuir hover:decoration-cuir transition-colors">Photographe de mariage</Link>
              <Link href="/portfolio" className="underline underline-offset-4 decoration-charbon/20 hover:text-cuir hover:decoration-cuir transition-colors">Portfolio</Link>
              <Link href="/prestations" className="underline underline-offset-4 decoration-charbon/20 hover:text-cuir hover:decoration-cuir transition-colors">Prestations</Link>
              <Link href="/contact" className="underline underline-offset-4 decoration-charbon/20 hover:text-cuir hover:decoration-cuir transition-colors">Contact</Link>
            </p>
          </div>
        </section>
      )}

      {/* ============ CTA BANDEAU PHOTO ============ */}
      <CTASection
        img={{ url: post.cover && post.cover.url, alt: (post.cover && post.cover.alt) || post.title }}
        title="Votre histoire mérite elle aussi d'être racontée."
        text="Parlez-moi de votre mariage et imaginons ensemble les souvenirs que vous transmettrez."
        ctaLabel="Me contacter"
        ctaHref="/contact"
        testid="article-final-cta"
      />

      {/* ============ PRÉ-FOOTER ÉDITORIAL ============ */}
      <BlogPreFooter settings={settings} images={images} />
    </main>
  );
}
