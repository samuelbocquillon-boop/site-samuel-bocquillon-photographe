import { Star } from 'lucide-react';
import { getImages, getTestimonials } from '@/lib/api';
import { SITE_URL } from '@/lib/content';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { CTASection } from '@/components/CTASection';

export const metadata = {
  title: 'Avis clients — Témoignages de mariés et d\'entreprises',
  description:
    "Découvrez les avis de vrais clients de Samuel Bocquillon, photographe de mariage à Valenciennes : témoignages de mariés, d'entreprises et de stagiaires photo. Note moyenne 5/5.",
  alternates: { canonical: '/avis' },
};

function reviewsJsonLd(testimonials) {
  const avg = testimonials.length
    ? (testimonials.reduce((a, t) => a + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/#business`,
    name: 'Samuel Bocquillon — Photographe de mariage',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: avg,
      reviewCount: testimonials.length,
      bestRating: '5',
    },
    review: testimonials.map((t) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: t.author },
      reviewBody: t.text,
      reviewRating: { '@type': 'Rating', ratingValue: t.rating || 5, bestRating: '5' },
    })),
  };
}

const CATEGORY_LABELS = { mariage: 'Mariage', corporate: 'Corporate', formation: 'Formation', photobooth: 'Photobooth' };

export default async function AvisPage() {
  const [images, testimonials] = await Promise.all([getImages(), getTestimonials()]);
  const avg = testimonials.length
    ? (testimonials.reduce((a, t) => a + (t.rating || 5), 0) / testimonials.length).toFixed(1)
    : '5.0';

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd(testimonials)) }} />
      <PageHero
        img={images['avis-hero']}
        label="Avis clients"
        title="Ils racontent mieux que moi."
        subtitle={`${testimonials.length} témoignages de vrais clients — note moyenne ${avg}/5. Mariés, entreprises et stagiaires photo partagent leur expérience.`}
        testid="avis-hero"
      />

      <section className="sb-section" data-testid="avis-grid-section">
        <div className="sb-container">
          <Reveal>
            <div className="flex items-center gap-3">
              <div className="flex" aria-label={`Note moyenne ${avg} sur 5`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-cognac text-cognac" />
                ))}
              </div>
              <p className="text-[15px] text-charbon/75">
                <strong>{avg}/5</strong> — {testimonials.length} avis vérifiés
              </p>
            </div>
          </Reveal>
          <div className="masonry mt-10" data-testid="avis-grid">
            {testimonials.map((t, idx) => (
              <Reveal key={t.id} delay={Math.min(idx * 0.05, 0.3)}>
                <article className="bg-white rounded-[12px] border border-charbon/10 p-7" data-testid={`avis-card-${idx + 1}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {Array.from({ length: t.rating || 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-cognac text-cognac" />
                      ))}
                    </div>
                    <span className="label-caps !text-[9.5px] text-pierre border border-charbon/10 rounded-full px-2.5 py-1">
                      {CATEGORY_LABELS[t.category] || 'Client'}
                    </span>
                  </div>
                  <p className="font-serif italic text-xl leading-[1.35] mt-4">“{t.text}”</p>
                  <p className="label-caps !text-[11px] text-cognac mt-5">{t.author}</p>
                  {t.role && <p className="text-pierre text-[12.5px] mt-1">{t.role}</p>}
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        img={images['avis-hero']}
        title="Et si le prochain avis était le vôtre ?"
        text="Racontez-moi votre projet — réponse garantie sous 24h."
        ctaLabel="Prendre rendez-vous"
        testid="avis-cta"
      />
    </main>
  );
}
