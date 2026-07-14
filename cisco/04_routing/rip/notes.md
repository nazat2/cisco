## Apa itu RIP?

**RIP (Routing Information Protocol)** adalah protokol routing dinamis
tipe **distance-vector** paling tua & paling sederhana. Router otomatis
saling bertukar seluruh tabel routing secara berkala (default tiap 30
detik), tanpa perlu diketik manual satu-satu seperti static route.

## Metric: Hop Count

RIP menentukan jalur terbaik murni dari **jumlah hop** (jumlah router yang
dilewati) — jalur dengan hop count terkecil yang dipilih, walaupun jalur itu
sebenarnya lebih lambat (link rendah bandwidth tapi hop sedikit tetap
"menang").

- Maksimal **15 hop**. Network dengan hop ke-16 dianggap **unreachable**
  (infinity) — inilah kenapa RIP tidak cocok untuk jaringan besar.

## RIPv1 vs RIPv2

| | RIPv1 | RIPv2 |
|---|---|---|
| Classless (kirim info subnet mask) | ❌ | ✅ |
| Mendukung VLSM/subnetting tidak rata | ❌ | ✅ |
| Update | Broadcast (255.255.255.255) | Multicast (224.0.0.9) |
| Autentikasi | Tidak ada | Ada (opsional) |

Karena hampir semua jaringan modern pakai VLSM, **selalu pakai RIPv2**.

## Konfigurasi

```
router rip
 version 2
 network 192.168.10.0
 network 10.0.0.0
 no auto-summary
 exit
```

- `network` — diisi network **classful** (bukan dengan subnet mask/wildcard
  seperti OSPF/EIGRP) dari interface yang mau ikut proses RIP.
- `no auto-summary` — **wajib** di jaringan modern, supaya RIPv2 tidak
  otomatis meringkas network jadi bentuk classful (yang bisa merusak info
  subnetting/VLSM).

## Verifikasi

```
show ip protocols        ! protokol routing yang aktif + network yang diiklankan
show ip route rip        ! hanya rute yang dipelajari lewat RIP (kode "R")
debug ip rip              ! lihat update RIP real-time (matikan lagi dgn "no debug ip rip" / "undebug all")
```

## Kesalahan umum pemula

1. Mengisi `network` dengan alamat subnet lengkap (misal
   `192.168.10.0 255.255.255.0`) — RIP hanya menerima network **classful**
   tanpa mask di command `network`.
2. Lupa `no auto-summary` — di topologi VLSM, network jadi salah baca
   (summary otomatis ke batas classful) dan routing rusak.
3. Menganggap RIP cocok untuk jaringan besar — di atas 15 hop, network
   dianggap unreachable, RIP hanya cocok lab kecil/latihan.
4. Interface yang menghadap LAN ikut memancarkan update RIP secara tidak
   perlu — sebaiknya pakai `passive-interface` di interface yang tidak
   punya router tetangga (menghemat bandwidth, sedikit lebih aman).
