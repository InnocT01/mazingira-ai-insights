import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Plus, Upload, FileText, Loader2, Trash2, Eye, Edit, CheckCircle, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  review_notes: string | null;
}

const dataTypes = ["climate", "soil", "agriculture", "satellite", "biodiversity", "hydrology", "deforestation", "air_quality"];
const regions = ["North Kivu", "South Kivu", "Katanga", "Kinshasa", "Équateur", "Maniema", "Ituri", "Tshopo", "Kasai", "Tanganyika"];
const formats = ["CSV", "GeoJSON", "JSON", "NetCDF", "GeoTIFF", "Excel", "PDF"];

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", data_type: "climate", region: "", format: "CSV",
    latitude: "", longitude: "", file_url: "",
    // Metadata fields
    methodology: "", sample_size: "", collection_period: "", instruments: "", accuracy: "",
  });

  useEffect(() => {
    if (user) fetchContributions();
  }, [user]);

  const fetchContributions = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("contributions")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setContributions(data);
    setLoading(false);
  };

  const submitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    
    const metadata: Record<string, string> = {};
    if (form.methodology) metadata.methodology = form.methodology;
    if (form.sample_size) metadata.sample_size = form.sample_size;
    if (form.collection_period) metadata.collection_period = form.collection_period;
    if (form.instruments) metadata.instruments = form.instruments;
    if (form.accuracy) metadata.accuracy = form.accuracy;

    const { error } = await supabase.from("contributions").insert({
      user_id: user.id,
      title: form.title,
      description: form.description || null,
      data_type: form.data_type,
      region: form.region || null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      format: form.format,
      file_url: form.file_url || null,
      metadata,
    });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: t("researcher.submitted") });
      setShowForm(false);
      setForm({ title: "", description: "", data_type: "climate", region: "", format: "CSV", latitude: "", longitude: "", file_url: "", methodology: "", sample_size: "", collection_period: "", instruments: "", accuracy: "" });
      fetchContributions();
    }
    setSubmitting(false);
  };

  const deleteContribution = async (id: string) => {
    await supabase.from("contributions").delete().eq("id", id);
    fetchContributions();
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle size={14} className="text-primary" />;
      case "rejected": return <XCircle size={14} className="text-destructive" />;
      case "under_review": return <Eye size={14} className="text-accent" />;
      default: return <Clock size={14} className="text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent">{t("researcher.badge")}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{t("researcher.title")}</h1>
            <p className="mt-2 text-muted-foreground text-sm">{t("researcher.subtitle")} — {user?.email}</p>
          </motion.div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t("researcher.total"), value: contributions.length },
              { label: t("researcher.approved"), value: contributions.filter(c => c.status === "approved").length },
              { label: t("researcher.pending"), value: contributions.filter(c => c.status === "pending" || c.status === "under_review").length },
              { label: t("researcher.downloads"), value: contributions.reduce((s, c) => s + (c.download_count || 0), 0) },
            ].map(s => (
              <div key={s.label} className="p-4 rounded-xl bg-card border border-border text-center">
                <div className="font-display font-bold text-2xl text-foreground">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-foreground">{t("researcher.my_contributions")}</h2>
            <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
              <Plus size={16} /> {t("researcher.new_contribution")}
            </button>
          </div>

          {/* Contribution Form */}
          {showForm && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submitContribution} className="mt-4 p-6 rounded-2xl bg-card border border-border space-y-6">
              <div>
                <h3 className="font-display font-semibold text-foreground mb-1">{t("researcher.form_title")}</h3>
                <p className="text-xs text-muted-foreground">{t("researcher.form_desc")}</p>
              </div>

              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">{t("researcher.dataset_title")} *</label>
                  <input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="Ex: Soil pH measurements — Masisi 2024" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">{t("researcher.dataset_desc")}</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t("researcher.data_type")} *</label>
                  <select value={form.data_type} onChange={e => setForm(f => ({...f, data_type: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm">
                    {dataTypes.map(dt => <option key={dt} value={dt}>{dt.replace("_", " ").replace(/^\w/, c => c.toUpperCase())}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t("researcher.region")}</label>
                  <select value={form.region} onChange={e => setForm(f => ({...f, region: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm">
                    <option value="">-- {t("researcher.select_region")} --</option>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t("researcher.format")}</label>
                  <select value={form.format} onChange={e => setForm(f => ({...f, format: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm">
                    {formats.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">{t("researcher.file_url")}</label>
                  <input value={form.file_url} onChange={e => setForm(f => ({...f, file_url: e.target.value}))} placeholder="https://..." className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Latitude</label>
                  <input type="number" step="any" value={form.latitude} onChange={e => setForm(f => ({...f, latitude: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Longitude</label>
                  <input type="number" step="any" value={form.longitude} onChange={e => setForm(f => ({...f, longitude: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              </div>

              {/* Metadata (Ushahidi-inspired detailed fields) */}
              <div>
                <h4 className="font-display font-semibold text-sm text-foreground mb-3">{t("researcher.metadata")}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("researcher.methodology")}</label>
                    <input value={form.methodology} onChange={e => setForm(f => ({...f, methodology: e.target.value}))} placeholder="Ex: Field sampling, remote sensing..." className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("researcher.sample_size")}</label>
                    <input value={form.sample_size} onChange={e => setForm(f => ({...f, sample_size: e.target.value}))} placeholder="Ex: 500 points" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("researcher.collection_period")}</label>
                    <input value={form.collection_period} onChange={e => setForm(f => ({...f, collection_period: e.target.value}))} placeholder="Ex: Jan-Mar 2024" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("researcher.instruments")}</label>
                    <input value={form.instruments} onChange={e => setForm(f => ({...f, instruments: e.target.value}))} placeholder="Ex: Soil pH meter, Sentinel-2..." className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50">
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {t("researcher.submit")}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-lg bg-muted text-foreground text-sm">{t("farmer.cancel")}</button>
              </div>
            </motion.form>
          )}

          {/* Contributions list */}
          <div className="mt-6 grid gap-3">
            {contributions.length === 0 ? (
              <div className="text-center py-16">
                <FileText size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">{t("researcher.no_contributions")}</p>
              </div>
            ) : contributions.map(contrib => (
              <motion.div key={contrib.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <FileText size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
                      {contrib.title}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted">
                        {statusIcon(contrib.status)} {contrib.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {contrib.data_type} · {contrib.region || "N/A"} · {contrib.format} · {new Date(contrib.created_at).toLocaleDateString()}
                      {(contrib.download_count || 0) > 0 && ` · ${contrib.download_count} downloads`}
                    </div>
                    {contrib.review_notes && (
                      <p className="text-xs text-accent mt-1">📝 {contrib.review_notes}</p>
                    )}
                  </div>
                </div>
                <button onClick={() => deleteContribution(contrib.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResearcherDashboard;
