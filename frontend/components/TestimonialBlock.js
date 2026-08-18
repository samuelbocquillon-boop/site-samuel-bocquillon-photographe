// Bloc témoignage — grande citation Cormorant italique (maquettes)
export const TestimonialBlock = ({ quote, author, role, testid = 'testimonial-feature' }) => (
  <section className="sb-section" data-testid={testid}>
    <div className="sb-container text-center max-w-3xl">
      <span className="font-serif text-cognac text-6xl leading-none select-none" aria-hidden="true">“</span>
      <blockquote className="font-serif italic text-3xl sm:text-4xl lg:text-[42px] leading-[1.2] text-charbon -mt-4">
        {quote}
      </blockquote>
      <p className="label-caps text-cognac mt-7">{author}</p>
      {role && <p className="text-pierre text-[13px] mt-1.5">{role}</p>}
    </div>
  </section>
);
