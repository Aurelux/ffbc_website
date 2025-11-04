import { useState } from "react";
import { Menu, X, Globe, LogOut, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo from "/src/logo.png"


export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const navItems = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.rules, path: "/regles" },
    { name: t.nav.tournaments, path: "/tournois" },
    { name: t.nav.affiliation, path: "/affiliation" },
    { name: t.nav.rankings, path: "/classements" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-primary/95 backdrop-blur-sm z-50 border-b border-primary-light shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center shadow-lg overflow-hidden">
    <img src={Logo} alt="FFBC Logo" className="w-full h-full object-contain" />
  </div>
            <span className="text-primary-foreground font-bold text-lg hidden md:block">
              Fédération Française de Belote et Coinche
            </span>
            <span className="text-primary-foreground font-bold text-lg md:hidden">
              FFBC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "text-primary-foreground hover:bg-primary-light transition-smooth",
                    location.pathname === item.path && "bg-background/20 text-primary-foreground font-semibold"
                  )}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary-light">
                  <Globe className="w-4 h-4 mr-2" />
                  {language.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLanguage('fr')}>
                  Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {user ? (
              <>
                <Link to="/profile">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary-light">
                    {t.nav.profile}
                  </Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="secondary" className="bg-background/20 text-primary-foreground hover:bg-background/30">
                      <Shield className="w-4 h-4 mr-2" />
                      {t.nav.admin}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="text-primary-foreground hover:bg-primary-light"
                  onClick={signOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t.nav.logout}
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button className="bg-accent hover:bg-accent-dark text-accent-foreground">
                  {t.nav.login}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-primary-foreground p-2 hover:bg-primary-light rounded-lg transition-smooth"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-primary-light">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
                  <Button
                    variant={location.pathname === item.path ? "secondary" : "ghost"}
                    className={cn(
                      "w-full text-primary-foreground hover:bg-primary-light transition-smooth justify-start",
                      location.pathname === item.path && "bg-background/20 font-semibold"
                    )}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              
              <Button
                variant="ghost"
                onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
                className="justify-start text-primary-foreground hover:bg-primary-light"
              >
                <Globe className="w-4 h-4 mr-2" />
                {language === 'fr' ? 'English' : 'Français'}
              </Button>

              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start text-primary-foreground hover:bg-primary-light">
                      {t.nav.profile}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsOpen(false)}>
                      <Button variant="secondary" className="w-full justify-start bg-background/20 text-primary-foreground">
                        <Shield className="w-4 h-4 mr-2" />
                        {t.nav.admin}
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="justify-start text-primary-foreground hover:bg-primary-light"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t.nav.logout}
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-accent hover:bg-accent-dark text-accent-foreground">
                    {t.nav.login}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
