## Apa itu EtherChannel?

**EtherChannel** menggabungkan beberapa (2-8) link fisik antar switch menjadi
**1 link logis**, sehingga:

- **Bandwidth bertambah** — trafik di-load-balance ke semua link fisik.
- **Redundant tanpa kena blocking STP** — karena STP melihatnya sebagai
  1 link logis saja, bukan beberapa link paralel yang berpotensi loop.
- **Failover cepat** — kalau salah satu kabel fisik putus, trafik otomatis
  pindah ke kabel lain dalam bundle tanpa perlu STP re-converge.

## Protokol negosiasi

| Protokol | Vendor | Mode negosiasi |
|---|---|---|
| **PAgP** (Port Aggregation Protocol) | Cisco proprietary | `desirable` (aktif) / `auto` (pasif) |
| **LACP** (Link Aggregation Control Protocol) | Standar industri (802.3ad) | `active` (aktif) / `passive` (pasif) |
| **Static (`on`)** | — | Tanpa negosiasi, langsung aktif (tidak disarankan di produksi) |

Kombinasi mode yang **valid** harus punya minimal satu sisi "aktif"
(`desirable`-`desirable`, `desirable`-`auto`, `active`-`active`,
`active`-`passive`). Kombinasi `auto`-`auto` atau `passive`-`passive` **tidak
akan pernah** membentuk channel karena keduanya menunggu pihak lain memulai.

## Syarat port sebelum digabung

Semua port yang mau digabung dalam 1 EtherChannel **wajib identik**:
- Speed & duplex sama
- Mode sama (semua access dgn VLAN sama, atau semua trunk)
- Native VLAN & allowed VLAN sama (kalau trunk)

Kalau tidak identik, `channel-group` akan gagal terbentuk atau port
otomatis di-suspend.

## Konfigurasi (LACP)

```
interface range fastEthernet 0/1 - 2
 channel-group 1 mode active
 exit

interface port-channel 1
 switchport mode trunk
 exit
```

Setelah `channel-group` dijalankan, IOS otomatis membuat interface virtual
**Port-channel 1** — konfigurasi trunk/VLAN cukup dilakukan di situ, bukan
per-port fisik lagi.

## Konfigurasi (PAgP)

```
interface range fastEthernet 0/1 - 2
 channel-group 2 mode desirable
 exit
```

## Verifikasi

```
show etherchannel summary     ! status bundle: SU = in use, up
show etherchannel port-channel
show interfaces port-channel 1
```

Kode status yang sering muncul di `show etherchannel summary`:
- `P` — port bundled dalam channel (sukses)
- `I` — individual, gagal bundle (biasanya karena konfigurasi port tidak identik)
- `D` — down

## Kesalahan umum pemula

1. Port yang digabung punya speed/duplex/VLAN berbeda → channel gagal
   terbentuk, status `I` (individual) di `show etherchannel summary`.
2. Kombinasi mode negosiasi salah (`auto`+`auto`) → channel tidak pernah
   aktif karena tidak ada sisi yang memulai negosiasi.
3. Konfigurasi trunk/VLAN dilakukan di interface fisik, bukan di
   `interface port-channel` → tidak konsisten dan membingungkan.
4. Mencampur PAgP di satu sisi dan LACP di sisi lain → tidak akan pernah
   connect, kedua ujung harus pakai protokol yang sama.
