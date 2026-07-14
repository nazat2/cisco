# 🖧 CiscoHub — Website Belajar Cisco Networking dari Nol

Website statis (HTML/CSS/JS murni, tanpa build step) untuk belajar dasar
jaringan Cisco secara mandiri: dari CLI dasar sampai troubleshooting.
Ringan, responsif (mobile & desktop), dan progress belajar tersimpan
otomatis di browser (localStorage) — tanpa perlu akun/login.

**Demo lokal:** buka `index.html` lewat live server (lihat bagian
[Menjalankan secara lokal](#menjalankan-secara-lokal) — jangan dobel klik
langsung karena browser memblokir `fetch()` file lokal via `file://`).

## ✨ Fitur

- 19 modul praktik dalam 7 folder terstruktur (01_basic → 02_vlan → 03_switch → 04_routing → 05_services → 06_wan → 07_project)
- Sidebar folder-tree yang bisa dibuka/tutup (accordion) per kategori, mengikuti struktur folder asli di `cisco/`
- Tiap modul: tab **Teori**, **Config CLI** (dengan tombol copy), dan **Checklist Lab**
- Progress checklist tersimpan otomatis per-browser (localStorage), ditampilkan sebagai LED di sidebar & progress bar di topbar
- Cheat sheet semua perintah + tabel subnetting dalam 1 halaman
- Contoh konfigurasi siap pakai (`switch-basic.cfg`, `router-basic.cfg`, `full-lab-topology.cfg`)
- Panduan desain topologi lab + diagram contoh
- Sidebar mobile (hamburger menu), 404 custom, dark "network console" theme
- Materi mentah (`.md` / `.cfg`) juga bisa dibaca langsung di GitHub tanpa buka website — sumber tunggal, website hanya "menampilkan" file yang sama

## 🗂 Struktur folder

```
.
├── index.html                 # Dashboard / halaman utama
├── 404.html                   # Halaman not-found custom
├── vercel.json                # Konfigurasi deploy Vercel
│
├── assets/
│   ├── css/style.css          # Design system (1 file, semua styling)
│   ├── js/main.js             # Sidebar folder-tree, loader markdown/config, checklist, tabs
│   └── img/                   # (kosong, siap untuk aset tambahan)
│
├── pages/                     # Semua halaman modul & referensi (19 modul + referensi)
│   ├── 01-basic.html
│   ├── 02-vlan.html / 03-trunk.html / 04-intervlan.html
│   ├── 05-stp.html / 06-etherchannel.html / 07-portsecurity.html
│   ├── 08-static-route.html / 09-rip.html / 10-ospf.html / 11-eigrp.html
│   ├── 12-dhcp.html / 13-dns.html / 14-nat.html / 15-acl.html
│   ├── 16-serial.html / 17-ppp.html / 18-framerelay.html
│   ├── 19-project.html
│   ├── 08-troubleshooting.html, notes.html, configs.html, topology.html, shortcuts.html
│
└── cisco/                     # 📚 MATERI MENTAH — sumber tunggal (single source of truth)
    ├── 01_basic/
    │   └── basic/                # README.md, notes.md, config-sample.cfg
    ├── 02_vlan/
    │   ├── vlan/ trunk/ intervlan/
    ├── 03_switch/
    │   ├── stp/ etherchannel/ portsecurity/
    ├── 04_routing/
    │   ├── staticroute/ rip/ ospf/ eigrp/
    ├── 05_services/
    │   ├── dhcp/ dns/ nat/ acl/
    ├── 06_wan/
    │   ├── serial/ ppp/ framerelay/
    ├── 07_project/
    │   └── project/
    ├── 08_troubleshooting/        # referensi tambahan (di luar 7 folder utama)
    │
    ├── configs/                 # Template konfigurasi siap pakai (lintas topik)
    ├── notes/                   # Cheat sheet & tabel subnetting
    └── topology/                # Panduan desain topologi + diagram contoh
```

> Setiap folder di dalam `cisco/` punya `README.md` sendiri yang menjelaskan
> isi & tujuan folder tersebut — buka langsung kalau mau baca tanpa lewat
> website.

## 🖥️ Menjalankan secara lokal

Website ini fetch file `.md`/`.cfg` lewat JavaScript, jadi **harus** dibuka
lewat server lokal (bukan dobel klik file):

```bash
# opsi 1: pakai Python (sudah ada di kebanyakan OS)
python3 -m http.server 8000
# lalu buka http://localhost:8000

# opsi 2: pakai Node
npx serve .

# opsi 3: pakai Vercel CLI (sekalian simulasi environment production)
npx vercel dev
```

## 🚀 Deploy ke Vercel (lewat GitHub)

1. **Push ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: CiscoHub learning site"
   git branch -M main
   git remote add origin https://github.com/<username>/<nama-repo>.git
   git push -u origin main
   ```

2. **Import di Vercel**
   - Buka [vercel.com](https://vercel.com) → **Add New Project**
   - Pilih repo GitHub yang baru di-push
   - Framework Preset: pilih **Other** (tidak perlu build command, tidak ada `package.json` wajib)
   - Root Directory: biarkan default (`.`)
   - Klik **Deploy**

3. Selesai — Vercel akan otomatis re-deploy tiap kali kamu `git push` ke branch `main`.

Tidak ada langkah build/compile sama sekali — semua file sudah HTML/CSS/JS
polos, jadi deploy-nya instan dan ringan.

## 🎨 Desain

Tema "network operations console" — palet biru gelap ala blueprint dengan
aksen cyan/amber meniru lampu status port switch. Sidebar didesain sebagai
folder-tree (accordion, mengikuti struktur `cisco/`) berisi port bernomor
(Gi0/1–Gi0/19) yang LED-nya berubah warna sesuai progres checklist tiap
modul. Font: **Space Grotesk** (judul), **Inter** (teks), **JetBrains Mono**
(kode & data teknis).

## 🧩 Tech stack

- HTML5 + CSS3 murni (custom properties / CSS variables, tanpa framework CSS)
- Vanilla JavaScript (tanpa build tool, tanpa dependency npm)
- [marked.js](https://marked.js.org/) via CDN — untuk render file `.md` jadi HTML
- Font dari Google Fonts (CDN)
- localStorage — menyimpan progres checklist per-browser (tidak dikirim ke server manapun)

## 📄 Lisensi

Bebas dipakai, diedit, dan dibagikan untuk keperluan belajar.
