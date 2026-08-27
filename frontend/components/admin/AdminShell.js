'use client';
import { useState, useEffect, useCallback, useRef, createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, FileText, SquarePen, Image as ImageIcon, Briefcase, Images, MessageSquare, CalendarDays,
  MapPin, ClipboardList, Menu, Palette, Settings, ExternalLink, Power, ChevronDown, Plus,
  Loader2, Lock, X, FilePlus, Camera, UploadCloud, Star, LayoutGrid,
} from 'lucide-react';
import { apiFetch, getToken, setToken, clearToken } from '@/lib/adminApi';

// ---------- Contexte d'autosauvegarde (header) ----------
const AutosaveContext = createContext({ state: 'saved', setState: () => {} });
export const useAutosave = () => useContext(AutosaveContext);

const NAV = [
  { href: '/admin', label: 'Tableau de bord', icon: Home, title: 'Tableau de bord', subtitle: "Bienvenue dans l'administration de votre site." },
  { href: '/admin/pages', label: 'Pages', icon: FileText, title: 'Pages', subtitle: 'Gérez les pages de votre site.' },
  { href: '/admin/blog', label: 'Blog', icon: SquarePen, title: 'Blog', subtitle: 'Créez et publiez vos reportages.' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon, title: 'Portfolio', subtitle: 'Gérez vos galeries et vos images.' },
  { href: '/admin/galerie', label: 'Galerie', icon: LayoutGrid, title: 'Galerie', subtitle: 'Les photos du diaporama de la page Portfolio.' },
  { href: '/admin/prestations', label: 'Prestations', icon: Briefcase, title: 'Prestations', subtitle: 'Mariage, corporate, photobooth et formation.' },
  { href: '/admin/medias', label: 'Médias', icon: Images, title: 'Bibliothèque médias', subtitle: 'Toutes les images de votre site.' },
  { href: '/admin/temoignages', label: 'Témoignages', icon: MessageSquare, title: 'Témoignages', subtitle: 'Gérez les avis de vos clients.' },
  { href: '/admin/reservations', label: 'Réservations', icon: CalendarDays, title: 'Réservations', subtitle: 'Suivez vos demandes de la prise de contact au jour J.' },
  { href: '/admin/seo-local', label: 'SEO local', icon: MapPin, title: 'SEO local', subtitle: 'Informations de localisation et lieux de reportage.' },
  { href: '/admin/formulaires', label: 'Formulaires', icon: ClipboardList, title: 'Formulaires', subtitle: 'Les demandes envoyées depuis le site.' },
  { href: '/admin/navigation', label: 'Navigation', icon: Menu, title: 'Navigation', subtitle: 'Menu principal et pied de page.' },
  { href: '/admin/branding', label: 'Branding', icon: Palette, title: 'Branding', subtitle: 'Logos, couleurs et typographies.' },
  { href: '/admin/parametres', label: 'Paramètres', icon: Settings, title: 'Paramètres', subtitle: 'Coordonnées, réseaux sociaux et intégrations.' },
];

const NEW_MENU = [
  { label: 'Nouvelle page', icon: FilePlus, href: '/admin/pages' },
  { label: 'Nouvel article', icon: SquarePen, href: '/admin/blog?new=1' },
  { label: 'Nouveau reportage', icon: Camera, href: '/admin/portfolio' },
  { label: 'Nouvelle prestation', icon: Briefcase, href: '/admin/prestations' },
  { label: 'Nouveau témoignage', icon: Star, href: '/admin/temoignages' },
  { label: 'Nouveau média', icon: UploadCloud, href: '/admin/medias' },
];

const AUTOSAVE_UI = {
  saving: { dot: 'bg-[var(--ambre-txt)] animate-pulse', label: 'Enregistrement…' },
  saved: { dot: 'bg-[var(--succes-txt)]', label: 'Enregistré automatiquement' },
  error: { dot: 'bg-[var(--erreur-txt)]', label: 'Erreur de sauvegarde' },
};

export const AdminShell = ({ children }) => {
  const pathname = usePathname();
  const [authed, setAuthed] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [autosave, setAutosave] = useState('saved');
  const menuRef = useRef(null);

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

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const login = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', json: { username, password } });
      setToken(data.access_token);
      setAuthed(true);
    } catch {
      setError("Identifiants incorrects. Vérifiez votre nom d'utilisateur et votre mot de passe.");
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--fond-app)' }}>
        <Loader2 className="h-8 w-8 animate-spin text-cuir" />
      </div>
    );
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-5" style={{ background: 'var(--fond-app)' }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src="/monogramme-sb.webp" alt="" className="h-16 w-auto mx-auto" />
            <h1 className="font-serif text-3xl mt-4">Zone administrateur</h1>
            <p className="text-charbon/60 text-[14px] mt-2">Samuel Bocquillon — Gestion du site</p>
          </div>
          <form onSubmit={login} className="adm-card !rounded-[14px] p-7 space-y-4" data-testid="admin-login-form">
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

  const current = NAV.slice().sort((a, b) => b.href.length - a.href.length).find((n) => (n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))) || NAV[0];
  const saveUi = AUTOSAVE_UI[autosave] || AUTOSAVE_UI.saved;

  const Sidebar = (
    <aside className="w-[236px] shrink-0 h-full flex flex-col border-r" style={{ background: 'var(--fond-sidebar)', borderColor: 'var(--bordure)' }} data-testid="admin-sidebar">
      {/* Marque */}
      <div className="pt-6 pb-3 px-4 text-center">
        <img src="/monogramme-sb.webp" alt="Monogramme SB" className="h-16 w-auto mx-auto" />
        <p className="font-serif text-[12px] tracking-[0.18em] uppercase text-charbon mt-3">Samuel Bocquillon</p>
        <div className="mt-2.5 mx-auto max-w-[168px] border-y py-1.5" style={{ borderColor: 'var(--bordure)' }}>
          <p className="text-[7.5px] font-semibold tracking-[0.22em] uppercase" style={{ color: 'var(--texte-secondaire)' }}>Photographe de mariage</p>
        </div>
      </div>
      {/* Navigation */}
      <nav className="mt-2 flex-1 overflow-y-auto adm-scroll space-y-[2px]" aria-label="Navigation administrateur">
        {NAV.map((item) => {
          const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
          return (
            <div key={item.href} className="relative pr-3">
              {active && <span className="absolute left-0 top-1 bottom-1 w-[3px] bg-cognac" aria-hidden="true" />}
              <Link
                href={item.href}
                data-testid={`admin-nav-${item.href.replace('/admin', '').replace('/', '') || 'dashboard'}`}
                className={`flex items-center gap-3 h-10 rounded-[8px] pl-[14px] pr-2 ml-2 text-[14px] transition-colors duration-150 ${active ? 'font-medium text-charbon' : 'text-charbon/85 hover:bg-[var(--fond-actif)]/50'}`}
                style={active ? { background: 'var(--fond-actif)' } : undefined}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.5} style={{ color: active ? '#1A1A1A' : 'var(--texte-secondaire)' }} />
                {item.label}
              </Link>
            </div>
          );
        })}
      </nav>
      {/* Bloc compte */}
      <div className="p-3 shrink-0">
        <div className="adm-card p-3 flex items-center gap-2.5" data-testid="admin-account-block">
          <span className="h-[34px] w-[34px] rounded-full bg-cuir text-ivoire font-serif text-[13px] inline-flex items-center justify-center shrink-0">SB</span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium truncate">Samuel Bocquillon</p>
            <p className="text-[11.5px]" style={{ color: 'var(--texte-secondaire)' }}>Administrateur</p>
          </div>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-3 h-9 mt-1.5 rounded-[8px] text-[13px] text-charbon/80 hover:bg-[var(--fond-actif)]/60 transition-colors" data-testid="admin-view-site-link">
          Voir le site <ExternalLink className="h-3.5 w-3.5" style={{ color: 'var(--texte-secondaire)' }} />
        </a>
        <button onClick={logout} className="w-full flex items-center justify-between px-3 h-9 rounded-[8px] text-[13px] text-charbon/80 hover:bg-[var(--fond-actif)]/60 transition-colors" data-testid="admin-logout-button">
          Déconnexion <Power className="h-3.5 w-3.5" style={{ color: 'var(--texte-secondaire)' }} />
        </button>
      </div>
    </aside>
  );

  return (
    <AutosaveContext.Provider value={{ state: autosave, setState: setAutosave }}>
      <div className="min-h-screen p-2 sm:p-3" style={{ background: 'var(--fond-app)' }} data-testid="admin-dashboard">
        <div className="mx-auto max-w-[1680px] h-[calc(100vh-16px)] sm:h-[calc(100vh-24px)] rounded-[14px] border overflow-hidden flex relative" style={{ borderColor: 'var(--bordure)', background: 'var(--fond-app)' }}>
          {/* Sidebar desktop */}
          <div className="hidden lg:flex h-full">{Sidebar}</div>
          {/* Sidebar mobile (drawer) */}
          {sidebarOpen && (
            <div className="lg:hidden absolute inset-0 z-50 flex">
              <div className="h-full">{Sidebar}</div>
              <button className="flex-1 bg-charbon/30" aria-label="Fermer le menu" onClick={() => setSidebarOpen(false)} />
            </div>
          )}

          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="flex items-center justify-between gap-4 px-4 sm:px-6 pt-5 pb-4 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-[8px] border bg-white" style={{ borderColor: 'var(--bordure)' }} onClick={() => setSidebarOpen(true)} aria-label="Ouvrir le menu" data-testid="admin-burger">
                  <Menu className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <h1 className="font-serif text-[26px] sm:text-[30px] leading-tight text-charbon truncate" data-testid="admin-page-title">{current.title}</h1>
                  <p className="text-[13.5px] mt-0.5 truncate" style={{ color: 'var(--texte-secondaire)' }}>{current.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="hidden md:inline-flex items-center gap-2 text-[12.5px]" style={{ color: 'var(--texte-secondaire)' }} data-testid="admin-autosave-indicator">
                  <span className={`h-[6px] w-[6px] rounded-full ${saveUi.dot}`} />
                  {saveUi.label}
                </span>
                <a href="/" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 h-[38px] px-4 rounded-[8px] bg-white border text-[13px] font-medium text-charbon hover:bg-[var(--fond-actif)]/60 transition-colors" style={{ borderColor: 'var(--bordure)' }} data-testid="admin-header-view-site">
                  Voir le site <ExternalLink className="h-3.5 w-3.5" />
                </a>
                {/* Split button + Nouveau */}
                <div className="relative" ref={menuRef}>
                  <div className="flex h-[38px] rounded-[8px] overflow-hidden bg-cognac text-white">
                    <Link href="/admin/blog?new=1" className="inline-flex items-center gap-1.5 px-4 text-[13px] font-medium hover:bg-cuir transition-colors" data-testid="admin-new-button">
                      <Plus className="h-4 w-4" /> Nouveau
                    </Link>
                    <span className="w-px my-2 bg-white/20" aria-hidden="true" />
                    <button onClick={() => setMenuOpen(!menuOpen)} className="px-2.5 hover:bg-cuir transition-colors" aria-label="Choisir le type de contenu" aria-expanded={menuOpen} data-testid="admin-new-caret">
                      <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 z-40 bg-white border rounded-[10px] py-2 min-w-[220px]" style={{ borderColor: 'var(--bordure)', boxShadow: 'var(--ombre-menu)' }} data-testid="admin-new-menu">
                      {NEW_MENU.map((m) => (
                        <Link key={m.label} href={m.href} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-charbon hover:bg-[var(--fond-actif)] transition-colors" data-testid={`admin-new-${m.label.toLowerCase().replace(/[^a-z]+/g, '-')}`}>
                          <m.icon className="h-4 w-4" strokeWidth={1.5} style={{ color: 'var(--texte-secondaire)' }} />
                          {m.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </header>
            {/* Contenu */}
            <main className="flex-1 overflow-y-auto adm-scroll px-4 sm:px-6 pb-6">{children}</main>
          </div>
        </div>
      </div>
    </AutosaveContext.Provider>
  );
};
