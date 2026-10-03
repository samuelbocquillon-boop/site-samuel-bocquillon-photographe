import Link from 'next/link';
import {
  Sparkles, HeartHandshake, Aperture, Gem, Clock, Camera,
  Plane, Infinity as InfinityIcon, Wand2, Usb, LockKeyhole, Presentation,
  CalendarCheck, Car, Printer, Sunrise, Zap, BookImage, Timer, Users,
} from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { MARIAGE_COLLECTIONS, MARIAGE_OPTIONS, MARIAGE_MENTIONS, ACCOMPAGNEMENT_STEPS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { PrestationsSubnav } from '@/components/PrestationsSubnav';

export const metadata = {
  title: 'Photographe de mariage — Collections de 1 990 € à 3 390 € TTC',
  description:
    "Reportage photo de mariage par Samuel Bocquillon : approche documentaire et émotionnelle, discrétion absolue, matériel haut de gamme. Collections Hugs, Delight et Infinity de 1 990 € à 3 390 € TTC, dans le Nord et partout en France.",
  alternates: { canonical: '/prestations/mariage' },
};

// Icônes des prestations incluses — référencées par nom dans lib/content.js
const FEATURE_ICONS = {
  Clock, Plane, Infinity: InfinityIcon, Wand2, Usb, LockKeyhole, Presentation,
  CalendarCheck, Car, HeartHandshake, Printer, Sunrise, Zap, BookImage,
  Timer, Users, Camera,
};

const APPROCHE = [
  // Rangée 1 — Ma démarche
  { icon: Sparkles, title: 'Approche créative & bienveillante', text: "Je capte un maximum d'émotions et de vrais instants, tout en y apportant ma patte créative. Je vous conseille avec bienveillance : proposer, jamais imposer." },
  { icon: HeartHandshake, title: 'Une vraie complicité', text: "Discret dans l'émotion, présent dans les moments décisifs. Les plus belles images se créent ensemble, dans la complicité — jamais le photographe seul." },
  { icon: Aperture, title: 'Matériel haut de gamme', text: 'Boîtiers professionnels doublés, optiques lumineuses et sauvegarde immédiate : vos souvenirs sont en sécurité.' },
  // Rangée 2 — L'accompagnement
  { icon: Gem, title: 'La séance engagement', text: "Avant le grand jour, une séance pour apprivoiser l'objectif et tisser une vraie complicité. Le jour J, tout devient naturel." },
  { icon: Clock, title: 'Le jour J, de A à Z', text: "Une présence complète, du matin jusqu'à 1h. Je vis chaque étape de votre journée avec vous, pour ne rien laisser passer." },
  { icon: Camera, title: "L'after-day", text: "Pour les gourmands d'images : une séance après le mariage, dans des lieux d'exception, pour des photographies encore plus créatives et travaillées." },
];

export default async function MariagePage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const featured = testimonials.find((t) => t.featured && t.category === 'mariage') || testimonials[0];

  return (
    <main>
      <PrestationsSubnav />
      <PageHero
        img={images['mariage-hero']}
        label="Présentation — Mariage"
        title="Des souvenirs vrais. Pour toute une vie."
        mobileSplit
        testid="mariage-hero"
      />

      {/* Approche — 3 piliers */}
      <section className="sb-section" data-testid="mariage-approche">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Mon approche</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 max-w-2xl">
              Des images sincères pour raconter <span className="italic">votre histoire.</span>
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {APPROCHE.map((a, idx) => (
              <Reveal key={a.title} delay={idx * 0.08}>
                <div className="bg-white rounded-[12px] border border-charbon/10 p-8 h-full" data-testid={`mariage-approche-${idx + 1}`}>
                  <a.icon className="h-7 w-7 text-cognac" />
                  <h3 className="label-caps !text-[13px] mt-5">{a.title}</h3>
                  <p className="mt-3.5 text-[15px] leading-[1.65] text-charbon/75">{a.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS MARIAGE */}
      <section id="collections" className="bg-white py-14 sm:py-20 lg:py-24 scroll-mt-24" data-testid="mariage-collections">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Collections mariage</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Les collections.</h2>
            <p className="mt-4 text-[15.5px] leading-[1.6] text-charbon/70 italic">Tarifs nets, toutes taxes comprises.</p>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-5 mt-12 lg:items-stretch">
            {MARIAGE_COLLECTIONS.map((c, idx) => (
              <Reveal
                key={c.id}
                delay={idx * 0.08}
                className={c.popular ? 'order-first lg:order-none' : ''}
              >
                <article
                  className={`relative h-full flex flex-col rounded-[12px] border bg-ivoire p-7 sm:p-8 transition-transform duration-300 hover:-translate-y-1 ${
                    c.popular
                      ? 'border-cognac shadow-[var(--sb-shadow)] lg:scale-[1.02]'
                      : 'border-charbon/10 shadow-[var(--sb-shadow-soft)] hover:border-cognac/40'
                  }`}
                  data-testid={`mariage-collection-${c.id}`}
                >
                  {c.popular && (
                    <span className="absolute -top-3 left-8 bg-cognac text-ivoire label-caps !text-[10px] px-3 py-1.5 rounded-full" data-testid="mariage-collection-badge">
                      {c.badge}
                    </span>
                  )}
                  <p className="label-caps text-pierre">Collection</p>
                  <h3 className="font-serif text-4xl leading-[1.05] mt-2">{c.name}</h3>
                  <p className="label-caps !text-[14px] text-cuir mt-4" data-testid={`mariage-collection-${c.id}-price`}>{c.price}</p>
                  <Link
                    href="/contact#formulaire"
                    className={`mt-6 ${c.popular ? 'btn-primary justify-center' : 'btn-outline justify-center'}`}
                    data-testid={`mariage-collection-${c.id}-cta`}
                  >
                    Demander cette collection
                  </Link>
                  <div className="h-px bg-charbon/10 mt-7" aria-hidden="true" />
                  <ul className="mt-6 space-y-3.5 flex-1 text-[14.5px] leading-[1.5] text-charbon/80">
                    {c.features.map((f) => {
                      const Icon = FEATURE_ICONS[f.icon] || Camera;
                      return (
                        <li key={f.text} className="flex items-start gap-3">
                          <Icon className="h-[18px] w-[18px] shrink-0 mt-0.5 text-cognac" strokeWidth={1.5} aria-hidden="true" />
                          {f.text}
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Options complémentaires */}
          <div className="mt-16 sm:mt-20" data-testid="mariage-options">
            <Reveal>
              <h3 className="font-serif text-3xl sm:text-4xl leading-[1.05]">Les options.</h3>
              <p className="mt-3 text-[15px] leading-[1.6] text-charbon/70">
                Toutes les options sont soumises à disponibilité et facturées en complément de la collection choisie.
              </p>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-9">
              {MARIAGE_OPTIONS.map((o, idx) => {
                const Icon = FEATURE_ICONS[o.icon] || Camera;
                return (
                  <Reveal key={o.name} delay={idx * 0.06}>
                    <div
                      className="h-full rounded-[12px] border border-charbon/10 bg-ivoire p-6 shadow-[var(--sb-shadow-soft)] transition-transform duration-300 hover:-translate-y-0.5"
                      data-testid={`mariage-option-${idx + 1}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cognac/40 text-cognac">
                            <Icon className="h-[18px] w-[18px]" strokeWidth={1.5} aria-hidden="true" />
                          </span>
                          <h4 className="label-caps !text-[13px]">{o.name}</h4>
                        </div>
                        <p className="label-caps !text-[13px] text-cuir whitespace-nowrap">{o.price}</p>
                      </div>
                      <p className="mt-4 text-[14px] leading-[1.65] text-charbon/70">{o.text}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Mentions contractuelles */}
            <Reveal>
              <ul className="mt-10 space-y-2 border-t border-charbon/10 pt-6" data-testid="mariage-mentions">
                {MARIAGE_MENTIONS.map((m) => (
                  <li key={m} className="text-[13px] leading-[1.65] text-charbon/60">
                    {m}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MON ACCOMPAGNEMENT */}
      <section className="sb-section" data-testid="mariage-accompagnement">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Mon accompagnement</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Du premier échange à la livraison.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {ACCOMPAGNEMENT_STEPS.map((s, idx) => (
              <Reveal key={s.num} delay={idx * 0.07}>
                <div className="border-t-2 border-cognac/50 pt-5">
                  <p className="font-serif text-4xl text-cognac/80">{s.num}</p>
                  <h3 className="label-caps !text-[13px] mt-3">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-charbon/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Galerie — souvenirs qui traversent le temps */}
      <section className="bg-white py-14 sm:py-20" data-testid="mariage-galerie">
        <div className="sb-container">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] max-w-lg">Des souvenirs qui traversent le temps.</h2>
              <Link href="/portfolio" className="label-caps text-cuir hover:text-cognac transition-colors duration-200 shrink-0 pb-1" data-testid="mariage-portfolio-link">
                Voir plus de reportages →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {[1, 2, 3].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.08}>
                <SmartImage
                  img={images[`mariage-galerie-${i}`]}
                  className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {featured && <TestimonialBlock quote={featured.text} author={featured.author} role={featured.role} testid="mariage-testimonial" />}

      <CTASection
        img={images['mariage-cta-fond']}
        title="Parlons de votre mariage."
        text="Réservez un rendez-vous pour échanger sur votre projet et recevoir une offre personnalisée."
        ctaLabel="Réserver un rendez-vous"
        testid="mariage-cta"
      />
    </main>
  );
}
