# 01_basic — Dasar CLI Cisco IOS

Folder ini isinya materi paling awal sebelum masuk ke topik jaringan yang
lebih spesifik (VLAN, trunk, routing, dst).

## Isi folder
- `notes.md` — teori + kumpulan perintah dasar Cisco IOS (mode CLI, hostname,
  password, banner, menyimpan konfigurasi).
- `config-sample.cfg` — contoh konfigurasi dasar sebuah switch/router baru.

## Tujuan belajar
Setelah modul ini kamu harus bisa:
1. Membedakan mode User EXEC, Privileged EXEC, Global Config, dan Interface Config.
2. Memberi hostname, banner, dan password ke perangkat.
3. Menyimpan konfigurasi (`copy running-config startup-config`).
4. Menggunakan perintah `show` dasar untuk cek kondisi perangkat.

## Kebutuhan topologi lab
Perangkat minimal yang perlu disiapkan di Packet Tracer:
- 🖧 1x Switch — **Cisco 2960**
- 💻 2x PC — **PC-PT (generic)**, dihubungkan ke switch pakai kabel straight-through

Belum butuh router atau trunk — fokus modul ini murni CLI dasar di 1 switch.

> Kerjakan modul ini pertama sebelum lanjut ke `02_vlan`.
