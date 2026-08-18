import Link from 'next/link';
import { Sparkles, Instagram, Facebook } from 'lucide-react';
import { SmartImage } from '../SmartImage';

// Zone éditoriale brun cuir avant le footer — pages Blog uniquement (maquette)
export const BlogPreFooter = ({ settings, images }) => {
  const s = settings || {};
  return (
    <section className="bg-cuir sb-grain" data-testid="blog-prefooter">
      <div className="sb-container py-12 sm:py-14 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        {/* Bloc éditorial */}
        <div className="lg:col-span-4">
          <p className="label-caps !text-[10.5px] text-ivoire flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-ivoire/70 shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Photographe de mariage
              <br />
              Hauts-de-France
            </span>
          </p>
          <p className="mt-4 text-[13px] leading-[1.8] text-ivoire/75 max-w-xs">
            Basé dans le Nord, je me déplace dans toute la région et au-delà pour raconter votre histoire en images
            avec authenticité et élégance.
          </p>
          <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ivoire/45">
            <Link href="/photographe-mariage-valenciennes" className="hover:text-ivoire/80 transition-colors" data-testid="blog-prefooter-link-valenciennes">Photographe mariage Valenciennes</Link>
            <Link href="/photographe-mariage-lille" className="hover:text-ivoire/80 transition-colors" data-testid="blog-prefooter-link-lille">Photographe mariage Lille</Link>
            <Link href="/photographe-mariage-douai" className="hover:text-ivoire/80 transition-colors" data-testid="blog-prefooter-link-douai">Photographe mariage Douai</Link>
            <Link href="/photographe-mariage-cambrai" className="hover:text-ivoire/80 transition-colors" data-testid="blog-prefooter-link-cambrai">Photographe mariage Cambrai</Link>
          </p>
        </div>

        {/* 3 images (modifiables dans l'admin) */}
        <div className="lg:col-span-5 grid grid-cols-3 gap-3 sm:gap-4">
          {['blog-prefooter-1', 'blog-prefooter-2', 'blog-prefooter-3'].map((slot) => (
            <SmartImage
              key={slot}
              img={images && images[slot]}
              className="w-full aspect-square object-cover"
              sizes="(max-width: 1024px) 30vw, 15vw"
            />
          ))}
        </div>

        {/* Suivez-moi + CTA */}
        <div className="lg:col-span-3 lg:justify-self-end flex flex-col items-start lg:items-center gap-5">
          <p className="label-caps !text-[10.5px] text-ivoire/85">Suivez-moi</p>
          <div className="flex items-center gap-3" data-testid="blog-prefooter-socials">
            {s.instagram && (
              <a href={s.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" data-testid="blog-prefooter-instagram" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-ivoire/30 text-ivoire/85 hover:bg-ivoire/10 hover:text-ivoire transition-colors duration-200">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {s.facebook && (
              <a href={s.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" data-testid="blog-prefooter-facebook" className="h-10 w-10 inline-flex items-center justify-center rounded-full border border-ivoire/30 text-ivoire/85 hover:bg-ivoire/10 hover:text-ivoire transition-colors duration-200">
                <Facebook className="h-4 w-4" />
              </a>
            )}
          </div>
          <Link href="/contact" className="label-caps !text-[10.5px] border border-ivoire/40 text-ivoire px-6 py-3.5 hover:bg-ivoire/10 transition-colors duration-200" data-testid="blog-prefooter-contact-button">
            Me contacter
          </Link>
        </div>
      </div>
    </section>
  );
};
