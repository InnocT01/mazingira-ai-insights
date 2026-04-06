import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Database, Search, FileDown, Filter, BarChart3, Globe, Satellite, CloudRain,
  Thermometer, Droplets, Leaf, Map, TrendingUp, Download, Share2, Code, Shield,
  Clock, Layers, Eye, GitBranch, ArrowRight, Upload, Users, FileText, Activity,
  Zap, Bell, BookOpen, Loader2
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import CongoMap from "@/components/CongoMap";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Satellite / official datasets
const officialDatasets = [
  { name: "NDVI Index — North Kivu", type: "Satellite", format: "GeoTIFF / CSV", size: "12.4 MB", updated: "2h ago", source: "Copernicus", icon: Satellite, color: "text-primary" },
  { name: "Rainfall Data — DRC Regions", type: "Climate", format: "NetCDF / CSV", size: "8.1 MB", updated: "1 day ago", source: "NASA POWER", icon: CloudRain, color: "text-secondary" },
  { name: "Soil Moisture — Eastern DRC", type: "Field Data", format: "CSV / JSON", size: "3.7 MB", updated: "3 days ago", source: "SMAP", icon: Droplets, color: "text-accent" },
  { name: "Temperature Anomalies 2024", type: "Climate", format: "CSV / API", size: "15.2 MB", updated: "1 week ago", source: "ERA5", icon: Thermometer, color: "text-destructive" },
  { name: "Crop Performance — Goma", type: "Agriculture", format: "CSV", size: "5.6 MB", updated: "2 days ago", source: "FAO", icon: Leaf, color: "text-primary" },
  { name: "Deforestation Alerts — Virunga", type: "Environmental", format: "GeoJSON", size: "9.8 MB", updated: "6h ago", source: "Global Forest Watch", icon: Eye, color: "text-destructive" },
];

const capabilities = [
  { icon: Search, title: "Advanced Search", desc: "Full-text and geospatial search across all datasets" },
  { icon: Filter, title: "Smart Filters", desc: "Filter by region, data type, source, date range" },
  { icon: Download, title: "Multi-format Export", desc: "CSV, JSON, GeoJSON, NetCDF, GeoTIFF" },
  { icon: Code, title: "REST API Access", desc: "Programmatic access to all public datasets" },
  { icon: Globe, title: "Geospatial Queries", desc: "Query by bounding box, polygon, or coordinates" },
  { icon: BarChart3, title: "Inline Visualization", desc: "Preview charts and maps in the explorer" },
  { icon: Clock, title: "Temporal Analysis", desc: "Time-series with aggregation and trends" },
  { icon: Layers, title: "Layer Composition", desc: "Combine datasets into composite layers" },
  { icon: GitBranch, title: "Version History", desc: "Track dataset changes with version control" },
  { icon: Bell, title: "Data Subscriptions", desc: "Subscribe to updates via email or webhook" },
  { icon: Shield, title: "Data Validation", desc: "Automated quality checks and anomaly detection" },
  { icon: Share2, title: "Share & Embed", desc: "Share with permanent links or embed in reports" },
  { icon: Activity, title: "Real-time Streaming", desc: "Live feeds for climate alerts and sensors" },
  { icon: Zap, title: "Batch Processing", desc: "Bulk analysis jobs on large datasets" },
  { icon: BookOpen, title: "Data Dictionary", desc: "Comprehensive metadata for every field" },
  { icon: FileText, title: "Auto Reports", desc: "Generate reports from query results" },
  { icon: Users, title: "Collaborative Workspace", desc: "Shared workspaces for research teams" },
  { icon: Upload, title: "Community Contributions", desc: "Submit datasets for peer review" },
  { icon: Database, title: "Data Warehouse", desc: "Centralized lake with cross-dataset joins" },
  { icon: Map, title: "Custom Map Layers", desc: "Create custom map visualizations from data" },
];

interface ClimatePoint {
  date: string;
  temperature: number;
  precipitation: number;
  humidity: number;
}

interface CommunityContrib {
  id: string;
  title: string;
  data_type: string;
  region: string | null;
  format: string | null;
  created_at: string;
  profiles: { full_name: string | null; organization_name: string | null } | null;
}

const OpenData = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"satellite" | "community" | "climate">("satellite");
  const [activeFilter, setActiveFilter] = useState("All");
  const [climateData, setClimateData] = useState<ClimatePoint[]>([]);
  const [climateLoading, setClimateLoading] = useState(false);
  const [communityData, setCommunityData] = useState<CommunityContrib[]>([]);
  const [communityLoading, setCommunityLoading] = useState(false);

  const filters = ["All", "Satellite", "Climate", "Agriculture", "Field Data", "Environmental"];

  // Fetch community contributions
  useEffect(() => {
    const fetchContributions = async () => {
      setCommunityLoading(true);
      const { data, error } = await supabase
        .from("contributions")
        .select("id, title, data_type, region, format, created_at, user_id")
        .eq("status", "approved")
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (!error && data) {
        setCommunityData(data.map(d => ({ ...d, profiles: null })));
      }
      setCommunityLoading(false);
    };
    fetchContributions();
  }, []);

  // Fetch NASA POWER climate data
  const fetchClimateData = async () => {
    setClimateLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/climate-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ latitude: -1.68, longitude: 29.22 }),
      });
      const json = await resp.json();
      if (json.data) setClimateData(json.data.slice(-14));
    } catch (e) {
      console.error("Climate data error:", e);
    }
    setClimateLoading(false);
  };

  useEffect(() => {
    if (activeTab === "climate" && climateData.length === 0) {
      fetchClimateData();
    }
  }, [activeTab]);

  const filteredDatasets = officialDatasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || d.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="container py-12">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                <Database size={12} /> Mazingira Open Data
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {t("opendata.title")}
              </h1>
              <p className="mt-2 text-primary-foreground/70 text-sm max-w-2xl">
                {t("opendata.subtitle")}
              </p>
            </motion.div>

            {/* Search */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="mt-6 flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("opendata.search_placeholder")}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-4 flex flex-wrap gap-2">
              {([
                { key: "satellite" as const, label: t("opendata.tab_satellite"), icon: Satellite },
                { key: "community" as const, label: t("opendata.tab_community"), icon: Users },
                { key: "climate" as const, label: t("opendata.tab_climate"), icon: CloudRain },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.key
                      ? "bg-white text-earth-deep"
                      : "bg-white/10 text-primary-foreground/70 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="container py-8">
          {/* Quick actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link to="/contribute" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              <Upload size={14} /> {t("opendata.contribute")}
            </Link>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/20 transition-all">
              <Code size={14} /> API Documentation
            </button>
          </div>

          {/* SATELLITE TAB */}
          {activeTab === "satellite" && (
            <>
              {/* Filter pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.map(f => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:border-primary/20"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <div className="grid gap-3">
                {filteredDatasets.map((dataset, i) => (
                  <motion.div
                    key={dataset.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.03 }}
                    className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <dataset.icon size={18} className={dataset.color} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-display font-semibold text-sm text-foreground truncate">{dataset.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium mr-2">{dataset.type}</span>
                          {dataset.format} · {dataset.size} · {dataset.source} · {dataset.updated}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Preview">
                        <Eye size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" title="Download">
                        <FileDown size={16} className="text-primary" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 rounded-2xl bg-card border border-border overflow-hidden"
                style={{ height: "450px" }}
              >
                <CongoMap />
              </motion.div>
            </>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === "community" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{t("opendata.community_title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("opendata.community_desc")}</p>
                </div>
                <Link to="/contribute" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  <Upload size={14} /> {t("opendata.contribute")}
                </Link>
              </div>

              {communityLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : communityData.length === 0 ? (
                <div className="text-center py-16">
                  <Users size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground text-sm">{t("opendata.no_community")}</p>
                  <Link to="/contribute" className="inline-flex items-center gap-2 mt-4 text-primary text-sm font-semibold hover:underline">
                    {t("opendata.be_first")} <ArrowRight size={14} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-3">
                  {communityData.map((contrib, i) => (
                    <motion.div
                      key={contrib.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <Upload size={18} className="text-accent" />
                        </div>
                        <div>
                          <div className="font-display font-semibold text-sm text-foreground">{contrib.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            <span className="inline-flex px-1.5 py-0.5 rounded bg-muted text-[10px] font-medium mr-2">{contrib.data_type}</span>
                            {contrib.region && `${contrib.region} · `}
                            {contrib.format} · {new Date(contrib.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
                        <FileDown size={16} className="text-primary" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CLIMATE TAB - NASA POWER */}
          {activeTab === "climate" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-xl font-bold text-foreground">{t("opendata.climate_title")}</h2>
                  <p className="text-sm text-muted-foreground">{t("opendata.climate_desc")}</p>
                </div>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded">Source: NASA POWER</span>
              </div>

              {climateLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="animate-spin text-primary" size={32} />
                </div>
              ) : climateData.length > 0 ? (
                <div className="space-y-6">
                  {/* Summary cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: t("opendata.avg_temp"), value: `${(climateData.reduce((s, d) => s + d.temperature, 0) / climateData.length).toFixed(1)}°C`, icon: Thermometer, color: "text-destructive" },
                      { label: t("opendata.total_precip"), value: `${climateData.reduce((s, d) => s + d.precipitation, 0).toFixed(1)} mm`, icon: CloudRain, color: "text-secondary" },
                      { label: t("opendata.avg_humidity"), value: `${(climateData.reduce((s, d) => s + d.humidity, 0) / climateData.length).toFixed(0)}%`, icon: Droplets, color: "text-primary" },
                      { label: t("opendata.data_points"), value: `${climateData.length}`, icon: BarChart3, color: "text-accent" },
                    ].map(card => (
                      <div key={card.label} className="p-4 rounded-xl bg-card border border-border">
                        <card.icon size={18} className={`${card.color} mb-2`} />
                        <div className="font-display font-bold text-2xl text-foreground">{card.value}</div>
                        <div className="text-xs text-muted-foreground">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Data table */}
                  <div className="rounded-xl bg-card border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/50">
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Temp (°C)</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Precip (mm)</th>
                            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Humidity (%)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {climateData.map(d => (
                            <tr key={d.date} className="border-b border-border/50 hover:bg-muted/30">
                              <td className="px-4 py-2.5 font-mono text-xs">{d.date}</td>
                              <td className="px-4 py-2.5">{d.temperature?.toFixed(1)}</td>
                              <td className="px-4 py-2.5">{d.precipitation?.toFixed(1)}</td>
                              <td className="px-4 py-2.5">{d.humidity?.toFixed(0)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <CloudRain size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-sm">Impossible de charger les données climatiques. Réessayez.</p>
                  <button onClick={fetchClimateData} className="mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                    Réessayer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Capabilities Grid */}
          <div className="mt-16">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">20 {t("opendata.capabilities")}</span>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">{t("opendata.capabilities_title")}</h2>
              <p className="mt-2 text-muted-foreground text-sm max-w-xl mx-auto">{t("opendata.capabilities_desc")}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {capabilities.map((cap, i) => (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-soft transition-all group"
                >
                  <cap.icon size={18} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display font-semibold text-xs text-foreground">{cap.title}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground leading-relaxed">{cap.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contribute CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-2xl bg-gradient-hero p-8 md:p-12 text-primary-foreground"
          >
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Upload size={20} className="text-earth-sun" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-earth-sun">{t("opendata.community_data")}</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold">{t("opendata.share_title")}</h3>
              <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed max-w-lg">{t("opendata.share_desc")}</p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-primary-foreground/80">
                {[
                  t("opendata.share_1"), t("opendata.share_2"), t("opendata.share_3"),
                  t("opendata.share_4"), t("opendata.share_5"), t("opendata.share_6"),
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Leaf size={12} className="text-earth-sun shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/contribute" className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-earth-deep font-semibold text-sm hover:opacity-90 transition-opacity">
                {t("opendata.start_contributing")} <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OpenData;
