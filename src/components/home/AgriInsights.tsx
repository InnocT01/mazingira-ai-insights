import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout, Droplets, Bug, Calendar, Wheat, Mountain, Leaf, Zap, CloudRain } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const AgriInsights = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const avgTemp = s?.avg_temp ?? 20;
  const totalPrecip = s?.total_precip ?? 0;
  const avgHumidity = s?.avg_humidity ?? 70;
  const avgWind = s?.avg_wind ?? 2;

  const insights = [
    {
      icon: Sprout,
      title: t("agri.planting_window"),
      desc: avgTemp > 17 && totalPrecip > 40 ? t("agri.planting_favorable") : t("agri.planting_wait"),
      status: avgTemp > 17 && totalPrecip > 40 ? "good" : "warning",
    },
    {
      icon: Droplets,
      title: t("agri.irrigation"),
      desc: totalPrecip > 80 ? t("agri.irrigation_sufficient") : t("agri.irrigation_needed"),
      status: totalPrecip > 80 ? "good" : "warning",
    },
    {
      icon: Bug,
      title: t("agri.pest_risk"),
      desc: avgHumidity > 85 ? t("agri.pest_high") : t("agri.pest_low"),
      status: avgHumidity > 85 ? "danger" : "good",
    },
    {
      icon: Wheat,
      title: t("agri.crop_rec"),
      desc: avgTemp > 18 ? t("agri.crop_rec_warm") : t("agri.crop_rec_cool"),
      status: "info",
    },
    {
      icon: Mountain,
      title: t("agri.soil_tip"),
      desc: totalPrecip > 100 ? t("agri.soil_erosion_risk") : t("agri.soil_stable"),
      status: totalPrecip > 100 ? "warning" : "good",
    },
    {
      icon: Calendar,
      title: t("agri.season"),
      desc: t("agri.season_info"),
      status: "info",
    },
    {
      icon: Zap,
      title: "Stress thermique",
      desc: avgTemp > 30
        ? "⚠️ Risque de stress thermique pour les cultures. Prévoir ombrage et irrigation."
        : avgTemp > 25
          ? "Surveillance recommandée — températures élevées mais tolérables."
          : "✅ Pas de stress thermique. Températures dans la plage optimale.",
      status: avgTemp > 30 ? "danger" : avgTemp > 25 ? "warning" : "good",
    },
    {
      icon: CloudRain,
      title: "Risque d'inondation",
      desc: totalPrecip > 150
        ? "⚠️ Fort cumul pluviométrique. Risque d'inondation dans les bas-fonds. Éviter les semis en zone basse."
        : "Pas de risque d'inondation significatif. Drainage naturel suffisant.",
      status: totalPrecip > 150 ? "danger" : "good",
    },
    {
      icon: Leaf,
      title: "Fertilisation",
      desc: totalPrecip > 80 && avgTemp > 18
        ? "Période propice à l'application d'engrais organiques. Le sol humide favorise l'absorption."
        : "Reporter la fertilisation — conditions sous-optimales pour l'absorption des nutriments.",
      status: totalPrecip > 80 && avgTemp > 18 ? "good" : "warning",
    },
  ];

  const statusColor = {
    good: "border-primary/30 bg-primary/5",
    warning: "border-accent/30 bg-accent/5",
    danger: "border-destructive/30 bg-destructive/5",
    info: "border-border bg-muted/30",
  };

  const dotColor = {
    good: "bg-primary",
    warning: "bg-accent",
    danger: "bg-destructive",
    info: "bg-muted-foreground",
  };

  return (
    <div>
      <h3 className="font-display font-semibold text-sm text-foreground mb-3">
        {t("agri.insights_title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map((ins, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border transition-all hover:shadow-soft ${statusColor[ins.status as keyof typeof statusColor]}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <ins.icon size={15} className="text-foreground" />
              <span className="text-xs font-semibold text-foreground">{ins.title}</span>
              <div className={`ml-auto w-2 h-2 rounded-full ${dotColor[ins.status as keyof typeof dotColor]}`} />
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{ins.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriInsights;
