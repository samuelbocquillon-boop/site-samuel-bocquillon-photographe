'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SUBS = [
  { href: '/prestations/mariage', label: 'Mariage' },
  { href: '/prestations/corporate', label: 'Corporate' },
  { href: '/prestations/photobooth', label: 'Photobooth' },
  { href: '/prestations/formation', label: 'Formation' },
];

// Sous-navigation entre les 4 prestations (maquettes) + fil d'Ariane
export const PrestationsSubnav = () => {
  const pathname = usePathname();
  return (
    <div className="border-b border-charbon/10 bg-ivoire/95 sticky top-[72px] sm:top-20 z-40 backdrop-blur-md" data-testid="prestations-subnav">
      <div className="sb-container flex items-center gap-1 overflow-x-auto py-1">
        <nav aria-label="Fil d'Ariane" className="hidden md:flex items-center gap-2 mr-6 shrink-0" data-testid="breadcrumb">
          <Link href="/" className="text-pierre text-[12px] hover:text-charbon transition-colors">Accueil</Link>
          <span className="text-pierre text-[12px]">/</span>
          <Link href="/prestations" className="text-pierre text-[12px] hover:text-charbon transition-colors">Prestations</Link>
        </nav>
        {SUBS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            data-testid={`subnav-${s.label.toLowerCase()}`}
            aria-current={pathname === s.href ? 'page' : undefined}
            className={`label-caps whitespace-nowrap px-4 py-3.5 border-b-2 transition-colors duration-200 ${pathname === s.href ? 'border-cuir text-cuir' : 'border-transparent text-charbon/60 hover:text-charbon'}`}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
