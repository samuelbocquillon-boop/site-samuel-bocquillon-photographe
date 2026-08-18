import Link from 'next/link';
import { getImages, getTestimonials } from '@/lib/api';
import { CORPORATE_PRESTATIONS, CORPORATE_STEPS, CORPORATE_CLIENTS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { PrestationsSubnav } from '@/components/PrestationsSubnav';

export const metadata = {
  title: 'Photographe corporate — Reportages & portraits d\'entreprise',
  description:
    "Photographe corporate dans les Hauts-de-France : reportages événementiels, portraits d'équipe, marque employeur et contenu réseaux sociaux. Des images authentiques alignées avec vos valeurs.",
  alternates: { canonical: '/prestations/corporate' },
};

export default async function CorporatePage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const corpo = testimonials.find((t) => t.category === 'corporate');

  return (
    <main>
      <PrestationsSubnav />
      <PageHero
        img={images['corporate-hero']}
        label="Présentation — Corporate"
        title="L'image juste pour votre histoire."
        subtitle="Reportages, portraits, contenus sur-mesure pour les entreprises. Mon objectif : créer des images authentiques, élégantes et alignées avec vos valeurs."
        testid="corporate-hero"
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="corporate-hero-cta-button">
          Échanger sur votre projet →
        </Link>
      </PageHero>

      {/* MES PRESTATIONS */}
      <section className="sb-section" data-testid="corporate-prestations">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Mes prestations</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4 max-w-2xl">Valoriser ce qui vous rend unique.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {CORPORATE_PRESTATIONS.map((p, idx) => (
              <Reveal key={p.title} delay={idx * 0.07}>
                <article className="group bg-white rounded-[12px] border border-charbon/10 overflow-hidden h-full flex flex-col" data-testid={`corporate-prestation-${idx + 1}`}>
                  <div className="overflow-hidden">
                    <SmartImage img={images[p.slot]} className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-[1.04]" sizes="(max-width: 640px) 100vw, 25vw" />
                  </div>
                  <div className="p-6 flex-1">
                    <h3 className="label-caps !text-[13px]">{p.title}</h3>
                    <p className="mt-3 text-[14.5px] leading-[1.6] text-charbon/75">{p.text}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ILS ME FONT CONFIANCE */}
      <section className="bg-white py-12 sm:py-16" data-testid="corporate-clients">
        <div className="sb-container">
          <p className="label-caps text-pierre text-center">Ils me font confiance</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            {CORPORATE_CLIENTS.map((c) => (
              <span key={c} className="font-serif text-2xl text-charbon/40">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MON APPROCHE — 4 étapes */}
      <section className="sb-section" data-testid="corporate-approche">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Mon approche</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Une méthode simple et efficace.</h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {CORPORATE_STEPS.map((s, idx) => (
              <Reveal key={s.num} delay={idx * 0.07}>
                <div className="border-t-2 border-cognac/50 pt-5" data-testid={`corporate-step-${s.num}`}>
                  <p className="font-serif text-4xl text-cognac/80">{s.num}</p>
                  <h3 className="label-caps !text-[13px] mt-3">{s.title}</h3>
                  <p className="mt-3 text-[14.5px] leading-[1.65] text-charbon/75">{s.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {corpo && <TestimonialBlock quote={corpo.text} author={corpo.author} role={corpo.role} testid="corporate-testimonial" />}

      <CTASection
        img={images['corporate-cta-fond']}
        title="Parlons de votre projet corporate."
        text="Chaque entreprise a une histoire unique. Partagez la vôtre, et construisons le récit visuel qui la mettra en valeur."
        ctaLabel="Prendre rendez-vous"
        testid="corporate-cta"
      />
    </main>
  );
}
