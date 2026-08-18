import Link from 'next/link';
import { getImages, getTestimonials } from '@/lib/api';
import { HOME_COLLECTIONS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { CircularBadge } from '@/components/Logo';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
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
  const mariageQuotes = testimonials.filter((t) => t.category === 'mariage');

  return (
    <main>
      {/* ============ HERO — photo à droite fondue vers l'ivoire, texte à gauche ============ */}
      <section className="relative min-h-[86svh] lg:min-h-[92svh] overflow-hidden" data-testid="home-hero">
        {/* Photo à droite avec fondu de transparence vers l'ivoire */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[78%] lg:w-[68%]">
          <SmartImage img={images['accueil-hero']} eager className="h-full w-full object-cover" sizes="70vw" />
          {/* Fondu ivoire depuis la gauche (effet maquette) */}
          <div className="absolute inset-0 bg-gradient-to-r from-ivoire via-ivoire/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ivoire to-transparent" />
        </div>
        {/* Badge circulaire tournant (bas droite) */}
        <CircularBadge className="hidden md:block absolute bottom-10 right-10 h-36 w-36 lg:h-40 lg:w-40 drop-shadow-md" />

        {/* Texte à gauche */}
        <div className="relative sb-container flex min-h-[86svh] lg:min-h-[92svh] items-center">
          <div className="max-w-xl py-24">
            <h1 className="font-serif font-medium text-6xl sm:text-7xl lg:text-[92px] leading-[0.98] tracking-[-0.02em] text-charbon">
              Des histoires
              <br />
              vraies.
              <br />
              <span className="text-cognac">Sans filtre.</span>
            </h1>
            <p className="label-caps text-charbon/70 mt-8 !leading-[2]">
              Photographe de mariage
              <br />
              pour les moments qui vivent <span className="text-cognac">à fond.</span>
            </p>
            <Link href="/portfolio" className="btn-primary !rounded-none mt-9" data-testid="home-hero-discover-work-button">
              Découvrir mon travail <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ============ À PROPOS — photo + carte papier / titre bicolore / signature ============ */}
      <section className="sb-section" data-testid="home-about-section">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative pl-6 pb-6 sm:pl-10 sm:pb-10">
              {/* Carte papier texturée décalée derrière la photo (maquette) */}
              <div className="absolute left-0 bottom-0 w-[55%] h-[70%] bg-pierre/25 border border-charbon/10" aria-hidden="true" />
              <SmartImage
                img={images['accueil-portrait']}
                className="relative w-full aspect-[4/5] object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 lg:pl-6">
            <p className="label-caps text-charbon/60 flex items-center gap-3">
              À propos <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.12] mt-5">
              Plus qu'un photographe,
              <br />
              <span className="text-cognac">un observateur discret.</span>
            </h2>
            <p className="mt-7 text-[15px] sm:text-[15.5px] leading-[1.9] text-charbon/80 max-w-md">
              Je suis Samuel, photographe de mariage basé en France
              <br className="hidden sm:block" /> et disponible partout où votre histoire m'emmène.
              <br className="hidden sm:block" /> Ma boussole est simple : être là, au bon moment.
              <br className="hidden sm:block" /> Au bon endroit. Et laisser l'instant parler.
              <br className="hidden sm:block" /> Pour raconter ce qui compte, avec vérité, sincérité.
              <br className="hidden sm:block" /> Des images nettes, pour des souvenirs qui le restent.
            </p>
            <img src="/signature-samuel-b.webp" alt="Signature de Samuel B." className="h-12 w-auto opacity-85 mt-8" loading="lazy" decoding="async" data-testid="home-about-signature" />
          </Reveal>
        </div>
      </section>

      {/* ============ PORTFOLIO — colonne texte + 2 grandes images, puis 5 petites ============ */}
      <section className="bg-white py-14 sm:py-20" data-testid="home-portfolio-preview">
        <div className="sb-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <Reveal className="lg:col-span-3 flex flex-col justify-center">
              <p className="font-serif text-cognac text-2xl tracking-[0.14em] uppercase flex items-center gap-3">
                Portfolio <span className="h-px w-7 bg-cognac inline-block" aria-hidden="true" />
              </p>
              <p className="label-caps text-charbon/75 mt-5 !leading-[1.9]">
                Des récits authentiques,
                <br />
                des émotions brutes.
              </p>
              <Link href="/portfolio" className="label-caps !text-[11px] text-charbon/60 hover:text-cuir transition-colors duration-200 mt-6 inline-block" data-testid="home-portfolio-link">
                Voir plus de reportages →
              </Link>
            </Reveal>
            {[1, 2].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.08} className="lg:col-span-4">
                <Link href="/portfolio" className="group block overflow-hidden h-full" data-testid={`home-portfolio-image-${i}`}>
                  <SmartImage
                    img={images[`accueil-portfolio-${i}`]}
                    className="w-full h-full min-h-[240px] aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-4 lg:mt-5">
            {[3, 4, 5, 6, 7].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.05} className={i === 7 ? 'hidden lg:block' : i === 6 ? 'hidden sm:block' : ''}>
                <Link href="/portfolio" className="group block overflow-hidden" data-testid={`home-portfolio-image-${i}`}>
                  <SmartImage
                    img={images[`accueil-portfolio-${i}`]}
                    className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 50vw, 20vw"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRESTATIONS — texte vertical + 3 colonnes, la 02 en brun ============ */}
      <section className="relative border-y border-charbon/10" data-testid="home-pricing-section">
        <div className="grid grid-cols-1 md:grid-cols-[64px_1fr] lg:grid-cols-[88px_1fr]">
          {/* Texte vertical PRESTATIONS */}
          <div className="hidden md:flex items-center justify-center border-r border-charbon/10">
            <p className="font-serif text-cognac text-xl lg:text-2xl tracking-[0.3em] uppercase [writing-mode:vertical-rl] rotate-180 py-10" aria-hidden="true">
              Prestations
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3">
            {HOME_COLLECTIONS.map((c, idx) => {
              const brown = idx === 1; // 02 Collection Complète en brun (maquette)
              return (
                <Reveal key={c.num} delay={idx * 0.07} className={brown ? 'bg-cuir' : ''}>
                  <article
                    className={`h-full flex flex-col px-8 sm:px-10 py-12 sm:py-14 ${brown ? 'text-ivoire' : 'text-charbon'} ${idx === 0 ? 'md:border-r md:border-charbon/10' : ''} ${idx === 2 ? 'md:border-l md:border-charbon/10' : ''}`}
                    data-testid={c.testid}
                  >
                    <h3 className={`label-caps !text-[13px] !leading-[1.7] ${brown ? 'text-ivoire' : 'text-charbon'}`}>
                      {c.num}.
                      <br />
                      {c.name.toUpperCase().replace('COLLECTION ', 'COLLECTION ')}
                    </h3>
                    <p className={`mt-6 text-[14.5px] leading-[1.75] flex-1 max-w-[260px] ${brown ? 'text-ivoire/85' : 'text-charbon/70'}`}>
                      {c.description}
                    </p>
                    <p className={`mt-7 text-[14.5px] ${brown ? 'text-ivoire' : 'text-charbon/85'}`}>{c.price}</p>
                    <Link
                      href="/prestations"
                      className={`label-caps !text-[11px] mt-6 inline-flex items-center gap-2 transition-colors duration-200 ${brown ? 'text-ivoire hover:text-ivoire/70' : 'text-charbon/75 hover:text-cuir'}`}
                      data-testid={`${c.testid}-cta-button`}
                    >
                      En savoir plus <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TÉMOIGNAGE — carrousel avec points ============ */}
      <section className="py-16 sm:py-24" data-testid="home-testimonial-section">
        <div className="sb-container">
          <TestimonialCarousel testimonials={mariageQuotes} />
        </div>
      </section>

      {/* ============ CTA PHOTO — aligné à gauche ============ */}
      <section className="relative py-20 sm:py-28" data-testid="home-photo-cta">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={images['accueil-cta-fond']} className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charbon/75 via-charbon/40 to-charbon/5" />
        </div>
        <div className="relative sb-container">
          <h2 className="font-serif font-medium text-ivoire text-4xl sm:text-5xl lg:text-6xl leading-[1.05] max-w-md">
            Parlons de
            <br />
            <span className="text-cognac italic">votre mariage.</span>
          </h2>
          <p className="label-caps text-ivoire/85 mt-6 max-w-md !leading-[1.9]">
            Racontez-moi votre histoire,
            <br />
            et imaginons ensemble des souvenirs inoubliables.
          </p>
          <Link href="/contact" className="btn-primary !rounded-none mt-8" data-testid="home-photo-cta-button">
            Prendre rendez-vous <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ============ CONTACT — formulaire minimal + photo ============ */}
      <section className="sb-section bg-white" data-testid="home-contact-form-section">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <Reveal className="lg:col-span-7">
            <div className="flex items-baseline gap-6 flex-wrap">
              <p className="label-caps text-charbon/60 flex items-center gap-3 shrink-0">
                Contact <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl leading-[1.1]">Discutons de votre histoire</h2>
            </div>
            <div className="mt-9">
              <ContactForm minimal testidPrefix="home-contact" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <SmartImage
              img={images['accueil-contact-image']}
              className="w-full aspect-[4/3] lg:aspect-[5/4] object-cover"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </Reveal>
        </div>
      </section>
    </main>
  );
}
