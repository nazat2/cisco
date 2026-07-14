## Kenapa butuh Inter-VLAN Routing?

VLAN memisahkan broadcast domain di **Layer 2**. Supaya host di VLAN 10 bisa
ngobrol dengan host di VLAN 20, trafik itu harus melewati perangkat
**Layer 3** (router, atau switch Layer 3) yang tahu cara routing antar
subnet.

Ada 2 metode umum:

## Metode 1 — Router-on-a-Stick

Satu kabel fisik (trunk) dari switch ke satu interface router, lalu di
router dibuat beberapa **subinterface** — satu per VLAN.

```
Switch --- trunk (1 kabel) --- Router (Gi0/0)
                                 ├─ Gi0/0.10 (VLAN 10)
                                 └─ Gi0/0.20 (VLAN 20)
```

Konfigurasi di router:

```
interface gigabitEthernet 0/0
 no shutdown
 exit

interface gigabitEthernet 0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0
 exit

interface gigabitEthernet 0/0.20
 encapsulation dot1Q 20
 ip address 192.168.20.1 255.255.255.0
 exit
```

Di switch, port ke arah router harus jadi trunk:

```
interface fastEthernet 0/24
 switchport mode trunk
 exit
```

Host di tiap VLAN memakai subinterface yang sesuai sebagai **default
gateway**-nya (misal host VLAN 10 → gateway `192.168.10.1`).

## Metode 2 — SVI (Switch Virtual Interface) di Layer 3 Switch

Kalau switch mendukung Layer 3 (misal Catalyst 3560 dengan IOS Layer 3), lebih
efisien pakai SVI — tidak perlu trunk keluar ke router terpisah.

```
ip routing                     ! WAJIB diaktifkan di L3 switch

interface vlan10
 ip address 192.168.10.1 255.255.255.0
 no shutdown
 exit

interface vlan20
 ip address 192.168.20.1 255.255.255.0
 no shutdown
 exit
```

## Perbandingan

| | Router-on-a-Stick | SVI (L3 Switch) |
|---|---|---|
| Perangkat | Router + switch biasa | Switch Layer 3 saja |
| Kecepatan | Lebih lambat (lewat 1 link trunk) | Lebih cepat (routing internal) |
| Skalabilitas | Kurang cocok VLAN banyak | Lebih scalable |
| Biaya | Router murah cukup | Switch L3 lebih mahal |

## Verifikasi

```
show ip route              ! tabel routing, pastikan subnet tiap VLAN muncul
show ip interface brief    ! pastikan semua subinterface/SVI status up/up
ping 192.168.20.10         ! test dari host VLAN 10 ke host VLAN 20
```

## Kesalahan umum pemula

1. Lupa `no shutdown` di interface fisik utama (`gi0/0`) — subinterface tidak
   akan aktif meski sudah dikonfigurasi.
2. Encapsulation VLAN ID di subinterface tidak sama dengan VLAN di switch.
3. Di L3 switch lupa `ip routing` → SVI tidak akan bisa routing antar VLAN,
   cuma bisa ping ke jaringan itu sendiri.
4. Default gateway di PC/host salah — harus mengarah ke IP subinterface/SVI
   VLAN masing-masing.
