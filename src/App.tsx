import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import { CustomCursor } from "./components/ui/custom-cursor";
import { FlickeringGrid } from "./components/ui/flickering-grid";
import ScrollToTop from "./components/utils/ScrollToTop";
import { cn } from "./lib/utils";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import ProgramsPage from "./pages/ProgramsPage";
import UniversitiesPage from "./pages/UniversitiesPage";
import UniversityPage from "./pages/University";

export default function App() {
  // Initialize dark mode based on system preference or localStorage
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Otherwise, use system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    // Save user preference
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <>
      <ScrollToTop />
      <CustomCursor />
      
      {/* Fixed Flickering Grid Background */}
      <div className="fixed inset-0 z-0">
        <FlickeringGrid
          className={cn(
            "absolute inset-0 w-full h-full",
            "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
          )}
          squareSize={6}
          gridGap={8}
          color={darkMode ? "#60A5FA" : "#2563eb"}
          maxOpacity={darkMode ? 0.2 : 0.3}
          flickerChance={0.1}
        />
      </div>
      
      <div className="min-h-screen relative z-10">
        <Navbar 
          darkMode={darkMode} 
          toggleDarkMode={() => setDarkMode(!darkMode)} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            <Route path="/universities" element={
              <div className="pt-20 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
                <UniversitiesPage />
              </div>
            } />
            
            <Route path="/universities/:id" element={
              <div className="pt-20 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
                <UniversityPage />
              </div>
            } />
            
            <Route path="/programs" element={
              <div className="pt-20 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
                <ProgramsPage />
              </div>
            } />

            <Route path="/about" element={
              <div className="pt-20 min-h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
                <AboutPage />
              </div>
            } />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}