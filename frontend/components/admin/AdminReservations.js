'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, ChevronDown, ChevronUp, Save } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

const STATUSES = [
  { id: 'nouvelle', label: 'Nouvelle', bg: 'var(--info-bg)', txt: 'var(--info-txt)' },
  { id: 'a_traiter', label: 'À traiter', bg: 'var(--ambre-bg)', txt: 'var(--ambre-txt)' },
  { id: 'confirmee', label: 'Confirmée', bg: 'var(--succes-bg)', txt: 'var(--succes-txt)' },
  { id: 'payee', label: 'Payée', bg: 'var(--succes-bg)', txt: 'var(--succes-txt)' },
  { id: 'terminee', label: 'Terminée', bg: '#F0EEE9', txt: 'var(--texte-secondaire)' },
  { id: 'annulee', label: 'Annulée', bg: 'var(--erreur-bg)', txt: 'var(--erreur-txt)' },
];

const statusOf = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(iso));
  } catch {
    return iso;
  }
};

// Pipeline de réservations basé sur les demandes du formulaire de contact
export const AdminReservations = () => {
  const [contacts, setContacts] = useState(null);
  const [filter, setFilter] = useState('toutes');
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});
  const [amounts, setAmounts] = useState({});
  const [saving, setSaving] = useState('');

  const load = useCallback(async () => {
    try {
      const data = await apiFetch('/contacts');
      setContacts(data);
      const n = {}, a = {};
      data.forEach((c) => {
        n[c.id] = c.pipeline_note || '';
        a[c.id] = c.pipeline_amount || '';
      });
      setNotes(n);
      setAmounts(a);
    } catch {
      setContacts([]);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (c, status) => {
    setSaving(c.id);
    try {
      await apiFetch(`/contacts/${c.id}/pipeline`, { method: 'PUT', json: { status } });
      setContacts((list) => list.map((x) => (x.id === c.id ? { ...x, pipeline_status: status } : x)));
    } catch {}
    setSaving('');
  };

  const saveDetail = async (c) => {
    setSaving(c.id);
    try {
      await apiFetch(`/contacts/${c.id}/pipeline`, { method: 'PUT', json: { status: c.pipeline_status || 'nouvelle', note: notes[c.id], amount: amounts[c.id] } });
      setContacts((list) => list.map((x) => (x.id === c.id ? { ...x, pipeline_status: x.pipeline_status || 'nouvelle', pipeline_note: notes[c.id], pipeline_amount: amounts[c.id] } : x)));
    } catch {}
    setSaving('');
  };

  if (!contacts)
    return (
      <div className="flex items-center justify-center gap-3 py-16" style={{ color: 'var(--texte-secondaire)' }}>
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  const filtered = filter === 'toutes' ? contacts : contacts.filter((c) => (c.pipeline_status || 'nouvelle') === filter);

  return (
    <div data-testid="admin-reservations">
      {/* Filtres par statut */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={() => setFilter('toutes')} className={`h-8 px-3.5 rounded-[8px] border text-[12.5px] font-medium transition-colors ${filter === 'toutes' ? 'bg-cognac text-white border-cognac' : 'bg-white text-charbon/70 hover:text-charbon'}`} style={filter !== 'toutes' ? { borderColor: 'var(--bordure)' } : undefined} data-testid="resa-filter-toutes">
          Toutes ({contacts.length})
        </button>
        {STATUSES.map((s) => {
          const count = contacts.filter((c) => (c.pipeline_status || 'nouvelle') === s.id).length;
          return (
            <button key={s.id} onClick={() => setFilter(s.id)} className={`h-8 px-3.5 rounded-[8px] border text-[12.5px] font-medium transition-colors ${filter === s.id ? 'bg-cognac text-white border-cognac' : 'bg-white text-charbon/70 hover:text-charbon'}`} style={filter !== s.id ? { borderColor: 'var(--bordure)' } : undefined} data-testid={`resa-filter-${s.id}`}>
              {s.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="adm-card mt-4 overflow-hidden">
        {filtered.length === 0 && (
          <p className="text-[13.5px] text-center py-12" style={{ color: 'var(--texte-secondaire)' }} data-testid="resa-empty">
            Aucune demande dans cette catégorie.
          </p>
        )}
        {filtered.map((c, i) => {
          const st = statusOf(c.pipeline_status || 'nouvelle');
          const isOpen = open === c.id;
          return (
            <div key={c.id} className={i > 0 ? 'border-t' : ''} style={i > 0 ? { borderColor: 'var(--bordure-douce)' } : undefined} data-testid={`resa-row-${c.id}`}>
              <div className="flex items-center gap-3 px-4 py-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-medium text-charbon truncate">{c.name}</p>
                  <p className="text-[12px] truncate" style={{ color: 'var(--texte-secondaire)' }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                </div>
                <span className="text-[12.5px] whitespace-nowrap hidden md:block" style={{ color: 'var(--texte-secondaire)' }}>
                  {c.wedding_date ? `Mariage : ${c.wedding_date}` : `Reçue le ${fmtDate(c.created_at)}`}
                </span>
                {c.pipeline_amount && <span className="text-[12.5px] font-medium text-charbon whitespace-nowrap">{c.pipeline_amount} €</span>}
                <select
                  value={c.pipeline_status || 'nouvelle'}
                  onChange={(e) => setStatus(c, e.target.value)}
                  disabled={saving === c.id}
                  className="h-8 rounded-[6px] px-2.5 text-[11.5px] font-medium border-0 outline-none cursor-pointer"
                  style={{ background: st.bg, color: st.txt }}
                  data-testid={`resa-status-${c.id}`}
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <button onClick={() => setOpen(isOpen ? null : c.id)} className="h-8 w-8 inline-flex items-center justify-center rounded-[8px] border bg-white hover:border-cognac hover:text-cognac transition-colors" style={{ borderColor: 'var(--bordure)' }} aria-label="Détails" data-testid={`resa-toggle-${c.id}`}>
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              {isOpen && (
                <div className="px-4 pb-4 pt-1 grid grid-cols-1 md:grid-cols-2 gap-4" data-testid={`resa-detail-${c.id}`}>
                  <div>
                    <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--texte-tertiaire)' }}>Message</p>
                    <p className="text-[13px] leading-[1.7] text-charbon/80 whitespace-pre-wrap bg-ivoire/50 rounded-[8px] p-3">{c.message || '—'}</p>
                    {c.wedding_location && <p className="text-[12.5px] mt-2" style={{ color: 'var(--texte-secondaire)' }}>Lieu : {c.wedding_location}</p>}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--texte-tertiaire)' }}>Note interne</p>
                      <textarea className="sb-input min-h-[70px] !text-[13px]" value={notes[c.id] || ''} onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })} placeholder="Acompte reçu, devis envoyé…" data-testid={`resa-note-${c.id}`} />
                    </div>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: 'var(--texte-tertiaire)' }}>Montant (€)</p>
                        <input className="sb-input !py-2 !text-[13px]" value={amounts[c.id] || ''} onChange={(e) => setAmounts({ ...amounts, [c.id]: e.target.value })} placeholder="1850" data-testid={`resa-amount-${c.id}`} />
                      </div>
                      <button onClick={() => saveDetail(c)} disabled={saving === c.id} className="h-[38px] px-4 inline-flex items-center gap-2 rounded-[8px] bg-cognac text-white text-[12.5px] font-medium hover:bg-cuir transition-colors" data-testid={`resa-save-${c.id}`}>
                        {saving === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
