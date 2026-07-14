# 04_intervlan — Inter-VLAN Routing

Materi menghubungkan (routing) antar VLAN yang berbeda supaya bisa saling
komunikasi.

## Isi folder
- `notes.md` — 2 metode inter-VLAN routing: Router-on-a-Stick & SVI (Layer 3 switch).
- `config-sample.cfg` — contoh konfigurasi router-on-a-stick.

## Tujuan belajar
1. Paham kenapa VLAN berbeda butuh router untuk saling komunikasi.
2. Bisa konfigurasi Router-on-a-Stick (subinterface + trunk).
3. Bisa konfigurasi SVI di Layer 3 switch sebagai alternatif.
4. Bisa verifikasi routing dengan `show ip route` & `ping`.

## Kebutuhan topologi lab
- 🖥️ 1x Router — **Cisco 1941 (ISR G2)**, butuh interface yang mendukung subinterface (onboard GigabitEthernet 0/0)
- 🖧 1x Switch — **Cisco 2960**, port ke router dijadikan trunk
- 💻 4x PC — **PC-PT (generic)**, 2 VLAN berbeda (mis. VLAN 10 & VLAN 20), masing-masing 2 PC

> Metode alternatif (SVI): kalau mau tanpa router terpisah, ganti switch
> jadi **Cisco 3560** (Layer 3) dan hilangkan router — SVI langsung
> di-routing di switch tersebut.

Router-on-a-Stick cuma butuh **1 kabel fisik** router↔switch meski ada
banyak VLAN — itu intinya subinterface + trunk.
