import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from './Logo';

const FooterLink = ({ href, children, testid }) => (
  <Link href={href} data-testid={testid} className="text-ivoire/60 hover:text-ivoire text-[14px] leading-relaxed transition-colors duration-200">
    {children}
  </Link>
);

export const Footer = ({ settings }) => {
  const s = settings || {};
  return (
    <footer className="bg-charbon text-ivoire" data-testid="site-footer">
      <div className="sb-container py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Logo dark />
            <p className="mt-5 text-ivoire/60 text-[14px] leading-relaxed max-w-xs">
              Des histoires vraies. Sans filtre. Photographe de mariage basé à {s.city || 'Valenciennes'}, disponible partout en France et à l'étranger.
            </p>
            <div className="mt-5 space-y-2 text-[14px] text-ivoire/60">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-cognac" />{s.address || 'Valenciennes, Nord (59), France'}</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-cognac" /><a href={`tel:${(s.phone || '').replace(/\s/g, '')}`} className="hover:text-ivoire transition-colors">{s.phone}</a></p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-cognac" /><a href={`mailto:${s.email}`} className="hover:text-ivoire transition-colors">{s.email}</a></p>
            </div>
          </div>
          <div>
            <p className="label-caps text-ivoire/40 mb-5">Navigation</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/" testid="footer-link-accueil">Accueil</FooterLink>
              <FooterLink href="/a-propos" testid="footer-link-apropos">À propos</FooterLink>
              <FooterLink href="/portfolio" testid="footer-link-portfolio">Portfolio</FooterLink>
              <FooterLink href="/avis" testid="footer-link-avis">Avis clients</FooterLink>
              <FooterLink href="/contact" testid="footer-link-contact">Contact</FooterLink>
            </div>
          </div>
          <div>
            <p className="label-caps text-ivoire/40 mb-5">Prestations</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/prestations/mariage" testid="footer-link-mariage">Mariage</FooterLink>
              <FooterLink href="/prestations/corporate" testid="footer-link-corporate">Corporate</FooterLink>
              <FooterLink href="/prestations/photobooth" testid="footer-link-photobooth">Photobooth</FooterLink>
              <FooterLink href="/prestations/formation" testid="footer-link-formation">Formation</FooterLink>
            </div>
            <p className="label-caps text-ivoire/40 mb-5 mt-8">Secteur</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/photographe-mariage-valenciennes" testid="footer-link-valenciennes">Mariage à Valenciennes</FooterLink>
              <FooterLink href="/photographe-mariage-lille" testid="footer-link-lille">Mariage à Lille</FooterLink>
              <FooterLink href="/photographe-mariage-douai" testid="footer-link-douai">Mariage à Douai</FooterLink>
              <FooterLink href="/photographe-mariage-cambrai" testid="footer-link-cambrai">Mariage à Cambrai</FooterLink>
            </div>
          </div>
          <div>
            <p className="label-caps text-ivoire/40 mb-5">Informations</p>
            <div className="flex flex-col gap-2.5">
              <FooterLink href="/mentions-legales" testid="footer-link-mentions">Mentions légales</FooterLink>
              <FooterLink href="/politique-de-confidentialite" testid="footer-link-confidentialite">Politique de confidentialité</FooterLink>
              <FooterLink href="/prestations" testid="footer-link-prestations">Tarifs & collections</FooterLink>
            </div>
            <p className="label-caps text-ivoire/40 mb-4 mt-8">Suivez-moi</p>
            <div className="flex items-center gap-3" data-testid="footer-social-links">
              {s.instagram && (
                <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="footer-social-instagram" className="h-11 w-11 rounded-full border border-ivoire/20 flex items-center justify-center text-ivoire/70 hover:text-ivoire hover:border-ivoire/50 transition-colors duration-200">
                  <Instagram className="h-4.5 w-4.5" />
                </a>
              )}
              {s.facebook && (
                <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-testid="footer-social-facebook" className="h-11 w-11 rounded-full border border-ivoire/20 flex items-center justify-center text-ivoire/70 hover:text-ivoire hover:border-ivoire/50 transition-colors duration-200">
                  <Facebook className="h-4.5 w-4.5" />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-ivoire/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-ivoire/40 text-[13px]">© {new Date().getFullYear()} Samuel Bocquillon — Photographe de mariage. Tous droits réservés.</p>
          <p className="text-ivoire/30 text-[12px]">{s.city || 'Valenciennes'} · Lille · Douai · Cambrai · Hauts-de-France</p>
        </div>
      </div>
    </footer>
  );
};
