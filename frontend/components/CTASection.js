import Link from 'next/link';
import { SmartImage } from './SmartImage';

// Section CTA pleine largeur sur photo — présente sur chaque page (maquettes)
export const CTASection = ({ img, title, text, ctaLabel = 'Prendre rendez-vous', ctaHref = '/contact', testid = 'photo-cta', liftContent = false }) => (
  <section className="relative py-24 sm:py-32" data-testid={testid}>
    <div className="absolute inset-0 overflow-hidden">
      <SmartImage img={img} className="h-full w-full object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-charbon/60" />
    </div>
    <div className={`relative sb-container text-center${liftContent ? ' sm:-translate-y-20' : ''}`}>
      <div className={liftContent ? '-translate-y-5 sm:translate-y-0' : ''}>
        <h2 className="font-serif font-medium text-ivoire text-4xl sm:text-5xl lg:text-6xl leading-[1]">{title}</h2>
        {text && <p className="mt-5 label-caps text-ivoire/80 max-w-2xl mx-auto !leading-[1.9]">{text}</p>}
      </div>
      <Link href={ctaHref} className="btn-light mt-9" data-testid={`${testid}-button`}>
        {ctaLabel} <span aria-hidden="true">→</span>
      </Link>
    </div>
  </section>
);
