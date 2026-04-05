import { motion } from "framer-motion";
import {
  Satellite, Brain, Globe, BarChart3, Database, Shield,
  AlertTriangle, FileText, History, ScanLine, CloudRain, Sprout,
  Users, Droplets, Map, TrendingUp
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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

const FeaturesSection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("features.badge")}</span>
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold text-foreground">{t("features.title")}</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("features.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="group p-5 rounded-2xl bg-card border border-border hover:shadow-elevated transition-all duration-300 hover:border-primary/20 hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={20} className="text-primary" />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground">{feature.titleKey}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
