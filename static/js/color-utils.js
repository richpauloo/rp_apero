// Color palettes and utilities

const weatherPalette = [
  { pos: 0.0,  color: [123, 47, 190] },
  { pos: 0.17, color: [37, 99, 235] },
  { pos: 0.33, color: [6, 182, 212] },
  { pos: 0.5,  color: [16, 185, 129] },
  { pos: 0.67, color: [234, 179, 8] },
  { pos: 0.83, color: [249, 115, 22] },
  { pos: 1.0,  color: [239, 68, 68] }
];

function lerpColor(t, palette) {
  palette = palette || weatherPalette;
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

function colorToRgba(rgb, alpha) {
  if (alpha === undefined) alpha = 1;
  return 'rgba(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ', ' + alpha + ')';
}
