import { motion } from "framer-motion";
import { ArrowRight, Satellite, Brain, Database, Shield, Globe, Leaf, BarChart3, MessageSquare, AlertTriangle, FileText, History, ScanLine, CloudRain, Sprout, Users, Droplets, Map, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg-mazingira.png";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

const features = [
  { icon: Satellite, titleKey: "Satellite Intelligence", description: "Real-time NDVI, rainfall, temperature, and soil moisture data from multiple satellite sources." },
  { icon: Brain, titleKey: "AI-Powered Analysis", description: "Smart recommendations for crop optimization, irrigation, and regenerative agriculture practices." },
  { icon: Globe, titleKey: "Interactive Maps", description: "Explore environmental data with interactive, filterable maps covering the Congo Basin." },
  { icon: BarChart3, titleKey: "Predictive Insights", description: "Yield forecasting, climate risk scoring, and trend analysis for informed decision-making." },
  { icon: Database, titleKey: "Open Data Access", description: "Downloadable datasets via CSV and API. Democratizing environmental intelligence across Africa." },
  { icon: Shield, titleKey: "Premium Analytics", description: "AI-driven personalized reports, soil health analysis, and crop performance monitoring." },
  { icon: AlertTriangle, titleKey: "Climate Alerts", description: "Real-time drought, flood, and frost notifications to protect farmers' crops and livelihoods." },
  { icon: FileText, titleKey: "PDF Reports", description: "Generate downloadable soil analysis and climate reports with AI-powered insights." },
  { icon: History, titleKey: "Satellite History", description: "Compare NDVI, rainfall, and vegetation across multiple seasons and years." },
  { icon: ScanLine, titleKey: "Soil & Seed Scanner", description: "Analyze soil samples and seeds for nutrient profiles and optimal planting recommendations." },
  { icon: CloudRain, titleKey: "Weather Forecasting", description: "Hyperlocal 7-day weather predictions tailored for agricultural planning in DRC." },
  { icon: Sprout, titleKey: "Crop Calendar", description: "AI-generated planting and harvesting schedules based on local climate and soil conditions." },
  { icon: Users, titleKey: "Farmer Community", description: "Connect with local farmers, share best practices, and access cooperative market opportunities." },
  { icon: Droplets, titleKey: "Irrigation Advisor", description: "Smart irrigation recommendations based on soil moisture, weather forecasts, and crop needs." },
  { icon: Map, titleKey: "Land Mapping", description: "GPS-based land boundary mapping and parcel management for smallholder farmers." },
  { icon: TrendingUp, titleKey: "Carbon Credits", description: "Track carbon sequestration from regenerative practices and access carbon credit markets." },
];

const Index = () => {
  const { t } = useLanguage();

  const stats = [
    { value: "5K+", label: t("stat.hectares") },
    { value: "24/7", label: t("stat.realtime") },
    { value: "12+", label: t("stat.sources") },
    { value: "150+", label: t("stat.users") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-earth-deep/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-earth-deep via-transparent to-transparent" />
        </div>
        <div className="relative z-10 container text-center pt-20">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground/90 text-xs font-semibold tracking-wider uppercase mb-6 border border-primary/30">
              {t("hero.badge")}
            </span>
          </motion.div>
          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight max-w-4xl mx-auto"
          >
            {t("hero.title1")}{" "}
            <span className="text-earth-sun">{t("hero.title2")}</span>
          </motion.h1>
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              {t("hero.cta1")} <ArrowRight size={16} />
            </Link>
            <Link
              to="/ai"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground/10 text-primary-foreground font-semibold text-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-colors backdrop-blur-sm"
            >
              <MessageSquare size={16} /> {t("hero.cta2")}
            </Link>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }} className="text-center">
                <div className="font-display text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("features.badge")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">{t("features.title")}</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("features.subtitle")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div key={feature.titleKey} {...stagger} transition={{ duration: 0.5, delay: i * 0.08 }} className="group p-6 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">{feature.titleKey}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Layers */}
      <section className="py-24 bg-gradient-earth">
        <div className="container">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("layers.badge")}</span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">{t("layers.title")}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="p-8 rounded-2xl bg-card border border-border shadow-soft">
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
            </motion.div>

            <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="p-8 rounded-2xl bg-earth-deep text-primary-foreground border border-primary/20 shadow-elevated">
              <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mb-5">
                <Shield size={24} className="text-earth-sun" />
              </div>
              <h3 className="font-display text-xl font-bold">{t("layers.premium.title")}</h3>
              <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed">{t("layers.premium.desc")}</p>
              <ul className="mt-4 space-y-2">
                {["AI soil & crop analysis", "Yield forecasting", "Custom PDF reports", "Personalized recommendations"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <Leaf size={14} className="text-earth-sun shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <motion.div {...fadeUp} className="relative rounded-3xl overflow-hidden p-12 md:p-20 text-center">
            <div className="absolute inset-0 bg-gradient-hero opacity-90" />
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">{t("cta.title")}</h2>
              <p className="mt-4 text-primary-foreground/70 max-w-xl mx-auto">{t("cta.subtitle")}</p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground text-earth-deep font-semibold text-sm hover:opacity-90 transition-opacity">
                  {t("cta.button")} <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition-colors">
                  {t("cta.contact")}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
