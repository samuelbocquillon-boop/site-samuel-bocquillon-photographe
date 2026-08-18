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
