import { SmartImage } from './SmartImage';

// Hero de page — photo pleine largeur + overlay charbon pour lisibilité
// `split` : titre en haut de la photo, sous-titre + CTA en bas (dégage le sujet au centre)
export const PageHero = ({ img, title, subtitle, label, children, tall = false, split = false, mobileSplit = false, testid = 'page-hero' }) => {
  // mobileSplit : sur mobile uniquement, titre en haut de la photo et sous-titre en bas
  // (dégage un maximum la photo). Sur desktop, rendu identique au layout classique (tout en bas).
  if (mobileSplit) {
    return (
      <section className={`relative flex ${tall ? 'min-h-[92svh]' : 'min-h-[58svh] sm:min-h-[64svh]'}`} data-testid={testid}>
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={img} eager className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-charbon/65 via-charbon/10 to-charbon/70" />
          <div className="absolute inset-0 hidden sm:block bg-gradient-to-b from-charbon/70 via-charbon/20 to-charbon/5" />
        </div>
        <div className="relative sb-container w-full flex flex-col justify-between sm:justify-start pt-8 pb-9 sm:pt-20 sm:pb-20">
          <div>
            {label && <p className="label-caps text-ivoire/85 mb-3 sm:mb-4">{label}</p>}
            <h1 className="font-serif font-medium text-ivoire text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-[-0.02em] max-w-3xl">{title}</h1>
          </div>
          {(subtitle || children) && (
            <div className="mt-6 sm:mt-5">
              {subtitle && <p className="text-ivoire/85 font-sans text-[16px] sm:text-[18px] leading-[1.65] max-w-2xl">{subtitle}</p>}
              {children}
            </div>
          )}
        </div>
      </section>
    );
  }
  return (
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
};
