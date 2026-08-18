import { getSettings } from '@/lib/api';

export const metadata = {
  title: 'Mentions légales',
  description: "Mentions légales du site de Samuel Bocquillon, photographe de mariage à Valenciennes.",
  alternates: { canonical: '/mentions-legales' },
};

export default async function MentionsPage() {
  const settings = await getSettings();
  return (
    <main className="sb-section" data-testid="mentions-page">
      <div className="sb-container max-w-3xl">
        <p className="label-caps text-cognac">Informations légales</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl leading-[1.05] mt-4">Mentions légales</h1>
        <div className="mt-9 space-y-8 text-[15.5px] leading-[1.75] text-charbon/85">
          <section>
            <h2 className="font-serif text-2xl mb-3">Éditeur du site</h2>
            <p>
              Samuel Bocquillon — Photographe de mariage<br />
              {settings.address}<br />
              Téléphone : {settings.phone}<br />
              Email : {settings.email}<br />
              SIRET : [à compléter]
            </p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">Directeur de la publication</h2>
            <p>Samuel Bocquillon.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">Hébergement</h2>
            <p>Le site est hébergé sur une infrastructure cloud sécurisée au sein de l'Union européenne. [Coordonnées de l'hébergeur à compléter lors de la mise en production.]</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">Propriété intellectuelle</h2>
            <p>L'ensemble des photographies, textes et éléments graphiques présents sur ce site sont la propriété exclusive de Samuel Bocquillon, sauf mention contraire. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">Données personnelles</h2>
            <p>Consultez notre <a href="/politique-de-confidentialite" className="underline underline-offset-4 decoration-pierre hover:decoration-cognac">politique de confidentialité</a> pour tout ce qui concerne le traitement de vos données.</p>
          </section>
        </div>
      </div>
    </main>
  );
}
