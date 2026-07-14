# 08_troubleshooting — Diagnosa Masalah Jaringan

Materi metodologi & perintah untuk mencari akar masalah saat jaringan
bermasalah.

## Isi folder
- `notes.md` — metodologi troubleshooting (OSI layer) + perintah diagnosa.
- `config-sample.cfg` — contoh perintah `show`/`debug` yang sering dipakai (bukan config, tapi kumpulan perintah diagnosa).

## Tujuan belajar
1. Bisa mengikuti pendekatan sistematis (bottom-up / top-down / divide & conquer).
2. Hafal perintah `show` & `debug` paling penting untuk diagnosa cepat.
3. Bisa membaca output `ping` & `traceroute` untuk mempersempit masalah.
4. Paham studi kasus umum & solusinya.

## Kebutuhan topologi lab
Gabungan semua topologi sebelumnya jadi satu lab besar:
- 🖥️ 2x Router — **Cisco 1941 (ISR G2)**
- 🖧 2x Switch — **Cisco 2960**
- 💻 6-8x PC — **PC-PT (generic)**, tersebar di beberapa VLAN

Cara paling efektif: pakai file `.pkt` dari modul 07 yang sudah jadi, lalu
**sengaja rusak** 1-2 konfigurasi (matikan interface, salah VLAN, ACL
kebalik in/out, dll) sebelum praktik mencari & memperbaikinya.
