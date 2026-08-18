import Link from 'next/link';

// Rendu éditorial des blocs d'article — aspect reportage magazine haut de gamme

const Img = ({ image, className }) => {
  if (!image || !image.url) return null;
  return (
    <img
      src={image.url}
      {...(image.srcset ? { srcSet: image.srcset } : {})}
      alt={image.alt || ''}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};

function embedUrl(url) {
  if (!url) return '';
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

export const BlockRenderer = ({ blocks = [] }) => (
  <div className="space-y-9 sm:space-y-12" data-testid="article-blocks">
    {blocks.map((b, i) => {
      const key = b.id || `block-${i}`;
      switch (b.type) {
        case 'heading':
          return (
            <h2 key={key} className="font-serif font-medium text-3xl sm:text-4xl leading-[1.15] text-charbon max-w-[720px] mx-auto pt-3">
              {b.text}
            </h2>
          );
        case 'text':
          return (
            <div key={key} className="max-w-[720px] mx-auto space-y-5">
              {(b.text || '').split(/\n\n+/).map((p, j) => (
                <p key={j} className="text-[15px] leading-[1.9] text-charbon/80">
                  {p}
                </p>
              ))}
            </div>
          );
        case 'image':
          return (
            <figure key={key} className="max-w-[860px] mx-auto">
              <Img image={b} className="w-full object-cover" />
            </figure>
          );
        case 'image_full':
          return (
            <figure key={key}>
              <Img image={b} className="w-full aspect-[16/9] sm:aspect-[21/10] object-cover" />
            </figure>
          );
        case 'images_2':
          return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {(b.images || []).slice(0, 2).map((im, j) => (
                <Img key={j} image={im} className="w-full aspect-[4/5] object-cover" />
              ))}
            </div>
          );
        case 'images_3':
          return (
            <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {(b.images || []).slice(0, 3).map((im, j) => (
                <Img key={j} image={im} className="w-full aspect-[4/5] object-cover" />
              ))}
            </div>
          );
        case 'gallery':
          return (
            <div key={key} className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
              {(b.images || []).map((im, j) => (
                <Img key={j} image={im} className="w-full aspect-[4/5] object-cover" />
              ))}
            </div>
          );
        case 'quote':
          return (
            <blockquote key={key} className="max-w-[680px] mx-auto text-center py-4">
              <span className="font-serif text-cognac text-6xl leading-none select-none" aria-hidden="true">“</span>
              <p className="font-serif text-[22px] sm:text-[25px] leading-[1.5] text-charbon mt-1">{b.text}</p>
              {b.author && <footer className="label-caps !text-[10px] text-charbon/55 mt-5">{b.author}</footer>}
            </blockquote>
          );
        case 'spacer':
          return <div key={key} className="h-4 sm:h-8" aria-hidden="true" />;
        case 'button':
          return (
            <div key={key} className="max-w-[720px] mx-auto">
              <Link href={b.href || '/contact'} className="btn-primary !rounded-none" data-testid={`article-block-button-${i}`}>
                {b.label || 'En savoir plus'} <span aria-hidden="true">→</span>
              </Link>
            </div>
          );
        case 'video':
          return (
            <div key={key} className="max-w-[860px] mx-auto">
              <div className="relative w-full aspect-video bg-charbon/5">
                <iframe
                  src={embedUrl(b.url)}
                  title={b.title || 'Vidéo'}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
          );
        default:
          return null;
      }
    })}
  </div>
);
