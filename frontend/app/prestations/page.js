import Link from 'next/link';
import { Eye, Sparkles, Lock, Heart, Check } from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { PRESTATIONS_COLLECTIONS, INCLUS_ITEMS, ACCOMPAGNEMENT_STEPS, OPTIONS_EXTRAS, FAQ_PRESTATIONS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { FAQAccordion } from '@/components/FAQAccordion';
import { SITE_URL } from '@/lib/content';

export const metadata = {
  title: 'Prestations & tarifs — Collections mariage, corporate, photobooth, formation',
  description:
    "Découvrez les prestations de Samuel Bocquillon : collections mariage de 1 990 € à 3 390 € TTC, reportages corporate, photobooth dès 490 € et formations photo. Devis sous 24h.",
  alternates: { canonical: '/prestations' },
};

const ICONS = { Eye, Sparkles, Lock, Heart };

function faqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_PRESTATIONS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export default async function PrestationsPage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const featured = testimonials.find((t) => t.featured && t.category === 'mariage') || testimonials[0];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }} />
      <PageHero
        img={images['prestations-hero']}
        label="Prestations"
        title="Chaque mariage est unique."
        subtitle="Mes collections sont pensées pour raconter votre histoire avec authenticité, élégance et discrétion. Des souvenirs sincères, pour toute une vie."
        raised
        testid="prestations-hero"
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="prestations-hero-cta-button">
          Réserver ma date
        </Link>
      </PageHero>

      {/* 3 collections détaillées */}
      <section className="sb-section" data-testid="prestations-collections">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Collections mariage</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 max-w-2xl">Trois façons de raconter votre journée.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {PRESTATIONS_COLLECTIONS.map((c, idx) => (
              <Reveal key={c.num} delay={idx * 0.08}>
                <article
                  className={`relative h-full flex flex-col rounded-[12px] border p-8 transition-transform duration-300 hover:-translate-y-1 ${c.popular ? 'bg-cuir text-ivoire border-cuir shadow-[var(--sb-shadow)]' : 'bg-white border-charbon/10 shadow-[var(--sb-shadow-soft)]'}`}
                  data-testid={c.testid}
                >
                  {c.popular && (
                    <span className="absolute -top-3 left-8 bg-cognac text-ivoire label-caps !text-[10px] px-3 py-1.5 rounded-full">Le plus choisi</span>
                  )}
                  <p className={`label-caps ${c.popular ? 'text-ivoire/60' : 'text-pierre'}`}>{c.num}</p>
                  <h3 className="font-serif text-3xl leading-[1.05] mt-3">{c.name}</h3>
                  <ul className={`mt-6 space-y-3 flex-1 text-[15px] leading-[1.5] ${c.popular ? 'text-ivoire/85' : 'text-charbon/80'}`}>
                    {c.features.map((f) => (
                      <li key={f} className="flex gap-2.5">
                        <Check className={`h-4.5 w-4.5 shrink-0 mt-0.5 ${c.popular ? 'text-ivoire/70' : 'text-cognac'}`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <p className={`label-caps mt-7 ${c.popular ? 'text-ivoire' : 'text-cuir'}`}>{c.price}</p>
                  <Link href="/contact" className={`mt-6 ${c.popular ? 'btn-light' : 'btn-outline'}`} data-testid={`${c.testid}-cta-button`}>
                    En savoir plus
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CE QUI EST INCLUS */}
      <section className="bg-white py-14 sm:py-20" data-testid="prestations-inclus">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac text-center">Ce qui est inclus</p>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {INCLUS_ITEMS.map((item, idx) => {
              const Icon = ICONS[item.icon];
              return (
                <Reveal key={item.title} delay={idx * 0.06}>
                  <div className="text-center px-3" data-testid={`inclus-${idx + 1}`}>
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-cognac/40 text-cognac">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="label-caps !text-[12px] mt-4">{item.title}</h3>
                    <p className="mt-2.5 text-[14px] leading-[1.6] text-charbon/70">{item.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* DÉROULÉ DE L'ACCOMPAGNEMENT */}
      <section className="sb-section" data-testid="prestations-deroule">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Déroulé de l'accompagnement</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Un accompagnement de bout en bout.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {ACCOMPAGNEMENT_STEPS.map((s, idx) => (
              <Reveal key={s.num} delay={idx * 0.07}>
                <div className="border-t-2 border-cognac/50 pt-5" data-testid={`deroule-step-${s.num}`}>
                  <p className="font-serif text-4xl text-cognac/80">{s.num}</p>
                  <h3 className="label-caps !text-[13px] mt-3">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-charbon/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* OPTIONS & EXTRAS */}
      <section className="bg-white py-14 sm:py-20" data-testid="prestations-options">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <Reveal className="lg:col-span-5">
            <SmartImage img={images['prestations-options']} className="w-full aspect-[4/5] object-cover rounded-[6px] border border-charbon/10" sizes="(max-width: 1024px) 100vw, 40vw" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <p className="label-caps text-cognac">Options & extras</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Composez une expérience sur-mesure.</h2>
            <dl className="mt-8 divide-y divide-charbon/10">
              {OPTIONS_EXTRAS.map((o) => (
                <div key={o.name} className="flex items-center justify-between py-4" data-testid={`option-${o.name.toLowerCase().replace(/\s/g, '-')}`}>
                  <dt className="text-[15.5px] text-charbon/85">{o.name}</dt>
                  <dd className="label-caps text-cuir">{o.price}</dd>
                </div>
              ))}
            </dl>
            <Link href="/contact" className="label-caps text-cuir hover:text-cognac transition-colors duration-200 inline-block mt-6" data-testid="prestations-options-link">
              Voir toutes les options →
            </Link>
          </Reveal>
        </div>
      </section>

      {featured && <TestimonialBlock quote={featured.text} author={featured.author} role={featured.role} testid="prestations-testimonial" />}

      {/* FAQ — 5 questions (élément 6 du cahier des charges) */}
      <section className="sb-section !pt-0" data-testid="prestations-faq">
        <div className="sb-container max-w-3xl">
          <Reveal>
            <p className="label-caps text-cognac">Questions fréquentes</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Tout ce que vous voulez savoir.</h2>
          </Reveal>
          <div className="mt-9">
            <FAQAccordion items={FAQ_PRESTATIONS} testid="prestations-faq-accordion" />
          </div>
        </div>
      </section>

      <CTASection
        img={images['prestations-cta-fond']}
        title="Votre histoire mérite d'être racontée."
        text="Vérifions ensemble si votre date est encore disponible."
        ctaLabel="Réserver ma date"
        testid="prestations-cta"
      />
    </main>
  );
}
