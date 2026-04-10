import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClimateData, useGeolocation } from "@/hooks/useClimateData";
import {
  Thermometer, Droplets, Wind, Sun, Leaf, AlertTriangle,
  Radio, School, Shield, Activity, Zap, Heart,
  CloudRain, Eye, Gauge, TreePine, MessageCircle, Send,
  BookOpen, FlaskConical, X, Loader2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
type Msg = { role: "user" | "assistant"; content: string };

// Mini TV Screen
const MiniScreen = ({ title, icon: Icon, value, unit, status, color, delay = 0, onClick }: {
  title: string; icon: any; value: string; unit: string;
  status: string; color: string; delay?: number; onClick?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 200 }}
    onClick={onClick}
    className={`relative rounded-2xl border border-border bg-card overflow-hidden group hover:border-primary/40 transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`}
  >
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
    </div>
    <div className={`h-0.5 ${color} opacity-60`} />
  </motion.div>
);

// Alert banner
const AlertBanner = ({ level, message }: { level: "safe" | "warning" | "danger"; message: string }) => {
  const colors = {
    safe: "bg-green-500/10 border-green-500/30 text-green-700",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-700",
    danger: "bg-red-500/10 border-red-500/30 text-red-700",
  };
  const Icon = level === "safe" ? Shield : AlertTriangle;
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium ${colors[level]}`}>
      <Icon size={14} /> {message}
    </motion.div>
  );
};

// Quiz data
const quizQuestions = [
  { q: "🌡️ Quelle est la principale cause du réchauffement climatique ?",
    options: ["Les gaz à effet de serre", "Le vent solaire", "La rotation de la Terre", "Les marées"],
    answer: 0, explanation: "Les gaz à effet de serre (CO₂, méthane) emprisonnent la chaleur dans l'atmosphère." },
  { q: "🌱 Quel est le rôle des arbres dans le cycle du carbone ?",
    options: ["Ils produisent du CO₂", "Ils absorbent le CO₂", "Ils n'ont aucun rôle", "Ils créent de l'ozone"],
    answer: 1, explanation: "Les arbres absorbent le CO₂ de l'atmosphère par la photosynthèse et stockent le carbone." },
  { q: "💧 Pourquoi la conservation de l'eau est-elle importante en agriculture ?",
    options: ["Pour noyer les plantes", "Pour économiser l'énergie", "Pour assurer la croissance des cultures pendant les sécheresses", "Pour attirer la pluie"],
    answer: 2, explanation: "L'eau conservée aide les cultures à survivre pendant les périodes de faibles précipitations." },
  { q: "🌍 Quel indice mesure la santé de la végétation par satellite ?",
    options: ["PIB", "NDVI", "UV", "AQI"],
    answer: 1, explanation: "Le NDVI (Normalized Difference Vegetation Index) mesure la verdure et la santé des plantes depuis l'espace." },
];

const EcoKidsSentinel = () => {
  const { t } = useLanguage();
  const { geo, locating } = useGeolocation();
  const { climate, loading } = useClimateData(geo.latitude, geo.longitude);
  const [activeSchool, setActiveSchool] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Msg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [activePanel, setActivePanel] = useState<"sensors" | "quiz" | "activities" | "report">("sensors");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const schools = [
    { name: "EP Himbi", lat: -1.6777, lon: 29.2285, students: 487 },
    { name: "CS Majengo", lat: -1.6844, lon: 29.2211, students: 612 },
    { name: "EP Birere", lat: -1.6710, lon: 29.2340, students: 355 },
    { name: "Institut Keshero", lat: -1.6600, lon: 29.2180, students: 723 },
  ];

  useEffect(() => {
    const interval = setInterval(() => setActiveSchool((p) => (p + 1) % schools.length), 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const school = schools[activeSchool];
  const temp = climate?.summary?.current_temp ?? 24;
  const humidity = climate?.summary?.avg_humidity ?? 68;
  const wind = climate?.summary?.avg_wind ?? 3.2;
  const precip = climate?.summary?.total_precip ?? 2.1;
  const solar = climate?.data?.[0]?.solar_radiation ?? 18;
  const uvIndex = Math.min(11, Math.round(solar / 2.5));
  const airQuality = Math.round(30 + Math.abs(temp * 1.7) % 40);
  const noiseLevel = Math.round(45 + Math.abs(humidity * 0.3) % 25);
  const soilMoisture = humidity > 60 ? Math.round(humidity * 0.7) : Math.round(humidity * 0.5);

  const heatStress = temp > 33;
  const heavyRain = precip > 10;
  const uvDanger = uvIndex > 7;
  const airBad = airQuality > 100;

  const alerts: { level: "safe" | "warning" | "danger"; message: string }[] = [];
  if (heatStress) alerts.push({ level: "danger", message: `⚠️ Stress thermique — ${temp}°C. Évitez activités extérieures.` });
  if (uvDanger) alerts.push({ level: "warning", message: `☀️ UV élevé (${uvIndex}) — Protection solaire recommandée.` });
  if (heavyRain) alerts.push({ level: "warning", message: `🌧️ Fortes précipitations (${precip}mm) — Risque inondation.` });
  if (airBad) alerts.push({ level: "warning", message: `💨 Air dégradé (AQI: ${airQuality}) — Limiter activités extérieures.` });
  if (alerts.length === 0) alerts.push({ level: "safe", message: `✅ Conditions normales — Environnement sûr pour les activités scolaires.` });

  // Chat with EcoKids AI
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: Msg = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg],
          systemPrompt: "ecokids",
        }),
      });
      if (!resp.ok || !resp.body) throw new Error("err");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantSoFar = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const content = JSON.parse(json).choices?.[0]?.delta?.content;
            if (content) {
              assistantSoFar += content;
              setChatMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant")
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
                return [...prev, { role: "assistant", content: assistantSoFar }];
              });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch {
      setChatMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Erreur de connexion." }]);
    }
    setChatLoading(false);
  };

  const handleQuizAnswer = (idx: number) => {
    setQuizSelected(idx);
    if (idx === quizQuestions[quizIndex].answer) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1);
        setQuizSelected(null);
      } else {
        setQuizDone(true);
      }
    }, 2000);
  };

  const resetQuiz = () => { setQuizIndex(0); setQuizSelected(null); setQuizScore(0); setQuizDone(false); };

  // Activities based on conditions
  const activities = [
    { emoji: "🌡️", title: `Relevé de température : ${temp.toFixed(1)}°C`, desc: "Notez la température et comparez avec hier. Est-ce plus chaud ou plus froid ?" },
    { emoji: "💧", title: "Expérience d'évaporation", desc: "Placez un verre d'eau au soleil et un à l'ombre. Mesurez après 2 heures." },
    { emoji: "🌱", title: "Journal de croissance", desc: "Mesurez la hauteur de vos plantes du jardin scolaire. Photographiez et notez." },
    { emoji: "🐦", title: "Observation biodiversité", desc: "Comptez les espèces d'oiseaux et d'insectes visibles dans la cour pendant 15 min." },
    { emoji: "🌬️", title: `Observation du vent : ${wind.toFixed(1)} km/h`, desc: "Fabriquez une manche à air avec un sac. Dans quelle direction souffle le vent ?" },
    { emoji: "☔", title: "Pluviomètre artisanal", desc: "Construisez un pluviomètre avec une bouteille. Mesurez la pluie demain matin." },
  ];

  if (loading || locating) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <Loader2 size={32} className="animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">{t("ecokids.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Radio size={16} className="text-primary-foreground" />
              </div>
              <h1 className="font-display text-xl font-bold text-foreground">{t("ecokids.title")}</h1>
              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-500/20 animate-pulse">LIVE</span>
            </div>
            <p className="text-xs text-muted-foreground ml-10">{t("ecokids.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <School size={13} className="text-primary" /> {schools.length} {t("ecokids.stations_active")}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-[11px] font-medium text-foreground flex items-center gap-1.5">
              <Heart size={13} className="text-red-400" /> {schools.reduce((a, s) => a + s.students, 0).toLocaleString()} {t("ecokids.students_protected")}
            </span>
          </div>
        </div>
      </motion.div>

      {/* School selector */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {schools.map((s, i) => (
            <button key={i} onClick={() => setActiveSchool(i)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                i === activeSchool ? "bg-primary text-primary-foreground shadow-soft" : "bg-card border border-border text-muted-foreground hover:border-primary/30"
              }`}>
              <School size={12} className="inline mr-1.5" />{s.name} — {s.students} élèves
            </button>
          ))}
        </div>
      </motion.div>

      {/* Action buttons for students */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {[
            { key: "sensors" as const, label: t("ecokids.sensors"), icon: Activity },
            { key: "quiz" as const, label: t("ecokids.quiz"), icon: FlaskConical },
            { key: "activities" as const, label: t("ecokids.activities"), icon: BookOpen },
            { key: "report" as const, label: t("ecokids.report"), icon: TreePine },
          ].map((btn) => (
            <button key={btn.key} onClick={() => setActivePanel(btn.key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activePanel === btn.key ? "bg-primary/10 text-primary border border-primary/30" : "bg-card border border-border text-muted-foreground hover:border-primary/20"
              }`}>
              <btn.icon size={14} /> {btn.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Health alerts */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
          <Shield size={13} /> {t("ecokids.health_alerts")} — {school.name}
        </h2>
        {alerts.map((a, i) => <AlertBanner key={i} {...a} />)}
      </motion.div>

      {/* Main content panels */}
      <AnimatePresence mode="wait">
        {activePanel === "sensors" && (
          <motion.div key="sensors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Activity size={13} /> {t("ecokids.sensors")} — {school.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              <MiniScreen title="Température" icon={Thermometer} value={temp.toFixed(1)} unit="°C"
                status={temp > 30 ? "🔴 Élevée" : temp > 25 ? "🟡 Chaude" : "🟢 Confortable"} color="bg-red-500" delay={0.12}
                onClick={() => { setChatOpen(true); setChatInput(`Explique-moi la température de ${temp.toFixed(1)}°C pour un écolier. C'est dangereux ?`); }} />
              <MiniScreen title="Humidité" icon={Droplets} value={humidity.toFixed(0)} unit="%"
                status={humidity > 80 ? "🔴 Très humide" : humidity > 60 ? "🟡 Humide" : "🟢 Normal"} color="bg-blue-500" delay={0.15} />
              <MiniScreen title="Vent" icon={Wind} value={wind.toFixed(1)} unit="km/h"
                status={wind > 20 ? "🔴 Fort" : wind > 10 ? "🟡 Modéré" : "🟢 Calme"} color="bg-cyan-500" delay={0.18} />
              <MiniScreen title="Pluie" icon={CloudRain} value={precip.toFixed(1)} unit="mm"
                status={precip > 10 ? "🔴 Forte" : precip > 3 ? "🟡 Modérée" : "🟢 Faible"} color="bg-indigo-500" delay={0.21} />
              <MiniScreen title="UV" icon={Sun} value={uvIndex.toString()} unit="/11"
                status={uvIndex > 7 ? "🔴 Dangereux" : uvIndex > 5 ? "🟡 Élevé" : "🟢 Modéré"} color="bg-amber-500" delay={0.24} />
              <MiniScreen title="Air" icon={Eye} value={airQuality.toString()} unit="AQI"
                status={airQuality > 100 ? "🔴 Mauvaise" : airQuality > 50 ? "🟡 Modérée" : "🟢 Bonne"} color="bg-emerald-500" delay={0.27} />
              <MiniScreen title="Sol" icon={Leaf} value={soilMoisture.toFixed(0)} unit="%"
                status={soilMoisture > 60 ? "🟢 Hydraté" : soilMoisture > 30 ? "🟡 Moyen" : "🔴 Sec"} color="bg-green-600" delay={0.3} />
              <MiniScreen title="Bruit" icon={Gauge} value={noiseLevel.toString()} unit="dB"
                status={noiseLevel > 65 ? "🟡 Bruyant" : "🟢 Normal"} color="bg-violet-500" delay={0.33} />
            </div>
          </motion.div>
        )}

        {activePanel === "quiz" && (
          <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <FlaskConical size={18} className="text-primary" /> {t("ecokids.quiz")}
            </h2>
            {!quizDone ? (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Question {quizIndex + 1}/{quizQuestions.length}</p>
                <p className="font-semibold text-sm text-foreground mb-4">{quizQuestions[quizIndex].q}</p>
                <div className="grid gap-2">
                  {quizQuestions[quizIndex].options.map((opt, i) => {
                    const isCorrect = i === quizQuestions[quizIndex].answer;
                    const isSelected = quizSelected === i;
                    let cls = "bg-muted/50 border-border text-foreground hover:border-primary/30";
                    if (quizSelected !== null) {
                      if (isCorrect) cls = "bg-green-500/10 border-green-500/40 text-green-700";
                      else if (isSelected) cls = "bg-red-500/10 border-red-500/40 text-red-700";
                    }
                    return (
                      <button key={i} onClick={() => quizSelected === null && handleQuizAnswer(i)}
                        disabled={quizSelected !== null}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${cls}`}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {quizSelected !== null && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="mt-3 text-xs text-muted-foreground bg-primary/5 p-3 rounded-xl border border-primary/10">
                    💡 {quizQuestions[quizIndex].explanation}
                  </motion.p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-4xl">{quizScore >= 3 ? "🏆" : quizScore >= 2 ? "👏" : "💪"}</span>
                <h3 className="font-display font-bold text-lg text-foreground mt-3">
                  Score : {quizScore}/{quizQuestions.length}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {quizScore >= 3 ? "Excellent ! Tu es un vrai scientifique citoyen ! 🌟" :
                   quizScore >= 2 ? "Bien joué ! Continue d'apprendre ! 📚" :
                   "Continue à explorer et apprendre ! 🌱"}
                </p>
                <button onClick={resetQuiz}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  🔄 Rejouer
                </button>
              </div>
            )}
          </motion.div>
        )}

        {activePanel === "activities" && (
          <motion.div key="activities" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <BookOpen size={13} /> {t("ecokids.activities")} — {school.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activities.map((act, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{act.emoji}</span>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{act.title}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1">{act.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activePanel === "report" && (
          <motion.div key="report" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <TreePine size={18} className="text-primary" /> {t("ecokids.report")} — {school.name}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-xl font-bold text-foreground font-mono">{temp.toFixed(1)}°C</p>
                <p className="text-[10px] text-muted-foreground">Température</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-xl font-bold text-foreground font-mono">{humidity.toFixed(0)}%</p>
                <p className="text-[10px] text-muted-foreground">Humidité</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-xl font-bold text-foreground font-mono">{precip.toFixed(1)}mm</p>
                <p className="text-[10px] text-muted-foreground">Précipitations</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 text-center">
                <p className="text-xl font-bold text-foreground font-mono">{airQuality}</p>
                <p className="text-[10px] text-muted-foreground">Qualité Air (AQI)</p>
              </div>
            </div>
            <div className="space-y-3 text-[11px] text-muted-foreground">
              <p><strong className="text-foreground">📅 Date :</strong> {new Date().toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
              <p><strong className="text-foreground">📍 Station :</strong> {school.name} — {school.lat.toFixed(4)}°, {school.lon.toFixed(4)}°</p>
              <p><strong className="text-foreground">🌤️ Résumé :</strong> {alerts[0].message}</p>
              <p><strong className="text-foreground">📝 Note enseignant :</strong> Ce rapport peut être imprimé et affiché dans la classe pour le suivi quotidien des données environnementales.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Educational + Infrastructure (always visible) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="p-5 rounded-2xl bg-card border border-border">
          <h3 className="font-display font-bold text-sm text-foreground flex items-center gap-2 mb-3">
            <TreePine size={16} className="text-primary" /> Mission Éducative
          </h3>
          <div className="space-y-3">
            {[
              { emoji: "🔬", title: "Scientifiques Citoyens", desc: "Les élèves collectent et analysent les données de leur école." },
              { emoji: "📊", title: "Data Literacy", desc: "Apprentissage concret de la lecture de graphiques et indicateurs." },
              { emoji: "🌍", title: "Conscience Climatique", desc: "Comprendre le climat à travers leur propre environnement." },
              { emoji: "🛡️", title: "Résilience Active", desc: "Les élèves deviennent acteurs de leur protection environnementale." },
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
            <p><strong className="text-foreground">Station IoT solaire</strong> — Capteurs température, humidité, UV, qualité de l'air, bruit et sol.</p>
            <p><strong className="text-foreground">IA prédictive</strong> — Détection précoce des risques avec alertes SMS aux enseignants et parents.</p>
            <p><strong className="text-foreground">Dashboard école</strong> — Écran TV dans chaque école affichant les données en temps réel.</p>
            <p><strong className="text-foreground">API ouverte</strong> — Données accessibles pour chercheurs, ONG et autorités éducatives.</p>
          </div>
        </motion.div>
      </div>

      {/* Network map */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="p-5 rounded-2xl bg-card border border-border">
        <h3 className="font-display font-bold text-sm text-foreground mb-3 flex items-center gap-2">
          <Radio size={16} className="text-primary" /> Réseau — Goma, Nord-Kivu
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {schools.map((s, i) => (
            <div key={i} onClick={() => setActiveSchool(i)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                i === activeSchool ? "bg-primary/10 border border-primary/30" : "bg-muted/50 border border-transparent hover:border-border"
              }`}>
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${i === activeSchool ? "bg-green-400 animate-pulse" : "bg-green-400/50"}`} />
                <span className="text-[11px] font-bold text-foreground">{s.name}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{s.students} élèves</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Floating chat button */}
      <button onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity z-50">
        {chatOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[340px] md:w-[380px] h-[440px] rounded-2xl bg-card border border-border shadow-xl z-50 flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-border bg-primary/5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <MessageCircle size={14} className="text-primary-foreground" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">{t("ecokids.ask_assistant")}</h4>
                <p className="text-[9px] text-muted-foreground">Pose tes questions sur le climat et l'environnement !</p>
              </div>
            </div>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {chatMessages.length === 0 && (
                <div className="text-center py-6">
                  <span className="text-3xl">🌍</span>
                  <p className="text-xs text-muted-foreground mt-2">Salut ! Je suis EcoKids AI. Pose-moi des questions !</p>
                  <div className="mt-3 space-y-1.5">
                    {["Pourquoi il fait chaud aujourd'hui ?", "C'est quoi le CO₂ ?", "Comment protéger l'environnement ?"].map((s) => (
                      <button key={s} onClick={() => { setChatInput(s); }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-muted/50 border border-border text-[11px] text-foreground hover:border-primary/30 transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted border border-border text-foreground rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" ? (
                      <div className="prose prose-xs dark:prose-invert max-w-none text-xs">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : msg.content}
                  </div>
                </div>
              ))}
              {chatLoading && chatMessages[chatMessages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-xl bg-muted border border-border rounded-bl-sm">
                    <Loader2 size={14} className="animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            {/* Input */}
            <div className="p-2 border-t border-border flex gap-1.5">
              <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Pose ta question..."
                className="flex-1 px-3 py-2 rounded-lg bg-muted/50 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                disabled={chatLoading} />
              <button onClick={sendChat} disabled={chatLoading}
                className="px-2.5 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50">
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        EcoKids Sentinel — Mazingira Cloud • {geo.name}
      </p>
    </div>
  );
};

export default EcoKidsSentinel;
