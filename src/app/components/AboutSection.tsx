import { useState, useRef } from "react";
import { motion } from "motion/react";
import {
  Briefcase,
  GraduationCap,
  Award,
  User,
  ChevronDown,
} from "lucide-react";

const SKILLS = [
  "Game Developer",
  "3D Modeling",
  "Animasi 2D/3D",
  "Pixel Art",
  "Unity",
  "Blender",
  "Character Design",
  "Web Developer",
  "React",
  "Notion",
  "Microsoft Office",
  "Asset Design",
];

const EXPERIENCES = [
  {
    year: "2023 – 2024",
    role: "Game Developer",
    company: "Freelance | Indie Team",
    desc: "Berpartisipasi dalam sebuah tim developer guna mengembangkan sebuah Game. Mendesain Asset Game berbasis retro dalam style pixel. Memprogram beberapa mekanisme Game supaya Game sesuai dengan desain yang diinginkan.",
    icon: "🎮",
  },
  {
    year: "2024 – 2025",
    role: "Game Developer",
    company: "Agate Academi Intership",
    desc: "Mengikuti kegiatan magang di Agate Academi sebagai Programmer Game Dev.Berkontribusi dalam pengembangan game 3D berbasis Unity, mulai dari implementasi gameplay, debugging, hingga optimisasi pengguna. Belajar dan menerapkan prinsip pengembangan Game profesional sesuai pipeline industri",
    icon: "🎮",
  },
  {
    year: "2025 – 2026",
    role: "Freelance Developer",
    company: "Freelance",
    desc: "Mengembangkan website statis dan dinamis menggunakan HTML, CSS, JavaScript, dan PHP sesuai kebutuhan klien. Berkomunkasi dengan klien untuk memahami kebutuhan dan memasitikan hasil sesuai dengan target",
    icon: "✏️",
  },
];

const EDUCATION = [
  {
    year: "2022 – Sekarang",
    name: "STMIK AMIKOM SURAKARTA",
    field: "Teknik Informatika",
    icon: "🎓",
  },
  {
    year: "2019 – 2022",
    name: "SMA Negeri 1 Nguntaronadi",
    field: "IPA",
    icon: "🏫",
  },
];

const CERTS = [
  {
    name: "Programmer Game Dev",
    issuer: "Agate Academy",
    desc: "Mengikuti kegiatan magang di Agate Academy sebagai Programmer Game Dev",
  },
];

const SOFTSKILLS = [
  { label: "Game Development", value: 80 },
  { label: "3D Modeling", value: 88 },
  { label: "2D Animation", value: 75 },
  { label: "Web Development", value: 78 },
  { label: "Character Design", value: 85 },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<
    "experience" | "education" | "skills" | "certifications"
  >("experience");
  const skillsScrollRef = useRef<HTMLDivElement>(null);

  const tabs: {
    key: typeof activeTab;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { key: "experience", label: "Pengalaman", icon: <Briefcase size={14} /> },
    {
      key: "education",
      label: "Pendidikan",
      icon: <GraduationCap size={14} />,
    },
    { key: "skills", label: "Keahlian", icon: <User size={14} /> },
    { key: "certifications", label: "Sertifikat", icon: <Award size={14} /> },
  ];

  return (
    <section
      id="about"
      style={{ background: "#0a0a14", fontFamily: "'Rajdhani', sans-serif" }}
      className="py-20 px-4"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p
            style={{
              color: "#60a5fa",
              letterSpacing: "0.25em",
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: "0.4rem",
            }}
          >
            &lt; ABOUT /&gt;
          </p>
          <h2
            style={{
              color: "#e8e8f0",
              fontSize: "2rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            TENTANG SAYA
          </h2>
          <div
            style={{
              width: "48px",
              height: "2px",
              background: "linear-gradient(to right, #2563eb, transparent)",
              marginTop: "8px",
            }}
          />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Left — profile card + skills tags */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Profile photo card */}
            <div style={{ position: "relative", marginBottom: "2rem" }}>
              <div
                style={{
                  border: "1px solid rgba(37,99,235,0.35)",
                  overflow: "hidden",
                  position: "relative",
                  background: "#12121e",
                }}
              >
                <img
                  src="/fotoSayaHitamPutih.png"
                  alt="Andrea Ramadhan Cahya Aryana"
                  style={{
                    width: "100%",
                    height: "320px",
                    objectFit: "cover",
                    objectPosition: "top",
                    filter: "brightness(0.8) saturate(0.75)",
                  }}
                />
                {/* Overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(10,10,20,0.9) 0%, rgba(10,10,20,0.2) 60%, transparent 100%)",
                  }}
                />
                {/* Name overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                  }}
                >
                  {/* <p
                    style={{
                      color: "#60a5fa",
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: "4px",
                    }}
                  >
                    ID: ARK2022
                  </p> */}
                  <h3
                    style={{
                      color: "#e8e8f0",
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: "0.03em",
                    }}
                  >
                    ANDREA RAMADHAN
                    <br />
                    <span style={{ color: "#60a5fa" }}>CAHYA ARYANA</span>
                  </h3>
                  <p
                    style={{
                      color: "#8888aa",
                      fontSize: "0.78rem",
                      marginTop: "4px",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                    }}
                  >
                    Game Developer · STMIK AMIKOM Surakarta
                  </p>
                </div>
                {/* Corner decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "32px",
                    height: "32px",
                    border: "1px solid rgba(37,99,235,,0.5)",
                    borderLeft: "none",
                    borderBottom: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "12px",
                    left: "12px",
                    width: "32px",
                    height: "32px",
                    border: "1px solid rgba(37,99,235,,0.5)",
                    borderRight: "none",
                    borderTop: "none",
                  }}
                />
              </div>
            </div>

            {/* Bio */}
            <p
              style={{
                color: "#c4c4d4",
                lineHeight: 1.75,
                fontSize: "0.9rem",
                fontFamily: "'DM Sans', sans-serif",
                fontWeight: 300,
                marginBottom: "1.5rem",
              }}
            >
              Saya adalah mahasiswa yang sedang belajar untuk menjadi seorang
              game developer. Saya bisa mendesain mandiri baik itu 2D maupun 3D.
            </p>

            {/* Contact info */}
            <div
              style={{
                borderTop: "1px solid rgba(37,99,235,0.2)",
                paddingTop: "1rem",
              }}
            >
              {[
                {
                  label: "EMAIL",
                  val: "andrearamadhan123@gmail.com",
                  href: "mailto:andrearamadhan123@gmail.com",
                },
                {
                  label: "PHONE",
                  val: "+62 857-2915-3877",
                  href:
                    "https://wa.me/6285729153877?text=" +
                    encodeURIComponent(
                      "Halo Andrea, saya tertarik dengan portfolio Anda",
                    ),
                },
                {
                  label: "INSTAGRAM",
                  val: "Andrea Ramadhan C.A",
                  href: "https://www.instagram.com/andrea_rca3?igsh=MTc0MXR0eWwxamxqOQ==",
                },
                // {
                //   label: "LINKEDIN",
                //   val: "andrea-ramadhan-4a8d6bd",
                //   href: "https://linkedin.com/in/andrea-ramadhan-4a8d6bd",
                // },
              ].map((item) => (
                <div key={item.label} className="flex gap-3 mb-2">
                  <span
                    style={{
                      color: "#60a5fa",
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      fontFamily: "'JetBrains Mono', monospace",
                      minWidth: "60px",
                      paddingTop: "2px",
                    }}
                  >
                    {item.label}
                  </span>

                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200 hover:text-blue-400"
                    style={{
                      color: "#c4c4d4",
                      fontSize: "0.82rem",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: 300,
                      wordBreak: "break-all",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    {item.val}
                  </a>
                </div>
              ))}
            </div>

            {/* Skill bars */}
            <div style={{ marginTop: "1.5rem" }}>
              <p
                style={{
                  color: "#8888aa",
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  fontFamily: "'JetBrains Mono', monospace",
                  marginBottom: "1rem",
                }}
              >
                SKILL LEVEL
              </p>
              {SOFTSKILLS.map((s) => (
                <div key={s.label} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span
                      style={{
                        color: "#c4c4d4",
                        fontSize: "0.8rem",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {s.label}
                    </span>
                    <span
                      style={{
                        color: "#60a5fa",
                        fontSize: "0.75rem",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {s.value}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "3px",
                      background: "#1e1e30",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      style={{
                        height: "100%",
                        background:
                          "linear-gradient(to right, #2563eb, #60a5fa)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — tabbed info */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            {/* Horizontal scrollable skill tags */}
            <div
              ref={skillsScrollRef}
              className="flex gap-2 overflow-x-auto pb-3 mb-8"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {SKILLS.map((s, i) => (
                <motion.span
                  key={s}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  style={{
                    flexShrink: 0,
                    background: "rgba(37,99,235,0.12)",
                    border: "1px solid rgba(37,99,235,,0.3)",
                    color: "#c4c4d4",
                    padding: "5px 14px",
                    fontSize: "0.78rem",
                    letterSpacing: "0.08em",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    cursor: "default",
                    transition: "background 0.2s, color 0.2s",
                  }}
                  whileHover={{
                    backgroundColor: "rgba(37,99,235,,0.2)",
                    color: "#e8e8f0",
                  }}
                >
                  {s}
                </motion.span>
              ))}
            </div>

            {/* Tabs */}
            <div
              className="flex gap-1 mb-6 overflow-x-auto"
              style={{ scrollbarWidth: "none" }}
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  style={{
                    flexShrink: 0,
                    background:
                      activeTab === t.key
                        ? "rgba(37,99,235,0.25)"
                        : "transparent",
                    border: `1px solid ${activeTab === t.key ? "rgba(37,99,235,,0.6)" : "rgba(37,99,235,0.2)"}`,
                    color: activeTab === t.key ? "#60a5fa" : "#8888aa",
                    padding: "7px 16px",
                    cursor: "pointer",
                    fontSize: "0.78rem",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.2s",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {t.icon} {t.label.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div>
              {activeTab === "experience" && (
                <div className="space-y-6">
                  {EXPERIENCES.map((e, i) => (
                    <motion.div
                      key={e.role}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      style={{
                        background: "#12121e",
                        border: "1px solid rgba(37,99,235,0.2)",
                        padding: "1.2rem",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "3px",
                          background:
                            "linear-gradient(to bottom, #2563eb, #60a5fa)",
                        }}
                      />
                      <div className="flex items-start gap-3">
                        <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                          {e.icon}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              style={{
                                color: "#e8e8f0",
                                fontSize: "1rem",
                                fontWeight: 600,
                                letterSpacing: "0.05em",
                              }}
                            >
                              {e.role}
                            </span>
                            <span
                              style={{
                                color: "#60a5fa",
                                fontSize: "0.7rem",
                                fontFamily: "'JetBrains Mono', monospace",
                                letterSpacing: "0.1em",
                              }}
                            >
                              {e.company}
                            </span>
                          </div>
                          <span
                            style={{
                              color: "#8888aa",
                              fontSize: "0.7rem",
                              fontFamily: "'JetBrains Mono', monospace",
                              letterSpacing: "0.1em",
                              display: "block",
                              marginBottom: "0.5rem",
                            }}
                          >
                            {e.year}
                          </span>
                          <p
                            style={{
                              color: "#c4c4d4",
                              fontSize: "0.85rem",
                              lineHeight: 1.65,
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 300,
                            }}
                          >
                            {e.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-4">
                  {EDUCATION.map((e, i) => (
                    <motion.div
                      key={e.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      style={{
                        background: "#12121e",
                        border: "1px solid rgba(37,99,235,0.2)",
                        padding: "1.2rem",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: "3px",
                          background:
                            "linear-gradient(to bottom, #60a5fa, #2563eb)",
                        }}
                      />
                      <div className="flex items-start gap-3">
                        <span style={{ fontSize: "1.5rem" }}>{e.icon}</span>
                        <div>
                          <p
                            style={{
                              color: "#e8e8f0",
                              fontSize: "1rem",
                              fontWeight: 600,
                              marginBottom: "2px",
                              letterSpacing: "0.03em",
                            }}
                          >
                            {e.name}
                          </p>
                          <p
                            style={{
                              color: "#60a5fa",
                              fontSize: "0.78rem",
                              marginBottom: "4px",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {e.field}
                          </p>
                          <p
                            style={{
                              color: "#8888aa",
                              fontSize: "0.7rem",
                              fontFamily: "'JetBrains Mono', monospace",
                              letterSpacing: "0.1em",
                            }}
                          >
                            {e.year}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Software tools */}
                  <div
                    style={{
                      background: "#12121e",
                      border: "1px solid rgba(37,99,235,0.2)",
                      padding: "1.2rem",
                    }}
                  >
                    <p
                      style={{
                        color: "#8888aa",
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        fontFamily: "'JetBrains Mono', monospace",
                        marginBottom: "0.8rem",
                      }}
                    >
                      PERANGKAT LUNAK
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Microsoft Excel",
                        "Microsoft PowerPoint",
                        "Microsoft Word",
                        "Notion",
                      ].map((sw) => (
                        <span
                          key={sw}
                          style={{
                            background: "rgba(37,99,235,0.1)",
                            border: "1px solid rgba(37,99,235,0.25)",
                            color: "#c4c4d4",
                            padding: "4px 12px",
                            fontSize: "0.78rem",
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                        >
                          {sw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    {
                      icon: "🎮",
                      name: "Game Developer",
                      desc: "Unity, Pixel art mechanics",
                    },
                    {
                      icon: "🧊",
                      name: "3D Modeling",
                      desc: "Blender, low-poly & organic",
                    },
                    {
                      icon: "🎬",
                      name: "Animasi 2D/3D",
                      desc: "Rigging, keyframe, sprite animation",
                    },
                    {
                      icon: "✏️",
                      name: "Karakter 2D",
                      desc: "Character design & illustration",
                    },
                    {
                      icon: "🌐",
                      name: "Web Developer",
                      desc: "HTML, CSS, React basics",
                    },
                    {
                      icon: "🎨",
                      name: "Asset Design",
                      desc: "Pixel art, UI assets, icons",
                    },
                  ].map((sk, i) => (
                    <motion.div
                      key={sk.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.07 }}
                      style={{
                        background: "#12121e",
                        border: "1px solid rgba(37,99,235,0.2)",
                        padding: "1rem",
                        textAlign: "center",
                      }}
                      whileHover={{ borderColor: "rgba(37,99,235,,0.5)" }}
                    >
                      <div
                        style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}
                      >
                        {sk.icon}
                      </div>
                      <p
                        style={{
                          color: "#e8e8f0",
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          letterSpacing: "0.05em",
                          marginBottom: "4px",
                        }}
                      >
                        {sk.name}
                      </p>
                      <p
                        style={{
                          color: "#8888aa",
                          fontSize: "0.72rem",
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: 300,
                          lineHeight: 1.4,
                        }}
                      >
                        {sk.desc}
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}

              {activeTab === "certifications" && (
                <div className="space-y-4">
                  {CERTS.map((c, i) => (
                    <motion.div
                      key={c.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      style={{
                        background: "#12121e",
                        border: "1px solid rgba(37,99,235,0.3)",
                        padding: "1.5rem",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          height: "2px",
                          background:
                            "linear-gradient(to right, #2563eb, #60a5fa, transparent)",
                        }}
                      />
                      <div className="flex items-start gap-4">
                        <div
                          style={{
                            width: "48px",
                            height: "48px",
                            background: "rgba(37,99,235,0.2)",
                            border: "1px solid rgba(37,99,235,,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <Award size={22} style={{ color: "#60a5fa" }} />
                        </div>
                        <div>
                          <p
                            style={{
                              color: "#e8e8f0",
                              fontSize: "1rem",
                              fontWeight: 600,
                              letterSpacing: "0.05em",
                              marginBottom: "4px",
                            }}
                          >
                            {c.name}
                          </p>
                          <p
                            style={{
                              color: "#60a5fa",
                              fontSize: "0.78rem",
                              marginBottom: "6px",
                              fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            {c.issuer}
                          </p>
                          <p
                            style={{
                              color: "#c4c4d4",
                              fontSize: "0.83rem",
                              lineHeight: 1.6,
                              fontFamily: "'DM Sans', sans-serif",
                              fontWeight: 300,
                            }}
                          >
                            {c.desc}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
