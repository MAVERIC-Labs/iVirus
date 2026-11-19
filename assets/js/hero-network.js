// Animated "virus network" background for the home hero.
// A canvas port of the workshop depth-loop animation: clusters of nodes drift
// a few pixels while a slow depth wave sweeps across, so regions sharpen and
// recede. Everything is periodic (36 s), so it loops without a seam.
(function () {
  var canvas = document.querySelector("[data-hero-net]");
  if (!canvas || !canvas.getContext) return;
  var hero = canvas.parentElement, ctx = canvas.getContext("2d");
  var PERIOD = 36000, TAU = Math.PI * 2;
  var COLORS = ["#0f9d8f", "#4f5bd5", "#e8960c", "#d6457a", "#2b8bd1", "#5a9e3a"];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, dpr = 1, nodes = [], edges = [], blobs = [], running = false, visible = true, last = 0;

  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function build() {
    var r = rng(20261113);
    W = hero.clientWidth; H = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    nodes = []; edges = []; blobs = [];
    var nClusters = Math.max(6, Math.min(30, Math.round(W * H / 30000)));
    var centers = [];
    for (var c = 0; c < nClusters; c++) {            // best-candidate sampling: even spread
      var best = null, bestD = -1;
      for (var k = 0; k < 14; k++) {
        var x = r() * W, y = r() * H, d = 1e9;
        for (var j = 0; j < centers.length; j++) d = Math.min(d, Math.hypot(x - centers[j].x, y - centers[j].y));
        if (d > bestD) { bestD = d; best = { x: x, y: y }; }
      }
      centers.push(best);
    }
    centers.forEach(function (ctr, ci) {
      var n = 7 + Math.floor(r() * 9), spread = 38 + r() * 46, first = nodes.length;
      var phase = ctr.x / W * TAU + (r() - 0.5) * 1.6;
      for (var i = 0; i < n; i++) {
        var a = r() * TAU, rad = i === 0 ? 0 : spread * (0.3 + 0.9 * Math.sqrt(r()));
        nodes.push({ x: ctr.x + Math.cos(a) * rad, y: ctr.y + Math.sin(a) * rad * 0.8, r: i === 0 ? 4.2 : 1.6 + r() * 1.6,
          col: ci % COLORS.length, ph: phase + (r() - 0.5) * 0.5, amp: 3 + r() * 5, k: r() < 0.5 ? 1 : 2, p1: r() * TAU, p2: r() * TAU, cl: ci });
      }
      for (var i2 = first + 1; i2 < nodes.length; i2++) {
        if (r() < 0.55) edges.push([first, i2, ci % COLORS.length]);
        var near = [];                                  // plus one or two nearest neighbours
        for (var j2 = first; j2 < nodes.length; j2++) if (j2 !== i2) near.push([Math.hypot(nodes[i2].x - nodes[j2].x, nodes[i2].y - nodes[j2].y), j2]);
        near.sort(function (p, q) { return p[0] - q[0]; });
        edges.push([i2, near[0][1], ci % COLORS.length]);
        if (r() < 0.5 && near[1]) edges.push([i2, near[1][1], ci % COLORS.length]);
      }
    });
    centers.forEach(function (ctr, ci) {              // sparse grey links between neighbouring clusters
      if (r() > 0.6) return;
      var bj = -1, bd = 1e9;
      centers.forEach(function (o, oj) { var d = Math.hypot(ctr.x - o.x, ctr.y - o.y); if (oj !== ci && d < bd) { bd = d; bj = oj; } });
      var a = nodes.filter(function (n) { return n.cl === ci; }), b = nodes.filter(function (n) { return n.cl === bj; });
      edges.push([nodes.indexOf(a[Math.floor(r() * a.length)]), nodes.indexOf(b[Math.floor(r() * b.length)]), -1]);
    });
    var nBlobs = Math.round(W * H / 22000);
    for (var q = 0; q < nBlobs; q++) blobs.push({ x: r() * W, y: r() * H, r: 5 + r() * 8, ph: r() * TAU, amp: 4 + r() * 6, p1: r() * TAU });
  }

  function isDark() {
    var b = document.body.classList, h = document.documentElement.classList;
    if (b.contains("theme-dark")) return true;
    if (b.contains("theme-light")) return false;
    return h.contains("theme-dark");
  }

  // Keep the network quiet behind the headline: faint on the left, full on the right.
  function calm(x) {
    if (W < 700) return 0.38;
    var u = (x / W - 0.30) / 0.30; u = u < 0 ? 0 : u > 1 ? 1 : u;
    return 0.22 + 0.78 * u * u * (3 - 2 * u);
  }

  function draw(now) {
    var t = (now % PERIOD) / PERIOD * TAU, dark = isDark(), i, n;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    for (i = 0; i < blobs.length; i++) {
      var b = blobs[i], bx = b.x + Math.sin(t + b.p1) * b.amp, by = b.y + Math.cos(t + b.p1) * b.amp;
      var bd = 0.5 + 0.5 * Math.sin(t - b.ph), g = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
      var ba = (0.10 + 0.30 * bd) * calm(bx) * (dark ? 0.8 : 1);
      g.addColorStop(0, "rgba(100,116,139," + ba + ")"); g.addColorStop(1, "rgba(100,116,139,0)");
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, b.r, 0, TAU); ctx.fill();
    }
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.cx = n.x + Math.sin(t * n.k + n.p1) * n.amp;
      n.cy = n.y + Math.cos(t * n.k + n.p2) * n.amp;
      n.d = 0.5 + 0.5 * Math.sin(t - n.ph);
    }
    for (i = 0; i < edges.length; i++) {
      var e = edges[i], p = nodes[e[0]], q = nodes[e[1]], d = (p.d + q.d) / 2;
      ctx.globalAlpha = (0.08 + 0.55 * d) * calm((p.cx + q.cx) / 2) * (e[2] < 0 ? 0.6 : 1);
      ctx.strokeStyle = e[2] < 0 ? (dark ? "#8493ad" : "#94a3b8") : COLORS[e[2]];
      ctx.lineWidth = 0.5 + 0.9 * d;
      ctx.beginPath(); ctx.moveTo(p.cx, p.cy); ctx.lineTo(q.cx, q.cy); ctx.stroke();
    }
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      ctx.globalAlpha = (0.14 + 0.86 * n.d) * calm(n.cx);
      ctx.fillStyle = COLORS[n.col];
      ctx.beginPath(); ctx.arc(n.cx, n.cy, n.r * (0.75 + 0.5 * n.d), 0, TAU); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    if (!running) return;
    if (now - last > 32) { last = now; draw(now); }   // ~30 fps is plenty for this
    requestAnimationFrame(frame);
  }
  function update() {
    var want = visible && !document.hidden && !reduce;
    if (want && !running) { running = true; requestAnimationFrame(frame); }
    else if (!want) running = false;
  }

  build(); hero.classList.add("has-net");
  draw(PERIOD * 0.3);
  if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; update(); }).observe(hero);
  document.addEventListener("visibilitychange", update);
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { build(); draw(performance.now()); }, 150); });
  update();
})();
