// Tizen Home Skin — port of the LG webOS home skin (LGtv-Webos-homeskin).
// Same look (wallpaper + big clock + weather + one square-tile row), with the
// platform layer swapped: apps come from the Tizen Application API
// (tizen.application.getAppsInfo) and launch via tizen.application.launch.
(function () {
  'use strict';
  var CONFIG = window.CONFIG || {};

  // ---- Stage scaling: the layout is authored at 1920x1080 ---------------------
  var stage = document.getElementById('stage');
  function fit() {
    var s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit);
  fit();

  // ---- Clock + date ------------------------------------------------------------
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
  var clockEl = document.getElementById('clock');
  var ampmEl = document.getElementById('ampm');
  var dateEl = document.getElementById('date');
  function tick() {
    var d = new Date();
    var h = d.getHours();
    var mm = ('0' + d.getMinutes()).slice(-2);
    clockEl.textContent = (h % 12 || 12) + ':' + mm;
    ampmEl.textContent = h >= 12 ? 'PM' : 'AM';
    dateEl.textContent = DAYS[d.getDay()] + ', ' + d.getDate() + ' ' +
      MONTHS[d.getMonth()] + ' ' + d.getFullYear();
  }
  tick();
  setInterval(tick, 1000);

  // ---- Weather (Open-Meteo, free, no key) ---------------------------------------
  var weatherText = document.getElementById('weatherText');
  var WMO = {
    0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Fog', 51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    56: 'Freezing drizzle', 57: 'Freezing drizzle', 61: 'Rain', 63: 'Rain',
    65: 'Heavy rain', 66: 'Freezing rain', 67: 'Freezing rain', 71: 'Snow',
    73: 'Snow', 75: 'Snow', 77: 'Snow', 80: 'Showers', 81: 'Showers',
    82: 'Showers', 85: 'Snow', 86: 'Snow', 95: 'Thunderstorm',
    96: 'Thunderstorm', 99: 'Thunderstorm'
  };
  function fetchWeather() {
    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + CONFIG.latitude +
      '&longitude=' + CONFIG.longitude +
      '&current=temperature_2m,weather_code' +
      '&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.timeout = 12000;
    xhr.onload = function () {
      try {
        var j = JSON.parse(xhr.responseText);
        var t = Math.round(j.current.temperature_2m);
        var label = WMO[j.current.weather_code] || '';
        var hi = Math.round(j.daily.temperature_2m_max[0]);
        var lo = Math.round(j.daily.temperature_2m_min[0]);
        weatherText.textContent = CONFIG.weatherCity + ' · ' + t + '° ' + label +
          ' · H ' + hi + '° L ' + lo + '°';
      } catch (e) { /* keep the old line */ }
    };
    xhr.send();
  }
  fetchWeather();
  setInterval(fetchWeather, 1800000);

  // ---- Toast ----------------------------------------------------------------------
  var toastEl = document.getElementById('toast');
  var toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.className = 'show';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.className = ''; }, 2600);
  }

  // ---- App tiles ---------------------------------------------------------------------
  var TILE = 168, PITCH = 228, ROW_LEFT = 96;
  var tilesEl = document.getElementById('tiles');
  var items = [];
  var focused = 0;

  function iconFor(app) {
    var name = (app.name || '').toLowerCase();
    var map = CONFIG.iconMap || {};
    for (var key in map) {
      if (name.indexOf(key) >= 0) return map[key];
    }
    return app.iconPath || 'icons/apps.png';
  }

  function focusTile(i) {
    if (!items.length) return;
    if (items[focused]) items[focused].el.classList.remove('focused');
    focused = Math.max(0, Math.min(i, items.length - 1));
    items[focused].el.classList.add('focused');
    // Scroll sideways just enough to keep the focused tile comfortably on screen.
    var x = ROW_LEFT + focused * PITCH;
    var shift = 0;
    if (x < 240) shift = 240 - x;
    if (x + TILE > 1920 - 240) shift = 1920 - 240 - TILE - x;
    var minShift = Math.min(0, 1920 - (ROW_LEFT + items.length * PITCH + 48));
    shift = Math.max(minShift, Math.min(0, shift));
    tilesEl.style.transform = 'translateX(' + shift + 'px)';
  }

  function buildTiles(apps) {
    tilesEl.innerHTML = '';
    items = apps.map(function (app, i) {
      var el = document.createElement('div');
      el.className = 'item';
      el.style.left = (i * PITCH) + 'px';
      var card = document.createElement('div');
      card.className = 'card';
      var img = document.createElement('img');
      img.src = iconFor(app);
      img.alt = '';
      card.appendChild(img);
      var name = document.createElement('div');
      name.className = 'name';
      name.textContent = app.name;
      el.appendChild(card);
      el.appendChild(name);
      tilesEl.appendChild(el);
      return { app: app, el: el };
    });
    focusTile(0);
  }

  function orderApps(apps) {
    var byName = function (a, b) {
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
    };
    var front = [];
    (CONFIG.orderNames || []).forEach(function (want) {
      var i = apps.findIndex(function (a) {
        return a.name.toLowerCase().indexOf(want) >= 0;
      });
      if (i >= 0) front.push(apps.splice(i, 1)[0]);
    });
    apps.sort(byName);
    return front.concat(apps);
  }

  function loadApps() {
    if (!window.tizen || !tizen.application) {
      // Desktop-browser preview: show the curated front row with bundled icons.
      buildTiles([
        { id: '', name: 'YouTube' }, { id: '', name: 'Apple Music' },
        { id: '', name: 'Netflix' }, { id: '', name: 'Apple TV' }
      ]);
      toast('Preview mode — the Tizen API only exists on the TV');
      return;
    }
    var selfId = null;
    try { selfId = tizen.application.getCurrentApplication().appInfo.id; } catch (e) {}
    tizen.application.getAppsInfo(function (apps) {
      var hidden = (CONFIG.hiddenNames || []).map(function (s) { return s.toLowerCase(); });
      var list = apps.filter(function (a) {
        if (!a.name || a.id === selfId) return false;
        var n = a.name.toLowerCase();
        return !hidden.some(function (h) { return n.indexOf(h) >= 0; });
      }).map(function (a) {
        return { id: a.id, name: a.name, iconPath: a.iconPath };
      });
      buildTiles(orderApps(list));
    }, function (e) {
      toast('Could not list apps: ' + e.message);
    });
  }

  function launchFocused() {
    var item = items[focused];
    if (!item || !item.app.id) return;
    tizen.application.launch(item.app.id, function () {}, function (e) {
      toast('Could not open ' + item.app.name + ': ' + e.message);
    });
  }

  // ---- Remote keys ---------------------------------------------------------------------
  document.addEventListener('keydown', function (ev) {
    var k = ev.key || ev.keyCode;
    if (k === 'ArrowLeft' || k === 37) { focusTile(focused - 1); ev.preventDefault(); }
    else if (k === 'ArrowRight' || k === 39) { focusTile(focused + 1); ev.preventDefault(); }
    else if (k === 'Enter' || k === 13) { launchFocused(); ev.preventDefault(); }
    else if (k === 10009 || k === 'Return' || k === 'XF86Back') {
      // Back leaves the launcher; Samsung's Home button always opens Smart Hub
      // and cannot be intercepted by an app.
      try { tizen.application.getCurrentApplication().exit(); } catch (e) {}
    }
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) { tick(); fetchWeather(); loadApps(); }
  });

  loadApps();
})();
