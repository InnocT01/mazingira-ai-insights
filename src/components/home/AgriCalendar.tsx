import { ClimateResponse } from "@/hooks/useClimateData";
import { Calendar, Sprout, CloudRain, Sun as SunIcon, Scissors } from "lucide-react";

interface Props {
  climate: ClimateResponse | null;
}

const AgriCalendar = ({ climate }: Props) => {
  const month = new Date().getMonth(); // 0-11
  const s = climate?.summary;
  const avgTemp = s?.avg_temp ?? 22;
  const totalPrecip = s?.total_precip ?? 80;

  // Season determination for tropical DRC
  const isRainySeason = [1, 2, 3, 4, 8, 9, 10, 11].includes(month);
  const seasonName = isRainySeason ? "Saison des pluies" : "Saison sèche";

  const activities = [
    {
      icon: Sprout,
      activity: "Semis recommandés",
      crops: avgTemp > 18
        ? "Manioc, Maïs, Haricots, Arachides"
        : "Pomme de terre, Pois, Soja",
      timing: isRainySeason ? "✅ Période idéale" : "⏳ Attendre les pluies",
      ok: isRainySeason,
    },
    {
      icon: CloudRain,
      activity: "Irrigation",
      crops: totalPrecip > 80
        ? "Non nécessaire — pluies suffisantes"
        : "Irriguer cultures maraîchères, pépinières",
      timing: totalPrecip > 80 ? "🌧️ Eau abondante" : "💧 Irrigation requise",
      ok: totalPrecip > 80,
    },
    {
      icon: Scissors,
      activity: "Récolte",
      crops: "Patate douce (4 mois), Haricots (3 mois), Maïs (3-4 mois)",
      timing: "📅 Selon date de semis",
      ok: true,
    },
    {
      icon: SunIcon,
      activity: "Protection des cultures",
      crops: avgTemp > 25
        ? "Paillage recommandé — forte chaleur"
        : "Surveillance maladie fongique si humidité élevée",
      timing: avgTemp > 25 ? "☀️ Chaleur intense" : "🌿 Conditions modérées",
      ok: avgTemp < 30,
    },
  ];

  return (
    <div className="p-5 rounded-2xl bg-card border border-border shadow-soft h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-accent/10">
            <Calendar size={16} className="text-accent" />
          </div>
          <h3 className="font-display font-semibold text-sm text-foreground">Calendrier Agricole</h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
          {seasonName}
        </span>
      </div>

      <div className="space-y-3">
        {activities.map((a, i) => (
          <div key={i} className={`p-3 rounded-xl border ${a.ok ? "border-primary/20 bg-primary/5" : "border-accent/20 bg-accent/5"}`}>
            <div className="flex items-start gap-2.5">
              <div className={`p-1 rounded-md ${a.ok ? "bg-primary/10" : "bg-accent/10"}`}>
                <a.icon size={14} className={a.ok ? "text-primary" : "text-accent"} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{a.activity}</span>
                  <span className="text-[10px] text-muted-foreground">{a.timing}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{a.crops}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgriCalendar;
