## Apa itu NAT?

**NAT (Network Address Translation)** menerjemahkan IP privat
(`192.168.x.x`, `10.x.x.x`, dll — RFC 1918) menjadi IP publik supaya host
di jaringan lokal bisa mengakses internet, karena IP privat **tidak bisa
di-routing di internet publik**.

## Istilah interface

```
interface gigabitEthernet 0/0
 ip nat inside
 exit

interface gigabitEthernet 0/1
 ip nat outside
 exit
```

- `ip nat inside` — interface yang menghadap jaringan lokal/privat.
- `ip nat outside` — interface yang menghadap ISP/internet.

Setiap konfigurasi NAT butuh minimal 1 interface `inside` dan 1 `outside`.

## Static NAT (1-ke-1, permanen)

Untuk device yang butuh selalu bisa diakses dari luar dengan IP publik
tetap (misal web server internal):

```
ip nat inside source static 192.168.10.10 203.0.113.10
```

## Dynamic NAT (pakai pool IP publik)

IP publik dipinjamkan sementara dari sekumpulan pool ke host yang butuh
akses keluar, tapi jumlah IP publik **terbatas** sesuai pool:

```
access-list 1 permit 192.168.10.0 0.0.0.255

ip nat pool PUBLIC_POOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0

ip nat inside source list 1 pool PUBLIC_POOL
```

## PAT / NAT Overload (paling umum dipakai)

**PAT (Port Address Translation)**, sering disebut "NAT Overload", membuat
**banyak host privat berbagi 1 IP publik** sekaligus — dibedakan lewat
nomor port. Ini yang dipakai hampir semua router rumahan/kantor kecil:

```
access-list 1 permit 192.168.10.0 0.0.0.255

ip nat inside source list 1 interface gigabitEthernet 0/1 overload
```

`interface gigabitEthernet 0/1` di sini dipakai sebagai sumber IP publik
(ambil IP dari interface itu sendiri), cocok kalau IP publik cuma 1
(langsung dari ISP), bukan dari pool.

## Verifikasi

```
show ip nat translations     ! tabel terjemahan aktif (inside local ↔ inside global)
show ip nat statistics       ! ringkasan hit/miss & konfigurasi NAT aktif
clear ip nat translation *   ! bersihkan tabel translasi (kalau butuh reset saat testing)
```

## Kesalahan umum pemula

1. Lupa set `ip nat inside`/`ip nat outside` di interface → NAT tidak akan
   pernah jalan walau `ip nat inside source ...` sudah benar.
2. ACL untuk NAT terlalu longgar (`permit any`) atau terlalu sempit
   (subnet salah) → traffic yang seharusnya di-translate malah tidak
   ke-cover, atau malah semua traffic ikut ter-NAT termasuk yang tidak perlu.
3. Memakai `ip nat pool` padahal cuma punya 1 IP publik dari ISP →
   seharusnya pakai `interface ... overload` (PAT), bukan pool.
4. Testing ping dari router itu sendiri untuk cek NAT — sebaiknya test dari
   **PC/host di belakang router**, karena traffic yang originate dari router
   sendiri punya jalur proses berbeda.
