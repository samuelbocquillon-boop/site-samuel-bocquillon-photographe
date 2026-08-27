import { CITIES } from '@/lib/content';
import { CityPage } from '@/components/CityPage';

const city = CITIES.douai;

export const metadata = {
  title: `Photographe de mariage à Douai (59) — Reportages dans le Douaisis`,
  description:
    "Photographe de mariage à Douai : reportages documentaires élégants sous le beffroi UNESCO et dans tout le Douaisis. Déplacement offert depuis Valenciennes, à partir de 1 990 €.",
  alternates: { canonical: '/photographe-mariage-douai' },
};

export default function Page() {
  return <CityPage city={city} />;
}
