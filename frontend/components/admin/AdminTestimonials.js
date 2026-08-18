'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Trash2, Pencil, X, Check, Star } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

const EMPTY = { author: '', role: '', text: '', rating: 5, category: 'mariage', featured: false };
const CATEGORIES = ['mariage', 'corporate', 'formation', 'photobooth'];

export const AdminTestimonials = () => {
  const [items, setItems] = useState(null);
  const [editing, setEditing] = useState(null); // null | 'new' | id
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setItems(await apiFetch('/testimonials'));
    } catch {
      setError('Impossible de charger les témoignages.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setForm(EMPTY);
    setEditing('new');
  };
  const startEdit = (t) => {
    setForm({ author: t.author, role: t.role || '', text: t.text, rating: t.rating || 5, category: t.category || 'mariage', featured: !!t.featured });
    setEditing(t.id);
  };

  const save = async () => {
    if (!form.author.trim() || !form.text.trim()) {
      setError('Auteur et texte sont obligatoires.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editing === 'new') await apiFetch('/testimonials', { method: 'POST', json: form });
      else await apiFetch(`/testimonials/${editing}`, { method: 'PUT', json: form });
      setEditing(null);
      load();
    } catch {
      setError('Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    await apiFetch(`/testimonials/${id}`, { method: 'DELETE' });
    load();
  };

  if (!items)
    return (
      <div className="flex items-center gap-3 text-charbon/60 py-10 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  return (
    <div data-testid="admin-testimonials">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-serif text-3xl">Témoignages</h2>
          <p className="text-charbon/60 text-[14px] mt-1.5">Les avis affichés sur le site et la page Avis clients.</p>
        </div>
        <button onClick={startNew} className="btn-primary !py-3 !px-5" data-testid="admin-testimonial-add-button">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {editing && (
        <div className="bg-white rounded-[12px] border-2 border-cognac p-6 mt-6" data-testid="admin-testimonial-form">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-[16px]">{editing === 'new' ? 'Nouveau témoignage' : 'Modifier le témoignage'}</h3>
            <button onClick={() => setEditing(null)} aria-label="Fermer"><X className="h-4.5 w-4.5 text-charbon/50" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input className="sb-input" placeholder="Auteur (ex. Clara & Julien)" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} data-testid="admin-testimonial-author-input" />
            <input className="sb-input" placeholder="Rôle (ex. Mariés à Lille)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} data-testid="admin-testimonial-role-input" />
          </div>
          <textarea className="sb-input mt-4 min-h-[100px]" placeholder="Texte du témoignage…" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} data-testid="admin-testimonial-text-input" />
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <select className="sb-input !w-auto" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="admin-testimonial-category-select">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="sb-input !w-auto" value={form.rating} onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5, 4, 3].map((r) => <option key={r} value={r}>{r} étoiles</option>)}
            </select>
            <label className="inline-flex items-center gap-2 text-[14px] cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 accent-[#5A3A2E]" />
              Mis en avant
            </label>
          </div>
          {error && <p className="text-[#a03526] text-[13.5px] mt-3">{error}</p>}
          <button onClick={save} disabled={saving} className="btn-primary mt-4 !py-3" data-testid="admin-testimonial-save-button">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Enregistrer
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {items.map((t) => (
          <article key={t.id} className="bg-white rounded-[12px] border border-charbon/10 p-5" data-testid={`admin-testimonial-${t.id}`}>
            <div className="flex items-center justify-between">
              <div className="flex">
                {Array.from({ length: t.rating || 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-cognac text-cognac" />)}
              </div>
              <span className="label-caps !text-[9px] text-pierre border border-charbon/10 rounded-full px-2 py-0.5">{t.category}{t.featured ? ' · à la une' : ''}</span>
            </div>
            <p className="font-serif italic text-[16.5px] leading-[1.4] mt-3">“{t.text}”</p>
            <p className="text-[13px] font-semibold text-cognac mt-3">{t.author}</p>
            {t.role && <p className="text-pierre text-[12px]">{t.role}</p>}
            <div className="flex gap-2 mt-4">
              <button onClick={() => startEdit(t)} className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold border border-charbon/15 rounded-[8px] px-3 py-1.5 hover:border-charbon/40 transition-colors" data-testid={`admin-testimonial-edit-${t.id}`}>
                <Pencil className="h-3 w-3" /> Modifier
              </button>
              <button onClick={() => remove(t.id)} className="inline-flex items-center gap-1.5 text-[12.5px] text-charbon/50 hover:text-[#a03526] px-2 transition-colors" data-testid={`admin-testimonial-delete-${t.id}`}>
                <Trash2 className="h-3 w-3" /> Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
