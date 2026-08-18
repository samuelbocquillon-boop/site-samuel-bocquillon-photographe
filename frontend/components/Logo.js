// Logo Samuel Bocquillon — versions charte graphique
import Link from 'next/link';

// Monogramme SB (favicon, admin, badge)
export const Monogram = ({ className = '', color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1.2" opacity="0.5" />
    <text x="26" y="42" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="30" fontWeight="500" fill={color} textAnchor="middle">S</text>
    <text x="40" y="46" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="30" fontStyle="italic" fontWeight="400" fill={color} textAnchor="middle">B</text>
  </svg>
);

// Monogramme SB entrelacé style signature (pied de page — maquette)
export const ScriptMonogram = ({ className = '', color = 'currentColor' }) => (
  <svg viewBox="0 0 56 64" fill="none" className={className} aria-hidden="true">
    <line x1="28" y1="2" x2="28" y2="62" stroke={color} strokeWidth="0.8" opacity="0.55" />
    <text x="20" y="42" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="34" fontWeight="500" fill={color} textAnchor="middle">S</text>
    <text x="37" y="48" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="34" fontStyle="italic" fill={color} textAnchor="middle">B</text>
  </svg>
);

// Logo texte deux lignes (header — logo officiel fourni par le client)
export const Logo = ({ dark = false, compact = false }) => (
  <Link href="/" className="inline-flex items-center" aria-label="Samuel Bocquillon — Photographe de mariage, retour à l'accueil" data-testid="site-logo">
    <img
      src="/logo-samuel-bocquillon.webp"
      alt="Samuel Bocquillon — Photographe de mariage"
      width="744"
      height="240"
      className={`w-auto ${compact ? 'h-10' : 'h-11 sm:h-[52px]'} ${dark ? 'brightness-0 invert' : ''}`}
      loading="eager"
      decoding="async"
    />
  </Link>
);

// Badge circulaire statique (hero accueil — logo officiel fourni par le client)
export const CircularBadge = ({ className = '' }) => (
  <div className={className} aria-hidden="true" data-testid="hero-circular-badge">
    <img
      src="/badge-samuel-bocquillon.webp"
      alt=""
      width="473"
      height="480"
      className="h-full w-full object-contain"
      loading="eager"
      decoding="async"
    />
  </div>
);
