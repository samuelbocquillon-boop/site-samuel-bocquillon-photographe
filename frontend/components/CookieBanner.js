'use client';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { Cookie } from 'lucide-react';

export const CONSENT_KEY = 'sb-cookie-consent';

export function getConsent() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(CONSENT_KEY);
}

// Bandeau RGPD — bloque Google Analytics et Google Maps tant que non accepté
export const CookieBanner = ({ gaId }) => {
  const [consent, setConsent] = useState('pending');
  const pathname = usePathname();

  useEffect(() => {
    setConsent(getConsent() || 'unset');
  }, []);

  const decide = (value) => {
    localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
    window.dispatchEvent(new CustomEvent('sb-consent-changed', { detail: value }));
  };

  if (pathname && pathname.startsWith('/admin')) return null;

  return (
    <>
      {consent === 'accepted' && gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });`}
          </Script>
        </>
      )}
      {consent === 'unset' && (
        <div className="fixed bottom-0 inset-x-0 z-[70] p-4 sm:p-5" role="dialog" aria-label="Consentement aux cookies" data-testid="cookie-banner">
          <div className="max-w-3xl mx-auto bg-charbon text-ivoire rounded-[14px] shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Cookie className="h-6 w-6 text-cognac shrink-0" />
            <p className="text-[13.5px] leading-relaxed text-ivoire/80 flex-1">
              Ce site utilise des cookies de mesure d'audience (Google Analytics) et une carte Google Maps.
              Vous pouvez accepter ou refuser — votre choix n'empêche pas la navigation.{' '}
              <a href="/politique-de-confidentialite" className="underline underline-offset-2 hover:text-ivoire">En savoir plus</a>
            </p>
            <div className="flex gap-2.5 shrink-0">
              <button onClick={() => decide('refused')} className="px-4 py-2.5 rounded-[8px] border border-ivoire/25 label-caps text-ivoire/80 hover:bg-ivoire/10 transition-colors min-h-[44px]" data-testid="cookie-refuse-button">
                Refuser
              </button>
              <button onClick={() => decide('accepted')} className="px-5 py-2.5 rounded-[8px] bg-ivoire text-charbon label-caps hover:bg-white transition-colors min-h-[44px]" data-testid="cookie-accept-button">
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
