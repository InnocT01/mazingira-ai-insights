import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Map, Filter, AlertTriangle, Download } from "lucide-react";

const Dashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Open Data</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Public Dashboard</h1>
          <p className="mt-2 text-muted-foreground text-sm">Explore real-time environmental data across the Congo Basin.</p>
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

        {/* Map placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 rounded-2xl bg-card border border-border overflow-hidden"
          style={{ height: "500px" }}
        >
          <div className="w-full h-full flex items-center justify-center bg-earth-deep/5">
            <div className="text-center">
              <Map size={48} className="mx-auto text-primary/30 mb-3" />
              <p className="text-muted-foreground font-display font-semibold">Interactive Map</p>
              <p className="text-xs text-muted-foreground mt-1">Satellite imagery, NDVI, rainfall & climate data</p>
              <p className="text-xs text-primary mt-2">Coming soon — connect a mapping API to activate</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Dashboard;
