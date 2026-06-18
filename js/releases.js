/* ============================================================
   Lbby — GitHub Release Fetcher
   Fetches latest release data from GitHub API
   ============================================================ */
(function() {
  'use strict';

  var REPO = 'aindrewkwk/lbby-releases';
  var API = 'https://api.github.com/repos/' + REPO + '/releases';
  var CACHE_KEY = 'lbby-release-cache';
  var CACHE_TTL = 3600000; // 1 hour

  var latestCache = null;
  var changelogCache = null;

  // ── Platform detection ──────────────────────────────────────
  function detectPlatform() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('win') !== -1) return 'windows';
    if (ua.indexOf('mac') !== -1) return 'macos';
    if (ua.indexOf('linux') !== -1) return 'linux';
    return null;
  }

  // ── Format file size ────────────────────────────────────────
  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // ── Format date ─────────────────────────────────────────────
  function formatDate(iso) {
    var d = new Date(iso);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // ── Find asset for platform ─────────────────────────────────
  function findAsset(assets, platform) {
    if (!assets) return null;
    var patterns = {
      windows: [/\.exe$/i, /\.msi$/i],
      macos: [/aarch64.*\.dmg$/i, /x64.*\.dmg$/i, /\.dmg$/i],
      linux: [/\.deb$/i, /\.AppImage$/i, /\.rpm$/i]
    };
    var pats = patterns[platform] || [];
    for (var i = 0; i < pats.length; i++) {
      for (var j = 0; j < assets.length; j++) {
        if (pats[i].test(assets[j].name)) return assets[j];
      }
    }
    return null;
  }

  // ── Fetch latest release ────────────────────────────────────
  function fetchLatest(callback) {
    if (latestCache) return callback(latestCache);

    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY));
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        latestCache = cached.data;
        return callback(cached.data);
      }
    } catch(e) {}

    var xhr = new XMLHttpRequest();
    xhr.open('GET', API + '?per_page=1', true);
    xhr.setRequestHeader('Accept', 'application/vnd.github+json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var releases = JSON.parse(xhr.responseText);
          if (releases.length > 0) {
            var r = releases[0];
            var data = {
              tag: r.tag_name,
              date: formatDate(r.published_at),
              body: r.body || '',
              url: r.html_url,
              assets: r.assets || []
            };
            latestCache = data;
            try {
              localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data, ts: Date.now() }));
            } catch(e) {}
            callback(data);
          }
        } catch(e) { callback(null); }
      } else { callback(null); }
    };
    xhr.onerror = function() { callback(null); };
    xhr.send();
  }

  // ── Fetch changelog ─────────────────────────────────────────
  function fetchChangelog(callback) {
    if (changelogCache) return callback(changelogCache);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', API + '?per_page=5', true);
    xhr.setRequestHeader('Accept', 'application/vnd.github+json');
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          var releases = JSON.parse(xhr.responseText);
          changelogCache = releases;
          callback(releases);
        } catch(e) { callback([]); }
      } else { callback([]); }
    };
    xhr.onerror = function() { callback([]); };
    xhr.send();
  }

  // ── Render download cards ───────────────────────────────────
  function renderDownloads(release) {
    if (!release) return;

    var platform = detectPlatform();
    var cards = document.querySelectorAll('.download-card');

    cards.forEach(function(card) {
      var p = card.getAttribute('data-platform');
      var asset = findAsset(release.assets, p);

      if (asset) {
        var sizeEl = card.querySelector('.download-card__size');
        var btnEl = card.querySelector('.download-card__btn');
        if (sizeEl) sizeEl.textContent = formatSize(asset.size);
        if (btnEl) btnEl.href = asset.browser_download_url;
      }

      if (p === platform) {
        card.style.borderColor = 'var(--accent-silver)';
      }
    });
  }

  // ── Render changelog (safe DOM methods, no innerHTML) ──────
  function renderChangelog(releases) {
    var container = document.getElementById('changelog-list');
    if (!container || !releases || releases.length === 0) return;

    container.textContent = '';

    releases.forEach(function(r) {
      var item = document.createElement('div');
      item.className = 'changelog-item';

      var header = document.createElement('div');
      header.className = 'changelog-item__header';

      var version = document.createElement('span');
      version.className = 'changelog-item__version';
      version.textContent = r.tag_name || '';

      var date = document.createElement('span');
      date.className = 'changelog-item__date';
      date.textContent = formatDate(r.published_at);

      header.appendChild(version);
      header.appendChild(date);

      var body = document.createElement('div');
      body.className = 'changelog-item__body';
      body.textContent = r.body || '';

      item.appendChild(header);
      item.appendChild(body);
      container.appendChild(item);
    });
  }

  // ── Initialize ──────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    fetchLatest(function(release) {
      renderDownloads(release);
    });

    fetchChangelog(function(releases) {
      renderChangelog(releases);
    });

    // Re-render on language change
    document.addEventListener('lbby:langchange', function() {
      latestCache = null;
      changelogCache = null;
      fetchLatest(function(release) { renderDownloads(release); });
      fetchChangelog(function(releases) { renderChangelog(releases); });
    });
  });
})();
