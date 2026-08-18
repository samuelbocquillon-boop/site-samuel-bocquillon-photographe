import { CITIES } from '@/lib/content';
import { CityPage } from '@/components/CityPage';

const city = CITIES.lille;

export const metadata = {
  title: `Photographe de mariage à Lille (59) — Reportages dans toute la métropole`,
  description:
    "Photographe de mariage à Lille et dans la métropole lilloise : reportages authentiques du Vieux-Lille aux châteaux de la MEL. Déplacement offert, à partir de 1600 €. Réponse sous 24h.",
  alternates: { canonical: '/photographe-mariage-lille' },
};

export default function Page() {
  return <CityPage city={city} />;
}
