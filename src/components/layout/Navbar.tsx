import { GraduationCap, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import finaskLogo from "../../assets/finask-logo.png";

const Navbar = ({ 
  darkMode, 
  toggleDarkMode
}: { 
  darkMode: boolean; 
  toggleDarkMode: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close menu when scrolling away
      } else {
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-transform duration-500 w-full px-4 sm:px-6",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <nav className={cn(
        "mx-auto transition-all duration-500 border border-transparent",
        isScrolled 
          ? "mt-4 max-w-5xl bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-full px-6 py-2" 
          : "mt-0 max-w-7xl bg-white/50 dark:bg-[#1a1a1a]/50 backdrop-blur-md px-2 py-4"
      )}>
        <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={finaskLogo} alt="Finask Logo" className="h-8 w-auto object-contain" />
        </Link>

        {/* Desktop Links - Using Link instead of buttons */}
        <div className="hidden md:flex items-center gap-8 text-sm font-normal">
          {[
            { name: "Home", path: "/" },
            { name: "Universities", path: "/universities" },
            { name: "Programs", path: "/programs" },
            { name: "About", path: "/about" }
          ].map(link => {
            const active = isActive(link.path);
            return (
              <Link 
                key={link.name}
                to={link.path}
                className={cn(
                  "group relative pb-1 transition-colors",
                  active ? "text-brand-blue" : "text-black dark:text-white hover:text-brand-blue"
                )}
              >
                {link.name}
                <span className={cn(
                  "absolute bottom-0 left-1/2 -translate-x-1/2 h-[1.5px] bg-brand-blue transition-all duration-700 ease-out rounded-full",
                  active ? "w-full" : "w-0 group-hover:w-5"
                )} />
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="hidden md:block px-6 py-2.5 bg-brand-blue text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            Sign In
          </button>
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-white/80 dark:bg-[#1e1e1e]/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {[
              { name: "Home", path: "/" },
              { name: "Universities", path: "/universities" },
              { name: "Programs", path: "/programs" },
              { name: "About", path: "/about" }
            ].map(link => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={closeMenu} 
                className={cn(
                  "text-lg font-normal text-left transition-colors", 
                  isActive(link.path) ? "text-brand-blue" : "text-black dark:text-white hover:text-brand-blue"
                )}
              >
                {link.name}
              </Link>
            ))}
            <button className="w-full py-3 bg-brand-blue text-white rounded-xl font-semibold mt-2">
              Sign In
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
