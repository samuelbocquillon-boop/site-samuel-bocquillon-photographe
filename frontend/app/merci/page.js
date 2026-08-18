import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Merci — Votre demande a bien été envoyée',
  description: "Votre message a bien été envoyé à Samuel Bocquillon, photographe de mariage. Réponse garantie sous 24h.",
  robots: { index: false },
};

export default function MerciPage() {
  return (
    <main className="sb-section min-h-[70svh] flex items-center" data-testid="merci-page">
      <div className="sb-container text-center max-w-2xl">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-cuir/10 text-cuir">
          <CheckCircle2 className="h-10 w-10" />
        </span>
        <h1 className="font-serif font-medium text-5xl sm:text-6xl leading-[1] mt-8">
          Merci, votre message est <span className="italic">bien parti.</span>
        </h1>
        <p className="mt-6 text-[16.5px] leading-[1.7] text-charbon/80">
          Votre demande a bien été envoyée. Je vous réponds personnellement <strong>sous 24h</strong> — promis.
          En attendant, poursuivez la visite…
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/portfolio" className="btn-primary" data-testid="merci-portfolio-button">
            Découvrir le portfolio
          </Link>
          <Link href="/" className="btn-outline" data-testid="merci-home-button">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </main>
  );
}
