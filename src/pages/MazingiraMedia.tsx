import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, User, ArrowRight, PenLine, Share2, Facebook, Twitter, Linkedin, Link2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const categoryEmoji: Record<string, string> = {
  climate: "🌍", agriculture: "🌱", research: "🧬", forecast: "🌧️", solutions: "🌳", technology: "💡",
};

const MazingiraMedia = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(20);
      setArticles(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const shareArticle = (id: string, title: string, platform: string) => {
    const url = encodeURIComponent(`${window.location.origin}/media?article=${id}`);
    const text = encodeURIComponent(`${title} — Mazingira Cloud`);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/media?article=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Fallback static articles when DB is empty
  const fallbackArticles = [
    { id: "1", title: "L'impact du changement climatique sur les cultures vivrières au Nord-Kivu", excerpt: "Une analyse des effets du réchauffement sur la production agricole...", author_name: "Équipe Mazingira", created_at: "2026-04-05", category: "climate" },
    { id: "2", title: "Guide : Analyser la santé de votre sol avec les données satellites", excerpt: "Comment utiliser les indices NDVI pour évaluer vos terres agricoles...", author_name: "Dr. Amani K.", created_at: "2026-04-01", category: "agriculture" },
    { id: "3", title: "Les variétés de manioc résistantes à la sécheresse en RDC", excerpt: "Découvrez les nouvelles variétés de manioc développées par l'IITA...", author_name: "Prof. Mukalay B.", created_at: "2026-03-28", category: "research" },
    { id: "4", title: "Prévisions de la saison des pluies 2026", excerpt: "Analyse des modèles climatiques et données NASA POWER...", author_name: "Équipe Mazingira", created_at: "2026-03-20", category: "forecast" },
    { id: "5", title: "Techniques de conservation des sols volcaniques", excerpt: "Les sols volcaniques riches du Nord-Kivu nécessitent des techniques spécifiques...", author_name: "Ing. Bahati M.", created_at: "2026-03-15", category: "agriculture" },
    { id: "6", title: "L'agroforesterie comme solution au changement climatique", excerpt: "Combiner arbres et cultures pour la résilience...", author_name: "Équipe Mazingira", created_at: "2026-03-10", category: "solutions" },
  ];

  const displayArticles = articles.length > 0 ? articles : fallbackArticles;
  const featured = displayArticles[0];
  const rest = displayArticles.slice(1);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">{t("media.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("media.subtitle")}</p>
        </div>
        {user ? (
          <button onClick={() => navigate("/media/new")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity shadow-soft">
            <PenLine size={16} />
            {t("media.create")}
          </button>
        ) : (
          <button onClick={() => navigate("/login")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
            <PenLine size={16} />
            {t("media.login_to_create")}
          </button>
        )}
      </motion.div>

      {/* Featured */}
      {featured && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 group">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
            {categoryEmoji[featured.category] || "📄"} {featured.category}
          </span>
          <h2 className="font-display font-bold text-lg text-foreground mt-3">{featured.title}</h2>
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{featured.excerpt}</p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><User size={12} />{featured.author_name}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar size={12} />{new Date(featured.created_at).toLocaleDateString("fr-FR")}</div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => shareArticle(featured.id, featured.title, "facebook")} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Facebook size={14} className="text-muted-foreground" /></button>
              <button onClick={() => shareArticle(featured.id, featured.title, "twitter")} className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Twitter size={14} className="text-muted-foreground" /></button>
              <button onClick={() => shareArticle(featured.id, featured.title, "whatsapp")} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground text-xs">📱</button>
              <button onClick={() => copyLink(featured.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                {copiedId === featured.id ? <Check size={14} className="text-primary" /> : <Link2 size={14} className="text-muted-foreground" />}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* List */}
      <div className="grid gap-3">
        {rest.map((article, i) => (
          <motion.article key={article.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.03 }}
            className="flex gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all group">
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-xl flex-shrink-0">
              {categoryEmoji[article.category] || "📄"}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{article.category}</span>
              <h3 className="font-display font-semibold text-sm text-foreground mt-1 line-clamp-1">{article.title}</h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{article.excerpt}</p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><User size={10} />{article.author_name}</span>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1"><Calendar size={10} />{new Date(article.created_at).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button onClick={() => shareArticle(article.id, article.title, "whatsapp")} className="p-1 rounded hover:bg-muted transition-colors text-[10px]">📱</button>
                  <button onClick={() => copyLink(article.id)} className="p-1 rounded hover:bg-muted transition-colors">
                    {copiedId === article.id ? <Check size={12} className="text-primary" /> : <Link2 size={12} className="text-muted-foreground" />}
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default MazingiraMedia;
