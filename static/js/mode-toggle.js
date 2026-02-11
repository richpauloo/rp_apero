// Mode toggle, theme switching, nav scroll
(function() {
  'use strict';

  var isHomepage = document.body.classList.contains('page-home');

  // Theme from localStorage
  var savedMode = localStorage.getItem('siteMode') || 'flow';

  // Apply theme class
  function applyTheme(mode) {
    if (mode === 'voronoi') {
      document.body.className = document.body.className.replace(/theme-\w+/, 'theme-light');
    } else {
      document.body.className = document.body.className.replace(/theme-\w+/, 'theme-dark');
    }
  }

  // On inner pages, apply theme and wire up light/dark toggle
  if (!isHomepage) {
    applyTheme(savedMode);

    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      function updateThemeIcon() {
        var isDark = document.body.className.indexOf('theme-dark') !== -1;
        themeToggle.querySelector('.theme-icon').textContent = isDark ? '\u2600' : '\u263E';
        themeToggle.title = isDark ? 'Switch to light' : 'Switch to dark';
      }
      updateThemeIcon();

      themeToggle.addEventListener('click', function() {
        var isDark = document.body.className.indexOf('theme-dark') !== -1;
        var newMode = isDark ? 'voronoi' : 'flow';
        localStorage.setItem('siteMode', newMode);
        applyTheme(newMode);
        updateThemeIcon();
      });
    }
  }

  // Homepage mode switching
  if (isHomepage) {
    window.activeMode = savedMode;
    window.flowAnimating = (savedMode === 'flow');
    window.voronoiAnimating = false;
    var voronoiInitialized = false;
    var flowNeedsResize = false;
    var voronoiNeedsResize = false;

    var heroEl = document.getElementById('hero');
    var flowCanvas = document.getElementById('flowCanvas');
    var voronoiCanvas = document.getElementById('voronoiCanvas');
    var flowControlsEl = document.getElementById('flowControls');
    var voronoiControlsEl = document.getElementById('voronoiControls');
    var modeToggle = document.getElementById('modeToggle');

    function switchToFlow() {
      window.activeMode = 'flow';
      localStorage.setItem('siteMode', 'flow');
      document.body.className = 'page-home theme-dark';
      heroEl.style.background = '#050816';

      flowCanvas.style.display = 'block';
      voronoiCanvas.style.display = 'none';

      if (flowControlsEl) flowControlsEl.style.display = '';
      if (voronoiControlsEl) voronoiControlsEl.style.display = 'none';

      window.voronoiAnimating = false;
      if (flowNeedsResize) {
        window.FlowField.resize();
        window.FlowField.initParticles();
        flowNeedsResize = false;
      }
      window.flowAnimating = true;
      window.FlowField.animate();
    }

    function switchToVoronoi() {
      window.activeMode = 'voronoi';
      localStorage.setItem('siteMode', 'voronoi');
      document.body.className = 'page-home theme-light';
      heroEl.style.background = '#FAFAF5';

      flowCanvas.style.display = 'none';
      voronoiCanvas.style.display = 'block';

      if (flowControlsEl) flowControlsEl.style.display = 'none';
      if (voronoiControlsEl) voronoiControlsEl.style.display = '';

      window.flowAnimating = false;
      if (!voronoiInitialized || voronoiNeedsResize) {
        window.Voronoi.resize();
        if (!voronoiInitialized) window.Voronoi.initPoints();
        voronoiInitialized = true;
        voronoiNeedsResize = false;
      }
      window.voronoiAnimating = true;
      window.Voronoi.setStartTime(performance.now());
      requestAnimationFrame(function(ts) { window.Voronoi.animate(ts); });
    }

    // Set initial toggle state
    if (modeToggle) {
      modeToggle.querySelectorAll('.mode-btn').forEach(function(btn) {
        btn.classList.toggle('active', btn.dataset.mode === savedMode);
      });

      modeToggle.addEventListener('click', function(e) {
        var btn = e.target.closest('.mode-btn');
        if (!btn || btn.dataset.mode === window.activeMode) return;
        modeToggle.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        if (btn.dataset.mode === 'flow') {
          switchToFlow();
        } else {
          switchToVoronoi();
        }
      });
    }

    // Initialize
    if (savedMode === 'voronoi') {
      // Start in voronoi mode
      document.body.className = 'page-home theme-light';
      heroEl.style.background = '#FAFAF5';
      flowCanvas.style.display = 'none';
      voronoiCanvas.style.display = 'block';
      if (flowControlsEl) flowControlsEl.style.display = 'none';
      if (voronoiControlsEl) voronoiControlsEl.style.display = '';

      window.FlowField.resize();
      window.FlowField.initParticles();
      // Don't animate flow

      window.Voronoi.resize();
      window.Voronoi.initPoints();
      voronoiInitialized = true;
      window.voronoiAnimating = true;
      window.Voronoi.setStartTime(performance.now());
      requestAnimationFrame(function(ts) { window.Voronoi.animate(ts); });
    } else {
      // Start in flow mode (default)
      window.FlowField.resize();
      window.FlowField.initParticles();
      window.flowAnimating = true;
      window.FlowField.animate();
    }

    // Pause/resume animation when hero leaves/enters viewport (saves battery, prevents scroll artifacts)
    if ('IntersectionObserver' in window) {
      var heroObserver = new IntersectionObserver(function(entries) {
        var visible = entries[0].isIntersecting;
        if (window.activeMode === 'flow') {
          if (visible && !window.flowAnimating) {
            window.flowAnimating = true;
            window.FlowField.animate();
          } else if (!visible && window.flowAnimating) {
            window.flowAnimating = false;
          }
        } else {
          if (visible && !window.voronoiAnimating) {
            window.voronoiAnimating = true;
            window.Voronoi.setStartTime(performance.now());
            requestAnimationFrame(function(ts) { window.Voronoi.animate(ts); });
          } else if (!visible && window.voronoiAnimating) {
            window.voronoiAnimating = false;
          }
        }
      }, { threshold: 0 });
      heroObserver.observe(heroEl);
    }

    // Resize handler
    window.addEventListener('resize', function() {
      if (window.activeMode === 'flow') {
        window.FlowField.resize();
        window.FlowField.initParticles();
        voronoiNeedsResize = true;
      } else {
        window.Voronoi.resize();
        var pts = window.Voronoi.points();
        var vw = window.Voronoi.getW();
        var vh = window.Voronoi.getH();
        for (var j = 0; j < pts.length; j++) {
          pts[j].x = Math.min(pts[j].x, vw);
          pts[j].y = Math.min(pts[j].y, vh);
        }
        flowNeedsResize = true;
      }
    });

    // Control panel toggle (gear icon)
    var ctrlToggle = document.getElementById('ctrlToggle');
    var ctrlPanel = document.getElementById('ctrlPanel');
    if (ctrlToggle && ctrlPanel) {
      ctrlToggle.addEventListener('click', function() { ctrlPanel.classList.toggle('open'); });
    }
  }

  // Nav scroll effect (all pages)
  var nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', function() {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // Mobile hamburger menu (all pages)
  var hamburger = document.getElementById('navHamburger');
  var mobileMenu = document.getElementById('navMobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();
