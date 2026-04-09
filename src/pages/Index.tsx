import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClimateData, useGeolocation } from "@/hooks/useClimateData";
import CurrentConditions from "@/components/home/CurrentConditions";
import AgriPanel from "@/components/home/AgriPanel";
import WeeklyChart from "@/components/home/WeeklyChart";
import AgriInsights from "@/components/home/AgriInsights";
import QuickStats from "@/components/home/QuickStats";
import AgriCalendar from "@/components/home/AgriCalendar";
import SoilDashboard from "@/components/home/SoilDashboard";
import { Loader2, MapPin, CalendarDays } from "lucide-react";

const Index = () => {
  const { t } = useLanguage();
  const { geo, locating } = useGeolocation();
  const { climate, loading, error } = useClimateData(geo.latitude, geo.longitude);

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  if (loading || locating) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">
            {locating ? "📍 Détection de votre position..." : t("home.loading_data")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header with date and location */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <h1 className="font-display text-lg font-bold text-foreground">{geo.name}</h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">
              {t("home.tagline")} • {t("home.source_nasa")}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 border border-primary/10">
            <CalendarDays size={14} className="text-primary" />
            <span className="text-xs font-medium text-foreground capitalize">{dateStr}</span>
          </div>
        </div>
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

      {/* Weekly chart + Soil dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <WeeklyChart climate={climate} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <SoilDashboard climate={climate} />
        </motion.div>
      </div>

      {/* Agricultural insights */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <AgriInsights climate={climate} />
      </motion.div>

      {/* Agri calendar + Quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AgriCalendar climate={climate} />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <QuickStats climate={climate} />
        </motion.div>
      </div>

      {/* Footer */}
      {error && <p className="text-xs text-destructive text-center">{error}</p>}
      <p className="text-[10px] text-muted-foreground text-center pb-4">
        {t("home.data_source")} • {geo.latitude.toFixed(4)}°, {geo.longitude.toFixed(4)}°
      </p>
    </div>
  );
};

export default Index;
