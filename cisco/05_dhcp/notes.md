## Apa itu DHCP?

**DHCP (Dynamic Host Configuration Protocol)** memberikan IP address, subnet
mask, default gateway, dan DNS ke host secara **otomatis**, tanpa perlu
setting manual satu-satu di tiap PC.

## Proses DORA

1. **Discover** — client broadcast mencari DHCP server (`Siapa saja yang punya IP?`)
2. **Offer** — server menawarkan satu IP yang tersedia
3. **Request** — client meminta secara resmi IP yang ditawarkan
4. **Acknowledge** — server mengonfirmasi dan mengunci IP itu untuk client

## Konfigurasi DHCP server di router Cisco

```
ip dhcp excluded-address 192.168.10.1 192.168.10.10
! IP di atas dikecualikan karena dipakai statis (gateway, server, dll)

ip dhcp pool VLAN10_DATA
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8
 lease 7
 exit
```

- `network` — subnet yang akan dibagikan
- `default-router` — gateway yang diberikan ke client
- `dns-server` — DNS yang diberikan ke client
- `lease` — berapa lama (hari) IP dipinjamkan sebelum harus diperbarui

## DHCP untuk banyak VLAN

Buat satu pool per subnet VLAN:

```
ip dhcp pool VLAN20_VOICE
 network 192.168.20.0 255.255.255.0
 default-router 192.168.20.1
 dns-server 8.8.8.8
 exit
```

## DHCP Relay (`ip helper-address`)

Kalau **DHCP server** ada di subnet/VLAN yang **berbeda** dari client (server
terpusat, bukan di router itu sendiri), broadcast DHCP tidak akan sampai —
broadcast tidak melewati router. Solusinya pasang `ip helper-address` di
interface/SVI yang menghadap client, mengarah ke IP DHCP server:

```
interface vlan10
 ip address 192.168.10.1 255.255.255.0
 ip helper-address 192.168.100.10
 exit
```

## Verifikasi

```
show ip dhcp binding      ! daftar IP yang sudah disewakan + MAC address
show ip dhcp pool         ! status tiap pool (jumlah IP terpakai/tersisa)
show ip dhcp conflict     ! IP yang bentrok (dipakai 2 device)
```

Di sisi client (PC), cek dengan `ipconfig /all` (Windows) untuk lihat IP,
gateway, DNS yang didapat.

## Kesalahan umum pemula

1. Lupa `ip dhcp excluded-address` → server bisa menyewakan IP yang sudah
   dipakai statis (misal IP gateway sendiri) → konflik.
2. Pool `network` salah subnet/mask → client tidak dapat IP sama sekali.
3. DHCP server beda subnet tapi lupa `ip helper-address` di router → client
   tidak pernah dapat IP (request DHCP tidak pernah sampai ke server).
4. PC di Packet Tracer diset "Static" bukan "DHCP" di tab IP Configuration —
   sering kelewatan dan bikin bingung kenapa "DHCP tidak jalan" padahal
   konfigurasi router sudah benar.
