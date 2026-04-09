import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClimateData } from "@/hooks/useClimateData";
import CurrentConditions from "@/components/home/CurrentConditions";
import AgriPanel from "@/components/home/AgriPanel";
import WeeklyChart from "@/components/home/WeeklyChart";
import AgriInsights from "@/components/home/AgriInsights";
import QuickStats from "@/components/home/QuickStats";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const { climate, loading, error } = useClimateData();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">{t("home.loading_data")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h1 className="font-display text-lg font-bold text-foreground">
            Goma, Nord-Kivu, RDC
          </h1>
        </div>
        <p className="text-xs text-muted-foreground mt-1 ml-5">
          {t("home.tagline")} • {t("home.source_nasa")}
        </p>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div className="lg:col-span-2" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <CurrentConditions climate={climate} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AgriPanel climate={climate} />
        </motion.div>
      </div>

      {/* Weekly chart */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <WeeklyChart climate={climate} />
      </motion.div>

      {/* Agricultural insights */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <AgriInsights climate={climate} />
      </motion.div>

      {/* Quick stats */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <QuickStats climate={climate} />
      </motion.div>

      {/* Data source footer */}
      {error && (
        <p className="text-xs text-destructive text-center">{error}</p>
      )}
      <p className="text-[10px] text-muted-foreground text-center pb-4">
        {t("home.data_source")}
      </p>
    </div>
  );
};

export default Index;
