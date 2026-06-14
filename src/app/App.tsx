import "../../src/styles/fonts.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HeroSection } from "./components/HeroSection";
import { GameSection } from "./components/GameSection";
import { AboutSection } from "./components/AboutSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { FooterSection } from "./components/FooterSection";
import AdminPage from "./components/AdminPage";

/* ─── Halaman utama portfolio (tidak berubah) ─── */
function PortfolioHome() {
  return (
    <div
      style={{
        background: "#0a0a14",
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        overflowX: "hidden",
        scrollBehavior: "smooth",
      }}>
      <HeroSection />
      <GameSection />
      <AboutSection />
      <ProjectsSection />
      <FooterSection />
    </div>
  );
}

/* ─── Root App dengan routing ─── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Portfolio utama */}
        <Route path="/" element={<PortfolioHome />} />

        {/* Halaman admin tersembunyi — akses via /admin */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}