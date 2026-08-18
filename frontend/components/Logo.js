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

// Logo texte deux lignes (header — maquette accueil)
export const Logo = ({ dark = false, compact = false }) => (
  <Link href="/" className="group inline-block" aria-label="Samuel Bocquillon — Photographe de mariage, retour à l'accueil" data-testid="site-logo">
    <span className={`block font-serif text-[19px] sm:text-[22px] tracking-[0.18em] uppercase leading-none ${dark ? 'text-ivoire' : 'text-charbon'}`}>
      Samuel Bocquillon
    </span>
    {!compact && (
      <span className={`block font-sans font-semibold text-[8.5px] sm:text-[9.5px] tracking-[0.34em] uppercase mt-1.5 ${dark ? 'text-ivoire/65' : 'text-charbon/55'}`}>
        Photographe de mariage
      </span>
    )}
  </Link>
);

// Badge circulaire tournant (hero accueil — maquette)
export const CircularBadge = ({ className = '' }) => (
  <div className={className} aria-hidden="true" data-testid="hero-circular-badge">
    <div className="relative h-full w-full">
      <svg viewBox="0 0 160 160" className="h-full w-full animate-[spin_28s_linear_infinite]">
        <defs>
          <path id="badge-circle" d="M 80,80 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0" />
        </defs>
        <text fill="#EFECE8" fontSize="12.5" fontFamily="var(--font-manrope), Manrope, sans-serif" fontWeight="600" letterSpacing="3.5">
          <textPath href="#badge-circle">SAMUEL BOCQUILLON • PHOTOGRAPHE DE MARIAGE •</textPath>
        </text>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-ivoire">
        <span className="text-[11px] leading-none -mb-1">✦</span>
        <span className="font-serif text-[38px] leading-none">S<span className="italic">B</span></span>
        <span className="text-[11px] leading-none -mt-0.5">✦</span>
      </div>
    </div>
  </div>
);
