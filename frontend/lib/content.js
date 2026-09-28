// Contenu du site — fidèle aux maquettes fournies

export const SITE_URL = process.env.REACT_APP_BACKEND_URL || 'https://wedding-samuel.preview.emergentagent.com';

export const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/a-propos', label: 'À propos' },
  { href: '/portfolio', label: 'Portfolio' },
  {
    href: '/prestations',
    label: 'Prestations',
    children: [
      { href: '/prestations/mariage', label: 'Mariage' },
      { href: '/prestations/corporate', label: 'Corporate' },
      { href: '/prestations/photobooth', label: 'Photobooth' },
      { href: '/prestations/formation', label: 'Formation' },
    ],
  },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export const HOME_COLLECTIONS = [
  { num: '01', name: 'Collection Hugs', description: "Des préparatifs à la fin du vin d'honneur, avec prise de vue drone et prises de vue illimitées.", price: '1 990 € TTC', testid: 'pricing-card-hugs' },
  { num: '02', name: 'Collection Delight', description: "Séance d'engagement, présence jusqu'à 1 h du matin et photobooth avec 400 impressions.", price: '2 490 € TTC', testid: 'pricing-card-delight' },
  { num: '03', name: 'Collection Infinity', description: "L'expérience complète : After Day, album personnalisé et livraison express sous 8 jours.", price: '3 390 € TTC', testid: 'pricing-card-infinity' },
];

export const PRESTATIONS_COLLECTIONS = [
  { num: '01', name: 'Collection Hugs', price: '1 990 € TTC', features: ["Présence des préparatifs jusqu'à 20 h (fin du vin d'honneur)", 'Prise de vue drone', 'Prises de vue illimitées', 'Coffret clé USB 32 Go + galerie privée 6 mois'], testid: 'prestations-card-hugs' },
  { num: '02', name: 'Collection Delight', price: '2 490 € TTC', features: ["Séance d'engagement", "Présence des préparatifs jusqu'à 1 h du matin (gâteau)", 'Photobooth avec 400 impressions', 'Prise de vue drone + prises de vue illimitées'], popular: true, testid: 'prestations-card-delight' },
  { num: '03', name: 'Collection Infinity', price: '3 390 € TTC', features: ["After Day + séance d'engagement", 'Livraison photo express sous 8 jours', 'Album personnalisé avec pochette de transport', 'Photobooth avec 400 impressions'], testid: 'prestations-card-infinity' },
];

// Collections mariage — contenu contractuel exact (tarifs nets TTC).
// Icônes lucide-react référencées par nom, mappées dans la page.
export const MARIAGE_COLLECTIONS = [
  {
    id: 'hugs',
    name: 'Hugs',
    price: '1 990 € TTC',
    features: [
      { icon: 'Clock', text: "Présence des préparatifs jusqu'à 20 h (fin du vin d'honneur)" },
      { icon: 'Plane', text: 'Prise de vue drone' },
      { icon: 'Infinity', text: 'Prises de vue illimitées' },
      { icon: 'Wand2', text: 'Temps de post-production (tri, retouche, colorimétrie)' },
      { icon: 'Usb', text: 'Livraison sur coffret clé USB 32 Go' },
      { icon: 'LockKeyhole', text: 'Galerie personnalisée privée 6 mois' },
      { icon: 'Presentation', text: 'Diaporama' },
      { icon: 'CalendarCheck', text: 'Rendez-vous de préparation' },
      { icon: 'Car', text: 'Déplacement' },
    ],
  },
  {
    id: 'delight',
    name: 'Delight',
    price: '2 490 € TTC',
    popular: true,
    badge: 'Le plus choisi',
    features: [
      { icon: 'HeartHandshake', text: "Séance d'engagement" },
      { icon: 'Clock', text: "Présence des préparatifs jusqu'à 1 h du matin (gâteau)" },
      { icon: 'Plane', text: 'Prise de vue drone' },
      { icon: 'Printer', text: 'Photobooth avec 400 impressions' },
      { icon: 'Infinity', text: 'Prises de vue illimitées' },
      { icon: 'Wand2', text: 'Temps de post-production (tri, retouche, colorimétrie)' },
      { icon: 'Usb', text: 'Livraison sur coffret clé USB 32 Go' },
      { icon: 'LockKeyhole', text: 'Galerie personnalisée privée 6 mois' },
      { icon: 'Presentation', text: 'Diaporama' },
      { icon: 'CalendarCheck', text: 'Rendez-vous de préparation' },
      { icon: 'Car', text: 'Déplacement' },
    ],
  },
  {
    id: 'infinity',
    name: 'Infinity',
    price: '3 390 € TTC',
    features: [
      { icon: 'HeartHandshake', text: "Séance d'engagement" },
      { icon: 'Clock', text: "Présence des préparatifs jusqu'à 1 h du matin (gâteau)" },
      { icon: 'Sunrise', text: 'After Day' },
      { icon: 'Plane', text: 'Prise de vue drone' },
      { icon: 'Printer', text: 'Photobooth avec 400 impressions' },
      { icon: 'Infinity', text: 'Prises de vue illimitées' },
      { icon: 'Wand2', text: 'Temps de post-production (tri, retouche, colorimétrie)' },
      { icon: 'Zap', text: 'Livraison photo express sous 8 jours' },
      { icon: 'Usb', text: 'Livraison sur coffret clé USB 32 Go' },
      { icon: 'BookImage', text: 'Album personnalisé avec pochette de transport (dès 150 photos)' },
      { icon: 'LockKeyhole', text: 'Galerie personnalisée privée 6 mois' },
      { icon: 'Presentation', text: 'Diaporama' },
      { icon: 'CalendarCheck', text: 'Rendez-vous de préparation' },
      { icon: 'Car', text: 'Déplacement' },
    ],
  },
];

// Options complémentaires (facturation distincte, soumises à disponibilité)
export const MARIAGE_OPTIONS = [
  { icon: 'Timer', name: 'Heures supplémentaires', price: '120 € / heure', text: "Ajoutables au plus tard 15 jours avant le mariage. À titre exceptionnel, si le jour du mariage la couverture horaire est dépassée avec l'accord des mariés, chaque heure commencée est due." },
  { icon: 'Users', name: 'Second photographe / assistant', price: '500 €', text: "Hautement recommandé au-delà de 150 invités. Ce tarif s'applique quelle que soit la collection choisie." },
  { icon: 'Camera', name: 'Photobooth interactif', price: 'Sur devis', text: "Mise à disposition d'un photobooth pendant toute la durée de présence du photographe le jour J, avec possibilité d'impression selon le forfait choisi." },
  { icon: 'Zap', name: 'Post-traitement express', price: '500 €', text: "Livraison des photographies de mariage 8 jours après l'événement." },
];

// Mentions contractuelles affichées sous les options
export const MARIAGE_MENTIONS = [
  "Réservation : acompte de 30 % à la signature du contrat, solde avant l'envoi du coffret final.",
  'Frais de déplacement offerts dans un rayon de 150 km ; au-delà, 0,80 € / km + péages.',
  "Les prix sont nets, TTC, et garantis 21 jours à compter de l'envoi du contrat.",
];

export const INCLUS_ITEMS = [
  { icon: 'Eye', title: 'Un regard discret', text: 'Une présence attentive qui ne perturbe jamais vos moments.' },
  { icon: 'Sparkles', title: 'Photos soignées', text: 'Chaque image est retouchée individuellement, avec justesse.' },
  { icon: 'Lock', title: 'Galerie privée', text: 'Un espace sécurisé pour partager vos photos avec vos proches.' },
  { icon: 'Heart', title: 'Souvenirs durables', text: 'Des fichiers haute définition, pour toute une vie.' },
];

export const ACCOMPAGNEMENT_STEPS = [
  { num: '01', title: 'Premier échange', text: 'Nous faisons connaissance, vous me racontez votre histoire et vos envies.' },
  { num: '02', title: 'Préparation', text: "Repérage, planning et conseils : tout est anticipé pour un jour J serein." },
  { num: '03', title: 'Le jour J', text: 'Je capture chaque instant avec discrétion, du matin à la fête.' },
  { num: '04', title: 'Vos souvenirs', text: 'Vous recevez votre galerie complète, retouchée avec soin.' },
];

export const OPTIONS_EXTRAS = [
  { name: 'Heures supplémentaires', price: '120 € / heure' },
  { name: 'Second photographe / assistant', price: '500 €' },
  { name: 'Photobooth interactif', price: 'Sur devis' },
  { name: 'Post-traitement express', price: '500 €' },
];

export const FAQ_PRESTATIONS = [
  { q: 'Combien de temps après le mariage recevons-nous nos photos ?', a: 'Vous recevez une sélection d\'avant-premières sous 72h, puis la galerie complète sous 4 à 6 semaines selon la saison.' },
  { q: 'Travaillez-vous seul ou en équipe ?', a: 'Je travaille seul par défaut, pour garantir la discrétion qui fait ma signature. Un second photographe peut être ajouté en option pour les grands mariages.' },
  { q: 'Proposez-vous des albums ?', a: 'Oui — un album personnalisé avec pochette de transport (dès 150 photos) est inclus dans la Collection Infinity.' },
  { q: 'Vous déplacez-vous partout en France ?', a: 'Absolument. Basé à Valenciennes, j\'interviens dans tous les Hauts-de-France (Lille, Douai, Cambrai…), partout en France et à l\'étranger. Les frais de déplacement sont offerts dans un rayon de 150 km ; au-delà, 0,80 € / km + péages.' },
  { q: 'Comment réserver votre date ?', a: 'Un acompte de 30 % à la signature du contrat suffit à bloquer votre date. Le solde est réglé avant l\'envoi du coffret final.' },
];

export const FAQ_CONTACT = [
  { q: 'Comment réserver votre date ?', a: 'Contactez-moi via le formulaire avec votre date : je vous confirme ma disponibilité sous 24 à 48h. Un acompte de 30 % et un contrat signé bloquent définitivement votre date.' },
  { q: 'Où êtes-vous basé ?', a: 'Je suis basé à Valenciennes, dans le Nord (59). J\'interviens régulièrement à Lille, Douai, Cambrai et dans tous les Hauts-de-France.' },
  { q: 'Travaillez-vous à l\'international ?', a: 'Oui, votre histoire m\'emmène où elle veut : destination weddings et élopements partout en Europe et à l\'international.' },
  { q: 'Proposez-vous des séances engagement ?', a: 'Oui — une séance couple avant le mariage, idéale pour apprivoiser l\'objectif. Incluse dans les collections Delight et Infinity.' },
  { q: 'Combien de photos livrez-vous ?', a: 'Les prises de vue sont illimitées quelle que soit la collection. Toutes les photos livrées sont triées, retouchées et en haute définition, sans filigrane.' },
];

export const VALEURS = [
  { icon: 'Camera', title: 'Authenticité', text: 'Des images vraies, prises sur le vif, qui reflètent votre personnalité.' },
  { icon: 'Heart', title: 'Émotion', text: 'Chaque mariage est unique et chargé d\'émotion — je capture ces moments précieux.' },
  { icon: 'Gem', title: 'Élégance', text: 'Une attention particulière pour une image épurée et raffinée, au rendu intemporel.' },
];

export const PARCOURS = [
  { year: '2009', title: 'Création de SK Music Sonorisation.', text: 'Une passion pour la musique devenue peu à peu une véritable activité événementielle.' },
  { year: '2012', title: 'Mariages & premières photos.', text: 'Je photographie les soirées de mariage en complément de mes prestations de sonorisation.' },
  { year: '2017', title: 'Le déclic.', text: 'La photographie prend le dessus sur l\'animation et devient le cœur de mon activité.' },
  { year: '2019', title: 'Photographe à 100 %.', text: 'Arrêt de la sonorisation et premiers destination weddings, notamment à Rome puis à l\'étranger.' },
  { year: '2020–2022', title: 'Diversification & transmission.', text: 'Reportages d\'entreprise, vidéo, lancement du photobooth et premières formations photo.' },
  { year: '2025', title: 'Photobooth Classique & Vintage.', text: 'Création d\'une marque indépendante dédiée à mon activité photobooth et événementielle.' },
  { year: '2026', title: 'Une vision arrivée à maturité.', text: 'Moins de mariages, des projets plus qualitatifs et une approche toujours plus personnelle.' },
];

export const CORPORATE_PRESTATIONS = [
  { slot: 'corporate-prestation-1', title: 'Reportage événementiel', text: 'Séminaires, conférences, soirées d\'entreprise : je raconte vos événements avec un regard éditorial.' },
  { slot: 'corporate-prestation-2', title: 'Portraits d\'équipe', text: 'Des portraits naturels et valorisants, en studio ou dans vos locaux.' },
  { slot: 'corporate-prestation-3', title: 'Marque employeur', text: 'Des images d\'immersion authentiques pour attirer vos futurs talents.' },
  { slot: 'corporate-prestation-4', title: 'Contenu réseaux sociaux', text: 'Une banque d\'images sur-mesure, alignée avec votre identité de marque.' },
];

export const CORPORATE_STEPS = [
  { num: '01', title: 'Comprendre', text: 'Votre culture, vos valeurs, vos objectifs : tout part de l\u00e0.' },
  { num: '02', title: 'Concevoir', text: 'Un moodboard et un plan de prises de vue validés ensemble.' },
  { num: '03', title: 'Réaliser', text: 'Une présence discrète et efficace, sans perturber vos équipes.' },
  { num: '04', title: 'Livrer', text: 'Des images prêtes à l\'emploi, optimisées pour chaque canal.' },
];

export const CORPORATE_CLIENTS = ['Nordinvest', 'Atelier V.', 'Groupe Hainaut', 'Studio Nova', 'CCI Grand Hainaut', 'Maison Delcourt'];

export const PHOTOBOOTH_FORMULES = [
  { num: '01', name: "L'Essentiel", price: '490 € TTC', features: ['3h de mise à disposition', 'Tirages illimités', 'Accessoires fournis', 'Galerie en ligne privée'] },
  { num: '02', name: 'Coup de Cœur', price: '690 € TTC', features: ['5h de mise à disposition', 'Fond personnalisé', 'Album livre d\'or', 'Livraison numérique complète'], popular: true },
  { num: '03', name: "L'Intégrale", price: '990 € TTC', features: ['Soirée complète', 'Borne + téléphone livre d\'or', 'Accessoires premium', 'Écran de partage en direct'] },
];

export const PHOTOBOOTH_OPTIONS = [
  { icon: 'Printer', name: 'Impressions', text: 'Tirages instantanés de qualité studio.' },
  { icon: 'Globe', name: 'Galerie en ligne', text: 'Toutes les photos accessibles dès le lendemain.' },
  { icon: 'Image', name: 'Fond personnalisé', text: 'Un décor à votre image, conçu sur-mesure.' },
  { icon: 'Phone', name: 'Téléphone livre d\'or', text: 'Vos invités laissent un message audio souvenir.' },
  { icon: 'Star', name: 'Accessoires premium', text: 'Une malle d\'accessoires élégants et amusants.' },
];

export const PHOTOBOOTH_STEPS = [
  { num: '1', title: 'Prenez la pose', text: 'Seul, en couple ou en groupe — l\'écran vous guide.' },
  { num: '2', title: 'Impression instantanée', text: 'Votre tirage sort en quelques secondes.' },
  { num: '3', title: 'Partagez & revivez', text: 'Envoi immédiat par mail ou QR code.' },
  { num: '4', title: 'Des souvenirs pour toujours', text: 'La galerie complète vous est livrée après l\'événement.' },
];

export const FORMATION_MODULES = [
  { num: '01', slot: 'formation-module-1', title: 'Débutant', text: 'Maîtrisez votre boîtier, la lumière et la composition — les fondamentaux, sans jargon.' },
  { num: '02', slot: 'formation-module-2', title: 'Retouche Lightroom', text: 'Développez un style cohérent et un flux de travail efficace.' },
  { num: '03', slot: 'formation-module-3', title: 'Studio', text: 'Apprivoisez l\'éclairage artificiel et le portrait en studio.' },
  { num: '04', slot: 'formation-module-4', title: 'Reportage', text: 'L\'art de raconter une histoire vraie : anticipation, discrétion, instant décisif.' },
];

export const FORMATION_COMPETENCES = [
  { icon: 'BookOpen', title: 'Théorie' },
  { icon: 'Camera', title: 'Pratique' },
  { icon: 'Users', title: 'Accompagnement' },
  { icon: 'Target', title: 'Application' },
  { icon: 'ShieldCheck', title: 'Confiance' },
];

export const CITIES = {
  valenciennes: {
    slug: 'photographe-mariage-valenciennes',
    name: 'Valenciennes',
    dept: 'Nord (59)',
    heroSlot: 'ville-valenciennes-hero',
    intro: "Photographe de mariage basé à Valenciennes, je capture des histoires vraies dans tout le Valenciennois : cérémonies civiles à l'hôtel de ville, églises de l'Athis, châteaux et granges du Hainaut.",
    resume: "Samuel Bocquillon est photographe de mariage à Valenciennes (Nord, 59). Approche documentaire et élégante, reportages complets du préparatif à la soirée, à partir de 1 990 €. Déplacement offert dans un rayon de 150 km.",
    venues: ['Le Royal Hainaut Spa & Resort', "L'hôtel de ville de Valenciennes", 'Le musée des Beaux-Arts', 'Les granges et châteaux du Hainaut'],
    zone: 'Valenciennes, Anzin, Saint-Saulve, Marly, Aulnoy-lez-Valenciennes, Denain et tout le Valenciennois.',
    faq: [
      { q: 'Quel est le prix d\'un photographe de mariage à Valenciennes ?', a: 'Mes collections débutent à 1 990 € TTC (Collection Hugs) et vont jusqu\'à 3 390 € TTC (Collection Infinity, avec After Day et album personnalisé). Le déplacement est offert dans un rayon de 150 km.' },
      { q: 'Vous déplacez-vous dans tout le Valenciennois ?', a: 'Oui — basé à Valenciennes, j\'interviens sans frais de déplacement dans un rayon de 150 km : Denain, Saint-Amand-les-Eaux, Condé-sur-l\'Escaut, Le Quesnoy…' },
      { q: 'Combien de temps à l\'avance faut-il réserver ?', a: 'Les dates de mai à septembre partent 12 à 18 mois à l\'avance. Contactez-moi dès que votre date est fixée : je confirme ma disponibilité sous 24h.' },
    ],
  },
  lille: {
    slug: 'photographe-mariage-lille',
    name: 'Lille',
    dept: 'Nord (59)',
    heroSlot: 'ville-lille-hero',
    intro: "Des pavés du Vieux-Lille aux salles de réception de la métropole, je photographie votre mariage à Lille avec un regard documentaire et élégant, sans jamais figer vos moments.",
    resume: "Samuel Bocquillon, photographe de mariage intervenant à Lille et dans toute la métropole lilloise (MEL). Reportages authentiques et élégants à partir de 1 990 €, du préparatif à la fête.",
    venues: ['Le Vieux-Lille et la Grand\'Place', 'Le Palais Rameau', 'La Citadelle et ses parcs', 'Les châteaux de la métropole (Vert-Bois, Bourgogne…)'],
    zone: 'Lille, Roubaix, Tourcoing, Villeneuve-d\'Ascq, Marcq-en-Barœul et toute la métropole européenne de Lille.',
    faq: [
      { q: 'Photographiez-vous les mariages dans le Vieux-Lille ?', a: 'Oui, très régulièrement : ses façades flamandes et ses pavés offrent un décor magnifique pour les séances couple, notamment en fin de journée.' },
      { q: 'Les frais de déplacement sont-ils inclus pour Lille ?', a: 'Oui — Lille se trouve dans mon rayon d\'intervention offert de 150 km autour de Valenciennes.' },
      { q: 'Proposez-vous une séance engagement à Lille ?', a: 'Absolument : la Citadelle, le Vieux-Lille ou les quais de la Deûle sont des lieux idéaux pour votre séance avant le mariage.' },
    ],
  },
  douai: {
    slug: 'photographe-mariage-douai',
    name: 'Douai',
    dept: 'Nord (59)',
    heroSlot: 'ville-douai-hero',
    intro: "À l'ombre du beffroi classé à l'UNESCO, je raconte les mariages douaisiens avec sincérité : des préparatifs à la dernière danse, chaque instant compte.",
    resume: "Samuel Bocquillon, photographe de mariage à Douai et dans le Douaisis. Reportages documentaires élégants, à partir de 1 990 €. Déplacement offert depuis Valenciennes.",
    venues: ['Le beffroi et l\'hôtel de ville de Douai', 'Le parc Charles-Bertin', 'Les rives de la Scarpe', 'Les domaines champêtres du Douaisis'],
    zone: 'Douai, Sin-le-Noble, Waziers, Lambres-lez-Douai, Cuincy et tout le Douaisis.',
    faq: [
      { q: 'Couvrez-vous les mariages civils à l\'hôtel de ville de Douai ?', a: 'Oui — la salle des mariages sous le beffroi est somptueuse. J\'y adapte ma pratique pour rester discret pendant la cérémonie.' },
      { q: 'Êtes-vous disponible pour un mariage en petit comité à Douai ?', a: 'Bien sûr : je propose des formules adaptées aux mariages intimes, dès quelques heures de présence.' },
      { q: 'Quels sont vos délais de livraison ?', a: 'Avant-premières sous 72h, galerie complète retouchée sous 4 à 6 semaines.' },
    ],
  },
  cambrai: {
    slug: 'photographe-mariage-cambrai',
    name: 'Cambrai',
    dept: 'Nord (59)',
    heroSlot: 'ville-cambrai-hero',
    intro: "Entre la citadelle, le jardin public et les abbayes du Cambrésis, votre mariage à Cambrai mérite des images à la hauteur de son décor. Je m'y déplace régulièrement depuis Valenciennes.",
    resume: "Samuel Bocquillon, photographe de mariage à Cambrai et dans le Cambrésis. Approche documentaire, images intemporelles, collections à partir de 1 990 €, déplacement offert.",
    venues: ['La citadelle de Cambrai', 'Le jardin public et son kiosque', "L'abbaye de Vaucelles", 'Les fermes et domaines du Cambrésis'],
    zone: 'Cambrai, Caudry, Le Cateau-Cambrésis, Solesmes et tout le Cambrésis.',
    faq: [
      { q: 'Photographiez-vous les mariages à l\'abbaye de Vaucelles ?', a: 'Oui — c\'est l\'un des plus beaux écrins du Cambrésis. Sa lumière en fin de journée est exceptionnelle pour les photos de couple.' },
      { q: 'Intervenez-vous aussi pour les petites cérémonies ?', a: 'Oui, mariages intimes et élopements sont les bienvenus — formules dès quelques heures de couverture.' },
      { q: 'Comment se passe le premier rendez-vous ?', a: 'Par téléphone, en visio ou autour d\'un café : vous me racontez votre projet, je vous présente mon approche et une offre personnalisée.' },
    ],
  },
};
