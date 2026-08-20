import { NAV_LINKS } from '@/lib/content';
import { CornerDownRight } from 'lucide-react';

export default function AdminNavigationPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="admin-navigation">
      <div className="adm-card p-5">
        <h3 className="adm-title">Menu principal</h3>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
          Structure actuelle du menu — la réorganisation par glisser-déposer arrive en Phase D.
        </p>
        <div className="mt-4 space-y-1.5">
          {NAV_LINKS.map((l) => (
            <div key={l.href}>
              <div className="flex items-center justify-between h-[38px] px-3 rounded-[8px] border bg-white" style={{ borderColor: 'var(--bordure)' }}>
                <span className="text-[13px] text-charbon">{l.label}</span>
                <span className="text-[12px]" style={{ color: 'var(--texte-tertiaire)' }}>{l.href}</span>
              </div>
              {(l.children || []).map((c) => (
                <div key={c.href} className="flex items-center justify-between h-[34px] pl-8 pr-3 mt-1 rounded-[8px] border bg-white ml-5" style={{ borderColor: 'var(--bordure-douce)' }}>
                  <span className="inline-flex items-center gap-2 text-[12.5px] text-charbon/80">
                    <CornerDownRight className="h-3.5 w-3.5" style={{ color: 'var(--texte-tertiaire)' }} /> {c.label}
                  </span>
                  <span className="text-[11.5px]" style={{ color: 'var(--texte-tertiaire)' }}>{c.href}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="adm-card p-5">
        <h3 className="adm-title">Pied de page</h3>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
          Liens actuels du footer : Accueil, À propos, Portfolio, Prestations, Blog, Avis clients, Contact, pages villes SEO et pages légales.
        </p>
        <p className="text-[13px] mt-4" style={{ color: 'var(--texte-secondaire)' }}>
          L'édition complète (libellés, ordre, colonnes) sera disponible en Phase D.
        </p>
      </div>
    </div>
  );
}
