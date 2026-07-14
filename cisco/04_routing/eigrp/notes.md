## Apa itu EIGRP?

**EIGRP (Enhanced Interior Gateway Routing Protocol)** awalnya proprietary
Cisco, sekarang sudah open-standard. Sering disebut protokol **hybrid**
(kadang "advanced distance-vector") karena punya sifat distance-vector tapi
dengan efisiensi mirip link-state (tahu topologi tetangga lebih detail lewat
tabel topology terpisah).

## Kenapa EIGRP populer?

- **Konvergensi sangat cepat** lewat algoritma **DUAL** (Diffusing Update
  Algorithm) — punya jalur backup (**feasible successor**) yang sudah
  dihitung duluan, jadi kalau jalur utama putus, langsung pakai backup
  tanpa perlu hitung ulang dari nol.
- **Metric lebih detail** dibanding RIP — mempertimbangkan bandwidth & delay
  (bisa juga load/reliability, tapi jarang dipakai default).
- Mendukung **VLSM & unequal-cost load balancing** (bisa bagi trafik ke
  beberapa jalur walau costnya tidak sama persis).

## Konfigurasi dasar (classic mode)

```
router eigrp 100
 network 192.168.10.0 0.0.0.255
 network 10.0.0.0 0.0.0.3
 no auto-summary
 eigrp router-id 1.1.1.1
 exit
```

- `router eigrp 100` — **Autonomous System (AS) number**. Beda dengan OSPF
  Process ID, angka ini **harus sama** di semua router yang mau saling
  bertetangga (tidak sekadar label lokal).
- `network` — pakai **wildcard mask**, sama seperti OSPF.
- `no auto-summary` — wajib di jaringan VLSM modern, sama alasannya dengan RIP.

## Istilah kunci DUAL

| Istilah | Arti |
|---|---|
| Successor | Jalur terbaik saat ini menuju sebuah network (dipakai aktif) |
| Feasible Successor | Jalur backup yang sudah pasti loop-free, siap dipakai instan kalau successor mati |
| Feasible Distance (FD) | Metric terbaik yang diketahui router ke sebuah network |
| Reported Distance (RD) | Metric yang dilaporkan tetangga ke network tersebut |

## Verifikasi

```
show ip eigrp neighbors      ! tetangga EIGRP yang terbentuk
show ip protocols            ! ringkasan proses EIGRP aktif
show ip route eigrp          ! rute yang dipelajari lewat EIGRP (kode "D")
show ip eigrp topology        ! successor & feasible successor tiap network
```

## Kesalahan umum pemula

1. AS number beda antar router (misal `router eigrp 100` vs
   `router eigrp 200`) → neighbor **tidak akan pernah terbentuk**, beda
   dengan OSPF Process ID yang boleh beda.
2. Lupa wildcard mask di `network`, atau salah tulis subnet mask biasa →
   interface tidak ikut proses EIGRP.
3. Hello/Hold timer default beda-beda per tipe media tanpa disamakan
   manual → adjacency bisa naik-turun (flapping) di link tertentu.
4. Bandwidth interface serial default di Packet Tracer sering tidak
   realistis (misal default 1544 Kbps padahal fisiknya lebih lambat) →
   metric jadi salah perhitungan; sebaiknya set `bandwidth` manual sesuai
   kapasitas link sebenarnya.
