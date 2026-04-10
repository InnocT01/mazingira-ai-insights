import { SidebarTrigger } from "@/components/ui/sidebar";
import { Globe, Search, LogOut, ChevronDown } from "lucide-react";
import { useLanguage, langNames, langFlags, type Lang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const languages: Lang[] = ["fr", "en", "sw", "ln", "wo", "zu"];

const TopBar = () => {
  const { lang, setLang, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        {/* Language selector dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Globe size={14} />
            <span>{langFlags[lang]} {lang.toUpperCase()}</span>
            <ChevronDown size={12} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-card border border-border shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {languages.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLang(l); setLangOpen(false); }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${
                    l === lang
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <span className="text-sm">{langFlags[l]}</span>
                  <span>{langNames[l]}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <LogOut size={14} />
            {t("nav.signout")}
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
