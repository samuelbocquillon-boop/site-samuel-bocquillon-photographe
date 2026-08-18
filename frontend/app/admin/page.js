'use client';
import { useState, useEffect, useCallback } from 'react';
import { Images, Inbox, MessageSquareQuote, Settings, LogOut, Loader2, Lock } from 'lucide-react';
import { Monogram } from '@/components/Logo';
import { apiFetch, getToken, setToken, clearToken } from '@/lib/adminApi';
import { AdminImages } from '@/components/admin/AdminImages';
import { AdminInbox } from '@/components/admin/AdminInbox';
import { AdminTestimonials } from '@/components/admin/AdminTestimonials';
import { AdminSettings } from '@/components/admin/AdminSettings';

const TABS = [
  { id: 'images', label: 'Images du site', icon: Images },
  { id: 'inbox', label: 'Demandes reçues', icon: Inbox },
  { id: 'testimonials', label: 'Témoignages', icon: MessageSquareQuote },
  { id: 'settings', label: 'Réglages', icon: Settings },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(null); // null = checking
  const [tab, setTab] = useState('images');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAuth = useCallback(async () => {
    if (!getToken()) {
      setAuthed(false);
      return;
    }
    try {
      await apiFetch('/auth/me');
      setAuthed(true);
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', json: { username, password } });
      setToken(data.access_token);
      setAuthed(true);
    } catch (err) {
      setError('Identifiants incorrects. Vérifiez votre nom d\'utilisateur et votre mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setAuthed(false);
  };

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cuir" />
      </div>
    );
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5 bg-ivoire">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Monogram className="h-16 w-16 text-cuir mx-auto" />
            <h1 className="font-serif text-3xl mt-4">Zone administrateur</h1>
            <p className="text-charbon/60 text-[14px] mt-2">Samuel Bocquillon — Gestion du site</p>
          </div>
          <form onSubmit={login} className="bg-white rounded-[14px] border border-charbon/10 shadow-[var(--sb-shadow-soft)] p-7 space-y-4" data-testid="admin-login-form">
            <div>
              <label htmlFor="admin-username" className="label-caps text-charbon/60 block mb-2">Identifiant</label>
              <input id="admin-username" data-testid="admin-username-input" className="sb-input" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
            </div>
            <div>
              <label htmlFor="admin-password" className="label-caps text-charbon/60 block mb-2">Mot de passe</label>
              <input id="admin-password" data-testid="admin-password-input" type="password" className="sb-input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
            </div>
            {error && <p className="text-[#a03526] text-[14px]" role="alert" data-testid="admin-login-error">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading} data-testid="admin-login-button">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Se connecter
            </button>
          </form>
          <p className="text-center text-pierre text-[13px] mt-5">
            <a href="/" className="hover:text-charbon transition-colors">← Retour au site</a>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ivoire" data-testid="admin-dashboard">
      <header className="bg-white border-b border-charbon/10 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Monogram className="h-9 w-9 text-cuir" />
            <div>
              <p className="font-serif text-[17px] leading-none">Administration</p>
              <p className="text-pierre text-[11px] mt-0.5">samuelbocquillon.fr</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="label-caps !text-[11px] text-charbon/60 hover:text-charbon transition-colors hidden sm:block" data-testid="admin-view-site-link">
              Voir le site →
            </a>
            <button onClick={logout} className="inline-flex items-center gap-2 text-[13px] font-medium text-charbon/70 hover:text-charbon border border-charbon/15 rounded-[8px] px-3.5 py-2 transition-colors" data-testid="admin-logout-button">
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
            </button>
          </div>
        </div>
        <nav className="max-w-6xl mx-auto px-5 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-testid={`admin-tab-${t.id}`}
              className={`inline-flex items-center gap-2 label-caps !text-[11px] px-4 py-3.5 border-b-2 whitespace-nowrap transition-colors ${tab === t.id ? 'border-cuir text-cuir' : 'border-transparent text-charbon/55 hover:text-charbon'}`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>
      </header>
      <div className="max-w-6xl mx-auto px-5 py-8">
        {tab === 'images' && <AdminImages />}
        {tab === 'inbox' && <AdminInbox />}
        {tab === 'testimonials' && <AdminTestimonials />}
        {tab === 'settings' && <AdminSettings />}
      </div>
    </main>
  );
}
