## Apa itu DNS?

**DNS (Domain Name System)** menerjemahkan nama yang mudah diingat manusia
(misal `server1.kantor.local`) menjadi alamat IP yang dipakai device untuk
komunikasi sebenarnya. Tanpa DNS, semua akses harus pakai IP mentah — susah
diingat dan repot kalau IP server berubah.

## DNS di sisi client (router/PC)

Router dan PC butuh tahu **ke mana bertanya** kalau ingin menerjemahkan
nama menjadi IP:

```
ip domain-lookup
ip name-server 8.8.8.8 192.168.100.53
```

- `ip domain-lookup` — mengaktifkan fitur name resolution di router
  (default sebenarnya sudah aktif; berguna kalau sebelumnya dimatikan).
- `ip name-server` — daftar DNS server yang ditanya (boleh lebih dari satu,
  dicoba berurutan kalau yang pertama tidak merespons).

## DNS statis lokal (`ip host`)

Untuk lab kecil tanpa DNS server sungguhan, bisa buat entri manual di router
sebagai pengganti sementara:

```
ip host server1.kantor.local 192.168.10.10
ip host web 192.168.10.20
```

Setelah ini, dari router bisa langsung `ping server1.kantor.local` dan
otomatis diterjemahkan ke IP-nya.

## DNS Server sungguhan di Packet Tracer

Device `Server-PT` di Packet Tracer punya service **DNS** yang bisa
diaktifkan di tab **Services → DNS**:

1. Aktifkan service DNS (`On`).
2. Tambahkan record: Name = `www.kantor.local`, Type = `A Record`,
   Address = IP web server, lalu klik **Add**.
3. Di PC client, set **DNS Server** di IP Configuration mengarah ke IP
   server DNS tadi (atau otomatis lewat DHCP kalau `dns-server` di pool
   DHCP sudah diarahkan ke situ — lihat modul `dhcp`).

## Mematikan DNS lookup yang mengganggu CLI (tips praktis)

Kalau salah ketik perintah di CLI Cisco, IOS secara default mencoba
menerjemahkannya sebagai hostname ke DNS — bikin CLI "macet" beberapa detik
menunggu timeout. Solusi umum saat lab (bukan untuk produksi):

```
no ip domain-lookup
```

## Verifikasi

```
show hosts               ! cache DNS & entri ip host statis di router
ping server1.kantor.local
nslookup www.kantor.local   ! dari command prompt PC-PT
```

## Kesalahan umum pemula

1. Salah ketik perintah di CLI dan harus menunggu lama karena router
   mencoba resolve sebagai DNS query — lupa mematikan `ip domain-lookup`
   saat sedang belajar/lab.
2. PC diset DNS server manual yang salah/tidak aktif → browsing pakai nama
   domain gagal walau ping ke IP langsung berhasil (bukti masalah di DNS,
   bukan konektivitas).
3. Lupa menambahkan `A Record` di service DNS Server Packet Tracer sebelum
   menguji resolusi nama dari client.
4. DNS server berada di VLAN/subnet berbeda dari client tapi tidak ada
   routing/DHCP relay yang benar → query DNS tidak pernah sampai.
