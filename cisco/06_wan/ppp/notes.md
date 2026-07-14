## Apa itu PPP?

**PPP (Point-to-Point Protocol)** adalah encapsulation WAN standar industri
(bukan Cisco proprietary seperti HDLC), dipakai untuk link serial
point-to-point. Kelebihan utama dibanding HDLC: mendukung **autentikasi**,
kompresi, dan multilink.

```
interface serial 0/0/0
 encapsulation ppp
 exit
```

## PAP vs CHAP

| | PAP | CHAP |
|---|---|---|
| Cara kerja | Username/password dikirim **polos** (clear text) | Pakai **challenge-response** hash (MD5), password tidak pernah dikirim langsung |
| Keamanan | Lemah | Lebih aman |
| Proses | 2-way handshake | 3-way handshake |

**CHAP lebih disarankan** karena lebih aman — password asli tidak pernah
melintasi link.

## Konfigurasi CHAP

Username yang dipakai di tiap sisi adalah **hostname router lawan**, dan
password **harus identik** di kedua sisi:

```
! --- Di R1 (hostname R1) ---
username R2 password cisco123

interface serial 0/0/0
 encapsulation ppp
 ppp authentication chap
 exit
```

```
! --- Di R2 (hostname R2) ---
username R1 password cisco123

interface serial 0/0/0
 encapsulation ppp
 ppp authentication chap
 exit
```

## Konfigurasi PAP

```
! --- Di R1 ---
username R2 password cisco123

interface serial 0/0/0
 encapsulation ppp
 ppp authentication pap
 ppp pap sent-username R1 password cisco123
 exit
```

Beda dengan CHAP, PAP butuh command tambahan `ppp pap sent-username` di
sisi yang mengirim kredensial.

## Verifikasi

```
show interfaces serial 0/0/0   ! cek encapsulation PPP & status LCP
debug ppp authentication       ! lihat proses autentikasi real-time (matikan dgn undebug all)
```

Status LCP idealnya `Open` — tandanya negosiasi PPP (link control protocol)
berhasil.

## Kesalahan umum pemula

1. Username yang didaftarkan **salah** — harus persis **hostname router
   lawan**, bukan hostname sendiri. Ini kesalahan paling sering terjadi.
2. Password beda antara kedua sisi (typo satu huruf saja) → autentikasi
   gagal terus, link tidak akan `up`.
3. Lupa `encapsulation ppp` sebelum mengetik `ppp authentication` → command
   authentication tidak akan diterima/tidak berefek.
4. Mencampur PAP di satu sisi, CHAP di sisi lain → autentikasi gagal, kedua
   ujung harus pakai metode yang sama.
