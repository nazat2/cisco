# 07_routing — Static & Dynamic Routing

Materi dasar routing antar network yang tidak terhubung langsung.

## Isi folder
- `notes.md` — static route, default route, pengenalan OSPF.
- `config-sample.cfg` — contoh static route + OSPF sederhana.

## Tujuan belajar
1. Bisa membuat static route & default route.
2. Paham administrative distance secara dasar.
3. Bisa konfigurasi OSPF single-area sederhana.
4. Bisa membaca `show ip route`.

## Kebutuhan topologi lab
- 🖥️ 2x Router — **Cisco 1941 (ISR G2)**, terhubung via kabel serial (tambahkan modul **WIC-2T** di slot HWIC kosong) atau GigabitEthernet
- 🖧 1x Switch per router — **Cisco 2960** (masing-masing router punya LAN sendiri)
- 💻 1-2x PC per LAN — **PC-PT (generic)**, untuk uji ping antar-LAN yang beda router

Kalau salah satu router belum punya modul serial di Packet Tracer, matikan
dulu perangkat (power off) sebelum drag modul WIC ke slot-nya.
