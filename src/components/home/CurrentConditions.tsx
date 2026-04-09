import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Cloud, Droplets, Wind, Eye, Gauge, Thermometer } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const CurrentConditions = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const latest = climate?.data?.[climate.data.length - 1];

  const temp = latest?.temperature ?? s?.current_temp ?? 0;
  const humidity = latest?.humidity ?? s?.avg_humidity ?? 0;
  const wind = latest?.wind_speed ?? s?.avg_wind ?? 0;
  const solar = latest?.solar_radiation ?? 0;
  const precip = latest?.precipitation ?? 0;

  const WeatherIcon = precip > 5 ? Droplets : precip > 1 ? Cloud : Sun;
  const condition = precip > 5 ? t("home.rainy") : precip > 1 ? t("home.cloudy") : t("home.partly_sunny");

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border shadow-soft h-full">
      <div className="flex items-start gap-5">
        <div className="p-3 rounded-xl bg-accent/10">
          <WeatherIcon size={44} className="text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-display font-bold text-foreground tracking-tight">
              {temp.toFixed(1)}
            </span>
            <span className="text-xl text-muted-foreground">°C</span>
          </div>
          <p className="text-sm font-medium text-foreground mt-1">{condition}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("home.feels_like")} {(temp + 1.5).toFixed(0)}° • Min {s?.min_temp?.toFixed(1)}° / Max {s?.max_temp?.toFixed(1)}°
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Wind, label: t("home.wind"), value: `${wind.toFixed(1)} m/s`, color: "text-earth-sky" },
          { icon: Droplets, label: t("home.humidity"), value: `${humidity.toFixed(0)}%`, color: "text-earth-sky" },
          { icon: Thermometer, label: t("home.precip_today"), value: `${precip.toFixed(1)} mm`, color: "text-accent" },
          { icon: Sun, label: t("home.solar"), value: `${solar.toFixed(1)} MJ/m²`, color: "text-accent" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30">
            <stat.icon size={15} className={stat.color} />
            <div>
              <div className="text-[10px] text-muted-foreground leading-tight">{stat.label}</div>
              <div className="text-xs font-semibold text-foreground">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentConditions;
