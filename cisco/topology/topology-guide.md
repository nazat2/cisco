## Prinsip mendesain topologi lab

1. **Mulai kecil** — 1 switch + 2 PC dulu untuk modul 01-02, baru tambah
   kompleksitas (switch kedua, router) di modul selanjutnya.
2. **Gunakan penomoran IP yang konsisten** — misalnya oktet ke-3 = nomor
   VLAN (`192.168.10.0/24` = VLAN 10, `192.168.20.0/24` = VLAN 20), supaya
   gampang diingat dan di-debug.
3. **Beri nama perangkat sesuai peran**, bukan default (`Switch0`,
   `Router0`) — pakai `SW1`, `SW2`, `R1` supaya jelas saat lihat topologi
   ramai.
4. **Gambar dulu di kertas / draw.io sebelum praktik** — supaya IP
   addressing dan VLAN plan sudah matang sebelum ngetik di CLI.

## Rekomendasi tipe/model perangkat (Packet Tracer)

Supaya konsisten di semua modul dan nggak bingung pilih device pas buka
Packet Tracer, pakai model berikut (semua tersedia default di Packet
Tracer, tidak perlu custom template):

| Peran | Model yang dipakai | Alasan |
|---|---|---|
| Router | **Cisco 1941 (ISR G2)** | Punya 2x onboard GigabitEthernet (cukup untuk router-on-a-stick) + slot HWIC kosong buat tambah modul **WIC-2T** (serial, dipakai di modul 07) |
| Switch (L2 access/distribution) | **Cisco 2960** | Port FastEthernet banyak (cocok buat access port ke PC) + 2 port Gigabit uplink (cocok buat trunk antar-switch/ke router) |
| Switch (L3, opsional) | **Cisco 3560** | Dipakai **hanya kalau** praktik metode SVI di modul 04 (inter-VLAN routing tanpa router terpisah) — 2960 biasa **tidak bisa** routing |
| PC | **PC-PT (generic)** | PC bawaan Packet Tracer, cukup buat tes IP config, ping, DHCP client, dan simulasi HTTP server (modul 06) |

> Kalau nama model di atas nggak ada di daftar device kamu (versi Packet
> Tracer beda-beda), cari yang paling mendekati — yang penting jumlah dan
> jenis port-nya cocok (Router: GigabitEthernet + slot serial kosong,
> Switch: FastEthernet + Gigabit uplink).

## Topologi rekomendasi per modul

| Modul | Topologi minimal |
|---|---|
| 01 basic | 1 switch, 2 PC |
| 02 vlan | 1 switch, 4 PC (2 VLAN berbeda) |
| 03 trunk | 2 switch terhubung, 4 PC (VLAN sama di kedua switch) |
| 04 intervlan | 1 router + 1 switch + 4 PC (2 VLAN) |
| 05 dhcp | 1 router (DHCP server) + 1 switch + beberapa PC mode DHCP |
| 06 acl | 1 router + 2 switch + 1 "server" PC + PC client |
| 07 routing | 2 router terhubung serial/WAN + masing-masing punya LAN sendiri |
| 08 troubleshooting | Gabungan semua topologi di atas, sengaja disuntik error untuk dicari |

## IP addressing plan contoh (dipakai konsisten di semua modul)

| VLAN | Nama | Subnet | Gateway |
|---|---|---|---|
| 10 | DATA | 192.168.10.0/24 | 192.168.10.1 |
| 20 | VOICE | 192.168.20.0/24 | 192.168.20.1 |
| 30 | SERVER | 192.168.30.0/24 | 192.168.30.1 |
| 99 | MANAGEMENT | 192.168.99.0/24 | 192.168.99.1 |
