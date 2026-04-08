import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Database, Download, Users, FileText, BarChart3, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Contribution {
  id: string;
  title: string;
  description: string | null;
  data_type: string;
  region: string | null;
  format: string | null;
  status: string;
  download_count: number | null;
  created_at: string;
}

const satelliteDatasets = [
  { name: "NDVI — Vegetation Index", source: "Copernicus Sentinel-2", region: "North Kivu", updated: "Daily", format: "GeoTIFF" },
  { name: "Soil Moisture", source: "NASA SMAP", region: "DRC National", updated: "3-day", format: "NetCDF" },
  { name: "Rainfall Estimates", source: "NASA POWER / CHIRPS", region: "Great Lakes", updated: "Daily", format: "CSV" },
  { name: "Land Surface Temperature", source: "MODIS Terra", region: "DRC National", updated: "Daily", format: "HDF5" },
  { name: "Deforestation Alerts", source: "Global Forest Watch", region: "Congo Basin", updated: "Weekly", format: "GeoJSON" },
  { name: "Crop Health Index", source: "Sentinel-2 MSAVI", region: "South Kivu", updated: "5-day", format: "GeoTIFF" },
];

const OpenData = () => {
  const { t } = useLanguage();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"satellite" | "community">("satellite");

  useEffect(() => {
    loadContributions();
  }, []);

  const loadContributions = async () => {
    const { data } = await supabase
      .from("contributions")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false });
    if (data) setContributions(data);
    setLoading(false);
  };

  const tabs = [
    { key: "satellite" as const, label: t("opendata.tab_satellite"), icon: Database },
    { key: "community" as const, label: t("opendata.tab_community"), icon: Users },
  ];

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-xl font-bold text-foreground">{t("opendata.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("opendata.subtitle")}</p>
      </motion.div>

      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-[1px] transition-colors ${
              activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "satellite" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {satelliteDatasets.map((ds, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 size={18} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{ds.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {ds.source} · {ds.region} · {ds.updated}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{ds.format}</span>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Download size={15} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {activeTab === "community" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-primary" size={24} />
            </div>
          ) : contributions.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">{t("opendata.no_community")}</p>
            </div>
          ) : (
            contributions.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-foreground">{c.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {c.data_type} · {c.region || "DRC"} · {new Date(c.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{c.format || "CSV"}</span>
                  <span className="text-xs text-muted-foreground">{c.download_count || 0} ↓</span>
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
};

export default OpenData;
