import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Upload, FileText, MapPin, Users, Shield, ArrowRight, CheckCircle, Globe, Database } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const steps = [
  { number: 1, title: "Create your profile", desc: "Sign up as a researcher, organization, or farmer", icon: Users },
  { number: 2, title: "Upload your data", desc: "CSV, JSON, GeoJSON, GeoTIFF — any environmental dataset", icon: Upload },
  { number: 3, title: "Add metadata", desc: "Describe your methodology, location, time period, and license", icon: FileText },
  { number: 4, title: "Peer review", desc: "Community validation and automated quality checks", icon: Shield },
  { number: 5, title: "Published & cited", desc: "Your data becomes available with full attribution", icon: CheckCircle },
];

const contributorTypes = [
  {
    title: "Research Institutions",
    desc: "Universities and research centers can publish field studies, satellite analysis, and longitudinal environmental data.",
    icon: Globe,
    examples: ["Soil composition studies", "Biodiversity surveys", "Water quality analysis"],
  },
  {
    title: "Climate Organizations",
    desc: "NGOs and climate agencies can share monitoring data, impact assessments, and predictive models.",
    icon: Database,
    examples: ["Carbon monitoring", "Deforestation tracking", "Climate risk maps"],
  },
  {
    title: "Agricultural Cooperatives",
    desc: "Farming cooperatives can contribute crop data, market prices, and local agricultural practices.",
    icon: Users,
    examples: ["Crop yields by season", "Local market prices", "Pest & disease reports"],
  },
  {
    title: "Individual Farmers",
    desc: "Smallholder farmers can share field observations, soil tests, and harvest data through simple forms.",
    icon: MapPin,
    examples: ["Soil test results", "Rainfall observations", "Planting schedules"],
  },
];

const ContributePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    organization: "",
    datasetName: "",
    description: "",
    region: "",
    type: "agriculture",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="bg-gradient-hero text-primary-foreground">
          <div className="container py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
                <Upload size={12} /> Community Data Platform
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                Contribute Your Data
              </h1>
              <p className="mt-2 text-primary-foreground/70 text-sm max-w-2xl">
                Inspired by Ushahidi's crowdsourced intelligence — share your environmental and agricultural data 
                to benefit researchers, farmers, and communities across Africa.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="container py-12">
          {/* How it works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-16"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="relative p-4 rounded-xl bg-card border border-border text-center"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm text-foreground">{step.title}</h3>
                  <p className="mt-1 text-[11px] text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contributor types */}
          <div className="mb-16">
            <h2 className="font-display text-xl font-bold text-foreground mb-8 text-center">Who Can Contribute?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {contributorTypes.map((ct, i) => (
                <motion.div
                  key={ct.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-6 rounded-xl bg-card border border-border hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ct.icon size={18} className="text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{ct.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{ct.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {ct.examples.map(ex => (
                      <span key={ex} className="px-2 py-1 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">{ex}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Submission form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="font-display text-xl font-bold text-foreground mb-6 text-center">Submit a Dataset</h2>

            {!user ? (
              <div className="text-center p-8 rounded-xl bg-card border border-border">
                <Shield size={32} className="mx-auto mb-3 text-primary" />
                <p className="text-sm text-muted-foreground mb-4">You need to sign in to contribute data.</p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                >
                  Sign In to Contribute <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="space-y-4 p-6 rounded-xl bg-card border border-border">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Your Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Dr. Jean Mukasa"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Organization</label>
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="University of Goma"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Dataset Name</label>
                  <input
                    type="text"
                    value={formData.datasetName}
                    onChange={(e) => setFormData(prev => ({ ...prev, datasetName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Soil Analysis — Masisi Territory 2024"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">Description & Methodology</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Describe your data, collection methodology, and intended use..."
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Region</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="North Kivu, DRC"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1.5">Data Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="agriculture">Agriculture</option>
                      <option value="climate">Climate</option>
                      <option value="satellite">Satellite</option>
                      <option value="soil">Soil</option>
                      <option value="water">Water</option>
                      <option value="biodiversity">Biodiversity</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 border border-dashed border-border text-center">
                  <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Drag & drop your files here or click to browse</p>
                  <p className="text-[10px] text-muted-foreground mt-1">CSV, JSON, GeoJSON, GeoTIFF, NetCDF (max 50MB)</p>
                </div>
                <button className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  Submit for Review
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContributePage;
