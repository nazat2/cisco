## Kenapa butuh routing?

Router hanya tahu jaringan yang **terhubung langsung** dengannya (connected
route). Untuk mencapai network yang jauh (di balik router lain), router
butuh entri tambahan di tabel routing — bisa dibuat manual (**static
route**) atau dipelajari otomatis lewat protokol dinamis (modul `rip`,
`ospf`, `eigrp`).

## Kapan pakai Static Route?

Cocok untuk jaringan **kecil, sederhana, dan jarang berubah topologinya** —
tidak butuh overhead protokol dinamis. Kekurangannya: harus diketik ulang
manual di semua router kalau topologi berubah, dan tidak otomatis reroute
kalau ada jalur alternatif.

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
internet/ISP, supaya tidak perlu tahu semua network tujuan di internet satu
per satu:

```
ip route 0.0.0.0 0.0.0.0 10.0.0.1
```

## Floating Static Route (backup)

Static route cadangan yang hanya aktif kalau jalur utama (biasanya dari
routing dinamis) mati. Dibuat dengan menaikkan **Administrative Distance**
manual supaya kalah prioritas dibanding jalur utama:

```
ip route 192.168.30.0 255.255.255.0 10.0.0.2 200
! angka 200 di akhir = AD custom, lebih besar dari AD OSPF (110) misalnya
```

## Administrative Distance (AD)

Kalau ada beberapa sumber informasi routing ke tujuan yang sama, router
memilih rute dari sumber dengan **AD paling kecil** (paling dipercaya):

| Sumber | AD default |
|---|---|
| Connected (langsung terhubung) | 0 |
| Static route | 1 |
| EIGRP | 90 |
| OSPF | 110 |
| RIP | 120 |

## Verifikasi

```
show ip route                 ! seluruh tabel routing
show ip route static          ! hanya rute static
show ip route 192.168.30.0    ! detail 1 rute spesifik
```

Kode di depan tiap baris `show ip route`: `S` = static, `C` = connected,
`S*` = static default route.

## Kesalahan umum pemula

1. Subnet mask atau next-hop salah ketik → rute tidak pernah dipakai atau
   traffic salah arah.
2. Lupa bahwa static route **1 arah saja** — kalau mau 2 jaringan saling
   ping, static route harus dipasang di **kedua** router (arah pulang-pergi).
3. Pakai exit-interface pada media multi-access (Ethernet) tanpa next-hop IP
   → bisa menyebabkan masalah ARP proxy yang tidak diinginkan; sebaiknya
   pakai IP next-hop untuk Ethernet.
4. Default route dan static route spesifik tertukar prioritas — padahal
   router selalu memilih match **paling spesifik (longest prefix match)**
   dulu, baru fallback ke default route.
