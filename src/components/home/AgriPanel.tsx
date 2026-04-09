import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Leaf, Sprout, CloudRain, Thermometer, TrendingUp, Droplets } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const AgriPanel = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;

  const totalPrecip = s?.total_precip ?? 0;
  const avgTemp = s?.avg_temp ?? 0;
  const avgHumidity = s?.avg_humidity ?? 0;

  const soilMoisture = Math.min(Math.round(avgHumidity * 0.85), 100);
  const ndviEstimate = avgTemp > 15 && totalPrecip > 50 ? 0.72 : avgTemp > 15 ? 0.58 : 0.45;
  const gdd = Math.max(0, Math.round((avgTemp - 10) * 30)); // Growing degree days
  const waterNeed = Math.round(avgTemp * 0.25 * 30); // Estimated crop water need mm/month
  const growingCondition = ndviEstimate > 0.6 ? t("home.agri_good") : t("home.agri_moderate");

  const indicators = [
    { label: t("home.soil_moisture"), value: `${soilMoisture}%`, pct: soilMoisture, color: "bg-primary" },
    { label: "NDVI végétation", value: ndviEstimate.toFixed(2), pct: ndviEstimate * 100, color: "bg-primary" },
    { label: t("home.precip_30d"), value: `${totalPrecip.toFixed(0)} mm`, pct: Math.min(totalPrecip / 2, 100), color: "bg-earth-sky" },
    { label: t("home.avg_temp_30d"), value: `${avgTemp.toFixed(1)}°C`, pct: ((avgTemp - 10) / 25) * 100, color: "bg-accent" },
    { label: "Degrés-jours (GDD)", value: `${gdd}`, pct: Math.min(gdd / 5, 100), color: "bg-primary" },
    { label: "Besoin eau culture", value: `${waterNeed} mm`, pct: Math.min(waterNeed / 2, 100), color: "bg-earth-sky" },
  ];

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Leaf size={16} className="text-primary" />
        </div>
        <h3 className="font-display font-semibold text-sm text-foreground">{t("home.agri_conditions")}</h3>
      </div>

      <div className="flex-1 space-y-2.5">
        {indicators.map((ind) => (
          <div key={ind.label}>
            <div className="flex justify-between text-[10px] mb-0.5">
              <span className="text-muted-foreground">{ind.label}</span>
              <span className="font-semibold text-foreground">{ind.value}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div className={`h-full rounded-full ${ind.color} transition-all duration-700`} style={{ width: `${Math.max(ind.pct, 5)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-primary/10">
        <div className="flex items-center gap-2">
          <Sprout size={14} className="text-primary" />
          <span className="text-xs font-medium text-primary">{growingCondition}</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">{t("home.agri_tip")}</p>
      </div>
    </div>
  );
};

export default AgriPanel;
