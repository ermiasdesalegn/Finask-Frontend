import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";
import finaskLogo from "../../assets/finask-logo.png";
import LoginModal from "./LoginModal";

const Navbar = ({
  darkMode,
  toggleDarkMode,
}: {
  darkMode: boolean;
  toggleDarkMode: () => void;
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 w-full px-4 transition-transform duration-500 sm:px-6",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav
          className={cn(
            "mx-auto border border-transparent transition-all duration-500",
            isScrolled
              ? "mt-4 max-w-5xl rounded-full bg-white/60 px-6 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:bg-[#1a1a1a]/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)]"
              : "mt-0 max-w-7xl bg-white/50 px-2 py-4 backdrop-blur-md dark:bg-[#1a1a1a]/50"
          )}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={finaskLogo}
                alt="Finask Logo"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="hidden items-center gap-8 text-sm font-normal md:flex">
              {[
                { name: "Home", path: "/" },
                { name: "Universities", path: "/universities" },
                { name: "Programs", path: "/programs" },
                { name: "About", path: "/about" },
              ].map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "group relative pb-1 transition-colors",
                      active
                        ? "text-brand-blue"
                        : "text-black hover:text-brand-blue dark:text-white"
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 h-[1.5px] -translate-x-1/2 rounded-full bg-brand-blue transition-all duration-700 ease-out",
                        active ? "w-full" : "w-0 group-hover:w-5"
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="rounded-full p-2 transition-colors hover:bg-slate-100 dark:hover:bg-white/10"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {isAuthenticated && user ? (
                <div className="hidden items-center gap-3 md:flex">
                  <span className="max-w-[140px] truncate text-sm font-medium text-slate-700 dark:text-slate-300">
                    {user.firstName || user.email}
                  </span>
                  <button
                    type="button"
                    onClick={() => logout()}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="hidden rounded-full bg-brand-blue px-6 py-2.5 font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-700 md:block"
                >
                  Sign In
                </button>
              )}
              <button
                type="button"
                className="p-2 md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute left-0 right-0 top-full flex flex-col gap-4 border-t border-slate-100 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#1e1e1e]/80 md:hidden"
            >
              {[
                { name: "Home", path: "/" },
                { name: "Universities", path: "/universities" },
                { name: "Programs", path: "/programs" },
                { name: "About", path: "/about" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={cn(
                    "text-left text-lg font-normal transition-colors",
                    isActive(link.path)
                      ? "text-brand-blue"
                      : "text-black hover:text-brand-blue dark:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated && user ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 font-semibold dark:border-white/10"
                >
                  <LogOut size={18} />
                  Log out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    setLoginOpen(true);
                  }}
                  className="mt-2 w-full rounded-xl bg-brand-blue py-3 font-semibold text-white"
                >
                  Sign In
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Navbar;
