import { SmartImage } from './SmartImage';

// Hero de page — photo pleine largeur + overlay charbon pour lisibilité
// `split` : titre en haut de la photo, sous-titre + CTA en bas (dégage le sujet au centre)
export const PageHero = ({ img, title, subtitle, label, children, tall = false, split = false, testid = 'page-hero' }) => (
  <section className={`relative flex ${split ? '' : 'items-end'} ${tall ? 'min-h-[92svh]' : 'min-h-[58svh] sm:min-h-[64svh]'}`} data-testid={testid}>
    <div className="absolute inset-0 overflow-hidden">
      <SmartImage img={img} eager className="h-full w-full object-cover" sizes="100vw" />
      <div className={`absolute inset-0 ${split ? 'bg-gradient-to-b from-charbon/60 via-charbon/15 to-charbon/70' : 'bg-gradient-to-t from-charbon/75 via-charbon/30 to-charbon/10'}`} />
    </div>
    {split ? (
      <div className="relative sb-container w-full flex flex-col justify-between pt-8 sm:pt-10 pb-10 sm:pb-12">
        <div>
          {label && <p className="label-caps text-ivoire/85 mb-3">{label}</p>}
          <h1 className="font-serif font-medium text-ivoire text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] max-w-3xl">{title}</h1>
        </div>
        <div>
          {subtitle && <p className="text-ivoire/85 font-sans text-[16px] sm:text-[18px] leading-[1.65] max-w-2xl">{subtitle}</p>}
          {children}
        </div>
      </div>
    ) : (
      <div className="relative sb-container w-full pt-40 pb-14 sm:pb-20">
        {label && <p className="label-caps text-ivoire/85 mb-4">{label}</p>}
        <h1 className="font-serif font-medium text-ivoire text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] max-w-3xl">{title}</h1>
        {subtitle && <p className="mt-5 text-ivoire/85 font-sans text-[16px] sm:text-[18px] leading-[1.65] max-w-2xl">{subtitle}</p>}
        {children}
      </div>
    )}
  </section>
);
