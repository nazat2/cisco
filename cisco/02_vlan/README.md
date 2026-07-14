# 02_vlan — Virtual LAN

Materi tentang segmentasi jaringan logis di level switch.

## Isi folder
- `notes.md` — konsep VLAN, kenapa dipakai, dan perintah konfigurasinya.
- `config-sample.cfg` — contoh switch dengan 3 VLAN (Data, Voice, Management).

## Tujuan belajar
1. Paham kenapa satu switch fisik perlu dipecah jadi beberapa broadcast domain.
2. Bisa membuat VLAN dan memberi nama.
3. Bisa menempatkan (assign) port access ke VLAN tertentu.
4. Bisa verifikasi VLAN dengan `show vlan brief`.

## Kebutuhan topologi lab
- 🖧 1x Switch — **Cisco 2960**
- 💻 4x PC — **PC-PT (generic)**, bagi jadi 2 kelompok, tiap kelompok masuk VLAN berbeda (mis. 2 PC di VLAN 10, 2 PC di VLAN 20)

Belum ada router, jadi PC di VLAN berbeda **tidak akan bisa saling ping**
dulu (ini normal — baru bisa saling komunikasi setelah modul 04 inter-VLAN).
