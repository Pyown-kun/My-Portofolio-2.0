/**
 * AdminPage.tsx
 * Halaman CMS tersembunyi untuk pemilik portfolio.
 * Akses via URL: /admin  (tambahkan route di App.tsx)
 *
 * Fitur:
 *  - Login dengan username + password
 *  - Kelola Projects (CRUD) → data di-sync ke ProjectsSection via localStorage
 *  - Kelola Games (CRUD) → embed WebGL (Unity/Unreal/Godot/dll) via iframe
 *  - Export JSON untuk replace konstanta PROJECTS / GAMES di source code
 *  - Ganti kredensial login
 *
 * Dependensi: React, lucide-react (sudah ada di project)
 */

import { useState, useEffect, useRef } from "react";
import {
  Eye, EyeOff, LogOut, Plus, Pencil, Trash2,
  Save, X, Download, Copy, ChevronRight,
  Gamepad2, Folder, Settings, ExternalLink,
} from "lucide-react";

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
export interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  stack: string[];
  desc: string;
  image: string;
  color: string;
  status: string;
  github: string;
  demo: string;
}

export interface GameEmbed {
  id: number;
  title: string;
  engine: string;
  url: string;
  desc: string;
  controls: string;
  width: number;
  height: number;
}

/* ─────────────────────────────────────────────
   DEFAULT DATA (sama seperti source asli)
───────────────────────────────────────────── */
const DEFAULT_PROJECTS: Project[] = [
  { id: 1, title: "Retro Pixel Platformer", category: "Game Development", year: "2024", stack: ["Unity", "C#", "Pixel Art", "Aseprite"], desc: "Game platformer 2D bergaya retro pixel art yang dibangun bersama tim indie. Dilengkapi mekanisme physics kustom, sistem level dengan checkpoint, dan score system berbasis koin.", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700&h=420&fit=crop&auto=format", color: "#2563eb", status: "COMPLETED", github: "", demo: "" },
  { id: 2, title: "3D Environment: Fantasy Forest", category: "3D Modeling", year: "2024", stack: ["Blender", "Unity", "PBR Textures", "Low-poly"], desc: "Environment 3D bertema fantasy forest untuk digunakan sebagai latar belakang game RPG. Menggunakan teknik low-poly dan PBR texturing untuk performa optimal di mobile.", image: "https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=700&h=420&fit=crop&auto=format", color: "#059669", status: "COMPLETED", github: "", demo: "" },
  { id: 3, title: "Student Task Web App", category: "Web Development", year: "2023", stack: ["HTML", "CSS", "JavaScript", "PHP"], desc: "Aplikasi web sederhana untuk membantu mahasiswa menyelesaikan tugas perkuliahan. Fitur meliputi manajemen tugas, deadline tracker, dan sistem pengumpulan file.", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=700&h=420&fit=crop&auto=format", color: "#0ea5e9", status: "COMPLETED", github: "", demo: "" },
  { id: 4, title: "Karakter 2D: Warrior Series", category: "Character Design", year: "2023", stack: ["Procreate", "Photoshop", "Illustrator", "Figma"], desc: "Seri desain karakter 2D bergaya anime untuk klien indie game. Terdiri dari 6 karakter dengan berbagai kelas—warrior, mage, archer—masing-masing dengan sprite sheet animasi.", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=700&h=420&fit=crop&auto=format", color: "#f59e0b", status: "COMPLETED", github: "", demo: "" },
  { id: 5, title: "Agate Academy — Game Project", category: "Internship", year: "2023", stack: ["Unity", "C#", "Agile", "Git"], desc: "Proyek game saat magang di Agate Academy sebagai Programmer Game Dev. Berkontribusi pada pengembangan sistem gameplay, AI musuh, dan integrasi aset visual dengan tim 8 orang.", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&h=420&fit=crop&auto=format", color: "#60a5fa", status: "INTERNSHIP", github: "", demo: "" },
  { id: 6, title: "Blender Character — Sci-Fi Soldier", category: "3D Modeling", year: "2024", stack: ["Blender", "Substance Painter", "Rigging", "UV Unwrap"], desc: "Model karakter 3D tema sci-fi untuk portfolio pribadi. Lengkap dengan rigging dan weight painting untuk animasi, serta texture berkualitas tinggi menggunakan Substance Painter.", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=700&h=420&fit=crop&auto=format", color: "#ec4899", status: "PERSONAL", github: "", demo: "" },
];

const DEFAULT_GAMES: GameEmbed[] = [
  { id: 1, title: "Asteroid Blaster (Built-in)", engine: "Custom", url: "", desc: "Mini game built-in menggunakan HTML5 Canvas. Tersedia di GameSection secara default.", controls: "WASD/Arrows gerak | Space tembak", width: 960, height: 480 },
];

/* ─────────────────────────────────────────────
   STORAGE KEYS
───────────────────────────────────────────── */
const STORE = {
  PROJECTS: "cms_projects",
  GAMES: "cms_games",
  CREDS: "cms_creds",
  SESSION: "cms_session",
};

const DEFAULT_CREDS = { user: "admin", pass: "admin123" };

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const load = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const save = (key: string, val: unknown) =>
  localStorage.setItem(key, JSON.stringify(val));

let _idCounter = 1000;
const newId = () => ++_idCounter;

/* ─────────────────────────────────────────────
   COLOUR PALETTE SWATCHES
───────────────────────────────────────────── */
const SWATCHES = [
  "#2563eb", "#60a5fa", "#ec4899", "#ef4444",
  "#f59e0b", "#059669", "#10b981", "#0ea5e9",
  "#3b82f6", "#6366f1",
];

const ENGINE_COLORS: Record<string, string> = {
  Unity: "#10b981", Unreal: "#ef4444", Godot: "#3b82f6",
  Construct: "#f59e0b", GDevelop: "#818cf8", Custom: "#60a5fa",
};

/* ─────────────────────────────────────────────
   SMALL UI ATOMS
───────────────────────────────────────────── */
const S = {
  // inline styles as objects for the dark cyberpunk theme
  bg: "#0d0d1e",
  bg2: "#12121e",
  bg3: "#1a1a2e",
  purple: "#60a5fa",
  purple2: "#2563eb",
  border: "rgba(37,99,235,0.25)",
  border2: "rgba(37,99,235,0.5)",
  text: "#e8e8f0",
  muted: "#8888aa",
  muted2: "#c4c4d4",
  red: "#ef4444",
  green: "#10b981",
  amber: "#f59e0b",
};

/* ─────────────────────────────────────────────
   TOAST
───────────────────────────────────────────── */
function Toast({ msg, type }: { msg: string; type: "ok" | "err" | "" }) {
  if (!msg) return null;
  const color = type === "err" ? S.red : S.green;
  return (
    <div style={{
      position: "fixed", bottom: "1.5rem", right: "1.5rem", zIndex: 9999,
      background: S.bg2, border: `1px solid ${color}`, color,
      fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem",
      letterSpacing: "0.1em", padding: "8px 18px",
      boxShadow: `0 0 20px ${color}22`,
      animation: "fadeIn 0.2s ease",
    }}>{msg}</div>
  );
}

/* ─────────────────────────────────────────────
   FIELD COMPONENTS
───────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(255,255,255,0.04)",
  border: `1px solid ${S.border}`, color: S.text,
  padding: "0.5rem 0.75rem", fontFamily: "'JetBrains Mono', monospace",
  fontSize: "0.78rem", outline: "none", boxSizing: "border-box",
};
const labelStyle: React.CSSProperties = {
  color: S.muted, fontSize: "0.6rem", letterSpacing: "0.2em",
  display: "block", marginBottom: "5px",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", marginBottom: "0.75rem" }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={{ ...inputStyle, ...props.style }} />;
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} style={{ ...inputStyle, minHeight: "80px", resize: "vertical", ...props.style }} />;
}
function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} style={{ ...inputStyle, background: S.bg2, ...props.style }}>
      {props.children}
    </select>
  );
}

function Btn({ children, variant = "default", onClick, style: s }: {
  children: React.ReactNode; variant?: "primary" | "danger" | "ghost" | "default";
  onClick?: () => void; style?: React.CSSProperties;
}) {
  const base: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
    letterSpacing: "0.15em", padding: "6px 16px", cursor: "pointer",
    border: "none", display: "inline-flex", alignItems: "center", gap: "6px",
    transition: "opacity 0.2s",
  };
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: `linear-gradient(135deg, ${S.purple2}, ${S.purple})`, color: "#fff", clipPath: "polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))" },
    danger: { background: "rgba(239,68,68,0.12)", border: `1px solid rgba(239,68,68,0.35)`, color: S.red },
    ghost: { background: "none", border: `1px solid ${S.border}`, color: S.muted },
    default: { background: `rgba(37,99,235,0.2)`, border: `1px solid ${S.border2}`, color: S.purple },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...s }}>{children}</button>;
}

/* ─────────────────────────────────────────────
   STACK TAG INPUT
───────────────────────────────────────────── */
function StackEditor({ stack, onChange }: { stack: string[]; onChange: (s: string[]) => void }) {
  const [val, setVal] = useState("");
  const add = () => {
    const t = val.trim();
    if (t && !stack.includes(t)) onChange([...stack, t]);
    setVal("");
  };
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
        {stack.map(t => (
          <span key={t} style={{
            background: "rgba(37,99,235,0.12)", border: `1px solid rgba(37,99,235,0.3)`,
            color: S.muted2, fontSize: "0.6rem", letterSpacing: "0.06em",
            padding: "2px 8px", display: "inline-flex", alignItems: "center", gap: "5px",
          }}>
            {t}
            <button onClick={() => onChange(stack.filter(x => x !== t))}
              style={{ background: "none", border: "none", cursor: "pointer", color: S.red, fontSize: "0.75rem", lineHeight: 1, padding: 0 }}>×</button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", gap: "6px" }}>
        <input value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && add()}
          placeholder="Tambah teknologi..."
          style={{ ...inputStyle, flex: 1, padding: "4px 8px", fontSize: "0.72rem" }} />
        <Btn onClick={add}>＋</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   LOGIN SCREEN
───────────────────────────────────────────── */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  const attempt = () => {
    const creds = load(STORE.CREDS, DEFAULT_CREDS);
    if (user === creds.user && pass === creds.pass) {
      save(STORE.SESSION, { ts: Date.now() });
      onLogin();
    } else {
      setErr("✗ Username atau password salah");
      setTimeout(() => setErr(""), 2500);
    }
  };

  return (
    <div style={{
      background: S.bg, minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "2rem",
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{
        background: S.bg2, border: `1px solid ${S.border2}`,
        padding: "2.5rem 2rem", width: "100%", maxWidth: "360px",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ color: S.purple, fontSize: "0.65rem", letterSpacing: "0.25em", marginBottom: "6px" }}>
            &lt; ADMIN /&gt;
          </div>
          <h1 style={{ color: S.text, fontSize: "1.3rem", fontWeight: 700, letterSpacing: "0.1em", margin: 0 }}>
            PORTFOLIO CMS
          </h1>
          <div style={{ width: "32px", height: "2px", background: S.purple2, margin: "8px auto 0" }} />
        </div>

        {/* Fields */}
        <Field label="USERNAME">
          <Input value={user} onChange={e => setUser(e.target.value)}
            placeholder="admin" autoComplete="off" />
        </Field>
        <Field label="PASSWORD">
          <div style={{ position: "relative" }}>
            <Input type={show ? "text" : "password"} value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && attempt()}
              placeholder="••••••••"
              style={{ paddingRight: "2.5rem" }} />
            <button onClick={() => setShow(!show)} style={{
              position: "absolute", right: "0.7rem", top: "50%",
              transform: "translateY(-50%)", background: "none", border: "none",
              cursor: "pointer", color: S.muted, display: "flex", alignItems: "center",
            }}>
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </Field>

        <Btn variant="primary" onClick={attempt}
          style={{ width: "100%", justifyContent: "center", padding: "0.7rem", fontSize: "0.75rem" }}>
          <ChevronRight size={14} /> MASUK
        </Btn>

        {err && <div style={{ color: S.red, fontSize: "0.7rem", textAlign: "center", marginTop: "0.8rem" }}>{err}</div>}

        <div style={{ color: S.muted, fontSize: "0.58rem", textAlign: "center", marginTop: "1.2rem", opacity: 0.55 }}>
          Halaman tersembunyi — akses hanya untuk pemilik
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROJECT FORM
───────────────────────────────────────────── */
function ProjectForm({
  initial, onSave, onCancel,
}: {
  initial?: Project | null;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const blank: Project = { id: newId(), title: "", category: "Game Development", year: "2024", stack: [], desc: "", image: "", color: "#60a5fa", status: "COMPLETED", github: "", demo: "" };
  const [form, setForm] = useState<Project>(initial ?? blank);

  const set = (k: keyof Project, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const CATEGORIES = ["Game Development", "3D Modeling", "Web Development", "Character Design", "Internship", "UI/UX Design", "Lainnya"];
  const STATUSES = ["COMPLETED", "INTERNSHIP", "PERSONAL", "IN PROGRESS", "CONCEPT"];

  return (
    <div style={{ background: S.bg3, border: `1px solid ${S.border2}`, padding: "1.2rem", marginBottom: "1rem" }}>
      <div style={{ color: S.purple, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${S.border}` }}>
        {initial ? "✏ EDIT PROYEK" : "✏ TAMBAH PROYEK BARU"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="JUDUL PROYEK">
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Nama proyek..." />
        </Field>
        <Field label="KATEGORI">
          <Select value={form.category} onChange={e => set("category", e.target.value)}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="TAHUN">
          <Input value={form.year} onChange={e => set("year", e.target.value)} placeholder="2024" maxLength={4} />
        </Field>
        <Field label="STATUS">
          <Select value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </Select>
        </Field>
      </div>

      <Field label="DESKRIPSI">
        <Textarea value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Deskripsi proyek..." />
      </Field>

      <Field label="URL GAMBAR (Unsplash / CDN / lokal)">
        <Input value={form.image} onChange={e => set("image", e.target.value)} placeholder="https://images.unsplash.com/..." />
      </Field>

      {form.image && (
        <div style={{ marginBottom: "0.75rem", height: "80px", overflow: "hidden", border: `1px solid ${S.border}` }}>
          <img src={form.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="URL GITHUB">
          <Input value={form.github} onChange={e => set("github", e.target.value)} placeholder="https://github.com/..." />
        </Field>
        <Field label="URL DEMO / LIVE">
          <Input value={form.demo} onChange={e => set("demo", e.target.value)} placeholder="https://..." />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label={`WARNA AKSEN — ${form.color}`}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
            {SWATCHES.map(c => (
              <button key={c} onClick={() => set("color", c)}
                style={{
                  width: "20px", height: "20px", borderRadius: "50%", background: c,
                  border: form.color === c ? "2px solid #fff" : "2px solid transparent",
                  cursor: "pointer", flexShrink: 0,
                }} />
            ))}
            <input type="text" value={form.color} onChange={e => set("color", e.target.value)}
              style={{ ...inputStyle, width: "90px", padding: "3px 8px" }} />
            <span style={{ width: "18px", height: "18px", borderRadius: "50%", background: form.color, border: "1px solid #fff4", flexShrink: 0, display: "inline-block" }} />
          </div>
        </Field>

        <Field label="TECH STACK">
          <StackEditor stack={form.stack} onChange={s => set("stack", s)} />
        </Field>
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "0.5rem" }}>
        <Btn variant="ghost" onClick={onCancel}><X size={13} /> BATAL</Btn>
        <Btn variant="primary" onClick={() => onSave(form)}><Save size={13} /> SIMPAN</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GAME FORM
───────────────────────────────────────────── */
function GameForm({
  initial, onSave, onCancel,
}: {
  initial?: GameEmbed | null;
  onSave: (g: GameEmbed) => void;
  onCancel: () => void;
}) {
  const blank: GameEmbed = { id: newId(), title: "", engine: "Unity", url: "", desc: "", controls: "", width: 960, height: 600 };
  const [form, setForm] = useState<GameEmbed>(initial ?? blank);
  const [previewing, setPreviewing] = useState(false);

  const set = (k: keyof GameEmbed, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const ENGINES = ["Unity", "Unreal", "Godot", "Construct", "GDevelop", "Custom"];

  return (
    <div style={{ background: S.bg3, border: `1px solid ${S.border2}`, padding: "1.2rem", marginBottom: "1rem" }}>
      <div style={{ color: S.purple, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${S.border}` }}>
        {initial ? "✏ EDIT GAME" : "🎮 TAMBAH GAME BARU"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="JUDUL GAME">
          <Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Nama game..." />
        </Field>
        <Field label="ENGINE / PLATFORM">
          <Select value={form.engine} onChange={e => set("engine", e.target.value)}>
            {ENGINES.map(e => <option key={e}>{e}</option>)}
          </Select>
        </Field>
      </div>

      {/* Engine Info Banner */}
      <div style={{
        background: `${ENGINE_COLORS[form.engine] ?? S.purple}12`,
        border: `1px solid ${ENGINE_COLORS[form.engine] ?? S.purple}33`,
        padding: "0.5rem 0.8rem", marginBottom: "0.75rem", fontSize: "0.65rem",
        color: ENGINE_COLORS[form.engine] ?? S.purple, letterSpacing: "0.08em",
      }}>
        {form.engine === "Unity" && "📦 Unity WebGL Build → Host di itch.io, simmer.io, atau server sendiri. Export via File > Build Settings > WebGL."}
        {form.engine === "Unreal" && "📦 Unreal Engine → Export HTML5 build, upload ke server/CDN. Gunakan Pixel Streaming atau HTML5 export plugin."}
        {form.engine === "Godot" && "📦 Godot → Export HTML5, upload ke itch.io atau GitHub Pages. Pastikan CORS header sudah benar."}
        {form.engine === "Construct" && "📦 Construct 3 → Publish langsung ke itch.io atau export HTML5, upload ke hosting manapun."}
        {form.engine === "GDevelop" && "📦 GDevelop → Export ke HTML5 atau publish ke gd.games, itch.io, dll."}
        {form.engine === "Custom" && "📦 Custom engine / HTML5 Canvas — masukkan URL iframe langsung ke WebGL/HTML file."}
      </div>

      <Field label="EMBED URL — WebGL Build (itch.io / simmer.io / GitHub Pages / server sendiri)">
        <Input value={form.url} onChange={e => set("url", e.target.value)}
          placeholder="https://itch.io/embed-upload/XXXXX?color=222222 atau https://simmer.io/..." />
      </Field>

      <Field label="DESKRIPSI GAME">
        <Textarea value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="Genre, gameplay, cerita singkat..." />
      </Field>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="KONTROL (ditampilkan di bawah game)">
          <Input value={form.controls} onChange={e => set("controls", e.target.value)} placeholder="WASD gerak | Space tembak | E interaksi" />
        </Field>
        <Field label="RESOLUSI FRAME (lebar × tinggi px)">
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <Input type="number" value={form.width} onChange={e => set("width", Number(e.target.value))}
              placeholder="960" style={{ width: "80px" }} />
            <span style={{ color: S.muted }}>×</span>
            <Input type="number" value={form.height} onChange={e => set("height", Number(e.target.value))}
              placeholder="600" style={{ width: "80px" }} />
          </div>
        </Field>
      </div>

      {/* Preview */}
      <div style={{ marginBottom: "0.75rem" }}>
        <Btn onClick={() => { if (form.url) setPreviewing(true); }}
          style={{ fontSize: "0.62rem", marginBottom: "8px" }}>
          <ExternalLink size={12} /> PREVIEW EMBED
        </Btn>
        {previewing && form.url && (
          <div style={{ position: "relative", background: "#000", border: `1px solid ${S.border}`, width: "100%", height: "220px", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: S.muted, fontSize: "0.65rem", letterSpacing: "0.15em", zIndex: 0 }}>
              LOADING GAME...
            </div>
            <iframe
              src={form.url}
              allow="autoplay; fullscreen"
              style={{ width: "100%", height: "100%", border: "none", position: "relative", zIndex: 1 }}
            />
            <button onClick={() => setPreviewing(false)}
              style={{ position: "absolute", top: "6px", right: "6px", background: "rgba(0,0,0,0.7)", border: `1px solid ${S.border}`, color: S.text, cursor: "pointer", padding: "4px 8px", fontSize: "0.6rem", zIndex: 2 }}>
              ✕ TUTUP
            </button>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
        <Btn variant="ghost" onClick={onCancel}><X size={13} /> BATAL</Btn>
        <Btn variant="primary" onClick={() => onSave(form)}><Save size={13} /> SIMPAN</Btn>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PROJECTS TAB
───────────────────────────────────────────── */
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>(() => load(STORE.PROJECTS, DEFAULT_PROJECTS));
  const [editing, setEditing] = useState<Project | null | "new">(null);
  const [toast, setToast] = useState({ msg: "", type: "" as "ok" | "err" | "" });

  const notify = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2500);
  };

  const persist = (list: Project[]) => {
    setProjects(list);
    save(STORE.PROJECTS, list);
  };

  const handleSave = (p: Project) => {
    if (editing === "new") persist([...projects, p]);
    else persist(projects.map(x => x.id === p.id ? p : x));
    setEditing(null);
    notify(editing === "new" ? "Proyek ditambahkan ✓" : "Proyek diperbarui ✓");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus proyek ini?")) return;
    persist(projects.filter(p => p.id !== id));
    notify("Proyek dihapus");
  };

  return (
    <div>
      <Toast {...toast} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div style={{ color: S.text, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em" }}>KELOLA PROYEK</div>
          <div style={{ color: S.muted, fontSize: "0.62rem", letterSpacing: "0.1em", marginTop: "2px" }}>Edit, tambah, atau hapus karya dari ProjectsSection</div>
        </div>
        <Btn onClick={() => setEditing("new")}><Plus size={13} /> TAMBAH PROYEK</Btn>
      </div>

      {editing && (
        <ProjectForm
          initial={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {projects.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: S.muted, fontSize: "0.7rem", letterSpacing: "0.1em" }}>
          Belum ada proyek. Klik TAMBAH PROYEK di atas.
        </div>
      )}

      {projects.map(p => (
        <div key={p.id} style={{
          background: S.bg2, border: `1px solid ${S.border}`,
          marginBottom: "0.5rem", transition: "border-color 0.2s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.75rem 1rem" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, flexShrink: 0 }} />
            <span style={{ color: S.text, fontSize: "0.8rem", fontWeight: 600, flex: 1, letterSpacing: "0.03em" }}>{p.title}</span>
            <span style={{ color: S.muted, fontSize: "0.6rem", letterSpacing: "0.1em" }}>{p.category.toUpperCase()} · {p.year}</span>
            <span style={{ fontSize: "0.55rem", letterSpacing: "0.12em", padding: "2px 8px", border: `1px solid ${p.color}66`, color: p.color }}>{p.status}</span>
            <button onClick={() => setEditing(p)}
              style={{ background: "none", border: "none", cursor: "pointer", color: S.purple, display: "flex", padding: "4px" }}>
              <Pencil size={14} />
            </button>
            <button onClick={() => handleDelete(p.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: S.red, display: "flex", padding: "4px" }}>
              <Trash2 size={14} />
            </button>
          </div>
          <div style={{ padding: "0 1rem 0.75rem", display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {p.stack.map(t => (
              <span key={t} style={{
                fontSize: "0.55rem", letterSpacing: "0.1em", padding: "1px 7px",
                border: `1px solid ${p.color}44`, color: p.color,
              }}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   GAMES TAB
───────────────────────────────────────────── */
function GamesTab() {
  const [games, setGames] = useState<GameEmbed[]>(() => load(STORE.GAMES, DEFAULT_GAMES));
  const [editing, setEditing] = useState<GameEmbed | null | "new">(null);
  const [toast, setToast] = useState({ msg: "", type: "" as "ok" | "err" | "" });

  const notify = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2500);
  };

  const persist = (list: GameEmbed[]) => {
    setGames(list);
    save(STORE.GAMES, list);
  };

  const handleSave = (g: GameEmbed) => {
    if (editing === "new") persist([...games, g]);
    else persist(games.map(x => x.id === g.id ? g : x));
    setEditing(null);
    notify(editing === "new" ? "Game ditambahkan ✓" : "Game diperbarui ✓");
  };

  const handleDelete = (id: number) => {
    if (!confirm("Hapus game ini?")) return;
    persist(games.filter(g => g.id !== id));
    notify("Game dihapus");
  };

  return (
    <div>
      <Toast {...toast} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "8px" }}>
        <div>
          <div style={{ color: S.text, fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.08em" }}>KELOLA GAME EMBED</div>
          <div style={{ color: S.muted, fontSize: "0.62rem", letterSpacing: "0.1em", marginTop: "2px" }}>Tambah WebGL build dari Unity · Unreal · Godot · Construct · GDevelop ke GameSection</div>
        </div>
        <Btn onClick={() => setEditing("new")}><Plus size={13} /> TAMBAH GAME</Btn>
      </div>

      {editing && (
        <GameForm
          initial={editing === "new" ? null : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}

      {games.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem", color: S.muted, fontSize: "0.7rem", letterSpacing: "0.1em" }}>
          Belum ada game embed. Klik TAMBAH GAME di atas.
        </div>
      )}

      {games.map(g => (
        <div key={g.id} style={{
          background: S.bg2, border: `1px solid ${S.border}`,
          marginBottom: "0.5rem", padding: "0.9rem 1rem",
          display: "flex", alignItems: "flex-start", gap: "12px",
        }}>
          <div style={{
            width: "44px", height: "44px", flexShrink: 0,
            background: `${ENGINE_COLORS[g.engine] ?? S.purple}15`,
            border: `1px solid ${ENGINE_COLORS[g.engine] ?? S.purple}44`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
          }}>🎮</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: S.text, fontSize: "0.8rem", fontWeight: 600, marginBottom: "3px" }}>{g.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
              <span style={{ fontSize: "0.55rem", letterSpacing: "0.12em", padding: "2px 7px", border: `1px solid ${ENGINE_COLORS[g.engine] ?? S.purple}44`, color: ENGINE_COLORS[g.engine] ?? S.purple }}>{g.engine.toUpperCase()}</span>
              <span style={{ color: S.muted, fontSize: "0.6rem" }}>{g.width} × {g.height} px</span>
            </div>
            <div style={{ color: S.purple, fontSize: "0.6rem", wordBreak: "break-all" }}>
              {g.url || <span style={{ color: S.muted }}>[URL belum diisi]</span>}
            </div>
            {g.desc && (
              <div style={{ color: S.muted, fontSize: "0.6rem", marginTop: "3px", letterSpacing: "0.03em" }}>
                {g.desc.substring(0, 90)}{g.desc.length > 90 ? "..." : ""}
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
            <button onClick={() => setEditing(g)}
              style={{ background: "none", border: "none", cursor: "pointer", color: S.purple, padding: "4px" }}>
              <Pencil size={14} />
            </button>
            <button onClick={() => handleDelete(g.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: S.red, padding: "4px" }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}

      {/* Guide */}
      <div style={{ background: S.bg3, border: `1px solid ${S.border}`, padding: "1rem", marginTop: "1rem" }}>
        <div style={{ color: S.purple, fontSize: "0.6rem", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>📖 PANDUAN PLATFORM HOSTING GAME</div>
        {[
          { name: "itch.io", url: "itch.io", desc: "Upload ZIP WebGL build → set 'Kind of project: HTML'. Salin URL embed dari 'Embed' widget." },
          { name: "simmer.io", url: "simmer.io", desc: "Platform khusus Unity WebGL. Drag & drop build folder, langsung dapat embed URL." },
          { name: "GitHub Pages", url: "pages.github.com", desc: "Push build ke repo, aktifkan Pages. URL: https://username.github.io/repo-name/" },
          { name: "Netlify Drop", url: "app.netlify.com/drop", desc: "Drag folder build ke netlify.com/drop, dapat URL instan tanpa login." },
        ].map(p => (
          <div key={p.name} style={{ display: "flex", gap: "10px", marginBottom: "0.5rem" }}>
            <span style={{ color: S.amber, fontSize: "0.65rem", fontWeight: 600, minWidth: "90px" }}>{p.name}</span>
            <span style={{ color: S.muted2, fontSize: "0.65rem", lineHeight: 1.5 }}>{p.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SETTINGS TAB
───────────────────────────────────────────── */
function SettingsTab() {
  const [newUser, setNewUser] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPass2, setNewPass2] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "" as "ok" | "err" | "" });

  const notify = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 2500);
  };

  const saveCredentials = () => {
    if (newPass && newPass !== newPass2) { notify("Password tidak cocok", "err"); return; }
    const current = load(STORE.CREDS, DEFAULT_CREDS);
    const updated = {
      user: newUser.trim() || current.user,
      pass: newPass || current.pass,
    };
    save(STORE.CREDS, updated);
    setNewUser(""); setNewPass(""); setNewPass2("");
    notify("Kredensial diperbarui ✓");
  };

  const exportJSON = () => {
    const data = {
      projects: load<Project[]>(STORE.PROJECTS, DEFAULT_PROJECTS),
      games: load<GameEmbed[]>(STORE.GAMES, DEFAULT_GAMES),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "portfolio-data.json";
    a.click();
    notify("JSON diunduh ✓");
  };

  const copyToClipboard = () => {
    const data = {
      PROJECTS: load<Project[]>(STORE.PROJECTS, DEFAULT_PROJECTS),
      GAMES: load<GameEmbed[]>(STORE.GAMES, DEFAULT_GAMES),
    };
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
      .then(() => notify("Disalin ke clipboard ✓"))
      .catch(() => notify("Gagal menyalin", "err"));
  };

  const resetToDefault = () => {
    if (!confirm("Reset semua data ke bawaan? Data yang diubah akan hilang.")) return;
    save(STORE.PROJECTS, DEFAULT_PROJECTS);
    save(STORE.GAMES, DEFAULT_GAMES);
    notify("Data direset ke bawaan ✓");
  };

  return (
    <div>
      <Toast {...toast} />

      {/* Credentials */}
      <div style={{ background: S.bg3, border: `1px solid ${S.border}`, padding: "1.2rem", marginBottom: "1rem" }}>
        <div style={{ color: S.purple, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${S.border}` }}>
          🔒 KEAMANAN AKUN
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
          <Field label="USERNAME BARU (kosongkan = tidak diganti)">
            <Input value={newUser} onChange={e => setNewUser(e.target.value)} placeholder="Username baru..." />
          </Field>
          <Field label="PASSWORD BARU (kosongkan = tidak diganti)">
            <Input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••" />
          </Field>
        </div>
        <Field label="KONFIRMASI PASSWORD BARU">
          <Input type="password" value={newPass2} onChange={e => setNewPass2(e.target.value)} placeholder="Ulangi password baru" style={{ maxWidth: "300px" }} />
        </Field>
        <Btn variant="primary" onClick={saveCredentials}><Save size={13} /> SIMPAN PERUBAHAN</Btn>
      </div>

      {/* Export */}
      <div style={{ background: S.bg3, border: `1px solid ${S.border}`, padding: "1.2rem", marginBottom: "1rem" }}>
        <div style={{ color: S.purple, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: `1px solid ${S.border}` }}>
          📦 EXPORT DATA
        </div>
        <p style={{ color: S.muted2, fontSize: "0.72rem", lineHeight: 1.6, marginBottom: "1rem" }}>
          Unduh semua data proyek dan game dalam format JSON, lalu copy isi array <code style={{ color: S.purple, fontSize: "0.72rem" }}>PROJECTS</code> dan <code style={{ color: S.purple, fontSize: "0.72rem" }}>GAMES</code> ke source code komponen kamu.
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Btn variant="primary" onClick={exportJSON}><Download size={13} /> EXPORT JSON</Btn>
          <Btn onClick={copyToClipboard}><Copy size={13} /> COPY CLIPBOARD</Btn>
          <Btn variant="danger" onClick={resetToDefault}><X size={13} /> RESET KE BAWAAN</Btn>
        </div>
      </div>

      {/* Integration guide */}
      <div style={{ background: S.bg3, border: `1px solid ${S.border}`, padding: "1.2rem" }}>
        <div style={{ color: S.purple, fontSize: "0.62rem", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>
          🔗 CARA INTEGRASI KE PROJECTSSECTION & GAMESECTION
        </div>
        {[
          { step: "01", text: "Klik EXPORT JSON → unduh file portfolio-data.json" },
          { step: "02", text: "Buka file, salin array PROJECTS ke konstanta PROJECTS di ProjectsSection.tsx" },
          { step: "03", text: "Salin array GAMES ke konstanta GAMES di GameSection.tsx" },
          { step: "04", text: "Untuk game, ganti komponen canvas bawaan dengan <GameEmbedPlayer games={GAMES} />" },
          { step: "05", text: "Opsional: load langsung dari localStorage agar perubahan CMS otomatis tampil tanpa deploy ulang" },
        ].map(({ step, text }) => (
          <div key={step} style={{ display: "flex", gap: "12px", marginBottom: "0.5rem" }}>
            <span style={{ color: S.purple, fontSize: "0.6rem", fontWeight: 700, minWidth: "24px" }}>{step}</span>
            <span style={{ color: S.muted2, fontSize: "0.65rem", lineHeight: 1.5 }}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   DASHBOARD SHELL
───────────────────────────────────────────── */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<"projects" | "games" | "settings">("projects");

  const TABS: { id: typeof tab; label: string; icon: React.ReactNode }[] = [
    { id: "projects", label: "PROJECTS", icon: <Folder size={13} /> },
    { id: "games", label: "GAMES", icon: <Gamepad2 size={13} /> },
    { id: "settings", label: "SETTINGS", icon: <Settings size={13} /> },
  ];

  return (
    <div style={{ background: S.bg, minHeight: "100vh", fontFamily: "'JetBrains Mono', monospace", color: S.text }}>
      {/* Topbar */}
      <div style={{
        background: S.bg2, borderBottom: `1px solid ${S.border}`,
        padding: "0.8rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
      }}>
        <div>
          <div style={{ color: S.purple, fontSize: "0.6rem", letterSpacing: "0.25em" }}>&lt; ADMIN /&gt;</div>
          <div style={{ color: S.text, fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.08em" }}>PORTFOLIO CMS</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ background: "rgba(168,85,247,0.15)", border: `1px solid ${S.border}`, color: S.purple, fontSize: "0.58rem", letterSpacing: "0.15em", padding: "3px 10px" }}>
            ● OWNER
          </span>
          <Btn variant="danger" onClick={onLogout}><LogOut size={12} /> KELUAR</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: S.bg2, borderBottom: `1px solid ${S.border}`, display: "flex", padding: "0 1.5rem", gap: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: tab === t.id ? S.purple : S.muted,
              fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem",
              letterSpacing: "0.15em", padding: "0.85rem 1.2rem",
              borderBottom: tab === t.id ? `2px solid ${S.purple}` : "2px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
              display: "flex", alignItems: "center", gap: "6px",
            }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "1.5rem", maxWidth: "900px", margin: "0 auto" }}>
        {tab === "projects" && <ProjectsTab />}
        {tab === "games" && <GamesTab />}
        {tab === "settings" && <SettingsTab />}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "1rem", color: S.muted, fontSize: "0.58rem", letterSpacing: "0.1em", borderTop: `1px solid ${S.border}`, marginTop: "2rem" }}>
        PORTFOLIO CMS · ADMIN ONLY · DATA TERSIMPAN DI LOCALSTORAGE
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GAME EMBED PLAYER — gunakan di GameSection
   sebagai pengganti / tambahan canvas game bawaan
───────────────────────────────────────────── */
export function GameEmbedPlayer({ games }: { games: GameEmbed[] }) {
  const [active, setActive] = useState(0);
  const game = games[active];
  if (!game || !game.url) return null;

  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Game selector (jika lebih dari 1) */}
      {games.length > 1 && (
        <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", flexWrap: "wrap" }}>
          {games.map((g, i) => (
            <button key={g.id} onClick={() => setActive(i)}
              style={{
                background: i === active ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.1)",
                border: `1px solid ${i === active ? "rgba(168,85,247,0.6)" : "rgba(37,99,235,0.25)"}`,
                color: i === active ? "#60a5fa" : "#8888aa",
                fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem",
                letterSpacing: "0.12em", padding: "5px 14px", cursor: "pointer",
              }}>
              {g.title}
            </button>
          ))}
        </div>
      )}

      {/* Engine badge */}
      <div style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{
          fontSize: "0.55rem", letterSpacing: "0.12em", padding: "2px 8px",
          border: `1px solid ${ENGINE_COLORS[game.engine] ?? S.purple}44`,
          color: ENGINE_COLORS[game.engine] ?? S.purple,
        }}>{game.engine.toUpperCase()}</span>
        <span style={{ color: S.muted, fontSize: "0.6rem" }}>{game.width} × {game.height}</span>
      </div>

      {/* Iframe */}
      <div style={{ position: "relative", width: "100%", paddingTop: `${(game.height / game.width) * 100}%`, background: "#000", border: "1px solid rgba(37,99,235,0.3)", overflow: "hidden" }}>
        <iframe
          src={game.url}
          allow="autoplay; fullscreen; gamepad"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
        />
      </div>

      {/* Controls hint */}
      {game.controls && (
        <p style={{ color: "#8888aa", fontSize: "0.7rem", marginTop: "0.5rem", textAlign: "center", letterSpacing: "0.08em" }}>
          {game.controls}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   HOOK — baca data dari CMS di komponen lain
   Contoh: const projects = useCMSProjects();
───────────────────────────────────────────── */
export function useCMSProjects(): Project[] {
  return load(STORE.PROJECTS, DEFAULT_PROJECTS);
}
export function useCMSGames(): GameEmbed[] {
  return load(STORE.GAMES, DEFAULT_GAMES);
}

/* ─────────────────────────────────────────────
   MAIN EXPORT
───────────────────────────────────────────── */
export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(() => {
    const s = load<{ ts?: number }>(STORE.SESSION, {});
    if (!s?.ts) return false;
    // Session expire setelah 8 jam
    return (Date.now() - s.ts) < 8 * 60 * 60 * 1000;
  });

  const logout = () => {
    localStorage.removeItem(STORE.SESSION);
    setLoggedIn(false);
  };

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  return <Dashboard onLogout={logout} />;
}