import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Loader2, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contribution {
  id: string;
  title: string;
  description: string | null;
  data_type: string;
  region: string | null;
  format: string | null;
  file_url: string | null;
  status: string;
  download_count: number | null;
  created_at: string;
}

const ResearcherDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", data_type: "climate", region: "", format: "CSV", file_url: "" });

  useEffect(() => { if (user) loadData(); }, [user]);

  const loadData = async () => {
    const { data } = await supabase.from("contributions").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    if (data) setContributions(data);
    setLoading(false);
  };

  const submitContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("contributions").insert({
      user_id: user.id, title: form.title, description: form.description || null,
      data_type: form.data_type, region: form.region || null,
      format: form.format, file_url: form.file_url || null,
    });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Succès", description: t("researcher.submitted") }); setShowForm(false); setForm({ title: "", description: "", data_type: "climate", region: "", format: "CSV", file_url: "" }); loadData(); }
    setSubmitting(false);
  };

  const approved = contributions.filter(c => c.status === "approved").length;
  const pending = contributions.filter(c => c.status === "pending").length;
  const totalDownloads = contributions.reduce((s, c) => s + (c.download_count || 0), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={24} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("researcher.badge")}</span>
        <h1 className="font-display text-xl font-bold text-foreground">{t("researcher.title")}</h1>
        <p className="text-xs text-muted-foreground">{t("researcher.subtitle")} — {user?.email}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border"><div className="text-xs text-muted-foreground">{t("researcher.total")}</div><div className="text-xl font-bold text-foreground">{contributions.length}</div></div>
        <div className="p-3 rounded-xl bg-card border border-border"><div className="text-xs text-muted-foreground">{t("researcher.approved")}</div><div className="text-xl font-bold text-primary">{approved}</div></div>
        <div className="p-3 rounded-xl bg-card border border-border"><div className="text-xs text-muted-foreground">{t("researcher.pending")}</div><div className="text-xl font-bold text-accent">{pending}</div></div>
        <div className="p-3 rounded-xl bg-card border border-border"><div className="text-xs text-muted-foreground">{t("researcher.downloads")}</div><div className="text-xl font-bold text-foreground">{totalDownloads}</div></div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold">{t("researcher.my_contributions")}</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
          <Plus size={14} /> {t("researcher.new_contribution")}
        </button>
      </div>

      {showForm && (
        <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submitContribution} className="p-4 rounded-xl bg-card border border-border space-y-3">
          <h3 className="font-display font-semibold text-sm">{t("researcher.form_title")}</h3>
          <p className="text-xs text-muted-foreground">{t("researcher.form_desc")}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><label className="text-xs font-medium">{t("researcher.dataset_title")} *</label><input required value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
            <div><label className="text-xs font-medium">{t("researcher.data_type")}</label><select value={form.data_type} onChange={e => setForm(f => ({...f, data_type: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"><option value="climate">Climate</option><option value="soil">Soil</option><option value="vegetation">Vegetation</option><option value="crop_yield">Crop Yield</option><option value="water">Water</option></select></div>
            <div><label className="text-xs font-medium">{t("researcher.region")}</label><select value={form.region} onChange={e => setForm(f => ({...f, region: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"><option value="">{t("researcher.select_region")}</option><option value="North Kivu">North Kivu</option><option value="South Kivu">South Kivu</option><option value="Ituri">Ituri</option><option value="Katanga">Katanga</option><option value="Tshopo">Tshopo</option><option value="National">National</option></select></div>
            <div><label className="text-xs font-medium">{t("researcher.format")}</label><select value={form.format} onChange={e => setForm(f => ({...f, format: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"><option>CSV</option><option>GeoJSON</option><option>JSON</option><option>NetCDF</option><option>GeoTIFF</option><option>PDF</option></select></div>
          </div>
          <div><label className="text-xs font-medium">{t("researcher.dataset_desc")}</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <div><label className="text-xs font-medium">{t("researcher.file_url")}</label><input value={form.file_url} onChange={e => setForm(f => ({...f, file_url: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
          <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50">
            {submitting ? "..." : t("researcher.submit")}
          </button>
        </motion.form>
      )}

      {contributions.length === 0 ? (
        <div className="text-center py-12"><FileText size={36} className="mx-auto mb-3 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">{t("researcher.no_contributions")}</p></div>
      ) : (
        <div className="space-y-2">
          {contributions.map(c => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center"><FileText size={16} className="text-accent" /></div>
                <div>
                  <div className="font-medium text-sm text-foreground">{c.title}</div>
                  <div className="text-xs text-muted-foreground">{c.data_type} · {c.region || "DRC"} · {c.format}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "approved" ? <CheckCircle size={14} className="text-primary" /> : <Clock size={14} className="text-accent" />}
                <span className="text-[10px] text-muted-foreground">{c.download_count || 0} ↓</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResearcherDashboard;
