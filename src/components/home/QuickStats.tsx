import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUp, ArrowDown, Sun, Droplets, Wind, Thermometer } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const QuickStats = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const latest = climate?.data?.[climate.data.length - 1];
  const solar = latest?.solar_radiation ?? 0;
  const uvIndex = solar ? Math.min(Math.round(solar / 2.5), 12) : 5;

  const cards = [
    {
      label: t("home.uv_index"),
      value: `${uvIndex}`,
      sub: uvIndex > 7 ? "Très élevé ☀️" : uvIndex > 4 ? "Modéré" : "Faible",
      color: uvIndex > 7 ? "text-destructive" : "text-accent",
    },
    {
      label: t("home.temp_range"),
      value: `${s?.min_temp?.toFixed(1)}° — ${s?.max_temp?.toFixed(1)}°`,
      sub: t("home.last_30_days"),
      color: "text-foreground",
    },
    {
      label: t("home.avg_humidity_label"),
      value: `${s?.avg_humidity?.toFixed(0)}%`,
      sub: t("home.humidity_status"),
      color: "text-primary",
    },
    {
      label: "Vent moyen",
      value: `${s?.avg_wind?.toFixed(1)} m/s`,
      sub: (s?.avg_wind ?? 0) > 4 ? "Venteux" : "Calme",
      color: "text-earth-sky",
    },
    {
      label: "Pluviométrie totale",
      value: `${s?.total_precip?.toFixed(0)} mm`,
      sub: "Sur 30 jours",
      color: "text-earth-sky",
    },
    {
      label: "Rayonnement solaire",
      value: `${solar.toFixed(1)} MJ/m²`,
      sub: solar > 20 ? "Fort ensoleillement" : "Modéré",
      color: "text-accent",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {cards.map((c) => (
        <div key={c.label} className="p-3.5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-elevated transition-shadow">
          <div className="text-[10px] text-muted-foreground mb-1">{c.label}</div>
          <div className={`text-lg font-bold ${c.color}`}>{c.value}</div>
          <div className="text-[10px] text-muted-foreground mt-0.5">{c.sub}</div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;
