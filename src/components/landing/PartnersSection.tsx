import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const PartnersSection = () => {
  const { t } = useLanguage();

  const partners = [
    { name: "NASA POWER", type: "Satellite Data" },
    { name: "Copernicus", type: "Earth Observation" },
    { name: "OpenWeather", type: "Weather API" },
    { name: "FAO", type: "Agriculture Data" },
    { name: "USGS", type: "Land Cover" },
    { name: "Google Earth Engine", type: "Geospatial" },
  ];

  return (
    <section className="py-16 border-y border-border bg-muted/30">
      <div className="container">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-8"
        >
          {t("partners.title")}
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="text-center"
            >
              <div className="font-display font-bold text-sm text-foreground/60">{p.name}</div>
              <div className="text-[10px] text-muted-foreground">{p.type}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
