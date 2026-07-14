## Pendekatan sistematis (jangan asal tebak!)

Jaringan bermasalah sebaiknya didekati per-layer OSI, bukan asal coba-coba.
Tiga pendekatan umum:

- **Bottom-up** — mulai dari Layer 1 (fisik: kabel, lampu port) naik ke atas.
  Cocok kalau dugaan masalahnya di hardware/koneksi.
- **Top-down** — mulai dari Layer 7 (aplikasi) turun ke bawah. Cocok kalau
  1 aplikasi tertentu saja yang bermasalah, yang lain normal.
- **Divide & conquer** — mulai dari tengah (biasanya Layer 3, cek IP/routing)
  lalu putuskan naik atau turun berdasarkan hasil.

## Checklist cepat per layer

| Layer | Yang dicek | Perintah |
|---|---|---|
| L1 Physical | Lampu port nyala? Kabel benar (straight/cross)? | `show interfaces` (lihat status `up/up`) |
| L2 Data Link | VLAN benar? Trunk terbentuk? MAC table? | `show vlan brief`, `show interfaces trunk`, `show mac address-table` |
| L3 Network | IP/subnet benar? Routing ada? | `show ip interface brief`, `show ip route`, `ping` |
| L4-7 | Port/ACL memblok? Service jalan? | `show access-lists`, `show ip nat translations` |

## Perintah diagnosa paling penting

```
show ip interface brief     ! status up/down semua interface + IP, paling sering dipakai pertama
show interfaces <int>       ! detail error counter (CRC, collisions, drops)
show cdp neighbors detail   ! perangkat Cisco yang terhubung langsung + versi IOS-nya
show mac address-table      ! MAC yang dipelajari switch, per VLAN & port
show vlan brief             ! VLAN & anggota port-nya
show interfaces trunk       ! status trunk & VLAN yang di-allow
show ip route               ! tabel routing
show running-config         ! seluruh konfigurasi aktif, cek typo/salah setting
```

## Membaca hasil `ping`

```
Switch> ping 192.168.20.10

!!!!!    -> 5 dari 5 paket sukses (100%)
.....    -> 5 dari 5 paket TIMEOUT (0%), request time out
U.U.U    -> destination unreachable (biasanya masalah routing)
```

- `.` = timeout / tidak ada balasan sama sekali → curigai L1-L3 (kabel, IP,
  routing, ACL yang blok ICMP)
- `U` = destination unreachable → router tahu tidak ada jalur ke tujuan
  (routing table tidak lengkap)

## `traceroute` untuk mempersempit lokasi masalah

```
Switch> traceroute 192.168.30.10
```

Menunjukkan setiap hop (router) yang dilewati paket. Kalau hop ke-2 sudah
timeout, berarti masalah ada **di router itu atau setelahnya**, bukan di
awal jalur.

## Studi kasus umum

| Gejala | Kemungkinan penyebab |
|---|---|
| 2 PC di VLAN sama tidak bisa ping | Port belum di-assign VLAN yang benar, atau kabel di port yang salah |
| 2 PC beda VLAN tidak bisa ping | Normal jika belum ada inter-VLAN routing (lihat modul 04) |
| PC tidak dapat IP otomatis | DHCP pool salah subnet, atau `ip helper-address` belum diset (lihat modul 05) |
| Trunk tidak terbentuk | Native VLAN beda, atau salah satu ujung masih `mode access` |
| Ping sukses tapi browsing gagal | Kemungkinan masalah DNS, bukan konektivitas dasar |
| Admin sendiri terkunci SSH/Telnet | ACL terlalu ketat, lupa `permit` untuk subnet management |

## Kebiasaan baik saat troubleshooting

1. Selalu cek **satu variabel** dulu sebelum ubah yang lain — supaya tahu
   persis apa yang memperbaiki masalah.
2. Dokumentasikan topologi & IP addressing sebelum mulai (biar tidak nebak).
3. Gunakan `show running-config` untuk bandingkan dengan konfigurasi yang
   seharusnya (baseline).
4. Kalau di Packet Tracer, mode **Simulation** sangat membantu — bisa lihat
   paket berjalan hop demi hop secara visual.
