## Apa itu Trunk?

Trunk port adalah port switch yang dikonfigurasi untuk membawa **banyak
VLAN sekaligus** melalui satu kabel fisik — biasanya dipakai untuk link
**antar-switch** atau **switch ke router** (lihat `04_intervlan`).

Tanpa trunk, kamu butuh 1 kabel fisik terpisah untuk tiap VLAN antar switch.
Dengan trunk, cukup 1 kabel untuk semua VLAN.

## Bagaimana switch tahu frame ini milik VLAN mana?

Switch menambahkan **tag 802.1Q** (4 byte tambahan di header Ethernet) berisi
VLAN ID pada setiap frame yang lewat trunk. Switch penerima membaca tag itu
lalu meneruskan frame ke port access VLAN yang sesuai, dan **melepas tag**
sebelum sampai ke end-device (karena PC/laptop tidak mengerti tag VLAN).

## Native VLAN

Satu VLAN di trunk boleh **tidak** ditandai (untagged) — disebut **native
VLAN**. Default-nya VLAN 1. Frame native VLAN dikirim polos tanpa tag.

> **Penting:** native VLAN di kedua ujung trunk **harus sama**, kalau beda
> akan muncul *native VLAN mismatch* dan trafik VLAN itu bisa bocor/salah
> jalur. Praktik terbaik: ganti native VLAN ke VLAN yang tidak dipakai
> (misal VLAN 999) demi keamanan.

## Konfigurasi trunk dasar

```
interface gigabitEthernet 0/1
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20,99
 exit
```

`allowed vlan` membatasi VLAN mana saja yang boleh lewat trunk ini — praktik
keamanan yang baik supaya trunk tidak otomatis membawa semua VLAN.

## DTP (Dynamic Trunking Protocol)

Secara default port Cisco bisa "negosiasi otomatis" jadi trunk lewat DTP.
Di lingkungan produksi sebaiknya **dimatikan** dan trunk di-set manual demi
keamanan (mencegah VLAN hopping):

```
interface gigabitEthernet 0/1
 switchport mode trunk
 switchport nonegotiate
 exit
```

## Verifikasi

```
show interfaces trunk                  ! daftar semua trunk port + VLAN yang di-allow
show interfaces gi0/1 switchport       ! detail mode trunk di satu port
show cdp neighbors                     ! pastikan link ke switch yang benar
```

## Kesalahan umum pemula

1. Native VLAN beda di kedua ujung trunk → mismatch warning.
2. Lupa `allowed vlan` → semua VLAN 1-4094 lewat trunk (boros & rawan).
3. Trunk antar switch tapi salah satu port masih `switchport mode access` →
   trunk tidak akan terbentuk, cek dengan `show interfaces trunk`.
4. Kabel disambung ke port yang salah (harusnya uplink, malah access port
   biasa) — selalu cross-check topologi.
