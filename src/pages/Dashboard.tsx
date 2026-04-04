import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Map, Filter, AlertTriangle, Download } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import CongoMap from "@/components/CongoMap";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("dashboard.badge")}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{t("dashboard.title")}</h1>
            <p className="mt-2 text-muted-foreground text-sm">{t("dashboard.subtitle")}</p>
          </motion.div>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Map, label: "Interactive Map", desc: "Satellite layers" },
              { icon: Filter, label: "Data Filters", desc: "Region, crop, risk" },
              { icon: AlertTriangle, label: "Active Alerts", desc: "3 drought warnings" },
              { icon: Download, label: "Export Data", desc: "CSV & API" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="p-4 rounded-xl bg-card border border-border"
              >
                <item.icon size={20} className="text-primary mb-2" />
                <div className="font-display font-semibold text-sm text-foreground">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 rounded-2xl bg-card border border-border overflow-hidden"
            style={{ height: "500px" }}
          >
            <CongoMap />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
