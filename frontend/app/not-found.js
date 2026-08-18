import Link from 'next/link';

export const metadata = {
  title: 'Page introuvable (404)',
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="sb-section min-h-[70svh] flex items-center" data-testid="not-found-page">
      <div className="sb-container text-center max-w-2xl">
        <p className="font-serif text-cognac text-8xl sm:text-9xl leading-none">404</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl leading-[1.05] mt-6">
          Cette page s'est <span className="italic">échappée du cadre.</span>
        </h1>
        <p className="mt-5 text-[16px] leading-[1.7] text-charbon/75">
          Comme un instant volé, elle n'existe plus — ou n'a jamais existé. Retrouvons ensemble le bon chemin.
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn-primary" data-testid="not-found-home-button">
            Retour à l'accueil
          </Link>
          <Link href="/portfolio" className="btn-outline" data-testid="not-found-portfolio-button">
            Voir le portfolio
          </Link>
        </div>
        <nav className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2" aria-label="Pages principales">
          <Link href="/a-propos" className="label-caps text-charbon/60 hover:text-cuir transition-colors">À propos</Link>
          <Link href="/prestations" className="label-caps text-charbon/60 hover:text-cuir transition-colors">Prestations</Link>
          <Link href="/avis" className="label-caps text-charbon/60 hover:text-cuir transition-colors">Avis</Link>
          <Link href="/contact" className="label-caps text-charbon/60 hover:text-cuir transition-colors">Contact</Link>
        </nav>
      </div>
    </main>
  );
}
