'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Mail, Trash2, CheckCheck, Phone, Calendar, MapPin } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

export const AdminInbox = () => {
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setContacts(await apiFetch('/contacts'));
    } catch {
      setError('Impossible de charger les demandes.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markRead = async (id) => {
    await apiFetch(`/contacts/${id}/read`, { method: 'PUT' });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Supprimer définitivement cette demande ?')) return;
    await apiFetch(`/contacts/${id}`, { method: 'DELETE' });
    load();
  };

  if (error) return <p className="text-[#a03526]">{error}</p>;
  if (!contacts)
    return (
      <div className="flex items-center gap-3 text-charbon/60 py-10 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  return (
    <div data-testid="admin-inbox">
      <h2 className="font-serif text-3xl">Demandes reçues</h2>
      <p className="text-charbon/60 text-[14px] mt-1.5">
        {contacts.length} demande{contacts.length > 1 ? 's' : ''} — les nouvelles apparaissent en premier.
      </p>
      {contacts.length === 0 && (
        <div className="bg-white rounded-[12px] border border-charbon/10 p-10 text-center mt-6">
          <Mail className="h-8 w-8 text-pierre mx-auto" />
          <p className="text-charbon/60 mt-3">Aucune demande pour le moment.</p>
        </div>
      )}
      <div className="space-y-4 mt-6">
        {contacts.map((c) => (
          <article key={c.id} className={`bg-white rounded-[12px] border p-6 ${c.read ? 'border-charbon/10' : 'border-cognac shadow-[var(--sb-shadow-soft)]'}`} data-testid={`admin-contact-${c.id}`}>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-medium text-[16px]">{c.name}</h3>
                  {!c.read && <span className="label-caps !text-[9px] bg-cognac text-ivoire px-2 py-0.5 rounded-full">Nouveau</span>}
                </div>
                <a href={`mailto:${c.email}`} className="text-cuir text-[13.5px] hover:underline">{c.email}</a>
              </div>
              <p className="text-pierre text-[12.5px]">{c.created_at ? new Date(c.created_at).toLocaleString('fr-FR') : ''}</p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3 text-[13px] text-charbon/70">
              {c.phone && <span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-cognac" />{c.phone}</span>}
              {c.wedding_date && <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-cognac" />{c.wedding_date}</span>}
              {c.wedding_location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-cognac" />{c.wedding_location}</span>}
            </div>
            <p className="mt-4 text-[14.5px] leading-[1.65] text-charbon/85 whitespace-pre-wrap">{c.message}</p>
            <div className="flex gap-2.5 mt-5">
              {!c.read && (
                <button onClick={() => markRead(c.id)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold border border-cuir text-cuir rounded-[8px] px-3.5 py-2 hover:bg-cuir/5 transition-colors" data-testid={`admin-contact-read-${c.id}`}>
                  <CheckCheck className="h-3.5 w-3.5" /> Marquer comme lue
                </button>
              )}
              <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold bg-cuir text-ivoire rounded-[8px] px-3.5 py-2 hover:bg-[#4a3025] transition-colors">
                <Mail className="h-3.5 w-3.5" /> Répondre
              </a>
              <button onClick={() => remove(c.id)} className="inline-flex items-center gap-1.5 text-[12.5px] text-charbon/50 hover:text-[#a03526] px-2 transition-colors" data-testid={`admin-contact-delete-${c.id}`}>
                <Trash2 className="h-3.5 w-3.5" /> Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
