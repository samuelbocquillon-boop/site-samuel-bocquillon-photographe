const ASSETS = [
  { key: 'logo', label: 'Logo principal', src: '/logo-samuel-bocquillon.webp', bg: 'bg-ivoire' },
  { key: 'monogramme', label: 'Monogramme SB', src: '/monogramme-sb.webp', bg: 'bg-ivoire' },
  { key: 'badge', label: 'Badge circulaire (hero)', src: '/badge-samuel-bocquillon.webp', bg: 'bg-cuir' },
  { key: 'signature', label: 'Signature Samuel B.', src: '/signature-samuel-b.webp', bg: 'bg-ivoire' },
  { key: 'favicon', label: 'Favicon', src: '/icon.png', bg: 'bg-white' },
];

const COLORS = [
  ['Noir charbon', '#1A1A1A'],
  ['Brun cuir', '#5A3A2E'],
  ['Brun cognac', '#8A5A44'],
  ['Or doux', '#B08D5E'],
  ['Ivoire', '#EFECE8'],
  ['Blanc', '#FFFFFF'],
];

export default function AdminBrandingPage() {
  return (
    <div className="space-y-4" data-testid="admin-branding">
      <div className="adm-card p-5">
        <h3 className="adm-title">Logos & signatures en place</h3>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
          Le remplacement direct depuis cette rubrique (sélecteur 3 options) arrive avec la médiathèque (Phases B–D).
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mt-4">
          {ASSETS.map((a) => (
            <div key={a.key} className="border rounded-[10px] overflow-hidden bg-white" style={{ borderColor: 'var(--bordure)' }} data-testid={`branding-${a.key}`}>
              <div className={`h-28 flex items-center justify-center ${a.bg} p-4`}>
                <img src={a.src} alt={a.label} className="max-h-full max-w-full object-contain" />
              </div>
              <p className="text-[12px] font-medium text-charbon px-3 py-2.5 border-t" style={{ borderColor: 'var(--bordure-douce)' }}>{a.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="adm-card p-5">
        <h3 className="adm-title">Palette de marque</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-4">
          {COLORS.map(([name, hex]) => (
            <div key={hex} className="border rounded-[10px] overflow-hidden bg-white" style={{ borderColor: 'var(--bordure)' }}>
              <div className="h-16" style={{ background: hex, borderBottom: '1px solid var(--bordure-douce)' }} />
              <div className="px-3 py-2">
                <p className="text-[12px] font-medium text-charbon">{name}</p>
                <p className="text-[11.5px]" style={{ color: 'var(--texte-secondaire)' }}>{hex}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="adm-card p-5">
        <h3 className="adm-title">Typographies</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3">
          <div className="border rounded-[10px] p-4 bg-white" style={{ borderColor: 'var(--bordure)' }}>
            <p className="font-serif text-2xl text-charbon">Cormorant Garamond</p>
            <p className="text-[11.5px] mt-1" style={{ color: 'var(--texte-secondaire)' }}>Titres serif éditoriaux</p>
          </div>
          <div className="border rounded-[10px] p-4 bg-white" style={{ borderColor: 'var(--bordure)' }}>
            <p className="text-xl text-charbon">Manrope</p>
            <p className="text-[11.5px] mt-1" style={{ color: 'var(--texte-secondaire)' }}>Texte, navigation, boutons</p>
          </div>
          <div className="border rounded-[10px] p-4 bg-white" style={{ borderColor: 'var(--bordure)' }}>
            <img src="/signature-samuel-b.webp" alt="Signature" className="h-9 w-auto" />
            <p className="text-[11.5px] mt-2" style={{ color: 'var(--texte-secondaire)' }}>Signature manuscrite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
