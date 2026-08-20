'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Loader2, UploadCloud, Trash2, Check, RefreshCw, ImageIcon, Link2 } from 'lucide-react';
import { apiFetch, getToken, API } from '@/lib/adminApi';

// Gestion des images — page par page, emplacement par emplacement (cahier des charges §7)
export const AdminImages = () => {
  const [data, setData] = useState(null);
  const [activePage, setActivePage] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await apiFetch('/images');
      setData(d);
      if (!activePage && d.pages.length) setActivePage(d.pages[0]);
    } catch (e) {
      setError('Impossible de charger les images.');
    }
  }, [activePage]);

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  if (error) return <p className="text-[#a03526]">{error}</p>;
  if (!data)
    return (
      <div className="flex items-center gap-3 text-charbon/60 py-10 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement des emplacements…
      </div>
    );

  const slots = data.slots.filter((s) => s.page === activePage);

  return (
    <div data-testid="admin-image-manager">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-3xl">Images du site</h2>
          <p className="text-charbon/60 text-[14px] mt-1.5 max-w-xl">
            Gérez chaque image page par page. Les images envoyées sont automatiquement compressées,
            converties en WebP et redimensionnées en plusieurs tailles pour un site rapide.
          </p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-2 text-[13px] border border-charbon/15 rounded-[8px] px-3.5 py-2 hover:bg-white transition-colors" data-testid="admin-images-refresh">
          <RefreshCw className="h-3.5 w-3.5" /> Actualiser
        </button>
      </div>

      {/* Sélecteur de page */}
      <div className="flex gap-2 flex-wrap mt-6" data-testid="admin-page-selector">
        {data.pages.map((p) => {
          const count = data.slots.filter((s) => s.page === p).length;
          return (
            <button
              key={p}
              onClick={() => setActivePage(p)}
              data-testid={`admin-page-tab-${p.toLowerCase().replace(/[\s—]+/g, '-')}`}
              className={`rounded-full border px-4 py-2 text-[12.5px] font-medium transition-colors ${activePage === p ? 'bg-cuir text-ivoire border-cuir' : 'bg-white border-charbon/15 text-charbon/70 hover:border-charbon/40'}`}
            >
              {p} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-7">
        {slots.map((slot) => (
          <SlotCard key={slot.slot_key} slot={slot} onChanged={load} />
        ))}
      </div>
    </div>
  );
};

const SlotCard = ({ slot, onChanged }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [alt, setAlt] = useState(slot.alt || '');
  const [url, setUrl] = useState('');
  const [linking, setLinking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingAlt, setSavingAlt] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => setAlt(slot.alt || ''), [slot.alt]);

  const applyUrl = async () => {
    const clean = url.trim();
    if (!/^https?:\/\//i.test(clean)) {
      setErr('Collez un lien complet commençant par https://');
      return;
    }
    setLinking(true);
    setErr('');
    try {
      await apiFetch(`/images/${slot.slot_key}/url`, { method: 'PUT', json: { url: clean, alt: alt || slot.default_alt } });
      const isCloudinary = /res\.cloudinary\.com/.test(clean);
      setMsg(isCloudinary ? 'Image liée ✓ — optimisation Cloudinary automatique (f_auto, q_auto, tailles responsives)' : 'Image liée ✓');
      setUrl('');
      onChanged();
      setTimeout(() => setMsg(''), 5000);
    } catch {
      setErr("Impossible d'enregistrer ce lien. Vérifiez l'URL et réessayez.");
    } finally {
      setLinking(false);
    }
  };

  const pick = (f) => {
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setErr('Le fichier doit être une image (JPG, PNG, WebP…).');
      return;
    }
    setErr('');
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const upload = async () => {
    if (!file) return;
    setUploading(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('slot_key', slot.slot_key);
      fd.append('alt', alt || slot.default_alt);
      fd.append('file', file);
      const res = await fetch(`${API}/images/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      setMsg('Image remplacée et optimisée ✓');
      setFile(null);
      setPreview(null);
      onChanged();
      setTimeout(() => setMsg(''), 4000);
    } catch {
      setErr("Échec de l'envoi. Réessayez avec un autre fichier.");
    } finally {
      setUploading(false);
    }
  };

  const saveAlt = async () => {
    setSavingAlt(true);
    setErr('');
    try {
      await apiFetch(`/images/${slot.slot_key}/alt`, { method: 'PUT', json: { alt } });
      setMsg('Texte alternatif enregistré ✓');
      setTimeout(() => setMsg(''), 4000);
    } catch {
      setErr("Impossible d'enregistrer le texte alternatif.");
    } finally {
      setSavingAlt(false);
    }
  };

  const reset = async () => {
    if (!confirm('Revenir à l\'image par défaut pour cet emplacement ?')) return;
    try {
      await apiFetch(`/images/${slot.slot_key}`, { method: 'DELETE' });
      onChanged();
    } catch {
      setErr('Suppression impossible.');
    }
  };

  return (
    <div className="bg-white rounded-[12px] border border-charbon/10 p-5" data-testid={`admin-slot-${slot.slot_key}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium text-[15px]">{slot.label}</h3>
          <p className="text-charbon/55 text-[12.5px] mt-0.5">{slot.description}</p>
        </div>
        <span className={`label-caps !text-[9px] px-2.5 py-1 rounded-full shrink-0 ${slot.custom ? 'bg-cuir/10 text-cuir' : 'bg-charbon/5 text-charbon/50'}`}>
          {slot.custom ? 'Personnalisée' : 'Par défaut'}
        </span>
      </div>

      {/* Avant / après */}
      <div className={`grid ${preview ? 'grid-cols-2' : 'grid-cols-1'} gap-3 mt-4`}>
        <div>
          <p className="label-caps !text-[9.5px] text-pierre mb-1.5">{preview ? 'Actuelle' : 'Image actuelle'}</p>
          <img src={slot.url} alt={slot.alt} className="w-full aspect-[3/2] object-cover rounded-[8px] border border-charbon/10" loading="lazy" />
        </div>
        {preview && (
          <div>
            <p className="label-caps !text-[9.5px] text-cognac mb-1.5">Nouvelle (aperçu)</p>
            <img src={preview} alt="Aperçu de la nouvelle image" className="w-full aspect-[3/2] object-cover rounded-[8px] border-2 border-cognac" />
          </div>
        )}
      </div>

      {/* Lien Cloudinary (recommandé — aucune image stockée sur le serveur) */}
      <div className="mt-4">
        <label className="label-caps !text-[9.5px] text-cognac block mb-1.5" htmlFor={`url-${slot.slot_key}`}>
          <Link2 className="h-3 w-3 inline mr-1 -mt-0.5" />
          Lien de l'image — Cloudinary recommandé
        </label>
        <div className="flex gap-2">
          <input
            id={`url-${slot.slot_key}`}
            className="sb-input !py-2.5 text-[13px]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyUrl()}
            placeholder="https://res.cloudinary.com/…/image/upload/v…/photo.jpg"
            data-testid={`admin-url-input-${slot.slot_key}`}
          />
          <button
            onClick={applyUrl}
            disabled={linking || !url.trim()}
            className="shrink-0 inline-flex items-center gap-1.5 bg-cognac text-white rounded-[8px] px-4 text-[12.5px] font-semibold hover:bg-cuir disabled:opacity-50 transition-colors"
            data-testid={`admin-url-apply-${slot.slot_key}`}
          >
            {linking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Utiliser
          </button>
        </div>
        <p className="text-[11.5px] text-charbon/45 mt-1">
          Les liens Cloudinary sont optimisés automatiquement (format, compression, tailles responsives).
        </p>
      </div>

      {/* Zone de dépôt — alternative locale */}
      <div
        className={`mt-3 rounded-[10px] border-2 border-dashed p-3 text-center cursor-pointer transition-colors ${dragOver ? 'border-cognac bg-cognac/5' : 'border-charbon/15 hover:border-charbon/35'}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); pick(e.dataTransfer.files?.[0]); }}
        data-testid={`admin-dropzone-${slot.slot_key}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} data-testid={`admin-file-input-${slot.slot_key}`} />
        <p className="text-[12px] text-charbon/55 inline-flex items-center gap-1.5">
          <UploadCloud className="h-4 w-4 text-charbon/40" />
          {file ? file.name : 'ou envoyez un fichier depuis votre ordinateur'}
        </p>
      </div>

      {file && (
        <button onClick={upload} disabled={uploading} className="btn-primary w-full mt-3 !py-3" data-testid={`admin-upload-button-${slot.slot_key}`}>
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
          {uploading ? 'Optimisation en cours…' : 'Remplacer l\'image'}
        </button>
      )}

      {/* Alt text */}
      <div className="mt-4">
        <label className="label-caps !text-[9.5px] text-pierre block mb-1.5" htmlFor={`alt-${slot.slot_key}`}>
          Texte alternatif (SEO + accessibilité)
        </label>
        <div className="flex gap-2">
          <input
            id={`alt-${slot.slot_key}`}
            className="sb-input !py-2.5 text-[13.5px]"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            placeholder="Décrivez l'image en une phrase…"
            data-testid={`admin-alt-input-${slot.slot_key}`}
          />
          <button onClick={saveAlt} disabled={savingAlt} className="shrink-0 inline-flex items-center gap-1.5 border border-cuir text-cuir rounded-[8px] px-3.5 text-[12.5px] font-semibold hover:bg-cuir/5 transition-colors" data-testid={`admin-alt-save-${slot.slot_key}`}>
            {savingAlt ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            OK
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 min-h-[24px]">
        <div>
          {msg && <p className="text-[12.5px] text-[#2d7a3a]" data-testid={`admin-slot-success-${slot.slot_key}`}>{msg}</p>}
          {err && <p className="text-[12.5px] text-[#a03526]">{err}</p>}
        </div>
        {slot.custom && (
          <button onClick={reset} className="inline-flex items-center gap-1.5 text-[12px] text-charbon/50 hover:text-[#a03526] transition-colors" data-testid={`admin-reset-button-${slot.slot_key}`}>
            <Trash2 className="h-3.5 w-3.5" /> Image par défaut
          </button>
        )}
      </div>
    </div>
  );
};
