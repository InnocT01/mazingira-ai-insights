import { motion } from "framer-motion";
import { Lock, Leaf, FlaskConical } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo_mazingira.png";

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
          toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profile } = await supabase.from("profiles").select("role").eq("user_id", user.id).single();
            navigate(profile?.role === "researcher" ? "/researcher" : "/dashboard");
          }
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast({ title: "Erreur", description: error.message, variant: "destructive" });
        } else {
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-6">
          <img src={logo} alt="Mazingira" className="h-12 w-auto mx-auto mb-3" />
          <h1 className="font-display text-xl font-bold text-foreground">
            {isLogin ? t("auth.signin") : t("auth.signup")}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isLogin ? t("auth.signin_desc") : t("auth.signup_desc")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-card border border-border space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-medium text-foreground">{t("auth.fullname")}</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-2 block">{t("auth.role")}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setRole("farmer")} className={`p-3 rounded-lg border-2 text-left transition-all ${role === "farmer" ? "border-primary bg-primary/5" : "border-border"}`}>
                    <Leaf size={16} className={role === "farmer" ? "text-primary" : "text-muted-foreground"} />
                    <div className="font-medium text-xs text-foreground mt-1">{t("auth.role_farmer")}</div>
                  </button>
                  <button type="button" onClick={() => setRole("researcher")} className={`p-3 rounded-lg border-2 text-left transition-all ${role === "researcher" ? "border-accent bg-accent/5" : "border-border"}`}>
                    <FlaskConical size={16} className={role === "researcher" ? "text-accent" : "text-muted-foreground"} />
                    <div className="font-medium text-xs text-foreground mt-1">{t("auth.role_researcher")}</div>
                  </button>
                </div>
              </div>
            </>
          )}
          <div>
            <label className="text-xs font-medium text-foreground">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">{t("auth.password")}</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 disabled:opacity-50">
            {loading ? "..." : isLogin ? t("auth.signin") : t("auth.signup")}
          </button>
          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? t("auth.noaccount") : t("auth.hasaccount")}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? t("auth.signup") : t("auth.signin")}
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
