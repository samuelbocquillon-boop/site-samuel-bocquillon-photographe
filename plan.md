# plan.md

## 1. Objectives
- Livrer un site vitrine **Samuel Bocquillon** (FR) **fidèle aux maquettes** et à la **charte graphique** (palette cuir/cognac/ivoire, typographies Cormorant Garamond + Manrope, logo monogramme SB) — **sans retoucher les pages existantes** en dehors des évolutions explicitement validées.
- Assurer un **SEO/GEO natif** : rendu SSR/SSG lisible sans JS, métadonnées uniques, sitemap/robots, JSON-LD, **llms.txt**.
- Maximiser le **SEO local** : cohérence NAP, JSON-LD LocalBusiness, pages villes, contenu géolocalisé.
- Maintenir une **zone admin** pour gérer le contenu (images, blog, galerie, témoignages, demandes) avec **optimisation automatique** (Pillow WebP multi-tailles + fallback JPEG, Cloudinary via URLs optimisées).
- Assurer un **tunnel de contact** complet : page Contact (map + FAQ), enregistrement DB, page **/merci**, notification email (active uniquement si SMTP fourni).
- **BLOG (journal/reportages) — Objectif SEO local majeur** :
  - Page listing et pages articles conformes à la maquette, cohérentes avec l’identité du site.
  - Articles enrichis (lieu/ville/département/région/pays) pour renforcer le référencement local.
  - Admin « sans code » via éditeur par blocs + gestion des slugs + alt par image.
- **CMS propriétaire (dashboard)** : fournir une admin premium, minimaliste, lumineuse, **fidèle à la maquette** + prompt MD.
  - Navigation admin structurée (13 rubriques), preview live (iframe), KPI dynamiques.
  - Réservations = pipeline sur demandes contact.
  - SEO local éditable.
  - Préparer les phases suivantes : médiathèque centralisée, éditeur de pages par sections, builder plein écran + versions.
- **Galerie Portfolio (UX premium + SEO)** :
  - **Galerie unifiée** (suppression des filtres) + **lightbox diaporama** fullscreen.
  - Publication **triviale** via l’admin : collage d’URLs Cloudinary, alt optionnel, ordre drag & drop.
- **Tarifs & Collections (conformité contractuelle)** :
  - Garantir la cohérence **des noms de collections, prix, options et mentions** sur l’ensemble du site (pages, métadonnées, SEO local, llms.txt), sans inventer de contenu.

**Statut global :**
- Phases 1 et 2 : ✅ terminées (site complet + admin V1 + SEO)
- Phase 3 : 🔄 stabilisation / qualité prod + activation credentials (en attente)
- Phase 4 : ✅ BLOG — COMPLETED (implémenté + testé 100%)
- Phase 5 : ✅ CMS / Dashboard propriétaire — Phase A COMPLETED (design + wiring + tests)
- Phase 6 : ✅ Galerie unifiée + Lightbox — COMPLETED (implémentée + testée)
- **Phase 7 : ✅ Tarifs réels des collections — COMPLETED (implémenté + vérifié)**

---

## 2. Implementation Steps

### Phase 1 — POC “core workflow” (isolation, à valider avant le reste) — ✅ COMPLET
**Core = SSR Next.js + pipeline images optimisées + upload/affichage + base API.**

1) **POC SSR Next.js** — ✅
- Frontend converti en **Next.js SSR**.
- Pages test SSR + métadonnées.
- SSR prouvé au `curl` sur l’URL de preview.

2) **POC pipeline images (Pillow, Cloudinary-ready)** — ✅
- Endpoint upload → **Pillow** : multi-tailles (480/960/1600/2400), WebP, fallback JPEG, compression.
- Stockage local `/api/uploads` + `srcset`.
- Affichage images avec `srcset` + lazy.
- Switch Cloudinary prévu (activation via env `CLOUDINARY_*`).

3) **POC Admin minimal** — ✅
- Auth JWT.
- Upload image sur slot + preview + alt.

4) **POC Contact minimal** — ✅
- `/api/contact` enregistre en MongoDB.
- SMTP Gmail : code présent en **feature-flag** (inactive sans credentials).
- Redirection `/merci`.

**Résultat Phase 1**
- Suite de tests POC : **PASS** (auth, upload, webp/srcset, alt, contact, settings).

---

### Phase 2 — V1 App Development (site complet + SEO + admin images) — ✅ COMPLET
1) **Frontend (Next.js) : pages publiques fidèles aux maquettes** — ✅
- Pages principales : Accueil, À propos, Portfolio, Prestations (hub), Mariage, Corporate, Photobooth, Formation, Contact.
- Pages additionnelles : `/merci`, `/avis`, `/photographe-mariage-[valenciennes|lille|douai|cambrai]`, `/politique-de-confidentialite`, `/mentions-legales`, `404`.
- Navigation : menu + dropdown Prestations + état actif + hamburger mobile.

2) **Contenu** — ✅
- Seed contenu conforme aux maquettes (textes, CTA, FAQ, témoignages).
- Étude de cas (Portfolio : « Clara & Julien — mariage en Provence »).

3) **SEO/GEO complet** — ✅
- Titles/meta uniques par page + canonical.
- Open Graph / Twitter.
- JSON-LD :
  - **LocalBusiness + Photographer** (global)
  - **FAQPage** (Prestations, Contact, Villes)
  - **Service + BreadcrumbList** (pages villes)
  - **AggregateRating + Review** (page Avis)
- `sitemap.xml` (via `app/sitemap.js`), `robots.txt`, `llms.txt`.

4) **Backend FastAPI** — ✅
- MongoDB : Settings (NAP/socials/GA), Images (overrides), Contacts, Testimonials.
- Registre d’emplacements images : slots regroupés par pages.

5) **Admin V1 (images + inbox + témoignages + settings)** — ✅
- Login sécurisé (JWT) — identifiants actuels à changer en prod.
- “Images” : par page/slot, upload, alt, reset.
- “Demandes” : inbox + actions.
- “Témoignages” : CRUD.
- “Réglages” : NAP, réseaux, GA ID.

6) **RGPD** — ✅
- Bandeau consentement cookies : bloque GA + Google Maps tant que refus.
- Bandeau cookies masqué sur `/admin`.

**Validation Phase 2**
- Routes principales testées **200 OK**.
- SSR confirmé via `curl`.

---

### Phase 3 — Stabilisation + compléments (qualité prod) — 🔄 EN COURS / NEXT
1) **Contact : conformité maquette** — 🔄
- Vérifier visuellement `/contact` vs maquette (captures).
- Ajuster alignements/typo/espacements si nécessaire.

2) **Tests end-to-end & qualité** — 🔄
- Campagne tests (frontend + backend) : navigation, CTA, formulaires, admin, SSR, accessibilité.

3) **Performance / Core Web Vitals** — 🔄
- Vérifier poids images, lazy load, `sizes`, CLS sur hero.

4) **Activation des identifiants réels (dépend du client)** — ⏳
- **NAP réel** via Réglages admin (footer + JSON-LD cohérents).
- **SMTP Gmail** : `SMTP_USER` + `SMTP_PASSWORD` → activer notifications.
- **Cloudinary** : `CLOUDINARY_*` si souhaité (sinon collage d’URL).
- **GA ID** via réglages (RGPD-gated).

---

### Phase 4 — Rubrique BLOG (journal / SEO local) — ✅ COMPLETED
**Objectif :** reproduire **fidèlement** la maquette Blog fournie, conserver l’identité existante, créer un système d’articles administrables par blocs, SSR/SEO complet, pagination indexable, données structurées.

> Statut : **implémenté + testé à 100%**.

**À faire (complément validé / backlog P0)**
- Appliquer l’optimisation automatique Cloudinary (`f_auto,q_auto`) aux images collées dans l’éditeur de blog (`AdminBlogEditor.js`).

---

### Phase 5 — CMS propriétaire / Dashboard Admin (maquette fournie) — ✅ Phase A COMPLETED
**Référence obligatoire** : image dashboard + prompt MD.

**Décisions utilisateur validées :**
- Ordre des phases : **A → B → C → D → E**
- Cloudinary : **pas de clés pour l’instant** → support **collage d’URL**.
- Réservations : **pipeline basé sur les demandes formulaire**.
- Aperçu du site : **iframe réelle** + bascule desktop/tablette/mobile.

#### Phase A — Refonte visuelle du dashboard + branchement aux fonctionnalités existantes — ✅ COMPLETED
- Design tokens admin, shell, navigation 13 rubriques, dashboard grid, endpoints stats/sections/pages/media.
- Tests : admin frontend 100%.

#### Phase B — Médiathèque centralisée + sélecteur universel 3 options — ⏳ NOT STARTED
- Collection `medias` + `media_usages`.
- Sélecteur image universel : médiathèque / upload / coller URL Cloudinary.

#### Phase C — Éditeur de sections (migration contenu en DB) — ⏳ NOT STARTED
- Migration Accueil (puis autres pages) en DB en conservant un rendu public **identique**.

#### Phase D — Rubriques CMS complètes — ⏳ NOT STARTED
- Pages, Portfolio, Prestations, Navigation, Branding, Paramètres enrichis, SEO local.

#### Phase E — Builder plein écran + versions — ⏳ NOT STARTED
- Builder visuel plein écran + historique de versions.

---

### Phase 6 — Galerie unifiée + Lightbox (refonte Portfolio) — ✅ COMPLETED
**Décisions utilisateur validées (appliquées)**
- Admin : nouvel onglet **« Galerie »** (collage liens Cloudinary, alt optionnel, **drag & drop** ordre, suppression).
- Migration des ~12 photos existantes (ancienne mosaïque Portfolio) comme seed initial.
- Conservation des sections sous la galerie : « Reportage à la une », bande témoignages, CTA final.
- Le **hero Portfolio** reste visuellement identique.
- SEO : un seul **H1** sur la page = nouveau titre galerie (le “Portfolio” du hero est démoté en élément non-H1).

(Backend, Frontend, Admin, Tests : ✅ livrés et testés — rapport itération 5.)

---

### Phase 7 — Tarifs réels des collections (harmonisation globale) — ✅ COMPLETED
**Objectif :** remplacer tous les tarifs “placeholder” par les tarifs contractuels, harmoniser les collections et options sur **tout le site** (pages, SEO, llms.txt), et restructurer la page Mariage selon le document fourni.

#### 7.1 Données (lib/content.js) — ✅
- Mise à jour **HOME_COLLECTIONS** :
  - Hugs **1 990 € TTC**
  - Delight **2 490 € TTC**
  - Infinity **3 390 € TTC**
- Mise à jour **PRESTATIONS_COLLECTIONS** (hub prestations) : Hugs / Delight (popular) / Infinity.
- Remplacement complet **MARIAGE_COLLECTIONS** : structure “contractuelle” avec features et **icônes Lucide par nom**.
  - Icône “Drone” inexistante dans Lucide → **Plane** utilisée.
  - `Infinity` importé en `InfinityIcon`.
- Ajout :
  - **MARIAGE_OPTIONS** (4 options détaillées + descriptions)
  - **MARIAGE_MENTIONS** (3 mentions contractuelles)
- Remplacement **OPTIONS_EXTRAS** par les options contractuelles (120 €/h, 500 €, sur devis, 500 €).
- Mise à jour **FAQ_PRESTATIONS** + **FAQ_CONTACT** :
  - Albums → Infinity
  - Engagement → Delight/Infinity
  - Prises de vue illimitées
  - Solde avant envoi du coffret final
  - Déplacements offerts rayon **150 km**
- Harmonisation des pages villes (résumés + FAQ) : minimum à **1 990 €**, rayon **150 km**.

#### 7.2 Page Prestations → Mariage (/prestations/mariage) — ✅
- Nouvelle section **« Les collections. »** + sous-titre *« Tarifs nets, toutes taxes comprises. »*
- 3 cartes : label **COLLECTION**, nom serif, prix, CTA **« Demander cette collection »** → `/contact#formulaire`.
- Delight :
  - Badge **« Le plus choisi »**
  - mise en avant (bordure cognac + légère scale desktop)
  - **1ère sur mobile** (order-first)
- Listes de features avec icônes (strokeWidth 1.5, cognac, aria-hidden).
- Section **« Les options. »** : grille 2 colonnes, icônes + descriptions.
- Mentions contractuelles affichées sous les options.
- Metadata mise à jour : **1 990 € à 3 390 € TTC**.

#### 7.3 Harmonisation SEO globale — ✅
- Accueil : cartes + meta description à partir de **1 990 €**.
- Prestations (hub) : badge « Le plus choisi » + meta description mise à jour.
- Layout global : `priceRange` → **1990€ - 3390€**, `Offer.price` → **1990**.
- CityPage.js : `Offer.price` → **1990** + rayon **150 km**.
- `public/llms.txt` : tarifs et mentions mis à jour (1 990€–3 390€ TTC, 150 km).

#### 7.4 UX / Mobile — ✅
- Ajout sur la page Accueil : bandeau **« Prestations »** mobile pour rendre la transition “Portfolio → collections” plus claire (desktop/tablette inchangés).

#### 7.5 Contact — ✅
- Ajout de l’ancre `id="formulaire"` sur la section principale de `/contact`.

#### 7.6 QA — ✅
- `esbuild` OK.
- Captures desktop/mobile/hub/accueil conformes.
- Delight en 1er sur mobile validé.
- Pages clés 200 OK et **aucune occurrence des anciens tarifs** sur les pages testées.

---

## 3. Next Actions
1) **Backlog P0 — Optimisation Cloudinary dans l’éditeur Blog**
- Auto-injection `f_auto,q_auto` dans `AdminBlogEditor.js` pour les images collées dans les blocs.

2) **SEO local — Pages villes (P1)**
- Valider le contenu + JSON-LD + maillage interne des pages : Valenciennes, Lille, Douai, Cambrai.

3) **Phase 3 — Stabilisation Contact (pixel-perfect) + activation SMTP/NAP**
- Ajustements maquette.
- Activer l’envoi email dès réception des identifiants.

4) **Données de production (dépend du client)**
- Vraies coordonnées NAP (nom exact, adresse, ville, téléphone, email).
- SMTP Gmail (mot de passe d’application).
- GA ID.
- Cloudinary keys (optionnel, plus tard) si upload direct souhaité.

---

## 4. Success Criteria
- Conformité visuelle : pages existantes inchangées ; Blog indiscernable ; **Dashboard indiscernable de la maquette** (Phase A ✅).
- SEO : SSR/SSG, meta uniques, canonical, sitemap/robots/llms, JSON-LD (LocalBusiness + Blog + BlogPosting + BreadcrumbList + **ImageGallery**).
- Local SEO : NAP cohérent + pages villes + articles enrichis + maillage interne.
- Galerie/Lightbox (Phase 6 ✅) :
  - Grille unifiée performante (Lighthouse mobile ≥ 90, CLS < 0.05).
  - Lightbox : ouverture rapide, préchargement, autoplay 5s, deep-link `?photo=n`, a11y complète.
  - Admin : ajout par collage d’URL, alt optionnel, ordre drag & drop.
- Tarifs & Collections (Phase 7 ✅) :
  - Aucune occurrence des anciens tarifs placeholder.
  - Cohérence des montants (1 990 € / 2 490 € / 3 390 € TTC) + options + mentions sur tout le site (pages, FAQ, JSON-LD Offers, llms.txt).
  - Delight clairement mise en avant (« Le plus choisi ») et 1ère sur mobile.
- Admin :
  - V1 existante stable.
  - Phase A ✅ : dashboard visuel + KPI + preview + navigation + réservations pipeline + SEO local éditable.
  - Phases B–E : médiathèque, éditeur sections, rubriques complètes, builder, versions.
- Performance : images optimisées WebP/srcset/lazy, animations discrètes, pages rapides.
- RGPD : pas de régression (maps/GA gated, admin isolé).
