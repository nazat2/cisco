/* =========================================================
   CISCO LEARNING HUB — topology.js
   Reusable "Topologi" tab: rekomendasi perangkat (tipe/model +
   jumlah) dan diagram topologi auto-generated (SVG), dipakai di
   SEMUA modul (bukan cuma VLAN) — 01_basic s/d 07_project, plus
   08_troubleshooting.
   ========================================================= */

/* ---------------- Icon glyphs per tipe perangkat ---------------- */
const TOPO_ICON = {
  router:   "🌐",
  switch:   "🔀",
  l3switch: "🔀",
  pc:       "💻",
  server:   "🖥️",
  cloud:    "☁️",
  fr:       "📡",
};
const TOPO_FILL = {
  router:   "var(--cyan-2)",
  switch:   "var(--yellow)",
  l3switch: "#FFE68A",
  pc:       "var(--panel)",
  server:   "#E7E1FF",
  cloud:    "var(--panel-2)",
  fr:       "var(--orange-dim)",
};
const TOPO_TYPE_LABEL = {
  router:   "Router",
  switch:   "Switch L2",
  l3switch: "Switch L3",
  pc:       "PC / Host",
  server:   "Server",
  cloud:    "Cloud (WAN/Internet)",
  fr:       "Frame Relay Switch",
};

/* ---------------- Data per modul ----------------
   devices: rekomendasi perangkat tab Packet Tracer (tipe, model, jumlah)
   diagram: { nodes:[{id,type,col,row,label,model,qty}], edges:[[from,to,label,style]] }
   tip: catatan singkat kenapa topologi ini dipakai
------------------------------------------------- */
const TOPOLOGY_DATA = {
  basic: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Switch utama untuk latihan navigasi mode CLI (user/privileged/config)." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "Cukup 2 host untuk uji konektivitas dasar & hostname/password." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 1, row: 0, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 1, label: "PC2", model: "PC-PT" },
      ],
      edges: [["sw1", "pc1", "Fa0/1"], ["sw1", "pc2", "Fa0/2"]],
    },
    tip: "Topologi paling minimal — 1 switch, 2 PC — cukup untuk praktik hostname, enable secret, dan show run/version.",
  },

  vlan: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "1 switch cukup untuk membuat & assign beberapa VLAN sekaligus." },
      { type: "pc", model: "Generic PC-PT", qty: 4, note: "2 PC di VLAN 10 (DATA), 2 PC di VLAN 20 (VOICE) — biar bisa buktikan broadcast domain terpisah." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 1.5, row: 0, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "VLAN 10" },
        { id: "pc2", type: "pc", col: 1, row: 1, label: "PC2", model: "VLAN 10" },
        { id: "pc3", type: "pc", col: 2, row: 1, label: "PC3", model: "VLAN 20" },
        { id: "pc4", type: "pc", col: 3, row: 1, label: "PC4", model: "VLAN 20" },
      ],
      edges: [["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],["sw1","pc3","Fa0/3"],["sw1","pc4","Fa0/4"]],
    },
    tip: "1 switch, 4 access port di 2 VLAN berbeda — cukup untuk membuktikan PC beda VLAN tidak bisa saling ping.",
  },

  trunk: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 2, note: "2 switch dihubungkan via trunk (802.1Q) supaya VLAN yang sama bisa lewat lebih dari 1 switch." },
      { type: "pc", model: "Generic PC-PT", qty: 4, note: "2 PC per switch, tiap switch punya PC di VLAN 10 & VLAN 20." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 0, row: 0, label: "SW1", model: "2960" },
        { id: "sw2", type: "switch", col: 2, row: 0, label: "SW2", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "VLAN 10" },
        { id: "pc2", type: "pc", col: 1, row: 1, label: "PC2", model: "VLAN 20" },
        { id: "pc3", type: "pc", col: 1, row: 1.9, label: "PC3", model: "VLAN 10" },
        { id: "pc4", type: "pc", col: 2, row: 1, label: "PC4", model: "VLAN 20" },
      ],
      edges: [
        ["sw1","sw2","Trunk Gi0/1","dashed"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],
        ["sw2","pc3","Fa0/1"],["sw2","pc4","Fa0/2"],
      ],
    },
    tip: "Link antar-switch di-set jadi trunk (bukan access) supaya VLAN 10 & 20 tetap konsisten di kedua switch.",
  },

  intervlan: {
    devices: [
      { type: "router", model: "Cisco 1941 (2x FastEthernet)", qty: 1, note: "Router-on-a-stick: 1 interface fisik di-subinterface-kan per VLAN." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Port ke router di-set trunk, port ke PC di-set access." },
      { type: "pc", model: "Generic PC-PT", qty: 4, note: "2 PC di VLAN 10, 2 PC di VLAN 20 — default gateway ke IP subinterface." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 1.5, row: 0, label: "R1", model: "1941" },
        { id: "sw1", type: "switch", col: 1.5, row: 1, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "VLAN 10" },
        { id: "pc2", type: "pc", col: 1, row: 2, label: "PC2", model: "VLAN 10" },
        { id: "pc3", type: "pc", col: 2, row: 2, label: "PC3", model: "VLAN 20" },
        { id: "pc4", type: "pc", col: 3, row: 2, label: "PC4", model: "VLAN 20" },
      ],
      edges: [
        ["r1","sw1","Trunk Gi0/0","dashed"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],["sw1","pc3","Fa0/3"],["sw1","pc4","Fa0/4"],
      ],
    },
    tip: "Alternatif: ganti Router+Switch dengan 1 unit Switch L3 (Cisco 3560) yang punya fitur SVI, tanpa router terpisah.",
  },

  stp: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 3, note: "3 switch dihubungkan segitiga (redundant link) supaya loop L2 benar-benar terjadi tanpa STP." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "Cukup 2 host untuk uji forwarding tetap jalan walau ada link cadangan yang di-block." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 1, row: 0, label: "SW1", model: "Root" },
        { id: "sw2", type: "switch", col: 0, row: 1.4, label: "SW2", model: "2960" },
        { id: "sw3", type: "switch", col: 2, row: 1.4, label: "SW3", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2.4, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 2.4, label: "PC2", model: "PC-PT" },
      ],
      edges: [
        ["sw1","sw2","Gi0/1"],
        ["sw1","sw3","Gi0/2"],
        ["sw2","sw3","Blocked (backup)","dashed"],
        ["sw2","pc1","Fa0/1"],
        ["sw3","pc2","Fa0/1"],
      ],
    },
    tip: "Link putus-putus adalah redundant link yang sengaja dipasang lalu di-block STP (blocking state) untuk mencegah loop.",
  },

  etherchannel: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 2, note: "2 switch dihubungkan dengan 2 link fisik yang digabung jadi 1 Port-channel logis." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "1 PC per switch untuk uji trafik tetap jalan walau salah satu link fisik dicabut." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 0, row: 0, label: "SW1", model: "2960" },
        { id: "sw2", type: "switch", col: 2, row: 0, label: "SW2", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 1, label: "PC2", model: "PC-PT" },
      ],
      edges: [
        ["sw1","sw2","Po1: Gi0/1","double"],
        ["sw1","sw2","Po1: Gi0/2","double2"],
        ["sw1","pc1","Fa0/1"],
        ["sw2","pc2","Fa0/1"],
      ],
    },
    tip: "2 link fisik paralel digabung jadi 1 Port-channel (EtherChannel) — menambah bandwidth sekaligus jadi backup satu sama lain.",
  },

  portsecurity: {
    devices: [
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Aktifkan port security per access port (bukan trunk)." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "PC sah yang MAC-nya di-allow (manual/sticky)." },
      { type: "pc", model: "Generic PC-PT (\"penyusup\")", qty: 1, note: "PC ke-3 dipakai untuk mensimulasikan pelanggaran (MAC asing) dan memicu violation action." },
    ],
    diagram: {
      nodes: [
        { id: "sw1", type: "switch", col: 1, row: 0, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "sah" },
        { id: "pc2", type: "pc", col: 1, row: 1, label: "PC2", model: "sah" },
        { id: "pc3", type: "pc", col: 2, row: 1, label: "PC3", model: "penyusup" },
      ],
      edges: [
        ["sw1","pc1","Fa0/1"],
        ["sw1","pc2","Fa0/2"],
        ["sw1","pc3","Fa0/3 (violation)","dashed"],
      ],
    },
    tip: "PC3 sengaja ditukar/ditambah untuk memicu port security violation (protect/restrict/shutdown) di Fa0/3.",
  },

  staticroute: {
    devices: [
      { type: "router", model: "Cisco 1941", qty: 2, note: "2 router mewakili 2 network berbeda, dihubungkan 1 link point-to-point." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 2, note: "1 switch per sisi jaringan LAN lokal (opsional kalau host cuma 1)." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "1 PC per network untuk uji ping lintas network via static route." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 0, row: 0, label: "R1", model: "1941" },
        { id: "r2", type: "router", col: 2, row: 0, label: "R2", model: "1941" },
        { id: "sw1", type: "switch", col: 0, row: 1, label: "SW1", model: "2960" },
        { id: "sw2", type: "switch", col: 2, row: 1, label: "SW2", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "Net A" },
        { id: "pc2", type: "pc", col: 2, row: 2, label: "PC2", model: "Net B" },
      ],
      edges: [
        ["r1","r2","Se0/0/0 (DCE)"],
        ["r1","sw1","Gi0/0"],
        ["r2","sw2","Gi0/0"],
        ["sw1","pc1","Fa0/1"],
        ["sw2","pc2","Fa0/1"],
      ],
    },
    tip: "Setiap router perlu 1 baris `ip route` menuju network di seberang lewat next-hop / exit-interface ke router tetangga.",
  },

  rip: {
    devices: [
      { type: "router", model: "Cisco 1941", qty: 3, note: "3 router disusun segitiga supaya RIPv2 punya lebih dari 1 kemungkinan jalur." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 3, note: "1 switch per router untuk LAN lokal masing-masing." },
      { type: "pc", model: "Generic PC-PT", qty: 3, note: "1 PC per network untuk uji ping antar-network lewat routing dinamis." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 1, row: 0, label: "R1", model: "1941" },
        { id: "r2", type: "router", col: 0, row: 1.4, label: "R2", model: "1941" },
        { id: "r3", type: "router", col: 2, row: 1.4, label: "R3", model: "1941" },
        { id: "sw1", type: "switch", col: 1, row: -0.9, label: "SW1", model: "Net A" },
        { id: "pc1", type: "pc", col: 1, row: -1.9, label: "PC1", model: "PC-PT" },
        { id: "sw2", type: "switch", col: -1, row: 1.4, label: "SW2", model: "Net B" },
        { id: "pc2", type: "pc", col: -2, row: 1.4, label: "PC2", model: "PC-PT" },
        { id: "sw3", type: "switch", col: 3, row: 1.4, label: "SW3", model: "Net C" },
        { id: "pc3", type: "pc", col: 4, row: 1.4, label: "PC3", model: "PC-PT" },
      ],
      edges: [
        ["r1","r2","Se0/0/0"],["r1","r3","Se0/0/1"],["r2","r3","Se0/1/0"],
        ["r1","sw1","Gi0/0"],["sw1","pc1","Fa0/1"],
        ["r2","sw2","Gi0/0"],["sw2","pc2","Fa0/1"],
        ["r3","sw3","Gi0/0"],["sw3","pc3","Fa0/1"],
      ],
    },
    tip: "Segitiga 3 router = ada jalur alternatif, bagus untuk lihat RIP re-converge (max hop 15, update tiap 30 detik) saat 1 link mati.",
  },

  ospf: {
    devices: [
      { type: "router", model: "Cisco 2911", qty: 3, note: "Port lebih banyak dari 1941, cocok untuk multi-area OSPF (area 0 + area lain)." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 3, note: "1 switch per router untuk LAN lokal." },
      { type: "pc", model: "Generic PC-PT", qty: 3, note: "1 PC per area untuk uji ping lintas-area via Router ID & DR/BDR." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 1, row: 0, label: "R1", model: "Area 0" },
        { id: "r2", type: "router", col: 0, row: 1.4, label: "R2", model: "Area 0/1" },
        { id: "r3", type: "router", col: 2, row: 1.4, label: "R3", model: "Area 0/2" },
        { id: "sw1", type: "switch", col: 1, row: -0.9, label: "SW1", model: "" },
        { id: "pc1", type: "pc", col: 1, row: -1.9, label: "PC1", model: "" },
        { id: "sw2", type: "switch", col: -1, row: 1.4, label: "SW2", model: "" },
        { id: "pc2", type: "pc", col: -2, row: 1.4, label: "PC2", model: "" },
        { id: "sw3", type: "switch", col: 3, row: 1.4, label: "SW3", model: "" },
        { id: "pc3", type: "pc", col: 4, row: 1.4, label: "PC3", model: "" },
      ],
      edges: [
        ["r1","r2","Se0/0/0 (Area 0)"],["r1","r3","Se0/0/1 (Area 0)"],
        ["r2","r3","Se0/1/0 (opsional)","dashed"],
        ["r1","sw1","Gi0/0"],["sw1","pc1","Fa0/1"],
        ["r2","sw2","Gi0/0"],["sw2","pc2","Fa0/1"],
        ["r3","sw3","Gi0/0"],["sw3","pc3","Fa0/1"],
      ],
    },
    tip: "R1 dipakai sebagai backbone (Area 0); R2 & R3 bisa dipisah ke area non-0 untuk latihan multi-area OSPF.",
  },

  eigrp: {
    devices: [
      { type: "router", model: "Cisco 1941", qty: 3, note: "Segitiga 3 router — cukup untuk lihat DUAL memilih successor & feasible successor." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 3, note: "1 switch per router untuk LAN lokal." },
      { type: "pc", model: "Generic PC-PT", qty: 3, note: "1 PC per network untuk uji konvergensi cepat EIGRP saat link diputus." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 1, row: 0, label: "R1", model: "AS 100" },
        { id: "r2", type: "router", col: 0, row: 1.4, label: "R2", model: "AS 100" },
        { id: "r3", type: "router", col: 2, row: 1.4, label: "R3", model: "AS 100" },
        { id: "sw1", type: "switch", col: 1, row: -0.9, label: "SW1", model: "" },
        { id: "pc1", type: "pc", col: 1, row: -1.9, label: "PC1", model: "" },
        { id: "sw2", type: "switch", col: -1, row: 1.4, label: "SW2", model: "" },
        { id: "pc2", type: "pc", col: -2, row: 1.4, label: "PC2", model: "" },
        { id: "sw3", type: "switch", col: 3, row: 1.4, label: "SW3", model: "" },
        { id: "pc3", type: "pc", col: 4, row: 1.4, label: "PC3", model: "" },
      ],
      edges: [
        ["r1","r2","Se0/0/0"],["r1","r3","Se0/0/1"],["r2","r3","Se0/1/0"],
        ["r1","sw1","Gi0/0"],["sw1","pc1","Fa0/1"],
        ["r2","sw2","Gi0/0"],["sw2","pc2","Fa0/1"],
        ["r3","sw3","Gi0/0"],["sw3","pc3","Fa0/1"],
      ],
    },
    tip: "Semua router harus 1 Autonomous System Number (AS) yang sama, contoh AS 100, supaya bisa saling bertukar rute EIGRP.",
  },

  dhcp: {
    devices: [
      { type: "router", model: "Cisco 1941 (DHCP server via IOS)", qty: 1, note: "Bisa juga diganti Server-PT khusus DHCP kalau mau server terpisah dari router." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Distribusi ke seluruh client." },
      { type: "pc", model: "Generic PC-PT", qty: 3, note: "Set IP Configuration ke \"DHCP\" di ketiga PC untuk uji auto-assign." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 1, row: 0, label: "R1", model: "DHCP Srv" },
        { id: "sw1", type: "switch", col: 1, row: 1, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "auto-IP" },
        { id: "pc2", type: "pc", col: 1, row: 2, label: "PC2", model: "auto-IP" },
        { id: "pc3", type: "pc", col: 2, row: 2, label: "PC3", model: "auto-IP" },
      ],
      edges: [
        ["r1","sw1","Gi0/0"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],["sw1","pc3","Fa0/3"],
      ],
    },
    tip: "Kalau DHCP client beda subnet dari server, tambahkan `ip helper-address` di interface router yang menghadap client.",
  },

  dns: {
    devices: [
      { type: "server", model: "Generic Server-PT (DNS Service)", qty: 1, note: "Aktifkan service DNS, daftarkan A record untuk domain lab." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Menghubungkan server & client dalam 1 broadcast domain." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "DNS server PC diarahkan ke IP Server-PT untuk uji resolusi nama domain." },
    ],
    diagram: {
      nodes: [
        { id: "srv1", type: "server", col: 1, row: 0, label: "SRV1", model: "DNS" },
        { id: "sw1", type: "switch", col: 1, row: 1, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 2, label: "PC2", model: "PC-PT" },
      ],
      edges: [
        ["srv1","sw1","Fa0/0"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],
      ],
    },
    tip: "Uji dengan `nslookup namadomain.lab` di Command Prompt PC setelah A record terdaftar di server.",
  },

  nat: {
    devices: [
      { type: "cloud", model: "Cloud-PT (Internet/ISP)", qty: 1, note: "Mewakili jaringan publik / ISP di luar kantor." },
      { type: "router", model: "Cisco 1941 (NAT: inside/outside)", qty: 1, note: "Interface ke LAN = ip nat inside, interface ke cloud = ip nat outside." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 1, note: "Distribusi ke PC ber-IP privat." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "IP privat (mis. 192.168.1.0/24) yang di-translate NAT saat keluar ke cloud." },
    ],
    diagram: {
      nodes: [
        { id: "cloud1", type: "cloud", col: 3, row: 0, label: "Internet", model: "Cloud-PT" },
        { id: "r1", type: "router", col: 1.5, row: 0, label: "R1", model: "NAT" },
        { id: "sw1", type: "switch", col: 1.5, row: 1, label: "SW1", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "privat" },
        { id: "pc2", type: "pc", col: 2, row: 2, label: "PC2", model: "privat" },
      ],
      edges: [
        ["r1","cloud1","Gi0/1 (outside)","dashed"],
        ["r1","sw1","Gi0/0 (inside)"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],
      ],
    },
    tip: "Kalau Cloud-PT belum mau dipakai, boleh ganti sementara dengan 1 Router lagi berperan sebagai \"ISP\" simulasi.",
  },

  acl: {
    devices: [
      { type: "router", model: "Cisco 1941", qty: 2, note: "ACL biasanya diterapkan di router yang jadi gateway antar-network." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 2, note: "1 switch per sisi network." },
      { type: "server", model: "Generic Server-PT", qty: 1, note: "Jadi target yang di-permit/deny (mis. akses HTTP diizinkan, Telnet diblok)." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "PC sumber trafik yang diuji terhadap rule ACL." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 0, row: 0, label: "R1", model: "1941" },
        { id: "r2", type: "router", col: 2, row: 0, label: "R2", model: "ACL" },
        { id: "sw1", type: "switch", col: 0, row: 1, label: "SW1", model: "" },
        { id: "sw2", type: "switch", col: 2, row: 1, label: "SW2", model: "" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "sumber" },
        { id: "pc2", type: "pc", col: 1.4, row: 2, label: "PC2", model: "sumber" },
        { id: "srv1", type: "server", col: 2, row: 2, label: "SRV1", model: "target" },
      ],
      edges: [
        ["r1","r2","Gi0/1","dashed"],
        ["r1","sw1","Gi0/0"],["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],
        ["r2","sw2","Gi0/0"],["sw2","srv1","Fa0/1"],
      ],
    },
    tip: "Pasang ACL sedekat mungkin ke sumber untuk standard ACL, atau sedekat mungkin ke tujuan untuk extended ACL.",
  },

  serial: {
    devices: [
      { type: "router", model: "Cisco 1941 + modul WIC-2T", qty: 2, note: "Butuh port serial tambahan (WIC-2T) karena 1941 default tidak punya port serial." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "1 PC per sisi untuk uji konektivitas WAN point-to-point." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 0, row: 0, label: "R1", model: "DCE" },
        { id: "r2", type: "router", col: 2, row: 0, label: "R2", model: "DTE" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 1, label: "PC2", model: "PC-PT" },
      ],
      edges: [
        ["r1","r2","Serial0/0/0 (clock rate di DCE)","dashed"],
        ["r1","pc1","Gi0/0"],
        ["r2","pc2","Gi0/0"],
      ],
    },
    tip: "Sisi yang pakai kabel Serial DCE wajib di-set `clock rate`, sisi DTE tidak perlu.",
  },

  ppp: {
    devices: [
      { type: "router", model: "Cisco 1941 + modul WIC-2T", qty: 2, note: "Sama seperti modul Serial, tapi encapsulation diganti PPP (+ opsional PAP/CHAP)." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "1 PC per sisi untuk uji ping setelah PPP negotiation & autentikasi sukses." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 0, row: 0, label: "R1", model: "PPP" },
        { id: "r2", type: "router", col: 2, row: 0, label: "R2", model: "PPP" },
        { id: "pc1", type: "pc", col: 0, row: 1, label: "PC1", model: "PC-PT" },
        { id: "pc2", type: "pc", col: 2, row: 1, label: "PC2", model: "PC-PT" },
      ],
      edges: [
        ["r1","r2","Serial0/0/0 (encapsulation ppp)","dashed"],
        ["r1","pc1","Gi0/0"],
        ["r2","pc2","Gi0/0"],
      ],
    },
    tip: "Kalau pakai CHAP, username & password di kedua router harus sama persis (case-sensitive).",
  },

  framerelay: {
    devices: [
      { type: "fr", model: "Frame Relay Switch (WAN Emulation)", qty: 1, note: "Perangkat WAN emulation bawaan Packet Tracer, bukan router biasa." },
      { type: "router", model: "Cisco 1941 + modul WIC-2T", qty: 3, note: "3 router sebagai spoke, masing-masing 1 PVC ke Frame Relay switch (topologi hub-and-spoke)." },
      { type: "pc", model: "Generic PC-PT", qty: 3, note: "1 PC per spoke untuk uji reachability lintas PVC." },
    ],
    diagram: {
      nodes: [
        { id: "fr1", type: "fr", col: 1, row: 0, label: "FR-SW", model: "WAN Emu" },
        { id: "r1", type: "router", col: 0, row: 1.2, label: "R1", model: "spoke" },
        { id: "r2", type: "router", col: 1, row: 1.2, label: "R2", model: "spoke" },
        { id: "r3", type: "router", col: 2, row: 1.2, label: "R3", model: "spoke" },
        { id: "pc1", type: "pc", col: 0, row: 2.2, label: "PC1", model: "" },
        { id: "pc2", type: "pc", col: 1, row: 2.2, label: "PC2", model: "" },
        { id: "pc3", type: "pc", col: 2, row: 2.2, label: "PC3", model: "" },
      ],
      edges: [
        ["fr1","r1","PVC 102","dashed"],["fr1","r2","PVC 201","dashed"],["fr1","r3","PVC 301","dashed"],
        ["r1","pc1","Gi0/0"],["r2","pc2","Gi0/0"],["r3","pc3","Gi0/0"],
      ],
    },
    tip: "Modul ini opsional — Frame Relay legacy, tapi topologi hub-and-spoke-nya bagus untuk memahami konsep PVC & DLCI.",
  },

  project: {
    devices: [
      { type: "cloud", model: "Cloud-PT (Internet)", qty: 1, note: "Simulasi koneksi kantor ke luar." },
      { type: "router", model: "Cisco 2911", qty: 2, note: "1 router edge (NAT/Internet), 1 router internal (routing antar-departemen)." },
      { type: "l3switch", model: "Cisco 3560-24PS (Layer 3)", qty: 1, note: "Core switch untuk inter-VLAN routing kecepatan tinggi (SVI) antar departemen." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 3, note: "Access switch per departemen/lantai — masing-masing bawa beberapa VLAN via trunk ke core." },
      { type: "server", model: "Generic Server-PT", qty: 2, note: "1 server DHCP+DNS, 1 server file/HTTP internal." },
      { type: "pc", model: "Generic PC-PT", qty: 6, note: "Minimal 2 PC per departemen (mis. Finance, HR, Umum) untuk uji end-to-end." },
    ],
    diagram: {
      nodes: [
        { id: "cloud1", type: "cloud", col: 2, row: -1, label: "Internet", model: "" },
        { id: "redge", type: "router", col: 2, row: 0, label: "R-EDGE", model: "NAT" },
        { id: "rint", type: "router", col: 2, row: 1, label: "R-INT", model: "routing" },
        { id: "core", type: "l3switch", col: 2, row: 2, label: "CORE", model: "3560 L3" },
        { id: "sw1", type: "switch", col: 0, row: 3, label: "SW-A", model: "Finance" },
        { id: "sw2", type: "switch", col: 2, row: 3, label: "SW-B", model: "HR" },
        { id: "sw3", type: "switch", col: 4, row: 3, label: "SW-C", model: "Umum" },
        { id: "srv1", type: "server", col: 3, row: 2, label: "SRV1", model: "DHCP/DNS" },
        { id: "srv2", type: "server", col: 1, row: 2, label: "SRV2", model: "File/HTTP" },
        { id: "pc1", type: "pc", col: -0.6, row: 4, label: "PC1", model: "" },
        { id: "pc2", type: "pc", col: 0.6, row: 4, label: "PC2", model: "" },
        { id: "pc3", type: "pc", col: 1.4, row: 4, label: "PC3", model: "" },
        { id: "pc4", type: "pc", col: 2.6, row: 4, label: "PC4", model: "" },
        { id: "pc5", type: "pc", col: 3.4, row: 4, label: "PC5", model: "" },
        { id: "pc6", type: "pc", col: 4.6, row: 4, label: "PC6", model: "" },
      ],
      edges: [
        ["cloud1","redge","","dashed"],
        ["redge","rint","Gi0/0"],
        ["rint","core","Trunk","dashed"],
        ["core","srv1","Gi0/2"],["core","srv2","Gi0/1"],
        ["core","sw1","Trunk","dashed"],["core","sw2","Trunk","dashed"],["core","sw3","Trunk","dashed"],
        ["sw1","pc1","Fa0/1"],["sw1","pc2","Fa0/2"],
        ["sw2","pc3","Fa0/1"],["sw2","pc4","Fa0/2"],
        ["sw3","pc5","Fa0/1"],["sw3","pc6","Fa0/2"],
      ],
    },
    tip: "Ini gabungan seluruh modul 01–18: VLAN, trunk, inter-VLAN, routing, DHCP/DNS, NAT, dan ACL jadi 1 topologi kantor utuh.",
  },

  "08_troubleshooting": {
    devices: [
      { type: "router", model: "Cisco 1941", qty: 2, note: "Pakai topologi lab sebelumnya (mis. static route/OSPF) yang sengaja \"dirusak\" konfigurasinya." },
      { type: "switch", model: "Cisco 2960-24TT", qty: 2, note: "Sengaja salah VLAN/port-mode untuk latihan troubleshooting Layer 2." },
      { type: "pc", model: "Generic PC-PT", qty: 2, note: "Dipakai untuk `ping`, `tracert`, `ipconfig` menelusuri masalah per-layer OSI." },
    ],
    diagram: {
      nodes: [
        { id: "r1", type: "router", col: 0, row: 0, label: "R1", model: "1941" },
        { id: "r2", type: "router", col: 2, row: 0, label: "R2", model: "1941" },
        { id: "sw1", type: "switch", col: 0, row: 1, label: "SW1", model: "2960" },
        { id: "sw2", type: "switch", col: 2, row: 1, label: "SW2", model: "2960" },
        { id: "pc1", type: "pc", col: 0, row: 2, label: "PC1", model: "" },
        { id: "pc2", type: "pc", col: 2, row: 2, label: "PC2", model: "" },
      ],
      edges: [
        ["r1","r2","link diputus?","dashed"],
        ["r1","sw1","Gi0/0"],["r2","sw2","Gi0/0"],
        ["sw1","pc1","Fa0/1"],["sw2","pc2","Fa0/1"],
      ],
    },
    tip: "Bukan topologi baru — pakai ulang topologi modul manapun, lalu sengaja ubah 1-2 baris config untuk dicari sendiri masalahnya (bottom-up).",
  },
};

/* ---------------- Device table renderer ---------------- */
function renderTopoDevices(moduleId, targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const data = TOPOLOGY_DATA[moduleId];
  if (!data) { el.innerHTML = `<p class="muted">Belum ada data topologi untuk modul ini.</p>`; return; }
  const rows = data.devices.map(d => `
    <tr>
      <td><span class="topo-chip">${TOPO_ICON[d.type] || "•"}</span> ${TOPO_TYPE_LABEL[d.type] || d.type}</td>
      <td><code>${escapeHtml(d.model)}</code></td>
      <td class="topo-qty">&times;${d.qty}</td>
      <td class="muted">${escapeHtml(d.note || "")}</td>
    </tr>`).join("");
  el.innerHTML = `
    <div class="md-table-wrap">
      <table class="topo-table">
        <thead><tr><th>Perangkat</th><th>Tipe / Model (Packet Tracer)</th><th>Jumlah</th><th>Keterangan</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${data.tip ? `<div class="callout" style="margin-top:14px;margin-bottom:0;">${escapeHtml(data.tip)}</div>` : ""}
  `;
}

/* ---------------- Diagram renderer ---------------- */
function topoNodeIcon(type) {
  return TOPO_ICON[type] || "❔";
}

function buildTopoSVG(diagram) {
  const nodes = diagram.nodes;
  const edges = diagram.edges || [];
  const cellW = 128, cellH = 108, pad = 70;
  const cols = nodes.map(n => n.col);
  const rows = nodes.map(n => n.row);
  const minCol = Math.min(...cols), maxCol = Math.max(...cols);
  const minRow = Math.min(...rows), maxRow = Math.max(...rows);

  const pos = {};
  nodes.forEach(n => {
    pos[n.id] = {
      x: (n.col - minCol) * cellW + pad,
      y: (n.row - minRow) * cellH + pad,
    };
  });
  const width = (maxCol - minCol) * cellW + pad * 2;
  const height = (maxRow - minRow) * cellH + pad * 2;

  const lineColor = "#15130C";

  const edgeSvg = edges.map(([fromId, toId, label, style]) => {
    const a = pos[fromId], b = pos[toId];
    if (!a || !b) return "";
    const dash = (style === "dashed") ? `stroke-dasharray="7,6"` : "";
    let extra = "";
    if (style === "double" || style === "double2") {
      // draw two thin parallel lines for EtherChannel bundles
      const dx = b.y - a.y, dy = a.x - b.x;
      const len = Math.hypot(dx, dy) || 1;
      const off = 4 * (style === "double2" ? -1 : 1);
      const ox = (dx / len) * off, oy = (dy / len) * off;
      extra = `<line x1="${a.x + ox}" y1="${a.y + oy}" x2="${b.x + ox}" y2="${b.y + oy}" stroke="${lineColor}" stroke-width="2.5" ${dash}/>`;
    }
    const mainLine = (style === "double" || style === "double2")
      ? ""
      : `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${lineColor}" stroke-width="2.5" ${dash}/>`;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const labelSvg = label ? `
      <g transform="translate(${mx},${my})">
        <rect x="${-(label.length * 3.2 + 8)}" y="-10" width="${label.length * 6.4 + 16}" height="20" rx="6"
          fill="var(--panel)" stroke="${lineColor}" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="10.5" fill="${lineColor}" font-weight="700">${escapeHtml(label)}</text>
      </g>` : "";
    return mainLine + extra + labelSvg;
  }).join("");

  const nodeSvg = nodes.map(n => {
    const p = pos[n.id];
    const bw = 106, bh = 78;
    const x = p.x - bw / 2, y = p.y - bh / 2;
    const fill = TOPO_FILL[n.type] || "var(--panel)";
    const icon = topoNodeIcon(n.type);
    const sub = n.model ? `<text x="${p.x}" y="${y + bh - 10}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="9" fill="var(--muted)">${escapeHtml(n.model)}</text>` : "";
    return `
      <g>
        <rect x="${x + 4}" y="${y + 4}" width="${bw}" height="${bh}" rx="14" fill="${lineColor}"/>
        <rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="14" fill="${fill}" stroke="${lineColor}" stroke-width="2.5"/>
        <text x="${p.x}" y="${y + 32}" text-anchor="middle" font-size="24">${icon}</text>
        <text x="${p.x}" y="${y + 52}" text-anchor="middle" font-family="Space Grotesk, sans-serif" font-size="13" font-weight="700" fill="${lineColor}">${escapeHtml(n.label)}</text>
        ${sub}
      </g>`;
  }).join("");

  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Diagram topologi">
      ${edgeSvg}
      ${nodeSvg}
    </svg>`;
}

function renderTopoDiagram(moduleId, targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const data = TOPOLOGY_DATA[moduleId];
  if (!data || !data.diagram) { el.innerHTML = `<p class="muted">Belum ada diagram untuk modul ini.</p>`; return; }

  const usedTypes = Array.from(new Set(data.diagram.nodes.map(n => n.type)));
  const legend = usedTypes.map(t => `
    <span class="topo-legend-item">
      <span class="topo-chip" style="background:${TOPO_FILL[t] || "var(--panel)"}">${TOPO_ICON[t] || "•"}</span>
      ${TOPO_TYPE_LABEL[t] || t}
    </span>`).join("");

  const nodeCount = data.diagram.nodes.length;
  const minWidth = Math.min(760, Math.max(360, nodeCount * 118));

  el.innerHTML = `
    <div class="topo-diagram">
      <div class="topo-diagram-inner" style="min-width:${minWidth}px;">
        ${buildTopoSVG(data.diagram)}
      </div>
    </div>
    <div class="topo-legend">${legend}</div>
  `;
}

/* ---------------- Entry point dipanggil dari tiap halaman modul ---------------- */
function renderTopology(moduleId) {
  renderTopoDevices(moduleId, "#topoDevices");
  renderTopoDiagram(moduleId, "#topoDiagram");
}
