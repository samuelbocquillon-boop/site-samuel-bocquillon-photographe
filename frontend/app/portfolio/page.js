import Link from 'next/link';
import { getImages, getTestimonials, getGallery } from '@/lib/api';
import { SITE_URL } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { UnifiedGallery } from '@/components/gallery/UnifiedGallery';

export const metadata = {
  title: { absolute: 'Galerie photographe de mariage Nord-Pas-de-Calais | Samuel Bocquillon' },
  description:
    'Découvrez la galerie de Samuel Bocquillon, photographe de mariage dans le Nord-Pas-de-Calais. Reportages de mariage authentiques en France et à l\'étranger.',
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const [images, testimonials, gallery] = await Promise.all([getImages(), getTestimonials(), getGallery()]);
  const mariageQuotes = testimonials.filter((t) => t.category === 'mariage');
  // « Ses photos sont tout simplement sublimes… » (Marie & Thomas) en premier, comme la maquette
  const ordered = [...mariageQuotes.filter((t) => t.author.includes('Marie')), ...mariageQuotes.filter((t) => !t.author.includes('Marie'))];

  const galleryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Galerie photographe de mariage — Nord-Pas-de-Calais, France et ailleurs',
    url: `${SITE_URL}/portfolio`,
    description:
      'Sélection des plus belles images de mariage de Samuel Bocquillon, photographe dans le Nord-Pas-de-Calais, en France et à l\'étranger.',
    image: gallery.map((p) => ({
      '@type': 'ImageObject',
      contentUrl: p.full,
      caption: p.alt,
    })),
  };

  return (
    <main>
      {/* ============ HERO — titre à gauche, photo à droite fondue vers l'ivoire ============ */}
      <section className="relative min-h-[62svh] lg:min-h-[70svh] overflow-hidden" data-testid="portfolio-hero">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[80%] lg:w-[70%]">
          <SmartImage img={images['portfolio-hero']} eager className="h-full w-full object-cover" sizes="70vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivoire via-ivoire/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ivoire to-transparent" />
        </div>
        <div className="relative sb-container flex min-h-[62svh] lg:min-h-[70svh] items-center">
          <div className="max-w-lg py-24">
            <p className="font-serif font-medium text-6xl sm:text-7xl lg:text-[88px] leading-[0.98] tracking-[-0.02em] text-charbon">Portfolio</p>
            <span className="block h-[2px] w-10 bg-cognac mt-5" aria-hidden="true" />
            <p className="mt-6 text-[15px] sm:text-[15.5px] leading-[1.8] text-charbon/80 max-w-xs">
              Des histoires vraies, des émotions brutes,
              <br className="hidden sm:block" /> des images qui traversent le temps.
              <br className="hidden sm:block" /> Découvrez une sélection de reportages
              <br className="hidden sm:block" /> de mariage à travers la France et ailleurs.
            </p>
            <Link href="/contact" className="btn-primary !rounded-none mt-8" data-testid="portfolio-hero-cta-button">
              Réserver une date <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GALERIE UNIFIÉE + DIAPORAMA ============ */}
      <section className="pt-8 sm:pt-10 pb-14 sm:pb-20" data-testid="portfolio-gallery-section">
        <div className="sb-container" id="galerie">
          {/* Bloc SEO — un seul H1 sur la page */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-serif text-3xl sm:text-4xl leading-[1.15] text-charbon" data-testid="gallery-seo-title">
              Galerie photographe de mariage — Nord-Pas-de-Calais, France et ailleurs
            </h1>
            <p className="mt-4 text-[15px] leading-[1.7] text-charbon/75" data-testid="gallery-seo-intro">
              Une sélection de mes plus belles images de mariage, réalisées dans le Nord-Pas-de-Calais, partout en
              France et à l'étranger. Cliquez sur une photo pour lancer le diaporama.
            </p>
          </div>
          <div className="mt-10 sm:mt-12">
            <UnifiedGallery photos={gallery} />
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }} />
      </section>

      {/* ============ LE BLOG — photo | texte | carte citation ============ */}
      <section className="bg-white py-14 sm:py-20" data-testid="portfolio-featured-case-study">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <Reveal className="lg:col-span-4">
            <SmartImage
              img={images['portfolio-une']}
              className="w-full aspect-[4/5] object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </Reveal>
          <Reveal delay={0.08} className="lg:col-span-4">
            <p className="label-caps !text-[10.5px] text-charbon/55 flex items-center gap-3">
              Le blog <span className="h-px w-7 bg-cognac inline-block" aria-hidden="true" />
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.08] mt-5">Carnet de mariages</h2>
            <p className="font-serif text-cognac text-2xl sm:text-[27px] mt-1.5">Du Nord-Pas-de-Calais aux quatre coins de la France</p>
            <p className="mt-6 text-[14.5px] leading-[1.85] text-charbon/75 max-w-xs">
              Chaque couple a son histoire, chaque lieu sa lumière. Feuilletez sur le blog les mariages que j'ai eu
              le bonheur de photographier dans les Hauts-de-France, partout en France et parfois même au-delà des
              frontières. De quoi vous inspirer pour imaginer le vôtre.
            </p>
            <Link href="/blog" className="btn-primary !rounded-none mt-8" data-testid="portfolio-case-study-cta">
              Ouvrir le carnet <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.15} className="lg:col-span-4">
            <div className="bg-ivoire px-8 sm:px-10 py-12 sm:py-14" data-testid="portfolio-quote-card">
              <span className="font-serif text-cognac text-6xl leading-none select-none" aria-hidden="true">“</span>
              <p className="font-serif text-[21px] sm:text-[23px] leading-[1.45] text-charbon mt-1">
                Chaque mariage est unique. Mon rôle est d'en raconter l'essence avec sincérité et discrétion.
              </p>
              <img src="/signature-samuel-b.webp" alt="Signature de Samuel B." className="h-10 w-auto opacity-85 mt-7" loading="lazy" decoding="async" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ BANDE TÉMOIGNAGE — photo de fond, voile ivoire au centre ============ */}
      <section className="relative py-16 sm:py-20" data-testid="portfolio-testimonials">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={images['portfolio-temoignage-fond']} className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-ivoire/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivoire/10 via-ivoire to-ivoire/10" />
        </div>
        <div className="relative sb-container">
          <TestimonialCarousel testimonials={ordered} accent={false} framedAuthor />
        </div>
      </section>

      {/* ============ CTA FINAL — fond ivoire + appareil photo ============ */}
      <section className="sb-section" data-testid="portfolio-cta">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-7">
            <p className="label-caps text-cognac">Prêts à écrire votre histoire ?</p>
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-[54px] leading-[1.1] mt-4">
              Créons ensemble des souvenirs
              <br className="hidden sm:block" /> qui vous ressemblent.
            </h2>
            <p className="mt-5 text-[15px] leading-[1.7] text-charbon/75">
              Je serais honoré de raconter votre journée avec sensibilité et authenticité.
            </p>
            <Link href="/contact" className="btn-primary !rounded-none mt-8" data-testid="portfolio-cta-button">
              Réserver une date <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <SmartImage
              img={images['portfolio-cta-camera']}
              className="w-full aspect-[4/3] object-cover mix-blend-multiply"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
