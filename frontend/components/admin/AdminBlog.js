'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Plus, Pencil, Copy, Trash2, Eye, EyeOff, RefreshCw, ExternalLink } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';
import { AdminBlogEditor } from './AdminBlogEditor';

const CATEGORY_LABELS = {
  mariages: 'Mariages',
  corporate: 'Corporate',
  photobooth: 'Photobooth',
  formations: 'Formations',
  conseils: 'Conseils',
  inspiration: 'Inspiration',
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
  } catch {
    return iso;
  }
};

// Gestion du blog — liste des articles + accès à l'éditeur par blocs
export const AdminBlog = () => {
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null | 'new' | post complet
  const [busy, setBusy] = useState('');

  const load = useCallback(async () => {
    try {
      const d = await apiFetch('/blog/admin/posts');
      setPosts(d);
    } catch {
      setError('Impossible de charger les articles.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openEditor = async (post) => {
    if (!post) {
      setEditing('new');
      return;
    }
    setBusy(post.id);
    try {
      const full = await apiFetch(`/blog/admin/posts/${post.id}`);
      setEditing(full);
    } catch {
      setError("Impossible d'ouvrir cet article.");
    } finally {
      setBusy('');
    }
  };

  const toggleStatus = async (post) => {
    setBusy(post.id);
    try {
      await apiFetch(`/blog/admin/posts/${post.id}/status`, { method: 'PUT', json: { status: post.status === 'published' ? 'draft' : 'published' } });
      await load();
    } catch {
      setError('Changement de statut impossible.');
    } finally {
      setBusy('');
    }
  };

  const duplicate = async (post) => {
    setBusy(post.id);
    try {
      await apiFetch(`/blog/admin/posts/${post.id}/duplicate`, { method: 'POST' });
      await load();
    } catch {
      setError('Duplication impossible.');
    } finally {
      setBusy('');
    }
  };

  const remove = async (post) => {
    if (!confirm(`Supprimer définitivement « ${post.title} » ?`)) return;
    setBusy(post.id);
    try {
      await apiFetch(`/blog/admin/posts/${post.id}`, { method: 'DELETE' });
      await load();
    } catch {
      setError('Suppression impossible.');
    } finally {
      setBusy('');
    }
  };

  if (editing) {
    return (
      <AdminBlogEditor
        post={editing === 'new' ? null : editing}
        onClose={(saved) => {
          setEditing(null);
          if (saved) load();
        }}
      />
    );
  }

  if (error && !posts) return <p className="text-[#a03526]">{error}</p>;
  if (!posts)
    return (
      <div className="flex items-center gap-3 text-charbon/60 py-10 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement des articles…
      </div>
    );

  return (
    <div data-testid="admin-blog-manager">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-serif text-3xl">Blog</h2>
          <p className="text-charbon/60 text-[14px] mt-1.5 max-w-xl">
            Créez et publiez vos reportages : lieu, ville, région, texte, galeries photos et informations SEO.
            Chaque article publié est ajouté automatiquement au site et au sitemap.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={load} className="inline-flex items-center gap-2 text-[13px] border border-charbon/15 rounded-[8px] px-3.5 py-2.5 hover:bg-white transition-colors" data-testid="admin-blog-refresh">
            <RefreshCw className="h-3.5 w-3.5" /> Actualiser
          </button>
          <button onClick={() => openEditor(null)} className="btn-primary !py-3 !px-5" data-testid="admin-blog-new-button">
            <Plus className="h-4 w-4" /> Nouvel article
          </button>
        </div>
      </div>

      {error && <p className="text-[#a03526] text-[13px] mt-4" role="alert">{error}</p>}

      <div className="mt-7 space-y-3">
        {posts.length === 0 && (
          <div className="bg-white rounded-[12px] border border-charbon/10 p-10 text-center" data-testid="admin-blog-empty">
            <p className="font-serif text-xl">Aucun article pour le moment.</p>
            <p className="text-charbon/60 text-[13.5px] mt-1">Cliquez sur « Nouvel article » pour raconter votre premier reportage.</p>
          </div>
        )}
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-[12px] border border-charbon/10 p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap" data-testid={`admin-blog-row-${post.slug}`}>
            <img
              src={post.cover && post.cover.url}
              alt={(post.cover && post.cover.alt) || post.title}
              className="h-16 w-24 object-cover rounded-[8px] border border-charbon/10 shrink-0"
              loading="lazy"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-medium text-[15px] truncate">{post.title}</h3>
                <span className={`label-caps !text-[8.5px] px-2 py-0.5 rounded-full ${post.status === 'published' ? 'bg-[#2d7a3a]/10 text-[#2d7a3a]' : 'bg-charbon/8 text-charbon/55'}`} data-testid={`admin-blog-status-${post.slug}`}>
                  {post.status === 'published' ? 'Publié' : 'Brouillon'}
                </span>
                {post.demo && <span className="label-caps !text-[8.5px] px-2 py-0.5 rounded-full bg-cognac/10 text-cognac">Démo</span>}
              </div>
              <p className="text-charbon/55 text-[12.5px] mt-1 truncate">
                {CATEGORY_LABELS[post.category] || post.category}
                {post.location && post.location.city ? ` · ${post.location.city}` : ''}
                {` · ${fmtDate(post.date)}`}
                {` · /blog/${post.slug}`}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {post.status === 'published' && (
                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" title="Voir l'article" className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/60 hover:text-charbon hover:border-charbon/35 transition-colors" data-testid={`admin-blog-view-${post.slug}`}>
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <button onClick={() => openEditor(post)} disabled={busy === post.id} title="Modifier" className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/60 hover:text-cuir hover:border-cuir transition-colors" data-testid={`admin-blog-edit-${post.slug}`}>
                {busy === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Pencil className="h-4 w-4" />}
              </button>
              <button onClick={() => toggleStatus(post)} disabled={busy === post.id} title={post.status === 'published' ? 'Dépublier' : 'Publier'} className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/60 hover:text-cuir hover:border-cuir transition-colors" data-testid={`admin-blog-toggle-${post.slug}`}>
                {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => duplicate(post)} disabled={busy === post.id} title="Dupliquer" className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/60 hover:text-cuir hover:border-cuir transition-colors" data-testid={`admin-blog-duplicate-${post.slug}`}>
                <Copy className="h-4 w-4" />
              </button>
              <button onClick={() => remove(post)} disabled={busy === post.id} title="Supprimer" className="h-9 w-9 inline-flex items-center justify-center rounded-[8px] border border-charbon/15 text-charbon/60 hover:text-[#a03526] hover:border-[#a03526]/40 transition-colors" data-testid={`admin-blog-delete-${post.slug}`}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
