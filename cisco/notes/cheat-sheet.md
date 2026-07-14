## 01 — Basic CLI

```
enable
configure terminal
hostname SW1
no ip domain-lookup
enable secret cisco123
service password-encryption
banner motd #pesan#
show running-config
show startup-config
copy running-config startup-config
show version
show ip interface brief
show mac address-table
show cdp neighbors
```

## 02 — VLAN

```
vlan 10
 name DATA
interface fastEthernet 0/1
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20
show vlan brief
show interfaces fa0/1 switchport
```

## 03 — Trunk

```
interface gigabitEthernet 0/1
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport trunk native vlan 999
 switchport trunk allowed vlan 10,20
 switchport nonegotiate
show interfaces trunk
```

## 04 — Inter-VLAN Routing

```
! Router-on-a-Stick
interface gigabitEthernet 0/0.10
 encapsulation dot1Q 10
 ip address 192.168.10.1 255.255.255.0

! SVI (L3 switch)
ip routing
interface vlan10
 ip address 192.168.10.1 255.255.255.0
 no shutdown

show ip route
```

## 05 — STP

```
spanning-tree mode rapid-pvst
spanning-tree vlan 1 priority 4096

interface fastEthernet 0/1
 spanning-tree portfast
 spanning-tree bpduguard enable

show spanning-tree
show spanning-tree vlan 10
```

## 06 — EtherChannel

```
interface range fastEthernet 0/1 - 2
 channel-group 1 mode active   ! LACP

interface port-channel 1
 switchport mode trunk

show etherchannel summary
```

## 07 — Port Security

```
interface fastEthernet 0/1
 switchport mode access
 switchport port-security
 switchport port-security maximum 2
 switchport port-security mac-address sticky
 switchport port-security violation shutdown

show port-security interface fa0/1
```

## 08 — Static Route

```
ip route <network> <mask> <next-hop>
ip route 0.0.0.0 0.0.0.0 <next-hop>        ! default route
ip route <network> <mask> <next-hop> 200   ! floating static (AD custom)

show ip route static
```

## 09 — RIP

```
router rip
 version 2
 network 192.168.10.0
 no auto-summary

show ip protocols
show ip route rip
```

## 10 — OSPF

```
router ospf 1
 router-id 1.1.1.1
 network 192.168.10.0 0.0.0.255 area 0

show ip route ospf
show ip ospf neighbor
```

## 11 — EIGRP

```
router eigrp 100
 network 192.168.10.0 0.0.0.255
 no auto-summary

show ip eigrp neighbors
show ip route eigrp
```

## 12 — DHCP

```
ip dhcp excluded-address 192.168.10.1 192.168.10.10
ip dhcp pool VLAN10_DATA
 network 192.168.10.0 255.255.255.0
 default-router 192.168.10.1
 dns-server 8.8.8.8

! Relay (kalau DHCP server beda subnet)
interface vlan10
 ip helper-address 192.168.100.10

show ip dhcp binding
show ip dhcp pool
```

## 13 — DNS

```
ip domain-lookup
ip name-server 8.8.8.8
ip host server1.kantor.local 192.168.10.10

show hosts
```

## 14 — NAT

```
interface gigabitEthernet 0/0
 ip nat inside
interface gigabitEthernet 0/1
 ip nat outside

access-list 1 permit 192.168.10.0 0.0.0.255
ip nat inside source list 1 interface gigabitEthernet 0/1 overload   ! PAT

show ip nat translations
```

## 15 — ACL

```
! Standard (dekat destination)
access-list 10 deny host 192.168.20.5
access-list 10 permit any

! Extended named (dekat source)
ip access-list extended NAMA_ACL
 deny tcp 192.168.10.0 0.0.0.255 host 192.168.30.10 eq 80
 permit ip any any

interface gigabitEthernet 0/0
 ip access-group NAMA_ACL in

show access-lists
show ip interface gi0/0
```

## 16 — Serial

```
interface serial 0/0/0
 clock rate 64000        ! hanya sisi DCE
 bandwidth 64
 no shutdown

show interfaces serial 0/0/0
show controllers serial 0/0/0
```

## 17 — PPP

```
username R2 password cisco123

interface serial 0/0/0
 encapsulation ppp
 ppp authentication chap

show interfaces serial 0/0/0
```

## 18 — Frame Relay (opsional)

```
interface serial 0/0/0
 encapsulation frame-relay

interface serial 0/0/0.102 point-to-point
 ip address 10.0.12.1 255.255.255.252
 frame-relay interface-dlci 102

show frame-relay pvc
```

## 19 — Simulasi Jaringan Perusahaan

Gabungan seluruh modul di atas dalam 1 topologi. Lihat halaman modul 19
untuk rencana pengalamatan dan urutan pengerjaan lengkap.

## Troubleshooting (referensi)

```
show ip interface brief
show interfaces <int>
show vlan brief
show interfaces trunk
show mac address-table
show ip route
ping <ip>
traceroute <ip>
show running-config
```

## Perintah umum lain yang sering kepakai

```
no <perintah>              ! batalkan/hapus konfigurasi
do <perintah>               ! jalankan perintah privileged EXEC dari config mode
show ip arp                 ! tabel ARP
show flash                  ! isi memori flash (image IOS)
show clock                  ! waktu perangkat
copy tftp flash              ! upload/download image IOS lewat TFTP
erase startup-config         ! hapus konfigurasi tersimpan (reset ke default)
reload                       ! restart perangkat
```
