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

## 05 — DHCP

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

## 06 — ACL

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

## 07 — Routing

```
ip route <network> <mask> <next-hop>
ip route 0.0.0.0 0.0.0.0 <next-hop>   ! default route

router ospf 1
 network 192.168.10.0 0.0.0.255 area 0

show ip route
show ip protocols
show ip ospf neighbor
```

## 08 — Troubleshooting

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
