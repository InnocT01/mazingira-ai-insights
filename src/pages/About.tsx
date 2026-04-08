import { motion } from "framer-motion";
import { Globe, Users, Target, Heart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  const values = [
    { icon: Globe, title: "Africa-First", description: t("about.v1") },
    { icon: Users, title: "Open & Inclusive", description: t("about.v2") },
    { icon: Target, title: "Science-Driven", description: t("about.v3") },
    { icon: Heart, title: "Impact-Focused", description: t("about.v4") },
  ];

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="font-display text-2xl font-bold text-foreground">{t("about.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">{t("about.desc")}</p>
      </motion.div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <p className="text-sm text-muted-foreground leading-relaxed">{t("about.mission")}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {values.map((v, i) => (
          <motion.div key={v.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-xl bg-card border border-border">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
              <v.icon size={18} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-sm text-foreground">{v.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{v.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default About;
