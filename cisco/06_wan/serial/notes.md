## Apa itu koneksi Serial?

Interface **Serial** dipakai untuk koneksi **WAN point-to-point** antar
router (misal menghubungkan 2 kantor beda lokasi lewat leased line). Beda
dengan Ethernet yang broadcast/multi-access, link serial biasanya
**dedicated** antara persis 2 endpoint.

## DCE vs DTE

Kabel serial (di Packet Tracer maupun dunia nyata) selalu punya 2 ujung
berbeda peran:

| Sisi | Peran | Tugas |
|---|---|---|
| **DCE** (Data Communication Equipment) | "Penyedia clock" | Wajib set `clock rate` |
| **DTE** (Data Terminal Equipment) | "Penerima clock" | Tidak perlu set clock rate |

Cek sisi mana yang DCE dengan `show controllers serial 0/0/0` — kabel di
Packet Tracer biasanya sudah otomatis terpasang salah satu ujungnya sebagai
DCE (ada ikon jam di kabel).

```
interface serial 0/0/0
 clock rate 64000        ! HANYA di sisi DCE
 no shutdown
 exit
```

## Bandwidth vs Clock Rate — sering tertukar!

- **`clock rate`** — kecepatan **fisik** aktual link (hanya di sisi DCE,
  wajib supaya link bisa `up/up`).
- **`bandwidth`** — nilai **logis** yang dipakai protokol routing (OSPF,
  EIGRP) untuk hitung metric/cost. Tidak mengubah kecepatan fisik sama
  sekali, murni informasi untuk software.

```
interface serial 0/0/0
 bandwidth 64
 exit
```

Kalau `bandwidth` tidak diset sesuai kecepatan asli, protokol routing bisa
salah menghitung jalur terbaik (lihat modul `ospf`).

## Encapsulation

Default encapsulation serial Cisco adalah **HDLC** (proprietary Cisco,
cocok kalau kedua ujung sama-sama router Cisco):

```
interface serial 0/0/0
 encapsulation hdlc
 exit
```

Untuk interoperability dengan vendor lain atau butuh autentikasi, pakai
**PPP** (lihat modul `ppp`).

## Verifikasi

```
show interfaces serial 0/0/0     ! status line protocol, encapsulation, bandwidth
show controllers serial 0/0/0    ! cek sisi DCE/DTE
show ip interface brief          ! status up/down semua interface sekilas
```

Status ideal: `Serial0/0/0 is up, line protocol is up`. Kalau
`line protocol is down` padahal `up` — biasanya encapsulation kedua sisi
tidak cocok, atau clock rate belum diset di sisi DCE.

## Kesalahan umum pemula

1. Lupa `clock rate` di sisi DCE → status interface `down/down`, link tidak
   akan pernah aktif.
2. Set `clock rate` di sisi DTE (bukan DCE) → command ditolak/tidak berlaku.
3. Lupa `no shutdown` — interface serial default `shutdown` di IOS, sama
   seperti interface fisik lain.
4. Encapsulation kedua ujung beda (misal satu HDLC, satu PPP) →
   `line protocol is down` walau fisik & clock rate sudah benar.
