import Link from 'next/link';
import { Camera, Heart, Gem } from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { VALEURS, PARCOURS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';

export const metadata = {
  title: 'À propos — Un observateur discret',
  description:
    "Découvrez Samuel Bocquillon, photographe de mariage basé à Valenciennes : son approche documentaire, ses valeurs (authenticité, émotion, élégance) et son parcours depuis 2012.",
  alternates: { canonical: '/a-propos' },
};

const ICONS = { Camera, Heart, Gem };

export default async function AProposPage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const featured = testimonials.find((t) => t.featured && t.category === 'mariage') || testimonials[0];

  return (
    <main>
      <PageHero
        img={images['apropos-hero']}
        label="À propos"
        title="Un observateur discret."
        subtitle="Photographe de mariage basé à Valenciennes, disponible partout où votre histoire m'emmène."
        testid="apropos-hero"
      />

      {/* Résumé extractible (GEO) */}
      <section className="sb-section" data-testid="apropos-intro">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-7 order-2 lg:order-1">
            <p className="label-caps text-cognac">Qui suis-je ?</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">
              Être là, au bon moment. <span className="italic">Et laisser l'instant parler.</span>
            </h2>
            <p className="mt-6 text-[16px] sm:text-[17px] leading-[1.7] text-charbon/80">
              Je suis Samuel, photographe de mariage basé à Valenciennes, dans le Nord, et disponible partout où votre
              histoire m'emmène. Ma boussole est simple : être là, au bon moment, au bon endroit — et laisser l'instant
              parler. Pour raconter ce qui compte, avec vérité et sincérité. Des images nettes, pour des souvenirs qui le restent.
            </p>
            <p className="font-serif italic text-2xl text-cognac mt-7">Samuel B.</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5 order-1 lg:order-2">
            <SmartImage img={images['apropos-portrait']} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 1024px) 100vw, 40vw" />
          </Reveal>
        </div>
      </section>

      {/* MON APPROCHE */}
      <section className="bg-white py-14 sm:py-20 lg:py-24" data-testid="apropos-approche">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <SmartImage img={images['apropos-approche']} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 1024px) 100vw, 40vw" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="label-caps text-cognac">Mon approche</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">
              L'art de la discrétion, <span className="italic">la force du vrai.</span>
            </h2>
            <p className="mt-6 text-[16px] leading-[1.7] text-charbon/80 max-w-xl">
              Pas de poses interminables ni de mises en scène artificielles. Je travaille en reportage : j'observe,
              j'anticipe, je capture. Les rires échangés pendant les préparatifs, la main serrée pendant la cérémonie,
              les larmes des discours — tout ce qui fait la vérité de votre journée.
            </p>
            <p className="mt-4 text-[16px] leading-[1.7] text-charbon/80 max-w-xl">
              Mon style ? Chaleureux, contrasté, intemporel. Des peaux naturelles, des noirs profonds, cette lumière
              dorée de fin de journée que j'aime tant. Et toujours : vous, avant tout.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MES VALEURS */}
      <section className="sb-section" data-testid="apropos-valeurs">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac text-center">Mes valeurs</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 text-center">Ce qui guide chaque image.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {VALEURS.map((v, idx) => {
              const Icon = ICONS[v.icon];
              return (
                <Reveal key={v.title} delay={idx * 0.08}>
                  <div className="bg-white rounded-[12px] border border-charbon/10 p-8 h-full text-center" data-testid={`valeur-${v.title.toLowerCase()}`}>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cognac/40 text-cognac">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="label-caps !text-[13px] mt-5 text-charbon">{v.title}</h3>
                    <p className="mt-3 text-[15px] leading-[1.65] text-charbon/75">{v.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* MON PARCOURS — timeline */}
      <section className="bg-charbon text-ivoire py-14 sm:py-20 lg:py-24" data-testid="apropos-parcours">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Mon parcours</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 text-ivoire">Plus de dix ans d'histoires vraies.</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-9">
            {PARCOURS.map((p, idx) => (
              <Reveal key={p.year} delay={idx * 0.05}>
                <div className="border-l border-cognac/50 pl-5" data-testid={`parcours-${p.year}`}>
                  <p className="font-serif text-3xl text-cognac">{p.year}</p>
                  <p className="mt-2 text-[15px] leading-[1.65] text-ivoire/75">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured && <TestimonialBlock quote={featured.text} author={featured.author} role={featured.role} testid="apropos-testimonial" />}

      <CTASection
        img={images['apropos-cta-fond']}
        title="Parlons de votre histoire."
        text="Prêts à écrire votre histoire ? Créons ensemble des souvenirs qui vous ressemblent."
        ctaLabel="Réserver une date"
        testid="apropos-cta"
      />
    </main>
  );
}
