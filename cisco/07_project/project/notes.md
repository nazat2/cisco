## Tujuan proyek

Ini adalah **lab capstone** — menggabungkan hampir semua modul (01-06)
jadi **satu topologi jaringan kantor/perusahaan yang utuh**, seperti kondisi
nyata di lapangan. Kerjakan setelah modul-modul sebelumnya sudah dikuasai.

## Studi kasus: PT Nazlingo Digital

Perusahaan dengan 1 kantor pusat (HQ) dan 1 kantor cabang, terhubung lewat
WAN link. Kantor pusat punya 3 departemen yang harus terpisah secara logis.

### Kebutuhan bisnis

1. Tiap departemen (**IT, Finance, HR**) punya VLAN sendiri, tidak bisa
   saling akses langsung kecuali lewat aturan tertentu.
2. Semua host dapat IP **otomatis** (DHCP), tidak boleh setting manual.
3. Departemen **Finance tidak boleh diakses** dari VLAN lain kecuali oleh
   IT (kebutuhan keamanan data finansial).
4. Kantor cabang terhubung ke HQ lewat **link WAN** (serial + PPP CHAP),
   dan bisa saling ping ke semua subnet HQ.
5. Semua user di HQ maupun cabang bisa browsing internet (disimulasikan
   dengan 1 "ISP router" / cloud) lewat **NAT**.
6. Redundansi: 2 switch akses di HQ terhubung ke 2 switch distribusi
   sekaligus (topologi segitiga) — harus aman dari loop.

### Modul yang dipakai di proyek ini

| Kebutuhan | Modul terkait |
|---|---|
| Segmentasi departemen | `02_vlan/vlan` |
| Link antar switch bawa banyak VLAN | `02_vlan/trunk` |
| Departemen beda VLAN saling akses (terbatas) | `02_vlan/intervlan` |
| Cegah loop di topologi redundant | `03_switch/stp` |
| IP otomatis semua departemen | `05_services/dhcp` |
| Blok akses ke VLAN Finance | `05_services/acl` |
| Link ke kantor cabang | `06_wan/serial`, `06_wan/ppp` |
| Routing antar HQ ↔ Cabang | `04_routing/staticroute` atau `04_routing/ospf` |
| Akses internet dari semua site | `05_services/nat` |

## Rencana pengalamatan (contoh, sesuaikan sendiri)

| VLAN/Link | Network | Keterangan |
|---|---|---|
| VLAN 10 — IT | 192.168.10.0/24 | Boleh akses semua VLAN |
| VLAN 20 — Finance | 192.168.20.0/24 | Hanya bisa diakses dari VLAN IT |
| VLAN 30 — HR | 192.168.30.0/24 | Akses standar |
| VLAN 99 — Management | 192.168.99.0/24 | SVI & akses perangkat |
| Link WAN HQ↔Cabang | 10.0.0.0/30 | Serial + PPP CHAP |
| Cabang LAN | 192.168.40.0/24 | Satu VLAN saja, kantor kecil |

## Urutan pengerjaan yang disarankan

1. Bangun topologi fisik dulu (switch access, distribusi, router HQ,
   router cabang, "cloud"/router ISP) di Packet Tracer.
2. Konfigurasi VLAN + trunk di semua switch (modul `vlan`, `trunk`).
3. Aktifkan STP rapid-pvst, tentukan root bridge (modul `stp`).
4. Konfigurasi inter-VLAN routing di router HQ (modul `intervlan`).
5. Setup DHCP pool per VLAN (modul `dhcp`).
6. Pasang ACL supaya Finance hanya bisa diakses dari IT (modul `acl`).
7. Konfigurasi link serial + PPP CHAP ke cabang (modul `serial`, `ppp`).
8. Routing antar site — static route atau OSPF (modul `staticroute`/`ospf`).
9. NAT/PAT di router HQ & cabang menghadap ISP (modul `nat`).
10. Uji end-to-end: ping semua kombinasi VLAN sesuai aturan bisnis,
    browsing simulasi internet, dan pastikan Finance benar-benar terkunci
    dari VLAN lain selain IT.

## Checklist pengujian akhir

Gunakan `ping` dan `tracert` dari PC-PT di tiap VLAN untuk membuktikan
semua aturan bisnis di atas benar-benar terpenuhi, bukan cuma "kelihatannya
jalan". Screenshot/`show ip route`, `show vlan brief`, `show access-lists`,
dan `show ip nat translations` di tiap perangkat sebagai bukti dokumentasi.

## Kesalahan umum yang sering terjadi di proyek gabungan

1. ACL dipasang sebelum inter-VLAN routing selesai diuji — susah bedakan
   masalah routing vs masalah ACL. Uji ping dulu **tanpa ACL**, baru
   tambahkan ACL setelah yakin routing beres.
2. Lupa `ip helper-address` untuk VLAN yang gateway-nya beda dari lokasi
   DHCP server (kalau DHCP server terpusat, bukan di router itu sendiri).
3. NAT dipasang tapi routing antar HQ-cabang belum beres → traffic internet
   dari cabang malah nyasar balik ke HQ dulu tanpa jalur yang benar.
4. Terlalu banyak berubah sekaligus lalu bingung cari masalah — ubah 1
   bagian, uji, baru lanjut ke bagian berikutnya (incremental testing).
