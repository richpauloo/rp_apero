// Voronoi Engine
(function() {
  'use strict';

  var VP = {
    count: 72,
    speed: 0.6,
    fillOpacity: 0.4,
    strokeOpacity: 0.9,
    strokeWidth: 1.2,
    colorSpeedMul: 1.4,
    cellInset: 4.0,
    shadowBlur: 0,
    opacityVariation: 0,
    palette: 'terrain'
  };

  var voronoiPalettes = {
    terrain: [
      { pos: 0.0, color: [30, 58, 95] },
      { pos: 0.2, color: [37, 99, 165] },
      { pos: 0.35, color: [45, 138, 122] },
      { pos: 0.5, color: [80, 165, 130] },
      { pos: 0.65, color: [143, 188, 143] },
      { pos: 0.8, color: [192, 187, 148] },
      { pos: 1.0, color: [212, 197, 169] }
    ],
    weather: weatherPalette,
    ocean: [
      { pos: 0.0, color: [10, 30, 60] },
      { pos: 0.25, color: [20, 70, 130] },
      { pos: 0.5, color: [40, 130, 170] },
      { pos: 0.75, color: [90, 190, 200] },
      { pos: 1.0, color: [170, 225, 230] }
    ],
    sunset: [
      { pos: 0.0, color: [40, 20, 60] },
      { pos: 0.2, color: [120, 40, 90] },
      { pos: 0.4, color: [200, 60, 60] },
      { pos: 0.6, color: [240, 140, 50] },
      { pos: 0.8, color: [250, 200, 80] },
      { pos: 1.0, color: [255, 240, 180] }
    ],
    forest: [
      { pos: 0.0, color: [20, 40, 25] },
      { pos: 0.25, color: [35, 80, 50] },
      { pos: 0.5, color: [70, 140, 80] },
      { pos: 0.75, color: [140, 180, 100] },
      { pos: 1.0, color: [200, 210, 150] }
    ]
  };

  function getVoronoiPalette() {
    return voronoiPalettes[VP.palette] || voronoiPalettes.terrain;
  }

  var voronoiCanvas = document.getElementById('voronoiCanvas');
  var voronoiCtx = voronoiCanvas.getContext('2d');
  var VORONOI_BG = '#FAFAF5';

  var voronoiW, voronoiH;
  var voronoiPoints = [];
  var vMouseX = -1000, vMouseY = -1000;
  var vMouseIn = false;
  var voronoiStartTime = performance.now();
  var prevVoronoiCount = VP.count;

  function createVoronoiPoint(x, y) {
    var angle = Math.random() * Math.PI * 2;
    return {
      x: x, y: y,
      vx: Math.cos(angle) * VP.speed,
      vy: Math.sin(angle) * VP.speed,
      colorOffset: Math.random() * Math.PI * 2,
      colorSpeed: 0.0003 + Math.random() * 0.0005,
      colorVal: Math.random(),
      opacityOffset: Math.random()
    };
  }

  function initPoints() {
    voronoiPoints = [];
    for (var i = 0; i < VP.count; i++) {
      voronoiPoints.push(createVoronoiPoint(Math.random() * voronoiW, Math.random() * voronoiH));
    }
    prevVoronoiCount = VP.count;
  }

  function resizeVoronoi() {
    var dpr = window.devicePixelRatio || 1;
    voronoiW = voronoiCanvas.clientWidth;
    voronoiH = voronoiCanvas.clientHeight;
    voronoiCanvas.width = voronoiW * dpr;
    voronoiCanvas.height = voronoiH * dpr;
    voronoiCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function syncVoronoiCount() {
    if (VP.count !== prevVoronoiCount) {
      while (voronoiPoints.length < VP.count) {
        voronoiPoints.push(createVoronoiPoint(Math.random() * voronoiW, Math.random() * voronoiH));
      }
      if (voronoiPoints.length > VP.count) voronoiPoints.length = VP.count;
      prevVoronoiCount = VP.count;
    }
  }

  function updateVoronoiPoints(time) {
    for (var i = 0; i < voronoiPoints.length; i++) {
      var p = voronoiPoints[i];
      var mag = Math.sqrt(p.vx * p.vx + p.vy * p.vy) || 1;
      var moveX = p.vx / mag * VP.speed;
      var moveY = p.vy / mag * VP.speed;

      p.x += moveX;
      p.y += moveY;

      if (p.x < 0) { p.x = 0; p.vx = Math.abs(p.vx); }
      if (p.x > voronoiW) { p.x = voronoiW; p.vx = -Math.abs(p.vx); }
      if (p.y < 0) { p.y = 0; p.vy = Math.abs(p.vy); }
      if (p.y > voronoiH) { p.y = voronoiH; p.vy = -Math.abs(p.vy); }

      p.colorVal = 0.5 + 0.5 * Math.sin(time * p.colorSpeed * VP.colorSpeedMul + p.colorOffset);
    }
  }

  function insetPolygon(cell, amount) {
    var n = cell.length - 1;
    var cx = 0, cy = 0;
    for (var i = 0; i < n; i++) { cx += cell[i][0]; cy += cell[i][1]; }
    cx /= n; cy /= n;

    var result = [];
    for (var i = 0; i < cell.length; i++) {
      var dx = cell[i][0] - cx;
      var dy = cell[i][1] - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var shrink = dist > 0 ? Math.max(0, dist - amount) / dist : 0;
      result.push([cx + dx * shrink, cy + dy * shrink]);
    }
    return result;
  }

  function renderVoronoi(time) {
    voronoiCtx.fillStyle = VORONOI_BG;
    voronoiCtx.fillRect(0, 0, voronoiW, voronoiH);

    syncVoronoiCount();

    var coords = [];
    var colorVals = [];

    for (var i = 0; i < voronoiPoints.length; i++) {
      coords.push(voronoiPoints[i].x, voronoiPoints[i].y);
      colorVals.push(voronoiPoints[i].colorVal);
    }

    if (vMouseIn) {
      coords.push(vMouseX, vMouseY);
      colorVals.push(0.5 + 0.5 * Math.sin(time * 0.001));
    }

    var numPts = coords.length / 2;
    if (numPts < 3) return;

    var delaunay = d3.Delaunay.from({ length: numPts }, function(_, i) { return coords[i * 2]; }, function(_, i) { return coords[i * 2 + 1]; });
    var voronoi = delaunay.voronoi([0, 0, voronoiW, voronoiH]);
    var pal = getVoronoiPalette();

    for (var i = 0; i < numPts; i++) {
      var cell = voronoi.cellPolygon(i);
      if (!cell) continue;

      if (VP.cellInset > 0) {
        cell = insetPolygon(cell, VP.cellInset);
      }

      var rgb = lerpColor(colorVals[i], pal);

      var fillAlpha = VP.fillOpacity;
      if (VP.opacityVariation > 0 && i < voronoiPoints.length) {
        fillAlpha *= (1 - VP.opacityVariation * voronoiPoints[i].opacityOffset);
      }

      if (VP.shadowBlur > 0) {
        voronoiCtx.shadowBlur = VP.shadowBlur;
        voronoiCtx.shadowColor = colorToRgba(rgb, 0.3);
      }

      voronoiCtx.beginPath();
      voronoiCtx.moveTo(cell[0][0], cell[0][1]);
      for (var j = 1; j < cell.length; j++) {
        voronoiCtx.lineTo(cell[j][0], cell[j][1]);
      }
      voronoiCtx.closePath();
      voronoiCtx.fillStyle = colorToRgba(rgb, fillAlpha);
      voronoiCtx.fill();

      voronoiCtx.shadowBlur = 0;
      voronoiCtx.strokeStyle = colorToRgba(rgb, VP.strokeOpacity);
      voronoiCtx.lineWidth = VP.strokeWidth;
      voronoiCtx.stroke();
    }
  }

  function animateVoronoi(timestamp) {
    if (!window.voronoiAnimating) return;
    var time = timestamp - voronoiStartTime;
    updateVoronoiPoints(time);
    renderVoronoi(time);
    requestAnimationFrame(animateVoronoi);
  }

  // Mouse/touch events
  voronoiCanvas.addEventListener('mousemove', function(e) {
    var rect = voronoiCanvas.getBoundingClientRect();
    vMouseX = e.clientX - rect.left;
    vMouseY = e.clientY - rect.top;
  });
  voronoiCanvas.addEventListener('mouseenter', function() { vMouseIn = true; });
  voronoiCanvas.addEventListener('mouseleave', function() { vMouseIn = false; });
  voronoiCanvas.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var rect = voronoiCanvas.getBoundingClientRect();
    vMouseX = e.touches[0].clientX - rect.left;
    vMouseY = e.touches[0].clientY - rect.top;
    vMouseIn = true;
  }, { passive: false });
  voronoiCanvas.addEventListener('touchend', function() { vMouseIn = false; });

  // Wire controls
  function wireVoronoiSlider(id, key, fmt) {
    var input = document.getElementById('vc-' + id);
    var display = document.getElementById('vv-' + id);
    if (!input || !display) return;
    input.addEventListener('input', function() {
      VP[key] = parseFloat(input.value);
      display.textContent = fmt(VP[key]);
    });
  }

  wireVoronoiSlider('count', 'count', function(v) { return v.toFixed(0); });
  wireVoronoiSlider('speed', 'speed', function(v) { return v.toFixed(2); });
  wireVoronoiSlider('fill', 'fillOpacity', function(v) { return v.toFixed(2); });
  wireVoronoiSlider('stroke', 'strokeOpacity', function(v) { return v.toFixed(2); });
  wireVoronoiSlider('strokew', 'strokeWidth', function(v) { return v.toFixed(1); });
  wireVoronoiSlider('cspeed', 'colorSpeedMul', function(v) { return v.toFixed(1) + 'x'; });
  wireVoronoiSlider('inset', 'cellInset', function(v) { return v.toFixed(1); });
  wireVoronoiSlider('shadow', 'shadowBlur', function(v) { return v.toFixed(0); });
  wireVoronoiSlider('opvar', 'opacityVariation', function(v) { return v.toFixed(2); });

  var palSelect = document.getElementById('vc-palette');
  if (palSelect) palSelect.addEventListener('change', function(e) { VP.palette = e.target.value; });

  // Export
  window.Voronoi = {
    VP: VP,
    resize: resizeVoronoi,
    initPoints: initPoints,
    animate: animateVoronoi,
    points: function() { return voronoiPoints; },
    setStartTime: function(t) { voronoiStartTime = t; },
    getW: function() { return voronoiW; },
    getH: function() { return voronoiH; }
  };
})();
