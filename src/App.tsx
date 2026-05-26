import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CompareBar from "./components/compare/CompareBar";
import Footer from "./components/layout/Footer";
import CompleteProfileModal from "./components/layout/CompleteProfileModal";
import Navbar from "./components/layout/Navbar";
import { CustomCursor } from "./components/ui/custom-cursor";
import { FlickeringGrid } from "./components/ui/flickering-grid";
import ScrollToTop from "./components/utils/ScrollToTop";
import { setApiToastNotifier } from "./lib/api";
import { cn } from "./lib/utils";
import AboutPage from "./pages/AboutPage";
import CampusesPage from "./pages/CampusesPage";
import CelebritiesPage from "./pages/CelebritiesPage";
import CelebrityPage from "./pages/CelebrityPage";
import CitiesPage from "./pages/CitiesPage";
import CityPage from "./pages/CityPage";
import ComparePage from "./pages/ComparePage";
import DiscoverPage from "./pages/DiscoverPage";
import DiscoverSectionPage from "./pages/DiscoverSectionPage";
import FavoritesPage from "./pages/FavoritesPage";
import HomePage from "./pages/HomePage";
import ProgramPage from "./pages/ProgramPage";
import ProgramsPage from "./pages/ProgramsPage";
import UniversitiesPage from "./pages/UniversitiesPage";
import UniversityPage from "./pages/University";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AccountPage, { MeRedirect, SettingsRedirect } from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import MePage from "./pages/MePage";
import ChatPage from "./pages/ChatPage";
import UserProfilePage from "./pages/UserProfilePage";
import CampusPage from "./pages/CampusPage";
import ElevationZonesPage from "./pages/ElevationZonesPage";
import ElevationZonePage from "./pages/ElevationZonePage";

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
      <CompleteProfileModal />

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

      <div className="relative z-10 min-h-screen overflow-x-hidden">
        <Navbar
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(!darkMode)}
        />
        <CompareBar />

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
              path="/discover/:section"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <DiscoverSectionPage />
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
              path="/compare"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <ComparePage />
                </div>
              }
            />

            <Route
              path="/campuses"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <CampusesPage />
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
              path="/celebrities"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <CelebritiesPage />
                </div>
              }
            />

            <Route
              path="/celebrities/:slugOrId"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <CelebrityPage />
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

            <Route
              path="/forgot-password"
              element={
                <div className="min-h-screen bg-white pt-20 dark:bg-[#121212]">
                  <ForgotPasswordPage />
                </div>
              }
            />

            <Route
              path="/account"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <AccountPage />
                </div>
              }
            />

            <Route path="/settings" element={<SettingsRedirect />} />
            <Route path="/me" element={<MeRedirect />} />

            <Route
              path="/chat"
              element={
                <div className="min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]">
                  <ChatPage />
                </div>
              }
            />

            <Route
              path="/users/:id"
              element={
                <div className="min-h-screen bg-white pt-20 dark:bg-[#121212]">
                  <UserProfilePage />
                </div>
              }
            />

            <Route
              path="/campuses/:slugOrId"
              element={
                <div className="min-h-screen bg-white pt-20 dark:bg-[#121212]">
                  <CampusPage />
                </div>
              }
            />

            <Route
              path="/elevation-zones"
              element={
                <div className="min-h-screen bg-white pt-20 dark:bg-[#121212]">
                  <ElevationZonesPage />
                </div>
              }
            />

            <Route
              path="/elevation-zones/:slug"
              element={
                <div className="min-h-screen bg-white pt-20 dark:bg-[#121212]">
                  <ElevationZonePage />
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
