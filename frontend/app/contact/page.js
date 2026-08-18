import Link from 'next/link';
import { Mail, Phone, Instagram, Facebook, MapPin, MessageCircle, CalendarDays, Heart } from 'lucide-react';
import { getSettings, getImages } from '@/lib/api';
import { FAQ_CONTACT } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';
import { ContactForm } from '@/components/ContactForm';
import { FAQAccordion } from '@/components/FAQAccordion';
import { MapEmbed } from '@/components/MapEmbed';

export const metadata = {
  title: 'Contact — Parlons de votre mariage | Réponse sous 24h',
  description:
    "Contactez Samuel Bocquillon, photographe de mariage à Valenciennes : formulaire, téléphone, email et itinéraire. Réponse garantie sous 24 à 48h pour votre projet de mariage, corporate ou formation.",
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

const BAND_ITEMS = [
  { icon: MessageCircle, title: 'Réponse rapide', text: "Je m'engage à vous répondre sous 24 à 48h ouvrées. Chaque message compte." },
  { icon: CalendarDays, title: 'Disponibilités', text: "Les dates se réservent en moyenne 12 à 18 mois à l'avance. N'attendez pas pour me contacter." },
  { icon: Heart, title: 'Rencontre', text: "Un échange en visio ou autour d'un café pour faire connaissance et parler de votre grand jour." },
];

export default async function ContactPage() {
  const [settings, images] = await Promise.all([getSettings(), getImages()]);

  const instagramHandle = settings.instagram
    ? '@' + settings.instagram.replace(/\/$/, '').split('/').pop()
    : null;

  const CONTACT_ITEMS = [
    settings.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}`, testid: 'contact-info-email' },
    settings.phone && { icon: Phone, label: 'Téléphone', value: settings.phone, href: `tel:${(settings.phone || '').replace(/\s/g, '')}`, testid: 'contact-info-phone' },
    settings.instagram && { icon: Instagram, label: 'Instagram', value: instagramHandle, href: settings.instagram, external: true, testid: 'contact-info-instagram' },
    settings.facebook && { icon: Facebook, label: 'Facebook', value: 'Samuel Bocquillon Photographe', href: settings.facebook, external: true, testid: 'contact-info-facebook' },
  ].filter(Boolean);

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactFaqJsonLd()) }} />

      {/* ============ HERO — titre à gauche, photo fondue vers l'ivoire ============ */}
      <section className="relative min-h-[56svh] lg:min-h-[62svh] overflow-hidden" data-testid="contact-hero">
        <div className="absolute inset-y-0 right-0 w-full sm:w-[80%] lg:w-[70%]">
          <SmartImage img={images['contact-hero']} eager className="h-full w-full object-cover" sizes="70vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-ivoire via-ivoire/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ivoire to-transparent" />
        </div>
        <div className="relative sb-container flex min-h-[56svh] lg:min-h-[62svh] items-center">
          <div className="max-w-lg py-20">
            <p className="label-caps text-cognac">Contact</p>
            <h1 className="font-serif font-medium text-5xl sm:text-6xl lg:text-[76px] leading-[1.02] tracking-[-0.02em] text-charbon mt-4">
              Parlons de
              <br />
              <span className="text-cognac">votre mariage.</span>
            </h1>
            <span className="block h-[2px] w-10 bg-cognac mt-6" aria-hidden="true" />
            <p className="mt-6 text-[15px] sm:text-[15.5px] leading-[1.8] text-charbon/80 max-w-xs">
              Chaque histoire est unique.
              <br className="hidden sm:block" /> Racontez-moi la vôtre, je serai honoré
              <br className="hidden sm:block" /> de la photographier.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FORMULAIRE + RESTONS EN CONTACT ============ */}
      <section className="pb-14 sm:pb-20 sb-grain" data-testid="contact-main">
        <div className="sb-container">
          <div className="bg-white px-6 sm:px-10 lg:px-14 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <Reveal className="lg:col-span-6">
              <h2 className="font-serif text-4xl sm:text-[44px] leading-[1.12]">
                Envoyez-moi
                <br />
                un <span className="text-cognac">message</span>
              </h2>
              <div className="mt-9">
                <ContactForm full testidPrefix="contact" />
              </div>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-6 lg:pl-6">
              <h2 className="font-serif text-4xl sm:text-[44px] leading-[1.12]">
                Restons en <span className="text-cognac">contact</span>
              </h2>
              <p className="mt-7 text-[15px] leading-[1.8] text-charbon/80 max-w-sm">
                Je suis à votre écoute pour échanger
                <br className="hidden sm:block" /> sur votre mariage et vos envies photographiques.
                <br className="hidden sm:block" /> Réponse sous 24 à 48h ouvrées.
              </p>
              <dl className="mt-9 space-y-6">
                {CONTACT_ITEMS.map((item) => (
                  <div key={item.label} className="flex items-start gap-4" data-testid={item.testid}>
                    <span className="h-11 w-11 rounded-full bg-cuir text-ivoire flex items-center justify-center shrink-0">
                      <item.icon className="h-4.5 w-4.5" />
                    </span>
                    <div>
                      <dt className="label-caps !text-[10px] text-charbon/55">{item.label}</dt>
                      <dd className="mt-1">
                        <a
                          href={item.href}
                          {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="text-[14.5px] text-charbon/85 hover:text-cuir transition-colors"
                        >
                          {item.value}
                        </a>
                      </dd>
                    </div>
                  </div>
                ))}
                <div className="flex items-start gap-4" data-testid="contact-info-address">
                  <span className="h-11 w-11 rounded-full bg-cuir text-ivoire flex items-center justify-center shrink-0">
                    <MapPin className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <dt className="label-caps !text-[10px] text-charbon/55">Adresse</dt>
                    <dd className="mt-1 text-[14.5px] leading-[1.7] text-charbon/85">
                      Basé à {settings.city} ({settings.region})
                      <br />
                      Déplacements dans toute la France
                      <br />
                      et à l'international
                    </dd>
                  </div>
                </div>
              </dl>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ BANDE 3 ITEMS — réponse / disponibilités / rencontre ============ */}
      <section className="bg-pierre/15 border-y border-charbon/10 py-10 sm:py-12" data-testid="contact-band">
        <div className="sb-container grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-charbon/15">
          {BAND_ITEMS.map((b, idx) => (
            <div key={b.title} className={`flex items-start gap-5 ${idx > 0 ? 'md:pl-10' : ''} ${idx < 2 ? 'md:pr-10' : ''}`} data-testid={`contact-band-${idx + 1}`}>
              <span className="h-12 w-12 rounded-full bg-cuir text-ivoire flex items-center justify-center shrink-0">
                <b.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="label-caps !text-[12px] text-charbon">{b.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-[1.7] text-charbon/70 max-w-[260px]">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ INFORMATIONS UTILES + OÙ ME TROUVER ============ */}
      <section className="sb-section" data-testid="contact-faq-section">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="font-serif text-4xl sm:text-[44px] leading-[1.12]">
              Informations <span className="text-cognac">utiles</span>
            </h2>
            <span className="block h-[2px] w-9 bg-cognac mt-5 mb-6" aria-hidden="true" />
            <FAQAccordion items={FAQ_CONTACT} plus testid="contact-faq-accordion" />
            <Link href="/prestations" className="btn-primary !rounded-none !py-3.5 !px-6 !text-[11px] mt-8" data-testid="contact-prestations-link">
              Voir les prestations <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6" data-testid="contact-map-section">
            <h2 className="font-serif text-4xl sm:text-[44px] leading-[1.12]">
              Où me <span className="text-cognac">trouver</span>
            </h2>
            <div className="mt-8">
              <MapEmbed settings={settings} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ CTA FINAL — bande sombre sur photo ============ */}
      <section className="relative py-16 sm:py-20" data-testid="contact-photo-cta">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={images['contact-cta-fond']} className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charbon/85 via-charbon/55 to-charbon/25" />
        </div>
        <div className="relative sb-container">
          <h2 className="font-serif font-medium text-ivoire text-4xl sm:text-5xl leading-[1.08] max-w-md">
            Prêt à écrire
            <br />
            <span className="text-cognac">votre histoire ?</span>
          </h2>
          <p className="mt-4 text-ivoire/80 text-[14.5px] leading-[1.75] max-w-xs">
            Discutons de votre mariage et créons ensemble
            <br className="hidden sm:block" /> des souvenirs intemporels.
          </p>
          <Link href="#contact-name" className="btn-primary !rounded-none mt-7" data-testid="contact-photo-cta-button">
            Prenons rendez-vous <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
