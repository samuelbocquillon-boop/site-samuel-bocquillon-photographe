"""Registre des emplacements d'images du site — page par page, slot par slot.
Chaque zone est clairement identifiée pour la zone admin (cahier des charges §7).
"""

U = 'https://images.unsplash.com/photo-'
Q = '?crop=entropy&cs=srgb&fm=jpg&q=85&w=1920'
QS = '?crop=entropy&cs=srgb&fm=jpg&q=80&w=1200'

IMAGE_SLOTS = [
    # ---------- ACCUEIL ----------
    {'slot_key': 'accueil-hero', 'page': 'Accueil', 'label': 'Accueil — Bannière principale', 'description': "Grande photo du hero (fond droit, fondu vers l'ivoire à gauche)", 'default_url': f'{U}1519741497674-611481863552{Q}', 'default_alt': 'Marié portant la mariée au milieu des invités — photographe de mariage Samuel Bocquillon'},
    {'slot_key': 'accueil-portrait', 'page': 'Accueil', 'label': 'Accueil — Mon portrait (section À propos)', 'description': 'Portrait du photographe dans la section À propos', 'default_url': f'{U}1542038784456-1ea8e935640e{QS}', 'default_alt': 'Samuel Bocquillon, photographe de mariage à Valenciennes — portrait avec son appareil'},
    {'slot_key': 'accueil-portfolio-1', 'page': 'Accueil', 'label': 'Accueil — Portfolio grande image 1', 'description': "Première grande image de l'aperçu portfolio", 'default_url': f'{U}1465495976277-4387d4b0b4c6{QS}', 'default_alt': 'Mariés enlacés dans un champ au coucher du soleil — reportage mariage Nord'},
    {'slot_key': 'accueil-portfolio-2', 'page': 'Accueil', 'label': 'Accueil — Portfolio grande image 2', 'description': "Deuxième grande image de l'aperçu portfolio", 'default_url': f'{U}1520854221256-17451cc331bf{QS}', 'default_alt': 'Invités riant ensemble le jour du mariage — instants volés'},
    {'slot_key': 'accueil-portfolio-3', 'page': 'Accueil', 'label': 'Accueil — Portfolio petite image 1', 'description': 'Rangée de 5 petites images — n°1', 'default_url': f'{U}1550005809-91ad75fb315f{QS}', 'default_alt': 'Portrait du marié en préparatifs — lumière naturelle'},
    {'slot_key': 'accueil-portfolio-4', 'page': 'Accueil', 'label': 'Accueil — Portfolio petite image 2', 'description': 'Rangée de 5 petites images — n°2', 'default_url': f'{U}1522673607200-164d1b6ce486{QS}', 'default_alt': 'Sortie de cérémonie sous les confettis — joie des mariés'},
    {'slot_key': 'accueil-portfolio-5', 'page': 'Accueil', 'label': 'Accueil — Portfolio petite image 3', 'description': 'Rangée de 5 petites images — n°3', 'default_url': f'{U}1606800052052-a08af7148866{QS}', 'default_alt': 'Détail des alliances et de la montre du marié — préparatifs'},
    {'slot_key': 'accueil-portfolio-6', 'page': 'Accueil', 'label': 'Accueil — Portfolio petite image 4', 'description': 'Rangée de 5 petites images — n°4', 'default_url': f'{U}1521033719794-41049d18b8d4{QS}', 'default_alt': 'Silhouettes des mariés au crépuscule — fin de journée dorée'},
    {'slot_key': 'accueil-portfolio-7', 'page': 'Accueil', 'label': 'Accueil — Portfolio petite image 5', 'description': 'Rangée de 5 petites images — n°5', 'default_url': f'{U}1519225421980-715cb0215aed{QS}', 'default_alt': 'Réception de mariage sous les guirlandes lumineuses — ambiance de soirée'},
    {'slot_key': 'accueil-cta-fond', 'page': 'Accueil', 'label': 'Accueil — Fond section « Parlons de votre mariage »', 'description': "Photo de fond de la grande section d'appel à l'action", 'default_url': f'{U}1521033719794-41049d18b8d4{Q}', 'default_alt': 'Couple de mariés face au coucher du soleil — parlons de votre mariage'},
    {'slot_key': 'accueil-contact-image', 'page': 'Accueil', 'label': 'Accueil — Image section Contact', 'description': 'Photo à droite du formulaire de contact', 'default_url': f'{U}1520390138845-fd2d229dd553{QS}', 'default_alt': 'Samuel Bocquillon photographiant un mariage — appareil en main'},

    # ---------- À PROPOS ----------
    {'slot_key': 'apropos-portrait', 'page': 'À propos', 'label': 'À propos — Mon portrait (haut de page)', 'description': 'Grand portrait du photographe à droite du titre', 'default_url': f'{U}1563175076-bf4785155115{QS}', 'default_alt': 'Portrait de Samuel Bocquillon, photographe de mariage basé à Valenciennes'},
    {'slot_key': 'apropos-approche', 'page': 'À propos', 'label': 'À propos — Image section Mon approche', 'description': 'Photo de couple à droite de la section Mon approche', 'default_url': f'{U}1465495976277-4387d4b0b4c6{QS}', 'default_alt': 'Mariés enlacés au coucher du soleil — approche documentaire du mariage'},
    {'slot_key': 'apropos-coulisses-1', 'page': 'À propos', 'label': 'À propos — Coulisses image 1', 'description': 'Bande « Dans les coulisses » — image 1', 'default_url': f'{U}1452587925148-ce544e77e70d{QS}', 'default_alt': 'Samuel en reportage, appareil en main — dans les coulisses'},
    {'slot_key': 'apropos-coulisses-2', 'page': 'À propos', 'label': 'À propos — Coulisses image 2', 'description': 'Bande « Dans les coulisses » — image 2', 'default_url': f'{U}1519741497674-611481863552{QS}', 'default_alt': 'Reportage auprès des mariés et des invités — coulisses de mariage'},
    {'slot_key': 'apropos-coulisses-3', 'page': 'À propos', 'label': 'À propos — Coulisses image 3', 'description': 'Bande « Dans les coulisses » — image 3', 'default_url': f'{U}1519225421980-715cb0215aed{QS}', 'default_alt': 'Soirée de mariage sous les guirlandes — en pleine prise de vue'},
    {'slot_key': 'apropos-coulisses-4', 'page': 'À propos', 'label': 'À propos — Coulisses image 4', 'description': 'Bande « Dans les coulisses » — image 4', 'default_url': f'{U}1516035069371-29a1b244cc32{QS}', 'default_alt': 'Détail du matériel photo — sangle et boîtier professionnel'},
    {'slot_key': 'apropos-coulisses-5', 'page': 'À propos', 'label': 'À propos — Coulisses image 5', 'description': 'Bande « Dans les coulisses » — image 5', 'default_url': f'{U}1532712938310-34cb3982ef74{QS}', 'default_alt': 'Séance couple en extérieur — le photographe au travail'},
    {'slot_key': 'apropos-cta-fond', 'page': 'À propos', 'label': 'À propos — Fond section finale', 'description': 'Photo de fond de la section « Parlons de votre histoire »', 'default_url': f'{U}1521033719794-41049d18b8d4{Q}', 'default_alt': 'Couple de mariés au coucher du soleil — parlons de votre histoire'},

    # ---------- PORTFOLIO ----------
    {'slot_key': 'portfolio-hero', 'page': 'Portfolio', 'label': 'Portfolio — Bannière (photo de droite)', 'description': "Photo du hero, fondue vers l'ivoire à gauche", 'default_url': f'{U}1646380911979-615ba6cc9826{Q}', 'default_alt': 'Couple de mariés contemplant la vallée au coucher du soleil — portfolio mariage'},
    {'slot_key': 'portfolio-une', 'page': 'Portfolio', 'label': 'Portfolio — Reportage à la une (photo)', 'description': 'Photo à gauche du bloc « Reportage à la une »', 'default_url': f'{U}1542038784456-1ea8e935640e{QS}', 'default_alt': 'Samuel Bocquillon, appareil en main pendant un reportage de mariage'},
    {'slot_key': 'portfolio-temoignage-fond', 'page': 'Portfolio', 'label': 'Portfolio — Fond bande témoignage', 'description': 'Photo panoramique derrière la citation client', 'default_url': f'{U}1519225421980-715cb0215aed{Q}', 'default_alt': 'Mariés dansant sous les guirlandes lumineuses — souvenir de soirée'},
    {'slot_key': 'portfolio-cta-camera', 'page': 'Portfolio', 'label': 'Portfolio — Appareil photo (section finale)', 'description': "Photo de l'appareil photo à droite de l'appel à l'action (fond clair conseillé)", 'default_url': f'{U}1502920917128-1aa500764cbd{QS}', 'default_alt': 'Appareil photo vintage et sa sangle en cuir — prêt à raconter votre histoire'},

    # ---------- PRESTATIONS (hub) ----------
    {'slot_key': 'prestations-hero', 'page': 'Prestations', 'label': 'Prestations — Bannière', 'description': 'Photo de bannière de la page Prestations', 'default_url': f'{U}1583939003579-730e3918a45a{Q}', 'default_alt': 'Couple de mariés émus — prestations photographe de mariage'},
    {'slot_key': 'prestations-options', 'page': 'Prestations', 'label': 'Prestations — Image Options & Extras', 'description': 'Photo illustrant les options (album, séances…)', 'default_url': f'{U}1546032996-6dfacbacbf3f{QS}', 'default_alt': 'Album de mariage fine art et bouquet — options et extras'},
    {'slot_key': 'prestations-cta-fond', 'page': 'Prestations', 'label': 'Prestations — Fond section finale', 'description': 'Photo de fond de l\'appel à l\'action final', 'default_url': f'{U}1519671482749-fd09be7ccebf{Q}', 'default_alt': 'Regard complice des mariés — réserver votre date de mariage'},

    # ---------- MARIAGE ----------
    {'slot_key': 'mariage-hero', 'page': 'Présentation — Mariage', 'label': 'Mariage — Bannière', 'description': 'Photo de bannière de la page Mariage', 'default_url': f'{U}1465495976277-4387d4b0b4c6{Q}', 'default_alt': 'Mariés au coucher du soleil — photographe de mariage Valenciennes'},
    {'slot_key': 'mariage-galerie-1', 'page': 'Présentation — Mariage', 'label': 'Mariage — Galerie image 1', 'description': 'Souvenirs qui traversent le temps — image 1', 'default_url': f'{U}1511285560929-80b456fea0bc{QS}', 'default_alt': 'Jeunes mariés en balade urbaine — reportage spontané'},
    {'slot_key': 'mariage-galerie-2', 'page': 'Présentation — Mariage', 'label': 'Mariage — Galerie image 2', 'description': 'Souvenirs qui traversent le temps — image 2', 'default_url': f'{U}1606800052052-a08af7148866{QS}', 'default_alt': 'Échange des vœux et des alliances — émotion du jour J'},
    {'slot_key': 'mariage-galerie-3', 'page': 'Présentation — Mariage', 'label': 'Mariage — Galerie image 3', 'description': 'Souvenirs qui traversent le temps — image 3', 'default_url': f'{U}1522673607200-164d1b6ce486{QS}', 'default_alt': 'Ouverture de bal des mariés — soirée de mariage'},
    {'slot_key': 'mariage-cta-fond', 'page': 'Présentation — Mariage', 'label': 'Mariage — Fond section finale', 'description': 'Photo de fond de l\'appel à l\'action', 'default_url': f'{U}1465495976277-4387d4b0b4c6{Q}', 'default_alt': 'Couple au crépuscule — parlons de votre mariage'},

    # ---------- CORPORATE ----------
    {'slot_key': 'corporate-hero', 'page': 'Présentation — Corporate', 'label': 'Corporate — Bannière', 'description': 'Photo de bannière de la page Corporate', 'default_url': f'{U}1540575467063-178a50c2df87{Q}', 'default_alt': 'Conférence d\'entreprise — photographe corporate Hauts-de-France'},
    {'slot_key': 'corporate-prestation-1', 'page': 'Présentation — Corporate', 'label': 'Corporate — Reportage événementiel', 'description': 'Image de la prestation Reportage événementiel', 'default_url': f'{U}1540575467063-178a50c2df87{QS}', 'default_alt': 'Reportage photo d\'événement professionnel — séminaire d\'entreprise'},
    {'slot_key': 'corporate-prestation-2', 'page': 'Présentation — Corporate', 'label': 'Corporate — Portraits d\'équipe', 'description': 'Image de la prestation Portraits d\'équipe', 'default_url': f'{U}1521737604893-d14cc237f11d{QS}', 'default_alt': 'Portraits d\'équipe en entreprise — photo corporate authentique'},
    {'slot_key': 'corporate-prestation-3', 'page': 'Présentation — Corporate', 'label': 'Corporate — Marque employeur', 'description': 'Image de la prestation Marque employeur', 'default_url': f'{U}1556761175-b413da4baf72{QS}', 'default_alt': 'Reportage en immersion dans les bureaux — marque employeur'},
    {'slot_key': 'corporate-prestation-4', 'page': 'Présentation — Corporate', 'label': 'Corporate — Contenu réseaux sociaux', 'description': 'Image de la prestation Contenu réseaux sociaux', 'default_url': f'{U}1507504031003-b417219a0fde{QS}', 'default_alt': 'Création de contenu visuel pour réseaux sociaux d\'entreprise'},
    {'slot_key': 'corporate-cta-fond', 'page': 'Présentation — Corporate', 'label': 'Corporate — Fond section finale', 'description': 'Photo de fond de l\'appel à l\'action', 'default_url': f'{U}1556761175-b413da4baf72{Q}', 'default_alt': 'Équipe en réunion créative — projet photo corporate'},

    # ---------- PHOTOBOOTH ----------
    {'slot_key': 'photobooth-hero', 'page': 'Présentation — Photobooth', 'label': 'Photobooth — Bannière', 'description': 'Photo de bannière de la page Photobooth', 'default_url': f'{U}1527529482837-4698179dc6ce{Q}', 'default_alt': 'Invités s\'amusant devant le photobooth — animation de mariage'},
    {'slot_key': 'photobooth-action-1', 'page': 'Présentation — Photobooth', 'label': 'Photobooth — En action image 1', 'description': 'Le photobooth en action — image 1', 'default_url': f'{U}1527529482837-4698179dc6ce{QS}', 'default_alt': 'Amis posant avec accessoires au photobooth — souvenirs immédiats'},
    {'slot_key': 'photobooth-action-2', 'page': 'Présentation — Photobooth', 'label': 'Photobooth — En action image 2', 'description': 'Le photobooth en action — image 2', 'default_url': f'{U}1520854221256-17451cc331bf{QS}', 'default_alt': 'Groupe d\'invités hilares — animation photobooth de soirée'},
    {'slot_key': 'photobooth-action-3', 'page': 'Présentation — Photobooth', 'label': 'Photobooth — En action image 3', 'description': 'Le photobooth en action — image 3', 'default_url': f'{U}1515934751635-c81c6bc9a2d8{QS}', 'default_alt': 'Instants de fête capturés au photobooth — mariage convivial'},

    # ---------- FORMATION ----------
    {'slot_key': 'formation-hero', 'page': 'Présentation — Formation', 'label': 'Formation — Bannière', 'description': 'Photo de bannière de la page Formation', 'default_url': f'{U}1452587925148-ce544e77e70d{Q}', 'default_alt': 'Photographe en formation au coucher du soleil — cours photo'},
    {'slot_key': 'formation-module-1', 'page': 'Présentation — Formation', 'label': 'Formation — Module Débutant', 'description': 'Image du module Débutant', 'default_url': f'{U}1516035069371-29a1b244cc32{QS}', 'default_alt': 'Appareil photo reflex pour débutants — formation photo'},
    {'slot_key': 'formation-module-2', 'page': 'Présentation — Formation', 'label': 'Formation — Module Retouche Lightroom', 'description': 'Image du module Retouche', 'default_url': f'{U}1554048612-b6a482bc67e5{QS}', 'default_alt': 'Retouche photo sur Lightroom — formation post-production'},
    {'slot_key': 'formation-module-3', 'page': 'Présentation — Formation', 'label': 'Formation — Module Studio', 'description': 'Image du module Studio', 'default_url': f'{U}1550005809-91ad75fb315f{QS}', 'default_alt': 'Séance photo en studio — maîtrise de l\'éclairage'},
    {'slot_key': 'formation-module-4', 'page': 'Présentation — Formation', 'label': 'Formation — Module Reportage', 'description': 'Image du module Reportage', 'default_url': f'{U}1502920917128-1aa500764cbd{QS}', 'default_alt': 'Photographe en reportage sur le terrain — formation reportage'},
    {'slot_key': 'formation-image-1', 'page': 'Présentation — Formation', 'label': 'Formation — En images 1', 'description': 'Section Apprendre. Pratiquer. Partager. — image 1', 'default_url': f'{U}1516035069371-29a1b244cc32{QS}', 'default_alt': 'Matériel photo pendant un atelier — apprendre la photographie'},
    {'slot_key': 'formation-image-2', 'page': 'Présentation — Formation', 'label': 'Formation — En images 2', 'description': 'Section Apprendre. Pratiquer. Partager. — image 2', 'default_url': f'{U}1452587925148-ce544e77e70d{QS}', 'default_alt': 'Pratique photo en extérieur — atelier lumière naturelle'},
    {'slot_key': 'formation-image-3', 'page': 'Présentation — Formation', 'label': 'Formation — En images 3', 'description': 'Section Apprendre. Pratiquer. Partager. — image 3', 'default_url': f'{U}1502920917128-1aa500764cbd{QS}', 'default_alt': 'Stagiaire photographe en situation réelle — formation terrain'},

    # ---------- BLOG ----------
    {'slot_key': 'blog-hero', 'page': 'Blog', 'label': 'Blog — Bannière (photo de droite)', 'description': 'Grande photographie du hero de la page Blog', 'default_url': f'{U}1519741497674-611481863552{Q}', 'default_alt': 'Baiser des mariés sous une arche de pierre — blog du photographe Samuel Bocquillon'},
    {'slot_key': 'blog-prefooter-1', 'page': 'Blog', 'label': 'Blog — Bandeau éditorial image 1', 'description': 'Bandeau brun avant le footer — image 1', 'default_url': f'{U}1481653125770-b78c206c59d4{QS}', 'default_alt': 'Portrait de la mariée sous son voile — reportage de mariage'},
    {'slot_key': 'blog-prefooter-2', 'page': 'Blog', 'label': 'Blog — Bandeau éditorial image 2', 'description': 'Bandeau brun avant le footer — image 2', 'default_url': f'{U}1519225421980-715cb0215aed{QS}', 'default_alt': 'Table de réception élégante — décoration de mariage'},
    {'slot_key': 'blog-prefooter-3', 'page': 'Blog', 'label': 'Blog — Bandeau éditorial image 3', 'description': 'Bandeau brun avant le footer — image 3', 'default_url': f'{U}1606800052052-a08af7148866{QS}', 'default_alt': 'Détail des alliances des mariés — souvenirs précieux'},

    # ---------- CONTACT ----------
    {'slot_key': 'contact-hero', 'page': 'Contact', 'label': 'Contact — Bannière (photo de droite)', 'description': "Photo du hero, fondue vers l'ivoire à gauche", 'default_url': f'{U}1646380911979-615ba6cc9826{Q}', 'default_alt': 'Couple de mariés face au coucher du soleil — contactez votre photographe de mariage'},
    {'slot_key': 'contact-cta-fond', 'page': 'Contact', 'label': 'Contact — Fond section « Prêt à écrire votre histoire ? »', 'description': "Photo de fond de l'appel à l'action final", 'default_url': f'{U}1583939003579-730e3918a45a{Q}', 'default_alt': 'Baiser tendre des jeunes mariés — prêt à écrire votre histoire'},

    # ---------- AVIS ----------
    {'slot_key': 'avis-hero', 'page': 'Avis clients', 'label': 'Avis — Bannière', 'description': 'Photo de bannière de la page Avis clients', 'default_url': f'{U}1525258946800-98cfd641d0de{Q}', 'default_alt': 'Mariés heureux — avis clients du photographe Samuel Bocquillon'},

    # ---------- PAGES VILLES ----------
    {'slot_key': 'ville-valenciennes-hero', 'page': 'Villes — SEO local', 'label': 'Ville — Valenciennes (bannière)', 'description': 'Bannière de la page Photographe de mariage à Valenciennes', 'default_url': f'{U}1519741497674-611481863552{Q}', 'default_alt': 'Photographe de mariage à Valenciennes — reportage authentique'},
    {'slot_key': 'ville-lille-hero', 'page': 'Villes — SEO local', 'label': 'Ville — Lille (bannière)', 'description': 'Bannière de la page Photographe de mariage à Lille', 'default_url': f'{U}1511285560929-80b456fea0bc{Q}', 'default_alt': 'Photographe de mariage à Lille — couple de mariés en ville'},
    {'slot_key': 'ville-douai-hero', 'page': 'Villes — SEO local', 'label': 'Ville — Douai (bannière)', 'description': 'Bannière de la page Photographe de mariage à Douai', 'default_url': f'{U}1464366400600-7168b8af9bc3{Q}', 'default_alt': 'Photographe de mariage à Douai — cérémonie en extérieur'},
    {'slot_key': 'ville-cambrai-hero', 'page': 'Villes — SEO local', 'label': 'Ville — Cambrai (bannière)', 'description': 'Bannière de la page Photographe de mariage à Cambrai', 'default_url': f'{U}1532712938310-34cb3982ef74{Q}', 'default_alt': 'Photographe de mariage à Cambrai — mariés en balade champêtre'},
]

PAGE_ORDER = ['Accueil', 'À propos', 'Portfolio', 'Prestations', 'Présentation — Mariage', 'Présentation — Corporate', 'Présentation — Photobooth', 'Présentation — Formation', 'Blog', 'Contact', 'Avis clients', 'Villes — SEO local']

DEFAULT_TESTIMONIALS = [
    {'id': 'seed-1', 'author': 'Clara & Julien', 'role': 'Mariés en Provence', 'text': 'Il ne regarde pas ses photos. On les ressent.', 'rating': 5, 'category': 'mariage', 'featured': True},
    {'id': 'seed-2', 'author': 'Marie & Thomas', 'role': 'Mariés à Lille', 'text': 'Ses photos sont tout simplement sublimes. Elles nous replongent dans chaque émotion de notre journée.', 'rating': 5, 'category': 'mariage', 'featured': True},
    {'id': 'seed-3', 'author': 'Un directeur général', 'role': 'Entreprise régionale', 'text': 'Samuel sait saisir l\'essence de notre entreprise avec discrétion, sens du détail et beaucoup de professionnalisme.', 'rating': 5, 'category': 'corporate', 'featured': True},
    {'id': 'seed-4', 'author': 'Matthieu L.', 'role': 'Stagiaire formation', 'text': 'La formation de Samuel m\'a permis non seulement d\'acquérir des techniques, mais surtout de sortir de ma zone de confort et d\'oser. Il est patient, pédagogue et passionné. Je recommande vivement !', 'rating': 5, 'category': 'formation', 'featured': True},
    {'id': 'seed-5', 'author': 'Sophie & Antoine', 'role': 'Mariés à Valenciennes', 'text': 'Discret toute la journée, on l\'a presque oublié… jusqu\'à la découverte des photos. Chaque image raconte exactement ce que nous avons vécu.', 'rating': 5, 'category': 'mariage', 'featured': False},
    {'id': 'seed-6', 'author': 'Laëtitia & Maxime', 'role': 'Mariés à Douai', 'text': 'Un immense merci ! Les photos sont naturelles, lumineuses, pleines de vie. Nos familles n\'en reviennent toujours pas.', 'rating': 5, 'category': 'mariage', 'featured': False},
]

# ---------- GALERIE UNIFIÉE (seed initial — migré depuis l'ancienne mosaïque Portfolio) ----------
GALLERY_SEED = [
    {'url': f'{U}1520854221256-17451cc331bf{QS}', 'alt': 'Invités complices dans la voiture des mariés — ambiance de cortège'},
    {'url': f'{U}1522673607200-164d1b6ce486{QS}', 'alt': 'Sortie de cérémonie sous une pluie de confettis — mariage en France'},
    {'url': f'{U}1521033719794-41049d18b8d4{QS}', 'alt': 'Coucher de soleil sur le lac le soir du mariage — destination wedding'},
    {'url': f'{U}1606800052052-a08af7148866{QS}', 'alt': 'Détail de la montre et des alliances du marié — préparatifs'},
    {'url': f'{U}1519741497674-611481863552{QS}', 'alt': 'Les mariés dansant au milieu de leurs invités — soirée de mariage'},
    {'url': f'{U}1583939003579-730e3918a45a{QS}', 'alt': 'Porté romantique des mariés à la lumière des cierges magiques'},
    {'url': f'{U}1465495976277-4387d4b0b4c6{QS}', 'alt': 'Baiser des mariés dans les hautes herbes au soleil couchant — élopement'},
    {'url': f'{U}1532712938310-34cb3982ef74{QS}', 'alt': 'Cérémonie intime en terrasse face à la vallée — élopement'},
    {'url': f'{U}1525258946800-98cfd641d0de{QS}', 'alt': 'Étreinte tendre des jeunes mariés — émotion à fleur de peau'},
    {'url': f'{U}1511285560929-80b456fea0bc{QS}', 'alt': 'La mariée à la sortie de la voiture de collection — noir et blanc'},
    {'url': f'{U}1519225421980-715cb0215aed{QS}', 'alt': 'Réception sous les guirlandes lumineuses — chaleur de la soirée'},
    {'url': f'{U}1481653125770-b78c206c59d4{QS}', 'alt': 'Portrait de la mariée à la lumière naturelle — mariage à l\'étranger'},
]
