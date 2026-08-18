{
  "project": {
    "name": "Samuel Bocquillon — Photographe de mariage",
    "language": "fr-FR",
    "app_type": "marketing_site_portfolio",
    "brand_attributes": ["authentique","discret","élégant","chaleureux","éditorial","intemporel","vivant"],
    "north_star": "Une expérience type magazine de luxe: la photo est la star, l'UI encadre sans rivaliser."
  },
  "hard_requirements_from_client_charter": {
    "priority": "ABSOLUE — doit être pratiquement identique aux maquettes",
    "colors": {
      "primary_cuir": "#5A3A2E",
      "secondary_cognac": "#8A5A44",
      "background_ivoire": "#EFECE8",
      "surface_blanc": "#FFFFFF",
      "text_charbon": "#1A1A1A",
      "muted_pierre": "#B9B4AE",
      "distribution_rule": "60% ivoire/blanc, 25% charbon, 10% brun cuir, 5% cognac/gris",
      "rule": "Les couleurs de marque ne doivent JAMAIS concurrencer les photographies — elles les cadrent."
    },
    "typography": {
      "title_font": "Cormorant Garamond",
      "body_font": "Manrope",
      "weights_max": 3,
      "alignment": "left",
      "no_justified_paragraphs": true,
      "spaced_caps_only_for": ["catégories", "menus", "micro-textes"],
      "scale": {
        "h1": "64–96px, leading 0.95, Regular/Medium",
        "h2": "40–56px, Regular",
        "quote": "Italic 32–48px",
        "h3": "18–24px, Medium",
        "labels_menus": "11–14px, SemiBold, letter-spacing +100 à +180",
        "paragraph": "16–19px, Regular, leading 1.5–1.7"
      }
    },
    "logo": {
      "composition": ["Monogramme SB entrelacé","Samuel Bocquillon (serif)","PHOTOGRAPHE DE MARIAGE (spaced caps)"],
      "variants": {"light": "brun cuir #5A3A2E sur ivoire","dark": "blanc sur charbon"},
      "implementation": "SVG ou texte stylé (recommandé: SVG pour le monogramme + texte pour le reste)."
    }
  },
  "design_personality": {
    "visual_metaphor": "Magazine de luxe / carnet en cuir / lumière dorée de fin de journée",
    "layout_principles": [
      "Grands visuels pleine largeur",
      "Typo serif très présente mais jamais criarde",
      "Beaucoup d'air (rythme éditorial)",
      "Lignes fines (pierre/cognac) pour structurer",
      "Bords nets (radius faible) pour un rendu 'print'"
    ],
    "do_not": [
      "Ne pas centrer les blocs de texte globalement",
      "Ne pas utiliser de gradients saturés",
      "Ne pas surcharger en badges/couleurs",
      "Ne pas arrondir excessivement les images"
    ]
  },
  "typography_system": {
    "font_loading_nextjs": {
      "instruction": "Utiliser next/font/google dans app/layout.js et exposer via CSS variables déjà prévues dans tailwind.config.js.",
      "code_scaffold_js": "import { Cormorant_Garamond, Manrope } from 'next/font/google'; const cormorant = Cormorant_Garamond({ subsets:['latin'], weight:['400','500'], style:['normal','italic'], variable:'--font-cormorant', display:'swap' }); const manrope = Manrope({ subsets:['latin'], weight:['400','500','600'], variable:'--font-manrope', display:'swap' }); // puis <html className={`${cormorant.variable} ${manrope.variable}`}>"
    },
    "tailwind_usage": {"headings": "font-serif","body": "font-sans"},
    "type_styles": {
      "h1": "font-serif font-medium text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-[-0.02em]",
      "h2": "font-serif font-normal text-3xl sm:text-4xl lg:text-5xl leading-[1.05] tracking-[-0.01em]",
      "h3": "font-sans font-medium text-lg sm:text-xl leading-[1.25]",
      "body": "font-sans font-normal text-[15px] sm:text-[16px] lg:text-[18px] leading-[1.65]",
      "label_caps": "font-sans font-semibold text-[11px] sm:text-[12px] tracking-[0.18em] uppercase",
      "quote": "font-serif italic text-2xl sm:text-3xl lg:text-4xl leading-[1.15]"
    },
    "selection_and_links": {
      "text_selection": "::selection { background: rgba(138,90,68,0.25); color: #1A1A1A; }",
      "link_style": "underline underline-offset-4 decoration-pierre hover:decoration-cognac"
    }
  },
  "color_system": {
    "tokens_css_custom_properties": {
      "instruction": "Définir des tokens CSS dans app/globals.css (ou :root) pour éviter les valeurs en dur dans les composants.",
      "css": ":root{ --sb-ivoire:#EFECE8; --sb-blanc:#FFFFFF; --sb-charbon:#1A1A1A; --sb-cuir:#5A3A2E; --sb-cognac:#8A5A44; --sb-pierre:#B9B4AE; --sb-border: rgba(26,26,26,0.14); --sb-border-soft: rgba(26,26,26,0.10); --sb-shadow: 0 18px 40px rgba(26,26,26,0.10); --sb-shadow-soft: 0 10px 24px rgba(26,26,26,0.08); --sb-radius-card: 12px; --sb-radius-button: 10px; --sb-radius-input: 10px; --sb-focus: rgba(138,90,68,0.45); } body{ background: var(--sb-ivoire); color: var(--sb-charbon); }"
    },
    "semantic_roles": {
      "bg": "ivoire","surface": "blanc","text": "charbon","muted_text": "pierre",
      "brand_primary": "cuir","brand_secondary": "cognac","borders": "charbon @ 10–14% opacity"
    },
    "gradient_policy": {
      "allowed": "Uniquement overlays de lisibilité sur hero photos (charbon -> transparent) et accents décoratifs très légers.",
      "hero_overlay_example": "bg-gradient-to-t from-charbon/70 via-charbon/25 to-transparent",
      "restriction": "Respecter la règle 20% viewport max et jamais sur zones de lecture."
    }
  },
  "layout_grid_and_spacing": {
    "container": {
      "max_width": "max-w-[1180px]",
      "padding": "px-5 sm:px-8 lg:px-10",
      "section_spacing": "py-14 sm:py-18 lg:py-24",
      "editorial_rhythm": "Alterner sections 'full-bleed photo' et sections 'contenu sur ivoire' avec séparateurs fins."
    },
    "columns": {
      "two_col_about": "grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14",
      "left_text_right_media": "lg:col-span-5 / lg:col-span-7",
      "forms": "grid grid-cols-1 md:grid-cols-2 gap-4"
    },
    "image_treatment": {
      "radius": "rounded-none (images) ou rounded-[6px] max si maquette le demande",
      "frame": "border border-charbon/10",
      "caption": "text-pierre text-xs tracking-[0.14em] uppercase"
    }
  },
  "components_and_paths": {
    "primary_library": "shadcn/ui (JSX) — utiliser les composants existants",
    "component_path_note": "Composants shadcn disponibles dans /app/frontend/src_cra_backup/components/ui/*.jsx — à migrer vers /app/frontend/components/ui pour Next.js",
    "component_styling_overrides": {
      "buttons": {
        "primary": "bg-cuir text-ivoire hover:bg-cuir/90 focus-visible:ring-[var(--sb-focus)] rounded-[var(--sb-radius-button)]",
        "secondary_outline": "border border-cuir text-cuir bg-transparent hover:bg-cuir/5 rounded-[var(--sb-radius-button)]",
        "ghost": "text-charbon hover:bg-charbon/5",
        "cta_mobile_fixed": "fixed bottom-4 left-4 right-4 z-40"
      },
      "cards_pricing": {
        "base": "bg-white border border-charbon/10 shadow-[var(--sb-shadow-soft)] rounded-[var(--sb-radius-card)]",
        "premium_variant": "bg-cuir text-ivoire border-cuir shadow-[var(--sb-shadow)]",
        "title": "font-serif text-2xl leading-[1.05]",
        "price": "font-sans text-sm tracking-[0.18em] uppercase text-pierre",
        "list": "mt-5 space-y-2 text-[15px] leading-[1.6]"
      },
      "tabs_filters_portfolio": {
        "list": "bg-transparent p-0 h-auto gap-2 flex flex-wrap",
        "trigger": "rounded-full border border-charbon/15 px-4 py-2 text-[12px] tracking-[0.18em] uppercase data-[state=active]:bg-charbon data-[state=active]:text-ivoire data-[state=active]:border-charbon"
      },
      "accordion_faq": {
        "item": "border-b border-charbon/10",
        "trigger": "font-sans text-[13px] sm:text-[14px] tracking-[0.12em] uppercase hover:no-underline",
        "content": "text-[15px] leading-[1.7] text-charbon/85"
      }
    }
  },
  "page_blueprints_to_match_mockups": {
    "global_header": {
      "behavior": [
        "Sticky header (top-0) avec fond ivoire semi-opaque + blur léger",
        "Dropdown Prestations (NavigationMenu) + état actif",
        "Mobile: hamburger ouvre Sheet",
        "Mobile: CTA fixe en bas (PRENDRE RENDEZ-VOUS)"
      ],
      "classes": "sticky top-0 z-50 bg-ivoire/85 backdrop-blur-md border-b border-charbon/10",
      "data_testids": {
        "header": "site-header","nav": "site-nav","prestations-menu": "nav-prestations-menu",
        "mobile-menu-button": "mobile-menu-open-button","mobile-bottom-cta": "mobile-bottom-cta-button"
      }
    },
    "accueil": {
      "sections": [
        {"name": "Hero full-bleed","must_include": ["Photo pleine largeur","Overlay titre: 'Des histoires vraies. Sans filtre.'","Label: 'PHOTOGRAPHE DE MARIAGE — POUR LES MOMENTS QUI VIVENT À FOND.'","CTA: 'DÉCOUVRIR MON TRAVAIL'"],
         "hero_overlay": "absolute inset-0 bg-gradient-to-t from-charbon/70 via-charbon/25 to-transparent",
         "text_classes": {"label": "text-ivoire/90 font-sans font-semibold text-[11px] sm:text-[12px] tracking-[0.18em] uppercase","headline": "text-ivoire font-serif font-medium text-4xl sm:text-5xl lg:text-6xl leading-[0.95]","cta": "mt-8"},
         "data_testids": {"hero": "home-hero","hero-cta": "home-hero-discover-work-button"}},
        {"name": "À propos (portrait + texte + signature)","layout": "2 colonnes desktop","data_testids": {"about": "home-about-section","about-cta": "home-about-read-more-link"}},
        {"name": "Portfolio preview (3 images + lien)","layout": "grid 1→3","data_testids": {"portfolio-preview": "home-portfolio-preview","portfolio-link": "home-portfolio-link"}},
        {"name": "Prestations (3 cartes)","cards": ["COLLECTION ESSENTIELLE","COLLECTION COMPLÈTE","COLLECTION PREMIUM"],"data_testids": {"pricing": "home-pricing-section","pricing-card-essentielle": "pricing-card-essentielle","pricing-card-complete": "pricing-card-complete","pricing-card-premium": "pricing-card-premium"}},
        {"name": "Témoignage (quote grande)","quote": "Il ne regarde pas ses photos. On les ressent.","author": "CLARA & JULIEN","data_testids": {"testimonial-feature": "home-testimonial-feature"}},
        {"name": "CTA pleine largeur sur photo","copy": "Parlons de votre mariage.","cta": "PRENDRE RENDEZ-VOUS","data_testids": {"cta-photo": "home-photo-cta","cta-photo-button": "home-photo-cta-button"}},
        {"name": "Contact form section","data_testids": {"contact-form": "home-contact-form","contact-submit": "home-contact-submit-button"}},
        {"name": "Footer charcoal","data_testids": {"footer": "site-footer","footer-social": "footer-social-links"}}
      ]
    },
    "a_propos": {"must_have": ["Hero","Intro","MON APPROCHE","MES VALEURS (3 items + icônes)","MON PARCOURS timeline 2012→2024","Témoignage","CTA 'RÉSERVER UNE DATE'"]},
    "portfolio": {
      "must_have": ["Hero","Tabs filtres (Tabs shadcn)","Masonry/grid gallery","Bloc 'REPORTAGE À LA UNE'","Témoignages","CTA"],
      "masonry_implementation_hint": "Utiliser CSS columns (mobile 1, md 2, lg 3) + break-inside-avoid pour les items.",
      "data_testids": {"filters": "portfolio-filter-tabs","gallery": "portfolio-gallery"}
    },
    "prestations_hub": {
      "must_have": ["Hero","3 collection cards + feature lists + prix","CE QUI EST INCLUS (4 icônes)","DÉROULÉ (4 étapes numérotées)","OPTIONS & EXTRAS (liste de prix)","Témoignage","FAQ accordion","CTA"],
      "data_testids": {"faq": "prestations-faq","cta": "prestations-cta"}
    },
    "prestations_subpages": {
      "pages": ["mariage","corporate","photobooth","formation"],
      "pattern": "hero + approche + pricing/formules + process steps + témoignage + CTA",
      "subnav": "Ajouter une sous-navigation entre les 4 pages (desktop horizontal, mobile scrollable).",
      "data_testids": {"subnav": "prestations-subnav"}
    },
    "contact": {
      "must_have": ["Hero 'Contact — Parlons de votre mariage.'","2 colonnes: formulaire + blocs info 'Réponse sous 24h garantie'","Google Maps embed + itinéraire","Accordion 'Informations utiles'","CTA"],
      "form_fields": ["nom","email","téléphone","date mariage","lieu mariage","message"],
      "data_testids": {"contact-form": "contact-form","maps": "contact-google-maps-embed"}
    },
    "admin_zone": {
      "style": "fonctionnel, propre, sans l'éditorial lourd",
      "components": ["Card","Tabs","Table","Dialog","Input","Button"],
      "data_testids": {"admin-login": "admin-login-form","admin-images": "admin-image-manager","admin-inbox": "admin-inbox","admin-settings": "admin-settings"}
    }
  },
  "motion_and_microinteractions": {
    "principles": [
      "Subtil, lent, 'cinématique'",
      "Transitions uniquement sur couleurs/opacity/shadow (pas de transition: all)",
      "Hover: légère montée (translate-y-[-2px]) uniquement sur cartes/CTA",
      "Focus visible net (ring cognac)"
    ],
    "recommended_library": {"name": "framer-motion","usage_hint": "Animer l'apparition des sections (opacity 0→1, y 8→0) avec viewport once."}
  },
  "accessibility_and_seo": {
    "seo": ["SSR, HTML sémantique","1 seul H1 par page","Alt text descriptifs (FR)","Images avec srcset, sizes, lazy","Core Web Vitals: éviter animations lourdes sur hero"],
    "a11y": ["Cibles tactiles >= 44px","Focus visible sur tous les éléments interactifs","Respect prefers-reduced-motion","Contraste AA (charbon sur ivoire OK; ivoire sur cuir OK)"],
    "testing": {"rule": "Tous les éléments interactifs et infos clés DOIVENT avoir data-testid (kebab-case)."}
  },
  "image_urls": {
    "placeholders_only": {
      "note": "Ces URLs servent uniquement de placeholders en dev. En prod, les images seront remplacées via l'admin.",
      "hero_home": [{"url": "https://images.unsplash.com/photo-1646380911979-615ba6cc9826?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85","description": "Couple au coucher du soleil — hero Accueil (golden hour)"}],
      "portfolio_grid": [
        {"url": "https://images.unsplash.com/photo-1521033719794-41049d18b8d4?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85","description": "Silhouette sunset — item galerie"},
        {"url": "https://images.pexels.com/photos/4138802/pexels-photo-4138802.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940","description": "Couple golden hour — item galerie"}
      ],
      "details_flatlay": [{"url": "https://images.pexels.com/photos/29632054/pexels-photo-29632054.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940","description": "Invitation luxe — section détails / prestations"}],
      "about_portrait": [{"url": "https://images.unsplash.com/photo-1563175076-bf4785155115?crop=entropy&cs=srgb&fm=jpg&ixlib=rb-4.1.0&q=85","description": "Portrait studio masculin — section À propos"}]
    }
  },
  "instructions_to_main_agent": [
    "Les maquettes client priment: reproduire la structure page par page telle que décrite.",
    "Ne pas inventer de nouveaux styles: appliquer strictement la palette et la typo fournies.",
    "Implémenter un système de tokens (CSS variables) et utiliser les couleurs Tailwind déjà étendues (cuir/cognac/ivoire/charbon/pierre).",
    "Utiliser shadcn/ui (JSX) pour: Button, Card, Tabs (filtres), Accordion (FAQ), NavigationMenu (dropdown Prestations), Sheet (menu mobile), Input/Textarea (form).",
    "Ajouter data-testid sur: header/nav, CTA, tabs, cards, formulaires, accordions, liens sociaux, éléments admin.",
    "Hero photos: toujours overlay charbon->transparent pour lisibilité du texte blanc; pas de gradients décoratifs ailleurs.",
    "Masonry portfolio: privilégier CSS columns + break-inside-avoid pour performance.",
    "Admin: UI simple et fonctionnelle (pas besoin du style éditorial), mais garder la cohérence typographique et les couleurs de base."
  ]
}
