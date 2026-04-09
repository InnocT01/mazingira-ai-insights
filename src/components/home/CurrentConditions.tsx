import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Cloud, Droplets, Wind, Thermometer, Eye, Gauge, Sunrise } from "lucide-react";

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

  // Derived metrics
  const dewPoint = Math.round((temp - ((100 - humidity) / 5)) * 10) / 10;
  const heatIndex = temp > 27 ? Math.round((temp + humidity * 0.05) * 10) / 10 : temp;
  const uvIndex = solar ? Math.min(Math.round(solar / 2.5), 12) : 5;
  const visibility = humidity > 90 ? "5 km" : humidity > 70 ? "8 km" : "10+ km";
  const pressure = Math.round(1013 - (temp - 20) * 0.5 + precip * 0.1);

  return (
    <div className="p-5 rounded-2xl bg-gradient-to-br from-card to-card/80 border border-border shadow-soft h-full">
      <div className="flex items-start gap-5">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5">
          <WeatherIcon size={48} className="text-accent" />
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
            {t("home.feels_like")} {heatIndex.toFixed(0)}° • Min {s?.min_temp?.toFixed(1)}° / Max {s?.max_temp?.toFixed(1)}°
          </p>
        </div>
      </div>

      {/* Expanded stats grid */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {[
          { icon: Wind, label: t("home.wind"), value: `${wind.toFixed(1)} m/s` },
          { icon: Droplets, label: t("home.humidity"), value: `${humidity.toFixed(0)}%` },
          { icon: Thermometer, label: "Point de rosée", value: `${dewPoint}°C` },
          { icon: Sun, label: t("home.solar"), value: `${solar.toFixed(1)} MJ/m²` },
          { icon: Eye, label: t("home.visibility"), value: visibility },
          { icon: Gauge, label: t("home.pressure"), value: `${pressure} hPa` },
          { icon: Thermometer, label: "Indice UV", value: `${uvIndex}/12` },
          { icon: Droplets, label: t("home.precip_today"), value: `${precip.toFixed(1)} mm` },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
            <stat.icon size={14} className="text-primary/70 flex-shrink-0" />
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
