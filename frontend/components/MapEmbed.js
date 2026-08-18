'use client';
import { useState, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { CONSENT_KEY } from './CookieBanner';

// Carte Google Maps — chargée uniquement après consentement RGPD
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
      <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-[12px] overflow-hidden border border-charbon/10 bg-white" data-testid="contact-google-maps-embed">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <MapPin className="h-8 w-8 text-cognac" />
            <p className="text-charbon/70 text-[14.5px] max-w-sm">
              La carte Google Maps nécessite votre consentement aux cookies pour s'afficher.
            </p>
            <button onClick={accept} className="btn-outline !py-3 !px-5" data-testid="map-consent-button">
              Afficher la carte
            </button>
          </div>
        )}
      </div>
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-5" data-testid="contact-directions-link">
        <Navigation className="h-4 w-4" />
        Obtenir l'itinéraire
      </a>
    </div>
  );
};
