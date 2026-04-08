import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import CongoMap from "@/components/CongoMap";

const Maps = () => {
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-4">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground">{t("maps.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("maps.subtitle")}</p>
      </motion.div>

      <div className="rounded-xl bg-card border border-border overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
        <CongoMap />
      </div>
    </div>
  );
};

export default Maps;
