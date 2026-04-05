import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Database, Search, FileDown, Table, Filter, BarChart3,
  Globe, Satellite, CloudRain, Thermometer, Droplets, Leaf,
  Map, TrendingUp, Download, Share2, Code, Shield, Clock,
  Layers, Eye, GitBranch, ArrowRight, Upload, Users, FileText,
  Activity, Zap, Bell, BookOpen
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const datasets = [
  { name: "NDVI Index — North Kivu", type: "Satellite", format: "GeoTIFF / CSV", size: "12.4 MB", updated: "2 hours ago", source: "Copernicus", icon: Satellite, color: "text-primary" },
  { name: "Rainfall Data — Congo Basin", type: "Climate", format: "NetCDF / CSV", size: "8.1 MB", updated: "1 day ago", source: "NASA POWER", icon: CloudRain, color: "text-secondary" },
  { name: "Soil Moisture — Eastern DRC", type: "Field Data", format: "CSV / JSON", size: "3.7 MB", updated: "3 days ago", source: "SMAP", icon: Droplets, color: "text-accent" },
  { name: "Temperature Anomalies 2024", type: "Climate", format: "CSV / API", size: "15.2 MB", updated: "1 week ago", source: "ERA5", icon: Thermometer, color: "text-destructive" },
  { name: "Crop Performance — Goma Region", type: "Agriculture", format: "CSV", size: "5.6 MB", updated: "2 days ago", source: "Community", icon: Leaf, color: "text-primary" },
  { name: "Land Use Classification — Kivu", type: "Geospatial", format: "GeoJSON", size: "22.1 MB", updated: "5 days ago", source: "USGS", icon: Map, color: "text-secondary" },
  { name: "Deforestation Alerts — Virunga", type: "Environmental", format: "GeoJSON / CSV", size: "9.8 MB", updated: "6 hours ago", source: "Global Forest Watch", icon: Eye, color: "text-destructive" },
  { name: "Carbon Sequestration Estimates", type: "Climate", format: "CSV", size: "4.2 MB", updated: "1 week ago", source: "Community", icon: TrendingUp, color: "text-primary" },
];

const capabilities = [
  { icon: Search, title: "Advanced Search", desc: "Full-text and geospatial search across all datasets with filters" },
  { icon: Filter, title: "Smart Filters", desc: "Filter by region, data type, source, date range, and format" },
  { icon: Download, title: "Multi-format Export", desc: "Download in CSV, JSON, GeoJSON, NetCDF, GeoTIFF" },
  { icon: Code, title: "REST API Access", desc: "Programmatic access to all public datasets via RESTful API" },
  { icon: Globe, title: "Geospatial Queries", desc: "Query data by bounding box, polygon, or point coordinates" },
  { icon: BarChart3, title: "Inline Visualization", desc: "Preview charts and maps directly within the explorer" },
  { icon: Clock, title: "Temporal Analysis", desc: "Time-series queries with aggregation and trend detection" },
  { icon: Layers, title: "Layer Composition", desc: "Combine multiple datasets into composite analysis layers" },
  { icon: GitBranch, title: "Version History", desc: "Track dataset changes with full version control" },
  { icon: Bell, title: "Data Subscriptions", desc: "Subscribe to dataset updates via email or webhook" },
  { icon: Shield, title: "Data Validation", desc: "Automated quality checks and anomaly detection" },
  { icon: Share2, title: "Share & Embed", desc: "Share datasets with permanent links or embed in reports" },
  { icon: Activity, title: "Real-time Streaming", desc: "Live data feeds for climate alerts and sensor networks" },
  { icon: Zap, title: "Batch Processing", desc: "Run bulk analysis jobs on large datasets" },
  { icon: BookOpen, title: "Data Dictionary", desc: "Comprehensive metadata and documentation for every field" },
  { icon: FileText, title: "Auto Reports", desc: "Generate analysis reports from query results" },
  { icon: Users, title: "Collaborative Workspace", desc: "Shared workspaces for research teams" },
  { icon: Upload, title: "Community Contributions", desc: "Submit your own datasets for peer review and publication" },
  { icon: Database, title: "Data Warehouse", desc: "Centralized data lake with cross-dataset joins" },
  { icon: Map, title: "Custom Map Layers", desc: "Create and save custom map visualizations from data" },
];

const Explorer = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Satellite", "Climate", "Agriculture", "Field Data", "Geospatial", "Environmental"];

  const filteredDatasets = datasets.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || d.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero Header */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="container py-12">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                <Database size={12} /> Open Data Platform
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {t("dashboard.title")}
              </h1>
              <p className="mt-2 text-primary-foreground/70 text-sm max-w-2xl">
                {t("dashboard.subtitle")} Access, explore, and download environmental datasets. Contribute your own research data to benefit the community.
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
                  placeholder="Search datasets (e.g., NDVI, rainfall, soil moisture...)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-primary-foreground text-sm placeholder:text-primary-foreground/40 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm"
                />
              </div>
            </motion.div>

            {/* Filter pills */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }} className="mt-4 flex flex-wrap gap-2">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === f
                      ? "bg-white text-earth-deep"
                      : "bg-white/10 text-primary-foreground/70 hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {f}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="container py-8">
          {/* Quick actions row */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Link
              to="/contribute"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <Upload size={14} /> Contribute Data
            </Link>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/20 transition-all">
              <Code size={14} /> API Documentation
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border text-sm font-medium text-foreground hover:border-primary/20 transition-all">
              <Bell size={14} /> Subscribe to Updates
            </button>
          </div>

          {/* Datasets */}
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
                      {dataset.format} · {dataset.size} · {dataset.source} · Updated {dataset.updated}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Preview">
                    <Eye size={16} className="text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Share">
                    <Share2 size={16} className="text-muted-foreground" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-primary/10 transition-colors" title="Download">
                    <FileDown size={16} className="text-primary" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredDatasets.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Database size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No datasets found matching your criteria.</p>
            </div>
          )}

          {/* Capabilities Grid */}
          <div className="mt-16">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">20 Technical Capabilities</span>
              <h2 className="mt-2 font-display text-2xl md:text-3xl font-bold text-foreground">
                Enterprise-Grade Open Data Platform
              </h2>
              <p className="mt-2 text-muted-foreground text-sm max-w-xl mx-auto">
                Built for researchers, NGOs, governments, and farmers. Every feature designed for African environmental intelligence.
              </p>
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

          {/* Contribute CTA — Ushahidi-inspired */}
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
                <span className="text-xs font-semibold uppercase tracking-wider text-earth-sun">Community Data</span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold">Share Your Data with Africa</h3>
              <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed max-w-lg">
                Inspired by the Ushahidi model of crowdsourced intelligence — researchers, climate organizations, 
                agricultural cooperatives, and individual farmers can contribute datasets to benefit the entire community.
              </p>
              <ul className="mt-4 grid sm:grid-cols-2 gap-2 text-sm text-primary-foreground/80">
                {[
                  "Submit field measurements & surveys",
                  "Upload satellite analysis results",
                  "Share crop yield data",
                  "Contribute soil test reports",
                  "Peer review & validation process",
                  "Attribution & citation credits",
                ].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <Leaf size={12} className="text-earth-sun shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/contribute"
                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-xl bg-white text-earth-deep font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Start Contributing <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Explorer;
