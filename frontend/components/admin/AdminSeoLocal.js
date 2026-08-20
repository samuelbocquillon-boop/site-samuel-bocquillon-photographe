'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save, MapPin } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

const FIELDS = [
  ['address', 'Lieu / adresse', 'Valenciennes, Nord (59), France'],
  ['city', 'Ville', 'Valenciennes'],
  ['postal_code', 'Code postal', '59300'],
  ['department', 'Département', 'Nord (59)'],
  ['region', 'Région', 'Hauts-de-France'],
  ['country', 'Pays', 'FR'],
];

// SEO local — informations de l'entreprise + lieux déjà utilisés dans le blog
export const AdminSeoLocal = () => {
  const [settings, setSettings] = useState(null);
  const [locations, setLocations] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    apiFetch('/settings').then(setSettings).catch(() => setSettings({}));
    apiFetch('/blog/locations').then(setLocations).catch(() => setLocations({ venues: [], cities: [], departments: [] }));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const updated = await apiFetch('/settings', { method: 'PUT', json: settings });
      setSettings(updated);
      setMsg('Informations enregistrées ✓');
    } catch {
      setMsg("Échec de l'enregistrement.");
    }
    setSaving(false);
  };

  if (!settings || !locations)
    return (
      <div className="flex items-center justify-center gap-3 py-16" style={{ color: 'var(--texte-secondaire)' }}>
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" data-testid="admin-seo-local">
      {/* Informations entreprise */}
      <div className="adm-card p-5">
        <h3 className="adm-title">Informations de localisation</h3>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
          Utilisées dans le pied de page, la page contact et les données structurées LocalBusiness.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {FIELDS.map(([key, label, ph]) => (
            <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
              <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] block mb-1.5" style={{ color: 'var(--texte-tertiaire)' }}>{label}</label>
              <input className="sb-input !py-2.5 !text-[13px]" value={settings[key] || ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} placeholder={ph} data-testid={`seo-local-${key}`} />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-5">
          <button onClick={save} disabled={saving} className="h-[38px] px-4 inline-flex items-center gap-2 rounded-[8px] bg-cognac text-white text-[13px] font-medium hover:bg-cuir transition-colors" data-testid="seo-local-save">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer
          </button>
          {msg && <p className="text-[12.5px]" style={{ color: msg.includes('✓') ? 'var(--succes-txt)' : 'var(--erreur-txt)' }} data-testid="seo-local-msg">{msg}</p>}
        </div>
      </div>

      {/* Lieux de reportage */}
      <div className="adm-card p-5">
        <h3 className="adm-title">Lieux de reportage utilisés</h3>
        <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>
          Renseignés dans vos articles de blog — la base de lieux réutilisables (autocomplete) arrive en Phase D.
        </p>
        {['venues', 'cities', 'departments'].map((group) => (
          <div key={group} className="mt-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: 'var(--texte-tertiaire)' }}>
              {group === 'venues' ? 'Lieux / domaines' : group === 'cities' ? 'Villes' : 'Départements'}
            </p>
            <div className="flex flex-wrap gap-2">
              {(locations[group] || []).length === 0 && <span className="text-[12.5px]" style={{ color: 'var(--texte-tertiaire)' }}>—</span>}
              {(locations[group] || []).map((v) => (
                <span key={v} className="inline-flex items-center gap-1.5 rounded-[6px] border bg-white px-2.5 py-1.5 text-[12.5px] text-charbon" style={{ borderColor: 'var(--bordure)' }}>
                  <MapPin className="h-3 w-3 text-cognac" /> {v}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
