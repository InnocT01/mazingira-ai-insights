import { ClimateResponse } from "@/hooks/useClimateData";
import { useLanguage } from "@/contexts/LanguageContext";
import { Layers, Droplets, Thermometer, Leaf, Zap } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const SoilDashboard = ({ climate }: Props) => {
  const { t } = useLanguage();
  const s = climate?.summary;
  const avgTemp = s?.avg_temp ?? 22;
  const totalPrecip = s?.total_precip ?? 80;
  const avgHumidity = s?.avg_humidity ?? 70;

  // Derived soil metrics from climate data
  const soilMoisture = Math.min(Math.round(avgHumidity * 0.82 + totalPrecip * 0.08), 100);
  const soilTemp = Math.round((avgTemp - 2) * 10) / 10;
  const evapotranspiration = Math.round((avgTemp * 0.18 + (100 - avgHumidity) * 0.05) * 10) / 10;
  const waterBalance = Math.round((totalPrecip - evapotranspiration * 30) * 10) / 10;
  const organicMatter = avgTemp > 20 && totalPrecip > 60 ? 4.2 : 3.1;
  const ph = totalPrecip > 120 ? 5.8 : totalPrecip > 60 ? 6.2 : 6.8;

  const metrics = [
    { icon: Droplets, label: "Humidité sol", value: `${soilMoisture}%`, sub: soilMoisture > 60 ? "Adéquat" : "Sec", good: soilMoisture > 40 },
    { icon: Thermometer, label: "Temp. sol (10cm)", value: `${soilTemp}°C`, sub: soilTemp > 18 ? "Chaud" : "Frais", good: soilTemp > 15 },
    { icon: Zap, label: "Évapotranspiration", value: `${evapotranspiration} mm/j`, sub: evapotranspiration > 4 ? "Élevée" : "Normale", good: evapotranspiration < 5 },
    { icon: Layers, label: "pH estimé", value: `${ph}`, sub: ph > 6 && ph < 7 ? "Optimal" : "À corriger", good: ph > 5.5 && ph < 7.5 },
    { icon: Leaf, label: "Matière organique", value: `${organicMatter}%`, sub: organicMatter > 3.5 ? "Riche" : "Moyen", good: organicMatter > 3 },
    { icon: Droplets, label: "Bilan hydrique", value: `${waterBalance > 0 ? "+" : ""}${waterBalance} mm`, sub: waterBalance > 0 ? "Excédent" : "Déficit", good: waterBalance > -20 },
  ];

  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-soft h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Layers size={16} className="text-primary" />
        </div>
        <h3 className="font-display font-semibold text-sm text-foreground">Tableau Pédologique</h3>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {metrics.map((m) => (
          <div key={m.label} className="p-3 rounded-xl bg-muted/30 border border-border/50">
            <div className="flex items-center gap-1.5 mb-1">
              <m.icon size={12} className="text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">{m.label}</span>
            </div>
            <div className="text-sm font-bold text-foreground">{m.value}</div>
            <div className={`text-[10px] font-medium ${m.good ? "text-primary" : "text-accent"}`}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoilDashboard;
