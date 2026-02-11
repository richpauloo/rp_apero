// Flow Field Engine
(function() {
  'use strict';

  // Parameters
  var FP = {
    particleCount: 3100,
    speed: 1.05,
    size: 1.0,
    opacity: 0.8,
    maxLife: 2000,
    trailAlpha: 0.08,
    noiseScale: 0.0038,
    timeSpeed: 0.0004,
    turbulence: 0.5,
    noiseDetail: 0.5,
    windStrength: 2.0,
    windDirection: 0,
    mouseRadius: 120,
    mouseForce: 4,
    palette: 'weather',
    colorBy: 'position'
  };

  var flowPalettes = {
    weather: weatherPalette,
    terrain: [
      { pos: 0.0, color: [30, 58, 95] },
      { pos: 0.2, color: [37, 99, 165] },
      { pos: 0.4, color: [45, 138, 122] },
      { pos: 0.6, color: [80, 165, 130] },
      { pos: 0.8, color: [143, 188, 143] },
      { pos: 1.0, color: [212, 197, 169] }
    ],
    ocean: [
      { pos: 0.0, color: [10, 20, 50] },
      { pos: 0.25, color: [20, 60, 120] },
      { pos: 0.5, color: [30, 120, 180] },
      { pos: 0.75, color: [80, 180, 210] },
      { pos: 1.0, color: [180, 230, 240] }
    ],
    fire: [
      { pos: 0.0, color: [40, 5, 5] },
      { pos: 0.25, color: [150, 20, 0] },
      { pos: 0.5, color: [230, 80, 10] },
      { pos: 0.75, color: [250, 180, 30] },
      { pos: 1.0, color: [255, 240, 150] }
    ],
    mono: [
      { pos: 0.0, color: [200, 200, 220] },
      { pos: 0.5, color: [140, 140, 170] },
      { pos: 1.0, color: [220, 220, 240] }
    ]
  };

  function getFlowPalette() {
    return flowPalettes[FP.palette] || flowPalettes.weather;
  }

  // Canvas & state
  var flowCanvas = document.getElementById('flowCanvas');
  var flowCtx = flowCanvas.getContext('2d');
  var noise = new SimplexNoise(42);

  var GRID_SIZE = 20;
  var TWO_PI = Math.PI * 2;
  var FLOW_BG = '#050816';
  var FLOW_BG_RGB = [5, 8, 22];

  var flowW, flowH, cols, rows, field;
  var particles = [];
  var flowTime = 0;
  var fMouseX = -9999, fMouseY = -9999;

  function resizeFlow() {
    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var nextW = Math.max(1, Math.round(flowCanvas.clientWidth || window.innerWidth));
    var nextH = Math.max(1, Math.round(flowCanvas.clientHeight || window.innerHeight));
    var pixelW = Math.round(nextW * dpr);
    var pixelH = Math.round(nextH * dpr);
    var prevW = flowW || nextW;
    var prevH = flowH || nextH;

    if (flowCanvas.width === pixelW && flowCanvas.height === pixelH && flowW === nextW && flowH === nextH) {
      return false;
    }

    flowCanvas.width = pixelW;
    flowCanvas.height = pixelH;
    flowCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    flowW = nextW;
    flowH = nextH;
    cols = Math.ceil(flowW / GRID_SIZE) + 1;
    rows = Math.ceil(flowH / GRID_SIZE) + 1;
    field = new Float32Array(cols * rows);

    if (particles.length > 0) {
      var scaleX = flowW / prevW;
      var scaleY = flowH / prevH;
      for (var i = 0; i < particles.length; i++) {
        particles[i].x *= scaleX;
        particles[i].y *= scaleY;
        particles[i].px = particles[i].x;
        particles[i].py = particles[i].y;
      }
    }

    flowCtx.fillStyle = FLOW_BG;
    flowCtx.fillRect(0, 0, flowW, flowH);
    return true;
  }

  function createParticle() {
    var x = Math.random() * flowW;
    var y = Math.random() * flowH;
    return {
      x: x,
      y: y,
      px: x,
      py: y,
      speedFactor: 0.7 + Math.random() * 0.6,
      life: 0
    };
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < FP.particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function updateField() {
    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var nx = col * GRID_SIZE * FP.noiseScale;
        var ny = row * GRID_SIZE * FP.noiseScale;
        var angle = noise.noise2D(nx, ny + flowTime) * TWO_PI * FP.turbulence;
        if (FP.noiseDetail > 0) {
          angle += noise.noise2D(nx * 3, ny * 3 + flowTime * 1.3) * TWO_PI * FP.noiseDetail * 0.4;
        }
        field[row * cols + col] = angle;
      }
    }
  }

  function getFieldAngle(x, y) {
    var col = Math.floor(x / GRID_SIZE);
    var row = Math.floor(y / GRID_SIZE);
    if (col < 0 || col >= cols || row < 0 || row >= rows) return 0;
    return field[row * cols + col];
  }

  function updateAndDrawParticles() {
    while (particles.length < FP.particleCount) particles.push(createParticle());
    if (particles.length > FP.particleCount) particles.length = FP.particleCount;

    var pal = getFlowPalette();
    var windRad = FP.windDirection * Math.PI / 180;
    var windX = Math.cos(windRad) * FP.windStrength;
    var windY = Math.sin(windRad) * FP.windStrength;

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var angle = getFieldAngle(p.x, p.y);
      var spd = FP.speed * p.speedFactor;
      var vx = Math.cos(angle) * spd;
      var vy = Math.sin(angle) * spd;

      vx += windX;
      vy += windY;

      var dx = p.x - fMouseX;
      var dy = p.y - fMouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < FP.mouseRadius && dist > 0) {
        var force = (1 - dist / FP.mouseRadius) * FP.mouseForce;
        vx += (dx / dist) * force;
        vy += (dy / dist) * force;
      }

      p.px = p.x;
      p.py = p.y;
      p.x += vx;
      p.y += vy;
      p.life++;

      if (p.x < -10 || p.x > flowW + 10 || p.y < -10 || p.y > flowH + 10 || p.life > FP.maxLife) {
        particles[i] = createParticle();
        continue;
      }

      var t;
      switch (FP.colorBy) {
        case 'angle':
          t = ((angle % TWO_PI) + TWO_PI) % TWO_PI / TWO_PI;
          break;
        case 'speed':
          t = Math.min(1, Math.sqrt(vx * vx + vy * vy) / (FP.speed * 3));
          break;
        case 'age':
          t = p.life / FP.maxLife;
          break;
        default:
          t = 0.15 + (p.x / flowW) * 0.7;
      }

      var rgb = lerpColor(t, pal);
      var alpha = Math.min(p.life / 20, 1) * FP.opacity;

      flowCtx.beginPath();
      flowCtx.moveTo(p.px, p.py);
      flowCtx.lineTo(p.x, p.y);
      flowCtx.strokeStyle = colorToRgba(rgb, alpha);
      flowCtx.lineWidth = FP.size;
      flowCtx.stroke();
    }
  }

  function animateFlow() {
    if (!window.flowAnimating) return;

    flowCtx.fillStyle = 'rgba(' + FLOW_BG_RGB[0] + ', ' + FLOW_BG_RGB[1] + ', ' + FLOW_BG_RGB[2] + ', ' + FP.trailAlpha + ')';
    flowCtx.fillRect(0, 0, flowW, flowH);

    updateField();
    updateAndDrawParticles();
    flowTime += FP.timeSpeed;

    requestAnimationFrame(animateFlow);
  }

  // Mouse/touch events
  flowCanvas.addEventListener('mousemove', function(e) { fMouseX = e.clientX; fMouseY = e.clientY; });
  flowCanvas.addEventListener('mouseleave', function() { fMouseX = -9999; fMouseY = -9999; });
  var flowIsMobile = window.matchMedia('(max-width: 768px)').matches;
  if (flowIsMobile) {
    // On mobile we prioritize smooth scrolling over touch-driven particle repulsion.
    flowCanvas.addEventListener('touchmove', function() {}, { passive: true });
  } else {
    flowCanvas.addEventListener('touchmove', function(e) {
      if (e.touches.length > 0) { fMouseX = e.touches[0].clientX; fMouseY = e.touches[0].clientY; }
    }, { passive: true });
  }
  flowCanvas.addEventListener('touchend', function() { fMouseX = -9999; fMouseY = -9999; });

  // Wire controls
  function wireFlowSlider(id, key, fmt) {
    var input = document.getElementById('fc-' + id);
    var display = document.getElementById('fv-' + id);
    if (!input || !display) return;
    input.addEventListener('input', function() {
      FP[key] = parseFloat(input.value);
      display.textContent = fmt(FP[key]);
    });
  }

  wireFlowSlider('count', 'particleCount', function(v) { return v.toFixed(0); });
  wireFlowSlider('speed', 'speed', function(v) { return v.toFixed(2); });
  wireFlowSlider('size', 'size', function(v) { return v.toFixed(1); });
  wireFlowSlider('opacity', 'opacity', function(v) { return v.toFixed(2); });
  wireFlowSlider('maxlife', 'maxLife', function(v) { return v.toFixed(0); });
  wireFlowSlider('trail', 'trailAlpha', function(v) { return v.toFixed(3); });
  wireFlowSlider('noise', 'noiseScale', function(v) { return v.toFixed(4); });
  wireFlowSlider('timespeed', 'timeSpeed', function(v) { return v.toFixed(4); });
  wireFlowSlider('turb', 'turbulence', function(v) { return v.toFixed(1); });
  wireFlowSlider('detail', 'noiseDetail', function(v) { return v.toFixed(2); });
  wireFlowSlider('wind', 'windStrength', function(v) { return v.toFixed(2); });
  wireFlowSlider('winddir', 'windDirection', function(v) { return v.toFixed(0) + '\u00B0'; });
  wireFlowSlider('mradius', 'mouseRadius', function(v) { return v.toFixed(0); });
  wireFlowSlider('mforce', 'mouseForce', function(v) { return v.toFixed(1); });

  var palSelect = document.getElementById('fc-palette');
  if (palSelect) palSelect.addEventListener('change', function(e) { FP.palette = e.target.value; });
  var colorBySelect = document.getElementById('fc-colorby');
  if (colorBySelect) colorBySelect.addEventListener('change', function(e) { FP.colorBy = e.target.value; });
  var clearBtn = document.getElementById('fc-clear');
  if (clearBtn) clearBtn.addEventListener('click', function() {
    flowCtx.fillStyle = FLOW_BG;
    flowCtx.fillRect(0, 0, flowW, flowH);
  });

  // Export
  window.FlowField = {
    FP: FP,
    resize: resizeFlow,
    initParticles: initParticles,
    animate: animateFlow
  };
})();
