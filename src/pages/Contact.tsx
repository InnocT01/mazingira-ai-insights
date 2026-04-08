import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Send, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold text-foreground">{t("contact.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("contact.desc")}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-card border border-border space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <MapPin size={15} className="text-primary mt-0.5" />
              <span>Congo-Kinshasa, North Kivu, Q. Kyeshero, Avenue Du Lac 034</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Phone size={15} className="text-primary" />
              <span>+243 835 377 286</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Mail size={15} className="text-primary" />
              <a href="mailto:mazingiracloud@gmail.com" className="hover:text-primary transition-colors">mazingiracloud@gmail.com</a>
            </div>
            <a href="https://web.facebook.com/profile.php?id=61574352483709" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
              <ExternalLink size={14} /> Facebook
            </a>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-5 rounded-xl bg-card border border-border space-y-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-3xl mb-2">✅</div>
              <p className="font-display font-semibold text-foreground text-sm">{t("contact.sent")}</p>
            </div>
          ) : (
            <>
              <div>
                <label className="text-xs font-medium text-foreground">{t("contact.name")}</label>
                <input type="text" required className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Email</label>
                <input type="email" required className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">Message</label>
                <textarea required rows={3} className="mt-1 w-full px-3 py-2 rounded-lg bg-background border border-input text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                {t("contact.send")} <Send size={14} />
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Contact;
