import Link from 'next/link';
import { CATEGORY_CARD_LABEL, formatDateFr, cardLocation } from '@/lib/blog';

// Carte article — sobre : filet fin, blanc, hover discret (zoom image 1.02)
export const BlogCard = ({ post, headingLevel = 'h2' }) => {
  const Heading = headingLevel;
  const location = cardLocation(post);
  return (
    <article className="group flex flex-col bg-white border border-charbon/10 hover:border-charbon/20 transition-colors duration-200" data-testid={`blog-card-${post.slug}`}>
      <Link href={`/blog/${post.slug}`} className="block overflow-hidden" tabIndex={-1} aria-hidden="true">
        <img
          src={post.cover && post.cover.url}
          alt={(post.cover && post.cover.alt) || post.title}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-col flex-1 px-6 pt-6 pb-6 sm:px-7">
        <p className="label-caps !text-[10px] !tracking-[0.24em] text-cognac">{CATEGORY_CARD_LABEL[post.category] || post.category}</p>
        <Heading className="font-serif font-medium text-[22px] sm:text-[23px] leading-[1.2] text-charbon mt-2.5">
          <Link href={`/blog/${post.slug}`} className="hover:text-cuir transition-colors duration-200" data-testid={`blog-card-title-${post.slug}`}>
            {post.title}
          </Link>
        </Heading>
        {location && <p className="font-serif text-[16px] text-charbon/70 mt-1" data-testid={`blog-card-location-${post.slug}`}>{location}</p>}
        <p className="text-[13.5px] leading-[1.7] text-charbon/70 mt-3 line-clamp-2">{post.excerpt}</p>
        <div className="flex items-end justify-between gap-3 mt-auto pt-6">
          <Link
            href={`/blog/${post.slug}`}
            className="label-caps !text-[9.5px] !tracking-[0.2em] border border-charbon/25 text-charbon/80 px-4 py-2.5 hover:border-cuir hover:text-cuir transition-colors duration-200"
            data-testid={`blog-card-read-${post.slug}`}
          >
            Lire l'article
          </Link>
          <span className="label-caps !text-[9.5px] text-charbon/40">{formatDateFr(post.date)}</span>
        </div>
      </div>
    </article>
  );
};
