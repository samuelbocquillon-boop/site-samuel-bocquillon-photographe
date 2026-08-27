'use client';
// Admin — Galerie unifiée : collage de liens Cloudinary, alt optionnel,
// réorganisation par glisser-déposer, suppression.
import { useState, useEffect, useCallback, useRef } from 'react';
import { GripVertical, Trash2, Plus, Loader2, ArrowUp, ArrowDown, ImageOff } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';
import { useAutosave } from '@/components/admin/AdminShell';

export const AdminGallery = () => {
  const [items, setItems] = useState(null);
  const [urlsText, setUrlsText] = useState('');
  const [altText, setAltText] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const { setState: setAutosave } = useAutosave();
  const altTimers = useRef({});

  const load = useCallback(async () => {
    try {
      const d = await apiFetch('/gallery');
      setItems(d.items || []);
    } catch {
      setItems([]);
      setError('Impossible de charger la galerie.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const parseUrls = (text) =>
    text
      .split(/[\n\s]+/)
      .map((u) => u.trim())
      .filter(Boolean);

  const addPhotos = async (e) => {
    e.preventDefault();
    setError('');
    const urls = parseUrls(urlsText);
    if (urls.length === 0) {
      setError('Collez au moins un lien d\u2019image.');
      return;
    }
    const invalid = urls.find((u) => !/^https?:\/\//i.test(u));
    if (invalid) {
      setError(`Lien invalide : ${invalid.slice(0, 60)}… — il doit commencer par http(s)://`);
      return;
    }
    setAdding(true);
    setAutosave('saving');
    try {
      await apiFetch('/gallery', { method: 'POST', json: { urls, alt: urls.length === 1 ? altText : '' } });
      setUrlsText('');
      setAltText('');
      await load();
      setAutosave('saved');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\u2019ajout.');
      setAutosave('error');
    } finally {
      setAdding(false);
    }
  };

  const saveAlt = (id, alt) => {
    setItems((its) => its.map((it) => (it.id === id ? { ...it, alt, has_custom_alt: true } : it)));
    clearTimeout(altTimers.current[id]);
    altTimers.current[id] = setTimeout(async () => {
      setAutosave('saving');
      try {
        await apiFetch(`/gallery/${id}`, { method: 'PUT', json: { alt } });
        setAutosave('saved');
      } catch {
        setAutosave('error');
      }
    }, 600);
  };

  const removePhoto = async (id) => {
    if (!window.confirm('Supprimer cette photo de la galerie ?')) return;
    setAutosave('saving');
    try {
      await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
      setItems((its) => its.filter((it) => it.id !== id));
      setAutosave('saved');
    } catch {
      setAutosave('error');
    }
  };

  const persistOrder = async (list) => {
    setAutosave('saving');
    try {
      await apiFetch('/gallery/reorder', { method: 'PUT', json: { ids: list.map((it) => it.id) } });
      setAutosave('saved');
    } catch {
      setAutosave('error');
    }
  };

  const move = (from, to) => {
    if (to < 0 || to >= items.length || from === to) return;
    const list = [...items];
    const [it] = list.splice(from, 1);
    list.splice(to, 0, it);
    setItems(list);
    persistOrder(list);
  };

  const onDrop = (e, to) => {
    e.preventDefault();
    setOverIndex(null);
    if (dragIndex === null) return;
    move(dragIndex, to);
    setDragIndex(null);
  };

  if (items === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-cuir" />
      </div>
    );
  }

  return (
    <div className="space-y-5" data-testid="admin-gallery">
      {/* Ajout par collage de liens */}
      <form onSubmit={addPhotos} className="adm-card p-5 sm:p-6" data-testid="admin-gallery-add-form">
        <p className="label-caps text-charbon/60">Ajouter des photos</p>
        <p className="text-[13.5px] mt-2" style={{ color: 'var(--texte-secondaire)' }}>
          Collez un ou plusieurs liens Cloudinary (un par ligne). Les photos apparaissent immédiatement à la fin de la
          galerie, avec optimisation automatique. Faites glisser les vignettes pour changer l&apos;ordre.
        </p>
        <textarea
          className="sb-input mt-4 min-h-[92px] font-mono !text-[13px]"
          placeholder={'https://res.cloudinary.com/…/image/upload/v123/photo-1.jpg\nhttps://res.cloudinary.com/…/image/upload/v123/photo-2.jpg'}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
          data-testid="admin-gallery-urls-input"
        />
        {parseUrls(urlsText).length === 1 && (
          <input
            className="sb-input mt-3"
            placeholder="Texte alternatif SEO (optionnel) — ex : Mariés sous les confettis à Valenciennes"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            data-testid="admin-gallery-alt-input"
          />
        )}
        {error && (
          <p className="text-[#a03526] text-[13.5px] mt-3" role="alert" data-testid="admin-gallery-error">
            {error}
          </p>
        )}
        <div className="flex items-center justify-between mt-4">
          <p className="text-[13px]" style={{ color: 'var(--texte-secondaire)' }} data-testid="admin-gallery-count">
            {items.length} photo{items.length > 1 ? 's' : ''} dans la galerie
          </p>
          <button type="submit" className="btn-primary" disabled={adding} data-testid="admin-gallery-add-button">
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Ajouter à la galerie
          </button>
        </div>
      </form>

      {/* Liste des photos — drag & drop */}
      {items.length === 0 ? (
        <div className="adm-card p-10 text-center" data-testid="admin-gallery-empty">
          <ImageOff className="h-8 w-8 mx-auto" style={{ color: 'var(--texte-secondaire)' }} strokeWidth={1.5} />
          <p className="mt-3 text-[14.5px]" style={{ color: 'var(--texte-secondaire)' }}>
            La galerie est vide. Collez vos premiers liens ci-dessus.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" data-testid="admin-gallery-list">
          {items.map((it, i) => (
            <div
              key={it.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => {
                e.preventDefault();
                setOverIndex(i);
              }}
              onDragLeave={() => setOverIndex((o) => (o === i ? null : o))}
              onDrop={(e) => onDrop(e, i)}
              onDragEnd={() => {
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`adm-card overflow-hidden transition-opacity duration-150 ${dragIndex === i ? 'opacity-40' : ''} ${
                overIndex === i && dragIndex !== null && dragIndex !== i ? 'ring-2 ring-cognac' : ''
              }`}
              data-testid={`admin-gallery-item-${i + 1}`}
            >
              <div className="relative aspect-[4/3] bg-[var(--fond-actif)]">
                <img src={it.src} alt={it.alt} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
                <span className="absolute top-2 left-2 h-6 min-w-6 px-1.5 inline-flex items-center justify-center rounded-full bg-charbon/70 text-ivoire text-[11px] font-medium">
                  {i + 1}
                </span>
                <span className="absolute top-2 right-2 h-7 w-7 inline-flex items-center justify-center rounded-[6px] bg-white/85 cursor-grab active:cursor-grabbing" aria-hidden="true">
                  <GripVertical className="h-4 w-4 text-charbon/70" />
                </span>
              </div>
              <div className="p-3 space-y-2">
                <input
                  className="sb-input !h-9 !text-[12.5px]"
                  placeholder="Texte alternatif SEO (auto si vide)"
                  value={it.has_custom_alt ? it.alt : ''}
                  onChange={(e) => saveAlt(it.id, e.target.value)}
                  data-testid={`admin-gallery-item-alt-${i + 1}`}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(i, i - 1)}
                      disabled={i === 0}
                      aria-label="Monter la photo"
                      className="h-8 w-8 inline-flex items-center justify-center rounded-[6px] border text-charbon/70 hover:bg-[var(--fond-actif)] disabled:opacity-30 transition-colors"
                      style={{ borderColor: 'var(--bordure)' }}
                      data-testid={`admin-gallery-item-up-${i + 1}`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, i + 1)}
                      disabled={i === items.length - 1}
                      aria-label="Descendre la photo"
                      className="h-8 w-8 inline-flex items-center justify-center rounded-[6px] border text-charbon/70 hover:bg-[var(--fond-actif)] disabled:opacity-30 transition-colors"
                      style={{ borderColor: 'var(--bordure)' }}
                      data-testid={`admin-gallery-item-down-${i + 1}`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(it.id)}
                    aria-label="Supprimer la photo"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-[6px] text-[#a03526] hover:bg-[#a03526]/10 transition-colors"
                    data-testid={`admin-gallery-item-delete-${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
