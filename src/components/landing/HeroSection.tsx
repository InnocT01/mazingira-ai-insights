import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Play } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg-mazingira.png";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-earth-deep/90 via-earth-deep/70 to-earth-deep/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-deep via-transparent to-earth-deep/30" />
      </div>

      <div className="relative z-10 container pt-24 pb-16">
        <div className="max-w-3xl">
          <motion.div {...fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground/90 text-xs font-semibold tracking-wider uppercase mb-6 border border-primary/30 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-earth-sun animate-pulse" />
              {t("hero.badge")}
            </span>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-[1.1] tracking-tight"
          >
            {t("hero.title1")}{" "}
            <span className="text-earth-sun">{t("hero.title2")}</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base md:text-lg text-primary-foreground/70 max-w-xl leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:shadow-elevated transition-all duration-300 hover:scale-[1.02]"
            >
              {t("hero.cta1")} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-primary-foreground font-semibold text-sm border border-white/20 hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <MessageSquare size={16} /> {t("hero.cta2")}
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-12 flex items-center gap-6 text-primary-foreground/50 text-xs"
          >
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full bg-primary/30 border-2 border-earth-deep flex items-center justify-center text-[10px] font-bold text-primary-foreground/70">
                  {["🌱","🔬","🌍","📊"][i-1]}
                </div>
              ))}
            </div>
            <span>{t("hero.trust")}</span>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
