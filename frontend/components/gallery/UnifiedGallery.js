'use client';
// Galerie unifiée — mosaïque masonry (colonnes CSS) qui préserve le ratio d'origine
// de chaque photo, apparition en fondu, léger survol, + lightbox diaporama.
import { useState, useEffect, useRef, useCallback } from 'react';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';

const PAGE_SIZE = 24;

// Vignette autonome — gère son propre fondu à l'apparition (lazy loading).
const GalleryThumb = ({ ph, index, onOpen, thumbRef }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  // Si l'image est déjà en cache, `onLoad` peut se déclencher avant l'hydratation :
  // on vérifie `complete` au montage pour ne pas rester bloqué en opacity 0.
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete) setLoaded(true);
  }, []);

  return (
    <button
      ref={thumbRef}
      onClick={() => onOpen(index)}
      aria-label={`Ouvrir le diaporama à la photo ${index + 1} : ${ph.alt}`}
      className="group relative block w-full mb-2 sm:mb-[10px] overflow-hidden cursor-pointer break-inside-avoid focus-visible:outline focus-visible:outline-2 focus-visible:outline-cognac focus-visible:outline-offset-2"
      data-testid={`gallery-thumb-${index + 1}`}
    >
      <img
        ref={imgRef}
        src={ph.src}
        {...(ph.srcset ? { srcSet: ph.srcset } : {})}
        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        alt={ph.alt}
        loading={index < 3 ? 'eager' : 'lazy'}
        fetchPriority={index < 3 ? 'high' : undefined}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className="block w-full h-auto object-contain ease-out group-hover:scale-[1.02]"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 600ms ease, transform 400ms ease-out' }}
      />
      <span
        className="absolute inset-0 bg-charbon/0 group-hover:bg-charbon/15 transition-colors [transition-duration:400ms] ease-out"
        aria-hidden="true"
      />
    </button>
  );
};

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
      {/* Mosaïque masonry : 1 colonne mobile, 2 tablette, 3 desktop — ratios d'origine préservés */}
      <div
        className="columns-1 md:columns-2 lg:columns-3 [column-gap:8px] sm:[column-gap:10px]"
        data-testid="unified-gallery-grid"
      >
        {photos.slice(0, visible).map((ph, i) => (
          <GalleryThumb
            key={ph.id}
            ph={ph}
            index={i}
            onOpen={setOpenAt}
            thumbRef={(el) => {
              thumbRefs.current[i] = el;
            }}
          />
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
