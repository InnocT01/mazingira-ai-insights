import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, TrendingDown, Minus, Thermometer, Droplets, Leaf } from "lucide-react";

const monthlyData = [
  { month: "Jan", temp: 24, rain: 120, ndvi: 0.65 },
  { month: "Feb", temp: 24, rain: 110, ndvi: 0.63 },
  { month: "Mar", temp: 25, rain: 140, ndvi: 0.67 },
  { month: "Apr", temp: 24, rain: 160, ndvi: 0.70 },
  { month: "May", temp: 23, rain: 80, ndvi: 0.68 },
  { month: "Jun", temp: 22, rain: 30, ndvi: 0.62 },
  { month: "Jul", temp: 21, rain: 15, ndvi: 0.58 },
  { month: "Aug", temp: 22, rain: 25, ndvi: 0.56 },
  { month: "Sep", temp: 23, rain: 60, ndvi: 0.60 },
  { month: "Oct", temp: 24, rain: 100, ndvi: 0.64 },
  { month: "Nov", temp: 24, rain: 130, ndvi: 0.66 },
  { month: "Dec", temp: 24, rain: 125, ndvi: 0.65 },
];

const Trends = () => {
  const { t } = useLanguage();

  const maxRain = Math.max(...monthlyData.map((d) => d.rain));

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground">{t("trends.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("trends.subtitle")}</p>
      </motion.div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Thermometer size={16} className="text-accent" />
            <span className="text-xs text-muted-foreground">{t("trends.avg_temp")}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">23.3°C</div>
          <div className="flex items-center gap-1 text-xs text-primary mt-1">
            <Minus size={12} />
            <span>{t("trends.stable")}</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Droplets size={16} className="text-earth-sky" />
            <span className="text-xs text-muted-foreground">{t("trends.annual_rain")}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">995 mm</div>
          <div className="flex items-center gap-1 text-xs text-destructive mt-1">
            <TrendingDown size={12} />
            <span>-5% vs 2025</span>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Leaf size={16} className="text-primary" />
            <span className="text-xs text-muted-foreground">{t("trends.avg_ndvi")}</span>
          </div>
          <div className="text-2xl font-bold text-foreground">0.637</div>
          <div className="flex items-center gap-1 text-xs text-primary mt-1">
            <TrendingUp size={12} />
            <span>+2% vs 2025</span>
          </div>
        </div>
      </div>

      {/* Monthly precipitation chart */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-display font-semibold text-sm mb-4">{t("trends.monthly_rain")}</h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d.rain}</span>
              <div
                className="w-full rounded-t-sm bg-earth-sky/60"
                style={{ height: `${(d.rain / maxRain) * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly NDVI */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <h3 className="font-display font-semibold text-sm mb-4">{t("trends.monthly_ndvi")}</h3>
        <div className="flex items-end gap-2 h-40">
          {monthlyData.map((d) => (
            <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-muted-foreground">{d.ndvi}</span>
              <div
                className="w-full rounded-t-sm bg-primary/50"
                style={{ height: `${d.ndvi * 100}%` }}
              />
              <span className="text-[10px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trends;
