import Link from 'next/link';
import { ScriptMonogram } from './Logo';

const FooterLink = ({ href, children, testid, external = false }) => (
  <Link
    href={href}
    data-testid={testid}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="text-charbon/65 hover:text-cuir text-[14px] leading-relaxed transition-colors duration-200"
  >
    {children}
  </Link>
);

// Pied de page clair — fidèle à la maquette (logo script, LIENS, SUIVEZ-MOI)
export const Footer = ({ settings }) => {
  const s = settings || {};
  return (
    <footer className="bg-ivoire border-t border-charbon/10" data-testid="site-footer">
      <div className="sb-container py-12 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6 flex items-start gap-4">
            <ScriptMonogram className="h-14 w-12 text-cuir shrink-0" />
            <div>
              <p className="font-serif text-[18px] tracking-[0.18em] uppercase text-charbon leading-none">Samuel Bocquillon</p>
              <p className="font-sans font-semibold text-[9px] tracking-[0.32em] uppercase text-charbon/55 mt-1.5">Photographe de mariage</p>
              <p className="mt-4 text-charbon/55 text-[13px] leading-relaxed max-w-xs">
                {s.address || 'Valenciennes, Nord (59), France'}
                <br />
                <a href={`tel:${(s.phone || '').replace(/\s/g, '')}`} className="hover:text-cuir transition-colors">{s.phone}</a>
                {' · '}
                <a href={`mailto:${s.email}`} className="hover:text-cuir transition-colors">{s.email}</a>
              </p>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps text-charbon/45 mb-4">Liens</p>
            <div className="flex flex-col gap-2">
              <FooterLink href="/a-propos" testid="footer-link-apropos">À propos</FooterLink>
              <FooterLink href="/portfolio" testid="footer-link-portfolio">Portfolio</FooterLink>
              <FooterLink href="/prestations" testid="footer-link-prestations">Prestations</FooterLink>
              <FooterLink href="/avis" testid="footer-link-avis">Avis clients</FooterLink>
              <FooterLink href="/contact" testid="footer-link-contact">Contact</FooterLink>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="label-caps text-charbon/45 mb-4">Suivez-moi</p>
            <div className="flex flex-col gap-2" data-testid="footer-social-links">
              {s.instagram && <FooterLink href={s.instagram} external testid="footer-social-instagram">Instagram</FooterLink>}
              {s.pinterest && <FooterLink href={s.pinterest} external testid="footer-social-pinterest">Pinterest</FooterLink>}
              {s.facebook && <FooterLink href={s.facebook} external testid="footer-social-facebook">Facebook</FooterLink>}
            </div>
            <p className="label-caps text-charbon/45 mb-3 mt-7">Secteur</p>
            <div className="flex flex-col gap-2">
              <FooterLink href="/photographe-mariage-valenciennes" testid="footer-link-valenciennes">Mariage à Valenciennes</FooterLink>
              <FooterLink href="/photographe-mariage-lille" testid="footer-link-lille">Mariage à Lille</FooterLink>
              <FooterLink href="/photographe-mariage-douai" testid="footer-link-douai">Mariage à Douai</FooterLink>
              <FooterLink href="/photographe-mariage-cambrai" testid="footer-link-cambrai">Mariage à Cambrai</FooterLink>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-charbon/10 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-charbon/45">
            <Link href="/mentions-legales" data-testid="footer-link-mentions" className="hover:text-charbon transition-colors">Mentions légales</Link>
            <span aria-hidden="true">·</span>
            <Link href="/politique-de-confidentialite" data-testid="footer-link-confidentialite" className="hover:text-charbon transition-colors">Politique de confidentialité</Link>
          </div>
          <p className="text-charbon/45 text-[12px]">© {new Date().getFullYear()} Samuel Bocquillon – Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};
