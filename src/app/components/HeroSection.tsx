import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Menu, X, Github, Linkedin, Mail, Instagram } from "lucide-react";

export function HeroSection() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Home", "Play", "About", "Projects", "Contact"];

  return (
    <section
      id="home"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background gradient mesh */}
      <div className="absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 80% 60% at 60% 30%, rgba(37,99,235,0.18) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(37,99,235,,0.10) 0%, transparent 60%), #0a0a14"
      }} />

      {/* Grid lines overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.04]" style={{
        backgroundImage: "linear-gradient(rgba(37,99,235,1) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,1) 1px, transparent 1px)",
        backgroundSize: "60px 60px"
      }} />

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`}
        style={{ background: scrolled ? "rgba(10,10,20,0.88)" : "transparent", backdropFilter: scrolled ? "blur(16px)" : "none", borderBottom: scrolled ? "1px solid rgba(37,99,235,0.15)" : "none" }}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span style={{ color: "#60a5fa", letterSpacing: "0.15em", fontSize: "1.1rem" }} className="select-none">
              AR<span style={{ color: "#e8e8f0" }}>CA</span>
            </span>
          </motion.div>

          {/* Desktop nav */}
          <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="hidden md:flex gap-8 list-none m-0 p-0">
            {navLinks.map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`}
                  style={{ color: "#8888aa", fontSize: "0.9rem", letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#8888aa")}
                  className="uppercase">
                  {l}
                </a>
              </li>
            ))}
          </motion.ul>

          {/* Social icons desktop */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:flex items-center gap-4">
            <a href="https://github.com/Pyown-kun" target="_blank" rel="noreferrer" style={{ color: "#8888aa", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8888aa")}>
              <Github size={18} />
            </a>
            <a href="https://www.instagram.com/andrea_rca3?igsh=MTc0MXR0eWwxamxqOQ==" target="_blank" rel="noreferrer" style={{ color: "#8888aa", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8888aa")}>
              <Instagram size={18} />
            </a>
            {/* <a href="https://linkedin.com/in/andrea-ramadhan-4a8d6bd" target="_blank" rel="noreferrer" style={{ color: "#8888aa", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8888aa")}>
              <Linkedin size={18} />
            </a> */}
            <a href="mailto:andrearamadhan123@gmail.com" style={{ color: "#8888aa", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
              onMouseLeave={e => (e.currentTarget.style.color = "#8888aa")}>
              <Mail size={18} />
            </a>
          </motion.div>

          {/* Mobile menu toggle */}
          <button className="md:hidden" style={{ color: "#e8e8f0", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-6 pt-4 pb-6" style={{ background: "rgba(10,10,20,0.97)", borderTop: "1px solid rgba(37,99,235,0.15)" }}>
            {navLinks.map((l) => (
              <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}
                style={{ display: "block", padding: "10px 0", color: "#c4c4d4", textDecoration: "none", letterSpacing: "0.1em", fontSize: "0.9rem" }}
                className="uppercase border-b border-[rgba(37,99,235,0.1)] last:border-0">
                {l}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-20 min-h-screen flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text */}
          <div>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              style={{ color: "#60a5fa", letterSpacing: "0.25em", fontSize: "0.8rem", marginBottom: "1rem", fontFamily: "'JetBrains Mono', monospace" }}>
              &lt; PORTFOLIO /&gt;
            </motion.p>

            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
              style={{
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                lineHeight: 1.05,
                color: "#e8e8f0",
                letterSpacing: "-0.01em",
                marginBottom: "0.5rem",
                fontWeight: 700
              }}>
              ANDREA<br />
              <span style={{ color: "#60a5fa" }}>RAMADHAN</span>
            </motion.h1>

            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
              style={{ color: "#8888aa", fontSize: "1.1rem", letterSpacing: "0.2em", marginBottom: "1.5rem", fontWeight: 400 }}>
              GAME DEVELOPER · 3D ARTIST · WEB DEV
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
              style={{ color: "#c4c4d4", lineHeight: 1.7, maxWidth: "420px", marginBottom: "2rem", fontFamily: "'DM Sans', sans-serif", fontSize: "0.95rem", fontWeight: 300 }}>
              Mahasiswa yang bersemangat dalam membangun dunia virtual — dari game 2D/3D hingga aplikasi web. Saat ini menempuh studi di STMIK AMIKOM Surakarta.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}
              className="flex gap-4 flex-wrap">
              <a href="#projects"
                style={{
                  background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                  color: "#fff",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                  display: "inline-block",
                  transition: "opacity 0.2s, transform 0.2s",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.85"; (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; }}>
                LIHAT PROYEK
              </a>
              <a href="#play"
                style={{
                  border: "1px solid rgba(37,99,235,,0.5)",
                  color: "#60a5fa",
                  padding: "0.75rem 2rem",
                  textDecoration: "none",
                  letterSpacing: "0.15em",
                  fontSize: "0.8rem",
                  display: "inline-block",
                  transition: "background 0.2s, color 0.2s",
                  clipPath: "polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px))"
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
                MAIN GAME
              </a>
            </motion.div>
          </div>

          {/* Right — overlapping rotated photo blocks (like Layout.png) */}
          <div className="relative hidden lg:block" style={{ height: "420px" }}>
            {/* Back block — rotated */}
            <motion.div
              initial={{ opacity: 0, rotate: -15, scale: 0.8 }}
              animate={{ opacity: 1, rotate: -8, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, type: "spring", stiffness: 80 }}
              style={{
                position: "absolute",
                left: "0px",
                top: "40px",
                width: "240px",
                height: "300px",
                border: "2px solid rgba(37,99,235,0.4)",
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
              }}>
              <img
                src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=480&h=600&fit=crop&auto=format"
                alt="Game development workspace"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(0.8)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(37,99,235,0.3), transparent)" }} />
            </motion.div>

            {/* Front block — upright */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.5, type: "spring", stiffness: 80 }}
              style={{
                position: "absolute",
                right: "0px",
                top: "0px",
                width: "260px",
                height: "340px",
                border: "2px solid rgba(37,99,235,,0.5)",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(37,99,235,0.3)"
              }}>
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=520&h=680&fit=crop&auto=format"
                alt="Gaming setup"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.75) saturate(0.7)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, transparent, rgba(37,99,235,,0.25))" }} />
              {/* Label overlay */}
              <div style={{
                position: "absolute",
                bottom: "16px",
                left: "16px",
                background: "rgba(10,10,20,0.85)",
                border: "1px solid rgba(37,99,235,,0.4)",
                padding: "8px 14px",
                backdropFilter: "blur(8px)"
              }}>
                <span style={{ color: "#60a5fa", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace" }}>
                  GAME.DEV
                </span>
              </div>
            </motion.div>

            {/* Decorative corner accent */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              style={{
                position: "absolute",
                right: "-20px",
                bottom: "20px",
                width: "80px",
                height: "80px",
                border: "1px solid rgba(37,99,235,0.3)",
                borderRadius: "50%",
                pointerEvents: "none"
              }} />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "#8888aa" }}>
          <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace" }}>SCROLL</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: "1px", height: "32px", background: "linear-gradient(to bottom, #60a5fa, transparent)" }} />
        </motion.div>
      </div>
    </section>
  );
}
