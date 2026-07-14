> **Catatan:** Frame Relay adalah teknologi WAN **legacy** yang sudah jarang
> dipakai di jaringan produksi modern (banyak digantikan MPLS/VPN/internet
> broadband). Modul ini opsional — tetap relevan untuk memahami konsep dasar
> WAN switched dan sering masih muncul di materi CCNA klasik/Packet Tracer.

## Apa itu Frame Relay?

**Frame Relay** adalah teknologi WAN Layer 2 yang menghubungkan banyak site
lewat jaringan provider memakai **virtual circuit**, tanpa perlu link fisik
dedicated ke tiap lokasi seperti leased line biasa — beberapa "sambungan
virtual" bisa berbagi 1 link fisik ke provider.

## Istilah kunci

| Istilah | Arti |
|---|---|
| **DLCI** (Data Link Connection Identifier) | Nomor identitas virtual circuit, mirip "nomor telepon" tujuan |
| **PVC** (Permanent Virtual Circuit) | Jalur virtual permanen yang dikonfigurasi provider |
| **Local Access Rate** | Kecepatan link fisik ke provider |
| **CIR** (Committed Information Rate) | Bandwidth minimum yang dijamin provider |

## Konfigurasi dasar (point-to-point subinterface — paling umum diajarkan)

Memecah 1 interface fisik jadi beberapa subinterface, tiap subinterface
mewakili 1 PVC ke 1 site tujuan — menghindari masalah **split-horizon** yang
sering terjadi di topologi hub-and-spoke Frame Relay:

```
interface serial 0/0/0
 encapsulation frame-relay
 no shutdown
 exit

interface serial 0/0/0.102 point-to-point
 ip address 10.0.12.1 255.255.255.252
 frame-relay interface-dlci 102
 exit
```

## Konfigurasi dasar (multipoint, 1 interface untuk banyak tujuan)

```
interface serial 0/0/0
 encapsulation frame-relay
 ip address 10.0.0.1 255.255.255.0
 frame-relay map ip 10.0.0.2 102 broadcast
 frame-relay map ip 10.0.0.3 103 broadcast
 no shutdown
 exit
```

`broadcast` di akhir `frame-relay map` penting supaya traffic
broadcast/multicast (misal update routing dinamis) ikut diteruskan lewat
PVC tersebut.

## Verifikasi

```
show frame-relay pvc        ! status tiap PVC (harus ACTIVE)
show frame-relay map        ! pemetaan DLCI ke IP tujuan
show interfaces serial 0/0/0 ! cek encapsulation & line protocol
```

## Kesalahan umum pemula

1. Lupa `broadcast` di `frame-relay map` (mode multipoint) → routing
   protocol dinamis (RIP/OSPF/EIGRP) tidak bisa membentuk neighbor lewat
   PVC tersebut.
2. Topologi hub-and-spoke pakai 1 interface fisik untuk banyak spoke tanpa
   subinterface → kena masalah **split-horizon**, update routing dari 1
   spoke tidak diteruskan ke spoke lain lewat hub.
3. DLCI yang dipakai di konfigurasi tidak sesuai dengan yang disediakan
   "provider" (switch Frame Relay di topologi lab) → PVC berstatus
   `INACTIVE` bukan `ACTIVE`.
4. Encapsulation dilupakan di interface fisik sebelum membuat subinterface
   → subinterface tidak akan berfungsi.
