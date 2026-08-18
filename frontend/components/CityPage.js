import Link from 'next/link';
import { MapPin, Check } from 'lucide-react';
import { getImages, getTestimonials, getSettings } from '@/lib/api';
import { SITE_URL, HOME_COLLECTIONS } from '@/lib/content';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';
import { TestimonialBlock } from '@/components/TestimonialBlock';
import { FAQAccordion } from '@/components/FAQAccordion';

// Page ville — SEO local (partagée par les 4 villes)
export function cityJsonLd(city, settings) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Photographe de mariage à ${city.name}`,
      serviceType: 'Photographie de mariage',
      provider: { '@id': `${SITE_URL}/#business` },
      areaServed: { '@type': 'City', name: city.name },
      offers: { '@type': 'Offer', price: '1600', priceCurrency: 'EUR', description: 'Reportage de mariage à partir de 1600 €' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Accueil', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: `Photographe de mariage à ${city.name}`, item: `${SITE_URL}/${city.slug}` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: city.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

export async function CityPage({ city }) {
  const [images, testimonials, settings] = await Promise.all([getImages(), getTestimonials(), getSettings()]);
  const featured = testimonials.find((t) => t.featured && t.category === 'mariage') || testimonials[0];

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd(city, settings)) }} />
      <PageHero
        img={images[city.heroSlot]}
        label={`SEO local — ${city.dept}`}
        title={`Photographe de mariage à ${city.name}`}
        subtitle={city.intro}
        testid={`ville-${city.name.toLowerCase()}-hero`}
      >
        <Link href="/contact" className="btn-light mt-8" data-testid="ville-hero-cta-button">
          Vérifier ma disponibilité
        </Link>
      </PageHero>

      {/* Résumé extractible (GEO) */}
      <section className="sb-section" data-testid="ville-resume">
        <div className="sb-container">
          <Reveal>
            <div className="bg-white border-l-4 border-cognac rounded-r-[12px] p-7 max-w-3xl">
              <p className="label-caps !text-[10.5px] text-pierre">En résumé</p>
              <p className="mt-3 text-[16px] leading-[1.7] text-charbon/85">{city.resume}</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-14">
            <Reveal>
              <h2 className="font-serif text-3xl sm:text-4xl leading-[1.05]">
                Un photographe qui connaît <span className="italic">{city.name}</span>
              </h2>
              <p className="mt-5 text-[15.5px] leading-[1.7] text-charbon/80">
                Connaître les lieux, c'est anticiper la lumière. Travailler régulièrement à {city.name} me permet de
                repérer les meilleurs endroits pour vos photos de couple, d'anticiper la logistique et de vous conseiller
                sur le déroulé de votre journée — sans stress, sans perte de temps.
              </p>
              <h3 className="label-caps !text-[13px] mt-8 text-charbon">Lieux emblématiques où je photographie</h3>
              <ul className="mt-4 space-y-2.5">
                {city.venues.map((v) => (
                  <li key={v} className="flex gap-2.5 text-[15px] text-charbon/80">
                    <MapPin className="h-4.5 w-4.5 text-cognac shrink-0 mt-0.5" />
                    {v}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="bg-white rounded-[12px] border border-charbon/10 p-8">
                <h3 className="font-serif text-2xl">Collections à {city.name}</h3>
                <div className="mt-5 divide-y divide-charbon/10">
                  {HOME_COLLECTIONS.map((c) => (
                    <div key={c.num} className="py-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-[15.5px]">{c.name}</p>
                        <p className="text-[13.5px] text-charbon/60 mt-0.5">{c.description}</p>
                      </div>
                      <p className="label-caps text-cuir shrink-0">{c.price}</p>
                    </div>
                  ))}
                </div>
                <Link href="/prestations" className="btn-outline w-full mt-5" data-testid="ville-prestations-link">
                  Voir les collections en détail
                </Link>
              </div>
              <div className="mt-6 bg-charbon text-ivoire rounded-[12px] p-7">
                <h3 className="label-caps !text-[12px] text-cognac">Zone d'intervention</h3>
                <p className="mt-3 text-[14.5px] leading-[1.65] text-ivoire/80">{city.zone}</p>
                <p className="mt-3 flex items-center gap-2 text-[14px] text-ivoire/70">
                  <Check className="h-4 w-4 text-cognac" /> Déplacement offert dans un rayon de 50 km
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ locale */}
      <section className="bg-white py-14 sm:py-20" data-testid="ville-faq">
        <div className="sb-container max-w-3xl">
          <Reveal>
            <p className="label-caps text-cognac">Questions fréquentes — {city.name}</p>
            <h2 className="font-serif text-3xl sm:text-4xl leading-[1.05] mt-4">Votre mariage à {city.name}</h2>
          </Reveal>
          <div className="mt-8">
            <FAQAccordion items={city.faq} testid="ville-faq-accordion" />
          </div>
          <div className="mt-10 flex flex-wrap gap-3" data-testid="ville-internal-links">
            <Link href="/portfolio" className="label-caps text-cuir hover:text-cognac transition-colors">Voir le portfolio →</Link>
            <span className="text-pierre">·</span>
            <Link href="/avis" className="label-caps text-cuir hover:text-cognac transition-colors">Lire les avis clients →</Link>
            <span className="text-pierre">·</span>
            <Link href="/prestations/mariage" className="label-caps text-cuir hover:text-cognac transition-colors">Collections mariage →</Link>
          </div>
        </div>
      </section>

      {featured && <TestimonialBlock quote={featured.text} author={featured.author} role={featured.role} testid="ville-testimonial" />}

      <CTASection
        img={images[city.heroSlot]}
        title={`Votre mariage à ${city.name} mérite des images vraies.`}
        text="Vérifions ensemble si votre date est encore disponible — réponse sous 24h."
        ctaLabel="Prendre rendez-vous"
        testid="ville-cta"
      />
    </main>
  );
}
