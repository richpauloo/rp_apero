// ============================================================
// shared.js — Content data, simplex noise, color utilities
// ============================================================

// --- Content Data (from Hugo site) ---
const gardenItems = [
  // BLOG POSTS
  {
    type: 'blog',
    title: 'Text analysis of the Mueller Report',
    date: '2019-04-19',
    description: 'Sentiment analysis of the Mueller Report reveals it is incredibly negative. A simple text mining approach using R.',
    tags: ['sentiment-analysis', 'text-mining', 'R'],
    stage: 'budding',
    slug: '/blog/mueller/'
  },
  {
    type: 'blog',
    title: 'Reflections on RStudio::conf2018',
    date: '2018-02-07',
    description: 'Reflections on attending RStudio::conf2018 — packages, perseverance, possibility, and community.',
    tags: ['R', 'conference'],
    stage: 'evergreen',
    slug: '/blog/reflect-rstudio-2018/'
  },
  {
    type: 'blog',
    title: 'Link a custom domain to Github Pages with HTTPS',
    date: '2019-11-15',
    description: 'Host a personal or project page on GitHub Pages with custom domains and HTTPS configuration.',
    tags: ['github-pages', 'web-hosting', 'tutorial'],
    stage: 'budding',
    slug: '/blog/gh-custom-url/'
  },
  {
    type: 'blog',
    title: 'Using tidytext to make word clouds',
    date: '2017-12-29',
    description: 'Make word clouds in R using the tidytext package and a research prospectus as example text.',
    tags: ['R', 'text-mining', 'data-viz'],
    stage: 'budding',
    slug: '/blog/word-cloud/'
  },
  {
    type: 'blog',
    title: 'A water quality portal for California',
    date: '2020-11-20',
    description: 'A "weather app for water quality" enabling users to check public drinking water quality in California.',
    tags: ['water', 'open-data', 'web-app'],
    stage: 'evergreen',
    slug: '/blog/cawdc-2019/'
  },
  {
    type: 'blog',
    title: 'Install RStudio Server on Microsoft Azure',
    date: '2020-11-14',
    description: 'Step-by-step guide to installing R and RStudio Server on an Azure Virtual Machine.',
    tags: ['R', 'Azure', 'cloud', 'tutorial'],
    stage: 'budding',
    slug: '/blog/azure/'
  },
  {
    type: 'blog',
    title: 'Aquifer thickness from ~300,000 well logs',
    date: '2018-03-15',
    description: 'Data visualization from hundreds of thousands of well completion reports reveals aquifer characteristics.',
    tags: ['R', 'spatial', 'water', 'data-viz'],
    stage: 'evergreen',
    slug: '/blog/aquifer-thickness/'
  },
  {
    type: 'blog',
    title: 'Reflections on the 2018 CA Water Data Challenge',
    date: '2018-10-11',
    description: 'Lessons learned: less is more, listen, respect your limits. Process over product.',
    tags: ['water', 'data-science'],
    stage: 'evergreen',
    slug: '/blog/reflect-cawdc-2018/'
  },
  {
    type: 'blog',
    title: 'Automate SMS with R, Twilio, Docker & GitHub Actions',
    date: '2023-01-29',
    description: 'Deploy a Docker container running R that sends SMS via Twilio API, orchestrated with GitHub Actions.',
    tags: ['R', 'Docker', 'automation'],
    stage: 'budding',
    slug: '/blog/docker-github-actions/'
  },
  {
    type: 'blog',
    title: 'Using Twilio to text myself after long running jobs',
    date: '2019-09-11',
    description: 'Text yourself from R using Twilio so you can leave the computer while jobs run.',
    tags: ['R', 'Twilio', 'automation'],
    stage: 'budding',
    slug: '/blog/textme/'
  },
  {
    type: 'blog',
    title: 'Tidy chi-squared stats in infer',
    date: '2018-02-03',
    description: 'Using the infer package for tidy chi-squared hypothesis testing in R.',
    tags: ['R', 'statistics', 'tidyverse'],
    stage: 'evergreen',
    slug: '/blog/infer/'
  },
  {
    type: 'blog',
    title: 'Race to the Bottom: Groundwater extraction in California',
    date: '2019-09-11',
    description: 'Average well depth has more than doubled since 1940. An analysis of the sustainable groundwater crisis.',
    tags: ['water', 'groundwater', 'California'],
    stage: 'evergreen',
    slug: '/blog/race-to-the-bottom/'
  },
  {
    type: 'blog',
    title: 'Parquet, SQL, DuckDB, arrow, dbplyr and R',
    date: '2021-11-06',
    description: 'Columnar Parquet files for efficient big data. Query with dbplyr and DuckDB from R.',
    tags: ['R', 'data-engineering', 'parquet'],
    stage: 'budding',
    slug: '/blog/parquet/'
  },
  {
    type: 'blog',
    title: 'Reproducible data science with R, RStudio Server & Docker',
    date: '2023-01-28',
    description: 'Docker is to environments as git is to code. Set up and share an R development environment.',
    tags: ['R', 'Docker', 'reproducibility'],
    stage: 'budding',
    slug: '/blog/docker-rstudio/'
  },
  {
    type: 'blog',
    title: 'Installing the R kernel in Jupyter Lab',
    date: '2018-05-16',
    description: 'Step-by-step guide to install the R kernel in Jupyter Lab on Windows and Mac.',
    tags: ['R', 'Jupyter', 'tutorial'],
    stage: 'budding',
    slug: '/blog/jupyter/'
  },
  {
    type: 'blog',
    title: 'Automating R scripts on Linux with cron',
    date: '2020-01-21',
    description: 'Automate R scripts on Linux with cron task scheduler. Set up crontabs for timed execution.',
    tags: ['R', 'Linux', 'automation'],
    stage: 'budding',
    slug: '/blog/cron/'
  },

  // PROJECTS
  {
    type: 'project',
    title: 'calwaterquality.com',
    date: '2019-10-30',
    description: 'Automated water quality reports for 3,000+ CA public water systems. Winner, 2019 CA Water Data Challenge.',
    tags: ['water', 'web', 'open-data'],
    stage: 'evergreen',
    slug: '/project/cawdc-2019/'
  },
  {
    type: 'project',
    title: 'Tulare Basin TDS',
    date: '2017-08-27',
    description: 'Groundwater quality data visualization for the Tulare Basin.',
    tags: ['water', 'data-viz'],
    stage: 'budding',
    slug: '/project/tulare-tds/'
  },
  {
    type: 'project',
    title: 'MTAccessibility',
    date: '2025-01-16',
    description: 'Accessibility analysis of NYC\'s MTA subway system. Ridership patterns among seniors and low-income riders.',
    tags: ['transportation', 'equity', 'NYC'],
    stage: 'seedling',
    slug: '/project/mta/'
  },
  {
    type: 'project',
    title: 'Interpretable Random Forests',
    date: '2019-10-30',
    description: 'Watch a forest grow tree by tree alongside cumulative variable importance.',
    tags: ['machine-learning', 'data-viz'],
    stage: 'budding',
    slug: '/project/rf/'
  },
  {
    type: 'project',
    title: 'gspdrywells.netlify.app',
    date: '2021-01-21',
    description: 'Domestic well failure prediction and cost estimates in critically overdrafted basins.',
    tags: ['water', 'groundwater', 'web'],
    stage: 'evergreen',
    slug: '/project/gspdrywells/'
  },
  {
    type: 'project',
    title: 'r4wrds',
    date: '2021-07-28',
    description: 'R for Water Resources Data Science. Open-source textbook and course.',
    tags: ['education', 'R', 'open-source'],
    stage: 'evergreen',
    slug: '/project/r4wrds/'
  },
  {
    type: 'project',
    title: 'AbstR',
    date: '2016-04-27',
    description: 'Interactive exploration of 30,000 AGU abstracts. An adaptation of PapR.',
    tags: ['text-analysis', 'web', 'Shiny'],
    stage: 'budding',
    slug: '/project/abstr/'
  },
  {
    type: 'project',
    title: 'Low Cost Sensor Networks',
    date: '2019-12-30',
    description: 'Real-time sensor networks and dashboards for environmental monitoring under California\'s SGMA.',
    tags: ['water', 'sensors', 'IoT'],
    stage: 'evergreen',
    slug: '/project/lcsn/'
  },
  {
    type: 'project',
    title: 'textme',
    date: '2019-10-30',
    description: 'R package to text yourself when long running jobs complete. Wraps Twilio API.',
    tags: ['R-package', 'automation'],
    stage: 'budding',
    slug: '/project/textme/'
  },
  {
    type: 'project',
    title: 'CA Well Reports',
    date: '2017-05-27',
    description: 'Exploratory data analysis of California\'s Online State Well Completion Report Database.',
    tags: ['water', 'California', 'data-science'],
    stage: 'budding',
    slug: '/project/oswcr-eda/'
  },
  {
    type: 'project',
    title: 'Fatal Landslide Prediction',
    date: '2017-04-27',
    description: 'Random forests, boosting, LDA, and QDA for global landslide classification.',
    tags: ['machine-learning', 'geospatial'],
    stage: 'budding',
    slug: '/project/landslides/'
  },

  // KEY PUBLICATIONS
  {
    type: 'publication',
    title: 'Domestic Well Vulnerability to Drought Duration and Unsustainable Groundwater Management',
    date: '2020-06-01',
    description: 'Examines vulnerability of domestic wells in California\'s Central Valley. Environmental Research Letters.',
    tags: ['groundwater', 'drought', 'peer-reviewed'],
    stage: 'evergreen',
    slug: '#'
  },
  {
    type: 'publication',
    title: 'Anthropogenic Basin Closure and Groundwater Salinization (ABCSAL)',
    date: '2020-09-01',
    description: 'Framework for understanding groundwater salinization in closed basins. Journal of Hydrology.',
    tags: ['groundwater', 'hydrology', 'peer-reviewed'],
    stage: 'evergreen',
    slug: '#'
  },
  {
    type: 'publication',
    title: 'Thousands of wells face failure despite groundwater reform',
    date: '2023-03-01',
    description: 'Well failure risks in Central Valley despite SGMA. Nature Scientific Reports.',
    tags: ['groundwater', 'policy', 'peer-reviewed'],
    stage: 'evergreen',
    slug: '#'
  },
  {
    type: 'publication',
    title: 'Mean Flow Direction Modulates Non-Fickian Transport',
    date: '2021-04-01',
    description: 'Contaminant transport in complex aquifer systems. Water Resources Research.',
    tags: ['groundwater', 'hydrology', 'peer-reviewed'],
    stage: 'evergreen',
    slug: '#'
  },
  {
    type: 'publication',
    title: 'Low-Cost Wireless Sensor Network for Groundwater Monitoring',
    date: '2020-01-01',
    description: 'Open-source sensor network for real-time groundwater monitoring. Water journal.',
    tags: ['sensors', 'open-source', 'peer-reviewed'],
    stage: 'evergreen',
    slug: '#'
  }
];

// --- Simplex Noise (2D) ---
// Based on Stefan Gustavson's implementation
class SimplexNoise {
  constructor(seed = Math.random()) {
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    this.perm = new Uint8Array(512);
    this.gradP = new Array(512);
    this.seed(seed);
  }

  seed(seed) {
    if (seed > 0 && seed < 1) seed *= 65536;
    seed = Math.floor(seed);
    if (seed < 256) seed |= seed << 8;
    const p = new Uint8Array(256);
    for (let i = 0; i < 256; i++) {
      let v;
      if (i & 1) {
        v = this.xorShift(seed, i) & 255;
      } else {
        v = (this.xorShift(seed, i) >> 8) & 255;
      }
      p[i] = v;
    }
    for (let i = 0; i < 512; i++) {
      this.perm[i] = p[i & 255];
      this.gradP[i] = this.grad3[this.perm[i] % 12];
    }
  }

  xorShift(seed, i) {
    let x = seed ^ (i * 2654435761);
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    return x;
  }

  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    let n0, n1, n2;
    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; }
    else { i1 = 0; j1 = 1; }
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.gradP[ii + this.perm[jj]];
    const gi1 = this.gradP[ii + i1 + this.perm[jj + j1]];
    const gi2 = this.gradP[ii + 1 + this.perm[jj + 1]];
    let t0 = 0.5 - x0*x0 - y0*y0;
    if (t0 < 0) n0 = 0;
    else { t0 *= t0; n0 = t0 * t0 * (gi0[0]*x0 + gi0[1]*y0); }
    let t1 = 0.5 - x1*x1 - y1*y1;
    if (t1 < 0) n1 = 0;
    else { t1 *= t1; n1 = t1 * t1 * (gi1[0]*x1 + gi1[1]*y1); }
    let t2 = 0.5 - x2*x2 - y2*y2;
    if (t2 < 0) n2 = 0;
    else { t2 *= t2; n2 = t2 * t2 * (gi2[0]*x2 + gi2[1]*y2); }
    return 70 * (n0 + n1 + n2);
  }
}

// --- Color Utilities ---
const weatherPalette = [
  { pos: 0.0,  color: [123, 47, 190] },  // Purple #7B2FBE
  { pos: 0.17, color: [37, 99, 235] },   // Blue #2563EB
  { pos: 0.33, color: [6, 182, 212] },   // Cyan #06B6D4
  { pos: 0.5,  color: [16, 185, 129] },  // Green #10B981
  { pos: 0.67, color: [234, 179, 8] },   // Yellow #EAB308
  { pos: 0.83, color: [249, 115, 22] },  // Orange #F97316
  { pos: 1.0,  color: [239, 68, 68] }    // Red #EF4444
];

function lerpColor(t, palette = weatherPalette) {
  t = Math.max(0, Math.min(1, t));
  for (let i = 0; i < palette.length - 1; i++) {
    if (t >= palette[i].pos && t <= palette[i + 1].pos) {
      const localT = (t - palette[i].pos) / (palette[i + 1].pos - palette[i].pos);
      const c1 = palette[i].color;
      const c2 = palette[i + 1].color;
      return [
        Math.round(c1[0] + (c2[0] - c1[0]) * localT),
        Math.round(c1[1] + (c2[1] - c1[1]) * localT),
        Math.round(c1[2] + (c2[2] - c1[2]) * localT)
      ];
    }
  }
  return palette[palette.length - 1].color;
}

function colorToRgba(rgb, alpha = 1) {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function colorToHex(rgb) {
  return '#' + rgb.map(c => c.toString(16).padStart(2, '0')).join('');
}

// --- Growth Stage Utilities ---
const stageConfig = {
  seedling: { label: 'Seedling', emoji: '\u{1F331}', color: '#06B6D4' },
  budding:  { label: 'Budding',  emoji: '\u{1F33F}', color: '#EAB308' },
  evergreen:{ label: 'Evergreen',emoji: '\u{1F332}', color: '#10B981' }
};

function getStageInfo(stage) {
  return stageConfig[stage] || stageConfig.seedling;
}

// --- Content Helpers ---
function getItemsByType(type) {
  return gardenItems.filter(item => item.type === type);
}

function getItemsByStage(stage) {
  return gardenItems.filter(item => item.stage === stage);
}

function sortByDate(items, desc = true) {
  return [...items].sort((a, b) => {
    const da = new Date(a.date), db = new Date(b.date);
    return desc ? db - da : da - db;
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

// --- Responsive Helpers ---
function isMobile() {
  return window.innerWidth < 768;
}

function isTablet() {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}
