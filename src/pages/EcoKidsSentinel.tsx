import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClimateData, useGeolocation } from "@/hooks/useClimateData";
import {
  Thermometer, Droplets, Wind, Sun, Leaf, AlertTriangle,
  Radio, School, Shield, Activity, Zap, Heart,
  CloudRain, Eye, Gauge, TreePine
} from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// Mini TV Screen component — styled like a retro-futuristic IoT display
const MiniScreen = ({ title, icon: Icon, value, unit, status, color, delay = 0, children }: {
  title: string; icon: any; value: string; unit: string;
  status: string; color: string; delay?: number; children?: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    className="relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/40 transition-all duration-300"
  >
    {/* Screen bezel */}
    <div className="absolute top-2 right-2 flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
      <span className="text-[8px] text-muted-foreground font-mono">LIVE</span>
    </div>
    <div className="p-4 pb-3">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={16} className="text-white" />
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-foreground font-mono">{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1.5">{status}</p>
      {children}
    </div>
    {/* Bottom glow bar */}
    <div className={`h-0.5 ${color} opacity-60`} />
  </motion.div>
);

// Alert banner component
const AlertBanner = ({ level, message }: { level: "safe" | "warning" | "danger"; message: string }) => {
  const colors = {
    safe: "bg-green-500/10 border-green-500/30 text-green-700",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    danger: "bg-red-500/10 border-red-500/30 text-red-700",
  };
  const icons = { safe: Shield, warning: AlertTriangle, danger: AlertTriangle };
  const Icon = icons[level];
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${colors[level]}`}
    >
      <Icon size={14} />
      {message}
    </motion.div>
  );
};

const EcoKidsSentinel = () => {
  const { t } = useLanguage();
  const { geo, locating } = useGeolocation();
  const { climate, loading } = useClimateData(geo.latitude, geo.longitude);
  const [activeSchool, setActiveSchool] = useState(0);

  // Simulated schools
  const schools = [
    { name: "EP Himbi", lat: -1.6777, lon: 29.2285, students: 487 },
    { name: "CS Majengo", lat: -1.6844, lon: 29.2211, students: 612 },
    { name: "EP Birere", lat: -1.6710, lon: 29.2340, students: 355 },
    { name: "Institut Keshero", lat: -1.6600, lon: 29.2180, students: 723 },
  ];

  // Rotate schools every 8s
  useEffect(() => {
    const interval = setInterval(() => setActiveSchool((p) => (p + 1) % schools.length), 8000);
    return () => clearInterval(interval);
  }, []);

  const school = schools[activeSchool];

  if (loading || locating) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Connexion aux stations EcoKids...</p>
        </div>
      </div>
    );
  }

  // Derive sensor values from real climate data
  const temp = climate?.temperature ?? 24;
  const humidity = climate?.humidity ?? 68;
  const wind = climate?.windSpeed ?? 3.2;
  const precip = climate?.precipitation ?? 2.1;
  const solar = climate?.solarRadiation ?? 18;
  const uvIndex = Math.min(11, Math.round(solar / 2.5));
  const airQuality = Math.round(30 + Math.random() * 40); // AQI simulation
  const noiseLevel = Math.round(45 + Math.random() * 25);
  const soilMoisture = climate?.soilMoisture ?? 42;

  // Health alerts
  const heatStress = temp > 33;
  const heavyRain = precip > 10;
  const uvDanger = uvIndex > 7;
  const airBad = airQuality > 100;

  const alerts: { level: "safe" | "warning" | "danger"; message: string }[] = [];
  if (heatStress) alerts.push({ level: "danger", message: `⚠️ Stress thermique — ${temp}°C détecté. Évitez les activités extérieures prolongées.` });
  if (uvDanger) alerts.push({ level: "warning", message: `☀️ UV élevé (${uvIndex}) — Protection solaire recommandée pour les élèves.` });
  if (heavyRain) alerts.push({ level: "warning", message: `🌧️ Fortes précipitations (${precip}mm) — Risque d'inondation autour de l'école.` });
  if (airBad) alerts.push({ level: "warning", message: `💨 Qualité de l'air dégradée (AQI: ${airQuality}) — Limiter les activités extérieures.` });
  if (alerts.length === 0) alerts.push({ level: "safe", message: `✅ Conditions normales — Environnement sûr pour toutes les activités scolaires.` });

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Radio size={16} className="text-primary-foreground" />
              </div>
              <h1 className="font-display text-xl font-bold text-foreground">EcoKids Sentinel</h1>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-500/20 animate-pulse">
                LIVE
              </span>
            </div>
            <p className="text-xs text-muted-foreground ml-10">
              Observatoire climatique intelligent — Transformer chaque cour d'école en station de résilience
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <School size={13} className="text-primary" /> {schools.length} stations actives
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <Heart size={13} className="text-red-400" /> {schools.reduce((a, s) => a + s.students, 0).toLocaleString()} élèves protégés
            </span>
          </div>
        </div>
      </motion.div>

      {/* School selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {schools.map((s, i) => (
            <button
              key={i}
              onClick={() => setActiveSchool(i)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                i === activeSchool
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/30"
              }`}
            >
              <School size={12} className="inline mr-1.5" />
              {s.name} — {s.students} élèves
            </button>
          ))}
        </div>
      </motion.div>

      {/* Health alerts */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="space-y-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Shield size={13} /> Alertes Santé en Temps Réel — {school.name}
        </h2>
        {alerts.map((a, i) => <AlertBanner key={i} {...a} />)}
      </motion.div>

      {/* Mini TV screens grid */}
      <div>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Activity size={13} /> Capteurs IoT — Station {school.name}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <MiniScreen title="Température" icon={Thermometer} value={temp.toFixed(1)} unit="°C"
            status={temp > 30 ? "🔴 Élevée — Attention" : temp > 25 ? "🟡 Chaude" : "🟢 Confortable"}
            color="bg-red-500" delay={0.12} />
          <MiniScreen title="Humidité" icon={Droplets} value={humidity.toFixed(0)} unit="%"
            status={humidity > 80 ? "🔴 Très humide" : humidity > 60 ? "🟡 Humide" : "🟢 Normal"}
            color="bg-blue-500" delay={0.15} />
          <MiniScreen title="Vent" icon={Wind} value={wind.toFixed(1)} unit="km/h"
            status={wind > 20 ? "🔴 Fort" : wind > 10 ? "🟡 Modéré" : "🟢 Calme"}
            color="bg-cyan-500" delay={0.18} />
          <MiniScreen title="Pluie du jour" icon={CloudRain} value={precip.toFixed(1)} unit="mm"
            status={precip > 10 ? "🔴 Forte pluie" : precip > 3 ? "🟡 Pluie modérée" : "🟢 Faible"}
            color="bg-indigo-500" delay={0.21} />
          <MiniScreen title="Indice UV" icon={Sun} value={uvIndex.toString()} unit="/11"
            status={uvIndex > 7 ? "🔴 Dangereux" : uvIndex > 5 ? "🟡 Élevé — crème solaire" : "🟢 Modéré"}
            color="bg-amber-500" delay={0.24} />
          <MiniScreen title="Qualité Air" icon={Eye} value={airQuality.toString()} unit="AQI"
            status={airQuality > 100 ? "🔴 Mauvaise" : airQuality > 50 ? "🟡 Modérée" : "🟢 Bonne"}
            color="bg-emerald-500" delay={0.27} />
          <MiniScreen title="Humidité Sol" icon={Leaf} value={soilMoisture.toFixed(0)} unit="%"
            status={soilMoisture > 60 ? "🟢 Bien hydraté" : soilMoisture > 30 ? "🟡 Moyen" : "🔴 Sec"}
            color="bg-green-600" delay={0.3} />
          <MiniScreen title="Bruit" icon={Gauge} value={noiseLevel.toString()} unit="dB"
            status={noiseLevel > 65 ? "🟡 Bruyant" : "🟢 Normal"}
            color="bg-violet-500" delay={0.33} />
        </div>
      </div>

      {/* Educational impact + Concept */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <TreePine size={16} className="text-primary" /> Mission Éducative
          </h3>
          <div className="space-y-3">
            {[
              { emoji: "🔬", title: "Scientifiques Citoyens", desc: "Les élèves collectent, analysent et interprètent les données environnementales de leur école." },
              { emoji: "📊", title: "Data Literacy", desc: "Apprentissage concret de la lecture de graphiques, tendances et indicateurs climatiques." },
              { emoji: "🌍", title: "Conscience Climatique", desc: "Comprendre les changements environnementaux à travers leur propre environnement scolaire." },
              { emoji: "🛡️", title: "Résilience Active", desc: "Les élèves deviennent acteurs de leur propre protection face aux risques environnementaux." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-lg">{item.emoji}</span>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <Zap size={16} className="text-primary" /> Infrastructure Open-Source
          </h3>
          <div className="space-y-3 text-[11px] text-muted-foreground">
            <p>
              <strong className="text-foreground">Station IoT solaire</strong> — Capteurs température, humidité, UV, qualité de l'air, 
              bruit et sol. Alimentée par énergie solaire, connectée en LoRaWAN/4G.
            </p>
            <p>
              <strong className="text-foreground">IA prédictive Mazingira</strong> — Algorithmes de détection précoce des risques 
              (vagues de chaleur, inondations, pollution) avec alertes SMS aux enseignants et parents.
            </p>
            <p>
              <strong className="text-foreground">Dashboard école</strong> — Écran TV dans chaque école affichant les données 
              en temps réel, les alertes et les activités éducatives suggérées.
            </p>
            <p>
              <strong className="text-foreground">API ouverte</strong> — Toutes les données sont accessibles via API REST 
              pour les chercheurs, ONG et autorités éducatives.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 text-[10px] text-primary font-semibold">
            <Radio size={12} className="animate-pulse" />
            Données mises à jour toutes les 5 minutes
          </div>
        </motion.div>
      </div>

      {/* Station map placeholder */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="p-5 rounded-2xl bg-card border border-border">
        <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <Radio size={16} className="text-primary" /> Réseau de Stations — Goma, Nord-Kivu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {schools.map((s, i) => (
            <div
              key={i}
              onClick={() => setActiveSchool(i)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                i === activeSchool
                  ? "bg-primary/10 border border-primary/30"
                  : "bg-muted/50 border border-transparent hover:border-border"
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${i === activeSchool ? "bg-green-400 animate-pulse" : "bg-green-400/50"}`} />
                <span className="text-[11px] font-bold text-foreground">{s.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{s.students} élèves • {s.lat.toFixed(4)}°, {s.lon.toFixed(4)}°</p>
            </div>
          ))}
        </div>
      </motion.div>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        EcoKids Sentinel — Mazingira Cloud • Données capteurs IoT simulées en temps réel • {geo.name}
      </p>
    </div>
  );
};

export default EcoKidsSentinel;
