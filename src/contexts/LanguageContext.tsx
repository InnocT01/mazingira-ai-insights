import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fr";

const translations: Record<string, Record<Lang, string>> = {
  // Search
  "search.placeholder": { en: "Search a location...", fr: "Rechercher un emplacement..." },

  // Sidebar nav
  "nav.data": { en: "Data", fr: "Données" },
  "nav.current": { en: "Current", fr: "Actuel" },
  "nav.opendata": { en: "Open Data", fr: "Données Ouvertes" },
  "nav.maps": { en: "Maps", fr: "Cartes" },
  "nav.trends": { en: "Trends", fr: "Tendances" },
  "nav.ai": { en: "AI Assistant", fr: "Assistant IA" },
  "nav.media": { en: "Mazingira Media", fr: "Mazingira Média" },
  "nav.account": { en: "Account", fr: "Compte" },
  "nav.farmer_dashboard": { en: "Farmer Dashboard", fr: "Tableau Agriculteur" },
  "nav.researcher_dashboard": { en: "Researcher Hub", fr: "Hub Chercheur" },
  "nav.more": { en: "More", fr: "Plus" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.contact": { en: "Contact", fr: "Contact" },
  "nav.signin": { en: "Sign In", fr: "Connexion" },
  "nav.signout": { en: "Sign Out", fr: "Déconnexion" },

  // Home (current conditions)
  "home.tagline": { en: "Regenerating Congolese land through climate & soil data intelligence", fr: "Régénérer les terres congolaises grâce à l'intelligence des données climatiques et pédologiques" },
  "home.partly_sunny": { en: "Mostly Sunny", fr: "Globalement ensoleillé" },
  "home.feels_like": { en: "Feels like", fr: "Ressenti" },
  "home.weather_desc": { en: "Skies will be mostly sunny. Weather will be humid with a high of 25°C. Good conditions for fieldwork.", fr: "Le ciel sera principalement ensoleillé. Le temps sera humide avec un maximum de 25°C. Bonnes conditions pour le travail de terrain." },
  "home.wind": { en: "Wind", fr: "Vent" },
  "home.humidity": { en: "Humidity", fr: "Humidité" },
  "home.visibility": { en: "Visibility", fr: "Visibilité" },
  "home.pressure": { en: "Pressure", fr: "Pression" },
  "home.agri_conditions": { en: "Agricultural Conditions", fr: "Conditions Agricoles" },
  "home.soil_moisture": { en: "Soil Moisture", fr: "Humidité du Sol" },
  "home.precip_7d": { en: "Precipitation (7d)", fr: "Précipitations (7j)" },
  "home.agri_tip": { en: "🌱 Good planting conditions for cassava and maize in this region", fr: "🌱 Bonnes conditions de plantation pour le manioc et le maïs dans cette région" },
  "home.forecast_7d": { en: "7-Day Forecast", fr: "Prévisions sur 7 jours" },
  "home.hourly": { en: "Hourly Overview", fr: "Vue horaire" },
  "home.uv_index": { en: "UV Index", fr: "Indice UV" },
  "home.uv_high": { en: "High", fr: "Élevé" },
  "home.sunrise": { en: "Sunrise / Sunset", fr: "Lever / Coucher" },
  "home.air_quality": { en: "Air Quality", fr: "Qualité de l'Air" },
  "home.air_good": { en: "Good", fr: "Bonne" },

  // Days
  "day.mon": { en: "Mon", fr: "Lun" },
  "day.tue": { en: "Tue", fr: "Mar" },
  "day.wed": { en: "Wed", fr: "Mer" },
  "day.thu": { en: "Thu", fr: "Jeu" },
  "day.fri": { en: "Fri", fr: "Ven" },
  "day.sat": { en: "Sat", fr: "Sam" },
  "day.sun": { en: "Sun", fr: "Dim" },

  // Open Data
  "opendata.title": { en: "Mazingira Open Data", fr: "Mazingira Données Ouvertes" },
  "opendata.subtitle": { en: "Access satellite data and community research for Congolese agriculture.", fr: "Accédez aux données satellites et recherches communautaires pour l'agriculture congolaise." },
  "opendata.tab_satellite": { en: "Satellite Data", fr: "Données Satellites" },
  "opendata.tab_community": { en: "Community Research", fr: "Recherche Communautaire" },
  "opendata.no_community": { en: "No community contributions yet.", fr: "Aucune contribution communautaire pour l'instant." },

  // Maps
  "maps.title": { en: "Interactive Maps", fr: "Cartes Interactives" },
  "maps.subtitle": { en: "Explore environmental data across the DRC", fr: "Explorez les données environnementales à travers la RDC" },

  // Trends
  "trends.title": { en: "Climate & Agriculture Trends", fr: "Tendances Climat & Agriculture" },
  "trends.subtitle": { en: "Monthly and annual analysis for the Goma region", fr: "Analyse mensuelle et annuelle pour la région de Goma" },
  "trends.avg_temp": { en: "Avg. Temperature", fr: "Temp. Moyenne" },
  "trends.stable": { en: "Stable", fr: "Stable" },
  "trends.annual_rain": { en: "Annual Rainfall", fr: "Pluviométrie Annuelle" },
  "trends.avg_ndvi": { en: "Avg. NDVI", fr: "NDVI Moyen" },
  "trends.monthly_rain": { en: "Monthly Precipitation (mm)", fr: "Précipitations Mensuelles (mm)" },
  "trends.monthly_ndvi": { en: "Monthly NDVI", fr: "NDVI Mensuel" },

  // AI
  "ai.title": { en: "Mazingira AI", fr: "Mazingira IA" },
  "ai.subtitle": { en: "Your AI assistant for Congolese agriculture and climate.", fr: "Votre assistant IA pour l'agriculture et le climat congolais." },
  "ai.placeholder": { en: "Ask about your land, crops, climate...", fr: "Posez vos questions sur vos terres, cultures, climat..." },

  // Media
  "media.title": { en: "Mazingira Media", fr: "Mazingira Média" },
  "media.subtitle": { en: "Articles and insights on climate and agriculture in the DRC.", fr: "Articles et analyses sur le climat et l'agriculture en RDC." },

  // About
  "about.title": { en: "About Mazingira Cloud", fr: "À propos de Mazingira Cloud" },
  "about.desc": { en: "Building environmental intelligence for Congolese agriculture.", fr: "Construire l'intelligence environnementale pour l'agriculture congolaise." },
  "about.mission": { en: "Mazingira Cloud combines open-source satellite data with AI-powered analytics to democratize access to environmental intelligence. Based in North Kivu, DRC, we empower farmers, researchers, and organizations with data-driven insights for climate-resilient agriculture.", fr: "Mazingira Cloud combine des données satellites open-source avec des analyses IA pour démocratiser l'accès à l'intelligence environnementale. Basé au Nord-Kivu, RDC, nous donnons aux agriculteurs, chercheurs et organisations les moyens d'une agriculture résiliente basée sur les données." },
  "about.v1": { en: "Built in Africa, for Africa, with global relevance.", fr: "Construit en Afrique, pour l'Afrique, avec une pertinence mondiale." },
  "about.v2": { en: "Environmental data accessible to everyone.", fr: "Données environnementales accessibles à tous." },
  "about.v3": { en: "Every insight backed by satellite data and research.", fr: "Chaque analyse soutenue par des données satellites et la recherche." },
  "about.v4": { en: "Success measured by communities empowered.", fr: "Succès mesuré par les communautés autonomisées." },

  // Contact
  "contact.title": { en: "Contact Us", fr: "Contactez-nous" },
  "contact.desc": { en: "Have questions about Mazingira Cloud?", fr: "Des questions sur Mazingira Cloud ?" },
  "contact.name": { en: "Name", fr: "Nom" },
  "contact.send": { en: "Send Message", fr: "Envoyer" },
  "contact.sent": { en: "Message sent!", fr: "Message envoyé !" },

  // Auth
  "auth.signin": { en: "Sign In", fr: "Connexion" },
  "auth.signup": { en: "Create Account", fr: "Créer un Compte" },
  "auth.email": { en: "Email", fr: "Email" },
  "auth.password": { en: "Password", fr: "Mot de passe" },
  "auth.fullname": { en: "Full Name", fr: "Nom Complet" },
  "auth.role": { en: "I am a...", fr: "Je suis..." },
  "auth.role_farmer": { en: "Farmer / Planter", fr: "Agriculteur / Planteur" },
  "auth.role_researcher": { en: "Researcher / Expert", fr: "Chercheur / Expert" },
  "auth.noaccount": { en: "Don't have an account?", fr: "Pas de compte ?" },
  "auth.hasaccount": { en: "Already have an account?", fr: "Déjà un compte ?" },
  "auth.signin_desc": { en: "Access your dashboard", fr: "Accédez à votre tableau de bord" },
  "auth.signup_desc": { en: "Join Mazingira Cloud", fr: "Rejoignez Mazingira Cloud" },
  "auth.account_created": { en: "Account created! Welcome.", fr: "Compte créé ! Bienvenue." },

  // Farmer dashboard
  "farmer.badge": { en: "Farmer Dashboard", fr: "Tableau de Bord Agriculteur" },
  "farmer.title": { en: "My Farm Dashboard", fr: "Mon Tableau de Bord Agricole" },
  "farmer.subtitle": { en: "Manage your farms, scan your soil, get recommendations", fr: "Gérez vos terrains, scannez votre sol, obtenez des recommandations" },
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
  "farmer.no_farms": { en: "No farms registered yet.", fr: "Aucun terrain enregistré." },
  "farmer.soil_analysis": { en: "Soil Analysis", fr: "Analyse de Sol" },
  "farmer.new_scan": { en: "New Scan", fr: "Nouvelle Analyse" },
  "farmer.scan_desc": { en: "Describe your soil for AI analysis.", fr: "Décrivez votre sol pour une analyse IA." },
  "farmer.select_farm": { en: "Select Farm", fr: "Sélectionner Terrain" },
  "farmer.optional": { en: "Optional", fr: "Optionnel" },
  "farmer.scan_type": { en: "Scan Type", fr: "Type d'Analyse" },
  "farmer.quick_scan": { en: "Quick Scan", fr: "Analyse Rapide" },
  "farmer.detailed_scan": { en: "Detailed Scan", fr: "Analyse Détaillée" },
  "farmer.soil_desc": { en: "Soil Description", fr: "Description du Sol" },
  "farmer.soil_desc_placeholder": { en: "Describe color, texture, moisture...", fr: "Décrivez la couleur, texture, humidité..." },
  "farmer.analyzing": { en: "Analyzing...", fr: "Analyse en cours..." },
  "farmer.run_analysis": { en: "Run AI Analysis", fr: "Lancer l'Analyse IA" },
  "farmer.no_scans": { en: "No analyses yet.", fr: "Aucune analyse." },

  // Researcher
  "researcher.badge": { en: "Researcher Hub", fr: "Hub Chercheur" },
  "researcher.title": { en: "Data Contribution Hub", fr: "Hub de Contribution" },
  "researcher.subtitle": { en: "Manage your data contributions", fr: "Gérez vos contributions de données" },
  "researcher.total": { en: "Total Contributions", fr: "Total Contributions" },
  "researcher.approved": { en: "Approved", fr: "Approuvées" },
  "researcher.pending": { en: "Pending", fr: "En Attente" },
  "researcher.downloads": { en: "Downloads", fr: "Téléchargements" },
  "researcher.my_contributions": { en: "My Contributions", fr: "Mes Contributions" },
  "researcher.new_contribution": { en: "New Contribution", fr: "Nouvelle Contribution" },
  "researcher.form_title": { en: "Submit Dataset", fr: "Soumettre un Jeu de Données" },
  "researcher.form_desc": { en: "Share research data with the community. All submissions go through review.", fr: "Partagez vos données avec la communauté. Soumissions soumises à révision." },
  "researcher.dataset_title": { en: "Title", fr: "Titre" },
  "researcher.dataset_desc": { en: "Description", fr: "Description" },
  "researcher.data_type": { en: "Data Type", fr: "Type de Données" },
  "researcher.region": { en: "Region", fr: "Région" },
  "researcher.select_region": { en: "Select Region", fr: "Sélectionner" },
  "researcher.format": { en: "Format", fr: "Format" },
  "researcher.file_url": { en: "File URL", fr: "URL du Fichier" },
  "researcher.submit": { en: "Submit for Review", fr: "Soumettre" },
  "researcher.submitted": { en: "Submitted!", fr: "Soumis !" },
  "researcher.no_contributions": { en: "No contributions yet.", fr: "Aucune contribution." },
};

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");

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
