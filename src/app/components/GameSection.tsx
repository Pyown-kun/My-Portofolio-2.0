/**
 * GameSection.tsx  — versi CMS-aware dengan dukungan WebGL Embed
 *
 * Perubahan dari versi asli:
 *  - Tambah tab switcher: "BUILT-IN" (canvas game lama) ↔ "GAME EMBED" (WebGL iframe)
 *  - Game embed dibaca dari CMS via useCMSGames() hook
 *  - Komponen GameEmbedPlayer menampilkan game WebGL (Unity / Unreal / Godot / dll)
 *  - Game canvas Asteroid Blaster asli tetap ada sebagai fallback / tab pertama
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Gamepad2, RefreshCw, Monitor, ExternalLink } from "lucide-react";
import { useCMSGames, GameEmbedPlayer } from "./AdminPage";

/* ─────────────────────────────────────────────
   TYPE DEFS (sama seperti versi asli)
───────────────────────────────────────────── */
interface Bullet  { x: number; y: number; id: number }
interface Asteroid { x: number; y: number; vx: number; vy: number; r: number; id: number; angle: number; spin: number; hp: number }
interface Particle { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; r: number; color: string }

let bulletIdCounter = 0;
let asteroidIdCounter = 0;

/* ─────────────────────────────────────────────
   ASTEROID BLASTER (canvas game bawaan — tidak diubah)
───────────────────────────────────────────── */
function AsteroidBlaster() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    shipX: 0, shipY: 0, shipAngle: 0, shipVx: 0, shipVy: 0,
    bullets: [] as Bullet[], asteroids: [] as Asteroid[], particles: [] as Particle[],
    score: 0, lives: 3, level: 1, gameOver: false, keys: new Set<string>(),
    lastShot: 0, invincible: 0, asteroidTimer: 0,
  });
  const rafRef = useRef<number>(0);
  const [displayScore, setDisplayScore] = useState(0);
  const [displayLives, setDisplayLives] = useState(3);
  const [displayLevel, setDisplayLevel] = useState(1);
  const [isGameOver, setIsGameOver] = useState(false);

  const spawnAsteroid = useCallback((canvas: HTMLCanvasElement, forced = false) => {
    const st = stateRef.current;
    const count = forced ? 1 : Math.ceil(st.level * 0.5 + 2);
    for (let i = 0; i < count; i++) {
      const edge = Math.floor(Math.random() * 4);
      let x = 0, y = 0;
      if (edge === 0) { x = Math.random() * canvas.width; y = -40; }
      else if (edge === 1) { x = canvas.width + 40; y = Math.random() * canvas.height; }
      else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + 40; }
      else { x = -40; y = Math.random() * canvas.height; }
      const angle = Math.atan2(st.shipY - y, st.shipX - x) + (Math.random() - 0.5) * 1.2;
      const speed = 0.5 + Math.random() * 1.2 + st.level * 0.15;
      const r = 22 + Math.random() * 28;
      st.asteroids.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, r, id: asteroidIdCounter++, angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.04, hp: r > 38 ? 3 : r > 28 ? 2 : 1 });
    }
  }, []);

  const initGame = useCallback((canvas: HTMLCanvasElement) => {
    stateRef.current = { shipX: canvas.width / 2, shipY: canvas.height / 2, shipAngle: -Math.PI / 2, shipVx: 0, shipVy: 0, bullets: [], asteroids: [], particles: [], score: 0, lives: 3, level: 1, gameOver: false, keys: stateRef.current.keys, lastShot: 0, invincible: 0, asteroidTimer: 0 };
    setDisplayScore(0); setDisplayLives(3); setDisplayLevel(1); setIsGameOver(false);
    spawnAsteroid(canvas, false);
  }, [spawnAsteroid]);

  const addParticles = (x: number, y: number, color: string, count: number) => {
    const st = stateRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      st.particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 1, maxLife: 1, r: 1 + Math.random() * 2, color });
    }
  };

  const drawShip = (ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, thrusting: boolean, invincible: number) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(angle);
    if (invincible > 0 && Math.floor(Date.now() / 80) % 2 === 0) { ctx.restore(); return; }
    ctx.beginPath(); ctx.moveTo(18, 0); ctx.lineTo(-12, 10); ctx.lineTo(-7, 0); ctx.lineTo(-12, -10); ctx.closePath();
    ctx.strokeStyle = "#60a5fa"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "rgba(37,99,235,0.2)"; ctx.fill();
    ctx.beginPath(); ctx.arc(6, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(168,85,247,0.5)"; ctx.fill();
    if (thrusting) {
      ctx.beginPath(); ctx.moveTo(-7, 5); ctx.lineTo(-7 - 10 - Math.random() * 10, 0); ctx.lineTo(-7, -5);
      ctx.strokeStyle = "#f59e0b"; ctx.lineWidth = 2; ctx.stroke();
    }
    ctx.restore();
  };

  const drawAsteroid = (ctx: CanvasRenderingContext2D, a: Asteroid) => {
    ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.angle);
    const sides = 7 + Math.floor(a.r / 10);
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const ang = (i / sides) * Math.PI * 2;
      const jitter = 0.78 + (((a.id * 137 + i * 31) % 100) / 100) * 0.44;
      const rx = Math.cos(ang) * a.r * jitter; const ry = Math.sin(ang) * a.r * jitter;
      i === 0 ? ctx.moveTo(rx, ry) : ctx.lineTo(rx, ry);
    }
    ctx.closePath();
    ctx.strokeStyle = a.hp > 2 ? "#e2e8f0" : a.hp > 1 ? "#60a5fa" : "#2563eb"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = a.hp > 2 ? "rgba(226,232,240,0.06)" : a.hp > 1 ? "rgba(168,85,247,0.08)" : "rgba(37,99,235,0.1)"; ctx.fill();
    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize(); window.addEventListener("resize", resize);
    const onKey = (e: KeyboardEvent, down: boolean) => { if (down) stateRef.current.keys.add(e.code); else stateRef.current.keys.delete(e.code); };
    window.addEventListener("keydown", e => onKey(e, true));
    window.addEventListener("keyup", e => onKey(e, false));
    const dist = (ax: number, ay: number, bx: number, by: number) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);

    const tick = (now: number) => {
      const st = stateRef.current;
      if (st.gameOver) { rafRef.current = requestAnimationFrame(tick); return; }
      const k = st.keys; const W = canvas.width, H = canvas.height;
      const FRICTION = 0.98, THRUST = 0.18, TURN = 0.055, BULLET_SPEED = 8, SHOOT_INTERVAL = 200;
      if (k.has("ArrowLeft") || k.has("KeyA")) st.shipAngle -= TURN;
      if (k.has("ArrowRight") || k.has("KeyD")) st.shipAngle += TURN;
      const thrusting = k.has("ArrowUp") || k.has("KeyW");
      if (thrusting) { st.shipVx += Math.cos(st.shipAngle) * THRUST; st.shipVy += Math.sin(st.shipAngle) * THRUST; }
      st.shipVx *= FRICTION; st.shipVy *= FRICTION;
      st.shipX = (st.shipX + st.shipVx + W) % W; st.shipY = (st.shipY + st.shipVy + H) % H;
      if ((k.has("Space") || k.has("KeyZ")) && now - st.lastShot > SHOOT_INTERVAL) {
        st.lastShot = now;
        st.bullets.push({ x: st.shipX + Math.cos(st.shipAngle) * 20, y: st.shipY + Math.sin(st.shipAngle) * 20, id: bulletIdCounter++ });
      }
      st.bullets = st.bullets.filter(b => {
        (b as any).vx = (b as any).vx ?? Math.cos(st.shipAngle) * BULLET_SPEED;
        (b as any).vy = (b as any).vy ?? Math.sin(st.shipAngle) * BULLET_SPEED;
        b.x += (b as any).vx; b.y += (b as any).vy;
        return b.x > -10 && b.x < W + 10 && b.y > -10 && b.y < H + 10;
      });
      st.asteroidTimer += 16;
      const spawnInterval = Math.max(3000, 8000 - st.level * 500);
      if (st.asteroidTimer > spawnInterval) { st.asteroidTimer = 0; spawnAsteroid(canvas, true); }
      st.asteroids.forEach(a => { a.x = (a.x + a.vx + W) % W; a.y = (a.y + a.vy + H) % H; a.angle += a.spin; });
      const bulletsToRemove = new Set<number>(); const asteroidsToRemove = new Set<number>(); const newAsteroids: Asteroid[] = [];
      st.bullets.forEach(b => {
        st.asteroids.forEach(a => {
          if (bulletsToRemove.has(b.id) || asteroidsToRemove.has(a.id)) return;
          if (dist(b.x, b.y, a.x, a.y) < a.r) {
            bulletsToRemove.add(b.id); a.hp--; addParticles(a.x, a.y, "#60a5fa", 6);
            if (a.hp <= 0) {
              asteroidsToRemove.add(a.id); addParticles(a.x, a.y, "#f59e0b", 12);
              st.score += Math.round(100 / a.r * 20);
              if (a.r > 22) for (let s = 0; s < 2; s++) {
                const ang2 = Math.random() * Math.PI * 2; const sp2 = Math.sqrt(a.vx ** 2 + a.vy ** 2) * 1.3 + 0.5;
                newAsteroids.push({ x: a.x, y: a.y, vx: Math.cos(ang2) * sp2, vy: Math.sin(ang2) * sp2, r: a.r * 0.55, id: asteroidIdCounter++, angle: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.06, hp: 1 });
              }
            }
          }
        });
      });
      st.bullets = st.bullets.filter(b => !bulletsToRemove.has(b.id));
      st.asteroids = st.asteroids.filter(a => !asteroidsToRemove.has(a.id));
      st.asteroids.push(...newAsteroids);
      if (st.invincible <= 0) {
        for (const a of st.asteroids) {
          if (dist(st.shipX, st.shipY, a.x, a.y) < a.r + 14) {
            st.lives--; addParticles(st.shipX, st.shipY, "#ef4444", 20); st.invincible = 180; setDisplayLives(st.lives);
            if (st.lives <= 0) { st.gameOver = true; setIsGameOver(true); } break;
          }
        }
      } else { st.invincible--; }
      if (st.asteroids.length === 0) { st.level++; setDisplayLevel(st.level); spawnAsteroid(canvas, false); }
      st.particles = st.particles.filter(p => { p.life -= 0.03; p.x += p.vx; p.y += p.vy; p.vx *= 0.96; p.vy *= 0.96; return p.life > 0; });
      setDisplayScore(st.score);
      ctx.clearRect(0, 0, W, H); ctx.fillStyle = "#0a0a14"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < 80; i++) {
        const sx = ((i * 137.5 + 11) % W); const sy = ((i * 231.7 + 7) % H);
        const br = (Math.sin(now * 0.001 + i) * 0.3 + 0.7) * 0.6;
        ctx.fillStyle = `rgba(200,200,255,${br})`; ctx.fillRect(sx, sy, 1, 1);
      }
      st.bullets.forEach(b => {
        ctx.save(); ctx.shadowBlur = 8; ctx.shadowColor = "#60a5fa"; ctx.fillStyle = "#e2e8f0";
        ctx.beginPath(); ctx.arc(b.x, b.y, 3, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      st.asteroids.forEach(a => drawAsteroid(ctx, a));
      st.particles.forEach(p => {
        ctx.save(); ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.shadowBlur = 6; ctx.shadowColor = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
      drawShip(ctx, st.shipX, st.shipY, st.shipAngle, thrusting, st.invincible);
      rafRef.current = requestAnimationFrame(tick);
    };

    initGame(canvas);
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, [initGame, spawnAsteroid]);

  const handleRestart = () => { const canvas = canvasRef.current; if (canvas) initGame(canvas); };
  const touchShoot = () => { stateRef.current.keys.add("Space"); setTimeout(() => stateRef.current.keys.delete("Space"), 120); };
  const touchThrust = (on: boolean) => { if (on) stateRef.current.keys.add("ArrowUp"); else stateRef.current.keys.delete("ArrowUp"); };
  const touchLeft = (on: boolean) => { if (on) stateRef.current.keys.add("ArrowLeft"); else stateRef.current.keys.delete("ArrowLeft"); };
  const touchRight = (on: boolean) => { if (on) stateRef.current.keys.add("ArrowRight"); else stateRef.current.keys.delete("ArrowRight"); };

  return (
    <div>
      {/* HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 pointer-events-none">
        <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          <div style={{ fontSize: "0.7rem", color: "#8888aa", letterSpacing: "0.15em" }}>SCORE</div>
          <div style={{ fontSize: "1.4rem", color: "#60a5fa", letterSpacing: "0.05em" }}>{displayScore.toString().padStart(6, "0")}</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", textAlign: "center" }}>
          <div style={{ fontSize: "0.7rem", color: "#8888aa", letterSpacing: "0.15em" }}>LEVEL</div>
          <div style={{ fontSize: "1.4rem", color: "#f59e0b" }}>{displayLevel.toString().padStart(2, "0")}</div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>
          <div style={{ fontSize: "0.7rem", color: "#8888aa", letterSpacing: "0.15em" }}>LIVES</div>
          <div style={{ fontSize: "1.4rem", color: "#ef4444" }}>{"♥ ".repeat(Math.max(0, displayLives)).trim() || "—"}</div>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ width: "100%", height: "480px", display: "block" }} />

      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20"
          style={{ background: "rgba(5,5,16,0.85)", backdropFilter: "blur(4px)" }}>
          <p style={{ color: "#ef4444", fontSize: "0.75rem", letterSpacing: "0.3em", fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.5rem" }}>— GAME OVER —</p>
          <p style={{ color: "#e8e8f0", fontSize: "2.5rem", fontWeight: 700, letterSpacing: "0.05em" }}>{displayScore.toString().padStart(6, "0")}</p>
          <p style={{ color: "#8888aa", fontSize: "0.8rem", marginBottom: "1.5rem" }}>FINAL SCORE</p>
          <button onClick={handleRestart}
            style={{ background: "linear-gradient(135deg, #2563eb, #60a5fa)", color: "#fff", border: "none", padding: "0.7rem 2rem", cursor: "pointer", letterSpacing: "0.15em", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "8px", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" }}>
            <RefreshCw size={14} /> MAIN LAGI
          </button>
        </div>
      )}

      {/* Mobile controls */}
      <div className="flex justify-between items-center mt-4 md:hidden">
        <div className="flex gap-2">
          {[{ dir: "left", label: "◀" }, { dir: "up", label: "▲" }, { dir: "right", label: "▶" }].map(({ dir, label }) => (
            <button key={dir}
              onTouchStart={() => dir === "left" ? touchLeft(true) : dir === "right" ? touchRight(true) : touchThrust(true)}
              onTouchEnd={() => dir === "left" ? touchLeft(false) : dir === "right" ? touchRight(false) : touchThrust(false)}
              onMouseDown={() => dir === "left" ? touchLeft(true) : dir === "right" ? touchRight(true) : touchThrust(true)}
              onMouseUp={() => dir === "left" ? touchLeft(false) : dir === "right" ? touchRight(false) : touchThrust(false)}
              style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(168,85,247,0.4)", color: "#60a5fa", width: "52px", height: "52px", fontSize: "1.2rem", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </div>
        <button onClick={touchShoot}
          style={{ background: "linear-gradient(135deg,#2563eb,#60a5fa)", border: "none", color: "#fff", width: "64px", height: "64px", fontSize: "1.4rem", cursor: "pointer", borderRadius: "50%" }}>●</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN GameSection
───────────────────────────────────────────── */
export function GameSection() {
  const embeds = useCMSGames().filter(g => g.url.trim() !== "");  // hanya game dengan URL
  const hasEmbeds = embeds.length > 0;
  const [activeTab, setActiveTab] = useState<"builtin" | "embed">("builtin");

  return (
    <section id="play" style={{ background: "#050510", fontFamily: "'Rajdhani', sans-serif" }} className="py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8">
          <p style={{ color: "#60a5fa", letterSpacing: "0.25em", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", marginBottom: "0.5rem" }}>
            &lt; MINI GAME /&gt;
          </p>
          <h2 style={{ color: "#e8e8f0", fontSize: "2rem", letterSpacing: "0.05em", fontWeight: 700 }}>
            GAME PLAYGROUND
          </h2>
          <p style={{ color: "#8888aa", fontSize: "0.9rem", marginTop: "0.5rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
            {activeTab === "builtin"
              ? "WASD / Arrow keys — gerak & arah \u00a0|\u00a0 Space / Z — tembak"
              : "Klik canvas game untuk mengaktifkan input"}
          </p>
        </motion.div>

        {/* Tab switcher — hanya muncul jika ada embed */}
        {hasEmbeds && (
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "1.5rem" }}>
            {[
              { id: "builtin" as const, label: "ASTEROID BLASTER", icon: <Gamepad2 size={13} /> },
              { id: "embed" as const, label: `GAME LAINNYA (${embeds.length})`, icon: <Monitor size={13} /> },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.1)",
                  border: `1px solid ${activeTab === t.id ? "rgba(168,85,247,0.6)" : "rgba(37,99,235,0.25)"}`,
                  color: activeTab === t.id ? "#60a5fa" : "#8888aa",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                  letterSpacing: "0.15em", padding: "6px 18px", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: "7px", transition: "all 0.2s",
                }}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
          style={{ border: "1px solid rgba(37,99,235,0.3)", background: "#050510", overflow: "hidden" }}>

          {activeTab === "builtin" && <AsteroidBlaster />}

          {activeTab === "embed" && hasEmbeds && (
            <div style={{ padding: "1.2rem" }}>
              <GameEmbedPlayer games={embeds} />
            </div>
          )}
        </motion.div>

        {/* Tip */}
        <p style={{ color: "#8888aa", fontSize: "0.7rem", textAlign: "center", marginTop: "1rem", fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em" }}>
          {activeTab === "builtin"
            ? "KLIK PADA CANVAS TERLEBIH DAHULU AGAR INPUT KEYBOARD AKTIF"
            : "GAME DIJALANKAN VIA WEBGL EMBED — BUTUH KONEKSI INTERNET"}
        </p>
      </div>
    </section>
  );
}