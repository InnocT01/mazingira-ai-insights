import { SidebarTrigger } from "@/components/ui/sidebar";
import { Globe, Search, LogOut } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <header className="h-14 flex items-center border-b border-border bg-background px-3 gap-3 shrink-0">
      <SidebarTrigger />

      <div className="flex-1 flex items-center gap-3 max-w-xl">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-muted/50 border-none text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setLang(lang === "en" ? "fr" : "en")}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Globe size={14} />
          {lang === "en" ? "FR" : "EN"}
        </button>

        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={14} />
            {!user ? "" : t("nav.signout")}
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            {t("nav.signin")}
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
