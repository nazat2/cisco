## Apa itu OSPF?

**OSPF (Open Shortest Path First)** adalah protokol routing dinamis tipe
**link-state** — tiap router membangun "peta" topologi jaringan yang sama
persis (lewat pertukaran LSA), lalu menghitung jalur terbaik sendiri-sendiri
memakai algoritma **SPF (Dijkstra)**. Jauh lebih scalable dibanding RIP,
cocok untuk jaringan menengah-besar dan merupakan standar terbuka (bukan
proprietary Cisco).

## Metric: Cost

OSPF memilih jalur berdasarkan **cost** kumulatif, dihitung dari bandwidth
interface:

```
cost = reference bandwidth (default 10^8) / bandwidth interface (bps)
```

Semakin **kecil** total cost sepanjang jalur, semakin diprioritaskan.
Interface Gigabit ke atas sebaiknya reference bandwidth dinaikkan manual
(`auto-cost reference-bandwidth`) supaya cost tidak "mentok" sama di semua
link cepat.

## Area & Backbone (Area 0)

OSPF membagi jaringan jadi **area**-area untuk membatasi ukuran tabel
topologi tiap router. **Area 0** wajib ada dan disebut **backbone area** —
semua area lain harus terhubung ke Area 0 (langsung atau lewat virtual
link). Untuk lab pemula, biasanya cukup **single-area** (semua di Area 0).

## Konfigurasi dasar

```
router ospf 1
 router-id 1.1.1.1
 network 192.168.10.0 0.0.0.255 area 0
 network 10.0.0.0 0.0.0.3 area 0
 exit
```

- `router ospf 1` — Process ID, **lokal per router**, boleh beda tiap
  router (tidak wajib sama, cukup untuk identifikasi lokal saja).
- `router-id` — ID unik router dalam proses OSPF (disarankan set manual,
  format seperti IP, supaya tidak bergantung IP interface yang bisa berubah).
- `network ... area 0` — pakai **wildcard mask** (kebalikan subnet mask),
  bukan subnet mask biasa.

## DR / BDR Election

Di segment multi-access (misal Ethernet dengan >2 router), OSPF memilih
**Designated Router (DR)** dan **Backup DR (BDR)** supaya tidak semua router
saling bertukar LSA (mengurangi overhead). Dipilih berdasarkan **OSPF
Priority** tertinggi (default 1), lalu Router ID tertinggi kalau seri.

```
interface gigabitEthernet 0/0
 ip ospf priority 100     ! prioritas lebih tinggi → lebih diprioritaskan jadi DR
 exit
```

Priority `0` = router tidak akan pernah jadi DR/BDR (`DROTHER`).

## Verifikasi

```
show ip ospf neighbor        ! tetangga OSPF yang terdeteksi + status (harus FULL)
show ip protocols            ! ringkasan proses OSPF yang aktif
show ip route ospf           ! rute yang dipelajari lewat OSPF (kode "O")
show ip ospf interface brief ! area, cost, dan role (DR/BDR/DROTHER) tiap interface
```

## Kesalahan umum pemula

1. Salah pakai subnet mask, bukan **wildcard mask**, di command `network` →
   OSPF gagal mengenali interface yang seharusnya ikut proses.
2. Router-id tidak diset manual → bisa berubah otomatis kalau interface
   loopback/IP tertentu hilang, menyebabkan adjacency drop.
3. Area number beda di kedua sisi link (misal Area 0 vs Area 1) → neighbor
   tidak akan pernah terbentuk (stuck di status `INIT`/`DOWN`).
4. Hello/Dead timer interval berbeda antar router di segment yang sama →
   neighbor tidak akan `FULL`, biasanya karena salah satu sisi timernya
   diubah manual tanpa disamakan.
