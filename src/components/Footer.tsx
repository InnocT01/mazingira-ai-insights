import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import logo from "@/assets/logo_mazingira.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-earth-deep text-primary-foreground">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Mazingira Cloud" className="h-12 w-auto rounded-lg" />
              <span className="font-display font-bold text-xl">Mazingira Cloud</span>
            </div>
            <p className="text-primary-foreground/70 text-sm max-w-md leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">{t("footer.platform")}</h4>
            <div className="flex flex-col gap-2">
              <Link to="/dashboard" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.opendata")}</Link>
              <Link to="/ai" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.ai")}</Link>
              <Link to="/explorer" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.explorer")}</Link>
              <Link to="/about" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">{t("nav.about")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">{t("footer.contact")}</h4>
            <div className="flex flex-col gap-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-1 shrink-0" />
                <span>North Kivu, Q. Kyeshero, Avenue Du Lac 034, DRC</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                <span>+243 835 377 286</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" />
                <span>mazingiracloud@gmail.com</span>
              </div>
              <a
                href="https://web.facebook.com/profile.php?id=61574352483709"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors mt-1"
              >
                <ExternalLink size={14} className="shrink-0" />
                <span>{t("footer.followus")}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} Mazingira Cloud. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
