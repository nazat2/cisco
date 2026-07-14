/* =========================================================
   CISCO LEARNING HUB — main.js
   Shared shell (sidebar/topbar), markdown+cli loaders,
   checklist progress (localStorage), tabs, mobile nav.
   ========================================================= */

const BASE = (() => {
  // works whether page is at root (index.html) or inside /pages/
  const path = location.pathname;
  return path.includes("/pages/") ? "../" : "./";
})();

// FOLDERS = the 7 top-level "folder" groups shown in the sidebar tree.
// Each folder can be expanded/collapsed to reveal the modules (files) inside.
const FOLDERS = [
  { id: "01_basic", label: "01_basic", title: "Dasar CLI", modules: ["basic"] },
  { id: "02_vlan", label: "02_vlan", title: "VLAN & Trunking", modules: ["vlan", "trunk", "intervlan"] },
  { id: "03_switch", label: "03_switch", title: "Switching Lanjutan", modules: ["stp", "etherchannel", "portsecurity"] },
  { id: "04_routing", label: "04_routing", title: "Routing", modules: ["staticroute", "rip", "ospf", "eigrp"] },
  { id: "05_services", label: "05_services", title: "Network Services", modules: ["dhcp", "dns", "nat", "acl"] },
  { id: "06_wan", label: "06_wan", title: "WAN", modules: ["serial", "ppp", "framerelay"] },
  { id: "07_project", label: "07_project", title: "Capstone", modules: ["project"] },
];

// MODULES = flat list of every module ("file") across all folders, in the
// order they should be studied. Used for progress tracking, prev/next nav,
// and the home page rack grid.
const MODULES = [
  { id: "basic", num: "01", label: "Basic", port: "Gi0/1", page: "01-basic.html", desc: "Mode CLI, navigasi perintah, hostname, password, dan penyimpanan konfigurasi." },
  { id: "vlan", num: "02", label: "VLAN", port: "Gi0/2", page: "02-vlan.html", desc: "Segmentasi jaringan logis dengan VLAN pada switch." },
  { id: "trunk", num: "03", label: "Trunk", port: "Gi0/3", page: "03-trunk.html", desc: "Menghubungkan antar-switch membawa banyak VLAN sekaligus." },
  { id: "intervlan", num: "04", label: "Inter VLAN Routing", port: "Gi0/4", page: "04-intervlan.html", desc: "Routing antar VLAN memakai router-on-a-stick / SVI." },
  { id: "stp", num: "05", label: "STP", port: "Gi0/5", page: "05-stp.html", desc: "Mencegah loop Layer 2 dengan Spanning Tree Protocol." },
  { id: "etherchannel", num: "06", label: "EtherChannel", port: "Gi0/6", page: "06-etherchannel.html", desc: "Menggabungkan beberapa link fisik jadi 1 link logis." },
  { id: "portsecurity", num: "07", label: "Port Security", port: "Gi0/7", page: "07-portsecurity.html", desc: "Membatasi MAC address yang boleh terhubung ke access port." },
  { id: "staticroute", num: "08", label: "Static Route", port: "Gi0/8", page: "08-static-route.html", desc: "Membuat jalur routing manual untuk jaringan kecil/stabil." },
  { id: "rip", num: "09", label: "RIP", port: "Gi0/9", page: "09-rip.html", desc: "Routing dinamis distance-vector paling sederhana." },
  { id: "ospf", num: "10", label: "OSPF", port: "Gi0/10", page: "10-ospf.html", desc: "Routing dinamis link-state untuk jaringan menengah-besar." },
  { id: "eigrp", num: "11", label: "EIGRP", port: "Gi0/11", page: "11-eigrp.html", desc: "Routing dinamis hybrid dengan konvergensi sangat cepat (DUAL)." },
  { id: "dhcp", num: "12", label: "DHCP", port: "Gi0/12", page: "12-dhcp.html", desc: "Alokasi IP otomatis untuk host di jaringan." },
  { id: "dns", num: "13", label: "DNS", port: "Gi0/13", page: "13-dns.html", desc: "Menerjemahkan nama domain/hostname menjadi alamat IP." },
  { id: "nat", num: "14", label: "NAT", port: "Gi0/14", page: "14-nat.html", desc: "Menerjemahkan IP privat ke IP publik agar bisa akses internet." },
  { id: "acl", num: "15", label: "ACL", port: "Gi0/15", page: "15-acl.html", desc: "Menyaring trafik dengan Access Control List." },
  { id: "serial", num: "16", label: "Serial", port: "Gi0/16", page: "16-serial.html", desc: "Koneksi WAN point-to-point dasar antar router." },
  { id: "ppp", num: "17", label: "PPP", port: "Gi0/17", page: "17-ppp.html", desc: "Encapsulation WAN dengan autentikasi PAP/CHAP." },
  { id: "framerelay", num: "18", label: "Frame Relay (opsional)", port: "Gi0/18", page: "18-framerelay.html", desc: "Teknologi WAN legacy berbasis switched virtual circuit — materi opsional." },
  { id: "project", num: "19", label: "Simulasi Jaringan Perusahaan", port: "Gi0/19", page: "19-project.html", desc: "Proyek akhir: gabungkan semua modul jadi 1 topologi kantor utuh." },
];
const MODULE_BY_ID = Object.fromEntries(MODULES.map(m => [m.id, m]));
function folderOf(moduleId) {
  return FOLDERS.find(fo => fo.modules.includes(moduleId));
}

const EXTRA_NAV = [
  { id: "08_troubleshooting", label: "Troubleshooting", page: "08-troubleshooting.html", icon: "🛠" },
  { id: "notes", label: "Cheat Sheet", page: "notes.html", icon: "📒" },
  { id: "configs", label: "Config Samples", page: "configs.html", icon: "🗂" },
  { id: "topology", label: "Topology Lab", page: "topology.html", icon: "🧭" },
  { id: "shortcuts", label: "Shortcut CLI", page: "shortcuts.html", icon: "⌨" },
];

/* ---------------- Progress storage ---------------- */
function getProgress(moduleId) {
  try {
    const raw = localStorage.getItem("cisco-progress-" + moduleId);
    return raw ? JSON.parse(raw) : [];
  } catch (e) { return []; }
}
function setProgress(moduleId, arr) {
  try { localStorage.setItem("cisco-progress-" + moduleId, JSON.stringify(arr)); } catch (e) {}
}
function moduleStatus(moduleId, totalTasks) {
  const done = getProgress(moduleId).length;
  if (!totalTasks || done === 0) return "off";
  if (done >= totalTasks) return "done";
  return "progress";
}
/* ---------------- Shell rendering ---------------- */
const OPEN_FOLDERS_KEY = "cisco-open-folders";
function getOpenFolders() {
  try {
    const raw = localStorage.getItem(OPEN_FOLDERS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) { return null; }
}
function setOpenFolders(arr) {
  try { localStorage.setItem(OPEN_FOLDERS_KEY, JSON.stringify(arr)); } catch (e) {}
}

function renderShell(activeId) {
  const sidebarEl = document.getElementById("sidebar");
  const topbarEl = document.getElementById("topbar");
  if (!sidebarEl || !topbarEl) return;

  const activeFolder = folderOf(activeId);
  let openFolders = getOpenFolders();
  if (!openFolders) {
    // First visit: open only the folder containing the current page.
    openFolders = activeFolder ? [activeFolder.id] : [];
  } else if (activeFolder && !openFolders.includes(activeFolder.id)) {
    // Always make sure the folder holding the active page is visible.
    openFolders = openFolders.concat([activeFolder.id]);
  }

  const folderHtml = FOLDERS.map(fo => {
    const isOpen = openFolders.includes(fo.id);
    const doneCount = fo.modules.filter(mid => {
      const meta = JSON.parse(localStorage.getItem("cisco-meta-" + mid) || "null");
      const total = meta ? meta.total : 0;
      return total && getProgress(mid).length >= total;
    }).length;
    const fileRows = fo.modules.map(mid => {
      const m = MODULE_BY_ID[mid];
      const meta = JSON.parse(localStorage.getItem("cisco-meta-" + mid) || "null");
      const total = meta ? meta.total : 0;
      const status = moduleStatus(mid, total);
      const active = activeId === mid ? "active" : "";
      return `<a class="port file-port ${active}" href="${BASE}pages/${m.page}" data-mid="${mid}">
        <span class="file-icon" aria-hidden="true">📄</span>
        <span class="led ${status === "off" ? "" : status}"></span>
        <span class="port-label">${m.label}</span>
      </a>`;
    }).join("");
    return `<div class="folder ${isOpen ? "open" : ""}" data-folder="${fo.id}">
      <button type="button" class="folder-header" aria-expanded="${isOpen ? "true" : "false"}">
        <span class="folder-chevron" aria-hidden="true">▸</span>
        <span class="folder-icon" aria-hidden="true">${isOpen ? "📂" : "📁"}</span>
        <span class="folder-label">${fo.label}<i>${fo.title}</i></span>
        <span class="folder-count">${doneCount}/${fo.modules.length}</span>
      </button>
      <div class="folder-body"><div class="folder-body-inner">${fileRows}</div></div>
    </div>`;
  }).join("");

  const extraPorts = EXTRA_NAV.map(e => {
    const active = activeId === e.id ? "active" : "";
    return `<a class="port ${active}" href="${BASE}pages/${e.page}">
      <span class="port-num">${e.icon}</span>
      <span class="port-label">${e.label}</span>
    </a>`;
  }).join("");

  sidebarEl.innerHTML = `
    <a href="${BASE}index.html" class="brand" style="text-decoration:none;color:inherit;">
      <span class="dot"></span>
      <span>
        <strong>CiscoHub</strong>
        <span>nazat</span>
      </span>
    </a>
    <div class="nav-group-label">Dashboard</div>
    <a class="port ${activeId === "home" ? "active" : ""}" href="${BASE}index.html">
      <span class="port-num">•</span><span class="port-label">Overview</span>
    </a>
    <div class="nav-group-label">Modul Praktik (folder)</div>
    <div class="folder-tree" id="folderTree">${folderHtml}</div>
    <div class="nav-group-label">Referensi</div>
    ${extraPorts}
    <div class="sidebar-foot">
      Progress tersimpan otomatis di browser kamu (localStorage).<br/>
      <a class="ig-link" href="https://www.instagram.com/nxzxt._?igsh=eDVzZGphOGg1Z2sz" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"></circle>
        </svg>
        <span>Follow di Instagram</span>
      </a>
    </div>
  `;

  // Folder open/close toggle
  sidebarEl.querySelectorAll(".folder").forEach(folderEl => {
    const fid = folderEl.dataset.folder;
    const header = folderEl.querySelector(".folder-header");
    const icon = folderEl.querySelector(".folder-icon");
    header.addEventListener("click", () => {
      const nowOpen = !folderEl.classList.contains("open");
      folderEl.classList.toggle("open", nowOpen);
      header.setAttribute("aria-expanded", nowOpen ? "true" : "false");
      icon.textContent = nowOpen ? "📂" : "📁";
      let current = getOpenFolders() || [];
      if (nowOpen) {
        if (!current.includes(fid)) current = current.concat([fid]);
      } else {
        current = current.filter(id => id !== fid);
      }
      setOpenFolders(current);
    });
  });

  topbarEl.innerHTML = `
    <button class="hamburger" id="hamburgerBtn" aria-label="Buka menu">☰</button>
    <div class="prompt">Switch1<b>#</b> <span id="promptPath">show module ${activeId}</span></div>
    <div class="topbar-progress" id="topbarProgress"></div>
  `;

  const hb = document.getElementById("hamburgerBtn");
  let overlay = document.getElementById("navOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.id = "navOverlay";
    // IMPORTANT: append inside the same stacking context as the sidebar (.shell),
    // not document.body. .shell has its own z-index (creates a stacking context),
    // so an overlay appended to <body> compares its z-index against .shell as a
    // whole (1) rather than against .sidebar directly (50) — the overlay then
    // visually sits on top of and blocks the sidebar on mobile, even though the
    // sidebar's own z-index is numerically higher. Appending it as a sibling of
    // .sidebar inside .shell fixes the comparison.
    sidebarEl.parentNode.insertBefore(overlay, sidebarEl.nextSibling);
  }
  const closeSidebar = () => {
    sidebarEl.classList.remove("open");
    overlay.classList.remove("show");
    document.documentElement.classList.remove("nav-locked");
  };
  const openSidebar = () => {
    sidebarEl.classList.add("open");
    overlay.classList.add("show");
    document.documentElement.classList.add("nav-locked");
  };
  if (hb) {
    hb.addEventListener("click", () => {
      if (sidebarEl.classList.contains("open")) closeSidebar();
      else openSidebar();
    });
    overlay.addEventListener("click", closeSidebar);
  }
  // UX fix: auto-close the mobile drawer once a nav link is tapped,
  // so users aren't stuck looking at an open overlay after navigating.
  sidebarEl.querySelectorAll("a.port, a.brand").forEach(link => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width:920px)").matches) closeSidebar();
    });
  });

  renderTopProgress();
}

function renderTopProgress() {
  const el = document.getElementById("topbarProgress");
  if (!el) return;
  let done = 0;
  MODULES.forEach(m => {
    const meta = JSON.parse(localStorage.getItem("cisco-meta-" + m.id) || "null");
    const d = getProgress(m.id).length;
    if (meta && meta.total && d >= meta.total) done++;
  });
  const pct = Math.round((done / MODULES.length) * 100);
  el.innerHTML = `<span>${done}/${MODULES.length} modul</span><span class="bar"><span style="width:${pct}%"></span></span>`;
}

/* ---------------- Markdown loader ---------------- */
async function loadMarkdown(url, targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = `<p class="loading">// memuat catatan dari ${url} ...</p>`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    if (window.marked) {
      el.innerHTML = marked.parse(text);
      // Wrap tables in a horizontally-scrollable container so wide tables
      // (e.g. CLI prompt/mode reference tables) don't get clipped off-screen
      // on narrow mobile viewports — instead they scroll within their own box.
      el.querySelectorAll("table").forEach(table => {
        if (table.parentElement.classList.contains("md-table-wrap")) return;
        const wrap = document.createElement("div");
        wrap.className = "md-table-wrap";
        table.parentNode.insertBefore(wrap, table);
        wrap.appendChild(table);
      });
    } else {
      el.innerHTML = `<pre class="md-fallback">${escapeHtml(text)}</pre>`;
    }
  } catch (err) {
    el.innerHTML = `<div class="callout danger">
      Gagal memuat catatan (<code>${url}</code>). Kalau kamu membuka file ini langsung dari
      file explorer (tanpa server lokal), buka lewat <code>vercel dev</code> atau deploy dulu —
      browser memblokir fetch file lokal via <code>file://</code>.
    </div>`;
  }
}

/* ---------------- CLI / config loader with mini IOS highlighter ---------------- */
function highlightIOS(text) {
  const kw = /\b(interface|vlan|switchport|ip|access-list|router|network|no|shutdown|exit|end|hostname|enable|line|password|service|banner|do|show|write|copy|permit|deny|ntp|dhcp|default-router|dns-server|encapsulation|trunk|access|mode|allowed|native|standard|extended|eq|any|host)\b/gi;
  return escapeHtml(text)
    .split("\n")
    .map(line => {
      if (line.trim().startsWith("!")) return `<span class="c-comment">${line}</span>`;
      if (line.trim().startsWith("#")) return `<span class="c-comment">${line}</span>`;
      // Highlight quoted strings first, then keywords — doing it in the
      // opposite order makes the keyword <span class="c-kw"> markup get
      // re-matched by the quote regex (it sees the quotes around c-kw),
      // which breaks the HTML and prints the class name as literal text.
      // Note: at this point the line is already HTML-escaped, so a literal
      // quote is "&quot;" rather than '"'.
      let l = line.replace(/&quot;([^&]*)&quot;/g, (m0) => `<span class="c-str">${m0}</span>`);
      l = l.replace(kw, m => `<span class="c-kw">${m}</span>`);
      return l;
    })
    .join("\n");
}
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}
async function loadCode(url, targetSelector, label) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = `<div class="loading">// memuat konfigurasi ...</div>`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const text = await res.text();
    el.innerHTML = `
      <div class="cli-window">
        <div class="cli-bar">
          <span class="dots"><i></i><i></i><i></i></span>
          <span>${label || url}</span>
          <button class="copy-btn" type="button">copy</button>
        </div>
        <pre class="cli-body"><code>${highlightIOS(text)}</code></pre>
      </div>`;
    const btn = el.querySelector(".copy-btn");
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = "copied ✓";
        setTimeout(() => (btn.textContent = "copy"), 1400);
      });
    });
  } catch (err) {
    el.innerHTML = `<div class="callout danger">Gagal memuat file konfigurasi (<code>${url}</code>).</div>`;
  }
}

/* ---------------- Tabs ---------------- */
function initTabs(root = document) {
  root.querySelectorAll(".tabs").forEach(tabbar => {
    tabbar.setAttribute("role", "tablist");
    const btns = tabbar.querySelectorAll(".tab-btn");
    const panelWrap = tabbar.parentElement;
    btns.forEach(btn => {
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
      const panel = panelWrap.querySelector('[data-panel="' + btn.dataset.tab + '"]');
      if (panel) panel.setAttribute("role", "tabpanel");
      btn.addEventListener("click", () => {
        const target = btn.dataset.tab;
        btns.forEach(b => b.classList.remove("active"));
        btns.forEach(b => b.setAttribute("aria-selected", "false"));
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        panelWrap.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
        if (panel) panel.classList.add("active");
      });
    });
  });
}

/* ---------------- Checklist ---------------- */
function initChecklist(moduleId) {
  const list = document.querySelector(".checklist[data-module='" + moduleId + "']");
  if (!list) return;
  const boxes = list.querySelectorAll("input[type=checkbox]");
  const total = boxes.length;
  localStorage.setItem("cisco-meta-" + moduleId, JSON.stringify({ total }));

  const saved = getProgress(moduleId);
  boxes.forEach(b => {
    if (saved.includes(b.dataset.task)) b.checked = true;
  });
  updateModuleBadge(moduleId, total);

  boxes.forEach(b => {
    b.addEventListener("change", () => {
      let current = getProgress(moduleId);
      if (b.checked) {
        if (!current.includes(b.dataset.task)) current.push(b.dataset.task);
      } else {
        current = current.filter(t => t !== b.dataset.task);
      }
      setProgress(moduleId, current);
      updateModuleBadge(moduleId, total);
      renderTopProgress();
      // refresh sidebar LED without a full page reload
      renderShell(document.body.dataset.active);
    });
  });
}
function updateModuleBadge(moduleId, total) {
  const badge = document.getElementById("progressBadge");
  const done = getProgress(moduleId).length;
  if (badge) {
    badge.textContent = `${done}/${total} tugas selesai`;
    badge.style.color = done >= total && total > 0 ? "var(--cyan)" : "var(--muted)";
  }
}

/* ---------------- Home page: rack cards + terminal boot ---------------- */
function renderRackGrid(targetSelector) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  el.innerHTML = FOLDERS.map(fo => {
    const cards = fo.modules.map(mid => {
      const m = MODULE_BY_ID[mid];
      const meta = JSON.parse(localStorage.getItem("cisco-meta-" + m.id) || "null");
      const total = meta ? meta.total : 0;
      const done = getProgress(m.id).length;
      const status = moduleStatus(m.id, total);
      const statusText = status === "done" ? "SELESAI" : status === "progress" ? `${done}/${total} tugas` : "BELUM MULAI";
      return `<a class="rack-card" href="${BASE}pages/${m.page}">
        <div class="rc-top">
          <span class="rc-num">${m.port}</span>
          <span class="led ${status === "off" ? "" : status}"></span>
        </div>
        <h3>${m.num} — ${m.label}</h3>
        <p>${m.desc}</p>
        <span class="rc-status">${statusText}</span>
      </a>`;
    }).join("");
    return `<div class="folder-section">
      <div class="folder-section-head"><span class="fsh-icon">📁</span> ${fo.label} <i>${fo.title}</i></div>
      <div class="rack-grid">${cards}</div>
    </div>`;
  }).join("");
}

/* ---------------- Terminal boot animation on hero ---------------- */
function bootTerminal(targetSelector, lines, opts = {}) {
  const el = document.querySelector(targetSelector);
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    el.innerHTML = lines.map(l => `<div>${l.text.replace(/</g, "&lt;")}</div>`).join("");
    return;
  }
  let i = 0;
  function typeLine() {
    if (i >= lines.length) {
      el.insertAdjacentHTML("beforeend", `<span class="cursor"></span>`);
      return;
    }
    const line = lines[i];
    const div = document.createElement("div");
    el.appendChild(div);
    let c = 0;
    const speed = line.speed || 18;
    const timer = setInterval(() => {
      div.innerHTML = (line.cls ? `<span class="${line.cls}">` : "") +
        line.text.slice(0, c).replace(/</g, "&lt;") +
        (line.cls ? `</span>` : "");
      c++;
      if (c > line.text.length) {
        clearInterval(timer);
        i++;
        setTimeout(typeLine, line.pause || 220);
      }
    }, speed);
  }
  typeLine();
}

/* ---------------- Page bootstrap helper ---------------- */
function initPage(activeId) {
  document.body.dataset.active = activeId;
  renderShell(activeId);
  initTabs();
}

/* ---------------- Ambient background FX ---------------- */
function injectBackgroundFX() {
  if (document.querySelector(".bg-fx")) return;
  const fx = document.createElement("div");
  fx.className = "bg-fx";
  fx.innerHTML = `
    <div class="bg-blob b1"></div>
    <div class="bg-blob b2"></div>
    <div class="bg-blob b3"></div>
    <div class="bg-scan"></div>`;
  // insert right after the grid-veil (or as first child) so it stays behind content
  const veil = document.querySelector(".grid-veil");
  if (veil && veil.parentNode) veil.parentNode.insertBefore(fx, veil.nextSibling);
  else document.body.insertBefore(fx, document.body.firstChild);
}

/* ---------------- Scroll-to-top button ---------------- */
function injectScrollTop() {
  if (document.querySelector(".scroll-top")) return;
  const btn = document.createElement("button");
  btn.className = "scroll-top";
  btn.type = "button";
  btn.setAttribute("aria-label", "Kembali ke atas");
  btn.textContent = "↑";
  document.body.appendChild(btn);
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  window.addEventListener("scroll", () => {
    btn.classList.toggle("show", window.scrollY > 480);
  }, { passive: true });
}

/* ---------------- Skip-to-content link (keyboard / screen reader a11y) ---------------- */
function injectSkipLink() {
  if (document.querySelector(".skip-link")) return;
  const a = document.createElement("a");
  a.className = "skip-link";
  a.href = "#main-content";
  a.textContent = "Lompat ke konten utama";
  document.body.insertBefore(a, document.body.firstChild);
}

document.addEventListener("DOMContentLoaded", () => {
  injectSkipLink();
  injectBackgroundFX();
  injectScrollTop();
  renderTopProgress();
});
