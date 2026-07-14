## Apa itu ACL?

**ACL (Access Control List)** adalah kumpulan aturan `permit`/`deny` yang
mengatur trafik mana yang boleh lewat sebuah interface router. Dipakai untuk
keamanan dasar (misal: blok subnet tertentu akses ke server tertentu).

## Aturan penting yang wajib diingat

1. ACL dievaluasi **baris per baris, dari atas ke bawah** — begitu ada baris
   yang cocok (`match`), proses berhenti, sisa baris di bawahnya diabaikan.
2. Di akhir setiap ACL ada **implicit deny** (`deny any`) yang tidak
   terlihat — kalau tidak ada baris yang cocok, trafik otomatis diblok.
3. Karena itu, **urutan** aturan sangat penting: aturan lebih spesifik harus
   ditaruh di atas aturan yang lebih umum.

## Wildcard Mask (bukan subnet mask!)

Wildcard mask itu kebalikan logika dari subnet mask: `0` = harus cocok
persis, `1` = boleh apa saja (don't care).

| Subnet mask | Wildcard mask | Artinya |
|---|---|---|
| 255.255.255.0 | 0.0.0.255 | Cocokkan network /24, host bebas |
| 255.255.255.255 | 0.0.0.0 | Harus IP itu persis (host tunggal) |
| 0.0.0.0 | 255.255.255.255 | Semua IP (`any`) |

Trik cepat: `255 - oktet subnet mask = oktet wildcard`.
Contoh: subnet `255.255.255.192` → wildcard `0.0.0.63`.

## Standard ACL (nomor 1–99)

Hanya bisa filter berdasarkan **source IP saja**. Karena itu, praktik terbaik
adalah menempatkannya **sedekat mungkin dengan tujuan (destination)**, supaya
tidak memblok trafik yang seharusnya masih boleh lewat ke tujuan lain.

```
access-list 10 deny host 192.168.20.5
access-list 10 permit any

interface gigabitEthernet 0/0
 ip access-group 10 out
 exit
```

## Extended ACL (nomor 100–199)

Bisa filter berdasarkan source IP, destination IP, protokol (tcp/udp/icmp),
dan port. Praktik terbaik: tempatkan **sedekat mungkin dengan sumber
(source)** supaya trafik yang jelas-jelas dilarang tidak perlu membebani
jaringan lebih jauh.

```
access-list 100 deny tcp 192.168.10.0 0.0.0.255 host 192.168.30.10 eq 80
access-list 100 permit ip any any

interface gigabitEthernet 0/1
 ip access-group 100 in
 exit
```

Baris di atas artinya: blok akses HTTP (port 80) dari subnet 192.168.10.0/24
menuju server 192.168.30.10, tapi izinkan semua trafik IP lainnya.

## Named ACL (lebih mudah dibaca & diedit)

```
ip access-list extended BLOCK_HTTP_TO_SERVER
 deny tcp 192.168.10.0 0.0.0.255 host 192.168.30.10 eq 80
 permit ip any any
 exit

interface gigabitEthernet 0/1
 ip access-group BLOCK_HTTP_TO_SERVER in
 exit
```

Kelebihan named ACL: bisa hapus/edit satu baris tanpa harus hapus semua ACL
(`no permit ...` langsung dari dalam mode `ip access-list`).

## Arah `in` vs `out`

- **`in`** — ACL diperiksa saat trafik **masuk** ke interface router (dari
  jaringan menuju router).
- **`out`** — ACL diperiksa saat trafik **keluar** dari interface router
  (dari router menuju jaringan).

Selalu bayangkan dari sudut pandang router itu sendiri, bukan dari sudut
pandang device di jaringan.

## Verifikasi

```
show access-lists          ! isi semua ACL + counter jumlah match
show ip interface gi0/0    ! ACL apa yang aktif di interface & arahnya
```

## Kesalahan umum pemula

1. Lupa `permit any` / `permit ip any any` di akhir → implicit deny memblok
   SEMUA trafik, bukan cuma yang dimaksud.
2. Standard ACL ditaruh dekat source → tidak sengaja memblok trafik ke tujuan
   lain yang seharusnya boleh.
3. Wildcard mask ketukar dengan subnet mask (`255.255.255.0` bukan
   `0.0.0.255`) — hasilnya ACL tidak match sama sekali.
4. Extended ACL untuk keperluan management (SSH/Telnet) lupa dibuka →
   admin sendiri terkunci akses ke perangkat.
