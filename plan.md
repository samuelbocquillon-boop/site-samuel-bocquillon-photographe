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

**Statut global :**
- Phases 1 et 2 : ✅ terminées (site complet + admin + SEO + pages villes)
- Phase 3 : 🔄 stabilisation / qualité prod + activation credentials (en attente)
- **Phase 4 : ✅ BLOG — COMPLETED (implémenté + testé 100%)**

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
- CTA : above-the-fold + CTA mobile fixe bas d’écran.

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
- Vérifier visuellement `/contact` après dernières retouches.
- Ajuster alignements/typo/espacements si nécessaire.
- Validation via captures d’écran.

> Note : la route `/contact` répond **200** et le formulaire fonctionne, mais la validation « pixel-perfect » finale reste à confirmer par comparaison stricte à la maquette.

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

#### 4.1 Backend (FastAPI + MongoDB `blog_posts`) — ✅
1) **Collection + modèle** — ✅
- `blog_posts` :
  - `id` (uuid)
  - `title`, `slug` (unique, modifiable), `excerpt`
  - `category` ∈ {mariages, corporate, photobooth, formations, conseils, inspiration}
  - `cover`: { `url`, `alt` }
  - `date`, `author`, `tags[]`
  - `location`: { `venue`, `city`, `postal_code`, `department`, `region`, `country` }
  - `seo`: { `meta_title`, `meta_description`, `keyword`, `og_image`, `canonical`, `noindex` }
  - `blocks[]`: (heading/text/image/image_full/images_2/images_3/gallery/quote/spacer/button/video)
  - `status`: draft|published
  - timestamps.

2) **Routes publiques** — ✅
- `GET /api/blog/posts` (filtres : `category`, `lieu`, `q`, `page`, `limit=9`).
- `GET /api/blog/posts/{slug}` : article + **related 3** (lieu/ville/région/catégorie) + **discover 3**.
- `GET /api/blog/locations` : liste dynamique lieux/villes/départements.
- `GET /api/blog/sitemap` : slugs publiés + nombre de pages (pour sitemap dynamique).

3) **Routes admin (JWT)** — ✅
- CRUD : `GET/POST/PUT/DELETE /api/blog/admin/posts`.
- Actions : duplication, publish/unpublish (`/status`), suppression.
- Upload images bloc/cover : `POST /api/blog/upload` (optimisation WebP multi-tailles).

4) **Seed démonstration** — ✅
- Seed ~9 articles démo (supprimables) pour valider visuel grille + pagination.

5) **Slots images** — ✅
- Ajout de slots Blog : `blog-hero` + `blog-prefooter-1..3`.
- `PAGE_ORDER` mis à jour.

#### 4.2 Frontend (Next.js SSR) — ✅
1) **Navigation** — ✅
- Ajout **BLOG** dans le menu principal **entre Prestations et Contact**.
- Ajout lien **Blog** dans le footer.

2) **Route `/blog` (listing)** — ✅
- Hero conforme maquette (label BLOG + H1 + texte + photo droite via slot `blog-hero`).
- Filtres conformes maquette : catégorie / lieu (dynamique) / recherche (titre + lieu + ville + contenu + tags + catégorie).
- Grille 3/2/1 + cartes sobres (filet fin, hover discret).
- Pagination conforme maquette.

3) **Pagination indexable** — ✅
- Route `/blog/page/[num]` (SSR) pour pages 2+.
- Canonical correct : page 1 → `/blog`, page n → `/blog/page/n`.

4) **Route `/blog/[slug]` (article)** — ✅
- Template éditorial : breadcrumb, hero, cover, blocs magazine (11 types), CTA local.
- Fin d’article : « Vous aimerez également » (3), « D’autres histoires à découvrir » (3), CTA bandeau photo, liens internes.

5) **Pré-footer Blog** — ✅
- Ajout d’une zone éditoriale brun cuir **uniquement sur les pages Blog** (cohérente maquette).

6) **SEO Blog** — ✅
- `generateMetadata` par article (title/description/canonical/OG/noindex).
- JSON-LD : `Blog`, `BlogPosting`, `BreadcrumbList`.
- Sitemap dynamique : articles publiés + pages de pagination.
- SSR vérifié.

#### 4.3 Admin (Dashboard) — ✅
1) **Nouvel onglet “BLOG”** — ✅
- Liste articles : statut (draft/published), date, catégorie, actions (éditer/dupliquer/supprimer/publier/dépublier).

2) **Éditeur d’article (sans code)** — ✅
- Informations principales : titre, slug, résumé, catégorie, image principale + ALT, date, auteur.
- SEO local : lieu/ville/CP/département/région/pays.
- SEO : meta title/description/keyword/OG/canonical/index/noindex.
- **Blocs** : ajout/retrait, réordonnancement **drag & drop + flèches**, upload images optimisées + ALT par image.
- Flux E2E validé : création → publication → visible côté public → suppression.

#### 4.4 Tests & validation visuelle — ✅
- Captures d’écran : `/blog` et `/blog/[slug]`.
- Tests automatisés : **100%** (iteration_2.json).
- Régression confirmée : pages existantes intactes.

---

## 3. Next Actions
1) **Stabilisation Contact (pixel-perfect)**
- Faire/valider une comparaison stricte à la maquette (screenshots) et ajuster si nécessaire.

2) **Données de production (dépend du client)**
- Mettre les **vraies coordonnées NAP** (Nom/Adresse/Téléphone/Email).
- Fournir **SMTP Gmail** (app password) pour activer les notifications de contact.
- (Optionnel) activer **Cloudinary**.
- (Optionnel) renseigner **GA ID**.

3) **Qualité prod**
- Audit performance (images, CLS, LCP) + accessibilité.
- Vérifier sitemap/robots en environnement prod.

---

## 4. Success Criteria
- Conformité visuelle : pages existantes inchangées ; Blog **indiscernable** d’une page prévue dès le départ (maquette respectée : hero, filtres, cartes, pagination, pré-footer).
- SEO : SSR/SSG, meta uniques, canonical, sitemap/robots/llms, JSON-LD (LocalBusiness + Blog + BlogPosting + BreadcrumbList).
- Local SEO : articles enrichis (lieu/ville/département/région/pays) + maillage interne + recommandations d’articles liés.
- Admin : création/modification/publication d’articles + éditeur blocs + ALT par image + slugs modifiables.
- Performance : images optimisées WebP/srcset/lazy, animations discrètes, pages rapides.
- RGPD : pas de régression (maps/GA gated, admin isolé).
