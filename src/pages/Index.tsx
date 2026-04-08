import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Cloud, Droplets, Wind, Sun, Thermometer, Eye, ArrowDown, ArrowUp, Gauge, Leaf } from "lucide-react";
import { useState, useEffect } from "react";

const Index = () => {
  const { t } = useLanguage();
  const [climateData, setClimateData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClimateData();
  }, []);

  const fetchClimateData = async () => {
    try {
      const resp = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/climate-data`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
        }
      );
      const data = await resp.json();
      if (data && !data.error) setClimateData(data);
    } catch (err) {
      console.error("Climate data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentTemp = climateData?.temperature?.values?.[climateData.temperature.values.length - 1] ?? 24;
  const currentHumidity = climateData?.humidity?.values?.[climateData.humidity.values.length - 1] ?? 78;
  const currentPrecip = climateData?.precipitation?.total ?? 12;
  const avgTemp = climateData?.temperature?.average ?? 23;

  // Simulated hourly data for the visual
  const hours = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
  const hourlyTemps = [18, 20, 23, 25, 26, 25, 22, 19];
  const hourlyIcons = [Cloud, Sun, Sun, Sun, Sun, Cloud, Cloud, Cloud];

  // 7-day forecast
  const forecast = [
    { day: t("day.mon"), high: 25, low: 17, icon: Sun },
    { day: t("day.tue"), high: 24, low: 17, icon: Cloud },
    { day: t("day.wed"), high: 23, low: 16, icon: Droplets },
    { day: t("day.thu"), high: 24, low: 17, icon: Cloud },
    { day: t("day.fri"), high: 25, low: 18, icon: Sun },
    { day: t("day.sat"), high: 24, low: 17, icon: Cloud },
    { day: t("day.sun"), high: 23, low: 16, icon: Droplets },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Location header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground">
          Goma, North Kivu, RDC
        </h1>
        <p className="text-sm text-muted-foreground">{t("home.tagline")}</p>
      </motion.div>

      {/* Current conditions card - MSN style */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-4"
      >
        {/* Main conditions */}
        <div className="lg:col-span-2 p-6 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-6">
            <div>
              <Sun size={56} className="text-accent" />
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-6xl font-display font-bold text-foreground">{Math.round(currentTemp)}</span>
                <span className="text-2xl text-muted-foreground">°C</span>
              </div>
              <p className="text-lg text-foreground font-medium mt-1">{t("home.partly_sunny")}</p>
              <p className="text-sm text-muted-foreground mt-1">{t("home.feels_like")} {Math.round(currentTemp + 2)}°</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {t("home.weather_desc")}
          </p>

          {/* Quick stats row */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Wind size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">{t("home.wind")}</div>
                <div className="text-sm font-semibold text-foreground">3 km/h</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">{t("home.humidity")}</div>
                <div className="text-sm font-semibold text-foreground">{currentHumidity}%</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">{t("home.visibility")}</div>
                <div className="text-sm font-semibold text-foreground">4 km</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-muted-foreground" />
              <div>
                <div className="text-xs text-muted-foreground">{t("home.pressure")}</div>
                <div className="text-sm font-semibold text-foreground">1023 hPa</div>
              </div>
            </div>
          </div>
        </div>

        {/* Agriculture card */}
        <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-4">
            <Leaf size={18} className="text-primary" />
            <h3 className="font-display font-semibold text-sm text-foreground">{t("home.agri_conditions")}</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("home.soil_moisture")}</span>
                <span className="font-medium text-foreground">72%</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "72%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">NDVI</span>
                <span className="font-medium text-foreground">0.68</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{t("home.precip_7d")}</span>
                <span className="font-medium text-foreground">{currentPrecip} mm</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full bg-earth-sky" style={{ width: `${Math.min(currentPrecip * 2, 100)}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-primary font-medium">{t("home.agri_tip")}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 7-day forecast - horizontal cards like MSN */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="font-display font-semibold text-sm text-foreground mb-3">{t("home.forecast_7d")}</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {forecast.map((day, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[100px] p-3 rounded-xl border text-center transition-all ${
                i === 0 ? "bg-primary/10 border-primary/30" : "bg-card border-border"
              }`}
            >
              <div className="text-xs font-medium text-muted-foreground">{day.day}</div>
              <day.icon size={28} className="mx-auto my-2 text-accent" />
              <div className="flex items-center justify-center gap-1">
                <span className="text-sm font-bold text-foreground">{day.high}°</span>
                <span className="text-xs text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Hourly overview */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <h2 className="font-display font-semibold text-sm text-foreground mb-3">{t("home.hourly")}</h2>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {hours.map((hour, i) => {
              const Icon = hourlyIcons[i];
              return (
                <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[60px]">
                  <span className="text-xs text-muted-foreground">{hour}</span>
                  <Icon size={22} className="text-accent" />
                  <span className="text-sm font-semibold text-foreground">{hourlyTemps[i]}°</span>
                </div>
              );
            })}
          </div>

          {/* Simple bar chart */}
          <div className="mt-4 flex items-end gap-2 h-20">
            {hourlyTemps.map((temp, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full rounded-t-md bg-primary/20"
                  style={{ height: `${((temp - 15) / 15) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom info cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">{t("home.uv_index")}</div>
          <div className="text-2xl font-bold text-foreground">6</div>
          <div className="text-xs text-accent font-medium">{t("home.uv_high")}</div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">{t("home.sunrise")}</div>
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-1">
                <ArrowUp size={12} className="text-accent" />
                <span className="text-sm font-semibold text-foreground">06:12</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDown size={12} className="text-primary" />
                <span className="text-sm font-semibold text-foreground">18:24</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="text-xs text-muted-foreground mb-1">{t("home.air_quality")}</div>
          <div className="text-2xl font-bold text-primary">42</div>
          <div className="text-xs text-primary font-medium">{t("home.air_good")}</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
