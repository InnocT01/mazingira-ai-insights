import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";

interface Props {
  climate: ClimateResponse | null;
}

const WeeklyChart = ({ climate }: Props) => {
  const { t } = useLanguage();
  const data = climate?.data ?? [];
  
  // Show last 7 days
  const week = data.slice(-7);
  const maxPrecip = Math.max(...week.map(d => d.precipitation ?? 0), 1);
  const maxTemp = Math.max(...week.map(d => d.temperature ?? 0));
  const minTemp = Math.min(...week.map(d => d.temperature ?? 0));
  const tempRange = maxTemp - minTemp || 1;

  const formatDate = (dateStr: string) => {
    const y = dateStr.slice(0, 4);
    const m = dateStr.slice(4, 6);
    const d = dateStr.slice(6, 8);
    const date = new Date(`${y}-${m}-${d}`);
    return date.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
  };

  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-soft">
      <h3 className="font-display font-semibold text-sm text-foreground mb-4">
        {t("home.last_7_days")}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {week.map((day, i) => {
          const temp = day.temperature ?? 0;
          const precip = day.precipitation ?? 0;
          const tempPct = ((temp - minTemp) / tempRange) * 100;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground font-medium">
                {formatDate(day.date)}
              </span>

              {/* Temperature dot */}
              <div className="relative h-20 w-full flex items-end justify-center">
                <div
                  className="absolute w-3 h-3 rounded-full bg-accent shadow-sm"
                  style={{ bottom: `${tempPct}%` }}
                />
                <div
                  className="w-full rounded-t bg-earth-sky/30"
                  style={{ height: `${(precip / maxPrecip) * 100}%` }}
                />
              </div>

              <div className="text-center">
                <div className="text-xs font-bold text-foreground">{temp.toFixed(1)}°</div>
                <div className="text-[10px] text-earth-sky">{precip.toFixed(1)}mm</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
          <span className="text-[10px] text-muted-foreground">{t("home.temperature")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-earth-sky/30" />
          <span className="text-[10px] text-muted-foreground">{t("home.precipitation")}</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyChart;
