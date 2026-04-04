import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { CustomCursor } from "./components/ui/custom-cursor";
import { FlickeringGrid } from "./components/ui/flickering-grid";
import ScrollToTop from "./components/utils/ScrollToTop";
import { setApiToastNotifier } from "./lib/api";
import { cn } from "./lib/utils";
import AboutPage from "./pages/AboutPage";
import CitiesPage from "./pages/CitiesPage";
import CityPage from "./pages/CityPage";
import DiscoverPage from "./pages/DiscoverPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import ProgramPage from "./pages/ProgramPage";
import ProgramsPage from "./pages/ProgramsPage";
import UniversitiesPage from "./pages/UniversitiesPage";
import UniversityPage from "./pages/University";

function AppShell() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setApiToastNotifier((msg) => {
      setToast(msg);
      window.setTimeout(() => setToast(null), 5000);
    });
    return () => setApiToastNotifier(null);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <ScrollToTop />
      <CustomCursor />

      {toast && (
        <div
          className="fixed bottom-6 left-1/2 z-[200] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-xl dark:border-white/10 dark:bg-zinc-900 dark:text-slate-100"
          role="status"
        >
          {toast}
        </div>
      )}

      <div className="fixed inset-0 z-0">
        <FlickeringGrid
          className={cn(
            "absolute inset-0 h-full w-full",
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
          squareSize={6}
          gridGap={8}
          color={darkMode ? "#60A5FA" : "#2563eb"}
          maxOpacity={darkMode ? 0.2 : 0.3}
          flickerChance={0.1}
        />
      </div>

      <div className="relative z-10 min-h-screen">
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route
              path="/discover"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <DiscoverPage />
                </div>
              }
            />

            <Route
              path="/universities"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <UniversitiesPage />
                </div>
              }
            />

            <Route
              path="/universities/:slug"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <UniversityPage />
                </div>
              }
            />

            <Route
              path="/cities"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <CitiesPage />
                </div>
              }
            />

            <Route
              path="/cities/:id"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <CityPage />
                </div>
              }
            />

            <Route
              path="/programs/:slug"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <ProgramPage />
                </div>
              }
            />

            <Route
              path="/programs"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <ProgramsPage />
                </div>
              }
            />

            <Route
              path="/favorites"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <FavoritesPage />
                </div>
              }
            />

            <Route
              path="/about"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <AboutPage />
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return <AppShell />;
}
