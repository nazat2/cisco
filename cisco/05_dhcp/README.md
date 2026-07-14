# 05_dhcp — DHCP Server & Relay

Materi konfigurasi DHCP di router/switch Cisco untuk alokasi IP otomatis.

## Isi folder
- `notes.md` — konsep DHCP, DORA process, exclude address, DHCP relay.
- `config-sample.cfg` — contoh DHCP pool untuk 2 VLAN berbeda.

## Tujuan belajar
1. Paham proses DORA (Discover, Offer, Request, Acknowledge).
2. Bisa membuat DHCP pool per VLAN/subnet di router Cisco.
3. Paham kapan butuh `ip helper-address` (DHCP relay).
4. Bisa verifikasi dengan `show ip dhcp binding`.

## Kebutuhan topologi lab
- 🖥️ 1x Router — **Cisco 1941 (ISR G2)**, berperan sebagai DHCP server
- 🖧 1x Switch — **Cisco 2960**
- 💻 3-4x PC — **PC-PT (generic)**, set IP configuration ke **DHCP** (bukan static) di tiap PC untuk uji coba

Kalau topologinya lebih dari 1 switch/subnet (DHCP relay), tambah 1 switch +
1 router lagi dan pasang `ip helper-address` di interface yang tidak
langsung terhubung ke DHCP server.
