import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User, ArrowRight, Plus, PenLine } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const articles = [
  {
    id: 1,
    title: "L'impact du changement climatique sur les cultures vivrières au Nord-Kivu",
    excerpt: "Une analyse approfondie des effets du réchauffement climatique sur la production agricole dans la province du Nord-Kivu, avec des recommandations pour l'adaptation...",
    author: "Équipe Mazingira",
    date: "2026-04-05",
    category: "Climat",
    image: "🌍",
  },
  {
    id: 2,
    title: "Guide : Analyser la santé de votre sol avec les données satellites",
    excerpt: "Comment utiliser les indices NDVI et les données de télédétection pour évaluer la qualité de vos terres agricoles sans équipement coûteux...",
    author: "Dr. Amani K.",
    date: "2026-04-01",
    category: "Agriculture",
    image: "🌱",
  },
  {
    id: 3,
    title: "Les variétés de manioc résistantes à la sécheresse en RDC",
    excerpt: "Découvrez les nouvelles variétés de manioc développées par l'IITA qui résistent mieux aux périodes de sécheresse prolongées dans la région des Grands Lacs...",
    author: "Prof. Mukalay B.",
    date: "2026-03-28",
    category: "Recherche",
    image: "🧬",
  },
  {
    id: 4,
    title: "Prévisions de la saison des pluies 2026 : ce que les données nous disent",
    excerpt: "Analyse des modèles climatiques et des données NASA POWER pour anticiper la saison des pluies dans l'Est de la RDC. Implications pour la planification agricole...",
    author: "Équipe Mazingira",
    date: "2026-03-20",
    category: "Prévisions",
    image: "🌧️",
  },
  {
    id: 5,
    title: "Techniques de conservation des sols volcaniques autour du Nyiragongo",
    excerpt: "Les sols volcaniques riches du Nord-Kivu nécessitent des techniques spécifiques de conservation. Guide pratique pour les agriculteurs de la région de Goma...",
    author: "Ing. Bahati M.",
    date: "2026-03-15",
    category: "Agriculture",
    image: "🌋",
  },
  {
    id: 6,
    title: "L'agroforesterie comme solution au changement climatique en RDC",
    excerpt: "Comment combiner arbres et cultures pour améliorer la résilience des exploitations agricoles face aux changements climatiques dans le bassin du Congo...",
    author: "Équipe Mazingira",
    date: "2026-03-10",
    category: "Solutions",
    image: "🌳",
  },
];

const MazingiraMedia = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{t("media.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("media.subtitle")}</p>
        </div>
        {user ? (
          <button
            onClick={() => navigate("/media/new")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-soft"
          >
            <PenLine size={16} />
            {t("media.create")}
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            <Plus size={16} />
            {t("media.login_to_create")}
          </button>
        )}
      </motion.div>

      {/* Featured article */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 cursor-pointer group hover:shadow-soft transition-all"
      >
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
          {articles[0].category}
        </span>
        <h2 className="font-display font-bold text-lg text-foreground mt-3 group-hover:text-primary transition-colors">
          {articles[0].title}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{articles[0].excerpt}</p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User size={12} />
            {articles[0].author}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar size={12} />
            {new Date(articles[0].date).toLocaleDateString("fr-FR")}
          </div>
        </div>
      </motion.div>

      {/* Article list */}
      <div className="grid gap-3">
        {articles.slice(1).map((article, i) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.03 }}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center text-2xl flex-shrink-0">
              {article.image}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {article.category}
                </span>
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {article.excerpt}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <User size={10} />
                  {article.author}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Calendar size={10} />
                  {new Date(article.date).toLocaleDateString("fr-FR")}
                </div>
              </div>
            </div>
            <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-4 flex-shrink-0" />
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default MazingiraMedia;
