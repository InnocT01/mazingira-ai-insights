import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sprout, Droplets, Bug, Calendar, Wheat, Mountain } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const AgriInsights = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const avgTemp = s?.avg_temp ?? 20;
  const totalPrecip = s?.total_precip ?? 0;
  const avgHumidity = s?.avg_humidity ?? 70;

  const insights = [
    {
      icon: Sprout,
      title: t("agri.planting_window"),
      desc: avgTemp > 17 && totalPrecip > 40
        ? t("agri.planting_favorable")
        : t("agri.planting_wait"),
      status: avgTemp > 17 && totalPrecip > 40 ? "good" : "warning",
    },
    {
      icon: Droplets,
      title: t("agri.irrigation"),
      desc: totalPrecip > 80
        ? t("agri.irrigation_sufficient")
        : t("agri.irrigation_needed"),
      status: totalPrecip > 80 ? "good" : "warning",
    },
    {
      icon: Bug,
      title: t("agri.pest_risk"),
      desc: avgHumidity > 85
        ? t("agri.pest_high")
        : t("agri.pest_low"),
      status: avgHumidity > 85 ? "danger" : "good",
    },
    {
      icon: Wheat,
      title: t("agri.crop_rec"),
      desc: avgTemp > 18
        ? t("agri.crop_rec_warm")
        : t("agri.crop_rec_cool"),
      status: "info",
    },
    {
      icon: Mountain,
      title: t("agri.soil_tip"),
      desc: totalPrecip > 100
        ? t("agri.soil_erosion_risk")
        : t("agri.soil_stable"),
      status: totalPrecip > 100 ? "warning" : "good",
    },
    {
      icon: Calendar,
      title: t("agri.season"),
      desc: t("agri.season_info"),
      status: "info",
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
