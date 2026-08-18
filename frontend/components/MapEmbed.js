'use client';
import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { CONSENT_KEY } from './CookieBanner';

// « Où me trouver » — carte beige avec épingle brune (maquette), Google Maps après consentement RGPD
export const MapEmbed = ({ settings }) => {
  const [consent, setConsent] = useState(null);

  useEffect(() => {
    setConsent(localStorage.getItem(CONSENT_KEY));
    const onChange = (e) => setConsent(e.detail);
    window.addEventListener('sb-consent-changed', onChange);
    return () => window.removeEventListener('sb-consent-changed', onChange);
  }, []);

  const q = encodeURIComponent(`${settings.city || 'Valenciennes'}, France`);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    window.dispatchEvent(new CustomEvent('sb-consent-changed', { detail: 'accepted' }));
  };

  return (
    <div>
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-ivoire" data-testid="contact-google-maps-embed">
        {consent === 'accepted' ? (
          <iframe
            title={`Carte — ${settings.city || 'Valenciennes'}, itinéraire vers Samuel Bocquillon photographe`}
            src={`https://www.google.com/maps?q=${q}&z=12&output=embed`}
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            {/* Texture discrète façon carte */}
            <div className="absolute inset-0 opacity-[0.16]" aria-hidden="true" style={{ backgroundImage: 'radial-gradient(circle at 25% 35%, #8A5A44 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, #8A5A44 0.5px, transparent 1px)', backgroundSize: '46px 46px, 62px 62px' }} />
            <MapPin className="relative h-11 w-11 text-cuir fill-cuir [&>circle]:fill-ivoire" strokeWidth={1.2} />
            <button onClick={accept} className="relative label-caps !text-[10px] text-charbon/45 hover:text-cuir underline underline-offset-4 decoration-charbon/20 hover:decoration-cognac transition-colors min-h-[44px]" data-testid="map-consent-button">
              Afficher la carte interactive
            </button>
          </div>
        )}
      </div>
      <p className="mt-5 text-[15px] leading-[1.75] text-charbon/80">
        Basé à {settings.city || 'Valenciennes'} ({settings.region || 'Hauts-de-France'})
        <br />
        Déplacements dans toute la France
        <br />
        et à l'international.
      </p>
      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="label-caps !text-[11px] text-cuir hover:text-cognac transition-colors duration-200 mt-4 inline-block"
        data-testid="contact-directions-link"
      >
        Obtenir l'itinéraire →
      </a>
    </div>
  );
};
