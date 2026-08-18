import Link from 'next/link';
import { FileHeart, EyeOff, Aperture, Check } from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { MARIAGE_COLLECTIONS, ACCOMPAGNEMENT_STEPS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { PrestationsSubnav } from '@/components/PrestationsSubnav';

export const metadata = {
  title: 'Photographe de mariage — Collections de 1800 € à 3800 €',
  description:
    "Reportage photo de mariage par Samuel Bocquillon : approche documentaire et émotionnelle, discrétion absolue, matériel haut de gamme. Collections de 1800 € à 3800 €, dans le Nord et partout en France.",
  alternates: { canonical: '/prestations/mariage' },
};

const APPROCHE = [
  { icon: FileHeart, title: 'Approche documentaire & émotionnelle', text: "Je raconte votre journée comme elle se vit : sans poses forcées, au plus près des émotions vraies." },
  { icon: EyeOff, title: 'Discrétion & bienveillance', text: 'Une présence atténuée, attentive et rassurante — vos invités m\'oublient, vos photos s\'en souviennent.' },
  { icon: Aperture, title: 'Matériel haut de gamme', text: 'Boîtiers professionnels doublés, optiques lumineuses et sauvegarde immédiate : vos souvenirs sont en sécurité.' },
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
        subtitle="Discret et attentif, j'immortalise les émotions vraies et les instants précieux de votre journée. Mon approche documentaire et élégante met en lumière l'essentiel : vous."
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
      <section className="bg-white py-14 sm:py-20 lg:py-24" data-testid="mariage-collections">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Collections mariage</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Choisissez votre formule.</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {MARIAGE_COLLECTIONS.map((c, idx) => (
              <Reveal key={c.num} delay={idx * 0.08}>
                <article
                  className={`relative h-full flex flex-col rounded-[12px] border p-8 transition-transform duration-300 hover:-translate-y-1 ${c.popular ? 'bg-cuir text-ivoire border-cuir shadow-[var(--sb-shadow)]' : 'bg-ivoire border-charbon/10 shadow-[var(--sb-shadow-soft)]'}`}
                  data-testid={`mariage-collection-${idx + 1}`}
                >
                  {c.popular && <span className="absolute -top-3 left-8 bg-cognac text-ivoire label-caps !text-[10px] px-3 py-1.5 rounded-full">La plus choisie</span>}
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
                  <Link href="/contact" className={`mt-6 ${c.popular ? 'btn-light' : 'btn-outline'}`} data-testid={`mariage-collection-${idx + 1}-cta`}>
                    En savoir plus
                  </Link>
                </article>
              </Reveal>
            ))}
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
