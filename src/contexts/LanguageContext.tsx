import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fr";

const translations: Record<string, Record<Lang, string>> = {
  // Navbar
  "nav.home": { en: "Home", fr: "Accueil" },
  "nav.opendata": { en: "Open Data", fr: "Données Ouvertes" },
  "nav.explorer": { en: "Explorer", fr: "Explorateur" },
  "nav.ai": { en: "AI Assistant", fr: "Assistant IA" },
  "nav.about": { en: "About", fr: "À propos" },
  "nav.contact": { en: "Contact", fr: "Contact" },
  "nav.signin": { en: "Sign In", fr: "Connexion" },
  "nav.signout": { en: "Sign Out", fr: "Déconnexion" },
  "nav.premium": { en: "Premium", fr: "Premium" },

  // Hero
  "hero.badge": { en: "Environmental Intelligence for Africa", fr: "Intelligence Environnementale pour l'Afrique" },
  "hero.title1": { en: "Regenerating the Congolese land/fields through", fr: "Régénérer les terres congolaises grâce à" },
  "hero.title2": { en: "climate and soil data intelligence", fr: "l'intelligence des données climatiques et pédologiques" },
  "hero.subtitle": { en: "An AI-powered platform combining open-source environmental data with premium analytics for agriculture and climate resilience across Africa.", fr: "Une plateforme alimentée par l'IA combinant des données environnementales open-source avec des analyses premium pour l'agriculture et la résilience climatique en Afrique." },
  "hero.cta1": { en: "Explore Open Data", fr: "Explorer les données" },
  "hero.cta2": { en: "Ask Mazingira AI", fr: "Demander à Mazingira IA" },

  // Stats
  "stat.hectares": { en: "Hectares Monitored", fr: "Hectares Surveillés" },
  "stat.realtime": { en: "Real-Time Data", fr: "Données en Temps Réel" },
  "stat.sources": { en: "Data Sources", fr: "Sources de Données" },
  "stat.users": { en: "Users Empowered", fr: "Utilisateurs" },

  // Features
  "features.badge": { en: "Platform Capabilities", fr: "Capacités de la Plateforme" },
  "features.title": { en: "Environmental intelligence, reimagined", fr: "L'intelligence environnementale, réinventée" },
  "features.subtitle": { en: "From satellite data to AI-driven insights — everything you need to understand and protect Africa's most vital ecosystems.", fr: "Des données satellites aux analyses pilotées par l'IA — tout pour comprendre et protéger les écosystèmes vitaux de l'Afrique." },

  // Layers
  "layers.badge": { en: "Hybrid Platform", fr: "Plateforme Hybride" },
  "layers.title": { en: "Two layers, one mission", fr: "Deux couches, une mission" },
  "layers.open.title": { en: "🌐 Open Data Layer", fr: "🌐 Couche Données Ouvertes" },
  "layers.open.desc": { en: "Free, real-time environmental dashboard for farmers, NGOs, researchers, and climate agents. Interactive maps, alerts, downloadable datasets, and API access.", fr: "Tableau de bord environnemental gratuit et en temps réel pour les agriculteurs, ONG, chercheurs et agents climatiques." },
  "layers.premium.title": { en: "🔒 Premium Intelligence", fr: "🔒 Intelligence Premium" },
  "layers.premium.desc": { en: "AI-powered private dashboard for agribusinesses, landowners, and institutions. Personalized analysis, predictive insights, and actionable recommendations.", fr: "Tableau de bord privé alimenté par l'IA pour les agro-entreprises, propriétaires terriens et institutions." },

  // CTA
  "cta.title": { en: "Ready to explore Africa's environmental data?", fr: "Prêt à explorer les données environnementales de l'Afrique ?" },
  "cta.subtitle": { en: "Join thousands of researchers, farmers, and organizations using Mazingira Cloud to make data-driven decisions for a sustainable future.", fr: "Rejoignez des milliers de chercheurs, agriculteurs et organisations utilisant Mazingira Cloud." },
  "cta.button": { en: "Get Started Free", fr: "Commencer Gratuitement" },
  "cta.contact": { en: "Contact Us", fr: "Contactez-Nous" },

  // Dashboard
  "dashboard.badge": { en: "Open Data", fr: "Données Ouvertes" },
  "dashboard.title": { en: "Public Dashboard", fr: "Tableau de Bord Public" },
  "dashboard.subtitle": { en: "Explore real-time environmental data across the Congo Basin.", fr: "Explorez les données environnementales en temps réel du Bassin du Congo." },

  // Footer
  "footer.desc": { en: "Regenerating the Congolese land through data intelligence. An AI-powered environmental platform democratizing access to climate and agricultural data across Africa.", fr: "Régénérer les terres congolaises grâce à l'intelligence des données. Une plateforme environnementale démocratisant l'accès aux données climatiques et agricoles en Afrique." },
  "footer.platform": { en: "Platform", fr: "Plateforme" },
  "footer.contact": { en: "Contact", fr: "Contact" },
  "footer.followus": { en: "Follow Us", fr: "Suivez-nous" },

  // Auth
  "auth.signin": { en: "Sign In", fr: "Connexion" },
  "auth.signup": { en: "Create Account", fr: "Créer un Compte" },
  "auth.email": { en: "Email", fr: "Email" },
  "auth.password": { en: "Password", fr: "Mot de passe" },
  "auth.fullname": { en: "Full Name", fr: "Nom Complet" },
  "auth.noaccount": { en: "Don't have an account?", fr: "Pas de compte ?" },
  "auth.hasaccount": { en: "Already have an account?", fr: "Déjà un compte ?" },
  "auth.premium_access": { en: "Access your premium dashboard", fr: "Accédez à votre tableau de bord premium" },
  "auth.free_trial": { en: "Start your free trial today", fr: "Commencez votre essai gratuit" },

  // AI
  "ai.title": { en: "Ask Mazingira AI", fr: "Demandez à Mazingira IA" },
  "ai.subtitle": { en: "Your AI-powered environmental intelligence assistant. Ask about soil, crops, climate, and more.", fr: "Votre assistant IA d'intelligence environnementale. Posez des questions sur le sol, les cultures, le climat." },
  "ai.placeholder": { en: "Ask about your land, crops, climate...", fr: "Posez vos questions sur vos terres, cultures, climat..." },

  // Premium
  "premium.title": { en: "Premium Dashboard", fr: "Tableau de Bord Premium" },
  "premium.subtitle": { en: "AI-powered analytics for your land", fr: "Analyses IA pour vos terres" },
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
