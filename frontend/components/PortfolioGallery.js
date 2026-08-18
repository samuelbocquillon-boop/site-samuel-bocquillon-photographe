'use client';
import { Fragment, useState } from 'react';
import { PORTFOLIO_FILTERS, PORTFOLIO_ITEMS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';

// Galerie mosaïque avec filtres séparés par traits verticaux (maquette portfolio)
export const PortfolioGallery = ({ images }) => {
  const [filter, setFilter] = useState('tous');
  const items = PORTFOLIO_ITEMS.filter((it) => filter === 'tous' || it.category === filter);

  return (
    <div id="galerie">
      {/* Filtres — onglets séparés par des traits verticaux, actif cognac souligné */}
      <div
        className="flex flex-wrap items-center justify-start lg:justify-center gap-y-3"
        role="tablist"
        aria-label="Filtres du portfolio"
        data-testid="portfolio-filter-tabs"
      >
        {PORTFOLIO_FILTERS.map((f, i) => (
          <Fragment key={f.id}>
            {i > 0 && <span className="hidden sm:block h-5 w-px bg-charbon/20 mx-5 lg:mx-9" aria-hidden="true" />}
            <button
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              data-testid={`portfolio-filter-tab-${f.id}`}
              className={`relative label-caps !text-[11.5px] py-2.5 pr-5 sm:pr-0 min-h-[44px] transition-colors duration-200 ${
                filter === f.id ? 'text-cognac' : 'text-charbon/55 hover:text-charbon'
              }`}
            >
              {f.label}
              <span
                className={`absolute left-0 right-5 sm:right-0 bottom-1.5 h-px bg-cognac transition-opacity duration-200 ${filter === f.id ? 'opacity-100' : 'opacity-0'}`}
                aria-hidden="true"
              />
            </button>
          </Fragment>
        ))}
      </div>

      {/* Mosaïque 4 colonnes */}
      <div className="masonry-portfolio mt-10 sm:mt-12" data-testid="portfolio-gallery">
        {items.map((it, idx) => {
          const img = images[it.slot];
          return (
            <figure key={it.slot} className="group relative overflow-hidden" data-testid={`portfolio-item-${idx + 1}`}>
              <SmartImage
                img={img}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] ${it.aspect}`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-charbon/0 group-hover:bg-charbon/10 transition-colors duration-500" aria-hidden="true" />
            </figure>
          );
        })}
      </div>
      {items.length === 0 && <p className="mt-10 text-pierre">Aucun reportage dans cette catégorie pour le moment.</p>}
    </div>
  );
};
