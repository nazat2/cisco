# 03_trunk — Trunking (802.1Q)

Materi menghubungkan antar-switch agar bisa membawa banyak VLAN sekaligus
lewat satu kabel.

## Isi folder
- `notes.md` — konsep trunk, 802.1Q tagging, native VLAN, DTP.
- `config-sample.cfg` — contoh 2 switch terhubung via trunk.

## Tujuan belajar
1. Paham perbedaan access port vs trunk port.
2. Paham cara kerja tagging 802.1Q & native VLAN.
3. Bisa konfigurasi trunk + membatasi VLAN yang lewat (`allowed vlan`).
4. Bisa verifikasi status trunk dengan `show interfaces trunk`.

## Kebutuhan topologi lab
- 🖧 2x Switch — **Cisco 2960**, dihubungkan satu sama lain jadi trunk (kabel crossover kalau perlu, atau straight-through di Packet Tracer karena auto-detect)
- 💻 4x PC — **PC-PT (generic)**, sebar merata di kedua switch, tapi pakai VLAN yang sama di kedua sisi (mis. 2 PC VLAN 10 di SW1, 2 PC VLAN 10 di SW2) supaya bisa dites saling ping lewat trunk
