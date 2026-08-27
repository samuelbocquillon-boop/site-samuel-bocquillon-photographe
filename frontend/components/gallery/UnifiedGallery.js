'use client';
// Galerie unifiée — grille responsive anti-CLS + bouton « Voir plus » + lightbox diaporama.
import { useState, useEffect, useRef, useCallback } from 'react';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';

const PAGE_SIZE = 24;

export const UnifiedGallery = ({ photos }) => {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [openAt, setOpenAt] = useState(null);
  const thumbRefs = useRef([]);

  // Deep-link ?photo=n — ouverture directe sur la photo partagée
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('photo');
    const n = parseInt(p, 10);
    if (Number.isInteger(n) && n >= 1 && n <= photos.length) {
      setVisible((v) => Math.max(v, Math.ceil(n / PAGE_SIZE) * PAGE_SIZE));
      setOpenAt(n - 1);
    }
  }, [photos.length]);

  const close = useCallback(() => {
    const origin = openAt;
    setOpenAt(null);
    // Restaure le focus sur la vignette d'origine
    requestAnimationFrame(() => thumbRefs.current[origin]?.focus());
  }, [openAt]);

  return (
    <div>
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" data-testid="unified-gallery-grid">
        {photos.slice(0, visible).map((ph, i) => (
          <button
            key={ph.id}
            ref={(el) => {
              thumbRefs.current[i] = el;
            }}
            onClick={() => setOpenAt(i)}
            aria-label={`Ouvrir le diaporama à la photo ${i + 1} : ${ph.alt}`}
            className="group relative block w-full overflow-hidden aspect-[3/4] cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-cognac focus-visible:outline-offset-2"
            data-testid={`gallery-thumb-${i + 1}`}
          >
            <img
              src={ph.src}
              {...(ph.srcset ? { srcSet: ph.srcset } : {})}
              sizes="(max-width: 479px) 100vw, (max-width: 767px) 50vw, (max-width: 1279px) 33vw, 25vw"
              alt={ph.alt}
              loading={i < 4 ? 'eager' : 'lazy'}
              fetchPriority={i < 4 ? 'high' : undefined}
              decoding={i < 4 ? 'sync' : 'async'}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 bg-charbon/0 group-hover:bg-charbon/15 transition-colors duration-300" aria-hidden="true" />
          </button>
        ))}
      </div>

      {visible < photos.length && (
        <div className="text-center mt-10 sm:mt-12">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="label-caps !text-[12px] inline-flex items-center justify-center h-12 px-10 border border-charbon/30 text-charbon hover:border-cognac hover:text-cognac focus-visible:border-cognac transition-colors duration-200"
            data-testid="gallery-load-more-button"
          >
            Voir plus
          </button>
        </div>
      )}

      {openAt !== null && photos.length > 0 && <GalleryLightbox photos={photos} startIndex={openAt} onClose={close} />}
    </div>
  );
};
