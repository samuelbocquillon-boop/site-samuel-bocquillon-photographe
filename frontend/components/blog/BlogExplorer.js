'use client';
// Filtres (catégorie, lieu, recherche) + grille 3/2/1 + pagination — fidèle à la maquette Blog
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronLeft, ChevronRight, Search, LayoutGrid, MapPin, RotateCcw } from 'lucide-react';
import { BlogCard } from './BlogCard';
import { BLOG_CATEGORIES } from '@/lib/blog';

const Dropdown = ({ icon: Icon, value, options, onChange, testid }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const current = options.find((o) => o.id === value) || options[0];
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        data-testid={testid}
        className="inline-flex items-center gap-2.5 label-caps !text-[11px] text-charbon/70 hover:text-charbon py-2 transition-colors duration-200"
      >
        {Icon && <Icon className="h-4 w-4 text-cognac" aria-hidden="true" />}
        {current.label}
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-30 bg-white border border-charbon/10 shadow-[var(--sb-shadow-soft)] py-2 min-w-[240px] max-h-[320px] overflow-y-auto" role="listbox">
          {options.map((o) => (
            <button
              key={o.id}
              type="button"
              role="option"
              aria-selected={o.id === value}
              data-testid={`${testid}-option-${o.id.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`}
              onClick={() => {
                onChange(o.id);
                setOpen(false);
              }}
              className={`block w-full text-left px-5 py-2.5 label-caps !text-[10px] transition-colors duration-150 ${o.id === value ? 'text-cuir bg-cuir/5' : 'text-charbon/60 hover:text-cuir hover:bg-cuir/5'}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function pageList(current, total) {
  const out = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - current) <= 1) out.push(i);
    else if (out[out.length - 1] !== '…') out.push('…');
  }
  return out;
}

export const BlogExplorer = ({ initialData, locations, initialCategory = 'tous', initialPage = 1 }) => {
  const [category, setCategory] = useState(initialCategory);
  const [lieu, setLieu] = useState('tous');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(initialPage);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  const filtersActive = category !== 'tous' || lieu !== 'tous' || q.trim() !== '';

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category !== 'tous') params.set('category', category);
        if (lieu !== 'tous') params.set('lieu', lieu);
        if (q.trim()) params.set('q', q.trim());
        params.set('page', String(page));
        const res = await fetch(`/api/blog/posts?${params.toString()}`, { signal: controller.signal });
        if (res.ok) setData(await res.json());
      } catch (e) {
        /* requête annulée */
      }
      setLoading(false);
    }, q.trim() ? 300 : 0);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [category, lieu, q, page]);

  const lieuOptions = [
    { id: 'tous', label: 'Tous les lieux' },
    ...(locations.venues || []).map((v) => ({ id: v, label: v })),
    ...(locations.cities || []).map((v) => ({ id: v, label: v })),
    ...(locations.departments || []).map((v) => ({ id: v, label: v })),
  ];

  const resetFilters = () => {
    setCategory('tous');
    setLieu('tous');
    setQ('');
    setPage(1);
  };

  const currentPage = data.page || page;
  const totalPages = data.pages || 1;

  return (
    <div data-testid="blog-explorer">
      {/* ---- Barre de filtres — disposition maquette ---- */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-0 py-2" data-testid="blog-filters">
        <div className="md:px-10">
          <Dropdown
            icon={LayoutGrid}
            value={category}
            options={BLOG_CATEGORIES.map((c) => (c.id === 'tous' ? { ...c, label: 'Toutes les catégories' } : c))}
            onChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
            testid="blog-filter-category"
          />
        </div>
        <span className="hidden md:block h-6 w-px bg-charbon/15" aria-hidden="true" />
        <div className="md:px-10">
          <Dropdown
            icon={MapPin}
            value={lieu}
            options={lieuOptions}
            onChange={(v) => {
              setLieu(v);
              setPage(1);
            }}
            testid="blog-filter-lieu"
          />
        </div>
        <span className="hidden md:block h-6 w-px bg-charbon/15" aria-hidden="true" />
        <div className="md:px-10 flex items-center gap-3">
          <Search className="h-4 w-4 text-cognac shrink-0" aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un article…"
            aria-label="Rechercher un article"
            data-testid="blog-search-input"
            className="bg-transparent border-b border-charbon/25 focus:border-cognac font-sans font-semibold text-[10.5px] tracking-[0.18em] uppercase text-charbon placeholder:text-charbon/40 py-2 w-[210px] sm:w-[230px] outline-none transition-colors duration-200"
          />
        </div>
      </div>

      {/* ---- Grille d'articles 3 / 2 / 1 ---- */}
      {data.posts && data.posts.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-10 sm:mt-12 transition-opacity duration-200 ${loading ? 'opacity-50' : 'opacity-100'}`}
          data-testid="blog-grid"
        >
          {data.posts.map((post) => (
            <BlogCard key={post.id || post.slug} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20" data-testid="blog-empty-state">
          <p className="font-serif text-2xl text-charbon">Aucun article ne correspond à votre recherche.</p>
          <p className="text-[14px] text-charbon/60 mt-2">Essayez une autre catégorie, un autre lieu ou d'autres mots-clés.</p>
          <button type="button" onClick={resetFilters} className="btn-outline !rounded-none mt-7" data-testid="blog-reset-filters-button">
            <RotateCcw className="h-4 w-4" /> Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ---- Pagination — ← 1 2 3 … n → ---- */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 mt-12 sm:mt-14" aria-label="Pagination du blog" data-testid="blog-pagination">
          <PageArrow
            disabled={currentPage <= 1}
            direction="prev"
            filtersActive={filtersActive}
            target={currentPage - 1}
            onClick={() => setPage(currentPage - 1)}
          />
          {pageList(currentPage, totalPages).map((p, i) =>
            p === '…' ? (
              <span key={`e-${i}`} className="w-9 text-center text-charbon/40 select-none" aria-hidden="true">…</span>
            ) : filtersActive ? (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                aria-current={p === currentPage ? 'page' : undefined}
                data-testid={`blog-page-${p}`}
                className={`h-9 w-9 inline-flex items-center justify-center text-[13px] font-medium transition-colors duration-200 ${p === currentPage ? 'bg-cuir text-ivoire' : 'text-charbon/70 hover:text-cuir border border-transparent hover:border-cuir/30'}`}
              >
                {p}
              </button>
            ) : (
              <Link
                key={p}
                href={p === 1 ? '/blog' : `/blog/page/${p}`}
                aria-current={p === currentPage ? 'page' : undefined}
                data-testid={`blog-page-${p}`}
                className={`h-9 w-9 inline-flex items-center justify-center text-[13px] font-medium transition-colors duration-200 ${p === currentPage ? 'bg-cuir text-ivoire' : 'text-charbon/70 hover:text-cuir border border-transparent hover:border-cuir/30'}`}
              >
                {p}
              </Link>
            )
          )}
          <PageArrow
            disabled={currentPage >= totalPages}
            direction="next"
            filtersActive={filtersActive}
            target={currentPage + 1}
            onClick={() => setPage(currentPage + 1)}
          />
        </nav>
      )}
    </div>
  );
};

const PageArrow = ({ disabled, direction, filtersActive, target, onClick }) => {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight;
  const label = direction === 'prev' ? 'Page précédente' : 'Page suivante';
  const cls = `h-9 w-9 inline-flex items-center justify-center border transition-colors duration-200 ${disabled ? 'border-charbon/10 text-charbon/25 pointer-events-none' : 'border-charbon/20 text-charbon/70 hover:border-cuir hover:text-cuir'}`;
  if (disabled || filtersActive) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} aria-label={label} data-testid={`blog-pagination-${direction}`} className={cls}>
        <Icon className="h-4 w-4" />
      </button>
    );
  }
  return (
    <Link href={target === 1 ? '/blog' : `/blog/page/${target}`} aria-label={label} data-testid={`blog-pagination-${direction}`} className={cls}>
      <Icon className="h-4 w-4" />
    </Link>
  );
};
