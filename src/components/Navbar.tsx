import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo_mazingira.png";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/open-data", label: t("nav.opendata") },
    { to: "/ai", label: t("nav.ai") },
    { to: "/about", label: t("nav.about") },
    { to: "/contact", label: t("nav.contact") },
    ...(user ? [{ to: "/dashboard", label: t("nav.dashboard") }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Mazingira Cloud" className="h-10 w-auto" />
          <span className="font-display font-bold text-lg text-foreground hidden sm:inline">
            Mazingira Cloud
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            className="ml-1 px-2 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
            title={lang === "en" ? "Passer en français" : "Switch to English"}
          >
            <Globe size={16} />
            {lang === "en" ? "FR" : "EN"}
          </button>

          {user ? (
            <button
              onClick={() => signOut()}
              className="ml-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              {t("nav.signout")}
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              {t("nav.signin")}
            </Link>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-foreground">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-b border-border bg-background">
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === link.to ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label}
                </Link>
              ))}
              <button onClick={() => setLang(lang === "en" ? "fr" : "en")} className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-1">
                <Globe size={16} />
                {lang === "en" ? "Français" : "English"}
              </button>
              {user ? (
                <button onClick={() => { signOut(); setOpen(false); }} className="mt-2 px-4 py-2 rounded-lg bg-muted text-foreground text-sm font-semibold text-center">
                  {t("nav.signout")}
                </button>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="mt-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold text-center">
                  {t("nav.signin")}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
