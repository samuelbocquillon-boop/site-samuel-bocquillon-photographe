# PRD — Site professionnel Samuel Bocquillon, Photographe de mariage

## Vision
Site vitrine SEO-first (SSR Next.js), fidèle à 100% au cahier des charges, à la charte graphique et aux maquettes fournies. SEO local prioritaire (Valenciennes, Lille, Douai, Cambrai). Zone admin pour gérer toutes les images avec optimisation automatique.

## Stack
- Frontend : Next.js 15 (App Router, SSR, port 3000) + Tailwind — remplace CRA (exigence SSR du cahier des charges)
- Backend : FastAPI (port 8001, préfixe /api) + MongoDB
- Images : pipeline Pillow (WebP, 4 tailles srcset 480/960/1600/2400, fallback JPEG, compression ~90%) — Cloudinary activable via env (clés non fournies)
- Fonts : Cormorant Garamond + Manrope (next/font)

## Identité (charte)
Couleurs : cuir #5A3A2E, cognac #8A5A44, ivoire #EFECE8, charbon #1A1A1A, pierre #B9B4AE. Logo monogramme SB SVG + nom serif + signature spaced caps.

## Pages (16 publiques + admin)
Accueil, À propos, Portfolio (filtres + reportage à la une), Prestations (hub + FAQ 5 questions), Mariage, Corporate, Photobooth, Formation, Contact (form complet + carte + itinéraire + FAQ), Merci, Avis clients (AggregateRating), 4 pages villes SEO local, Politique de confidentialité, Mentions légales, 404 personnalisée.

## SEO / GEO
- SSR complet, titles/meta uniques, canonical, OG/Twitter
- JSON-LD : LocalBusiness+Photographer (layout), FAQPage (prestations, contact, villes), Service+Breadcrumb (villes), AggregateRating+Review (avis)
- sitemap.xml (16 URLs), robots.txt (crawlers IA autorisés : GPTBot, ClaudeBot, PerplexityBot…), llms.txt
- NAP cohérent via Réglages admin (placeholders : Valenciennes, +33 6 12 34 56 78, contact@samuelbocquillon.fr — À REMPLACER par le client)

## Les 20 éléments du cahier des charges
1✓ CTA above fold, 2✓ CTA mobile fixe bas d'écran, 3✓ page /merci, 4✓ "Réponse sous 24h garantie", 5✓ étude de cas (Clara & Julien portfolio), 6✓ FAQ 5 questions, 7✓ avis clients (+page dédiée), 8✓ portrait photographe (slot admin), 9✓ menu état actif + breadcrumb, 10✓ maillage interne, 11✓ 404 personnalisée, 12✓ titles uniques, 13✓ meta uniques, 14✓ OG/Twitter, 15✓ alt partout (éditable admin), 16✓ robots.txt, 17✓ LocalBusiness JSON-LD, 18✓ politique de confidentialité, 19✓ Google Analytics (via Réglages, gated RGPD), 20✓ carte Maps + itinéraire (gated RGPD)

## Zone admin (/admin)
- Login : admin / SamuelB2025! (env ADMIN_USERNAME/ADMIN_PASSWORD, JWT 7j)
- Images : 53 slots, 11 groupes de pages, drag&drop, aperçu avant/après, alt éditable, badge Personnalisée/Par défaut, retour à l'image par défaut
- Demandes : inbox contacts (lu/non-lu, répondre, supprimer)
- Témoignages : CRUD complet (catégorie, note, à la une)
- Réglages : NAP, réseaux sociaux, GA ID

## Intégrations en attente (clés utilisateur)
- Cloudinary (CLOUDINARY_* dans backend/.env) — pipeline Pillow fonctionne en attendant
- SMTP Gmail (SMTP_USER/SMTP_PASSWORD dans backend/.env) — email désactivé, demandes stockées en DB
- Google Analytics ID — à saisir dans Réglages admin
- NAP réel (adresse/téléphone/email) — à saisir dans Réglages admin

## État
- Phase 1 POC : ✓ (17/17 tests)
- Phase 2 Build complet : ✓ (18 routes 200, SSR vérifié)
- Phase 3 Tests E2E : en cours

## Itération 3 — Accueil refait selon maquette (validé par screenshots)
- Hero split : texte gauche (titre bicolore charbon/cognac), photo droite avec fondu transparence vers ivoire, badge circulaire SB tournant bas-droite, CTA cuir carré
- Header : logo texte 2 lignes, nav "Prestations", sans bouton Réserver ; Footer clair (monogramme script SB, LIENS, SUIVEZ-MOI, copyright) — appliqué à tout le site
- Portfolio accueil : colonne texte + 2 grandes + 5 petites images (slots accueil-portfolio-1..7)
- Prestations : "PRESTATIONS" vertical, 3 colonnes plates, 02 Complète en brun
- Témoignages : carrousel 3 points (auto 7s), dernier mot en cognac
- Contact accueil : formulaire minimal (inputs soulignés) + photo (slot accueil-contact-image)
- Police script Great Vibes ajoutée pour signatures "Samuel B." (accueil + à propos)
- 62 slots images au total

## Itération 4 — Portfolio refait selon maquette (validé par screenshots)
- Hero split : "Portfolio" + trait cognac + paragraphe 4 lignes + bouton "RÉSERVER UNE DATE →", photo fondue vers l'ivoire
- Filtres séparés par traits verticaux, actif cognac souligné (fonctionnels)
- Galerie mosaïque 4 colonnes, 12 photos formats variés, sans légendes (slots portfolio-galerie-1..12)
- Reportage à la une 3 colonnes : photo photographe | Clara & Julien / Un mariage en Provence (cognac) | carte citation beige #EDE8E0 + signature script
- Bande témoignage sur photo avec voile ivoire central + carrousel "– AUTEUR –" sans accent cognac
- CTA final fond ivoire : "PRÊTS À ÉCRIRE VOTRE HISTOIRE ?" + appareil photo en mix-blend-multiply (slot portfolio-cta-camera)
- 67 slots images au total

## Itération 5 — Contact refait selon maquette + audit couleurs (validé par screenshots)
- Audit palette : suppression des teintes hors-charte (hover #4a3025→cuir/90, cartes #EDE8E0/#e6e1d8→ivoire/pierre-25, admin bg→ivoire). Palette stricte : #5A3A2E #8A5A44 #EFECE8 #FFFFFF #1A1A1A #B9B4AE
- Hero split : CONTACT + "Parlons de / votre mariage." (cognac) + trait + 3 lignes, photo fondue ivoire
- Carte blanche : formulaire complet (nom+email/téléphone/date/lieu/message, placeholders maquette, bouton ENVOYER LE MESSAGE →, mention RGPD) + "Restons en contact" à icônes rondes cuir pleines
- Bande 3 items (RÉPONSE RAPIDE/DISPONIBILITÉS/RENCONTRE) séparés par traits verticaux sur fond pierre/15
- "Informations utiles" : accordéon à "+" (5 questions maquette, FAQ #3 renommée "à l'international") + bouton VOIR LES PRESTATIONS ; "Où me trouver" : carte beige à épingle brune (Maps RGPD) + texte + itinéraire
- CTA sombre "Prêt à écrire / votre histoire ?" + PRENONS RENDEZ-VOUS (nouveau slot contact-cta-fond) — 68 slots au total

## Itération 6 — Rubrique BLOG complète (maquette respectée, testée à 100%)
- **Backend** : collection MongoDB `blog_posts` (UUID), 19 endpoints — publics : GET /api/blog/posts (filtres category/lieu/q + pagination 9/page), /api/blog/posts/{slug} (+3 liés par lieu>ville>région>catégorie, +3 découvrir), /api/blog/locations, /api/blog/sitemap ; admin JWT : CRUD complet + duplicate + publish/unpublish + POST /api/blog/upload (WebP multi-tailles Pillow)
- **Seed** : 9 articles démo (blog_seed.py, badge Démo, supprimables) — Château d'Aubry (article complet 16 blocs structure SEO H2), Marlière, Clos des Saules, Roseraie, Templiers, Château de la Motte, Cigognes, 5 idées (inspiration), Photobooth
- **Frontend** : /blog (hero maquette label+titre "Histoires vraies, émotions immortelles."+photo droite slot blog-hero), filtres (dropdowns catégorie/lieu dynamique + recherche soulignée, séparateurs verticaux), grille 3/2/1, cartes sobres (filet fin, catégorie cognac, titre serif, ville (dépt), résumé 2 lignes, LIRE L'ARTICLE, date), pagination ←1 2…n→ (liens SEO /blog/page/N sans filtre, boutons si filtres)
- **/blog/[slug]** : breadcrumb Accueil›Blog›Catégorie›Titre, hero centré (catégorie/H1/ville—dépt/date), BlockRenderer 11 types de blocs (heading/text/image/image_full/images_2/images_3/gallery/quote/spacer/button/video), CTA local Valenciennes, "Vous aimerez également" (3), "D'autres histoires à découvrir" (3), maillage interne, CTA bandeau photo (cover article), pré-footer brun éditorial (3 slots images blog-prefooter-1..3 + liens SEO villes + réseaux)
- **SEO** : JSON-LD Blog + BlogPosting + BreadcrumbList, generateMetadata par article (meta title/description/canonical/OG/noindex), sitemap.xml dynamique (articles publiés + pages pagination), SSR vérifié
- **Admin onglet Blog** : liste (badges Publié/Brouillon/Démo, voir/éditer/publier-dépublier/dupliquer/supprimer), éditeur sans code : infos principales (titre→slug auto, résumé, catégorie, date, auteur, cover+ALT), SEO local (lieu/ville/CP/département/région/pays), SEO (meta/mot-clé/OG/canonical/index), éditeur de blocs drag & drop + flèches ↑↓, ALT individuel par image, upload optimisé WebP
- **Nav** : BLOG entre Prestations et Contact + lien footer. 72 slots images au total.
- **Tests** : iteration_2.json — 100% (50 tests passés, 0 bug). Flux E2E admin validé : création→publication→affichage public→suppression.
- **Toujours en attente (client)** : NAP réel, SMTP Gmail, Cloudinary, GA ID.

## Itération 7 — Logo officiel intégré
- Logo fourni par le client (5.webp, monogramme SB + filet cognac + nom + baseline) recadré automatiquement (Pillow, bbox alpha) et exporté en /public/logo-samuel-bocquillon.webp (23 Ko, fond transparent, retina x3)
- Composant Logo.js remplacé par l'image officielle — header desktop (h-52px), menu mobile (h-10), toutes pages publiques
- Vérifié par screenshots : accueil, blog, mobile

## Itération 8 — Badge circulaire hero statique
- Badge rond fourni par le client (7.webp) : fond blanc circulaire ajouté (intérieur transparent illisible sur photo), recadré et exporté en /public/badge-samuel-bocquillon.webp (30 Ko)
- Composant CircularBadge : remplacé par l'image statique (rotation supprimée), affiché bas-droite du hero accueil

## Itération 9 — Signature manuscrite réelle
- Signature fournie (Copie de the end.webp) recadrée (bbox alpha) → /public/signature-samuel-b.webp (15 Ko, transparent)
- Remplace la signature typographique 'Samuel B.' (font-script) aux 4 emplacements : À propos (carte citation + section Mon approche), Accueil (section À propos), Portfolio (carte citation)

## Itération 10 — Nouvelle photo hero accueil
- Photo Cloudinary fournie (ld-export-2c6c3456, 3333x5000 portrait) téléchargée puis injectée dans le slot 'accueil-hero' via le pipeline WebP existant (4 tailles responsive) — reste remplaçable dans l'admin
- Cadrage affiné : object-[center_62%] pour centrer le couple (photo portrait dans hero large)
- ALT mis à jour, vérifié par screenshots desktop + mobile

## Itération 11 — Hero mobile affiné
- Mobile (<640px) : zoom léger sur la photo (scale-110), sous-titre 'Photographe de mariage…' + bouton 'Découvrir mon travail' repositionnés SOUS les personnages (flex-col + mt-auto), fondu ivoire bas renforcé (h-44) pour la lisibilité
- Desktop inchangé (object-position 80%, couple entier) — vérifié screenshots

## Itération 12 — Nouveaux textes hero accueil
- H1 : « L'émotion se capte. » (charbon) / « L'image se crée. » (cognac) — 2 lignes (conteneur élargi max-w-3xl pour éviter la césure à 92px)
- Sous-titre : « PHOTOGRAPHE DE MARIAGE / DES MOMENTS INOUBLIABLES, DES SOUVENIRS ÉTERNELS »
- Bouton et tout le reste inchangés

## Itération 13 — Section Mon approche (prestations/mariage) : 3 → 6 cartes
- Rangée 1 (démarche) : Approche créative & bienveillante (Sparkles), Une vraie complicité (HeartHandshake), Matériel haut de gamme (Aperture, inchangée)
- Rangée 2 (accompagnement) : La séance engagement (Gem), Le jour J de A à Z (Clock), L'after-day (Camera)
- Style de cartes strictement identique, grille 3 colonnes, titre de section inchangé

## Itération 14 — Favicon monogramme SB
- Fichier client 'Favicon 2.PNG' recadré + fond ivoire (lisible sur onglets clairs/sombres)
- Exports Next App Router : app/favicon.ico (16/32/48), app/icon.png (512), app/apple-icon.png (180) — balises <link> auto-injectées, vérifié 200 + HTML

## Itération 15 — PHASE A Dashboard CMS (maquette) — TERMINÉE (97,3% tests, 0 bug réel)
- Shell admin : conteneur arrondi 14px fond #F7F4EF, sidebar 236px (#FBF9F6, monogramme SB + marque entre filets, 13 rubriques Lucide stroke 1.5, actif = pilule #F2EDE4 + barre cognac 3px, bloc compte SB + Voir le site + Déconnexion), header contextuel (titre serif + sous-titre par route), indicateur autosave, split button + Nouveau (menu 6 entrées), drawer mobile
- Tableau de bord : 4 KPI dynamiques (GET /api/admin/stats) + Actions rapides ; Éditeur page d'accueil (7 sections réelles seedées en DB, drag&drop ordre + toggle Actif persistés — rendu public branché en Phase C) ; Constructeur (zone pointillée, Phase E) ; Aperçu du site (iframe réelle scalée, toggles desktop/tablette/mobile, hauteur fixe) ; Contenus récents (onglets Articles/Pages/Demandes/Réservations avec vraies données) ; Bibliothèque médias (6 dernières) ; SEO local (depuis settings)
- Routes : /admin + 12 sous-pages (pages, blog?new=1 ouvre l'éditeur, portfolio, prestations, medias, temoignages, reservations, seo-local, formulaires, navigation, branding, parametres) — composants existants réutilisés
- NOUVEAU Réservations : pipeline sur les demandes contact (6 statuts + note + montant, PUT /api/contacts/{id}/pipeline, filtres)
- NOUVEAU SEO local : form localisation (settings, champ department ajouté) + lieux du blog en badges
- Backend : /api/admin/stats, /api/admin/pages (registre 17 pages), /api/admin/sections (+order/+toggle), /api/admin/media/recent, pipeline contacts
- Design tokens admin dans globals.css (--or-doux, --fond-*, badges, .adm-card, .adm-dash-grid areas)
- Assets : /public/monogramme-sb.webp (transparent)
- Tests iteration_3.json : backend 94,2% (3 faux négatifs 403-vs-401 = comportement FastAPI standard), frontend admin 100%, régression site public 100%
- PHASES SUIVANTES : B médiathèque+sélecteur universel, C éditeur sections DB→public, D rubriques complètes, E builder+versions. Cloudinary keys toujours en attente.
