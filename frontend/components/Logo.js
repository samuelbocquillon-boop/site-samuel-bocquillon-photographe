// Logo Samuel Bocquillon — monogramme SB + nom + signature (charte graphique)
import Link from 'next/link';

export const Monogram = ({ className = '', color = 'currentColor' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <circle cx="32" cy="32" r="30" stroke={color} strokeWidth="1.2" opacity="0.5" />
    <text x="20" y="42" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="32" fontWeight="500" fill={color} textAnchor="middle">S</text>
    <text x="40" y="46" fontFamily="var(--font-cormorant), 'Cormorant Garamond', serif" fontSize="32" fontStyle="italic" fontWeight="400" fill={color} textAnchor="middle">B</text>
  </svg>
);

export const Logo = ({ dark = false, compact = false }) => (
  <Link href="/" className="flex items-center gap-3 group" aria-label="Samuel Bocquillon — Photographe de mariage, retour à l'accueil" data-testid="site-logo">
    <Monogram className={`h-10 w-10 sm:h-11 sm:w-11 shrink-0 ${dark ? 'text-ivoire' : 'text-cuir'}`} />
    {!compact && (
      <span className={`flex flex-col leading-none border-l pl-3 ${dark ? 'border-ivoire/30' : 'border-charbon/15'}`}>
        <span className={`font-serif text-[17px] sm:text-[19px] tracking-wide ${dark ? 'text-ivoire' : 'text-charbon'}`}>Samuel Bocquillon</span>
        <span className={`font-sans font-semibold text-[8.5px] sm:text-[9px] tracking-[0.28em] uppercase mt-1 ${dark ? 'text-ivoire/70' : 'text-cognac'}`}>Photographe de mariage</span>
      </span>
    )}
  </Link>
);
