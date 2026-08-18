import { getSettings } from '@/lib/api';

export const metadata = {
  title: 'Politique de confidentialité',
  description: "Politique de confidentialité du site de Samuel Bocquillon, photographe de mariage : données collectées, cookies, droits RGPD.",
  alternates: { canonical: '/politique-de-confidentialite' },
  robots: { index: true },
};

export default async function ConfidentialitePage() {
  const settings = await getSettings();
  return (
    <main className="sb-section" data-testid="confidentialite-page">
      <div className="sb-container max-w-3xl">
        <p className="label-caps text-cognac">Informations légales</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl leading-[1.05] mt-4">Politique de confidentialité</h1>
        <div className="mt-9 space-y-8 text-[15.5px] leading-[1.75] text-charbon/85">
          <section>
            <h2 className="font-serif text-2xl mb-3">1. Responsable du traitement</h2>
            <p>Le présent site est édité par Samuel Bocquillon, photographe de mariage, basé à {settings.city} ({settings.region}). Contact : {settings.email} — {settings.phone}.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">2. Données collectées</h2>
            <p>Via le formulaire de contact, nous collectons : nom, adresse email, numéro de téléphone (facultatif), date et lieu de mariage (facultatifs) et votre message. Ces données sont utilisées exclusivement pour répondre à votre demande et établir un devis. Elles ne sont jamais vendues ni transmises à des tiers.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">3. Durée de conservation</h2>
            <p>Les demandes de contact sont conservées 3 ans maximum après le dernier échange, conformément aux recommandations de la CNIL.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">4. Cookies et mesure d'audience</h2>
            <p>Ce site utilise Google Analytics (mesure d'audience) et Google Maps (carte de localisation) uniquement après votre consentement explicite via le bandeau de cookies. Vous pouvez refuser sans que cela n'affecte votre navigation. Pour modifier votre choix, supprimez les cookies de votre navigateur puis rechargez le site.</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">5. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation et d'opposition sur vos données personnelles. Pour exercer ces droits, écrivez à {settings.email}. Vous pouvez également introduire une réclamation auprès de la CNIL (cnil.fr).</p>
          </section>
          <section>
            <h2 className="font-serif text-2xl mb-3">6. Hébergement et sécurité</h2>
            <p>Les données sont hébergées au sein de l'Union européenne et protégées par des mesures techniques appropriées (connexion chiffrée HTTPS, accès administrateur sécurisé).</p>
          </section>
        </div>
      </div>
    </main>
  );
}
