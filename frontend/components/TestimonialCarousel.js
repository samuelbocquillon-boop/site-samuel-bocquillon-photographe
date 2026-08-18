'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Carrousel de témoignages avec points de navigation (maquettes)
export const TestimonialCarousel = ({ testimonials, accent = true, framedAuthor = false, light = false }) => {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const items = testimonials.slice(0, 3);

  useEffect(() => {
    if (items.length <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % items.length), 7000);
    return () => clearInterval(t);
  }, [items.length]);

  if (!items.length) return null;
  const current = items[index];

  // Met en cognac le dernier mot de la citation (effet maquette : « On les ressent. »)
  const words = current.text.replace(/\s+$/, '').split(' ');
  const lastWord = words.pop();

  return (
    <div className="relative text-center max-w-3xl mx-auto" data-testid="home-testimonial-feature">
      <span className="absolute -left-2 sm:left-6 top-0 font-serif text-cognac text-7xl sm:text-8xl leading-none select-none" aria-hidden="true">“</span>
      <div className="min-h-[150px] sm:min-h-[130px] flex flex-col items-center justify-center px-8 sm:px-20">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={reduce ? {} : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? {} : { opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
          >
            <blockquote className="font-serif text-3xl sm:text-4xl lg:text-[40px] leading-[1.2] text-charbon">
              {accent ? (
                <>“{words.join(' ')} <span className="text-cognac">{lastWord}”</span></>
              ) : (
                <>“{words.join(' ')} {lastWord}”</>
              )}
            </blockquote>
            <figcaption className="label-caps text-charbon/60 mt-6">
              {framedAuthor ? `– ${current.author} –` : `— ${current.author}`}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-2.5 mt-7" data-testid="testimonial-carousel-dots">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Témoignage ${i + 1}`}
              data-testid={`testimonial-dot-${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? 'w-5 bg-cognac' : 'w-2 bg-pierre/60 hover:bg-pierre'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
