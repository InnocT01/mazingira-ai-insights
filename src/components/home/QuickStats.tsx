import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowUp, ArrowDown, Sun, Gauge } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const QuickStats = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const latest = climate?.data?.[climate.data.length - 1];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="p-4 rounded-2xl bg-card border border-border shadow-soft">
        <div className="text-[10px] text-muted-foreground mb-1">{t("home.uv_index")}</div>
        <div className="text-2xl font-bold text-foreground">
          {latest?.solar_radiation ? Math.min(Math.round(latest.solar_radiation / 3), 11) : 6}
        </div>
        <div className="text-[10px] text-accent font-medium">{t("home.uv_high")}</div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border shadow-soft">
        <div className="text-[10px] text-muted-foreground mb-1">{t("home.temp_range")}</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <ArrowUp size={12} className="text-destructive" />
            <span className="text-sm font-bold text-foreground">{s?.max_temp?.toFixed(1)}°</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowDown size={12} className="text-earth-sky" />
            <span className="text-sm font-bold text-foreground">{s?.min_temp?.toFixed(1)}°</span>
          </div>
        </div>
        <div className="text-[10px] text-muted-foreground mt-1">{t("home.last_30_days")}</div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border shadow-soft">
        <div className="text-[10px] text-muted-foreground mb-1">{t("home.avg_humidity_label")}</div>
        <div className="text-2xl font-bold text-foreground">{s?.avg_humidity?.toFixed(0)}%</div>
        <div className="text-[10px] text-primary font-medium">{t("home.humidity_status")}</div>
      </div>
    </div>
  );
};

export default QuickStats;
