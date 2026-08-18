import Link from 'next/link';
import { getImages, getTestimonials } from '@/lib/api';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { PortfolioGallery } from '@/components/PortfolioGallery';

export const metadata = {
  title: 'Portfolio — Reportages de mariage authentiques',
  description:
    "Portfolio de Samuel Bocquillon, photographe de mariage : reportages en France et à l'étranger, petits comités et élopements. Des histoires vraies, des émotions brutes, des images qui traversent le temps.",
  alternates: { canonical: '/portfolio' },
};

export default async function PortfolioPage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const quotes = testimonials.filter((t) => t.category === 'mariage').slice(0, 2);

  return (
    <main>
      <PageHero
        img={images['portfolio-hero']}
        label="Portfolio"
        title="Des émotions brutes."
        subtitle="Des histoires vraies, des images qui traversent le temps. Découvrez une sélection de reportages de mariage à travers la France et ailleurs."
        testid="portfolio-hero"
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="portfolio-hero-cta-button">
          Réserver une date
        </Link>
      </PageHero>

      {/* Galerie filtrable */}
      <section className="sb-section" data-testid="portfolio-gallery-section">
        <div className="sb-container">
          <PortfolioGallery images={images} />
        </div>
      </section>

      {/* REPORTAGE À LA UNE — étude de cas (élément 5 du cahier des charges) */}
      <section className="bg-white py-14 sm:py-20 lg:py-24" data-testid="portfolio-featured-case-study">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Reportage à la une — étude de cas</p>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mt-8 items-center">
            <Reveal className="lg:col-span-7">
              <SmartImage img={images['portfolio-une']} className="w-full aspect-[3/2] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 1024px) 100vw, 58vw" />
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-5">
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05]">
                Clara & Julien
                <span className="block italic text-cognac text-3xl sm:text-4xl mt-2">Un mariage en Provence</span>
              </h2>
              <p className="mt-6 text-[16px] leading-[1.7] text-charbon/80">
                Entre lumière dorée, cigales et rires partagés, leur journée a été une véritable ode à l'amour et à la simplicité.
              </p>
              <dl className="mt-7 grid grid-cols-3 gap-4 border-y border-charbon/10 py-5">
                <div>
                  <dt className="label-caps !text-[10px] text-pierre">Lieu</dt>
                  <dd className="mt-1 text-[14.5px] font-medium">Provence</dd>
                </div>
                <div>
                  <dt className="label-caps !text-[10px] text-pierre">Durée</dt>
                  <dd className="mt-1 text-[14.5px] font-medium">14 heures</dd>
                </div>
                <div>
                  <dt className="label-caps !text-[10px] text-pierre">Photos</dt>
                  <dd className="mt-1 text-[14.5px] font-medium">870 livrées</dd>
                </div>
              </dl>
              <blockquote className="font-serif italic text-xl text-charbon/85 mt-6">
                “Il ne regarde pas ses photos. On les ressent.”
                <cite className="label-caps !text-[10.5px] text-cognac not-italic block mt-2">Clara & Julien</cite>
              </blockquote>
              <Link href="#galerie" className="btn-outline mt-7" data-testid="portfolio-case-study-cta">
                Découvrir ce reportage
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="sb-section" data-testid="portfolio-testimonials">
        <div className="sb-container grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((t, idx) => (
            <Reveal key={t.id} delay={idx * 0.08}>
              <div className="bg-white rounded-[12px] border border-charbon/10 p-8 h-full">
                <p className="font-serif italic text-2xl leading-[1.25]">“{t.text}”</p>
                <p className="label-caps text-cognac mt-5">{t.author}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        img={images['apropos-cta-fond']}
        title="Prêts à écrire votre histoire ?"
        text="Créons ensemble des souvenirs qui vous ressemblent. Je serais honoré de raconter votre journée."
        ctaLabel="Réserver une date"
        testid="portfolio-cta"
      />
    </main>
  );
}
