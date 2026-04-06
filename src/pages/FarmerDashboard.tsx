import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Plus, MapPin, Leaf, Scan, Loader2, Trash2, BarChart3, AlertTriangle, FileText } from "lucide-react";
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

  // Farm form state
  const [farmForm, setFarmForm] = useState({ name: "", location: "", latitude: "", longitude: "", area_hectares: "", crop_type: "", soil_type: "" });
  // Scan form state
  const [scanForm, setScanForm] = useState({ farm_id: "", latitude: "", longitude: "", soil_description: "", scan_type: "quick" });

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

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
      user_id: user.id,
      name: farmForm.name,
      location: farmForm.location || null,
      latitude: farmForm.latitude ? parseFloat(farmForm.latitude) : null,
      longitude: farmForm.longitude ? parseFloat(farmForm.longitude) : null,
      area_hectares: farmForm.area_hectares ? parseFloat(farmForm.area_hectares) : null,
      crop_type: farmForm.crop_type || null,
      soil_type: farmForm.soil_type || null,
    });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Succès", description: "Terrain ajouté !" });
      setShowAddFarm(false);
      setFarmForm({ name: "", location: "", latitude: "", longitude: "", area_hectares: "", crop_type: "", soil_type: "" });
      fetchData();
    }
  };

  const deleteFarm = async (id: string) => {
    await supabase.from("farms").delete().eq("id", id);
    fetchData();
  };

  const runSoilScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setScanning(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/soil-scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          farm_id: scanForm.farm_id || null,
          latitude: scanForm.latitude ? parseFloat(scanForm.latitude) : null,
          longitude: scanForm.longitude ? parseFloat(scanForm.longitude) : null,
          soil_description: scanForm.soil_description,
          scan_type: scanForm.scan_type,
        }),
      });
      const data = await resp.json();
      if (data.error) throw new Error(data.error);
      toast({ title: "Analyse terminée", description: "Résultats disponibles !" });
      setShowScan(false);
      fetchData();
    } catch (err: any) {
      toast({ title: "Erreur", description: err.message, variant: "destructive" });
    }
    setScanning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <div className="container py-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">{t("farmer.badge")}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">{t("farmer.title")}</h1>
            <p className="mt-2 text-muted-foreground text-sm">{t("farmer.subtitle")} — {user?.email}</p>
          </motion.div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 border-b border-border pb-0">
            {([
              { key: "farms" as const, label: t("farmer.tab_farms"), icon: MapPin },
              { key: "scans" as const, label: t("farmer.tab_scans"), icon: Scan },
              { key: "map" as const, label: t("farmer.tab_map"), icon: BarChart3 },
            ]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-[1px] transition-colors ${
                  activeTab === tab.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* FARMS TAB */}
          {activeTab === "farms" && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">{t("farmer.my_farms")} ({farms.length})</h2>
                <button onClick={() => setShowAddFarm(!showAddFarm)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  <Plus size={16} /> {t("farmer.add_farm")}
                </button>
              </div>

              {/* Add Farm Form */}
              {showAddFarm && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={addFarm} className="mb-6 p-6 rounded-2xl bg-card border border-border space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("farmer.farm_name")} *</label>
                      <input required value={farmForm.name} onChange={e => setFarmForm(f => ({...f, name: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("farmer.location")}</label>
                      <input value={farmForm.location} onChange={e => setFarmForm(f => ({...f, location: e.target.value}))} placeholder="Ex: Masisi, North Kivu" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Latitude</label>
                      <input type="number" step="any" value={farmForm.latitude} onChange={e => setFarmForm(f => ({...f, latitude: e.target.value}))} placeholder="-1.68" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Longitude</label>
                      <input type="number" step="any" value={farmForm.longitude} onChange={e => setFarmForm(f => ({...f, longitude: e.target.value}))} placeholder="29.22" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("farmer.area")}</label>
                      <input type="number" step="any" value={farmForm.area_hectares} onChange={e => setFarmForm(f => ({...f, area_hectares: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("farmer.crop_type")}</label>
                      <input value={farmForm.crop_type} onChange={e => setFarmForm(f => ({...f, crop_type: e.target.value}))} placeholder="Cassava, Maize..." className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm">{t("farmer.save")}</button>
                    <button type="button" onClick={() => setShowAddFarm(false)} className="px-6 py-2.5 rounded-lg bg-muted text-foreground text-sm">{t("farmer.cancel")}</button>
                  </div>
                </motion.form>
              )}

              {farms.length === 0 ? (
                <div className="text-center py-16">
                  <MapPin size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground text-sm">{t("farmer.no_farms")}</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {farms.map(farm => (
                    <div key={farm.id} className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Leaf size={18} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-display font-semibold text-sm text-foreground">{farm.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {farm.location && `${farm.location} · `}
                            {farm.area_hectares && `${farm.area_hectares} ha · `}
                            {farm.crop_type && farm.crop_type}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteFarm(farm.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 size={16} className="text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SCANS TAB */}
          {activeTab === "scans" && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg font-semibold text-foreground">{t("farmer.soil_analysis")}</h2>
                <button onClick={() => setShowScan(!showScan)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold">
                  <Scan size={16} /> {t("farmer.new_scan")}
                </button>
              </div>

              {showScan && (
                <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} onSubmit={runSoilScan} className="mb-6 p-6 rounded-2xl bg-card border border-border space-y-4">
                  <p className="text-sm text-muted-foreground">{t("farmer.scan_desc")}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {farms.length > 0 && (
                      <div>
                        <label className="text-sm font-medium text-foreground">{t("farmer.select_farm")}</label>
                        <select value={scanForm.farm_id} onChange={e => setScanForm(s => ({...s, farm_id: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm">
                          <option value="">-- {t("farmer.optional")} --</option>
                          {farms.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </div>
                    )}
                    <div>
                      <label className="text-sm font-medium text-foreground">{t("farmer.scan_type")}</label>
                      <select value={scanForm.scan_type} onChange={e => setScanForm(s => ({...s, scan_type: e.target.value}))} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm">
                        <option value="quick">{t("farmer.quick_scan")}</option>
                        <option value="detailed">{t("farmer.detailed_scan")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Latitude</label>
                      <input type="number" step="any" value={scanForm.latitude} onChange={e => setScanForm(s => ({...s, latitude: e.target.value}))} placeholder="-1.68" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Longitude</label>
                      <input type="number" step="any" value={scanForm.longitude} onChange={e => setScanForm(s => ({...s, longitude: e.target.value}))} placeholder="29.22" className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{t("farmer.soil_desc")}</label>
                    <textarea value={scanForm.soil_description} onChange={e => setScanForm(s => ({...s, soil_description: e.target.value}))} rows={3} placeholder={t("farmer.soil_desc_placeholder")} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                  <button type="submit" disabled={scanning} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-semibold text-sm disabled:opacity-50">
                    {scanning ? <><Loader2 size={16} className="animate-spin" /> {t("farmer.analyzing")}</> : <><Scan size={16} /> {t("farmer.run_analysis")}</>}
                  </button>
                </motion.form>
              )}

              {scans.length === 0 ? (
                <div className="text-center py-16">
                  <Scan size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                  <p className="text-muted-foreground text-sm">{t("farmer.no_scans")}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {scans.map(scan => (
                    <motion.div key={scan.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 rounded-xl bg-card border border-border">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Scan size={18} className="text-accent" />
                          <span className="font-display font-semibold text-sm text-foreground">
                            {scan.scan_type === "quick" ? t("farmer.quick_scan") : t("farmer.detailed_scan")}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${scan.status === "completed" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"}`}>
                            {scan.status}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{new Date(scan.created_at).toLocaleDateString()}</span>
                      </div>
                      {scan.results && typeof scan.results === "object" && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                          {scan.results.soil_quality_score && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <div className="text-xs text-muted-foreground">Qualité du sol</div>
                              <div className="font-bold text-lg text-foreground">{scan.results.soil_quality_score}/100</div>
                            </div>
                          )}
                          {scan.results.ph_estimate && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <div className="text-xs text-muted-foreground">pH estimé</div>
                              <div className="font-bold text-lg text-foreground">{scan.results.ph_estimate}</div>
                            </div>
                          )}
                          {scan.results.texture && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <div className="text-xs text-muted-foreground">Texture</div>
                              <div className="font-bold text-sm text-foreground capitalize">{scan.results.texture}</div>
                            </div>
                          )}
                          {scan.results.organic_matter && (
                            <div className="p-3 rounded-lg bg-muted/50">
                              <div className="text-xs text-muted-foreground">Matière organique</div>
                              <div className="font-bold text-sm text-foreground capitalize">{scan.results.organic_matter}</div>
                            </div>
                          )}
                        </div>
                      )}
                      {scan.results?.summary_fr && (
                        <p className="mt-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">{scan.results.summary_fr}</p>
                      )}
                      {scan.results?.recommended_crops && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {scan.results.recommended_crops.map((crop: string) => (
                            <span key={crop} className="px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">{crop}</span>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MAP TAB */}
          {activeTab === "map" && (
            <div className="mt-6">
              <div className="rounded-2xl bg-card border border-border overflow-hidden" style={{ height: "500px" }}>
                <CongoMap />
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerDashboard;
