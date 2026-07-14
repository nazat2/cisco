## Apa itu VLAN?

**VLAN (Virtual LAN)** adalah cara membagi satu switch fisik menjadi beberapa
**broadcast domain** yang terpisah secara logis, tanpa perlu switch fisik
tambahan. Device di VLAN berbeda tidak bisa saling komunikasi langsung
walaupun colok ke switch yang sama — mereka butuh router (lihat modul
`04_intervlan`).

### Kenapa VLAN penting?
- **Keamanan** — memisahkan trafik departemen (misal: Finance vs Umum).
- **Mengurangi broadcast domain** — jaringan lebih efisien, tidak semua host
  kebanjiran broadcast traffic.
- **Fleksibilitas** — pengelompokan berdasarkan fungsi, bukan lokasi fisik.
- **Manajemen lebih rapi** — tiap VLAN bisa punya kebijakan (ACL, QoS) sendiri.

## Jenis port switch

| Tipe port | Fungsi |
|---|---|
| **Access port** | Hanya membawa 1 VLAN, biasanya ke arah end-device (PC, printer, AP) |
| **Trunk port** | Membawa banyak VLAN sekaligus, biasanya antar switch/router (lihat modul `03_trunk`) |

## Membuat & menamai VLAN

```
enable
configure terminal

vlan 10
 name DATA
 exit

vlan 20
 name VOICE
 exit

vlan 99
 name MANAGEMENT
 exit
```

## Menempatkan port ke VLAN (access mode)

```
interface fastEthernet 0/1
 switchport mode access
 switchport access vlan 10
 exit
```

Untuk banyak port sekaligus, gunakan `interface range`:

```
interface range fastEthernet 0/1 - 10
 switchport mode access
 switchport access vlan 10
 exit
```

## VLAN untuk suara (Voice VLAN)

Kalau ada IP Phone yang satu kabel dengan PC (daisy-chain), gunakan voice vlan
supaya trafik suara dan data tetap terpisah:

```
interface fastEthernet 0/5
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20
 exit
```

## Verifikasi

```
show vlan brief              ! daftar semua VLAN & port anggotanya
show interfaces fa0/1 switchport   ! detail mode & VLAN sebuah port
```

## Kesalahan umum pemula

1. Lupa `switchport mode access` sebelum assign VLAN → kadang port masih
   dalam mode dynamic dan tidak sesuai ekspektasi.
2. VLAN belum dibuat tapi langsung di-assign ke port → IOS otomatis membuat
   VLAN tapi tanpa nama, sebaiknya buat manual dulu supaya rapi.
3. Lupa bahwa **VLAN 1** adalah default VLAN — sebaiknya jangan dipakai untuk
   data produksi, gunakan untuk management saja atau ganti native VLAN.
4. Dua device beda VLAN tidak bisa ping — ini **normal**, bukan error. Mereka
   butuh routing antar VLAN (modul `04_intervlan`).
