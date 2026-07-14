## Kenapa butuh routing?

Router hanya tahu jaringan yang **terhubung langsung** dengannya (connected
route). Untuk mencapai network yang jauh (di balik router lain), router
butuh entri di tabel routing — bisa dibuat manual (**static**) atau
dipelajari otomatis lewat protokol (**dynamic**, misal OSPF, RIP, EIGRP).

## Static Route

Cocok untuk jaringan kecil/sederhana yang jarang berubah topologinya.

```
ip route <network_tujuan> <subnet_mask> <next_hop_atau_exit_interface>
```

Contoh:

```
ip route 192.168.30.0 255.255.255.0 10.0.0.2
```

Artinya: untuk mencapai network `192.168.30.0/24`, kirim paket ke router
berikutnya di `10.0.0.2`.

## Default Route

Route "jalan terakhir" — dipakai kalau tidak ada entri spesifik lain yang
cocok di tabel routing. Sangat umum dipakai di router yang menghadap
internet/ISP.

```
ip route 0.0.0.0 0.0.0.0 10.0.0.1
```

## Administrative Distance (AD)

Kalau ada beberapa sumber informasi routing ke tujuan yang sama, router
memilih yang **AD paling kecil** (paling dipercaya):

| Sumber | AD default |
|---|---|
| Connected (langsung terhubung) | 0 |
| Static route | 1 |
| OSPF | 110 |
| RIP | 120 |

## Dynamic Routing — OSPF (pengenalan)

OSPF (Open Shortest Path First) otomatis saling bertukar info routing antar
router tanpa perlu diketik manual satu-satu. Cocok untuk jaringan menengah
sampai besar.

```
router ospf 1
 network 192.168.10.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
 exit
```

- `router ospf 1` — proses ID OSPF (lokal, boleh beda tiap router)
- `network ... area 0` — subnet mana yang ikut diiklankan OSPF, memakai
  wildcard mask (sama seperti ACL)
- `area 0` — semua router idealnya minimal punya 1 area, area 0 = backbone

## Verifikasi

```
show ip route              ! tabel routing lengkap
show ip route static       ! hanya static route
show ip route ospf         ! hanya route hasil OSPF
show ip protocols          ! ringkasan protokol routing yang aktif
show ip ospf neighbor      ! daftar router tetangga OSPF yang sudah terbentuk
```

Kode di depan tiap baris `show ip route` penting:

| Kode | Artinya |
|---|---|
| `C` | Connected (terhubung langsung) |
| `S` | Static route |
| `O` | OSPF |
| `S*` | Static default route (kandidat gateway of last resort) |

## Kesalahan umum pemula

1. Salah arah next-hop (nembak ke interface sendiri, bukan ke router
   tetangga) → route tidak pernah aktif.
2. Wildcard mask OSPF ketukar dengan subnet mask (sama seperti kasus ACL).
3. Lupa bahwa static route harus dibuat **di kedua sisi** — router tujuan
   juga harus tahu cara balik ke network asal, kalau tidak paket "nyasar
   sekali jalan" (ping timeout meski ICMP request sampai).
4. OSPF area number beda antar router yang seharusnya jadi tetangga →
   neighbor relationship tidak pernah terbentuk.
