import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Leaf, Droplets, Thermometer, TrendingUp, FileText, AlertTriangle } from "lucide-react";

const ndviData = [
  { month: "Jan", ndvi: 0.42 }, { month: "Feb", ndvi: 0.45 },
  { month: "Mar", ndvi: 0.51 }, { month: "Apr", ndvi: 0.58 },
  { month: "May", ndvi: 0.62 }, { month: "Jun", ndvi: 0.55 },
  { month: "Jul", ndvi: 0.48 }, { month: "Aug", ndvi: 0.52 },
  { month: "Sep", ndvi: 0.59 }, { month: "Oct", ndvi: 0.64 },
  { month: "Nov", ndvi: 0.61 }, { month: "Dec", ndvi: 0.57 },
];

const rainfallData = [
  { month: "Jan", rainfall: 120 }, { month: "Feb", rainfall: 95 },
  { month: "Mar", rainfall: 150 }, { month: "Apr", rainfall: 180 },
  { month: "May", rainfall: 160 }, { month: "Jun", rainfall: 80 },
  { month: "Jul", rainfall: 45 }, { month: "Aug", rainfall: 60 },
  { month: "Sep", rainfall: 110 }, { month: "Oct", rainfall: 170 },
  { month: "Nov", rainfall: 190 }, { month: "Dec", rainfall: 140 },
];

const soilData = [
  { name: "Nitrogen", value: 35, color: "hsl(152, 55%, 28%)" },
  { name: "Phosphorus", value: 25, color: "hsl(205, 60%, 40%)" },
  { name: "Potassium", value: 20, color: "hsl(38, 80%, 55%)" },
  { name: "Organic Matter", value: 20, color: "hsl(142, 50%, 22%)" },
];

const metrics = [
  { icon: Leaf, label: "NDVI Index", value: "0.64", change: "+5.2%", color: "text-primary" },
  { icon: Droplets, label: "Soil Moisture", value: "42%", change: "+3.1%", color: "text-secondary" },
  { icon: Thermometer, label: "Avg. Temperature", value: "24°C", change: "-0.8°C", color: "text-accent" },
  { icon: TrendingUp, label: "Yield Forecast", value: "3.2 t/ha", change: "+12%", color: "text-primary" },
];

const alerts = [
  { type: "warning", message: "Drought risk increasing in Masisi territory — next 14 days" },
  { type: "info", message: "Optimal planting window for cassava in North Kivu: Apr 10-25" },
  { type: "warning", message: "Soil pH below optimal range in sector 3 — lime application recommended" },
];

const PremiumDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">Premium</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{t("premium.title")}</h1>
            <p className="mt-2 text-muted-foreground text-sm">
              {t("premium.subtitle")} — {user?.email}
            </p>
          </motion.div>

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border"
              >
                <m.icon size={20} className={`${m.color} mb-2`} />
                <div className="font-display font-bold text-2xl text-foreground">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
                <div className="text-xs text-primary mt-1">{m.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">NDVI Vegetation Index</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={ndviData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <Tooltip />
                  <Line type="monotone" dataKey="ndvi" stroke="hsl(152, 55%, 28%)" strokeWidth={2} dot={{ fill: "hsl(152, 55%, 28%)" }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">Monthly Rainfall (mm)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={rainfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(150, 15%, 88%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(160, 10%, 45%)" />
                  <Tooltip />
                  <Bar dataKey="rainfall" fill="hsl(205, 60%, 40%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Soil + Alerts */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold text-foreground mb-4">Soil Composition</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={soilData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {soilData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="p-6 rounded-2xl bg-card border border-border"
            >
              <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertTriangle size={18} className="text-accent" />
                Alerts & Recommendations
              </h3>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg border text-sm ${
                      alert.type === "warning"
                        ? "border-accent/30 bg-accent/5 text-foreground"
                        : "border-primary/30 bg-primary/5 text-foreground"
                    }`}
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <FileText size={16} /> Generate PDF Report
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PremiumDashboard;
