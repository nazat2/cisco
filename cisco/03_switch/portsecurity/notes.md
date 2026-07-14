## Apa itu Port Security?

**Port Security** membatasi & mengontrol **MAC address** mana saja yang
boleh terhubung ke sebuah access port switch. Berguna mencegah:

- Device asing (laptop tamu, rogue device) dicolok sembarangan ke port kosong.
- Hub/switch liar ditambahkan diam-diam untuk memperbanyak koneksi ilegal.
- MAC address spoofing sederhana di jaringan lokal.

> Port Security hanya berlaku di **access port**, bukan trunk.

## Konfigurasi dasar

```
interface fastEthernet 0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security mac-address sticky
 switchport port-security violation shutdown
 exit
```

- `switchport port-security` — mengaktifkan fitur di port tersebut.
- `maximum 2` — maksimal 2 MAC address berbeda boleh belajar di port ini
  (default kalau tidak diset: 1).
- `mac-address sticky` — MAC yang pertama kali terdeteksi otomatis
  "dihafal" & disimpan ke running-config (tidak perlu ketik manual satu-satu).
  Bisa juga diisi manual: `switchport port-security mac-address AAAA.BBBB.CCCC`.
- `violation` — aksi kalau ada MAC asing terdeteksi (lihat tabel di bawah).

## Mode Violation

| Mode | Efek saat ada pelanggaran | Traffic asing | Kirim log/SNMP |
|---|---|---|---|
| `protect` | Drop paket dari MAC asing, port tetap up | Diblok diam-diam | Tidak |
| `restrict` | Drop paket dari MAC asing, port tetap up | Diblok | Ya, ada counter & log |
| `shutdown` (default) | Port langsung **err-disabled** (down total) | Semua trafik terhenti | Ya |

## Memulihkan port yang err-disabled

Port dengan mode `shutdown` yang kena violation akan masuk status
`err-disabled` — tidak akan otomatis pulih sampai di-reset manual:

```
interface fastEthernet 0/1
 shutdown
 no shutdown
 exit
```

Atau otomatis recovery setelah waktu tertentu:

```
errdisable recovery cause psecure-violation
errdisable recovery interval 60
```

## Verifikasi

```
show port-security                     ! ringkasan semua port yang aktif port security
show port-security interface fa0/1     ! detail 1 port: MAC terdaftar, violation count, status
show port-security address             ! semua MAC yang sudah "dihafal" (termasuk sticky)
```

## Kesalahan umum pemula

1. Mengaktifkan port security di **trunk port** → tidak berfungsi sesuai
   ekspektasi, port security didesain untuk access port.
2. Lupa `mac-address sticky` → MAC yang dipelajari hilang setiap switch
   reboot, harus belajar ulang dari awal.
3. `maximum` diset terlalu kecil padahal port dipakai lewat hub/switch kecil
   dengan beberapa device → violation terus terjadi.
4. Setelah kena violation `shutdown`, bingung kenapa port tidak hidup lagi
   padahal masalah sudah diselesaikan — lupa harus `shutdown` + `no shutdown`
   manual (atau setup `errdisable recovery`).
