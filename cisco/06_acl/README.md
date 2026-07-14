# 06_acl — Access Control List

Materi menyaring (filter) trafik jaringan berdasarkan aturan.

## Isi folder
- `notes.md` — konsep ACL, standard vs extended, wildcard mask, penempatan ACL.
- `config-sample.cfg` — contoh standard & extended ACL.

## Tujuan belajar
1. Paham perbedaan Standard ACL vs Extended ACL.
2. Bisa menghitung wildcard mask.
3. Paham urutan evaluasi ACL (top-down) & implicit deny.
4. Bisa menempatkan ACL di interface yang benar (in/out).

## Kebutuhan topologi lab
- 🖥️ 1x Router — **Cisco 1941 (ISR G2)**
- 🖧 2x Switch — **Cisco 2960** (satu untuk sisi client, satu untuk sisi server)
- 💻 1x PC — **PC-PT (generic)**, berperan sebagai "server" (mis. jalankan HTTP service di Packet Tracer)
- 💻 1-2x PC — **PC-PT (generic)**, sebagai client, untuk uji coba trafik yang diblok/diizinkan ACL
