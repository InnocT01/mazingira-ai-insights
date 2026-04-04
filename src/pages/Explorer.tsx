import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Database, Search, FileDown, Table } from "lucide-react";

const Explorer = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-20">
      <div className="container py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Data Explorer</span>
          <h1 className="mt-2 font-display text-3xl font-bold text-foreground">Explore Datasets</h1>
          <p className="mt-2 text-muted-foreground text-sm">Browse, filter, and download environmental datasets.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 flex gap-3"
        >
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search datasets (e.g., NDVI, rainfall, soil moisture...)"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-card border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </motion.div>

        <div className="mt-8 grid gap-4">
          {[
            { name: "NDVI Index — North Kivu", type: "Satellite", size: "12.4 MB", updated: "2 hours ago" },
            { name: "Rainfall Data — Congo Basin", type: "Climate", size: "8.1 MB", updated: "1 day ago" },
            { name: "Soil Moisture — Eastern DRC", type: "Field Data", size: "3.7 MB", updated: "3 days ago" },
            { name: "Temperature Anomalies 2024", type: "Climate", size: "15.2 MB", updated: "1 week ago" },
            { name: "Crop Performance — Goma Region", type: "Agriculture", size: "5.6 MB", updated: "2 days ago" },
          ].map((dataset, i) => (
            <motion.div
              key={dataset.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Table size={18} className="text-primary" />
                </div>
                <div>
                  <div className="font-display font-semibold text-sm text-foreground">{dataset.name}</div>
                  <div className="text-xs text-muted-foreground">{dataset.type} · {dataset.size} · Updated {dataset.updated}</div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <FileDown size={18} className="text-primary" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Explorer;
