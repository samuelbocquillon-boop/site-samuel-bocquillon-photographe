# plan.md

## 1. Objectives
- Livrer un site vitrine **Samuel Bocquillon** (FR) **fidèle aux maquettes** et à la **charte graphique** (palette cuir/cognac/ivoire, typographies Cormorant Garamond + Manrope, logo monogramme SB) — **sans retoucher les pages existantes**.
- Assurer un **SEO/GEO natif** : rendu SSR/SSG lisible sans JS, métadonnées uniques, sitemap/robots, JSON-LD, **llms.txt**.
- Maximiser le **SEO local** : cohérence NAP, JSON-LD LocalBusiness, pages villes, contenu géolocalisé.
- Maintenir une **zone admin** pour gérer **toutes les images + alt** avec **optimisation automatique** (Pillow WebP multi-tailles + fallback JPEG, Cloudinary activable via env).
- Assurer un **tunnel de contact** complet : page Contact (map + FAQ), enregistrement DB, page **/merci**, notification email (active uniquement si SMTP fourni).
- **BLOG (journal/reportages) — Objectif SEO local majeur** : 
  - Page listing et pages articles conformes à la maquette, cohérentes avec l’identité du site.
  - Articles enrichis (lieu/ville/département/région/pays) pour renforcer le référencement local.
  - Admin « sans code » via éditeur par blocs + gestion des slugs + alt par image.
- **CMS propriétaire (dashboard)** : fournir une admin premium, minimaliste, lumineuse, **fidèle à la maquette** + prompt MD (598 lignes).
  - Navigation admin structurée (13 rubriques), preview live (iframe), KPI dynamiques.
  - Réservations = pipeline sur demandes contact.
  - SEO local éditable.
  - Préparer les phases suivantes : médiathèque centralisée, éditeur de pages par sections, builder plein écran + versions.

**Statut global :**
- Phases 1 et 2 : ✅ terminées (site complet + admin V1 + SEO + pages villes)
- Phase 3 : 🔄 stabilisation / qualité prod + activation credentials (en attente)
- Phase 4 : ✅ BLOG — COMPLETED (implémenté + testé 100%)
- **Phase 5 : ✅ CMS / Dashboard propriétaire — Phase A COMPLETED (design + wiring + tests)**

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
- Seed contenu conforme aux maquettes (textes, prix, CTA, FAQ, témoignages).
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
- **Cloudinary** : `CLOUDINARY_*` si souhaité.
- **GA ID** via réglages (RGPD-gated).

---

### Phase 4 — Rubrique BLOG (journal / SEO local) — ✅ COMPLETED
**Objectif :** reproduire **fidèlement** la maquette Blog fournie, conserver l’identité existante, créer un système d’articles administrables par blocs, SSR/SEO complet, pagination indexable, données structurées.

> Statut : **implémenté + testé à 100%** (voir `/app/test_reports/iteration_2.json` : **50 tests passés, 0 bug**).

---

### Phase 5 — CMS propriétaire / Dashboard Admin (maquette fournie) — ✅ Phase A COMPLETED
**Référence obligatoire** : image dashboard + prompt MD (598 lignes) :
- `/tmp/dashboard_prompt.md`
- URL : https://customer-assets-v7afamib.emergentagent.net/job_wedding-samuel/artifacts/m8oz2cwl_prompt-emergent-dashboard-samuel-bocquillon.md

**Décisions utilisateur validées :**
- Ordre des phases : **A → B → C → D → E**
- Cloudinary : **pas de clés pour l’instant** → support **collage d’URL + uploads locaux WebP**, synchro plus tard.
- Réservations : **pipeline basé sur les demandes formulaire** (statuts : Nouvelle/À traiter/Confirmée/Payée/Terminée/Annulée)
- Aperçu du site : **iframe réelle** + bascule desktop/tablette/mobile.

#### Phase A — Refonte visuelle du dashboard + branchement aux fonctionnalités existantes — ✅ COMPLETED
**Objectif** : interface admin **visuellement indiscernable** de la maquette, en branchant Blog/Demandes/Témoignages/Images/Réglages existants, sans casser le site.

1) **Design tokens Admin (globals)** — ✅
- Variables CSS (fond-app/sidebar/actif, bordures, or doux, couleurs états) + classes utilitaires admin (cards sans ombre marquée).

2) **Shell Admin (layout global)** — ✅
- Conteneur global arrondi ~14px + bordure 1px.
- Sidebar fixe 236px + bloc compte ancré bas + Voir le site + Déconnexion.
- Header contextuel : titre/sous-titre + autosave indicator + “Voir le site” + split button “+ Nouveau”.

3) **Navigation 13 rubriques (routes)** — ✅
- Routes App Router livrées :
  - `/admin` dashboard
  - `/admin/pages`
  - `/admin/blog`
  - `/admin/portfolio`
  - `/admin/prestations`
  - `/admin/medias`
  - `/admin/temoignages`
  - `/admin/reservations`
  - `/admin/seo-local`
  - `/admin/formulaires`
  - `/admin/navigation`
  - `/admin/branding`
  - `/admin/parametres`

4) **Dashboard grid fidèle maquette** — ✅
- KPI dynamiques + Actions rapides.
- Éditeur sections Accueil (7 sections) : **drag&drop + toggle Actif** persistés.
- Constructeur placeholder (Phase E).
- Aperçu du site (iframe) + toggles devices.
- Contenus récents (tabs) + Bibliothèque médias (6) + carte SEO local.

5) **Backend (stats + sections + pages + media + pipeline)** — ✅
- `GET /api/admin/stats`
- `home_sections` seed + `PUT /api/admin/sections/order` + `PUT /api/admin/sections/{id}`
- `GET /api/admin/pages`
- `GET /api/admin/media/recent`
- Pipeline réservations : `PUT /api/contacts/{id}/pipeline` (statut + note + montant)

6) **Assets branding admin** — ✅
- Monogramme SB transparent en `/public/monogramme-sb.webp`.

**Tests Phase A**
- `/app/test_reports/iteration_3.json` : **97,3% (71/74)**
  - 0 bug réel : 3 faux négatifs **403 vs 401** (sémantique HTTPBearer FastAPI, accès bien refusé).
  - Admin frontend : **100%**
  - Régression site public : **100%**

#### Phase B — Médiathèque centralisée + sélecteur universel 3 options — ⏳ NOT STARTED
- Collection `medias` + `media_usages`.
- Sélecteur image universel : médiathèque / upload / coller URL Cloudinary.
- Au collage URL : preview immédiat + ajout auto en bibliothèque + réutilisable.
- Panneau d’édition image : ALT/tags/infos + remplacement global.

#### Phase C — Éditeur de sections (migration contenu en DB) — ⏳ NOT STARTED
- Migration Accueil (puis autres pages) en DB en conservant un rendu public **strictement identique**.
- Panneau slide-in 480px : champs (titre/sous-titre/texte/CTA/image/disposition/visibilité/espacement).
- Autosave debounce ~800ms + indicateur header.

#### Phase D — Rubriques CMS complètes — ⏳ NOT STARTED
- Pages, Portfolio (galeries + drag&drop), Prestations (tarifs/options/FAQ), Navigation (menu 2 niveaux), Branding (logos/couleurs/typos), Paramètres enrichis, SEO local (CRUD lieux + autocomplete + liaisons contenus).

#### Phase E — Builder plein écran + versions — ⏳ NOT STARTED
- Builder visuel plein écran (bibliothèque blocs / canvas / settings), blocs réels du site.
- Historique de versions + restauration.

---

## 3. Next Actions
1) **Phase 5B — Médiathèque centralisée (priorité)**
- Concevoir la collection `medias`, l’UI “Bibliothèque” (liste/grille) et le sélecteur universel 3 options.
- Mode “Cloudinary sans clés” : collage d’URL + stockage local metadata + usages.

2) **Phase 5C — Éditeur de sections (Accueil d’abord)**
- Rendre l’éditeur des 7 sections de l’accueil réellement éditable (contenu), tout en garantissant le rendu public identique.

3) **Phase 3 — Stabilisation Contact (pixel-perfect)**
- Comparaison stricte à la maquette + screenshots.

4) **Données de production (dépend du client)**
- Vraies coordonnées NAP.
- SMTP Gmail.
- Cloudinary keys (plus tard).
- GA ID.

---

## 4. Success Criteria
- Conformité visuelle : pages existantes inchangées ; Blog indiscernable ; **Dashboard indiscernable de la maquette** (Phase A ✅).
- SEO : SSR/SSG, meta uniques, canonical, sitemap/robots/llms, JSON-LD (LocalBusiness + Blog + BlogPosting + BreadcrumbList).
- Local SEO : NAP cohérent + pages villes + articles enrichis + maillage interne.
- Admin :
  - V1 existante stable.
  - Phase A ✅ : dashboard visuel + KPI + preview + navigation + réservations pipeline + SEO local éditable.
  - Phases B–E : médiathèque, éditeur sections, rubriques complètes, builder, versions.
- Performance : images optimisées WebP/srcset/lazy, animations discrètes, pages rapides.
- RGPD : pas de régression (maps/GA gated, admin isolé).
