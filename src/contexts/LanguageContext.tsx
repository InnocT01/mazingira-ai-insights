import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fr";

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.opendata": { en: "Open Data", fr: "Données Ouvertes" },
  "nav.ai": { en: "AI Assistant", fr: "Assistant IA" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.contact": { en: "Contact", fr: "Contact" },
  "nav.signin": { en: "Sign In", fr: "Connexion" },
  "nav.signout": { en: "Sign Out", fr: "Déconnexion" },
  "nav.dashboard": { en: "My Dashboard", fr: "Mon Tableau de Bord" },

  // Hero
  "hero.badge": { en: "Environmental Intelligence for Africa", fr: "Intelligence Environnementale pour l'Afrique" },
  "hero.title1": { en: "Regenerating the Congolese land/fields through", fr: "Régénérer les terres/champs congolais grâce à" },
  "hero.title2": { en: "climate and soil data intelligence", fr: "l'intelligence des données climatiques et pédologiques" },
  "hero.subtitle": { en: "An AI-powered platform combining open-source environmental data with premium analytics for agriculture and climate resilience across the DRC.", fr: "Une plateforme IA combinant données environnementales open-source avec des analyses premium pour l'agriculture et la résilience climatique en RDC." },
  "hero.cta1": { en: "Explore Open Data", fr: "Explorer les données" },
  "hero.cta2": { en: "Ask Mazingira AI", fr: "Demander à Mazingira IA" },
  "hero.trust": { en: "Trusted by researchers, farmers & NGOs across DRC", fr: "Adopté par des chercheurs, agriculteurs et ONG à travers la RDC" },

  // Stats
  "stat.hectares": { en: "Hectares Monitored", fr: "Hectares Surveillés" },
  "stat.realtime": { en: "Real-Time Data", fr: "Données en Temps Réel" },
  "stat.sources": { en: "Data Sources", fr: "Sources de Données" },
  "stat.users": { en: "Users Empowered", fr: "Utilisateurs" },

  // Features
  "features.badge": { en: "Platform Capabilities", fr: "Capacités de la Plateforme" },
  "features.title": { en: "Environmental intelligence, reimagined", fr: "L'intelligence environnementale, réinventée" },
  "features.subtitle": { en: "From satellite data to AI-driven insights — everything you need to understand and protect Congolese farmland.", fr: "Des données satellites aux analyses IA — tout pour comprendre et protéger les terres agricoles congolaises." },

  // Partners
  "partners.title": { en: "Powered by world-class data sources", fr: "Alimenté par des sources de données de premier plan" },

  // Layers
  "layers.badge": { en: "Hybrid Platform", fr: "Plateforme Hybride" },
  "layers.title": { en: "Two layers, one mission", fr: "Deux couches, une mission" },
  "layers.open.title": { en: "🌐 Open Data Layer", fr: "🌐 Couche Données Ouvertes" },
  "layers.open.desc": { en: "Free, real-time environmental dashboard with NASA POWER & Copernicus satellite data, community contributions, and downloadable datasets.", fr: "Tableau de bord environnemental gratuit avec données NASA POWER & Copernicus, contributions communautaires et jeux de données téléchargeables." },
  "layers.premium.title": { en: "🔒 Farmer Intelligence", fr: "🔒 Intelligence Agriculteur" },
  "layers.premium.desc": { en: "Register your farms, scan your soil with AI, get crop recommendations and climate alerts personalized to your land.", fr: "Enregistrez vos terrains, scannez votre sol avec l'IA, obtenez des recommandations de cultures et alertes climat personnalisées." },

  // CTA
  "cta.title": { en: "Ready to regenerate Congolese land through data?", fr: "Prêt à régénérer les terres congolaises grâce aux données ?" },
  "cta.subtitle": { en: "Join farmers, researchers, and organizations using Mazingira Cloud for data-driven agriculture.", fr: "Rejoignez agriculteurs, chercheurs et organisations utilisant Mazingira Cloud pour une agriculture basée sur les données." },
  "cta.button": { en: "Get Started Free", fr: "Commencer Gratuitement" },
  "cta.contact": { en: "Contact Us", fr: "Contactez-Nous" },

  // Open Data page
  "opendata.title": { en: "Mazingira Open Data", fr: "Mazingira Données Ouvertes" },
  "opendata.subtitle": { en: "Regenerating the Congolese land/fields through climate and soil data intelligence. Access satellite data, community research, and real-time climate metrics.", fr: "Régénérer les terres congolaises grâce à l'intelligence des données climatiques et pédologiques. Accédez aux données satellites, recherches communautaires et métriques climat en temps réel." },
  "opendata.search_placeholder": { en: "Search datasets (NDVI, rainfall, soil moisture...)", fr: "Rechercher des jeux de données (NDVI, pluie, humidité sol...)" },
  "opendata.tab_satellite": { en: "Satellite Data", fr: "Données Satellites" },
  "opendata.tab_community": { en: "Community Research", fr: "Recherche Communautaire" },
  "opendata.tab_climate": { en: "Live Climate (NASA)", fr: "Climat en Direct (NASA)" },
  "opendata.contribute": { en: "Contribute Data", fr: "Contribuer des Données" },
  "opendata.community_title": { en: "Community Contributions", fr: "Contributions Communautaires" },
  "opendata.community_desc": { en: "Datasets shared by researchers, NGOs, and experts across the DRC.", fr: "Jeux de données partagés par chercheurs, ONG et experts à travers la RDC." },
  "opendata.no_community": { en: "No community contributions yet. Be the first to share!", fr: "Aucune contribution communautaire pour l'instant. Soyez le premier !" },
  "opendata.be_first": { en: "Start contributing", fr: "Commencer à contribuer" },
  "opendata.climate_title": { en: "Real-Time Climate Data — Goma Region", fr: "Données Climatiques en Temps Réel — Région de Goma" },
  "opendata.climate_desc": { en: "Live data from NASA POWER API for agricultural planning.", fr: "Données en direct de l'API NASA POWER pour la planification agricole." },
  "opendata.avg_temp": { en: "Avg. Temperature", fr: "Temp. Moyenne" },
  "opendata.total_precip": { en: "Total Precipitation", fr: "Précipitations Totales" },
  "opendata.avg_humidity": { en: "Avg. Humidity", fr: "Humidité Moyenne" },
  "opendata.data_points": { en: "Data Points", fr: "Points de Données" },
  "opendata.capabilities": { en: "Technical Capabilities", fr: "Capacités Techniques" },
  "opendata.capabilities_title": { en: "Enterprise-Grade Open Data Platform", fr: "Plateforme Open Data de Niveau Entreprise" },
  "opendata.capabilities_desc": { en: "Built for researchers, NGOs, governments, and farmers. Every feature designed for Congolese agricultural intelligence.", fr: "Conçue pour chercheurs, ONG, gouvernements et agriculteurs. Chaque fonctionnalité adaptée à l'intelligence agricole congolaise." },
  "opendata.community_data": { en: "Community Data", fr: "Données Communautaires" },
  "opendata.share_title": { en: "Share Your Research with the Community", fr: "Partagez Vos Recherches avec la Communauté" },
  "opendata.share_desc": { en: "Inspired by the Ushahidi model — researchers, climate organizations, agricultural cooperatives, and experts can contribute datasets to benefit everyone.", fr: "Inspiré du modèle Ushahidi — chercheurs, organisations climatiques, coopératives agricoles et experts peuvent contribuer des données au bénéfice de tous." },
  "opendata.share_1": { en: "Submit field measurements & surveys", fr: "Soumettre mesures terrain et enquêtes" },
  "opendata.share_2": { en: "Upload satellite analysis results", fr: "Télécharger résultats d'analyse satellite" },
  "opendata.share_3": { en: "Share crop yield data", fr: "Partager données de rendement" },
  "opendata.share_4": { en: "Contribute soil test reports", fr: "Contribuer rapports d'analyses de sol" },
  "opendata.share_5": { en: "Peer review & validation", fr: "Revue par les pairs et validation" },
  "opendata.share_6": { en: "Attribution & citation credits", fr: "Attribution et crédits de citation" },
  "opendata.start_contributing": { en: "Start Contributing", fr: "Commencer à Contribuer" },

  // Farmer dashboard
  "farmer.badge": { en: "Farmer Dashboard", fr: "Tableau de Bord Agriculteur" },
  "farmer.title": { en: "My Farm Dashboard", fr: "Mon Tableau de Bord Agricole" },
  "farmer.subtitle": { en: "Manage your farms, scan your soil, and get AI-powered recommendations", fr: "Gérez vos terrains, scannez votre sol et obtenez des recommandations IA" },
  "farmer.tab_farms": { en: "My Farms", fr: "Mes Terrains" },
  "farmer.tab_scans": { en: "Soil Analysis", fr: "Analyses de Sol" },
  "farmer.tab_map": { en: "Map View", fr: "Vue Carte" },
  "farmer.my_farms": { en: "My Farms", fr: "Mes Terrains" },
  "farmer.add_farm": { en: "Add Farm", fr: "Ajouter un Terrain" },
  "farmer.farm_name": { en: "Farm Name", fr: "Nom du Terrain" },
  "farmer.location": { en: "Location", fr: "Localisation" },
  "farmer.area": { en: "Area (hectares)", fr: "Superficie (hectares)" },
  "farmer.crop_type": { en: "Crop Type", fr: "Type de Culture" },
  "farmer.save": { en: "Save", fr: "Enregistrer" },
  "farmer.cancel": { en: "Cancel", fr: "Annuler" },
  "farmer.no_farms": { en: "No farms registered yet. Add your first farm!", fr: "Aucun terrain enregistré. Ajoutez votre premier terrain !" },
  "farmer.soil_analysis": { en: "Soil Analysis", fr: "Analyse de Sol" },
  "farmer.new_scan": { en: "New Scan", fr: "Nouvelle Analyse" },
  "farmer.scan_desc": { en: "Describe your soil and get an AI-powered analysis with crop recommendations.", fr: "Décrivez votre sol et obtenez une analyse IA avec des recommandations de cultures." },
  "farmer.select_farm": { en: "Select Farm", fr: "Sélectionner un Terrain" },
  "farmer.optional": { en: "Optional", fr: "Optionnel" },
  "farmer.scan_type": { en: "Scan Type", fr: "Type d'Analyse" },
  "farmer.quick_scan": { en: "Quick Scan", fr: "Analyse Rapide" },
  "farmer.detailed_scan": { en: "Detailed Scan", fr: "Analyse Détaillée" },
  "farmer.soil_desc": { en: "Soil Description", fr: "Description du Sol" },
  "farmer.soil_desc_placeholder": { en: "Describe the color, texture, moisture, vegetation around...", fr: "Décrivez la couleur, texture, humidité, végétation autour..." },
  "farmer.analyzing": { en: "Analyzing...", fr: "Analyse en cours..." },
  "farmer.run_analysis": { en: "Run AI Analysis", fr: "Lancer l'Analyse IA" },
  "farmer.no_scans": { en: "No soil analyses yet. Run your first scan!", fr: "Aucune analyse de sol. Lancez votre première analyse !" },

  // Researcher dashboard
  "researcher.badge": { en: "Researcher Dashboard", fr: "Tableau de Bord Chercheur" },
  "researcher.title": { en: "Data Contribution Hub", fr: "Hub de Contribution de Données" },
  "researcher.subtitle": { en: "Manage your data contributions and track their status", fr: "Gérez vos contributions de données et suivez leur statut" },
  "researcher.total": { en: "Total Contributions", fr: "Total Contributions" },
  "researcher.approved": { en: "Approved", fr: "Approuvées" },
  "researcher.pending": { en: "Pending Review", fr: "En Attente" },
  "researcher.downloads": { en: "Total Downloads", fr: "Total Téléchargements" },
  "researcher.my_contributions": { en: "My Contributions", fr: "Mes Contributions" },
  "researcher.new_contribution": { en: "New Contribution", fr: "Nouvelle Contribution" },
  "researcher.form_title": { en: "Submit a New Dataset", fr: "Soumettre un Nouveau Jeu de Données" },
  "researcher.form_desc": { en: "Share your research data with the Mazingira community. All submissions go through peer review.", fr: "Partagez vos données de recherche avec la communauté Mazingira. Toutes les soumissions passent par une revue par les pairs." },
  "researcher.dataset_title": { en: "Dataset Title", fr: "Titre du Jeu de Données" },
  "researcher.dataset_desc": { en: "Description", fr: "Description" },
  "researcher.data_type": { en: "Data Type", fr: "Type de Données" },
  "researcher.region": { en: "Region", fr: "Région" },
  "researcher.select_region": { en: "Select Region", fr: "Sélectionner la Région" },
  "researcher.format": { en: "Format", fr: "Format" },
  "researcher.file_url": { en: "File URL (or upload link)", fr: "URL du Fichier (ou lien d'upload)" },
  "researcher.metadata": { en: "Research Methodology (Optional)", fr: "Méthodologie de Recherche (Optionnel)" },
  "researcher.methodology": { en: "Methodology", fr: "Méthodologie" },
  "researcher.sample_size": { en: "Sample Size", fr: "Taille de l'Échantillon" },
  "researcher.collection_period": { en: "Collection Period", fr: "Période de Collecte" },
  "researcher.instruments": { en: "Instruments Used", fr: "Instruments Utilisés" },
  "researcher.submit": { en: "Submit for Review", fr: "Soumettre pour Revue" },
  "researcher.submitted": { en: "Contribution submitted for review!", fr: "Contribution soumise pour revue !" },
  "researcher.no_contributions": { en: "No contributions yet. Share your first dataset!", fr: "Aucune contribution. Partagez votre premier jeu de données !" },

  // Auth
  "auth.signin": { en: "Sign In", fr: "Connexion" },
  "auth.signup": { en: "Create Account", fr: "Créer un Compte" },
  "auth.email": { en: "Email", fr: "Email" },
  "auth.password": { en: "Password", fr: "Mot de passe" },
  "auth.fullname": { en: "Full Name", fr: "Nom Complet" },
  "auth.role": { en: "I am a...", fr: "Je suis..." },
  "auth.role_farmer": { en: "Farmer / Planter", fr: "Agriculteur / Planteur" },
  "auth.role_farmer_desc": { en: "Register farms, scan soil, get recommendations", fr: "Enregistrer terrains, scanner sol, obtenir recommandations" },
  "auth.role_researcher": { en: "Researcher / Expert", fr: "Chercheur / Expert" },
  "auth.role_researcher_desc": { en: "Contribute data, share research with the community", fr: "Contribuer données, partager recherches avec la communauté" },
  "auth.noaccount": { en: "Don't have an account?", fr: "Pas de compte ?" },
  "auth.hasaccount": { en: "Already have an account?", fr: "Déjà un compte ?" },
  "auth.signin_desc": { en: "Access your dashboard", fr: "Accédez à votre tableau de bord" },
  "auth.signup_desc": { en: "Join Mazingira Cloud", fr: "Rejoignez Mazingira Cloud" },
  "auth.account_created": { en: "Account created! Welcome to Mazingira Cloud.", fr: "Compte créé ! Bienvenue sur Mazingira Cloud." },

  // Footer
  "footer.desc": { en: "Regenerating the Congolese land through climate and soil data intelligence. An AI-powered environmental platform for agriculture across Africa.", fr: "Régénérer les terres congolaises grâce à l'intelligence des données climatiques et pédologiques. Une plateforme environnementale IA pour l'agriculture en Afrique." },
  "footer.platform": { en: "Platform", fr: "Plateforme" },
  "footer.contact": { en: "Contact", fr: "Contact" },
  "footer.followus": { en: "Follow Us", fr: "Suivez-nous" },

  // AI
  "ai.title": { en: "Ask Mazingira AI", fr: "Demandez à Mazingira IA" },
  "ai.subtitle": { en: "Your AI-powered environmental intelligence assistant for Congolese agriculture.", fr: "Votre assistant IA d'intelligence environnementale pour l'agriculture congolaise." },
  "ai.placeholder": { en: "Ask about your land, crops, climate...", fr: "Posez vos questions sur vos terres, cultures, climat..." },

  // Premium (legacy)
  "premium.title": { en: "Premium Dashboard", fr: "Tableau de Bord Premium" },
  "premium.subtitle": { en: "AI-powered analytics for your land", fr: "Analyses IA pour vos terres" },

  // Dashboard (legacy)
  "dashboard.badge": { en: "Open Data", fr: "Données Ouvertes" },
  "dashboard.title": { en: "Mazingira Open Data", fr: "Mazingira Données Ouvertes" },
  "dashboard.subtitle": { en: "Regenerating the Congolese land/fields through climate and soil data intelligence.", fr: "Régénérer les terres congolaises grâce à l'intelligence des données climatiques et pédologiques." },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
