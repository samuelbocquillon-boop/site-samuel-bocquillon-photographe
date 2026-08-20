'use client';
// Tableau de bord — reproduction fidèle de la maquette (KPI, actions rapides, éditeur, constructeur, aperçu, contenus récents, médias, SEO local)
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  PenLine, FileText, Inbox, Image as ImageIcon, SquarePen, FilePlus, UploadCloud, Settings,
  ChevronRight, GripVertical, MoreVertical, Blocks, Monitor, Tablet, Smartphone, ArrowUp, Check, Loader2,
} from 'lucide-react';
import { apiFetch } from '@/lib/adminApi';

const fmtDate = (iso) => {
  if (!iso) return '—';
  try {
    const d = iso.length <= 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
    return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(d);
  } catch {
    return iso;
  }
};

const Badge = ({ kind, children }) => {
  const styles = {
    succes: { background: 'var(--succes-bg)', color: 'var(--succes-txt)' },
    ambre: { background: 'var(--ambre-bg)', color: 'var(--ambre-txt)' },
    info: { background: 'var(--info-bg)', color: 'var(--info-txt)' },
    erreur: { background: 'var(--erreur-bg)', color: 'var(--erreur-txt)' },
    neutre: { background: '#F0EEE9', color: 'var(--texte-secondaire)' },
  };
  return <span className="adm-badge" style={styles[kind] || styles.neutre}>{children}</span>;
};

const CATEGORY_LABELS = { mariages: 'Mariages', corporate: 'Corporate', photobooth: 'Photobooth', formations: 'Formations', conseils: 'Conseils', inspiration: 'Inspiration' };
const PIPELINE_LABELS = { nouvelle: ['Nouvelle', 'info'], a_traiter: ['À traiter', 'ambre'], confirmee: ['Confirmée', 'succes'], payee: ['Payée', 'succes'], terminee: ['Terminée', 'neutre'], annulee: ['Annulée', 'erreur'] };

// ============================ KPI ============================
const KpiCard = ({ icon: Icon, label, value, trend, href, testid }) => (
  <Link href={href} className="adm-card p-5 flex flex-col min-h-[146px] hover:border-[#D8CFC2] transition-colors" data-testid={testid}>
    <div className="flex items-center gap-3">
      <span className="h-9 w-9 rounded-[9px] inline-flex items-center justify-center bg-ivoire">
        <Icon className="h-[17px] w-[17px] text-cognac" strokeWidth={1.5} />
      </span>
      <span className="text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>{label}</span>
    </div>
    <p className="font-serif text-[32px] leading-none text-charbon mt-4">{value}</p>
    <div className="mt-auto pt-3 text-[12.5px]">{trend}</div>
  </Link>
);

// ============================ Aperçu du site ============================
const DEVICE_WIDTHS = { desktop: 1440, tablet: 834, mobile: 390 };

const SitePreview = () => {
  const [device, setDevice] = useState('desktop');
  const [dims, setDims] = useState({ scale: 0.2, h: 2800 });
  const boxRef = useRef(null);

  useEffect(() => {
    const compute = () => {
      const el = boxRef.current;
      if (!el) return;
      const scale = el.clientWidth / DEVICE_WIDTHS[device];
      setDims({ scale, h: el.clientHeight / scale });
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, [device]);

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Écran' },
    { id: 'tablet', icon: Tablet, label: 'Tablette' },
    { id: 'mobile', icon: Smartphone, label: 'Téléphone' },
  ];

  return (
    <div className="adm-card adm-area-apercu flex flex-col overflow-hidden" data-testid="dash-preview-card">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <h3 className="adm-title">Aperçu du site</h3>
        <div className="flex items-center gap-1">
          {devices.map((d) => (
            <button key={d.id} onClick={() => setDevice(d.id)} aria-label={d.label} title={d.label} data-testid={`dash-preview-${d.id}`} className="h-7 w-7 inline-flex items-center justify-center rounded-[6px] hover:bg-[var(--fond-actif)] transition-colors">
              <d.icon className="h-4 w-4" strokeWidth={1.5} style={{ color: device === d.id ? '#8A5A44' : 'var(--texte-tertiaire)' }} />
            </button>
          ))}
        </div>
      </div>
      <div ref={boxRef} className="mx-3 mb-3 rounded-[8px] border overflow-hidden bg-white relative h-[560px] xl:h-[640px]" style={{ borderColor: 'var(--bordure-douce)' }}>
        <iframe
          src="/"
          title="Aperçu du site"
          data-testid="dash-preview-iframe"
          className="absolute top-0 left-0"
          style={{
            width: `${DEVICE_WIDTHS[device]}px`,
            height: `${dims.h}px`,
            transform: `scale(${dims.scale})`,
            transformOrigin: 'top left',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      </div>
    </div>
  );
};

// ============================ Dashboard ============================
export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [sections, setSections] = useState([]);
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [pages, setPages] = useState([]);
  const [medias, setMedias] = useState([]);
  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState('articles');
  const [builderMsg, setBuilderMsg] = useState('');
  const dragIndex = useRef(null);

  const load = useCallback(async () => {
    try {
      const [st, se, po, co, pg, me, sg] = await Promise.all([
        apiFetch('/admin/stats'),
        apiFetch('/admin/sections'),
        apiFetch('/blog/admin/posts'),
        apiFetch('/contacts'),
        apiFetch('/admin/pages'),
        apiFetch('/admin/media/recent'),
        apiFetch('/settings'),
      ]);
      setStats(st);
      setSections(se);
      setPosts(po.slice(0, 5));
      setContacts(co);
      setPages(pg.pages || []);
      setMedias(me);
      setSettings(sg);
    } catch (e) {
      /* silencieux */
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const persistOrder = async (list) => {
    setSections(list);
    try {
      await apiFetch('/admin/sections/order', { method: 'PUT', json: { ids: list.map((s) => s.id) } });
    } catch {}
  };

  const toggleSection = async (s) => {
    const updated = sections.map((x) => (x.id === s.id ? { ...x, actif: !x.actif } : x));
    setSections(updated);
    try {
      await apiFetch(`/admin/sections/${s.id}`, { method: 'PUT', json: { actif: !s.actif } });
    } catch {}
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center gap-3 py-24" style={{ color: 'var(--texte-secondaire)' }}>
        <Loader2 className="h-5 w-5 animate-spin" /> Chargement du tableau de bord…
      </div>
    );
  }

  const demandes = contacts.slice(0, 5);
  const reservations = contacts.filter((c) => c.pipeline_status).slice(0, 5);

  const TABS = [
    { id: 'articles', label: 'Articles récents', footer: 'Voir tous les articles', href: '/admin/blog' },
    { id: 'pages', label: 'Pages récentes', footer: 'Voir toutes les pages', href: '/admin/pages' },
    { id: 'demandes', label: 'Demandes récentes', footer: 'Voir toutes les demandes', href: '/admin/formulaires' },
    { id: 'reservations', label: 'Réservations récentes', footer: 'Voir toutes les réservations', href: '/admin/reservations' },
  ];
  const activeTab = TABS.find((t) => t.id === tab);

  return (
    <div className="space-y-4">
      {/* ============ RANGÉE 1 — KPI + Actions rapides ============ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[repeat(4,minmax(0,1fr))_minmax(260px,305px)] gap-4">
        <KpiCard icon={PenLine} label="Articles publiés" value={stats.articles_published} href="/admin/blog" testid="kpi-articles"
          trend={stats.articles_month > 0 ? <span className="inline-flex items-center gap-1" style={{ color: 'var(--succes-txt)' }}><ArrowUp className="h-3.5 w-3.5" /> {stats.articles_month} ce mois</span> : <span style={{ color: 'var(--texte-secondaire)' }}>Aucun ce mois</span>} />
        <KpiCard icon={FileText} label="Pages actives" value={stats.pages_active} href="/admin/pages" testid="kpi-pages"
          trend={<span className="inline-flex items-center gap-1" style={{ color: 'var(--texte-secondaire)' }}>Toutes à jour <Check className="h-3.5 w-3.5" style={{ color: 'var(--succes-txt)' }} /></span>} />
        <KpiCard icon={Inbox} label="Demandes reçues" value={stats.demandes_total} href="/admin/formulaires" testid="kpi-demandes"
          trend={<span className="text-cognac">{stats.demandes_unread} non lue{stats.demandes_unread > 1 ? 's' : ''}</span>} />
        <KpiCard icon={ImageIcon} label="Images en bibliothèque" value={stats.images_total} href="/admin/medias" testid="kpi-images"
          trend={stats.images_month > 0 ? <span className="inline-flex items-center gap-1" style={{ color: 'var(--succes-txt)' }}><ArrowUp className="h-3.5 w-3.5" /> {stats.images_month} ce mois</span> : <span style={{ color: 'var(--texte-secondaire)' }}>Aucune ce mois</span>} />

        {/* Actions rapides */}
        <div className="adm-card p-5 min-h-[146px] sm:col-span-2 xl:col-span-1" data-testid="dash-quick-actions">
          <h3 className="adm-title">Actions rapides</h3>
          <div className="mt-2">
            {[
              { icon: SquarePen, label: 'Créer un article', href: '/admin/blog?new=1', testid: 'quick-new-article' },
              { icon: FilePlus, label: 'Ajouter une page', href: '/admin/pages', testid: 'quick-new-page' },
              { icon: UploadCloud, label: 'Importer des médias', href: '/admin/medias', testid: 'quick-import-media' },
              { icon: Settings, label: 'Réglages du site', href: '/admin/parametres', testid: 'quick-settings' },
            ].map((a, i) => (
              <Link key={a.label} href={a.href} data-testid={a.testid} className={`group flex items-center gap-2.5 h-[34px] px-1 text-[13px] text-charbon hover:bg-[var(--fond-actif)] rounded-[6px] transition-colors ${i > 0 ? 'border-t' : ''}`} style={i > 0 ? { borderColor: 'var(--bordure-douce)' } : undefined}>
                <a.icon className="h-[15px] w-[15px]" strokeWidth={1.5} style={{ color: 'var(--texte-secondaire)' }} />
                <span className="flex-1">{a.label}</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:text-cognac transition-colors" style={{ color: 'var(--texte-tertiaire)' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ============ RANGÉES 2-3 — grille maquette ============ */}
      <div className="adm-dash-grid">
        {/* --- Éditeur de la page d'accueil --- */}
        <div className="adm-card adm-area-editeur p-5" data-testid="dash-home-editor">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h3 className="adm-title">Éditeur de la page d'accueil</h3>
              <p className="text-[12.5px] mt-0.5" style={{ color: 'var(--texte-secondaire)' }}>Gérez les sections de la page d'accueil en toute simplicité.</p>
            </div>
            <div className="flex items-center gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer" className="h-[34px] px-3.5 inline-flex items-center rounded-[8px] bg-white border text-[12.5px] font-medium text-charbon hover:bg-[var(--fond-actif)]/60 transition-colors" style={{ borderColor: 'var(--bordure)' }} data-testid="dash-editor-preview">Prévisualiser</a>
              <Link href="/admin/pages" className="h-[34px] px-3.5 inline-flex items-center rounded-[8px] bg-white border border-cognac text-[12.5px] font-medium text-cognac hover:bg-cognac/5 transition-colors" data-testid="dash-editor-edit">Éditer la page</Link>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {sections.map((s, index) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => { dragIndex.current = index; }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragIndex.current === null || dragIndex.current === index) return;
                  const list = [...sections];
                  const [item] = list.splice(dragIndex.current, 1);
                  list.splice(index, 0, item);
                  dragIndex.current = null;
                  persistOrder(list);
                }}
                className="flex items-center gap-2.5 h-[34px] px-2.5 rounded-[8px] border bg-white cursor-grab active:cursor-grabbing hover:border-[#D8CFC2] transition-colors"
                style={{ borderColor: 'var(--bordure)' }}
                data-testid={`dash-section-${s.key}`}
              >
                <GripVertical className="h-4 w-4 shrink-0" style={{ color: 'var(--texte-tertiaire)' }} />
                <span className="text-[13px] text-charbon flex-1 truncate">{s.name}</span>
                <span className="text-[12.5px] hidden sm:block" style={{ color: 'var(--texte-secondaire)' }}>{s.type}</span>
                <button onClick={() => toggleSection(s)} title={s.actif ? 'Désactiver' : 'Activer'} data-testid={`dash-section-toggle-${s.key}`}>
                  <Badge kind={s.actif ? 'succes' : 'neutre'}>{s.actif ? 'Actif' : 'Inactif'}</Badge>
                </button>
                <MoreVertical className="h-4 w-4 shrink-0" style={{ color: 'var(--texte-tertiaire)' }} />
              </div>
            ))}
          </div>
        </div>

        {/* --- Constructeur de page --- */}
        <div className="adm-card adm-area-constructeur p-4 flex flex-col" data-testid="dash-builder">
          <h3 className="adm-title px-1">Constructeur de page</h3>
          <div className="relative flex-1 mt-3 rounded-[10px] border border-dashed flex flex-col items-center justify-center text-center px-4 py-10 min-h-[250px]" style={{ borderColor: 'var(--bordure)' }}>
            {['top', 'bottom', 'left', 'right'].map((pos) => (
              <span key={pos} aria-hidden="true" className="absolute text-[10px]" style={{ color: 'var(--texte-tertiaire)', ...(pos === 'top' ? { top: -7, left: '50%', transform: 'translateX(-50%)' } : pos === 'bottom' ? { bottom: -7, left: '50%', transform: 'translateX(-50%)' } : pos === 'left' ? { left: -4, top: '50%', transform: 'translateY(-50%)' } : { right: -4, top: '50%', transform: 'translateY(-50%)' }) }}>+</span>
            ))}
            <span className="h-10 w-10 rounded-[9px] bg-ivoire inline-flex items-center justify-center">
              <Blocks className="h-5 w-5 text-cognac" strokeWidth={1.5} />
            </span>
            <p className="text-[14px] font-medium text-charbon mt-3">Glissez-déposez vos blocs</p>
            <p className="text-[12px] mt-1" style={{ color: 'var(--texte-secondaire)' }}>Trouvez les composants dans la bibliothèque</p>
            <button onClick={() => setBuilderMsg('Le builder visuel plein écran arrive dans une prochaine étape (Phase E).')} className="mt-4 h-[34px] px-4 rounded-[8px] bg-white border border-cognac text-[12.5px] font-medium text-cognac hover:bg-cognac/5 transition-colors" data-testid="dash-open-builder">
              Ouvrir le builder
            </button>
            {builderMsg && <p className="text-[11.5px] mt-2.5 max-w-[200px]" style={{ color: 'var(--texte-tertiaire)' }} data-testid="dash-builder-msg">{builderMsg}</p>}
          </div>
        </div>

        {/* --- Aperçu du site (colonne haute) --- */}
        <SitePreview />

        {/* --- Contenus récents --- */}
        <div className="adm-card adm-area-recents p-5 flex flex-col" data-testid="dash-recent">
          <div className="flex items-center gap-5 border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)} data-testid={`dash-tab-${t.id}`} className={`relative pb-2.5 text-[13px] transition-colors ${tab === t.id ? 'text-cognac font-medium' : 'text-charbon/60 hover:text-charbon'}`}>
                {t.label}
                {tab === t.id && <span className="absolute left-0 right-0 -bottom-px h-[2px] bg-cognac" />}
              </button>
            ))}
          </div>

          <div className="flex-1 mt-1">
            {tab === 'articles' && (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
                    {['Titre', 'Auteur', 'Catégorie', 'Date', 'Statut'].map((h) => (
                      <th key={h} className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--texte-tertiaire)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((p) => (
                    <tr key={p.id} className="border-b last:border-0" style={{ borderColor: 'var(--bordure-douce)' }}>
                      <td className="py-2 pr-3">
                        <Link href="/admin/blog" className="flex items-center gap-2.5 group" data-testid={`dash-article-${p.slug}`}>
                          <img src={p.cover && p.cover.url} alt="" className="h-8 w-8 rounded-[5px] object-cover shrink-0" loading="lazy" />
                          <span className="text-[13px] text-charbon leading-snug line-clamp-2 group-hover:text-cognac transition-colors">{p.title}</span>
                        </Link>
                      </td>
                      <td className="py-2 pr-3 text-[13px] whitespace-nowrap" style={{ color: 'var(--texte-secondaire)' }}>Samuel B.</td>
                      <td className="py-2 pr-3 text-[13px] whitespace-nowrap" style={{ color: 'var(--texte-secondaire)' }}>{CATEGORY_LABELS[p.category] || p.category}</td>
                      <td className="py-2 pr-3 text-[13px] whitespace-nowrap" style={{ color: 'var(--texte-secondaire)' }}>{fmtDate(p.date)}</td>
                      <td className="py-2"><Badge kind={p.status === 'published' ? 'succes' : 'ambre'}>{p.status === 'published' ? 'Publié' : 'Brouillon'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'pages' && (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
                    {['Titre', 'Adresse', 'Statut'].map((h) => (
                      <th key={h} className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--texte-tertiaire)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.slice(0, 6).map((p) => (
                    <tr key={p.slug} className="border-b last:border-0" style={{ borderColor: 'var(--bordure-douce)' }}>
                      <td className="py-2.5 pr-3 text-[13px] text-charbon">{p.title}</td>
                      <td className="py-2.5 pr-3 text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>{p.slug}</td>
                      <td className="py-2.5"><Badge kind="succes">Active</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {tab === 'demandes' && (
              demandes.length === 0 ? <p className="text-[13px] py-8 text-center" style={{ color: 'var(--texte-secondaire)' }}>Aucune demande pour le moment.</p> : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
                      {['Nom', 'Email', 'Date', 'Statut'].map((h) => (
                        <th key={h} className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--texte-tertiaire)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {demandes.map((c) => (
                      <tr key={c.id} className="border-b last:border-0" style={{ borderColor: 'var(--bordure-douce)' }}>
                        <td className="py-2.5 pr-3 text-[13px] text-charbon">{c.name}</td>
                        <td className="py-2.5 pr-3 text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>{c.email}</td>
                        <td className="py-2.5 pr-3 text-[13px] whitespace-nowrap" style={{ color: 'var(--texte-secondaire)' }}>{fmtDate(c.created_at)}</td>
                        <td className="py-2.5"><Badge kind={c.read ? 'neutre' : 'info'}>{c.read ? 'Lue' : 'Nouvelle'}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}

            {tab === 'reservations' && (
              reservations.length === 0 ? <p className="text-[13px] py-8 text-center" style={{ color: 'var(--texte-secondaire)' }}>Aucune réservation en cours — qualifiez vos demandes depuis la rubrique Réservations.</p> : (
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b" style={{ borderColor: 'var(--bordure-douce)' }}>
                      {['Nom', 'Date mariage', 'Statut'].map((h) => (
                        <th key={h} className="py-2 pr-3 text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: 'var(--texte-tertiaire)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((c) => {
                      const [label, kind] = PIPELINE_LABELS[c.pipeline_status] || ['—', 'neutre'];
                      return (
                        <tr key={c.id} className="border-b last:border-0" style={{ borderColor: 'var(--bordure-douce)' }}>
                          <td className="py-2.5 pr-3 text-[13px] text-charbon">{c.name}</td>
                          <td className="py-2.5 pr-3 text-[13px]" style={{ color: 'var(--texte-secondaire)' }}>{c.wedding_date || '—'}</td>
                          <td className="py-2.5"><Badge kind={kind}>{label}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )
            )}
          </div>

          <Link href={activeTab.href} className="group flex items-center justify-between border-t pt-3 mt-3 text-[13px] text-charbon hover:text-cognac transition-colors" style={{ borderColor: 'var(--bordure-douce)' }} data-testid="dash-recent-footer-link">
            {activeTab.footer} →
            <ChevronRight className="h-4 w-4 group-hover:text-cognac transition-colors" style={{ color: 'var(--texte-tertiaire)' }} />
          </Link>
        </div>

        {/* --- Bibliothèque médias --- */}
        <div className="adm-card adm-area-medias p-4" data-testid="dash-media-card">
          <h3 className="adm-title px-1">Bibliothèque médias</h3>
          <div className="grid grid-cols-3 gap-2 mt-3">
            {medias.map((m, i) => (
              <img key={i} src={m.url} alt={m.alt || ''} loading="lazy" className="w-full aspect-square object-cover rounded-[4px]" data-testid={`dash-media-thumb-${i}`} />
            ))}
          </div>
          <Link href="/admin/medias" className="mt-3 h-[34px] w-full inline-flex items-center justify-center rounded-[8px] bg-white border border-cognac text-[12.5px] font-medium text-cognac hover:bg-cognac/5 transition-colors" data-testid="dash-open-media">
            Ouvrir la médiathèque
          </Link>
        </div>

        {/* --- SEO local --- */}
        <div className="adm-card adm-area-seo p-4" data-testid="dash-seo-card">
          <h3 className="adm-title px-1">SEO local — Informations</h3>
          <div className="mt-2">
            {[
              ['Lieu', (settings && settings.address) || '—'],
              ['Ville', (settings && settings.city) || '—'],
              ['Département', (settings && settings.department) || 'Nord (59)'],
              ['Région', (settings && settings.region) || '—'],
            ].map(([label, value], i) => (
              <div key={label} className={`flex items-center justify-between gap-3 py-2 ${i > 0 ? 'border-t' : ''}`} style={i > 0 ? { borderColor: 'var(--bordure-douce)' } : undefined}>
                <span className="text-[12.5px]" style={{ color: 'var(--texte-secondaire)' }}>{label}</span>
                <span className="text-[13px] text-charbon text-right truncate">{value}</span>
              </div>
            ))}
          </div>
          <Link href="/admin/seo-local" className="mt-2 h-[34px] w-full inline-flex items-center justify-center rounded-[8px] bg-white border border-cognac text-[12.5px] font-medium text-cognac hover:bg-cognac/5 transition-colors" data-testid="dash-edit-seo">
            Modifier les informations
          </Link>
        </div>
      </div>
    </div>
  );
};
