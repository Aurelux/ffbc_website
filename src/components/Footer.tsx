import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.footer.contact}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-2">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <span>
                  Fédération Française de Belote et Coinche
                  <br />
                  {t.home.about.address}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={18} />
                <span>contact@ffbc.fr</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t.home.quickLinks.title}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/regles" className="hover:text-accent-light transition-smooth">
                  {t.nav.rules}
                </a>
              </li>
              <li>
                <a href="/tournois" className="hover:text-accent-light transition-smooth">
                  {t.nav.tournaments}
                </a>
              </li>
              <li>
                <a href="/affiliation" className="hover:text-accent-light transition-smooth">
                  {t.nav.affiliation}
                </a>
              </li>
              <li>
                <a href="/classements" className="hover:text-accent-light transition-smooth">
                  {t.nav.rankings}
                </a>
              </li>
            </ul>
          </div>

          {/* Social & Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">Social</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-light transition-smooth"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-light transition-smooth"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-light transition-smooth"
              >
                <Instagram size={24} />
              </a>
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/mentions-legales" className="hover:text-accent-light transition-smooth">
                  {t.footer.legal}
                </a>
              </li>
              <li>
                <a href="/politique-confidentialite" className="hover:text-accent-light transition-smooth">
                  {t.footer.privacy}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-light mt-8 pt-8 text-center text-sm">
          <p>© {new Date().getFullYear()} Fédération Française de Belote et Coinche. {t.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
};
