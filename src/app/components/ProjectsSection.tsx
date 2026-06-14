/**
 * ProjectsSection.tsx  — versi CMS-aware
 *
 * Perubahan dari versi asli:
 *  - Konstanta PROJECTS digantikan oleh useCMSProjects() hook
 *  - Data dibaca dari localStorage yang diisi AdminPage
 *  - Jika localStorage kosong → fallback ke DEFAULT_PROJECTS bawaan
 *  - Semua logika render/drag/scroll tetap identik
 */

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import { useCMSProjects } from "./AdminPage";

export function ProjectsSection() {
  const PROJECTS = useCMSProjects();          // ← satu-satunya perubahan dari versi asli

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollStartLeft = useRef(0);

  const CARD_WIDTH = 380;
  const GAP = 20;

  const scrollTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, PROJECTS.length - 1));
    setActiveIdx(clamped);
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: clamped * (CARD_WIDTH + GAP), behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
    scrollStartLeft.current = scrollRef.current?.scrollLeft ?? 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    const dx = e.clientX - dragStartX.current;
    scrollRef.current.scrollLeft = scrollStartLeft.current - dx;
  };
  const onMouseUp = () => setIsDragging(false);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
    setActiveIdx(idx);
  };

  return (
    <section id="projects" style={{ background: "#0d0d1e", fontFamily: "'Rajdhani', sans-serif" }} className="py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <p style={{ color: "#60a5fa", letterSpacing: "0.25em", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.4rem" }}>
              &lt; PROJECTS /&gt;
            </p>
            <h2 style={{ color: "#e8e8f0", fontSize: "2rem", fontWeight: 700, letterSpacing: "0.05em" }}>
              KARYA &amp; PROYEK
            </h2>
            <div style={{ width: "48px", height: "2px", background: "linear-gradient(to right, #2563eb, transparent)", marginTop: "8px" }} />
          </div>

          {/* Navigation arrows */}
          <div className="flex items-center gap-3">
            <span style={{ color: "#8888aa", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
              {String(activeIdx + 1).padStart(2, "0")} / {String(PROJECTS.length).padStart(2, "0")}
            </span>
            <button
              onClick={() => scrollTo(activeIdx - 1)}
              disabled={activeIdx === 0}
              style={{
                background: activeIdx === 0 ? "rgba(30,30,48,0.5)" : "rgba(37,99,235,0.2)",
                border: "1px solid rgba(37,99,235,0.3)",
                color: activeIdx === 0 ? "#555" : "#60a5fa",
                width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}>
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollTo(activeIdx + 1)}
              disabled={activeIdx === PROJECTS.length - 1}
              style={{
                background: activeIdx === PROJECTS.length - 1 ? "rgba(30,30,48,0.5)" : "rgba(37,99,235,0.2)",
                border: "1px solid rgba(37,99,235,0.3)",
                color: activeIdx === PROJECTS.length - 1 ? "#555" : "#60a5fa",
                width: "40px", height: "40px",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: activeIdx === PROJECTS.length - 1 ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}>
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onScroll={onScroll}
          style={{
            display: "flex",
            gap: `${GAP}px`,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            cursor: isDragging ? "grabbing" : "grab",
            userSelect: "none",
            paddingBottom: "8px",
          }}>
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              style={{
                flexShrink: 0,
                width: `${CARD_WIDTH}px`,
                scrollSnapAlign: "start",
                background: "#12121e",
                border: `1px solid ${activeIdx === i ? `${p.color}66` : "rgba(37,99,235,0.18)"}`,
                overflow: "hidden",
                position: "relative",
                transition: "border-color 0.3s, box-shadow 0.3s",
                boxShadow: activeIdx === i ? `0 0 30px ${p.color}22` : "none",
              }}>

              {/* Image */}
              <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                <img
                  src={p.image}
                  alt={p.title}
                  draggable={false}
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65) saturate(0.7)", transition: "transform 0.4s", userSelect: "none" }}
                  onMouseEnter={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.05)")}
                  onMouseLeave={e => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, #12121e 0%, transparent 60%)` }} />
                {/* Status badge */}
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "rgba(10,10,20,0.8)",
                  border: `1px solid ${p.color}88`,
                  padding: "3px 10px",
                  backdropFilter: "blur(8px)",
                }}>
                  <span style={{ color: p.color, fontSize: "0.6rem", letterSpacing: "0.2em", fontFamily: "'JetBrains Mono', monospace" }}>{p.status}</span>
                </div>
                {/* Category */}
                <div style={{ position: "absolute", bottom: "12px", left: "12px" }}>
                  <span style={{ color: "#8888aa", fontSize: "0.65rem", letterSpacing: "0.15em", fontFamily: "'JetBrains Mono', monospace" }}>{p.category.toUpperCase()}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "1.2rem" }}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 style={{ color: "#e8e8f0", fontSize: "1.05rem", fontWeight: 600, letterSpacing: "0.03em", lineHeight: 1.2 }}>{p.title}</h3>
                  <span style={{ color: "#8888aa", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", flexShrink: 0, paddingTop: "2px" }}>{p.year}</span>
                </div>

                <p style={{ color: "#c4c4d4", fontSize: "0.82rem", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, marginBottom: "1rem" }}>
                  {p.desc}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.stack.map(t => (
                    <span key={t} style={{
                      background: `${p.color}18`,
                      border: `1px solid ${p.color}44`,
                      color: "#c4c4d4",
                      padding: "2px 10px",
                      fontSize: "0.68rem",
                      letterSpacing: "0.06em",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}>{t}</span>
                  ))}
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: `linear-gradient(to right, ${p.color}44, transparent)`, margin: "0.8rem 0" }} />

                {/* Action links */}
                <div className="flex gap-3">
                  {p.github ? (
                    <a href={p.github} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#8888aa", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.73rem", letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#60a5fa")}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#8888aa")}>
                      <Github size={13} /> SOURCE
                    </a>
                  ) : (
                    <button style={{ background: "none", border: "none", color: "#8888aa", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.73rem", letterSpacing: "0.1em", padding: 0 }}>
                      <Github size={13} /> SOURCE
                    </button>
                  )}
                  {p.demo ? (
                    <a href={p.demo} target="_blank" rel="noopener noreferrer"
                      style={{ color: "#8888aa", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.73rem", letterSpacing: "0.1em", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = p.color)}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = "#8888aa")}>
                      <ExternalLink size={13} /> DEMO
                    </a>
                  ) : (
                    <button style={{ background: "none", border: "none", color: "#8888aa", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "0.73rem", letterSpacing: "0.1em", padding: 0 }}>
                      <ExternalLink size={13} /> DEMO
                    </button>
                  )}
                </div>
              </div>

              {/* Active indicator line */}
              {activeIdx === i && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(to right, transparent, ${p.color}, transparent)` }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {PROJECTS.map((p, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              style={{
                width: activeIdx === i ? "24px" : "8px",
                height: "4px",
                background: activeIdx === i ? "#60a5fa" : "rgba(37,99,235,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }} />
          ))}
        </div>
      </div>
    </section>
  );
}