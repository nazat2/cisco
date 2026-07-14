## Kenapa butuh STP?

Kalau ada **lebih dari 1 jalur fisik** antar switch (topologi redundant untuk
antisipasi kabel putus), tanpa kontrol khusus akan terjadi **loop Layer 2**.
Beda dengan Layer 3, frame Ethernet tidak punya TTL — jadi frame yang looping
akan terus berputar dan menggandakan diri, menyebabkan:

- **Broadcast storm** — broadcast berputar terus dan membanjiri bandwidth.
- **MAC address table instability** — switch bingung satu MAC muncul dari
  banyak port sekaligus, tabel MAC "flapping".
- **Duplicate frame** — device penerima bisa menerima frame yang sama
  berkali-kali.

**STP (Spanning Tree Protocol)** mencegah ini dengan otomatis memblok salah
satu jalur redundant secara logis, sampai jalur utama putus (baru jalur
cadangan diaktifkan).

## Konsep inti

1. **Root Bridge** — satu switch dipilih jadi "pusat" topologi. Dipilih dari
   **Bridge ID** terkecil (Priority + MAC Address). Semua switch lain
   menghitung jalur terpendek menuju Root Bridge.
2. **Port Role**
   | Role | Fungsi |
   |---|---|
   | Root Port | 1 port per switch (non-root) dengan jalur terpendek ke Root Bridge |
   | Designated Port | Port "pemenang" di tiap segment, meneruskan frame |
   | Blocked/Alternate Port | Port redundant yang diblok sementara (tidak forward data, tapi tetap dengar BPDU) |
3. **Port State** (STP klasik/802.1D): Blocking → Listening → Learning →
   Forwarding (butuh ~30-50 detik untuk konvergen — inilah yang membuat STP
   klasik dianggap lambat).

## Mengubah Root Bridge secara manual

Secara default root bridge dipilih otomatis (biasanya switch tertua/MAC
terkecil) — sering bukan switch yang kita inginkan. Sebaiknya set manual:

```
spanning-tree vlan 1 priority 4096
```

Priority makin **kecil** = makin diprioritaskan jadi root (kelipatan 4096,
default 32768).

## RSTP (Rapid PVST+) — versi cepat

```
spanning-tree mode rapid-pvst
```

RSTP (802.1w) konvergen jauh lebih cepat (hitungan detik) dibanding STP
klasik. Cisco Packet Tracer & switch modern umumnya sudah pakai ini secara
default.

## PortFast & BPDU Guard (untuk port ke end-device)

Port yang mengarah ke PC/printer (bukan switch lain) tidak perlu menunggu
proses STP lengkap — bisa langsung forwarding:

```
interface fastEthernet 0/1
 spanning-tree portfast
 spanning-tree bpduguard enable
 exit
```

- `portfast` — port langsung ke Forwarding, skip Listening/Learning.
- `bpduguard` — kalau port PortFast tiba-tiba menerima BPDU (tandanya ada
  switch lain nyambung di situ, bukan PC), port otomatis di-**err-disable**
  demi keamanan.

## Verifikasi

```
show spanning-tree                 ! ringkasan semua VLAN
show spanning-tree vlan 10         ! detail 1 VLAN: root bridge, port role/state
show spanning-tree interface fa0/1 ! status STP 1 port spesifik
```

## Kesalahan umum pemula

1. Menganggap port yang "Blocking" itu error — padahal itu memang tugas STP
   supaya tidak loop, normal untuk topologi redundant.
2. Lupa set `portfast` di port end-device → PC butuh 30+ detik dapat DHCP
   saat boot karena port masih proses STP.
3. Pasang `portfast` di port yang ternyata terhubung ke switch lain → risiko
   loop nyata kalau tidak dibarengi `bpduguard`.
4. Root Bridge tidak diset manual → root bridge bisa berubah-ubah/switch yang
   "salah" jadi root saat ada penambahan switch baru ke jaringan.
