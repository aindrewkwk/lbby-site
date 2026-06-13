// ── Nav scroll effect ──────────────────────────────────────────────
const nav = document.getElementById('nav') || document.querySelector('.nav');

window.addEventListener('scroll', () => {
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Active nav link based on scroll position ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveLink() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active');
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// ── Close mobile nav on link click ─────────────────────────────────
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) navLinks.classList.remove('open');
  });
});

// ── Scroll-triggered animations ────────────────────────────────────
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim-fade-up').forEach(el => {
  animObserver.observe(el);
});

// ── Smooth scroll for anchor links ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', href);
    }
  });
});

// ── Docs sidebar active state on scroll ────────────────────────────
const docsLinks = document.querySelectorAll('.docs-sidebar a');
const docsSections = [];

docsLinks.forEach(link => {
  const href = link.getAttribute('href');
  if (href && href.startsWith('#')) {
    const section = document.querySelector(href);
    if (section) docsSections.push({ link, section });
  }
});

if (docsSections.length > 0) {
  const docsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        docsLinks.forEach(l => l.classList.remove('active'));
        const match = docsSections.find(s => s.section === entry.target);
        if (match) match.link.classList.add('active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px -60% 0px' });

  docsSections.forEach(s => docsObserver.observe(s.section));
}

// ── i18n ───────────────────────────────────────────────────────────
const DOWNLOAD_ICON = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>';

const LBBY_I18N = {
  vi: {
    "meta.title": "Lbby — Trình quản lý máy chủ Minecraft bởi R Studio",
    "meta.description": "Lbby — Trình quản lý máy chủ Minecraft hiện đại. Cài đặt, quản lý và chia sẻ — tất cả trong một ứng dụng gốc. Không cần mở cổng mạng, không cần terminal.",
    "nav.features": "Tính năng",
    "nav.download": "Tải về",
    "nav.docs": "Tài liệu",
    "nav.changelog": "Nhật ký",
    "nav.license": "Giấy phép",
    "hero.badge": "bởi R Studio",
    "hero.title": "Máy chủ Minecraft<br><span class=\"gradient\">trở nên đơn giản</span>",
    "hero.subtitle": "Tạo và chạy máy chủ Minecraft Java mà không cần mở cổng mạng, dùng dòng lệnh hay cấu hình router. Cài đặt, quản lý và chia sẻ — tất cả trong một ứng dụng máy tính.",
    "hero.download": `${DOWNLOAD_ICON} Tải miễn phí`,
    "hero.learn": "Tìm hiểu thêm",
    "features.label": "Tính năng",
    "features.title": "Tất cả những gì bạn cần",
    "features.subtitle": "Từ con số không đến máy chủ đang chạy chỉ trong chưa đầy một phút. Không cần terminal, không cần file cấu hình, không phiền phức.",
    "feature.server.title": "11 loại máy chủ",
    "feature.server.body": "Vanilla, Paper, Folia, Purpur, Bukkit, Spigot, Forge, Fabric, NeoForge, SpongeVanilla và SpongeForge — tất cả trong trình hướng dẫn cài đặt.",
    "feature.play.title": "Chơi mọi nơi",
    "feature.play.body": "Tích hợp playit.gg tunnel để bạn bè có thể tham gia từ bất kỳ đâu. Không cần mở cổng mạng hay IP tĩnh.",
    "feature.players.title": "Quản lý người chơi",
    "feature.players.body": "Xem inventory, máu, XP, hiệu ứng. Kill, heal, freeze, đổi gamemode, give item — toàn quyền quản trị.",
    "feature.mods.title": "Mod & Plugin",
    "feature.mods.body": "Duyệt Modrinth, cài mod/plugin, hỗ trợ modpack (Modrinth + CurseForge) và kiểm tra cập nhật tự động.",
    "feature.remote.title": "Điều khiển từ xa",
    "feature.remote.body": "Quản lý máy chủ từ điện thoại hoặc máy tính khác. LAN + Cloudflare Quick Tunnel với xác thực token bảo mật.",
    "feature.backups.title": "Sao lưu",
    "feature.backups.body": "Tạo backup ZIP, khôi phục từ backup và lên lịch sao lưu tự động. Không bao giờ mất thế giới của bạn nữa.",
    "feature.performance.title": "Hiệu suất",
    "feature.performance.body": "Preset tối ưu JVM, theo dõi TPS, tạo trước chunk và dashboard tùy chỉnh với đồng hồ vòng trực tiếp.",
    "feature.console.title": "Console trực tiếp",
    "feature.console.body": "Console máy chủ thời gian thực với ô nhập lệnh. Theo dõi player, TPS, RAM, CPU và disk từ dashboard.",
    "feature.theme.title": "Chế độ sáng & tối",
    "feature.theme.body": "Giao diện đẹp với theme sáng/tối. Hỗ trợ tiếng Anh và tiếng Việt.",
    "download.label": "Tải về",
    "download.title": "Tải Lbby",
    "download.subtitle": "Miễn phí sử dụng. Có sẵn cho Windows, macOS và Linux.",
    "download.loading": "Đang tải phiên bản...",
    "download.all": "Xem tất cả phiên bản trên GitHub",
    "download.beta": "<strong style=\"color: var(--yellow);\">⚠ Beta:</strong> Ứng dụng hiện chưa được ký số. Trên macOS: nhấp chuột phải → Open → Open. Trên Windows: More info → Run anyway.",
    "download.your_system": "← Hệ của bạn",
    "download.button": "Tải .{ext} · {size}",
    "download.not_available": "Chưa có",
    "download.failed": "Không tải được danh sách phiên bản. ",
    "download.view_github": "Xem trên GitHub",
    "platform.windows.note": "Windows 10/11, 64-bit",
    "platform.macos.note": "Apple Silicon & Intel",
    "platform.linux.note": "deb / AppImage / rpm",
    "docs.label": "Tài liệu",
    "docs.title": "Bắt đầu",
    "docs.subtitle": "Từ tải app đến máy chủ đầu tiên chỉ trong vài phút.",
    "docs.nav.quick": "Bắt đầu nhanh",
    "docs.nav.types": "Loại máy chủ",
    "docs.nav.players": "Quản lý người chơi",
    "docs.nav.mods": "Mod & Plugin",
    "docs.nav.backups": "Sao lưu",
    "docs.nav.performance": "Hiệu suất",
    "docs.nav.playit": "playit.gg",
    "docs.quick.title": "Bắt đầu nhanh",
    "docs.quick.1": "Tải và cài đặt Lbby cho hệ điều hành của bạn",
    "docs.quick.2": "Mở Lbby — trình hướng dẫn sẽ dẫn bạn từng bước",
    "docs.quick.3": "Chọn loại máy chủ: <strong>Paper</strong> (khuyên dùng), <strong>Fabric</strong>, <strong>Forge</strong>, v.v.",
    "docs.quick.4": "Chọn phiên bản Minecraft và loader/build nếu cần",
    "docs.quick.5": "Đặt tên máy chủ, thư mục, RAM và số người chơi tối đa",
    "docs.quick.6": "Nhấn <strong>Install Server</strong>",
    "docs.quick.7": "Mở Dashboard và nhấn <strong>Start</strong>",
    "docs.quick.8": "Mở tab <strong>Tunnel</strong> và khởi động playit.gg",
    "docs.quick.9": "Chia sẻ địa chỉ tunnel công khai cho bạn bè",
    "docs.quick.done": "<strong>Vậy là xong:</strong> cài đặt → khởi động → tunnel → chia sẻ.",
    "docs.types.title": "Loại máy chủ",
    "docs.types.intro": "Lbby hỗ trợ 11 loại máy chủ:",
    "docs.types.paper": "<strong>Paper</strong> — Máy chủ tối ưu có hỗ trợ plugin. Phù hợp nhất cho đa số server.",
    "docs.types.fabric": "<strong>Fabric</strong> — Mod loader nhẹ, hiện đại. Rất hợp với các mod tối ưu hiệu suất.",
    "docs.types.forge": "<strong>Forge</strong> — Mod loader kinh điển với hệ sinh thái mod lớn nhất.",
    "docs.types.purpur": "<strong>Purpur</strong> — Bản fork giàu tính năng của Paper với nhiều tùy chỉnh.",
    "docs.types.folia": "<strong>Folia</strong> — Bản fork đa luồng của Paper cho server lớn.",
    "docs.types.neoforge": "<strong>NeoForge</strong> — Bản fork hiện đại của Forge.",
    "docs.types.bukkit": "<strong>Bukkit / Spigot</strong> — API plugin server gốc.",
    "docs.types.sponge": "<strong>SpongeVanilla / SpongeForge</strong> — Máy chủ Sponge API.",
    "docs.types.vanilla": "<strong>Vanilla</strong> — Minecraft thuần, không mod/plugin.",
    "docs.players.title": "Quản lý người chơi",
    "docs.players.intro": "Nhấn vào người chơi online để mở chi tiết:",
    "docs.players.stats": "<strong>Stats</strong> — Máu, thức ăn, thanh XP, gamemode, vị trí, hiệu ứng đang có",
    "docs.players.inventory": "<strong>Inventory</strong> — Xem vật phẩm, give item, xóa item, ender chest",
    "docs.players.actions": "<strong>Actions</strong> — Kill, heal, feed, freeze, spectate, gamemode, xóa hiệu ứng, đặt XP",
    "docs.players.ops": "OP/de-OP, kick, ban/unban và teleport từ danh sách người chơi",
    "docs.mods.title": "Mod & Plugin",
    "docs.mods.modpacks": "<strong>Modpack</strong> — Cài Modrinth <code>.mrpack</code>, dán link hoặc tải lên CurseForge <code>.zip</code>",
    "docs.mods.browse": "<strong>Duyệt mod</strong> — Tìm trên Modrinth và cài trực tiếp",
    "docs.mods.updates": "<strong>Cập nhật</strong> — Kiểm tra và cập nhật mod an toàn",
    "docs.mods.resources": "<strong>Resource Pack</strong> — Thêm, liệt kê, xóa server resource pack",
    "docs.backups.title": "Sao lưu",
    "docs.backups.1": "Tạo backup ZIP thủ công cho server",
    "docs.backups.2": "Khôi phục từ backup trước đó",
    "docs.backups.3": "Lên lịch sao lưu tự động",
    "docs.performance.title": "Mẹo hiệu suất",
    "docs.performance.1": "Dùng <strong>Settings → Performance → Low CPU</strong> nếu CPU tăng cao",
    "docs.performance.2": "Luôn bật <strong>Optimized JVM flags</strong>",
    "docs.performance.3": "Giảm <strong>View Distance</strong> xuống 6–8",
    "docs.performance.4": "Dùng <strong>Pre-generate Chunks</strong> trước khi người chơi khám phá xa",
    "docs.playit.title": "Khắc phục playit.gg",
    "docs.playit.1": "Dashboard hiển thị server đang <strong>Online</strong>",
    "docs.playit.2": "Tab Tunnel hiển thị playit.gg đang chạy",
    "docs.playit.3": "Cổng local khớp <code>server-port</code> trong <code>server.properties</code> (thường là <code>25565</code>)",
    "docs.playit.4": "Dùng đúng địa chỉ Lbby hiển thị, bao gồm cả port nếu có",
    "changelog.label": "Nhật ký",
    "changelog.title": "Có gì mới",
    "changelog.subtitle": "Các phiên bản và cập nhật gần đây.",
    "changelog.loading": "Đang tải nhật ký...",
    "changelog.all": "Xem tất cả phiên bản",
    "changelog.failed": "Không tải được nhật ký.",
    "changelog.empty": "Không có ghi chú phiên bản.",
    "footer.copy": "© 2026 R Studio. Mọi quyền được bảo lưu."
  },
  en: {
    "meta.title": "Lbby — Minecraft Server Host by R Studio",
    "meta.description": "Lbby — A modern Minecraft server host. Install, manage, and share — all from one native app. No port forwarding, no terminal.",
    "nav.features": "Features",
    "nav.download": "Download",
    "nav.docs": "Docs",
    "nav.changelog": "Changelog",
    "nav.license": "License",
    "hero.badge": "by R Studio",
    "hero.title": "Minecraft servers<br><span class=\"gradient\">made simple</span>",
    "hero.subtitle": "Host Minecraft Java servers without port forwarding, command-line work, or router configuration. Install, manage, and share — all from one native app.",
    "hero.download": `${DOWNLOAD_ICON} Download Free`,
    "hero.learn": "Learn More",
    "features.label": "Features",
    "features.title": "Everything you need",
    "features.subtitle": "From zero to a running server in under a minute. No terminal, no config files, no headaches.",
    "feature.server.title": "11 Server Types",
    "feature.server.body": "Vanilla, Paper, Folia, Purpur, Bukkit, Spigot, Forge, Fabric, NeoForge, SpongeVanilla, and SpongeForge — all from a guided setup wizard.",
    "feature.play.title": "Play Anywhere",
    "feature.play.body": "Built-in playit.gg tunnel so friends can join from anywhere. No port forwarding or static IP needed.",
    "feature.players.title": "Player Management",
    "feature.players.body": "View player inventory, health, XP, effects. Kill, heal, freeze, gamemode, give items — full admin control.",
    "feature.mods.title": "Mods & Plugins",
    "feature.mods.body": "Browse Modrinth, install mods & plugins, modpack support (Modrinth + CurseForge), and automatic update checker.",
    "feature.remote.title": "Remote Control",
    "feature.remote.body": "Manage your server from your phone or another PC. LAN + Cloudflare Quick Tunnel with secure token authentication.",
    "feature.backups.title": "Backups",
    "feature.backups.body": "Create ZIP backups, restore from backups, and schedule automatic backups. Never lose your world again.",
    "feature.performance.title": "Performance",
    "feature.performance.body": "JVM optimization presets, TPS monitoring, chunk pre-generation, and customizable dashboard with live ring meters.",
    "feature.console.title": "Live Console",
    "feature.console.body": "Real-time server console with command input. Monitor players, TPS, RAM, CPU, and disk from the dashboard.",
    "feature.theme.title": "Dark & Light Mode",
    "feature.theme.body": "Beautiful UI with dark and light themes. English and Vietnamese language support.",
    "download.label": "Download",
    "download.title": "Get Lbby",
    "download.subtitle": "Free to use. Available for Windows, macOS, and Linux.",
    "download.loading": "Loading releases...",
    "download.all": "View All Releases on GitHub",
    "download.beta": "<strong style=\"color: var(--yellow);\">⚠ Beta:</strong> The app is unsigned. On macOS: right-click → Open → Open. On Windows: More info → Run anyway.",
    "download.your_system": "← Your system",
    "download.button": "Download .{ext} · {size}",
    "download.not_available": "Not available",
    "download.failed": "Failed to load releases. ",
    "download.view_github": "View on GitHub",
    "platform.windows.note": "Windows 10/11, 64-bit",
    "platform.macos.note": "Apple Silicon & Intel",
    "platform.linux.note": "deb / AppImage / rpm",
    "docs.label": "Documentation",
    "docs.title": "Getting Started",
    "docs.subtitle": "From download to your first server in minutes.",
    "docs.nav.quick": "Quick Start",
    "docs.nav.types": "Server Types",
    "docs.nav.players": "Player Management",
    "docs.nav.mods": "Mods & Plugins",
    "docs.nav.backups": "Backups",
    "docs.nav.performance": "Performance",
    "docs.nav.playit": "playit.gg",
    "docs.quick.title": "Quick Start",
    "docs.quick.1": "Download and install Lbby for your platform",
    "docs.quick.2": "Open Lbby — the setup wizard will guide you",
    "docs.quick.3": "Pick a server type: <strong>Paper</strong> (recommended), <strong>Fabric</strong>, <strong>Forge</strong>, etc.",
    "docs.quick.4": "Choose a Minecraft version and loader/build version if needed",
    "docs.quick.5": "Set your server name, folder, RAM, and max players",
    "docs.quick.6": "Click <strong>Install Server</strong>",
    "docs.quick.7": "Open the Dashboard and click <strong>Start</strong>",
    "docs.quick.8": "Open the <strong>Tunnel</strong> tab and start playit.gg",
    "docs.quick.9": "Share the public tunnel address with friends",
    "docs.quick.done": "<strong>That's it:</strong> install → start → tunnel → share.",
    "docs.types.title": "Server Types",
    "docs.types.intro": "Lbby supports 11 server types:",
    "docs.types.paper": "<strong>Paper</strong> — Optimized server with plugin support. Best for most servers.",
    "docs.types.fabric": "<strong>Fabric</strong> — Lightweight modern mod loader. Great for performance mods.",
    "docs.types.forge": "<strong>Forge</strong> — Classic mod loader with the largest mod ecosystem.",
    "docs.types.purpur": "<strong>Purpur</strong> — Feature-rich Paper fork with extra customization.",
    "docs.types.folia": "<strong>Folia</strong> — Multithreaded Paper fork for massive servers.",
    "docs.types.neoforge": "<strong>NeoForge</strong> — Modern fork of Forge.",
    "docs.types.bukkit": "<strong>Bukkit / Spigot</strong> — Original plugin API servers.",
    "docs.types.sponge": "<strong>SpongeVanilla / SpongeForge</strong> — Sponge API servers.",
    "docs.types.vanilla": "<strong>Vanilla</strong> — Pure Minecraft, no mods or plugins.",
    "docs.players.title": "Player Management",
    "docs.players.intro": "Click any online player to open the detail modal:",
    "docs.players.stats": "<strong>Stats</strong> — Health, food, XP bars, gamemode, position, active effects",
    "docs.players.inventory": "<strong>Inventory</strong> — View items, give items, remove items, ender chest",
    "docs.players.actions": "<strong>Actions</strong> — Kill, heal, feed, freeze, spectate, gamemode, clear effects, set XP",
    "docs.players.ops": "OP/de-OP, kick, ban/unban, and teleport from the player list",
    "docs.mods.title": "Mods & Plugins",
    "docs.mods.modpacks": "<strong>Modpacks</strong> — Install Modrinth <code>.mrpack</code>, paste a link, or upload CurseForge <code>.zip</code>",
    "docs.mods.browse": "<strong>Browse Mods</strong> — Search Modrinth and install directly",
    "docs.mods.updates": "<strong>Updates</strong> — Check for mod updates, update safely",
    "docs.mods.resources": "<strong>Resource Packs</strong> — Add, list, remove server resource packs",
    "docs.backups.title": "Backups",
    "docs.backups.1": "Create manual ZIP backups of your server",
    "docs.backups.2": "Restore from any previous backup",
    "docs.backups.3": "Schedule automatic backups",
    "docs.performance.title": "Performance Tips",
    "docs.performance.1": "Use <strong>Settings → Performance → Low CPU</strong> if CPU spikes",
    "docs.performance.2": "Keep <strong>Optimized JVM flags</strong> enabled",
    "docs.performance.3": "Lower <strong>View Distance</strong> to 6–8",
    "docs.performance.4": "Use <strong>Pre-generate Chunks</strong> before players explore far",
    "docs.playit.title": "playit.gg Troubleshooting",
    "docs.playit.1": "Dashboard shows the server is <strong>Online</strong>",
    "docs.playit.2": "Tunnel tab shows playit.gg is running",
    "docs.playit.3": "Local port matches <code>server-port</code> in <code>server.properties</code> (usually <code>25565</code>)",
    "docs.playit.4": "Use the exact address shown by Lbby, including port if shown",
    "changelog.label": "Changelog",
    "changelog.title": "What's new",
    "changelog.subtitle": "Recent releases and updates.",
    "changelog.loading": "Loading changelog...",
    "changelog.all": "View All Releases",
    "changelog.failed": "Failed to load changelog.",
    "changelog.empty": "No release notes.",
    "footer.copy": "© 2026 R Studio. All rights reserved."
  }
};

function t(key, vars = {}) {
  const dict = LBBY_I18N[getLang()] || LBBY_I18N.en;
  let value = dict[key] ?? LBBY_I18N.en[key] ?? key;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.replaceAll(`{${name}}`, replacement);
  }
  return value;
}

window.lbbyT = t;

function getLang() {
  return localStorage.getItem("lbby-lang") || "en";
}

function setLang(lang) {
  localStorage.setItem("lbby-lang", lang);
  document.documentElement.lang = lang;
  document.title = LBBY_I18N[lang]["meta.title"];
  const description = document.querySelector('meta[name="description"]');
  if (description) description.setAttribute('content', LBBY_I18N[lang]["meta.description"]);
  const label = document.getElementById('lang-label');
  if (label) label.textContent = lang === 'en' ? 'VI' : 'EN';
  const dict = LBBY_I18N[lang];
  if (!dict) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.dispatchEvent(new CustomEvent('lbby:langchange', { detail: { lang } }));
}

function toggleLang() {
  setLang(getLang() === 'en' ? 'vi' : 'en');
}

document.addEventListener('DOMContentLoaded', () => setLang(getLang()));
