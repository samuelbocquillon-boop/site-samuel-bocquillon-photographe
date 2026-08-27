import { CITIES } from '@/lib/content';
import { CityPage } from '@/components/CityPage';

const city = CITIES.cambrai;

export const metadata = {
  title: `Photographe de mariage à Cambrai (59) — Reportages dans le Cambrésis`,
  description:
    "Photographe de mariage à Cambrai : de la citadelle à l'abbaye de Vaucelles, des images intemporelles dans tout le Cambrésis. Déplacement offert, collections à partir de 1 990 €.",
  alternates: { canonical: '/photographe-mariage-cambrai' },
};

export default function Page() {
  return <CityPage city={city} />;
}
