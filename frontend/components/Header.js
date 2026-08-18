'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, CalendarCheck } from 'lucide-react';
import { Logo } from './Logo';
import { NAV_LINKS } from '@/lib/content';

export const Header = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
    setSubOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (pathname && pathname.startsWith('/admin')) return null;

  const isActive = (href) => (href === '/' ? pathname === '/' : pathname && pathname.startsWith(href));

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivoire/90 backdrop-blur-md border-b border-charbon/10" data-testid="site-header">
        <div className="sb-container flex items-center justify-between h-[72px] sm:h-20">
          <Logo />
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation principale" data-testid="site-nav">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.href} className="relative group" data-testid="nav-prestations-menu">
                  <Link
                    href={link.href}
                    className={`label-caps inline-flex items-center gap-1.5 py-2 transition-colors duration-200 ${isActive(link.href) ? 'text-cuir' : 'text-charbon/75 hover:text-charbon'}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                  </Link>
                  {isActive(link.href) && <span className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-cuir" />}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200">
                    <div className="bg-white border border-charbon/10 rounded-[12px] shadow-[var(--sb-shadow)] py-2 min-w-[210px]">
                      {link.children.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          data-testid={`nav-sub-${sub.label.toLowerCase()}`}
                          className={`block px-5 py-3 label-caps transition-colors duration-150 ${pathname === sub.href ? 'text-cuir bg-cuir/5' : 'text-charbon/70 hover:text-cuir hover:bg-cuir/5'}`}
                          aria-current={pathname === sub.href ? 'page' : undefined}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div key={link.href} className="relative">
                  <Link
                    href={link.href}
                    data-testid={`nav-link-${link.label.toLowerCase().replace(/\s|à/g, (m) => (m === 'à' ? 'a' : '-'))}`}
                    className={`label-caps py-2 transition-colors duration-200 ${isActive(link.href) ? 'text-cuir' : 'text-charbon/75 hover:text-charbon'}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                  {isActive(link.href) && <span className="absolute -bottom-[26px] left-0 right-0 h-[2px] bg-cuir" />}
                </div>
              )
            )}
            <Link href="/contact" className="btn-primary !py-3 !px-5" data-testid="header-cta-button">
              Réserver
            </Link>
          </nav>
          <button
            className="lg:hidden inline-flex items-center justify-center h-11 w-11 rounded-[10px] border border-charbon/15 text-charbon"
            onClick={() => setOpen(true)}
            aria-label="Ouvrir le menu"
            data-testid="mobile-menu-open-button"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" data-testid="mobile-menu-panel">
          <div className="absolute inset-0 bg-charbon/40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm bg-ivoire shadow-2xl flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between px-5 h-[72px] border-b border-charbon/10">
              <Logo compact />
              <button
                className="inline-flex items-center justify-center h-11 w-11 rounded-[10px] border border-charbon/15"
                onClick={() => setOpen(false)}
                aria-label="Fermer le menu"
                data-testid="mobile-menu-close-button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col px-5 py-6 gap-1" aria-label="Navigation mobile">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.href}>
                    <button
                      className={`w-full flex items-center justify-between label-caps py-4 border-b border-charbon/10 ${isActive(link.href) ? 'text-cuir' : 'text-charbon'}`}
                      onClick={() => setSubOpen(!subOpen)}
                      aria-expanded={subOpen}
                      data-testid="mobile-prestations-toggle"
                    >
                      {link.label}
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${subOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {subOpen && (
                      <div className="flex flex-col pl-4 py-1">
                        <Link href={link.href} className={`label-caps py-3.5 ${pathname === link.href ? 'text-cuir' : 'text-charbon/70'}`}>
                          Toutes les prestations
                        </Link>
                        {link.children.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            data-testid={`mobile-nav-sub-${sub.label.toLowerCase()}`}
                            className={`label-caps py-3.5 ${pathname === sub.href ? 'text-cuir' : 'text-charbon/70'}`}
                            aria-current={pathname === sub.href ? 'page' : undefined}
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`label-caps py-4 border-b border-charbon/10 ${isActive(link.href) ? 'text-cuir' : 'text-charbon'}`}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <Link href="/contact" className="btn-primary mt-6" data-testid="mobile-menu-cta-button">
                Prendre rendez-vous
              </Link>
            </nav>
          </div>
        </div>
      )}

      {/* CTA fixe mobile (cahier des charges élément 2) */}
      {pathname !== '/contact' && !open && (
        <div className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
          <Link href="/contact" className="btn-primary w-full shadow-[var(--sb-shadow)]" data-testid="mobile-bottom-cta-button">
            <CalendarCheck className="h-4 w-4" />
            Prendre rendez-vous
          </Link>
        </div>
      )}
    </>
  );
};
