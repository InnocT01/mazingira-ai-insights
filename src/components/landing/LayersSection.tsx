import { motion } from "framer-motion";
import { Globe, Shield, Leaf, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const LayersSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-gradient-earth">
      <div className="container">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("layers.badge")}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">{t("layers.title")}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Open Data */}
          <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="relative p-8 rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <Globe size={24} className="text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground">{t("layers.open.title")}</h3>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">{t("layers.open.desc")}</p>
              <ul className="mt-4 space-y-2">
                {["Interactive satellite maps", "Climate alerts & monitoring", "Downloadable CSV & API", "Community-driven data"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <Leaf size={14} className="text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/open-data" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-primary hover:underline">
                {t("hero.cta1")} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>

          {/* Premium */}
          <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="relative p-8 rounded-2xl bg-earth-deep text-primary-foreground border border-primary/20 shadow-elevated overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-earth-sun/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-5">
                <Shield size={24} className="text-earth-sun" />
              </div>
              <h3 className="font-display text-xl font-bold">{t("layers.premium.title")}</h3>
              <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed">{t("layers.premium.desc")}</p>
              <ul className="mt-4 space-y-2">
                {["Register your farms", "AI soil scanning", "Crop recommendations", "Climate alerts for your land"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <Leaf size={14} className="text-earth-sun shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-earth-sun hover:underline">
                {t("nav.signin")} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LayersSection;
