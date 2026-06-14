import { motion } from "motion/react";
import { Github, Linkedin, Mail, Instagram, Twitter, Youtube } from "lucide-react";

const SOCIALS = [
  { icon: <Github size={18} />, label: "GitHub", href: "https://github.com/Pyown-kun", handle: "Pyown-Kun" },
  //{ icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com/in/andrea-ramadhan-4a8d6bd", handle: "andrea-ramadhan" },
  { icon: <Instagram size={18} />, label: "Instagram", href: "https://www.instagram.com/andrea_rca3?igsh=MTc0MXR0eWwxamxqOQ==", handle: "Andrea Ramadhan C.A" },
  //{ icon: <Twitter size={18} />, label: "Twitter / X", href: "#", handle: "@andrea_aryana" },
  { icon: <Mail size={18} />, label: "Email", href: "mailto:andrearamadhan123@gmail.com", handle: "andrearamadhan123@gmail.com" },
];

const QUICK_LINKS = [
  { label: "Tentang Saya", href: "#about" },
  { label: "Game Demo", href: "#play" },
  { label: "Proyek", href: "#projects" },
  { label: "Kontak", href: "mailto:andrearamadhan123@gmail.com" },
];

export function FooterSection() {
  return (
    <footer id="contact" style={{ background: "#08080f", fontFamily: "'Rajdhani', sans-serif", borderTop: "1px solid rgba(37,99,235,0.2)" }}>
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand col */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}>
            <div className="mb-4">
              <span style={{ color: "#60a5fa", letterSpacing: "0.2em", fontSize: "1.4rem", fontWeight: 700 }}>
                AR<span style={{ color: "#e8e8f0" }}>CA</span>
              </span>
            </div>
            <p style={{ color: "#8888aa", fontSize: "0.83rem", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: "1.2rem", maxWidth: "240px" }}>
              Game developer &amp; 3D artist yang bersemangat membangun dunia virtual dari Wonogiri, Indonesia.
            </p>
            {/* Status badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(5,150,105,0.12)", border: "1px solid rgba(5,150,105,0.3)", padding: "5px 12px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "pulse 2s infinite" }} />
              <span style={{ color: "#10b981", fontSize: "0.65rem", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono', monospace" }}>OPEN FOR WORK</span>
            </div>
          </motion.div>

          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}>
            <p style={{ color: "#8888aa", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>NAVIGASI</p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {QUICK_LINKS.map(l => (
                <li key={l.label} className="mb-3">
                  <a
                    href={l.href}
                    style={{ color: "#c4c4d4", textDecoration: "none", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", transition: "color 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#60a5fa"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#c4c4d4"; }}>
                    <span style={{ color: "#2563eb", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace" }}>→</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}>
            <p style={{ color: "#8888aa", fontSize: "0.65rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "1rem" }}>SOSIAL MEDIA</p>
            <div className="space-y-3">
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3"
                  style={{ textDecoration: "none", transition: "all 0.2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#60a5fa"; el.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "#8888aa"; el.style.transform = "translateX(0)"; }}>
                  <span style={{ color: "#8888aa", transition: "color 0.2s", display: "flex" }}>{s.icon}</span>
                  <div>
                    <span style={{ color: "#8888aa", fontSize: "0.68rem", letterSpacing: "0.1em", display: "block", fontFamily: "'JetBrains Mono', monospace" }}>{s.label.toUpperCase()}</span>
                    <span style={{ color: "#c4c4d4", fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>{s.handle}</span>
                  </div>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(37,99,235,0.15)", padding: "16px 24px" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ color: "#555577", fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
            © 2024 ANDREA RAMADHAN CAHYA ARYANA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4">
            <span style={{ color: "#555577", fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace" }}>
              BUILT WITH REACT + TAILWIND
            </span>
            <span style={{ color: "#2563eb", fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace" }}>
              v1.0.0
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
}
