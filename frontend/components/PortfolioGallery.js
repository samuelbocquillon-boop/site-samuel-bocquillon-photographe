'use client';
import { useState } from 'react';
import { PORTFOLIO_FILTERS, PORTFOLIO_ITEMS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';

export const PortfolioGallery = ({ images }) => {
  const [filter, setFilter] = useState('tous');
  const items = PORTFOLIO_ITEMS.filter((it) => filter === 'tous' || it.category === filter);

  return (
    <div id="galerie">
      <div className="flex flex-wrap gap-2.5" role="tablist" aria-label="Filtres du portfolio" data-testid="portfolio-filter-tabs">
        {PORTFOLIO_FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            data-testid={`portfolio-filter-tab-${f.id}`}
            className={`rounded-full border px-4 py-2.5 label-caps !text-[11px] min-h-[44px] transition-colors duration-200 ${
              filter === f.id ? 'bg-charbon text-ivoire border-charbon' : 'border-charbon/20 text-charbon/70 hover:border-charbon/50 hover:text-charbon'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="masonry mt-10" data-testid="portfolio-gallery">
        {items.map((it, idx) => {
          const img = images[it.slot];
          return (
            <figure key={it.slot} className="group relative overflow-hidden rounded-[6px] border border-charbon/10" data-testid={`portfolio-item-${idx + 1}`}>
              <SmartImage
                img={img}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${idx % 3 === 1 ? 'aspect-[3/4]' : idx % 3 === 2 ? 'aspect-square' : 'aspect-[4/5]'}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charbon/70 to-transparent px-4 pb-3.5 pt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="label-caps !text-[10.5px] text-ivoire/90">{it.caption}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
      {items.length === 0 && <p className="mt-10 text-pierre">Aucun reportage dans cette catégorie pour le moment.</p>}
    </div>
  );
};
