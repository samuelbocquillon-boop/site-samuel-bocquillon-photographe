'use client';
import { useState, useRef } from 'react';
import {
  Loader2, ArrowLeft, Save, UploadCloud, Trash2, ChevronUp, ChevronDown, GripVertical, Plus,
  Type, AlignLeft, Image as ImageIcon, Images, Quote, MoveVertical, Link2, Video, GalleryHorizontal,
} from 'lucide-react';
import { apiFetch, getToken, API } from '@/lib/adminApi';

const CATEGORIES = [
  { id: 'mariages', label: 'Mariages' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'photobooth', label: 'Photobooth' },
  { id: 'formations', label: 'Formations' },
  { id: 'conseils', label: 'Conseils' },
  { id: 'inspiration', label: 'Inspiration' },
];

const BLOCK_TYPES = [
  { type: 'heading', label: 'Titre (H2)', icon: Type },
  { type: 'text', label: 'Texte', icon: AlignLeft },
  { type: 'image', label: 'Image', icon: ImageIcon },
  { type: 'image_full', label: 'Image pleine largeur', icon: ImageIcon },
  { type: 'images_2', label: '2 images côte à côte', icon: Images },
  { type: 'images_3', label: '3 images', icon: Images },
  { type: 'gallery', label: 'Galerie', icon: GalleryHorizontal },
  { type: 'quote', label: 'Citation', icon: Quote },
  { type: 'spacer', label: 'Espace', icon: MoveVertical },
  { type: 'button', label: 'Bouton', icon: Link2 },
  { type: 'video', label: 'Vidéo', icon: Video },
];

const BLOCK_LABEL = Object.fromEntries(BLOCK_TYPES.map((b) => [b.type, b.label]));

const slugify = (text) =>
  (text || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

const newBlock = (type) => {
  const id = `b-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  switch (type) {
    case 'heading': return { id, type, text: '' };
    case 'text': return { id, type, text: '' };
    case 'image': case 'image_full': return { id, type, url: '', alt: '' };
    case 'images_2': return { id, type, images: [{ url: '', alt: '' }, { url: '', alt: '' }] };
    case 'images_3': return { id, type, images: [{ url: '', alt: '' }, { url: '', alt: '' }, { url: '', alt: '' }] };
    case 'gallery': return { id, type, images: [] };
    case 'quote': return { id, type, text: '', author: '' };
    case 'spacer': return { id, type };
    case 'button': return { id, type, label: '', href: '/contact' };
    case 'video': return { id, type, url: '' };
    default: return { id, type };
  }
};

// ---- Champ image réutilisable : upload optimisé WebP + ALT individuel ----
const ImageField = ({ value, onChange, label = 'Image', testid, compact = false }) => {
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState('');
  const inputRef = useRef(null);

  const upload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    setErr('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('alt', value.alt || '');
      const res = await fetch(`${API}/blog/upload`, { method: 'POST', headers: { Authorization: `Bearer ${getToken()}` }, body: fd });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange({ ...value, url: data.url, srcset: data.srcset });
    } catch {
      setErr("Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-charbon/10 rounded-[10px] p-3 bg-ivoire/40" data-testid={testid}>
      <p className="label-caps !text-[9px] text-pierre mb-2">{label}</p>
      <div className="flex gap-3 items-start">
        <button
          type="button"
          onClick={() => inputRef.current && inputRef.current.click()}
          className={`shrink-0 ${compact ? 'h-16 w-24' : 'h-20 w-32'} rounded-[8px] border-2 border-dashed border-charbon/20 hover:border-cognac transition-colors overflow-hidden flex items-center justify-center bg-white`}
          data-testid={testid ? `${testid}-upload` : undefined}
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin text-cognac" />
          ) : value.url ? (
            <img src={value.url} alt={value.alt || ''} className="h-full w-full object-cover" />
          ) : (
            <UploadCloud className="h-5 w-5 text-charbon/40" />
          )}
        </button>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => upload(e.target.files && e.target.files[0])} />
        <div className="flex-1 space-y-2 min-w-0">
          <input
            className="sb-input !py-2 text-[12.5px]"
            placeholder="…ou collez une URL d'image"
            value={value.url || ''}
            onChange={(e) => onChange({ ...value, url: e.target.value })}
            data-testid={testid ? `${testid}-url` : undefined}
          />
          <input
            className="sb-input !py-2 text-[12.5px]"
            placeholder="Texte ALT — ex : Mariage au Château d'Aubry photographié par Samuel Bocquillon"
            value={value.alt || ''}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            data-testid={testid ? `${testid}-alt` : undefined}
          />
        </div>
      </div>
      {err && <p className="text-[#a03526] text-[12px] mt-1.5">{err}</p>}
    </div>
  );
};

const Field = ({ label, children, hint }) => (
  <div>
    <label className="label-caps !text-[9.5px] text-pierre block mb-1.5">{label}</label>
    {children}
    {hint && <p className="text-charbon/45 text-[11.5px] mt-1">{hint}</p>}
  </div>
);

const Section = ({ title, subtitle, children, testid }) => (
  <section className="bg-white rounded-[12px] border border-charbon/10 p-5 sm:p-6" data-testid={testid}>
    <h3 className="font-serif text-xl">{title}</h3>
    {subtitle && <p className="text-charbon/55 text-[12.5px] mt-1">{subtitle}</p>}
    <div className="mt-4 space-y-4">{children}</div>
  </section>
);

const EMPTY = {
  title: '',
  slug: '',
  excerpt: '',
  category: 'mariages',
  cover: { url: '', alt: '' },
  date: new Date().toISOString().slice(0, 10),
  author: 'Samuel Bocquillon',
  tags: [],
  location: { venue: '', city: '', postal_code: '', department: 'Nord – 59', region: 'Hauts-de-France', country: 'France' },
  seo: { meta_title: '', meta_description: '', keyword: '', og_image: '', canonical: '', noindex: false },
  blocks: [],
  status: 'draft',
};

// ---- Éditeur d'article complet : infos, SEO local, SEO, blocs drag & drop ----
export const AdminBlogEditor = ({ post, onClose }) => {
  const [form, setForm] = useState(() => {
    if (!post) return JSON.parse(JSON.stringify(EMPTY));
    return {
      ...JSON.parse(JSON.stringify(EMPTY)),
      ...post,
      cover: { ...EMPTY.cover, ...(post.cover || {}) },
      location: { ...EMPTY.location, ...(post.location || {}) },
      seo: { ...EMPTY.seo, ...(post.seo || {}) },
      blocks: (post.blocks || []).map((b, i) => ({ id: b.id || `b-${i}`, ...b })),
    };
  });
  const [slugTouched, setSlugTouched] = useState(!!post);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const dragIndex = useRef(null);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));
  const setLoc = (patch) => setForm((f) => ({ ...f, location: { ...f.location, ...patch } }));
  const setSeo = (patch) => setForm((f) => ({ ...f, seo: { ...f.seo, ...patch } }));

  const setBlock = (id, patch) => setForm((f) => ({ ...f, blocks: f.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  const removeBlock = (id) => setForm((f) => ({ ...f, blocks: f.blocks.filter((b) => b.id !== id) }));
  const addBlock = (type) => setForm((f) => ({ ...f, blocks: [...f.blocks, newBlock(type)] }));
  const moveBlock = (from, to) =>
    setForm((f) => {
      if (to < 0 || to >= f.blocks.length) return f;
      const blocks = [...f.blocks];
      const [item] = blocks.splice(from, 1);
      blocks.splice(to, 0, item);
      return { ...f, blocks };
    });

  const save = async (status) => {
    if (!form.title.trim()) {
      setErr('Le titre est obligatoire.');
      return;
    }
    setSaving(true);
    setErr('');
    try {
      const payload = {
        ...form,
        status: status || form.status,
        slug: form.slug || slugify(form.title),
        blocks: form.blocks.map(({ id, ...b }) => ({ id, ...b })),
      };
      delete payload.created_at;
      delete payload.updated_at;
      delete payload.published_at;
      delete payload.demo;
      delete payload.id;
      if (post && post.id) {
        await apiFetch(`/blog/admin/posts/${post.id}`, { method: 'PUT', json: payload });
      } else {
        await apiFetch('/blog/admin/posts', { method: 'POST', json: payload });
      }
      setMsg('Article enregistré ✓');
      setTimeout(() => onClose(true), 500);
    } catch (e) {
      setErr("Échec de l'enregistrement. Vérifiez les champs et réessayez.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid="admin-blog-editor">
      {/* Barre d'actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap sticky top-0 z-30 py-3 -my-3 rounded-[10px]" style={{ background: 'var(--fond-app)' }}>
        <button onClick={() => onClose(false)} className="inline-flex items-center gap-2 text-[13px] text-charbon/70 hover:text-charbon border border-charbon/15 rounded-[8px] px-3.5 py-2.5 transition-colors" data-testid="admin-blog-editor-back">
          <ArrowLeft className="h-4 w-4" /> Retour à la liste
        </button>
        <div className="flex items-center gap-2.5">
          {msg && <span className="text-[12.5px] text-[#2d7a3a]" data-testid="admin-blog-editor-success">{msg}</span>}
          {err && <span className="text-[12.5px] text-[#a03526]" role="alert" data-testid="admin-blog-editor-error">{err}</span>}
          <button onClick={() => save('draft')} disabled={saving} className="inline-flex items-center gap-2 border border-cuir text-cuir rounded-[8px] px-4 py-2.5 text-[12.5px] font-semibold hover:bg-cuir/5 transition-colors" data-testid="admin-blog-save-draft">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Brouillon
          </button>
          <button onClick={() => save('published')} disabled={saving} className="btn-primary !py-2.5 !px-5 !text-[11px]" data-testid="admin-blog-save-publish">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer & publier
          </button>
        </div>
      </div>

      <div className="space-y-5 mt-6">
        {/* ---- Informations principales ---- */}
        <Section title="Informations principales" testid="admin-blog-section-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Titre de l'article *">
              <input
                className="sb-input"
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  set(slugTouched ? { title } : { title, slug: slugify(title) });
                }}
                placeholder="Mariage au Château d'Aubry"
                data-testid="admin-blog-title-input"
              />
            </Field>
            <Field label="Slug (URL)" hint={`Adresse : /blog/${form.slug || slugify(form.title) || '…'}`}>
              <input
                className="sb-input"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set({ slug: slugify(e.target.value) });
                }}
                placeholder="mariage-chateau-aubry-aubry-du-hainaut"
                data-testid="admin-blog-slug-input"
              />
            </Field>
          </div>
          <Field label="Résumé (affiché sur les cartes — 2 lignes max)">
            <textarea className="sb-input min-h-[70px]" value={form.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="Un mariage élégant et raffiné dans un lieu chargé d'histoire." data-testid="admin-blog-excerpt-input" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Catégorie">
              <select className="sb-input" value={form.category} onChange={(e) => set({ category: e.target.value })} data-testid="admin-blog-category-select">
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input type="date" className="sb-input" value={form.date} onChange={(e) => set({ date: e.target.value })} data-testid="admin-blog-date-input" />
            </Field>
            <Field label="Auteur">
              <input className="sb-input" value={form.author} onChange={(e) => set({ author: e.target.value })} data-testid="admin-blog-author-input" />
            </Field>
          </div>
          <ImageField label="Image principale + texte ALT" value={form.cover} onChange={(cover) => set({ cover })} testid="admin-blog-cover" />
        </Section>

        {/* ---- SEO local ---- */}
        <Section title="SEO local — lieu du reportage" subtitle="Ces informations alimentent le référencement local (données structurées, filtres, articles liés)." testid="admin-blog-section-local">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Nom du lieu">
              <input className="sb-input" value={form.location.venue} onChange={(e) => setLoc({ venue: e.target.value })} placeholder="Château d'Aubry" data-testid="admin-blog-venue-input" />
            </Field>
            <Field label="Ville">
              <input className="sb-input" value={form.location.city} onChange={(e) => setLoc({ city: e.target.value })} placeholder="Aubry-du-Hainaut" data-testid="admin-blog-city-input" />
            </Field>
            <Field label="Code postal">
              <input className="sb-input" value={form.location.postal_code} onChange={(e) => setLoc({ postal_code: e.target.value })} placeholder="59494" data-testid="admin-blog-postal-input" />
            </Field>
            <Field label="Département">
              <input className="sb-input" value={form.location.department} onChange={(e) => setLoc({ department: e.target.value })} placeholder="Nord – 59" data-testid="admin-blog-department-input" />
            </Field>
            <Field label="Région">
              <input className="sb-input" value={form.location.region} onChange={(e) => setLoc({ region: e.target.value })} placeholder="Hauts-de-France" data-testid="admin-blog-region-input" />
            </Field>
            <Field label="Pays">
              <input className="sb-input" value={form.location.country} onChange={(e) => setLoc({ country: e.target.value })} placeholder="France" data-testid="admin-blog-country-input" />
            </Field>
          </div>
        </Section>

        {/* ---- SEO ---- */}
        <Section title="SEO" subtitle="Laissez vide pour utiliser automatiquement le titre et le résumé." testid="admin-blog-section-seo">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Meta title">
              <input className="sb-input" value={form.seo.meta_title} onChange={(e) => setSeo({ meta_title: e.target.value })} data-testid="admin-blog-metatitle-input" />
            </Field>
            <Field label="Mot-clé principal">
              <input className="sb-input" value={form.seo.keyword} onChange={(e) => setSeo({ keyword: e.target.value })} placeholder="photographe mariage château d'aubry" data-testid="admin-blog-keyword-input" />
            </Field>
          </div>
          <Field label="Meta description">
            <textarea className="sb-input min-h-[64px]" value={form.seo.meta_description} onChange={(e) => setSeo({ meta_description: e.target.value })} data-testid="admin-blog-metadesc-input" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Open Graph Image (URL)" hint="Vide = image principale.">
              <input className="sb-input" value={form.seo.og_image} onChange={(e) => setSeo({ og_image: e.target.value })} data-testid="admin-blog-ogimage-input" />
            </Field>
            <Field label="URL canonique" hint="Vide = URL de l'article.">
              <input className="sb-input" value={form.seo.canonical} onChange={(e) => setSeo({ canonical: e.target.value })} data-testid="admin-blog-canonical-input" />
            </Field>
          </div>
          <label className="inline-flex items-center gap-2.5 text-[13.5px] text-charbon/75 cursor-pointer">
            <input type="checkbox" checked={!form.seo.noindex} onChange={(e) => setSeo({ noindex: !e.target.checked })} className="h-4 w-4 accent-[#5A3A2E]" data-testid="admin-blog-index-checkbox" />
            Autoriser l'indexation par les moteurs de recherche
          </label>
        </Section>

        {/* ---- Contenu par blocs ---- */}
        <Section title="Contenu de l'article" subtitle="Ajoutez des blocs, puis réordonnez-les par glisser-déposer ou avec les flèches." testid="admin-blog-section-blocks">
          <div className="space-y-3">
            {form.blocks.length === 0 && (
              <p className="text-charbon/50 text-[13px] text-center py-6 border border-dashed border-charbon/15 rounded-[10px]">
                Aucun bloc pour le moment — ajoutez un titre, un texte ou des images ci-dessous.
              </p>
            )}
            {form.blocks.map((block, index) => (
              <div
                key={block.id}
                draggable
                onDragStart={() => { dragIndex.current = index; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex.current !== null && dragIndex.current !== index) moveBlock(dragIndex.current, index);
                  dragIndex.current = null;
                }}
                className="border border-charbon/10 rounded-[10px] bg-white"
                data-testid={`admin-blog-block-${index}`}
              >
                <div className="flex items-center gap-2 px-3 py-2 border-b border-charbon/8 bg-ivoire/50 rounded-t-[10px] cursor-grab active:cursor-grabbing">
                  <GripVertical className="h-4 w-4 text-charbon/35 shrink-0" />
                  <span className="label-caps !text-[9px] text-charbon/55 flex-1">{BLOCK_LABEL[block.type] || block.type}</span>
                  <button type="button" onClick={() => moveBlock(index, index - 1)} disabled={index === 0} title="Monter" className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] text-charbon/50 hover:text-charbon hover:bg-charbon/5 disabled:opacity-30 transition-colors" data-testid={`admin-blog-block-up-${index}`}>
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => moveBlock(index, index + 1)} disabled={index === form.blocks.length - 1} title="Descendre" className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] text-charbon/50 hover:text-charbon hover:bg-charbon/5 disabled:opacity-30 transition-colors" data-testid={`admin-blog-block-down-${index}`}>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => removeBlock(block.id)} title="Supprimer le bloc" className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] text-charbon/50 hover:text-[#a03526] hover:bg-[#a03526]/5 transition-colors" data-testid={`admin-blog-block-delete-${index}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="p-3.5">
                  <BlockEditor block={block} onChange={(patch) => setBlock(block.id, patch)} index={index} />
                </div>
              </div>
            ))}
          </div>

          {/* Ajout de blocs */}
          <div>
            <p className="label-caps !text-[9.5px] text-pierre mb-2">Ajouter un bloc</p>
            <div className="flex flex-wrap gap-2">
              {BLOCK_TYPES.map((bt) => (
                <button key={bt.type} type="button" onClick={() => addBlock(bt.type)} className="inline-flex items-center gap-1.5 border border-charbon/15 rounded-[8px] px-3 py-2 text-[12px] text-charbon/70 hover:border-cuir hover:text-cuir transition-colors" data-testid={`admin-blog-add-block-${bt.type}`}>
                  <Plus className="h-3 w-3" /> <bt.icon className="h-3.5 w-3.5" /> {bt.label}
                </button>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

const BlockEditor = ({ block, onChange, index }) => {
  const setImage = (i, img) => {
    const images = [...(block.images || [])];
    images[i] = img;
    onChange({ images });
  };
  switch (block.type) {
    case 'heading':
      return <input className="sb-input" value={block.text || ''} onChange={(e) => onChange({ text: e.target.value })} placeholder="La cérémonie" data-testid={`admin-blog-block-heading-${index}`} />;
    case 'text':
      return <textarea className="sb-input min-h-[120px]" value={block.text || ''} onChange={(e) => onChange({ text: e.target.value })} placeholder="Votre texte… (séparez les paragraphes par une ligne vide)" data-testid={`admin-blog-block-text-${index}`} />;
    case 'image':
    case 'image_full':
      return <ImageField label="Image + texte ALT" value={block} onChange={(v) => onChange(v)} testid={`admin-blog-block-image-${index}`} compact />;
    case 'images_2':
    case 'images_3':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(block.images || []).map((im, i) => (
            <ImageField key={i} label={`Image ${i + 1} + ALT`} value={im} onChange={(v) => setImage(i, v)} testid={`admin-blog-block-image-${index}-${i}`} compact />
          ))}
        </div>
      );
    case 'gallery':
      return (
        <div className="space-y-3">
          {(block.images || []).map((im, i) => (
            <div key={i} className="flex gap-2 items-start">
              <div className="flex-1">
                <ImageField label={`Photo ${i + 1} + ALT`} value={im} onChange={(v) => setImage(i, v)} testid={`admin-blog-block-gallery-${index}-${i}`} compact />
              </div>
              <button type="button" onClick={() => onChange({ images: block.images.filter((_, j) => j !== i) })} title="Retirer" className="h-9 w-9 mt-6 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/50 hover:text-[#a03526] transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => onChange({ images: [...(block.images || []), { url: '', alt: '' }] })} className="inline-flex items-center gap-1.5 border border-charbon/15 rounded-[8px] px-3 py-2 text-[12px] text-charbon/70 hover:border-cuir hover:text-cuir transition-colors" data-testid={`admin-blog-block-gallery-add-${index}`}>
            <Plus className="h-3 w-3" /> Ajouter une photo
          </button>
        </div>
      );
    case 'quote':
      return (
        <div className="space-y-3">
          <textarea className="sb-input min-h-[70px]" value={block.text || ''} onChange={(e) => onChange({ text: e.target.value })} placeholder="La citation…" data-testid={`admin-blog-block-quote-${index}`} />
          <input className="sb-input !py-2.5" value={block.author || ''} onChange={(e) => onChange({ author: e.target.value })} placeholder="Auteur (ex : Camille & Antoine)" />
        </div>
      );
    case 'spacer':
      return <p className="text-charbon/45 text-[12.5px]">Espace vertical — aucune option.</p>;
    case 'button':
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="sb-input !py-2.5" value={block.label || ''} onChange={(e) => onChange({ label: e.target.value })} placeholder="Texte du bouton" data-testid={`admin-blog-block-button-label-${index}`} />
          <input className="sb-input !py-2.5" value={block.href || ''} onChange={(e) => onChange({ href: e.target.value })} placeholder="/contact" data-testid={`admin-blog-block-button-href-${index}`} />
        </div>
      );
    case 'video':
      return <input className="sb-input" value={block.url || ''} onChange={(e) => onChange({ url: e.target.value })} placeholder="URL YouTube ou Vimeo" data-testid={`admin-blog-block-video-${index}`} />;
    default:
      return null;
  }
};
