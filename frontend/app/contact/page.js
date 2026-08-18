import { Mail, Phone, MapPin, Instagram, Facebook, Clock } from 'lucide-react';
import { getSettings, getImages } from '@/lib/api';
import { FAQ_CONTACT } from '@/lib/content';
import { Reveal } from '@/components/Reveal';
import { PageHero } from '@/components/PageHero';
import { ContactForm } from '@/components/ContactForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { MapEmbed } from '@/components/MapEmbed';

export const metadata = {
  title: 'Contact — Parlons de votre mariage | Réponse sous 24h',
  description:
    "Contactez Samuel Bocquillon, photographe de mariage à Valenciennes : formulaire, téléphone, email et itinéraire. Réponse garantie sous 24h pour votre projet de mariage, corporate ou formation.",
  alternates: { canonical: '/contact' },
};

function contactFaqJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_CONTACT.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export default async function ContactPage() {
  const [settings, images] = await Promise.all([getSettings(), getImages()]);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd()) }} />
      <PageHero
        img={images['contact-hero']}
        label="Contact"
        title="Parlons de votre mariage."
        subtitle="Chaque histoire est unique. Racontez-moi la vôtre, je serai honoré de la photographier."
        testid="contact-hero"
      />

      {/* Formulaire + infos */}
      <section className="sb-section" data-testid="contact-main">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10">
          <Reveal className="lg:col-span-7 bg-white rounded-[12px] border border-charbon/10 shadow-[var(--sb-shadow-soft)] p-6 sm:p-9">
            <h2 className="font-serif text-3xl sm:text-4xl leading-[1.05]">Envoyez-moi un message</h2>
            <p className="mt-3 text-[15px] text-charbon/70">Tous les champs marqués * sont obligatoires.</p>
            <div className="mt-7">
              <ContactForm full testidPrefix="contact" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <h2 className="font-serif text-3xl sm:text-4xl leading-[1.05]">Restons en contact</h2>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-charbon/75">
              Je suis à votre écoute pour échanger au sujet de votre mariage, de reportages, portraits ou événements.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 bg-cuir/5 border border-cuir/20 text-cuir rounded-full px-4 py-2.5 text-[14px] font-medium" data-testid="contact-response-promise">
              <Clock className="h-4 w-4" />
              {settings.response_delay || 'Réponse sous 24h garantie'}
            </p>
            <dl className="mt-8 space-y-5">
              <div className="flex gap-4" data-testid="contact-info-email">
                <span className="h-11 w-11 rounded-full border border-cognac/40 flex items-center justify-center text-cognac shrink-0"><Mail className="h-4.5 w-4.5" /></span>
                <div>
                  <dt className="label-caps !text-[10.5px] text-pierre">Email</dt>
                  <dd className="mt-1"><a href={`mailto:${settings.email}`} className="text-[15.5px] font-medium hover:text-cuir transition-colors">{settings.email}</a></dd>
                </div>
              </div>
              <div className="flex gap-4" data-testid="contact-info-phone">
                <span className="h-11 w-11 rounded-full border border-cognac/40 flex items-center justify-center text-cognac shrink-0"><Phone className="h-4.5 w-4.5" /></span>
                <div>
                  <dt className="label-caps !text-[10.5px] text-pierre">Téléphone</dt>
                  <dd className="mt-1"><a href={`tel:${(settings.phone || '').replace(/\s/g, '')}`} className="text-[15.5px] font-medium hover:text-cuir transition-colors">{settings.phone}</a></dd>
                </div>
              </div>
              <div className="flex gap-4" data-testid="contact-info-address">
                <span className="h-11 w-11 rounded-full border border-cognac/40 flex items-center justify-center text-cognac shrink-0"><MapPin className="h-4.5 w-4.5" /></span>
                <div>
                  <dt className="label-caps !text-[10.5px] text-pierre">Adresse</dt>
                  <dd className="mt-1 text-[15.5px] font-medium">{settings.address}</dd>
                </div>
              </div>
              {settings.instagram && (
                <div className="flex gap-4" data-testid="contact-info-instagram">
                  <span className="h-11 w-11 rounded-full border border-cognac/40 flex items-center justify-center text-cognac shrink-0"><Instagram className="h-4.5 w-4.5" /></span>
                  <div>
                    <dt className="label-caps !text-[10.5px] text-pierre">Instagram</dt>
                    <dd className="mt-1"><a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-[15.5px] font-medium hover:text-cuir transition-colors">@samuelbocquillon</a></dd>
                  </div>
                </div>
              )}
              {settings.facebook && (
                <div className="flex gap-4" data-testid="contact-info-facebook">
                  <span className="h-11 w-11 rounded-full border border-cognac/40 flex items-center justify-center text-cognac shrink-0"><Facebook className="h-4.5 w-4.5" /></span>
                  <div>
                    <dt className="label-caps !text-[10.5px] text-pierre">Facebook</dt>
                    <dd className="mt-1"><a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="text-[15.5px] font-medium hover:text-cuir transition-colors">Samuel Bocquillon</a></dd>
                  </div>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* OÙ ME TROUVER — carte + itinéraire (élément 20) */}
      <section className="bg-white py-14 sm:py-20" data-testid="contact-map-section">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-cognac">Où me trouver</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Basé à {settings.city}, disponible partout.</h2>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-charbon/75 max-w-2xl">
              Basé à {settings.city} ({settings.region}), je me déplace dans toute la France et à l'international.
              Déplacement offert dans un rayon de 50 km — Lille, Douai, Cambrai et tout le Hainaut.
            </p>
          </Reveal>
          <div className="mt-8">
            <MapEmbed settings={settings} />
          </div>
        </div>
      </section>

      {/* INFORMATIONS UTILES */}
      <section className="sb-section" data-testid="contact-faq-section">
        <div className="sb-container max-w-3xl">
          <Reveal>
            <p className="label-caps text-cognac">Informations utiles</p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-4">Avant de m'écrire…</h2>
          </Reveal>
          <div className="mt-9">
            <FAQAccordion items={FAQ_CONTACT} testid="contact-faq-accordion" />
          </div>
        </div>
      </section>
    </main>
  );
}
