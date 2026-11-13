/* Guillermo López · Portafolio — interacciones (JS sin dependencias) */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

  /* ---------- Datos de la tira de Proyectos ---------- */
  var PROJECTS = [
    { src: 'img/proyecto-01-dirt-jump.jpg', pos: [0.6, 0.45], name: '[Proyecto 01]', meta: '[Disciplina · Año]', href: null },
    { src: 'img/proyecto-02-paneo.jpg', pos: [0.5, 0.5], name: '[Proyecto 02]', meta: '[Disciplina · Año]', href: null },
    { src: 'img/proyecto-03-berm.jpg', pos: [0.5, 0.55], name: '[Proyecto 03]', meta: '[Disciplina · Año]', href: null },
    { src: 'img/proyecto-04-bosque.jpg', pos: [0.4, 0.4], name: '[Proyecto 04]', meta: '[Disciplina · Año]', href: null },
    { src: 'img/proyecto-05-retrato-casco.jpg', pos: [0.5, 0.25], name: '[Proyecto 05]', meta: '[Disciplina · Año]', href: null },
    { src: 'img/proyecto-06-machetazo.jpg', pos: [0.6, 0.35], name: 'Machetazo', meta: 'Freeride · [Año]', href: 'proyecto-machetazo.html' },
    // Las fotos verticales entran con su proporción real (cuadro más angosto). `ar` solo se usa mientras no hay foto.
    { src: 'img/proyecto-07-viajes-puente.jpg', pos: [0.5, 0.5], ar: 0.667, name: '[Viajes]', meta: 'Street · [Ciudad · Año]', href: null }
  ];

  /* ---------- 1. Rastro de calor detrás del contenido ---------- */
  function initHeat() {
    var main = document.querySelector('main');
    var layer = document.getElementById('heat');
    if (!main || !layer || !canHover || reduce) return;
    var trail = [], target = null, sm = null, last = null, LIFE = 8000;
    main.addEventListener('mousemove', function (e) {
      var r = main.getBoundingClientRect();
      target = { x: e.clientX - r.left, y: e.clientY - r.top };
    });
    setInterval(function () {
      var now = Date.now();
      if (target) {
        if (!sm) sm = { x: target.x, y: target.y };
        sm.x += (target.x - sm.x) * 0.55; sm.y += (target.y - sm.y) * 0.55;
        if (!last || Math.hypot(sm.x - last.x, sm.y - last.y) > 8) {
          last = { x: sm.x, y: sm.y };
          var el = document.createElement('span');
          el.className = 'heat-dot';
          layer.appendChild(el);
          trail.push({ x: sm.x, y: sm.y, t: now, el: el });
          if (trail.length > 260) { var o = trail.shift(); o.el.remove(); }
        }
      }
      trail = trail.filter(function (p) {
        var a = (now - p.t) / LIFE;
        if (a >= 1) { p.el.remove(); return false; }
        var hue = Math.round(30 + a * 190), al = 1 - a, size = Math.round(120 * (1 - a * 0.82));
        var s = p.el.style;
        s.width = s.height = size + 'px';
        s.opacity = Math.min(1, al * 1.4).toFixed(3);
        s.transform = 'translate(' + p.x + 'px,' + p.y + 'px) translate(-50%,-50%)';
        s.background = 'radial-gradient(circle, hsla(' + hue + ',95%,55%,' + (0.85 * al).toFixed(3) + ') 0%, hsla(' + (hue + 20) + ',90%,50%,' + (0.45 * al).toFixed(3) + ') 40%, hsla(' + (hue + 40) + ',90%,50%,0) 70%)';
        return true;
      });
    }, 30);
  }

  /* ---------- 2. Foto que sigue al cursor en Servicios ---------- */
  function initPeek() {
    var box = document.getElementById('srows'), img = document.getElementById('peek');
    if (!box || !img) return;
    var on = false, x = 0, y = 0, rot = 0;
    function paint() {
      img.style.opacity = on ? 1 : 0;
      img.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) scale(' + (on ? 1 : 0.6) + ') rotate(' + (on ? rot : 0) + 'deg)';
    }
    box.addEventListener('mousemove', function (e) { var r = box.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; on = true; paint(); });
    box.addEventListener('mouseleave', function () { on = false; paint(); });
    box.querySelectorAll('.srow').forEach(function (row) {
      row.addEventListener('mouseenter', function () { img.src = row.dataset.peek; rot = parseFloat(row.dataset.rot) || 0; on = true; paint(); });
    });
  }

  /* ---------- 3. Tira horizontal de Proyectos (canvas) ---------- */
  function initRibbon() {
    var track = document.getElementById('trabajo-track'), cv = document.getElementById('ribbon');
    if (!track || !cv) return;
    var nameEl = document.getElementById('cur-name'), metaEl = document.getElementById('cur-meta'), numEl = document.getElementById('cur-num');
    var N = PROJECTS.length;
    PROJECTS.forEach(function (f) { if (f.src) { var im = new Image(); im.src = f.src; f.img = im; } });
    track.style.height = (N - 1) * 70 + 100 + 'vh';

    var tp = 0, cp = 0, ip = 0, ce = 0, lt = 0, sized = false, curIdx = -1;
    var mx = null, my = null, lx = null, ly = null, rot = 0, lensK = -1, hz = [], hzz = [], hk = -1;

    function onScroll() {
      var r = track.getBoundingClientRect(), H = window.innerHeight, total = r.height - H;
      ip = Math.max(0, Math.min(1, (H * 1.05 - r.top) / (H * 0.5)));   // obturador de entrada
      tp = Math.max(0, Math.min(1, -r.top / (total || 1)));           // avance horizontal
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { sized = false; onScroll(); });
    cv.addEventListener('mousemove', function (e) { var r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    cv.addEventListener('mouseleave', function () { mx = null; });
    cv.addEventListener('click', function () { if (hk >= 0 && PROJECTS[hk].href) window.location.href = PROJECTS[hk].href; });
    onScroll();

    function setCurrent(i) {
      if (i === curIdx) return; curIdx = i;
      if (nameEl) nameEl.textContent = PROJECTS[i].name;
      if (metaEl) metaEl.textContent = PROJECTS[i].meta;
      if (numEl) numEl.textContent = String(i + 1).padStart(2, '0');
    }

    function draw() {
      var W = cv.clientWidth, H = cv.clientHeight; if (!W || !H) return;
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      if (!sized || cv.width !== Math.round(W * dpr)) { cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); sized = true; }
      var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';

      var GT = Math.max(16, Math.min(40, W * 0.03)); var FW = Math.min(1600 + 24, W - 2 * GT + 24), BOT = H - 104, FH = Math.min(FW * 0.66, BOT - H * 0.1), GAP = 24;
      var now = performance.now(), dt = Math.min(0.05, ((now - (lt || now)) / 1000) || 0.016); lt = now;
      var damp = 1 - Math.exp(-dt * 3.6);
      ce += (ip - ce) * damp; var ec = Math.max(0, Math.min(1, ce));
      var ee = reduce ? 1 : (ec < 0.5 ? 4 * ec * ec * ec : 1 - Math.pow(-2 * ec + 2, 3) / 2);
      cp += (tp * (N - 1) - cp) * damp;
      setCurrent(Math.max(0, Math.min(N - 1, Math.round(cp))));
      var top = BOT - FH, full = FW - GAP;
      /* Ancho de cada cuadro: horizontales a todo lo ancho, verticales con su proporción real */
      var ws = PROJECTS.map(function (f) { var a = (f.img && f.img.naturalWidth) ? f.img.naturalWidth / f.img.naturalHeight : (f.ar || 1.6); return a < 1.2 ? Math.min(full, FH * a) : full; });
      var xs = [], acc = 0; for (var q = 0; q < N; q++) { xs.push(acc); acc += ws[q] + GAP; }
      var i0 = Math.max(0, Math.min(N - 1, Math.floor(cp))), frc = cp - i0;
      var totalW = xs[N - 1] + ws[N - 1];
      // el cuadro actual se alinea al margen izquierdo; al final la tira se detiene en el margen derecho (sin hueco)
      var off = Math.max(GT - (xs[i0] + (i0 + 1 < N ? (xs[i0 + 1] - xs[i0]) * frc : 0)), Math.min(GT, W - GT - totalW));

      hk = -1;
      if (mx != null && ee > 0.97) {
        for (var kk = 0; kk < N; kk++) { var xx = off + xs[kk]; if (mx >= xx && mx <= xx + ws[kk] && my >= top && my <= top + FH) { hk = kk; break; } }
      }
      cv.style.cursor = hk >= 0 ? 'none' : 'default';
      if (mx != null) { if (lx == null) { lx = mx; ly = my; } lx += (mx - lx) * 0.18; ly += (my - ly) * 0.18; }
      if (hk >= 0) lensK = hk; rot += 0.006;

      for (var k = 0; k < N; k++) {
        hz[k] = (hz[k] || 0) + ((k === hk ? 1 : 0) - (hz[k] || 0)) * 0.12;
        hzz[k] = (hzz[k] || 0) + ((k === hk ? 1 : 0) - (hzz[k] || 0)) * 0.035;
        var x = off + xs[k], w = ws[k];
        if (x > W || x + w < 0) continue;
        var hh = Math.max(1, FH / 2 * ee);
        ctx.save(); ctx.beginPath(); ctx.rect(x, top + FH / 2 - hh, w, hh * 2); ctx.clip();
        var f = PROJECTS[k];
        if (f.img && f.img.complete && f.img.naturalWidth) {
          var iw = f.img.naturalWidth, ih = f.img.naturalHeight, r = Math.max(w / iw, FH / ih);
          var sw = w / r, sh = FH / r, ox = (iw - sw) * f.pos[0], oy = (ih - sh) * f.pos[1];
          var t = hzz[k], he = t * t * (3 - 2 * t), z = 1 + he * 0.025;      // zoom leve al hover
          var ps = 1 + (1 - ee) * 0.12;                                      // asentamiento del obturador
          var zz = z * ps, pw = sw / zz, ph = sh / zz;
          ctx.drawImage(f.img, ox + (sw - pw) / 2, oy + (sh - ph) / 2, pw, ph, x, top, w, FH);
        } else { ctx.fillStyle = '#E4E2DC'; ctx.fillRect(x, top, w, FH); ctx.fillStyle = '#787774'; ctx.font = '13px "Geist Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(f.label || '[Foto]', x + w / 2, top + FH / 2); }
        ctx.restore();
      }

      /* Cursor: anillo con texto girando */
      if (lensK >= 0 && hz[lensK] > 0.01 && lx != null) {
        var e = 1 - Math.pow(1 - hz[lensK], 3), R = 60 * e;
        ctx.save(); ctx.globalCompositeOperation = 'difference';
        ctx.strokeStyle = 'rgba(255,255,255,' + (0.9 * e).toFixed(3) + ')'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(lx, ly, R, 0, Math.PI * 2); ctx.stroke();
        var txt = 'VER PROYECTO · VER PROYECTO · ', TR = R + 14, step = (Math.PI * 2) / txt.length;
        ctx.font = '500 10px "Geist Mono", monospace'; ctx.fillStyle = 'rgba(255,255,255,' + e.toFixed(3) + ')';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (var i = 0; i < txt.length; i++) {
          var ang = rot + i * step - Math.PI / 2;
          ctx.save(); ctx.translate(lx + Math.cos(ang) * TR, ly + Math.sin(ang) * TR); ctx.rotate(ang + Math.PI / 2); ctx.fillText(txt[i], 0, 0); ctx.restore();
        }
        ctx.beginPath(); ctx.arc(lx, ly, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    (function loop() { draw(); requestAnimationFrame(loop); })();
  }

  document.addEventListener('DOMContentLoaded', function () { initHeat(); initPeek(); initRibbon(); });
})();
