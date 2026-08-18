import Link from 'next/link';
import { getSettings, getImages, getTestimonials } from '@/lib/api';
import { HOME_COLLECTIONS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Samuel Bocquillon — Photographe de mariage à Valenciennes, Nord',
  description:
    "Photographe de mariage à Valenciennes : des histoires vraies, sans filtre. Reportages authentiques et élégants à Lille, Douai, Cambrai, dans les Hauts-de-France et partout en France. À partir de 1600 €.",
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Samuel Bocquillon — Photographe de mariage à Valenciennes',
    description: 'Des histoires vraies. Sans filtre. Reportages de mariage authentiques dans les Hauts-de-France.',
  },
};

export default async function HomePage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const featured = testimonials.find((t) => t.featured && t.category === 'mariage') || testimonials[0];

  return (
    <main>
      {/* HERO — maquette : Des histoires vraies. Sans filtre. */}
      <section className="relative min-h-[92svh] flex items-center" data-testid="home-hero">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={images['accueil-hero']} eager className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-charbon/75 via-charbon/35 to-charbon/20" />
        </div>
        <div className="relative sb-container w-full text-center py-32">
          <h1 className="font-serif font-medium text-ivoire text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.02em]">
            Des histoires vraies.
            <br />
            <span className="italic">Sans filtre.</span>
          </h1>
          <p className="label-caps text-ivoire/85 mt-7 !leading-[2]">
            Photographe de mariage
            <br className="sm:hidden" />
            <span className="hidden sm:inline"> — </span>
            pour les moments qui vivent à fond.
          </p>
          <Link href="/portfolio" className="btn-light mt-10" data-testid="home-hero-discover-work-button">
            Découvrir mon travail
          </Link>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="sb-section" data-testid="home-about-section">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <SmartImage img={images['accueil-portrait']} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 1024px) 100vw, 40vw" />
              <div className="absolute -bottom-4 -right-4 h-24 w-24 border border-cognac/40 rounded-[6px] -z-10 hidden sm:block" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="label-caps text-cognac">À propos</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">
              Plus qu'un photographe, <span className="italic">un observateur discret.</span>
            </h2>
            <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.7] text-charbon/80 max-w-xl">
              Je suis Samuel, photographe de mariage basé à Valenciennes et disponible partout où votre histoire m'emmène.
              Ma boussole est simple : être là, au bon moment, au bon endroit — et laisser l'instant parler.
              Pour raconter ce qui compte, avec vérité et sincérité.
            </p>
            <p className="font-serif italic text-2xl text-cognac mt-7">Samuel B.</p>
            <Link href="/a-propos" className="btn-outline mt-7" data-testid="home-about-read-more-link">
              En savoir plus sur moi
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="sb-container"><div className="sb-rule" /></div>

      {/* PORTFOLIO PREVIEW */}
      <section className="sb-section" data-testid="home-portfolio-preview">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Portfolio</p>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-4">
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] max-w-xl">
                Des récits authentiques, des émotions brutes.
              </h2>
              <Link href="/portfolio" className="label-caps text-cuir hover:text-cognac transition-colors duration-200 shrink-0 pb-1" data-testid="home-portfolio-link">
                Voir plus de reportages →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {[1, 2, 3].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.08}>
                <Link href="/portfolio" className="group block overflow-hidden rounded-[6px] border border-charbon/10" data-testid={`home-portfolio-image-${i}`}>
                  <SmartImage
                    img={images[`accueil-portfolio-${i}`]}
                    className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRESTATIONS — 3 collections */}
      <section className="bg-white py-14 sm:py-20 lg:py-24" data-testid="home-pricing-section">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Prestations</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 max-w-xl">Trois collections, une même exigence.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {HOME_COLLECTIONS.map((c, idx) => (
              <Reveal key={c.num} delay={idx * 0.08}>
                <article
                  className={`h-full flex flex-col rounded-[12px] border p-8 transition-transform duration-300 hover:-translate-y-1 ${idx === 2 ? 'bg-cuir text-ivoire border-cuir shadow-[var(--sb-shadow)]' : 'bg-ivoire border-charbon/10 shadow-[var(--sb-shadow-soft)]'}`}
                  data-testid={c.testid}
                >
                  <p className={`label-caps ${idx === 2 ? 'text-ivoire/60' : 'text-pierre'}`}>{c.num}</p>
                  <h3 className="font-serif text-3xl leading-[1.05] mt-3">{c.name}</h3>
                  <p className={`mt-4 text-[15px] leading-[1.65] flex-1 ${idx === 2 ? 'text-ivoire/80' : 'text-charbon/75'}`}>{c.description}</p>
                  <p className={`label-caps mt-6 ${idx === 2 ? 'text-ivoire' : 'text-cuir'}`}>{c.price}</p>
                  <Link
                    href="/prestations"
                    className={`mt-6 ${idx === 2 ? 'btn-light' : 'btn-outline'}`}
                    data-testid={`${c.testid}-cta-button`}
                  >
                    En savoir plus
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE */}
      {featured && <TestimonialBlock quote={featured.text} author={featured.author} role={featured.role} testid="home-testimonial-feature" />}

      {/* CTA PHOTO — Parlons de votre mariage */}
      <CTASection
        img={images['accueil-cta-fond']}
        title="Parlons de votre mariage."
        text="Racontez-moi votre histoire, et imaginons ensemble des souvenirs inoubliables."
        ctaLabel="Prendre rendez-vous"
        ctaHref="/contact"
        testid="home-photo-cta"
      />

      {/* FORMULAIRE DE CONTACT */}
      <section className="sb-section" data-testid="home-contact-form-section">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-5">
            <p className="label-caps text-cognac">Contact</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">
              Discutons de <span className="italic">votre histoire.</span>
            </h2>
            <p className="mt-5 text-[16px] leading-[1.7] text-charbon/75 max-w-md">
              Chaque histoire est unique. Racontez-moi la vôtre — je vous réponds personnellement sous 24h.
            </p>
            <ul className="mt-7 space-y-2.5 text-[15px] text-charbon/75">
              <li>— Réponse garantie sous 24h</li>
              <li>— Devis personnalisé et sans engagement</li>
              <li>— Échange téléphonique ou visio offert</li>
            </ul>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 bg-white rounded-[12px] border border-charbon/10 shadow-[var(--sb-shadow-soft)] p-6 sm:p-9">
            <ContactForm testidPrefix="home-contact" />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
