'use client';
import { useState, useEffect } from 'react';
import { Loader2, ExternalLink, Pencil } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

// Liste des pages du site — l'édition par sections arrive en Phase C
export const AdminPages = () => {
  const [pages, setPages] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch('/admin/pages').then((d) => setPages(d.pages || [])).catch(() => setPages([]));
  }, []);

  if (!pages)
    return (
      <div className="flex items-center justify-center gap-3 py-16" style={{ color: 'var(--texte-secondaire)' }}>
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  return (
    <div className="adm-card p-5" data-testid="admin-pages">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h3 className="adm-title">Toutes les pages du site</h3>
          <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
            {pages.length} pages actives — l'éditeur de sections par page arrive dans la prochaine étape (Phase C).
          </p>
        </div>
        {msg && <p className="text-[12px]" style={{ color: 'var(--texte-tertiaire)' }} data-testid="admin-pages-msg">{msg}</p>}
      </div>
      <table className="w-full mt-4">
        <thead>
          <tr className="text-left border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
            {['Titre', 'Adresse', 'Statut', 'Actions'].map((h) => (
              <th key={h} className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--texte-tertiaire)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pages.map((p) => (
            <tr key={p.slug} className="border-b last:border-0" style={{ borderColor: 'var(--bordure-douce)' }} data-testid={`admin-page-row-${p.page_key}`}>
              <td className="py-2.5 pr-3 text-[13px] text-charbon">{p.title}</td>
              <td className="py-2.5 pr-3 text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>{p.slug}</td>
              <td className="py-2.5 pr-3"><span className="adm-badge" style={{ background: 'var(--succes-bg)', color: 'var(--succes-txt)' }}>Active</span></td>
              <td className="py-2.5">
                <div className="flex items-center gap-1.5">
                  <a href={p.slug} target="_blank" rel="noopener noreferrer" title="Voir la page" className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] border bg-white hover:border-cognac hover:text-cognac transition-colors" style={{ borderColor: 'var(--bordure)' }} data-testid={`admin-page-view-${p.page_key}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button onClick={() => setMsg("L'édition des sections de page arrive en Phase C.")} title="Éditer (Phase C)" className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] border bg-white opacity-60" style={{ borderColor: 'var(--bordure)' }} data-testid={`admin-page-edit-${p.page_key}`}>
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
