import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Send, Share2, Link2, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const categories = [
  { value: "climate", label: "🌍 Climat" },
  { value: "agriculture", label: "🌱 Agriculture" },
  { value: "research", label: "🧬 Recherche" },
  { value: "forecast", label: "🌧️ Prévisions" },
  { value: "solutions", label: "🌳 Solutions" },
  { value: "technology", label: "💡 Technologie" },
];

const CreateArticle = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState("climate");
  const [imageUrl, setImageUrl] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [articleId, setArticleId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (asDraft: boolean) => {
    if (!user || !title.trim() || !content.trim()) return;
    setPublishing(true);
    try {
      const { data, error } = await supabase.from("articles").insert({
        user_id: user.id,
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.trim().slice(0, 200) + "...",
        category,
        image_url: imageUrl.trim() || null,
        author_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Auteur",
        published: !asDraft,
      }).select().single();

      if (error) throw error;
      setArticleId(data.id);
      if (!asDraft) setPublished(true);
      toast({ title: asDraft ? "Brouillon sauvegardé !" : "Article publié ! 🎉" });
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    } finally {
      setPublishing(false);
    }
  };

  const shareUrl = articleId
    ? `${window.location.origin}/media?article=${articleId}`
    : window.location.href;

  const shareOnSocial = (platform: string) => {
    const text = encodeURIComponent(`${title} — Mazingira Cloud`);
    const url = encodeURIComponent(shareUrl);
    const urls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <button onClick={() => navigate("/media")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft size={16} /> Retour à Mazingira Media
        </button>

        <h1 className="font-display text-2xl font-bold text-foreground mb-1">✍️ Nouvel Article</h1>
        <p className="text-sm text-muted-foreground mb-8">Partagez vos analyses et connaissances avec la communauté</p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Titre de l'article *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: L'impact du changement climatique sur les cultures vivrières..."
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
              maxLength={255}
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    category === cat.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Résumé (optionnel)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Un bref résumé de l'article..."
              rows={2}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Image (URL)</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-semibold text-foreground mb-2 block">Contenu de l'article *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Rédigez votre article ici... Partagez vos analyses, données de terrain, recommandations agricoles ou résultats de recherche."
              rows={14}
              className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none leading-relaxed"
            />
          </div>

          {/* Actions */}
          {!published ? (
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => handleSubmit(false)}
                disabled={publishing || !title.trim() || !content.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 shadow-soft"
              >
                <Send size={16} />
                {publishing ? "Publication..." : "Publier l'article"}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={publishing || !title.trim() || !content.trim()}
                className="px-5 py-3 rounded-xl bg-muted text-foreground font-medium text-sm hover:bg-muted/80 transition-colors disabled:opacity-50"
              >
                Sauvegarder brouillon
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-primary/5 border border-primary/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <Share2 size={18} className="text-primary" />
                <h3 className="font-display font-bold text-foreground">Article publié ! Partagez-le :</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => shareOnSocial("facebook")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  <Facebook size={16} /> Facebook
                </button>
                <button onClick={() => shareOnSocial("twitter")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1DA1F2] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  <Twitter size={16} /> Twitter
                </button>
                <button onClick={() => shareOnSocial("linkedin")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  <Linkedin size={16} /> LinkedIn
                </button>
                <button onClick={() => shareOnSocial("whatsapp")} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  📱 WhatsApp
                </button>
                <button onClick={copyLink} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
                  {copied ? <Check size={16} /> : <Link2 size={16} />}
                  {copied ? "Copié !" : "Copier le lien"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreateArticle;
