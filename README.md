
  # Buat Portofolio Interaktif

  This is a code bundle for Buat Portofolio Interaktif. The original project is available at https://www.figma.com/design/TVUkwPaqKnVXS0s6nd0bpU/Buat-Portofolio-Interaktif.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  # 📦 Portfolio CMS — Panduan Setup Lengkap

Sistem admin tersembunyi untuk portfolio kamu.  
Akses via **`/admin`** — tidak ada link di navbar, hanya kamu yang tahu.

---

## 📁 Struktur File

```
src/
├── AdminPage.tsx          ← Halaman CMS (login + kelola proyek & game)
├── ProjectsSection.tsx    ← Versi baru (baca data dari CMS otomatis)
├── GameSection.tsx        ← Versi baru (+ tab WebGL embed)
└── App.tsx                ← Contoh routing dengan route /admin
```

---

## ⚡ Quick Start

### 1. Install dependensi router
```bash
npm install react-router-dom
```

### 2. Copy 4 file ke folder `src/` project kamu

### 3. Setup App.tsx
Pastikan `App.tsx` punya route `/admin`:
```tsx
import AdminPage from "./AdminPage";

<Route path="/admin" element={<AdminPage />} />
```

### 4. Akses halaman admin
Buka browser → **`http://localhost:5173/admin`**

---

## 🔑 Kredensial Default

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ **Ganti segera setelah deploy!**  
> Buka `/admin` → tab **SETTINGS** → ubah username & password.

---

## 📋 Fitur Admin

### Tab PROJECTS
- ✅ Tambah proyek baru
- ✅ Edit judul, kategori, tahun, status, deskripsi
- ✅ Upload URL gambar (Unsplash / CDN / lokal)
- ✅ Isi URL GitHub & Demo/Live
- ✅ Pilih warna aksen (swatch atau hex manual)
- ✅ Kelola tech stack (tambah/hapus tag)
- ✅ Hapus proyek
- ✅ Preview thumbnail gambar langsung di form

### Tab GAMES
- ✅ Tambah game WebGL embed baru
- ✅ Pilih engine: Unity · Unreal · Godot · Construct · GDevelop · Custom
- ✅ Input embed URL (itch.io / simmer.io / GitHub Pages / Netlify / server sendiri)
- ✅ Set resolusi frame (lebar × tinggi)
- ✅ Input kontrol (ditampilkan sebagai hint di bawah game)
- ✅ Preview embed langsung di dalam form
- ✅ Panduan hosting per platform
- ✅ Hapus game

### Tab SETTINGS
- ✅ Ganti username & password login
- ✅ Export semua data ke JSON
- ✅ Copy data ke clipboard
- ✅ Reset ke data bawaan
- ✅ Panduan integrasi ke source code

---

## 🎮 Cara Tambah Game Unity/Unreal/Godot

### Unity WebGL
1. Di Unity: **File → Build Settings → WebGL → Build**
2. Upload folder hasil build ke [itch.io](https://itch.io) atau [simmer.io](https://simmer.io)
3. Salin embed URL dari platform tersebut
4. Di admin panel: **Games → + TAMBAH GAME → paste URL → SIMPAN**

**Platform yang direkomendasikan:**

| Platform | Kemudahan | Gratis | URL Format |
|----------|-----------|--------|------------|
| [itch.io](https://itch.io) | ⭐⭐⭐⭐⭐ | ✅ | `https://itch.io/embed-upload/XXXXX` |
| [simmer.io](https://simmer.io) | ⭐⭐⭐⭐⭐ | ✅ | `https://simmer.io/@user/game` |
| GitHub Pages | ⭐⭐⭐⭐ | ✅ | `https://user.github.io/repo/` |
| Netlify Drop | ⭐⭐⭐⭐ | ✅ | `https://random.netlify.app/` |

### Godot HTML5
1. Di Godot: **Project → Export → HTML5 → Export Project**
2. Upload ke GitHub Pages atau Netlify
3. Paste URL ke admin panel

### Unreal Engine
1. Gunakan Pixel Streaming atau HTML5 export plugin
2. Host di server yang support WebSocket
3. Paste URL iframe ke admin panel

---

## 🔗 Cara Kerja Integrasi Data

Data disimpan di **localStorage browser** dengan key:
- `cms_projects` → array proyek
- `cms_games` → array game embed
- `cms_creds` → username & password (terenkripsi di browser)
- `cms_session` → session login (expire 8 jam)

`ProjectsSection.tsx` dan `GameSection.tsx` membaca data ini via hook:
```tsx
// Baca proyek dari CMS
const projects = useCMSProjects();

// Baca game embed dari CMS  
const games = useCMSGames();
```

Jika localStorage kosong → otomatis pakai data default dari konstanta `DEFAULT_PROJECTS` / `DEFAULT_GAMES`.

---

## 📦 Export & Deploy

Setelah selesai mengedit di admin panel:

1. Buka **SETTINGS → EXPORT JSON**
2. Buka file `portfolio-data.json`
3. Copy array `PROJECTS` → paste ke `DEFAULT_PROJECTS` di `AdminPage.tsx`
4. Copy array `GAMES` → paste ke `DEFAULT_GAMES` di `AdminPage.tsx`
5. Deploy ulang → data akan tetap ada bahkan di browser baru

> **Tip:** Langkah ini opsional. Selama data sudah ada di localStorage browser lokal, portfolio akan tampil dengan data terbaru tanpa perlu deploy ulang.

---

## 🛡️ Keamanan

- Route `/admin` tidak terdaftar di navbar, tidak diindex sitemap
- Kredensial disimpan di `localStorage` → tidak dikirim ke server manapun
- Session expire otomatis setelah **8 jam**
- Ganti password default sebelum deploy ke production

> ⚠️ Untuk production dengan keamanan lebih tinggi, pertimbangkan menyimpan kredensial di environment variable + backend API sederhana.

---

## 🐛 Troubleshooting

**Game embed tidak muncul / blank:**
- Pastikan URL yang dimasukkan adalah URL embed, bukan URL halaman biasa
- itch.io: gunakan URL dari tombol "Embed" di dashboard game, bukan URL game page
- Periksa apakah hosting game mengizinkan iframe (header `X-Frame-Options`)

**Data hilang setelah clear browser:**
- Export JSON dulu sebelum clear cache/localStorage
- Copy ke `DEFAULT_PROJECTS` di source code untuk data permanen

**Halaman /admin tidak ditemukan:**
- Pastikan sudah install `react-router-dom`
- Pastikan `App.tsx` sudah punya `<Route path="/admin" element={<AdminPage />} />`
- Untuk Vite: tambahkan `historyApiFallback: true` di `vite.config.ts`

```ts
// vite.config.ts
export default {
  server: {
    historyApiFallback: true,  // ← tambahkan ini
  }
}
```"# My-Portofolio-2.0" 
