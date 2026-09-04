'use client';
// Lightbox diaporama plein écran — composant autonome et réutilisable.
// Crossfade doux ~700ms, effet Ken Burns lent (scale 100→105%, origine variable),
// autoplay 6.5s, clavier/swipe, préchargement n±1, verrou de scroll, focus trap,
// deep-link ?photo=n, prefers-reduced-motion respecté, a11y FR complète.
import { useState, useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const AUTOPLAY_MS = 6500;
const FADE_MS = 700;

// Origines de zoom variées + alternance avant/arrière pour éviter tout effet mécanique.
const KB_ORIGINS = ['center center', '20% 20%', '80% 80%', '80% 20%', '20% 80%', '50% 15%', '50% 85%', '15% 50%'];
const kbFor = (idx, reduce) => {
  if (reduce) return { animation: 'none', transformOrigin: 'center center' };
  const dir = idx % 2 === 0 ? 'kb-in' : 'kb-out';
  return { animation: `${dir} 9s ease-in-out forwards`, transformOrigin: KB_ORIGINS[idx % KB_ORIGINS.length] };
};

const LightboxImage = ({ photo, fadingOut, reduce, kb, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={
        reduce
          ? { opacity: fadingOut ? 0 : 1 }
          : { animation: `${fadingOut ? 'lb-fade-out' : 'lb-fade-in'} ${FADE_MS}ms ease forwards` }
      }
      aria-hidden={fadingOut ? 'true' : undefined}
    >
      <div
        className={fadingOut ? 'relative' : 'relative pointer-events-auto cursor-pointer'}
        onClick={fadingOut ? undefined : onClick}
        style={{ animation: kb.animation, transformOrigin: kb.transformOrigin, willChange: 'transform' }}
      >
        {/* Vignette basse résolution — placeholder instantané */}
        <img src={photo.src} alt="" aria-hidden="true" className="block max-h-[92vh] max-w-[92vw] object-contain select-none" draggable="false" />
        {/* Pleine résolution — fondu doux au chargement */}
        <img
          src={photo.full}
          alt={photo.alt}
          onLoad={() => setLoaded(true)}
          draggable="false"
          className="absolute inset-0 h-full w-full object-contain select-none"
          style={{ opacity: loaded ? 1 : 0, transition: reduce ? 'none' : 'opacity 300ms ease' }}
        />
      </div>
    </div>
  );
};

export const GalleryLightbox = ({ photos, startIndex = 0, onClose }) => {
  const [reduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [index, setIndex] = useState(startIndex);
  const [playing, setPlaying] = useState(!(typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  const [layers, setLayers] = useState([{ idx: startIndex, key: 0 }]);
  const layerKey = useRef(0);
  const fadeTimer = useRef(null);
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);
  const touchStart = useRef(null);
  const total = photos.length;
  const running = playing;

  const goTo = useCallback(
    (n) => {
      const next = ((n % total) + total) % total;
      layerKey.current += 1;
      setLayers((ls) => [ls[ls.length - 1], { idx: next, key: layerKey.current }]);
      setIndex(next);
      clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setLayers((ls) => ls.slice(-1)), reduce ? 0 : FADE_MS + 60);
    },
    [total, reduce]
  );

  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);
  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Autoplay — 6.5s, boucle infinie, reset à chaque changement d'image (manuel ou auto)
  useEffect(() => {
    if (!running) return undefined;
    const t = setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [running, index, goTo]);

  // Préchargement n+1 / n-1 (+n+2 si autoplay) — évite tout clignotement
  useEffect(() => {
    const preload = (i) => {
      const im = new window.Image();
      im.src = photos[((i % total) + total) % total].full;
    };
    preload(index + 1);
    preload(index - 1);
    if (playing) preload(index + 2);
  }, [index, playing, photos, total]);

  // Verrou du scroll body + restauration de la position
  useEffect(() => {
    const y = window.scrollY;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      window.scrollTo(0, y);
    };
  }, []);

  // Deep-link ?photo=n — replaceState pour ne pas polluer l'historique
  useEffect(() => {
    const u = new URL(window.location.href);
    u.searchParams.set('photo', String(index + 1));
    window.history.replaceState(null, '', u.toString());
  }, [index]);
  useEffect(
    () => () => {
      clearTimeout(fadeTimer.current);
      const u = new URL(window.location.href);
      u.searchParams.delete('photo');
      window.history.replaceState(null, '', u.toString());
    },
    []
  );

  // Focus initial + clavier global (flèches, espace, Esc, P) + focus trap
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setPlaying(false);
        goNext();
      } else if (e.key === ' ' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'A') {
        e.preventDefault();
        setPlaying(false);
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setPlaying(false);
        goPrev();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setPlaying((p) => !p);
      } else if (e.key === 'Tab') {
        const focusables = overlayRef.current?.querySelectorAll('button, a[href]');
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose]);

  // Tactile — swipe horizontal (±50px) = navigation, swipe vertical bas = fermeture
  const onTouchStart = (e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (dy > 70 && Math.abs(dy) > Math.abs(dx)) onClose();
    else if (dx <= -50) {
      setPlaying(false);
      goNext();
    } else if (dx >= 50) {
      setPlaying(false);
      goPrev();
    }
  };

  const stop = (e) => e.stopPropagation();

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Diaporama photo, image ${index + 1} sur ${total}`}
      className="fixed inset-0 z-[200]"
      style={{ background: 'rgba(20, 16, 14, 0.92)' }}
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      data-testid="gallery-lightbox"
    >
      {/* Couches d'images — crossfade doux ~700ms + Ken Burns */}
      {layers.map((l, li) => (
        <LightboxImage
          key={l.key}
          photo={photos[l.idx]}
          fadingOut={li < layers.length - 1}
          reduce={reduce}
          kb={kbFor(l.idx, reduce)}
          onClick={(e) => {
            e.stopPropagation();
            setPlaying(false);
            goNext();
          }}
        />
      ))}

      {/* Fermer — haut droit */}
      <button
        ref={closeBtnRef}
        onClick={(e) => {
          stop(e);
          onClose();
        }}
        aria-label="Fermer le diaporama"
        className="absolute top-3 right-3 sm:top-4 sm:right-5 h-12 w-12 inline-flex items-center justify-center text-ivoire opacity-80 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
        data-testid="lightbox-close-button"
      >
        <X className="h-8 w-8" strokeWidth={1} />
      </button>

      {/* Flèches discrètes */}
      <button
        onClick={(e) => {
          stop(e);
          setPlaying(false);
          goPrev();
        }}
        aria-label="Image précédente"
        className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 h-14 w-12 sm:w-14 inline-flex items-center justify-center text-ivoire opacity-40 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
        data-testid="lightbox-prev-button"
      >
        <ChevronLeft className="h-10 w-10" strokeWidth={1} />
      </button>
      <button
        onClick={(e) => {
          stop(e);
          setPlaying(false);
          goNext();
        }}
        aria-label="Image suivante"
        className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 h-14 w-12 sm:w-14 inline-flex items-center justify-center text-ivoire opacity-40 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
        data-testid="lightbox-next-button"
      >
        <ChevronRight className="h-10 w-10" strokeWidth={1} />
      </button>

      {/* Barre basse épurée — lecture/pause + compteur léger */}
      <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 select-none" onClick={stop}>
        <button
          onClick={(e) => {
            stop(e);
            setPlaying((p) => !p);
          }}
          aria-label={playing ? 'Mettre en pause la lecture automatique' : 'Lancer la lecture automatique'}
          className="h-10 w-10 inline-flex items-center justify-center text-ivoire opacity-60 hover:opacity-100 focus-visible:opacity-100 transition-opacity duration-200"
          data-testid="lightbox-playpause-button"
        >
          {playing ? <Pause className="h-4 w-4" strokeWidth={1.5} /> : <Play className="h-4 w-4" strokeWidth={1.5} />}
        </button>
        <p className="label-caps !text-[12px] text-ivoire/75" data-testid="lightbox-counter">
          {index + 1} / {total}
        </p>
      </div>
    </div>
  );
};
