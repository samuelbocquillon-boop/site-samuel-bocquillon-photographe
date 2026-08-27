import { CITIES } from '@/lib/content';
import { CityPage } from '@/components/CityPage';

const city = CITIES.valenciennes;

export const metadata = {
  title: `Photographe de mariage à Valenciennes (59) — Reportages authentiques`,
  description:
    "Photographe de mariage à Valenciennes : Samuel Bocquillon capture des histoires vraies dans tout le Valenciennois. Approche documentaire élégante, à partir de 1 990 €. Réponse sous 24h.",
  alternates: { canonical: '/photographe-mariage-valenciennes' },
};

export default function Page() {
  return <CityPage city={city} />;
}
