import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import CompareBar from "./components/compare/CompareBar";
import Footer from "./components/layout/Footer";
import CompleteProfileModal from "./components/layout/CompleteProfileModal";
import Navbar from "./components/layout/Navbar";
import GuestOnlyRoute from "./components/routing/GuestOnlyRoute";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import { CustomCursor } from "./components/ui/custom-cursor";
import { FlickeringGrid } from "./components/ui/flickering-grid";
import ScrollToTop from "./components/utils/ScrollToTop";
import { setApiToastNotifier } from "./lib/api";
import { cn } from "./lib/utils";
import AboutPage from "./pages/AboutPage";
import CampusesPage from "./pages/CampusesPage";
import UniversityCampusGalleryPage from "./pages/UniversityCampusGalleryPage";
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
import LoginPage from "./pages/LoginPage";
import AccountPage, { MeRedirect, SettingsRedirect } from "./pages/AccountPage";
import SettingsPage from "./pages/SettingsPage";
import MePage from "./pages/MePage";
import ChatPage from "./pages/ChatPage";
import UserProfilePage from "./pages/UserProfilePage";
import CampusPage from "./pages/CampusPage";
import ElevationZonesPage from "./pages/ElevationZonesPage";
import ElevationZonePage from "./pages/ElevationZonePage";

function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-white pt-20 transition-colors duration-300 dark:bg-[#121212]",
        className
      )}
    >
      {children}
    </div>
  );
}

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
              path="/login"
              element={
                <GuestOnlyRoute>
                  <LoginPage />
                </GuestOnlyRoute>
              }
            />

            <Route
              path="/discover"
              element={
                <PageShell>
                  <DiscoverPage />
                </PageShell>
              }
            />

            <Route
              path="/discover/for-you"
              element={
                <PageShell>
                  <DiscoverSectionPage />
                </PageShell>
              }
            />

            <Route
              path="/discover/:section"
              element={
                <PageShell>
                  <DiscoverSectionPage />
                </PageShell>
              }
            />

            <Route
              path="/universities"
              element={
                <PageShell>
                  <UniversitiesPage />
                </PageShell>
              }
            />

            <Route
              path="/universities/:slug"
              element={
                <PageShell>
                  <UniversityPage />
                </PageShell>
              }
            />

            <Route
              path="/compare"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <ComparePage />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/campuses"
              element={
                <PageShell>
                  <CampusesPage />
                </PageShell>
              }
            />

            <Route
              path="/campuses/gallery/:universityId"
              element={
                <PageShell>
                  <UniversityCampusGalleryPage />
                </PageShell>
              }
            />

            <Route
              path="/cities"
              element={
                <PageShell>
                  <CitiesPage />
                </PageShell>
              }
            />

            <Route
              path="/cities/:id"
              element={
                <PageShell>
                  <CityPage />
                </PageShell>
              }
            />

            <Route
              path="/programs/:slug"
              element={
                <PageShell>
                  <ProgramPage />
                </PageShell>
              }
            />

            <Route
              path="/programs"
              element={
                <PageShell>
                  <ProgramsPage />
                </PageShell>
              }
            />

            <Route
              path="/celebrities"
              element={
                <PageShell>
                  <CelebritiesPage />
                </PageShell>
              }
            />

            <Route
              path="/celebrities/:slugOrId"
              element={
                <PageShell>
                  <CelebrityPage />
                </PageShell>
              }
            />

            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <FavoritesPage />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/about"
              element={
                <PageShell>
                  <AboutPage />
                </PageShell>
              }
            />

            <Route
              path="/forgot-password"
              element={
                <GuestOnlyRoute>
                  <PageShell className="dark:bg-[#121212]">
                    <ForgotPasswordPage />
                  </PageShell>
                </GuestOnlyRoute>
              }
            />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <AccountPage />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsRedirect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/me"
              element={
                <ProtectedRoute>
                  <MeRedirect />
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <PageShell>
                    <ChatPage />
                  </PageShell>
                </ProtectedRoute>
              }
            />

            <Route
              path="/users/:id"
              element={
                <PageShell className="dark:bg-[#121212]">
                  <UserProfilePage />
                </PageShell>
              }
            />

            <Route
              path="/campuses/:slugOrId"
              element={
                <PageShell className="dark:bg-[#121212]">
                  <CampusPage />
                </PageShell>
              }
            />

            <Route
              path="/elevation-zones"
              element={
                <PageShell className="dark:bg-[#121212]">
                  <ElevationZonesPage />
                </PageShell>
              }
            />

            <Route
              path="/elevation-zones/:slug"
              element={
                <PageShell className="dark:bg-[#121212]">
                  <ElevationZonePage />
                </PageShell>
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
