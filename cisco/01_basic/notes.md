## Kenapa harus paham CLI dulu?

Semua konfigurasi Cisco (switch maupun router) dilakukan lewat **CLI (Command
Line Interface)** memakai Cisco IOS. Sebelum menyentuh VLAN, trunk, atau
routing, kamu wajib hafal 4 mode dasar ini karena hampir semua perintah lain
dibangun di atasnya.

## 4 Mode dasar Cisco IOS

| Mode | Prompt | Fungsi |
|---|---|---|
| User EXEC | `Switch>` | Mode paling terbatas, cuma bisa lihat status dasar |
| Privileged EXEC | `Switch#` | Akses penuh untuk melihat & mengelola perangkat |
| Global Configuration | `Switch(config)#` | Mengubah konfigurasi perangkat secara umum |
| Interface Configuration | `Switch(config-if)#` | Mengubah konfigurasi per-port/interface |

Alur naik mode:

```
Switch> enable
Switch# configure terminal
Switch(config)# interface fastEthernet 0/1
Switch(config-if)#
```

Keluar satu level pakai `exit`, langsung ke Privileged EXEC dari mode manapun
pakai `end` atau `Ctrl+Z`.

## Perintah wajib hafal

```
enable                     ! masuk Privileged EXEC
configure terminal         ! masuk Global Config
hostname SW1                ! ganti nama perangkat
no ip domain-lookup         ! stop IOS coba resolve typo jadi DNS lookup
enable secret cisco123      ! password masuk Privileged EXEC (terenkripsi)
line console 0
 password cisco123
 login
line vty 0 15
 password cisco123
 login
service password-encryption ! enkripsi semua password di running-config
banner motd #Dilarang akses tanpa izin!#
```

## Menyimpan & melihat konfigurasi

```
show running-config        ! konfigurasi yang aktif sekarang (di RAM)
show startup-config        ! konfigurasi yang tersimpan (di NVRAM)
copy running-config startup-config   ! simpan supaya tidak hilang saat reboot
write memory                ! shortcut yang sama fungsinya
reload                      ! restart perangkat
```

> **Penting:** kalau kamu konfigurasi sesuatu lalu perangkat mati/di-reset
> tanpa `write memory`, semua perubahan hilang! Ini penyebab #1 kenapa lab
> Packet Tracer kelihatan "kosong lagi" setelah dibuka ulang.

## Perintah `show` yang paling sering dipakai

```
show version           ! versi IOS, uptime, model perangkat
show ip interface brief ! ringkasan status semua interface + IP
show interfaces         ! detail statistik tiap interface
show mac address-table  ! tabel MAC yang dipelajari switch
show cdp neighbors       ! perangkat Cisco lain yang terhubung langsung
```

## Navigasi & shortcut CLI

| Shortcut | Fungsi |
|---|---|
| `Tab` | Auto-complete perintah |
| `?` | Bantuan daftar perintah yang tersedia |
| `Ctrl + A` | Pindah ke awal baris |
| `Ctrl + E` | Pindah ke akhir baris |
| `Ctrl + Z` | Langsung balik ke Privileged EXEC |
| `no <perintah>` | Membatalkan/menghapus konfigurasi |

> Kamu bisa mengetik perintah cukup dengan huruf awal yang unik, contoh
> `conf t` = `configure terminal`, `int fa0/1` = `interface fastEthernet0/1`.

## Kesalahan umum pemula

1. Lupa `no ip domain-lookup` → saat salah ketik perintah, IOS nge-hang
   beberapa detik karena coba resolve DNS.
2. Lupa `enable` sebelum `configure terminal` → IOS menolak masuk config mode.
3. Lupa `write memory` → semua konfigurasi hilang setelah restart.
4. Salah interface (misal `fa0/1` padahal device pakai `gi0/1`) — selalu cek
   dengan `show ip interface brief` dulu.
