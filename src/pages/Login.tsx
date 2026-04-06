import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Lock, Leaf, FlaskConical } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"farmer" | "researcher">("farmer");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          // Check user role and redirect
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single();
            if (profile?.role === "researcher") {
              navigate("/researcher");
            } else {
              navigate("/dashboard");
            }
          }
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        } else {
          // Update role in profile
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("profiles").update({ role, full_name: fullName }).eq("user_id", user.id);
          }
          toast({ title: "Succès", description: t("auth.account_created") });
          navigate(role === "researcher" ? "/researcher" : "/dashboard");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Lock size={24} className="text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              {isLogin ? t("auth.signin") : t("auth.signup")}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin ? t("auth.signin_desc") : t("auth.signup_desc")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-card border border-border space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground">{t("auth.fullname")}</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>

                {/* Role selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">{t("auth.role")}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("farmer")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${role === "farmer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <Leaf size={20} className={role === "farmer" ? "text-primary" : "text-muted-foreground"} />
                      <div className="font-display font-semibold text-sm text-foreground mt-2">{t("auth.role_farmer")}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{t("auth.role_farmer_desc")}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("researcher")}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${role === "researcher" ? "border-accent bg-accent/5" : "border-border hover:border-accent/30"}`}
                    >
                      <FlaskConical size={20} className={role === "researcher" ? "text-accent" : "text-muted-foreground"} />
                      <div className="font-display font-semibold text-sm text-foreground mt-2">{t("auth.role_researcher")}</div>
                      <div className="text-[11px] text-muted-foreground mt-1">{t("auth.role_researcher_desc")}</div>
                    </button>
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-sm font-medium text-foreground">{t("auth.email")}</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">{t("auth.password")}</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-4 py-2.5 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
              {loading ? "..." : isLogin ? t("auth.signin") : t("auth.signup")}
            </button>
            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? t("auth.noaccount") : t("auth.hasaccount")}{" "}
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
                {isLogin ? t("auth.signup") : t("auth.signin")}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
