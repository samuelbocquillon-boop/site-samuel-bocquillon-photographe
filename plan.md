# plan.md

## 1. Objectives
- Livrer un site vitrine **Samuel Bocquillon** (FR) **fidèle aux maquettes** et à la **charte graphique** (palette cuir/cognac/ivoire, typographies Cormorant Garamond + Manrope, logo monogramme SB).
- Assurer un **SEO/GEO natif** : HTML SSR/SSG lisible sans JS, métadonnées uniques, sitemap/robots, Schema.org, **llms.txt**.
- Maximiser le **SEO local** : cohérence NAP, JSON-LD LocalBusiness, page Contact avec **carte + itinéraire**, + pages villes (Valenciennes/Lille/Douai/Cambrai).
- Mettre en place une **zone admin** simple pour gérer **toutes les images + alt**, avec **optimisation à l’upload** (pipeline **Pillow** opérationnel ; **Cloudinary** auto-activable quand les clés seront fournies).
- Formulaire de contact : stockage en DB + page **/merci** + notification email (code présent, **désactivé tant que SMTP Gmail non fourni**).

**Statut global :** Phases 1 et 2 terminées (site complet + admin complet + SEO complet). Phase 3 = stabilisation/tests + activation des identifiants réels.

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
- Suite de tests POC : **17/17 PASS** (auth, upload, webp/srcset, alt, contact, settings).

---

### Phase 2 — V1 App Development (site complet + SEO + admin images) — ✅ COMPLET
1) **Frontend (Next.js) : pages publiques fidèles aux maquettes** — ✅
- Pages principales : Accueil, À propos, Portfolio, Prestations (hub), Mariage, Corporate, Photobooth, Formation, Contact.
- Pages additionnelles : `/merci`, `/avis`, `/photographe-mariage-[valenciennes|lille|douai|cambrai]`, `/politique-de-confidentialite`, `/mentions-legales`, `404`.
- Navigation : menu + dropdown Prestations + état actif + hamburger mobile.
- CTA : above-the-fold + CTA mobile fixe bas d’écran.

2) **Contenu** — ✅
- Seed contenu conforme aux maquettes (textes, prix, CTA, FAQ, témoignages).
- Résumés « extractibles » en tête des pages clés (GEO).
- Étude de cas (Portfolio : « Clara & Julien — mariage en Provence »).

3) **SEO/GEO complet** — ✅
- Titles/meta uniques par page + canonical.
- Open Graph / Twitter.
- JSON-LD :
  - **LocalBusiness + Photographer** (global)
  - **FAQPage** (Prestations, Contact, Villes)
  - **Service + BreadcrumbList** (pages villes)
  - **AggregateRating + Review** (page Avis)
- `sitemap.xml` (généré via Next), `robots.txt` (autorise crawlers IA), `llms.txt`.
- SSR vérifié sur les pages (contenu HTML complet côté serveur).

4) **Backend FastAPI** — ✅
- MongoDB : Settings (NAP/socials/GA), Images (overrides), Contacts, Testimonials.
- Registre d’emplacements images : **53 slots** regroupés en **11 groupes/pages** (exigence admin slot-by-slot).
- Endpoints CRUD nécessaires pour admin + public fetch.

5) **Admin V1 (images + inbox + témoignages + settings)** — ✅
- Login sécurisé (JWT) — identifiants actuels : `admin / SamuelB2025!` (à changer en prod).
- Écran “Images” : page par page/slot par slot, drag&drop, preview avant/après, alt, reset vers défaut.
- Écran “Demandes” : inbox + actions.
- Écran “Témoignages” : CRUD.
- Écran “Réglages” : NAP, réseaux, GA ID.

6) **RGPD** — ✅
- Bandeau consentement cookies : bloque GA + Google Maps tant que refus.
- (Polish ajouté) : bandeau cookies **masqué sur /admin**.

**Validation Phase 2**
- 18 routes testées **200 OK**.
- SSR confirmé via `curl`.
- Captures d’écran : rendu conforme à la charte (typos/couleurs/structure).

---

### Phase 3 — Stabilisation + compléments (qualité prod) — 🔄 EN COURS / NEXT
1) **Tests end-to-end & qualité**
- Lancer l’agent de test complet (frontend + backend) :
  - navigation (desktop/mobile), menu dropdown, hamburger + CTA mobile
  - formulaires (validation, erreurs, redirection /merci)
  - admin : upload image, alt, reset, inbox, settings
  - SSR (HTML rendu) pour pages clés
  - accessibilité (focus visible, tailles tactiles, contraste)

2) **Performance / Core Web Vitals**
- Vérifier poids des images, lazy load, tailles, CLS sur hero.
- Ajuster `sizes` images + préchargement des assets critiques si nécessaire.

3) **Activation des identifiants réels (dépend du client)**
- **Cloudinary** : renseigner `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` → activer stockage/optimisation via CDN.
- **SMTP Gmail** : renseigner `SMTP_USER` + `SMTP_PASSWORD` (mot de passe d’application) → activer notifications email.
- **Google Analytics** : renseigner `ga_id` via Réglages admin (toujours RGPD-gated).
- **NAP réel** : renseigner business_name/adresse/téléphone/email via Réglages admin pour cohérence SEO local.

4) **Durcissement SEO**
- Vérifier OG images (placeholder vs assets réels), valider JSON-LD, contrôler sitemap/robots/llms.
- Vérifier maillage interne + ancres/CTA.

**Fin de phase :** nouveau round de tests end-to-end et corrections.

---

## 3. Next Actions
1) Lancer **Phase 3** : campagne de tests end-to-end (frontend + backend + admin).
2) Corriger bugs/UX si détectés (responsive, overlays, CTA mobile, focus).
3) Une fois reçus :
   - Ajouter clés Cloudinary (optionnel) et valider pipeline.
   - Ajouter SMTP Gmail et valider l’envoi.
   - Renseigner GA ID et NAP réel via Admin → vérifier cohérence partout.

---

## 4. Success Criteria
- Conformité visuelle : structure/sections/CTA identiques aux maquettes + charte (couleurs/typos).
- SEO : SSR/SSG, meta uniques, sitemap/robots/llms, JSON-LD (LocalBusiness/FAQ/Service/Breadcrumb/Review).
- Local SEO : NAP cohérent partout + Contact (map + itinéraire) + pages villes.
- Admin : gestion complète des images/alt par slot + optimisation automatique (Pillow) + Cloudinary optionnel.
- RGPD : consentement avant GA/Maps + pas d’affichage sur /admin.
- Qualité : responsive sans overflow, images WebP/srcset/lazy, pages rapides.
