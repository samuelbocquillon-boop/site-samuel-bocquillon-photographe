import Link from 'next/link';
import { BookOpen, Camera, Users, Target, ShieldCheck } from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { FORMATION_MODULES, FORMATION_COMPETENCES } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { PrestationsSubnav } from '@/components/PrestationsSubnav';

export const metadata = {
  title: 'Formation photo — Débutant, Lightroom, studio & reportage',
  description:
    "Formations photographie à Valenciennes par Samuel Bocquillon : modules débutant, retouche Lightroom, studio et reportage. Théorie, pratique et conseils personnalisés — 98 % des participants recommandent.",
  alternates: { canonical: '/prestations/formation' },
};

const COMP_ICONS = { BookOpen, Camera, Users, Target, ShieldCheck };

export default async function FormationPage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const stagiaire = testimonials.find((t) => t.category === 'formation');

  return (
    <main>
      <PrestationsSubnav />
      <PageHero
        img={images['formation-hero']}
        label="Présentation — Formation"
        title="Apprenez. Créez. Élevez votre regard."
        subtitle="Des formations photo créatives et inspirantes pour vous aider à affirmer votre style et vivre pleinement votre passion."
        testid="formation-hero"
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="formation-hero-cta-button">
          Démarrer le programme →
        </Link>
      </PageHero>

      {/* MODULES */}
      <section className="sb-section" data-testid="formation-modules">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Nos formations</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Quatre modules, une progression claire.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {FORMATION_MODULES.map((m, idx) => (
              <Reveal key={m.num} delay={idx * 0.07}>
                <article className="group bg-white rounded-[12px] border border-charbon/10 overflow-hidden h-full flex flex-col" data-testid={`formation-module-${idx + 1}`}>
                  <div className="overflow-hidden relative">
                    <SmartImage img={images[m.slot]} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, 25vw" />
                    <span className="absolute top-3 left-3 bg-charbon/70 text-ivoire label-caps !text-[10px] px-2.5 py-1 rounded-full">{m.num}</span>
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="label-caps !text-[13px]">{m.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-charbon/75">{m.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAMME */}
      <section className="bg-white py-14 sm:py-20" data-testid="formation-programme">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <Reveal>
            <p className="label-caps text-cognac">Programme</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">
              Un parcours durable, <span className="italic">une progression claire.</span>
            </h2>
            <p className="mt-6 text-[16px] leading-[1.7] text-charbon/80 max-w-lg">
              Une formation basée sur l'échange et la pratique, alliant théorie, exercices sur le terrain et conseils
              personnalisés. En individuel ou en petit groupe, chaque session s'adapte à votre niveau et à vos objectifs.
            </p>
            <Link href="/contact" className="btn-outline mt-8" data-testid="formation-programme-cta">
              Découvrez le programme →
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {FORMATION_COMPETENCES.map((c) => {
                const Icon = COMP_ICONS[c.icon];
                return (
                  <div key={c.title} className="bg-ivoire rounded-[12px] border border-charbon/10 p-5 text-center" data-testid={`formation-competence-${c.title.toLowerCase()}`}>
                    <Icon className="h-6 w-6 text-cognac mx-auto" />
                    <p className="label-caps !text-[11px] mt-3">{c.title}</p>
                  </div>
                );
              })}
              <div className="bg-cuir rounded-[12px] p-5 text-center flex flex-col items-center justify-center">
                <p className="font-serif text-3xl text-ivoire">98%</p>
                <p className="label-caps !text-[10px] text-ivoire/70 mt-1.5">recommandent</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EN IMAGES */}
      <section className="sb-section" data-testid="formation-images">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">En images</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Apprendre. Pratiquer. Partager.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {[1, 2, 3].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.08}>
                <SmartImage img={images[`formation-image-${i}`]} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 640px) 100vw, 33vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Témoignage + statistique */}
      {stagiaire && (
        <section className="bg-white py-14 sm:py-20" data-testid="formation-testimonial">
          <div className="sb-container text-center max-w-3xl">
            <span className="font-serif text-cognac text-6xl leading-none select-none" aria-hidden="true">“</span>
            <blockquote className="font-serif italic text-2xl sm:text-3xl leading-[1.3] text-charbon -mt-4">{stagiaire.text}</blockquote>
            <p className="label-caps text-cognac mt-6">{stagiaire.author}</p>
            <p className="mt-8 inline-block bg-ivoire border border-charbon/10 rounded-full px-6 py-3 text-[14.5px] text-charbon/80">
              <strong className="text-cuir">98 %</strong> des participants recommandent la formation.
            </p>
          </div>
        </section>
      )}

      <CTASection
        img={images['formation-hero']}
        title="Prêt à passer à l'étape suivante ?"
        text="Découvrez le programme adapté à vos besoins et à vos envies."
        ctaLabel="Découvrir le programme"
        testid="formation-cta"
      />
    </main>
  );
}
