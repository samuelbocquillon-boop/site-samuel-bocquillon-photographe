import Link from 'next/link';
import { Printer, Globe, Image as ImageIcon, Phone, Star, Check } from 'lucide-react';
import { getImages } from '@/lib/api';
import { PHOTOBOOTH_FORMULES, PHOTOBOOTH_OPTIONS, PHOTOBOOTH_STEPS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { PrestationsSubnav } from '@/components/PrestationsSubnav';

export const metadata = {
  title: 'Photobooth — Location borne photo mariage & événements dès 490 €',
  description:
    "Location de photobooth élégant pour mariages et événements dans le Nord : tirages illimités, fond personnalisé, téléphone livre d'or. Formules de 490 € à 990 € TTC.",
  alternates: { canonical: '/prestations/photobooth' },
};

const OPT_ICONS = { Printer, Globe, Image: ImageIcon, Phone, Star };

export default async function PhotoboothPage() {
  const images = await getImages();

  return (
    <main>
      <PrestationsSubnav />
      <PageHero
        img={images['photobooth-hero']}
        label="Présentation — Photobooth"
        title="Photobooth."
        subtitle="L'animation qui crée des souvenirs immédiats. Élégant, design et intuitif : le photobooth qui sublime vos événements et rassemble vos invités."
        testid="photobooth-hero"
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="photobooth-hero-cta-button">
          Réserver maintenant
        </Link>
      </PageHero>

      {/* FORMULES */}
      <section className="sb-section" data-testid="photobooth-formules">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Nos formules photobooth</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Trois formules, zéro contrainte.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {PHOTOBOOTH_FORMULES.map((f, idx) => (
              <Reveal key={f.num} delay={idx * 0.08}>
                <article
                  className={`relative h-full flex flex-col rounded-[12px] border p-8 transition-transform duration-300 hover:-translate-y-1 ${f.popular ? 'bg-cuir text-ivoire border-cuir shadow-[var(--sb-shadow)]' : 'bg-white border-charbon/10 shadow-[var(--sb-shadow-soft)]'}`}
                  data-testid={`photobooth-formule-${idx + 1}`}
                >
                  {f.popular && <span className="absolute -top-3 left-8 bg-cognac text-ivoire label-caps !text-[10px] px-3 py-1.5 rounded-full">Coup de cœur</span>}
                  <p className={`label-caps ${f.popular ? 'text-ivoire/60' : 'text-pierre'}`}>{f.num}</p>
                  <h3 className="font-serif text-3xl leading-[1.05] mt-3">{f.name}</h3>
                  <ul className={`mt-6 space-y-3 flex-1 text-[15px] ${f.popular ? 'text-ivoire/85' : 'text-charbon/80'}`}>
                    {f.features.map((feat) => (
                      <li key={feat} className="flex gap-2.5">
                        <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${f.popular ? 'text-ivoire/70' : 'text-cognac'}`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <p className={`label-caps mt-7 ${f.popular ? 'text-ivoire' : 'text-cuir'}`}>{f.price}</p>
                  <Link href="/contact" className={`mt-6 ${f.popular ? 'btn-light' : 'btn-outline'}`} data-testid={`photobooth-formule-${idx + 1}-cta`}>
                    Réserver
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPTIONS */}
      <section className="bg-white py-14 sm:py-20" data-testid="photobooth-options">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac text-center">Des options pour une expérience sur-mesure</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mt-10">
            {PHOTOBOOTH_OPTIONS.map((o, idx) => {
              const Icon = OPT_ICONS[o.icon];
              return (
                <Reveal key={o.name} delay={idx * 0.05}>
                  <div className="text-center px-2" data-testid={`photobooth-option-${idx + 1}`}>
                    <span className="inline-flex h-13 w-13 p-3.5 items-center justify-center rounded-full border border-cognac/40 text-cognac">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="label-caps !text-[11.5px] mt-4">{o.name}</h3>
                    <p className="mt-2 text-[13.5px] leading-[1.55] text-charbon/70">{o.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* EN ACTION */}
      <section className="sb-section" data-testid="photobooth-action">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Le photobooth en action</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Simple, rapide, inoubliable.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-10">
            {[1, 2, 3].map((i, idx) => (
              <Reveal key={i} delay={idx * 0.08}>
                <SmartImage img={images[`photobooth-action-${i}`]} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 640px) 100vw, 33vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="bg-charbon text-ivoire py-14 sm:py-20" data-testid="photobooth-comment">
        <div className="sb-container">
          <Reveal>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] text-ivoire">Comment ça marche ?</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {PHOTOBOOTH_STEPS.map((s, idx) => (
              <Reveal key={s.num} delay={idx * 0.07}>
                <div className="border-t border-cognac/50 pt-5" data-testid={`photobooth-step-${s.num}`}>
                  <p className="font-serif text-4xl text-cognac">{s.num}</p>
                  <h3 className="label-caps !text-[13px] mt-3 text-ivoire">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-ivoire/70">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        img={images['photobooth-hero']}
        title="Offrez une expérience unique à vos invités."
        text="Disponible pour mariages, soirées d'entreprise et événements privés."
        ctaLabel="Réserver mon photobooth"
        testid="photobooth-cta"
      />
    </main>
  );
}
