'use client';
import { useState, useEffect } from 'react';
import { Loader2, Save } from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

const FIELDS = [
  { key: 'business_name', label: 'Nom de l\'entreprise', hint: 'Utilisé partout (SEO local : gardez-le identique à votre fiche Google)' },
  { key: 'address', label: 'Adresse complète', hint: 'Affichée au pied de page et sur la page contact' },
  { key: 'city', label: 'Ville' },
  { key: 'postal_code', label: 'Code postal' },
  { key: 'region', label: 'Région' },
  { key: 'phone', label: 'Téléphone', hint: 'Même format partout = meilleur SEO local (NAP)' },
  { key: 'email', label: 'Email' },
  { key: 'instagram', label: 'Lien Instagram' },
  { key: 'facebook', label: 'Lien Facebook' },
  { key: 'pinterest', label: 'Lien Pinterest (optionnel)' },
  { key: 'ga_id', label: 'Google Analytics ID', hint: 'Ex. G-XXXXXXXXXX — activé uniquement après consentement cookies' },
];

export const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/settings').then(setSettings).catch(() => setError('Chargement impossible.'));
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      await apiFetch('/settings', { method: 'PUT', json: settings });
      setMsg('Réglages enregistrés ✓ Ils sont appliqués immédiatement sur tout le site.');
      setTimeout(() => setMsg(''), 5000);
    } catch {
      setError('Enregistrement impossible.');
    } finally {
      setSaving(false);
    }
  };

  if (!settings)
    return (
      <div className="flex items-center gap-3 text-charbon/60 py-10 justify-center">
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement…
      </div>
    );

  return (
    <div data-testid="admin-settings">
      <h2 className="font-serif text-3xl">Réglages du site</h2>
      <p className="text-charbon/60 text-[14px] mt-1.5 max-w-xl">
        Coordonnées (NAP), réseaux sociaux et Google Analytics. Ces informations alimentent le pied de page,
        la page contact et les données structurées LocalBusiness (SEO local).
      </p>
      <div className="bg-white rounded-[12px] border border-charbon/10 p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.key === 'business_name' || f.key === 'address' ? 'md:col-span-2' : ''}>
            <label htmlFor={`setting-${f.key}`} className="label-caps !text-[10px] text-charbon/60 block mb-1.5">{f.label}</label>
            <input
              id={`setting-${f.key}`}
              className="sb-input !py-2.5"
              value={settings[f.key] ?? ''}
              onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
              data-testid={`admin-setting-${f.key}-input`}
            />
            {f.hint && <p className="text-pierre text-[11.5px] mt-1">{f.hint}</p>}
          </div>
        ))}
      </div>
      {msg && <p className="text-[#2d7a3a] text-[14px] mt-4" data-testid="admin-settings-success">{msg}</p>}
      {error && <p className="text-[#a03526] text-[14px] mt-4">{error}</p>}
      <button onClick={save} disabled={saving} className="btn-primary mt-5" data-testid="admin-settings-save-button">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Enregistrer les réglages
      </button>
    </div>
  );
};
