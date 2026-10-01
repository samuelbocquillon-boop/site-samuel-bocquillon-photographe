import Link from 'next/link';
import { Leaf, Heart, Gem } from 'lucide-react';
import { getImages } from '@/lib/api';
import { PARCOURS } from '@/lib/content';
import { SmartImage } from '@/components/SmartImage';
import { Reveal } from '@/components/Reveal';

export const metadata = {
  title: 'À propos — Une complicité avant tout',
  description:
    "Découvrez Samuel Bocquillon, photographe de mariage depuis 2009 : une approche moderne et spontanée, fondée sur la complicité — capturer l'instant et créer les images avec vous.",
  alternates: { canonical: '/a-propos' },
};

const VALEURS_APROPOS = [
  { icon: Leaf, title: 'Complicité', text: "Les plus belles images commencent bien avant de déclencher l'appareil. Apprendre à vous connaître et créer une vraie relation de confiance me permet de réaliser des photographies qui vous ressemblent vraiment." },
  { icon: Heart, title: 'Spontanéité', text: "Un regard, un rire, une larme, un mouvement imprévu… Je veux préserver tout ce qui fait la vérité d'une journée de mariage, sans transformer chaque instant en séance photo. Vous profitez. Je raconte." },
  { icon: Gem, title: 'Créativité', text: "Observer ne signifie pas simplement attendre. Quand une lumière, un lieu ou une idée peut créer une image forte, je vous propose quelque chose et nous la construisons ensemble. Certaines photographies se capturent. D'autres se créent ensemble." },
];

export default async function AProposPage() {
  const images = await getImages();

  return (
    <main>
      {/* HERO ÉDITORIAL — 2 colonnes : texte à gauche, portrait + carte citation à droite */}
      <section className="sb-container pt-10 sm:pt-16 pb-14 sm:pb-20" data-testid="apropos-hero">
        {/* Mobile : titre → photo + citation → paragraphes. Desktop : inchangé (texte à gauche, photo à droite sur 2 lignes). */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-x-14 lg:gap-y-0 items-center">
          <Reveal className="lg:col-span-5 lg:self-end">
            <p className="label-caps text-charbon/60">Plus qu'un photographe,</p>
            <h1 className="font-serif font-medium text-6xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.02em] mt-3">
              À propos
            </h1>
            <p className="label-caps !text-[13px] sm:!text-[14px] text-cognac mt-5">Une complicité avant tout.</p>
            <span className="block h-[2px] w-10 bg-cognac mt-4" aria-hidden="true" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7 lg:row-span-2 lg:col-start-6 lg:row-start-1">
            <div className="relative lg:pr-16 lg:pb-16">
              <SmartImage
                img={images['apropos-portrait']}
                eager
                className="w-full aspect-[4/5] sm:aspect-[5/6] object-cover"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
              {/* Carte citation superposée */}
              <div className="lg:absolute lg:bottom-0 lg:right-0 bg-white shadow-[var(--sb-shadow)] p-7 sm:p-8 max-w-[300px] mt-[-3rem] ml-auto mr-4 relative lg:mt-0 lg:mr-0" data-testid="apropos-quote-card">
                <span className="font-serif text-cognac text-5xl leading-none select-none" aria-hidden="true">“</span>
                <p className="font-serif text-[19px] leading-[1.4] text-charbon -mt-3">
                  Vous vivez l'histoire.
                  <br />
                  Nous créons les images ensemble.
                </p>
                <img src="/signature-samuel-b.webp" alt="Signature de Samuel B." className="h-10 w-auto opacity-80 mt-4" loading="lazy" decoding="async" />
              </div>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="mt-0 lg:mt-7 text-[15.5px] sm:text-[16px] leading-[1.7] text-charbon/80 max-w-sm">
              Je suis Samuel, photographe de mariage depuis 2009. J'aime les images modernes, vivantes et spontanées,
              celles qui racontent réellement votre journée et votre personnalité.
            </p>
            <p className="mt-4 text-[15.5px] sm:text-[16px] leading-[1.7] text-charbon/80 max-w-sm">
              Ma façon de travailler repose avant tout sur la relation que nous allons créer ensemble. Pour moi, une belle
              image n'est jamais uniquement le travail du photographe : elle naît d'une confiance, d'un échange et d'une
              véritable complicité avec mes mariés.
            </p>
            <p className="mt-4 text-[15.5px] sm:text-[16px] leading-[1.7] text-charbon/80 max-w-sm">
              Je capture bien sûr tout ce qui se passe naturellement. Mais lorsque la lumière, un lieu ou une idée peut
              donner naissance à une image forte, je suis aussi là pour vous guider et la construire avec vous.
            </p>
            <Link href="/contact" className="btn-primary mt-8" data-testid="apropos-hero-cta-button">
              Parlons de votre histoire <span aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* MON APPROCHE — texte à gauche, photo couple à droite */}
      <section className="bg-white py-14 sm:py-20" data-testid="apropos-approche">
        <div className="sb-container grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <Reveal className="lg:col-span-5">
            <p className="label-caps text-charbon/60 flex items-center gap-3">
              Mon approche <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl leading-[1.05] mt-5">
              Capturer l'instant,
              <span className="block text-cognac italic">créer avec vous.</span>
            </h2>
            <p className="mt-6 text-[15.5px] leading-[1.7] text-charbon/80 max-w-md">
              Il y a des moments où mon rôle est simplement d'observer : un regard, un éclat de rire, une main qui se serre,
              une émotion que personne n'avait vue venir. Ces instants-là ne se provoquent pas. Ils se vivent, et je suis là
              pour les saisir.
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-charbon/80 max-w-md">
              Et puis il y a les images que nous allons imaginer ensemble. Une lumière incroyable, une architecture, un
              coucher de soleil, une idée un peu différente… Dans ces moments-là, je vous accompagne, je vous guide et nous
              construisons l'image à plusieurs.
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-charbon/80 max-w-md">
              Je ne cherche pas à vous faire jouer un rôle ou à reproduire les mêmes photographies à chaque mariage.{' '}
              <strong className="font-medium text-charbon">Le reportage doit vous ressembler.</strong>
            </p>
            <p className="mt-4 text-[15.5px] leading-[1.7] text-charbon/80 max-w-md">
              C'est ce mélange entre spontanéité et création qui donne à chaque mariage son identité.
            </p>
            <img src="/signature-samuel-b.webp" alt="Signature de Samuel B." className="h-14 w-auto opacity-85 mt-8" loading="lazy" decoding="async" />
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-7">
            <SmartImage
              img={images['apropos-approche']}
              className="w-full aspect-[4/3] object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          </Reveal>
        </div>
      </section>

      {/* MES VALEURS — 3 colonnes minimalistes avec icônes cerclées */}
      <section className="sb-section" data-testid="apropos-valeurs">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-charbon/60 flex items-center gap-3">
              Mes valeurs <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mt-12">
            {VALEURS_APROPOS.map((v, idx) => (
              <Reveal key={v.title} delay={idx * 0.08}>
                <div className="text-center px-4" data-testid={`valeur-${v.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                  <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-cognac/50 text-cognac">
                    <v.icon className="h-6 w-6" strokeWidth={1.5} />
                  </span>
                  <h3 className="font-serif text-2xl mt-6 tracking-wide">{v.title.toUpperCase()}</h3>
                  <p className="mt-4 text-[14.5px] leading-[1.7] text-charbon/70 max-w-[280px] mx-auto">{v.text}</p>
                  <span className="block h-[2px] w-8 bg-cognac/70 mx-auto mt-6" aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MON PARCOURS — timeline horizontale sur fond clair */}
      <section className="pb-14 sm:pb-20" data-testid="apropos-parcours">
        <div className="sb-container">
          <Reveal>
            <p className="label-caps text-charbon/60 flex items-center gap-3">
              Mon parcours <span className="h-px w-8 bg-cognac inline-block" aria-hidden="true" />
            </p>
          </Reveal>
          <div className="mt-12 relative">
            {/* Ligne horizontale (desktop) */}
            <div className="hidden lg:block absolute top-[46px] left-0 right-0 h-px bg-cognac/30" aria-hidden="true" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-x-5 gap-y-10">
              {PARCOURS.map((p, idx) => (
                <Reveal key={p.year} delay={idx * 0.05}>
                  <div className="text-center" data-testid={`parcours-${p.year}`}>
                    <p className="font-serif text-3xl text-charbon whitespace-nowrap">{p.year}</p>
                    <span className="relative z-10 block h-2.5 w-2.5 rounded-full bg-cognac mx-auto mt-3.5 ring-4 ring-ivoire" aria-hidden="true" />
                    <p className="mt-4 text-[13px] leading-[1.55] text-charbon/60">
                      <span className="block font-medium text-charbon mb-1">{p.title}</span>
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTE — phrase de transition éditoriale après la frise */}
      <section className="py-20 sm:py-28" data-testid="apropos-manifeste">
        <div className="sb-container">
          <Reveal className="max-w-[820px] mx-auto text-center">
            <span className="block h-[2px] w-10 bg-cognac mx-auto mb-8 sm:mb-10" aria-hidden="true" />
            <p className="font-serif font-light text-[24px] sm:text-[31px] lg:text-[34px] leading-[1.4] text-charbon/75">
              De la musique à la photographie, des mariages aux entreprises, puis de la création à la transmission :
              le métier a beaucoup changé depuis 2009.
            </p>
            <p className="font-serif italic text-[30px] sm:text-[42px] lg:text-[46px] leading-[1.2] text-charbon mt-6 sm:mt-7">
              La passion de raconter les gens, <span className="text-cognac">elle, est restée la même.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA FINAL — aligné à gauche sur photo */}
      <section className="relative py-20 sm:py-28" data-testid="apropos-cta">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage img={images['apropos-cta-fond']} className="h-full w-full object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-charbon/70 via-charbon/40 to-charbon/10" />
        </div>
        <div className="relative sb-container">
          <h2 className="font-serif font-medium text-ivoire text-4xl sm:text-5xl lg:text-6xl leading-[1.02] max-w-md">
            Parlons de <span className="italic">votre histoire.</span>
          </h2>
          <p className="mt-5 text-ivoire/85 text-[15.5px] leading-[1.7] max-w-sm">
            Chaque histoire mérite d'être racontée avec sincérité et passion.
          </p>
          <Link href="/contact" className="btn-light mt-8" data-testid="apropos-cta-button">
            Écrivons la vôtre <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
