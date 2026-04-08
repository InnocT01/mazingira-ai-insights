import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User, ArrowRight } from "lucide-react";

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
];

const MazingiraMedia = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground">{t("media.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("media.subtitle")}</p>
      </motion.div>

      <div className="grid gap-4">
        {articles.map((article, i) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-lg bg-primary/5 flex items-center justify-center text-2xl flex-shrink-0">
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
