import {
    GitCompare,
    Heart,
    LogOut,
    Menu,
    Moon,
    Settings,
    Sun,
    UserCircle,
    X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import finaskLogo from "../../assets/finask-logo.png";
import { useAuth } from "../../context/AuthContext";
import { useCompare } from "../../context/CompareContext";
import { useLoginModal } from "../../context/LoginModalContext";
import { comparePathFromUniversityIds } from "../../lib/compareQueue";
import { cn } from "../../lib/utils";
import UserMenu from "./UserMenu";

const iconBtn =
  "flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10";

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
  const { openLogin } = useLoginModal();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { ids: compareIds } = useCompare();
  const compareDest = comparePathFromUniversityIds(compareIds);

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

  const onFavoritesPage = location.pathname === "/favorites";
  const onComparePage = location.pathname === "/compare";

  const closeMenu = () => setIsMobileMenuOpen(false);

  const mainNavLinks = [
    { name: "Home", path: "/" },
    { name: "Discover", path: "/discover" },
    { name: "Universities", path: "/universities" },
    { name: "Cities", path: "/cities" },
    { name: "Programs", path: "/programs" },
    { name: "About", path: "/about" },
  ] as const;

  const condensedHidden = new Set(["About"]);
  const visibleNavLinks = isScrolled
    ? mainNavLinks.filter((l) => !condensedHidden.has(l.name))
    : mainNavLinks;

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] w-full px-4 transition-transform duration-500 sm:px-6",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <nav
          className={cn(
            "mx-auto border border-transparent transition-all duration-500",
            isScrolled
              ? "mt-3 max-w-6xl rounded-full bg-white/70 px-4 py-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl dark:bg-[#1a1a1a]/70 dark:shadow-[0_8px_30px_rgb(0,0,0,0.45)]"
              : "mt-0 max-w-7xl bg-white/50 px-2 py-3.5 backdrop-blur-md dark:bg-[#1a1a1a]/50"
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex shrink-0 items-center gap-2">
              <img
                src={finaskLogo}
                alt="Finask"
                className="h-8 w-auto object-contain"
              />
            </Link>

            <div className="hidden min-w-0 flex-1 items-center justify-center gap-6 text-sm font-medium lg:flex xl:gap-8">
              {visibleNavLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={cn(
                      "group relative shrink-0 whitespace-nowrap pb-1 transition-colors",
                      active
                        ? "text-brand-blue"
                        : "text-slate-800 hover:text-brand-blue dark:text-slate-100"
                    )}
                  >
                    {link.name}
                    <span
                      className={cn(
                        "absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-brand-blue transition-all duration-500",
                        active ? "w-full" : "w-0 group-hover:w-4"
                      )}
                    />
                  </Link>
                );
              })}
            </div>

            <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
              <div className="flex items-center rounded-full border border-slate-200/60 bg-white/60 p-0.5 dark:border-white/10 dark:bg-black/20">
                <button
                  type="button"
                  onClick={() => navigate(compareDest)}
                  className={cn(iconBtn, onComparePage && "text-brand-blue")}
                  aria-label="Compare universities (up to 3)"
                  title="Compare universities (max 3)"
                >
                  <span className="relative">
                    <GitCompare size={18} />
                    {compareIds.length > 0 && (
                      <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-blue px-0.5 text-[9px] font-bold text-white">
                        {compareIds.length}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/favorites")}
                  className={cn(iconBtn)}
                  aria-label="Favorites"
                  title="Favorites"
                >
                  <Heart
                    size={18}
                    className={
                      onFavoritesPage
                        ? "fill-brand-blue text-brand-blue"
                        : undefined
                    }
                  />
                </button>
                <button
                  type="button"
                  onClick={toggleDarkMode}
                  className={iconBtn}
                  aria-label="Toggle theme"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>

              {isAuthenticated && user ? (
                <UserMenu />
              ) : (
                <button
                  type="button"
                  onClick={() => openLogin()}
                  className="hidden rounded-full bg-brand-blue px-5 py-2 text-sm font-bold text-white shadow-md shadow-brand-blue/20 transition-all hover:bg-blue-700 md:block"
                >
                  Sign in
                </button>
              )}

              <button
                type="button"
                className={cn(iconBtn, "md:hidden")}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mx-auto mt-2 max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/95 md:hidden"
            >
              <div className="flex flex-col gap-1 p-3">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={closeMenu}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-base font-semibold transition-colors",
                      isActive(link.path)
                        ? "bg-brand-blue/10 text-brand-blue"
                        : "text-slate-800 hover:bg-slate-50 dark:text-white dark:hover:bg-white/5"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {isAuthenticated && user ? (
                <div className="border-t border-slate-100 p-3 dark:border-white/10">
                  <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    Account
                  </p>
                  <Link
                    to="/account"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-800 dark:text-white"
                  >
                    <UserCircle size={20} className="text-slate-400" />
                    Account
                  </Link>
                  <Link
                    to="/chat"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-slate-800 dark:text-white"
                  >
                    <Settings size={20} className="text-slate-400" />
                    Chat
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      void logout();
                    }}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 py-3 font-semibold text-rose-600 dark:border-white/10 dark:text-rose-400"
                  >
                    <LogOut size={18} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="border-t border-slate-100 p-3 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      openLogin();
                    }}
                    className="w-full rounded-2xl bg-brand-blue py-3.5 font-bold text-white"
                  >
                    Sign in
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
