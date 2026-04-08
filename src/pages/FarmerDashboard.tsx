import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, MapPin, Leaf, Scan, Loader2, Trash2, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CongoMap from "@/components/CongoMap";

interface Farm {
  id: string;
  name: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  area_hectares: number | null;
  crop_type: string | null;
  soil_type: string | null;
}

interface SoilScan {
  id: string;
  farm_id: string | null;
  scan_type: string;
  status: string;
  results: any;
  notes: string | null;
  created_at: string;
}

const FarmerDashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [scans, setScans] = useState<SoilScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddFarm, setShowAddFarm] = useState(false);
  const [showScan, setShowScan] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState<"farms" | "scans" | "map">("farms");
  const [farmForm, setFarmForm] = useState({ name: "", location: "", latitude: "", longitude: "", area_hectares: "", crop_type: "", soil_type: "" });
  const [scanForm, setScanForm] = useState({ farm_id: "", latitude: "", longitude: "", soil_description: "", scan_type: "quick" });

  useEffect(() => { if (user) fetchData(); }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [farmsRes, scansRes] = await Promise.all([
      supabase.from("farms").select("*").order("created_at", { ascending: false }),
      supabase.from("soil_scans").select("*").order("created_at", { ascending: false }),
    ]);
    if (farmsRes.data) setFarms(farmsRes.data);
    if (scansRes.data) setScans(scansRes.data);
    setLoading(false);
  };

  const addFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("farms").insert({
      user_id: user.id, name: farmForm.name,
      location: farmForm.location || null,
      latitude: farmForm.latitude ? parseFloat(farmForm.latitude) : null,
      longitude: farmForm.longitude ? parseFloat(farmForm.longitude) : null,
      area_hectares: farmForm.area_hectares ? parseFloat(farmForm.area_hectares) : null,
      crop_type: farmForm.crop_type || null,
      soil_type: farmForm.soil_type || null,
    });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); }
    else { toast({ title: "Succès", description: "Terrain ajouté !" }); setShowAddFarm(false); setFarmForm({ name: "", location: "", latitude: "", longitude: "", area_hectares: "", crop_type: "", soil_type: "" }); fetchData(); }
  };

  const deleteFarm = async (id: string) => { await supabase.from("farms").delete().eq("id", id); fetchData(); };

  const runSoilScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setScanning(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soil-scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
        body: JSON.stringify({ farm_id: scanForm.farm_id || null, latitude: scanForm.latitude ? parseFloat(scanForm.latitude) : null, longitude: scanForm.longitude ? parseFloat(scanForm.longitude) : null, soil_description: scanForm.soil_description, scan_type: scanForm.scan_type }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Analyse terminée", description: "Résultats disponibles !" });
      setShowScan(false); fetchData();
    } catch (err: any) { toast({ title: "Erreur", description: err.message, variant: "destructive" }); }
    setScanning(false);
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin text-primary" size={24} /></div>;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">{t("farmer.badge")}</span>
        <h1 className="font-display text-xl font-bold text-foreground">{t("farmer.title")}</h1>
        <p className="text-xs text-muted-foreground">{t("farmer.subtitle")} — {user?.email}</p>
      </motion.div>

      <div className="flex gap-1 border-b border-border">
        {([
          { key: "farms" as const, label: t("farmer.tab_farms"), icon: MapPin },
          { key: "scans" as const, label: t("farmer.tab_scans"), icon: Scan },
          { key: "map" as const, label: t("farmer.tab_map"), icon: BarChart3 },
        ]).map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-[1px] transition-colors ${activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            <tab.icon size={15} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "farms" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">{t("farmer.my_farms")} ({farms.length})</h2>
            <button onClick={() => setShowAddFarm(!showAddFarm)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">
              <Plus size={14} /> {t("farmer.add_farm")}
            </button>
          </div>

          {showAddFarm && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={addFarm} className="p-4 rounded-xl bg-card border border-border space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><label className="text-xs font-medium">{t("farmer.farm_name")} *</label><input required value={farmForm.name} onChange={e => setFarmForm(f => ({...f, name: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-xs font-medium">{t("farmer.location")}</label><input value={farmForm.location} onChange={e => setFarmForm(f => ({...f, location: e.target.value}))} placeholder="Masisi, North Kivu" className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-xs font-medium">Latitude</label><input type="number" step="any" value={farmForm.latitude} onChange={e => setFarmForm(f => ({...f, latitude: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-xs font-medium">Longitude</label><input type="number" step="any" value={farmForm.longitude} onChange={e => setFarmForm(f => ({...f, longitude: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-xs font-medium">{t("farmer.area")}</label><input type="number" step="any" value={farmForm.area_hectares} onChange={e => setFarmForm(f => ({...f, area_hectares: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
                <div><label className="text-xs font-medium">{t("farmer.crop_type")}</label><input value={farmForm.crop_type} onChange={e => setFarmForm(f => ({...f, crop_type: e.target.value}))} placeholder="Cassava, Maize..." className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">{t("farmer.save")}</button>
                <button type="button" onClick={() => setShowAddFarm(false)} className="px-4 py-2 rounded-lg bg-muted text-foreground text-xs">{t("farmer.cancel")}</button>
              </div>
            </motion.form>
          )}

          {farms.length === 0 ? (
            <div className="text-center py-12"><MapPin size={36} className="mx-auto mb-3 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">{t("farmer.no_farms")}</p></div>
          ) : (
            <div className="space-y-2">
              {farms.map(farm => (
                <div key={farm.id} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Leaf size={16} className="text-primary" /></div>
                    <div>
                      <div className="font-medium text-sm text-foreground">{farm.name}</div>
                      <div className="text-xs text-muted-foreground">{farm.location && `${farm.location} · `}{farm.area_hectares && `${farm.area_hectares} ha · `}{farm.crop_type}</div>
                    </div>
                  </div>
                  <button onClick={() => deleteFarm(farm.id)} className="p-1.5 rounded hover:bg-destructive/10"><Trash2 size={14} className="text-destructive" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "scans" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-semibold">{t("farmer.soil_analysis")}</h2>
            <button onClick={() => setShowScan(!showScan)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-accent-foreground text-xs font-semibold">
              <Scan size={14} /> {t("farmer.new_scan")}
            </button>
          </div>

          {showScan && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={runSoilScan} className="p-4 rounded-xl bg-card border border-border space-y-3">
              <p className="text-xs text-muted-foreground">{t("farmer.scan_desc")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {farms.length > 0 && (
                  <div><label className="text-xs font-medium">{t("farmer.select_farm")}</label><select value={scanForm.farm_id} onChange={e => setScanForm(s => ({...s, farm_id: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"><option value="">-- {t("farmer.optional")} --</option>{farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
                )}
                <div><label className="text-xs font-medium">{t("farmer.scan_type")}</label><select value={scanForm.scan_type} onChange={e => setScanForm(s => ({...s, scan_type: e.target.value}))} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm"><option value="quick">{t("farmer.quick_scan")}</option><option value="detailed">{t("farmer.detailed_scan")}</option></select></div>
              </div>
              <div><label className="text-xs font-medium">{t("farmer.soil_desc")}</label><textarea value={scanForm.soil_description} onChange={e => setScanForm(s => ({...s, soil_description: e.target.value}))} rows={2} placeholder={t("farmer.soil_desc_placeholder")} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-sm focus:outline-none focus:ring-2 focus:ring-ring" /></div>
              <button type="submit" disabled={scanning} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-xs font-semibold disabled:opacity-50">
                {scanning ? <><Loader2 size={14} className="animate-spin" /> {t("farmer.analyzing")}</> : <><Scan size={14} /> {t("farmer.run_analysis")}</>}
              </button>
            </motion.form>
          )}

          {scans.length === 0 ? (
            <div className="text-center py-12"><Scan size={36} className="mx-auto mb-3 text-muted-foreground/30" /><p className="text-sm text-muted-foreground">{t("farmer.no_scans")}</p></div>
          ) : (
            <div className="space-y-3">
              {scans.map(scan => (
                <div key={scan.id} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Scan size={15} className="text-accent" />
                      <span className="font-medium text-sm">{scan.scan_type === "quick" ? t("farmer.quick_scan") : t("farmer.detailed_scan")}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${scan.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>{scan.status}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(scan.created_at).toLocaleDateString()}</span>
                  </div>
                  {scan.results && typeof scan.results === "object" && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {scan.results.soil_quality_score && <div className="p-2 rounded-lg bg-muted/50"><div className="text-[10px] text-muted-foreground">Qualité</div><div className="font-bold text-sm">{scan.results.soil_quality_score}/100</div></div>}
                      {scan.results.ph_estimate && <div className="p-2 rounded-lg bg-muted/50"><div className="text-[10px] text-muted-foreground">pH</div><div className="font-bold text-sm">{scan.results.ph_estimate}</div></div>}
                      {scan.results.texture && <div className="p-2 rounded-lg bg-muted/50"><div className="text-[10px] text-muted-foreground">Texture</div><div className="font-bold text-xs capitalize">{scan.results.texture}</div></div>}
                      {scan.results.organic_matter && <div className="p-2 rounded-lg bg-muted/50"><div className="text-[10px] text-muted-foreground">M.O.</div><div className="font-bold text-xs capitalize">{scan.results.organic_matter}</div></div>}
                    </div>
                  )}
                  {scan.results?.summary_fr && <p className="mt-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">{scan.results.summary_fr}</p>}
                  {scan.results?.recommended_crops && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {scan.results.recommended_crops.map((crop: string) => <span key={crop} className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-medium">{crop}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "map" && (
        <div className="rounded-xl bg-card border border-border overflow-hidden" style={{ height: "400px" }}>
          <CongoMap />
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
