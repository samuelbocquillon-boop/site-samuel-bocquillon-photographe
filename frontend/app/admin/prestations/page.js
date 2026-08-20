import Link from 'next/link';
import { Heart, Building2, PartyPopper, GraduationCap, ExternalLink } from 'lucide-react';

const PRESTATIONS = [
  { icon: Heart, title: 'Mariage', href: '/prestations/mariage', desc: 'Formules, approche et tarifs de la prestation mariage.' },
  { icon: Building2, title: 'Corporate', href: '/prestations/corporate', desc: 'Événements d’entreprise, portraits et reportages.' },
  { icon: PartyPopper, title: 'Photobooth', href: '/prestations/photobooth', desc: 'Borne photo, tirages instantanés et livre d’or.' },
  { icon: GraduationCap, title: 'Formation', href: '/prestations/formation', desc: 'Accompagnement des photographes en devenir.' },
];

export default function AdminPrestationsPage() {
  return (
    <div data-testid="admin-prestations">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PRESTATIONS.map((p) => (
          <div key={p.title} className="adm-card p-5 flex flex-col" data-testid={`admin-prestation-${p.title.toLowerCase()}`}>
            <span className="h-9 w-9 rounded-[9px] inline-flex items-center justify-center bg-ivoire">
              <p.icon className="h-[17px] w-[17px] text-cognac" strokeWidth={1.5} />
            </span>
            <h3 className="adm-title mt-3">{p.title}</h3>
            <p className="text-[12.5px] mt-1 flex-1" style={{ color: 'var(--texte-secondaire)' }}>{p.desc}</p>
            <a href={p.href} target="_blank" rel="noopener noreferrer" className="mt-4 h-[34px] inline-flex items-center justify-center gap-2 rounded-[8px] bg-white border border-cognac text-[12.5px] font-medium text-cognac hover:bg-cognac/5 transition-colors">
            Voir la page <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        ))}
      </div>
      <div className="adm-card p-5 mt-4">
        <p className="text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>
          L'édition complète des prestations (hero, textes, tarifs, formules, options, FAQ) arrive en Phase D.
          En attendant, les photographies de ces pages se gèrent depuis la rubrique <Link href="/admin/medias" className="text-cognac hover:underline">Médias</Link>.
        </p>
      </div>
    </div>
  );
}
