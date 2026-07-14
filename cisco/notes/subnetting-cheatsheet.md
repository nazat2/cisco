## Tabel bantu Subnetting (IPv4)

| CIDR | Subnet Mask | Wildcard Mask | Jumlah Host Usable |
|---|---|---|---|
| /24 | 255.255.255.0 | 0.0.0.255 | 254 |
| /25 | 255.255.255.128 | 0.0.0.127 | 126 |
| /26 | 255.255.255.192 | 0.0.0.63 | 62 |
| /27 | 255.255.255.224 | 0.0.0.31 | 30 |
| /28 | 255.255.255.240 | 0.0.0.15 | 14 |
| /29 | 255.255.255.248 | 0.0.0.7 | 6 |
| /30 | 255.255.255.252 | 0.0.0.3 | 2 (biasa dipakai link point-to-point) |

## Cara cepat cari wildcard mask
`255 - angka oktet subnet mask`. Contoh: `255.255.255.192` → oktet terakhir
`255-192=63` → wildcard `0.0.0.63`.

## Cara cepat hitung jumlah host usable
`2^(jumlah bit host) - 2` (dikurangi 2 untuk network address & broadcast
address).

## Private IP ranges (RFC 1918)
| Range | CIDR |
|---|---|
| 10.0.0.0 – 10.255.255.255 | /8 |
| 172.16.0.0 – 172.31.255.255 | /12 |
| 192.168.0.0 – 192.168.255.255 | /16 |
