// SimplexNoise (2D) — Based on Stefan Gustavson's implementation
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
