import { getImages, getSettings, getBlogPosts, getBlogLocations } from '@/lib/api';
import { SITE_URL } from '@/lib/content';
import { SmartImage } from '../SmartImage';
import { BlogExplorer } from './BlogExplorer';
import { BlogPreFooter } from './BlogPreFooter';

export async function loadBlogListing(page = 1, category = 'tous') {
  const [images, settings, data, locations] = await Promise.all([
    getImages(),
    getSettings(),
    getBlogPosts({ page, category }),
    getBlogLocations(),
  ]);
  return { images, settings, data, locations, page, category };
}

function blogJsonLd(data) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE_URL}/blog#blog`,
    name: 'Blog — Samuel Bocquillon, photographe de mariage',
    description:
      "Les plus beaux mariages, événements et lieux immortalisés par Samuel Bocquillon dans le Nord, le Pas-de-Calais et les Hauts-de-France.",
    url: `${SITE_URL}/blog`,
    author: { '@type': 'Person', name: 'Samuel Bocquillon' },
    blogPost: (data.posts || []).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
      image: p.cover && p.cover.url,
    })),
  };
}

// Page listing Blog — hero maquette + filtres + grille + pagination + pré-footer
export function BlogListing({ images, settings, data, locations, page, category }) {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd(data)) }} />

      {/* ============ HERO — label + titre + texte à gauche, photo à droite ============ */}
      <section className="relative bg-ivoire overflow-hidden" data-testid="blog-hero">
        <div className="sb-container">
          <div className="lg:w-[52%] py-14 sm:py-16 lg:py-24 lg:pr-12">
            <p className="label-caps !text-[10.5px] text-charbon/55 flex items-center gap-3">
              Blog <span className="h-px w-10 bg-cognac inline-block" aria-hidden="true" />
            </p>
            <h1 className="font-serif font-medium text-5xl sm:text-6xl lg:text-[62px] leading-[1.06] tracking-[-0.01em] text-charbon mt-5">
              Histoires vraies,
              <br />
              émotions immortelles.
            </h1>
            <p className="mt-6 text-[14.5px] leading-[1.85] text-charbon/75 max-w-md">
              Découvrez les plus beaux mariages, événements et lieux que j'ai la chance d'immortaliser.
              <br className="hidden sm:block" />
              Chaque histoire est unique, chaque lieu raconte quelque chose.
            </p>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-[44%]">
          <SmartImage
            img={images['blog-hero']}
            eager
            className="h-64 sm:h-80 lg:h-full w-full object-cover"
            sizes="(max-width: 1024px) 100vw, 44vw"
          />
        </div>
      </section>

      {/* ============ FILTRES + GRILLE + PAGINATION ============ */}
      <section className="bg-white" data-testid="blog-explorer-section">
        <div className="sb-container pt-10 sm:pt-12 pb-14 sm:pb-20">
          <BlogExplorer
            key={`p${page}-${category}`}
            initialData={data}
            locations={locations}
            initialCategory={category}
            initialPage={page}
          />
        </div>
      </section>

      {/* ============ PRÉ-FOOTER ÉDITORIAL ============ */}
      <BlogPreFooter settings={settings} images={images} />
    </main>
  );
}
