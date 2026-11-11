// drkianmaleki.com — regenerate the typeset equations and the two SVG figures in index.html.
//
//   cd tools && npm install && node build.js
//
// index.html keeps the generated SVG inline between markers such as
//   <!-- generated:EQ1 --> ... <!-- /generated:EQ1 -->
// This script re-renders every marked block from the definitions below and writes
// index.html back. The live site needs no build step: commit the regenerated index.html.
//
// To change an equation, edit its TeX string in EQ. To change Figure 3, edit `rows` in
// timelineSVG(). Then run the command above. Figure 3's ongoing bar ends at the month of
// the build, so a rebuild in a later month changes that block and nothing else.
const fs = require('fs');
const path = require('path');
const INDEX = path.join(__dirname, '..', 'index.html');

const EQ = {
  // numbered equations, all from the PRB paper (main.tex)
  EQ1: { tex: String.raw`\mathcal{H} \;=\; \mathcal{H}_d + \mathcal{H}_e + \mathcal{H}_{ext} \;=\; \sum_{\langle i,j\rangle}\Big\{ D\,\big(3\,(\mathbf{S}_i\!\cdot\!\hat{r})(\mathbf{S}_j\!\cdot\!\hat{r})\big) - D\,\mathbf{S}_i\!\cdot\!\mathbf{S}_j - J_o\,\mathbf{S}_i\!\cdot\!\mathbf{S}_j \Big\} \;-\; \sum_i \frac{g_L\,\mu_B}{\hbar}\,\mathbf{S}_i\!\cdot\!\mathbf{B}_{ext}`,
         alt: 'The Hamiltonian equals the dipolar, exchange and external-field terms: a sum over neighbor pairs of D times 3 (S_i dot r hat)(S_j dot r hat) minus D S_i dot S_j minus J_o S_i dot S_j, minus a sum over sites of g_L mu_B over h-bar times S_i dot B_ext' },
  EQ2: { tex: String.raw`i\,\frac{d}{dt}\,b \;=\; H_{11}\,b + H_{12}\,b^{\dagger}, \qquad i\,\frac{d}{dt}\,b^{\dagger} \;=\; -H_{21}\,b - H_{22}\,b^{\dagger}`,
         alt: 'i d b over dt equals H_11 b plus H_12 b dagger; i d b dagger over dt equals minus H_21 b minus H_22 b dagger' },
  EQ3: { tex: String.raw`\left|\, H - \omega\,\mathcal{I}_{-} \right| \;=\; 0, \qquad \mathcal{I}_{-} = \begin{pmatrix} \mathcal{I} & 0 \\ 0 & -\mathcal{I} \end{pmatrix}`,
         alt: 'the determinant of H minus omega I-minus equals zero, where I-minus is the block-diagonal matrix of identity and minus identity' },
  // the faint field behind the title block (decorative)
  F1: { tex: String.raw`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}` },
  F2: { tex: String.raw`\theta \rightarrow \theta - \eta\,\nabla_{\theta}\mathcal{L}` },
  F3: { tex: String.raw`\hat{H} = \sum_{\mathbf{k}} \hbar\omega_{\mathbf{k}}\, a^{\dagger}_{\mathbf{k}} a_{\mathbf{k}}` },
  F4: { tex: String.raw`\mathrm{softmax}\!\left(\frac{QK^{\top}}{\sqrt{d}}\right)V` },
  F5: { tex: String.raw`O_2^{0} = 3S_z^{2} - S(S+1)` },
  F6: { tex: String.raw`\frac{\partial \mathcal{L}}{\partial W} = \frac{\partial \mathcal{L}}{\partial h}\,\frac{\partial h}{\partial W}` },
  F7: { tex: String.raw`p_\theta(x_{1:T}) = \textstyle\prod_{t=1}^{T} p_\theta(x_t \mid x_{<t})` },
  F8: { tex: String.raw`\sigma(z) = \frac{1}{1+e^{-z}}` },
  F9: { tex: String.raw`D_{\mathrm{KL}}(p\,\|\,q) = \sum_x p(x)\log\frac{p(x)}{q(x)}` },
  F10: { tex: String.raw`p_i \propto e^{-E_i/k_B T}` },
  F11: { tex: String.raw`s^{3} = p^{3}\,(s - b^{\dagger} b)` },
  F12: { tex: String.raw`\mathrm{BS} = \frac{1}{N}\sum_{i=1}^{N}(p_i - y_i)^{2}` },
};

function fmt(n) { return Number(n.toFixed(2)); }

// Figure 2: schematic two-branch magnon dispersion across the first Brillouin zone.
function dispersionSVG() {
  const W = 380, H = 270, L = 44, R = 16, T = 18, B = 44;
  const pw = W - L - R, ph = H - T - B;
  const kmin = -Math.PI, kmax = Math.PI, wmax = 2.0;
  const X = k => L + (k - kmin) / (kmax - kmin) * pw;
  const Y = w => T + ph - (w / wmax) * ph;
  const w1 = k => Math.sqrt(0.3 ** 2 + 1.2 ** 2 * Math.sin(k / 2) ** 2);
  const w2 = k => Math.sqrt(1.7 ** 2 - 0.9 ** 2 * Math.sin(k / 2) ** 2);
  const pathOf = f => {
    let d = '';
    for (let i = 0; i <= 160; i++) {
      const k = kmin + (kmax - kmin) * i / 160;
      d += (i ? ' L' : 'M') + fmt(X(k)) + ' ' + fmt(Y(f(k)));
    }
    return d;
  };
  const grid = [0.5, 1.0, 1.5].map(w =>
    `<line x1="${L}" x2="${L + pw}" y1="${fmt(Y(w))}" y2="${fmt(Y(w))}" stroke="var(--rule)" stroke-width="1"/>`).join('');
  const zone = [kmin, kmax].map(k =>
    `<line x1="${fmt(X(k))}" x2="${fmt(X(k))}" y1="${T}" y2="${T + ph}" stroke="currentColor" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>`).join('');
  const gapY1 = Y(0), gapY2 = Y(w1(0));
  return `<svg class="plot plot--disp" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schematic magnon dispersion: two branches across the Brillouin zone with a gap at k equals zero">
  ${grid}${zone}
  <line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" stroke="currentColor" stroke-width="1"/>
  <line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" stroke="currentColor" stroke-width="1"/>
  <path d="${pathOf(w1)}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="${pathOf(w2)}" fill="none" stroke="var(--accent)" stroke-width="1.6" stroke-linejoin="round"/>
  <line x1="${fmt(X(0))}" x2="${fmt(X(0))}" y1="${fmt(gapY1)}" y2="${fmt(gapY2)}" stroke="var(--accent)" stroke-width="1"/>
  <line x1="${fmt(X(0) - 4)}" x2="${fmt(X(0) + 4)}" y1="${fmt(gapY2)}" y2="${fmt(gapY2)}" stroke="var(--accent)" stroke-width="1"/>
  <text x="${fmt(X(0) + 7)}" y="${fmt((gapY1 + gapY2) / 2 + 4)}" fill="var(--accent)">Δ</text>
  <circle cx="${fmt(X(kmax))}" cy="${fmt(Y(w1(kmax)))}" r="2.6" fill="currentColor"/>
  <circle cx="${fmt(X(kmax))}" cy="${fmt(Y(w2(kmax)))}" r="2.6" fill="var(--accent)"/>
  <text x="${fmt(X(kmin))}" y="${H - 22}" text-anchor="middle">−π/a</text>
  <text x="${fmt(X(0))}" y="${H - 22}" text-anchor="middle">0</text>
  <text x="${fmt(X(kmax))}" y="${H - 22}" text-anchor="middle">π/a</text>
  <text x="${fmt(L + pw / 2)}" y="${H - 6}" text-anchor="middle">k</text>
  <text x="${L - 10}" y="${T + 8}" text-anchor="end" font-style="italic">ħω</text>
  <text x="${L - 10}" y="${T + ph + 4}" text-anchor="end">0</text>
  <text x="${fmt(X(1.4))}" y="${fmt(Y(w1(1.4)) + 18)}" font-size="12.5" opacity=".85">ω₁(k)</text>
  <text x="${fmt(X(1.4))}" y="${fmt(Y(w2(1.4)) - 9)}" font-size="12.5" fill="var(--accent)">ω₂(k)</text>
</svg>`;
}

// Figure 3: positions on a time axis. Dates from master-profile.md: s = first month, e = end of last month,
// written as year + month/12 (Aug 2018 – Aug 2025 is s: 2018 + 7/12, e: 2025 + 8/12).
function timelineSVG() {
  const today = new Date();
  const NOW = today.getFullYear() + (today.getMonth() + 0.5) / 12;   // the ongoing bar ends at the build month
  const rows = [
    { name: 'Independent Researcher · AI automation and LLMs', s: 2025 + 7 / 12, e: NOW, kind: 'solid', ongoing: true },
    { name: 'BlueDot Impact · Technical AI Safety Project', s: 2026 + 7 / 12, e: 2026 + 9 / 12, kind: 'solid' },
    { name: 'Creighton · Resident Assistant Professor', s: 2025 + 7 / 12, e: 2026 + 7 / 12, kind: 'solid' },
    { name: 'TripleTen · AI & ML Program', s: 2025 + 10 / 12, e: 2026 + 4 / 12, kind: 'outline' },
    { name: 'Pfizer / Extern · Document Intelligence', s: 2026 + 3 / 12, e: 2026 + 7 / 12, kind: 'outline' },
    { name: 'Iowa · Graduate Research Assistant', s: 2018 + 7 / 12, e: 2025 + 8 / 12, kind: 'solid' },
    { name: 'Creighton · Graduate Research Assistant', s: 2015 + 7 / 12, e: 2018 + 8 / 12, kind: 'solid' },
  ];
  const x0 = 2015, x1 = Math.max(2027, Math.floor(NOW) + 1);   // the axis gains a year when the calendar does
  const esc = s => s.replace(/&/g, '&amp;');
  const label = 'Positions from 2015 to the present, drawn as bars on a time axis';

  // Wide layout (tablets and up): labels in a column on the left, bars on a shared axis.
  // LAB is the label column: wide enough for the longest label (about 260 units at 11px), with room for a fallback font.
  function wide() {
    const W = 848, LAB = 320, R = 14, T = 14, RH = 26, H = T + rows.length * RH + 34;
    const X = yr => LAB + (yr - x0) / (x1 - x0) * (W - LAB - R);
    const base = T + rows.length * RH;
    let out = `<svg class="plot plot--wide" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">`;
    for (let y = x0; y <= x1; y++) {
      out += `<line x1="${fmt(X(y))}" x2="${fmt(X(y))}" y1="${T}" y2="${base}" stroke="var(--rule)" stroke-width="1"/>`;
      if (y < x1) out += `<text x="${fmt(X(y))}" y="${base + 18}" text-anchor="start" font-size="10.5">${y}</text>`;
    }
    out += `<line x1="${LAB}" x2="${W - R}" y1="${base}" y2="${base}" stroke="currentColor" stroke-width="1"/>`;
    rows.forEach((r, i) => {
      const y = T + i * RH + RH / 2;
      out += `<text x="${LAB - 12}" y="${fmt(y + 4)}" text-anchor="end" font-size="11">${esc(r.name)}</text>`;
      out += bar(r, X, y, 10);
    });
    return out + '</svg>';
  }

  // Compact layout (phones): each label sits above its bar, and the axis spans the full width.
  function compact() {
    const W = 360, L = 2, R = 12, T = 6, RH = 31, H = T + rows.length * RH + 30;
    const X = yr => L + (yr - x0) / (x1 - x0) * (W - L - R);
    const base = T + rows.length * RH + 4;
    let out = `<svg class="plot plot--compact" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">`;
    for (let y = x0; y <= x1; y++) {
      out += `<line x1="${fmt(X(y))}" x2="${fmt(X(y))}" y1="${T}" y2="${base}" stroke="var(--rule)" stroke-width="1"/>`;
      if (y < x1 && (y - x0) % 2 === 0) out += `<text x="${fmt(X(y))}" y="${base + 16}" text-anchor="start" font-size="10">${y}</text>`;
    }
    out += `<line x1="${L}" x2="${W - R}" y1="${base}" y2="${base}" stroke="currentColor" stroke-width="1"/>`;
    rows.forEach((r, i) => {
      const y = T + i * RH;
      out += `<text x="${L + 3}" y="${fmt(y + 12)}" text-anchor="start" font-size="10.5" paint-order="stroke" stroke="var(--paper)" stroke-width="3" stroke-linejoin="round">${esc(r.name)}</text>`;
      out += bar(r, X, y + 22, 8);
    });
    return out + '</svg>';
  }

  // One bar: solid for research and teaching (with an arrow when ongoing), outlined for training and externship.
  function bar(r, X, y, h) {
    const bx = X(r.s), bw = Math.max(3, X(r.e) - X(r.s));
    if (r.kind === 'solid') {
      const bwS = r.ongoing ? bw - 6 : bw;
      let s = `<rect x="${fmt(bx)}" y="${fmt(y - h / 2)}" width="${fmt(bwS)}" height="${h}" fill="currentColor"/>`;
      if (r.ongoing) s += `<path d="M${fmt(bx + bwS)} ${fmt(y - h / 2 - 2)} L${fmt(bx + bwS + 8)} ${fmt(y)} L${fmt(bx + bwS)} ${fmt(y + h / 2 + 2)} Z" fill="var(--accent)"/>`;
      return s;
    }
    return `<rect x="${fmt(bx + 0.5)}" y="${fmt(y - h / 2 + 0.5)}" width="${fmt(bw - 1)}" height="${h - 1}" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="1"/>`;
  }

  return wide() + compact();
}

function replaceBlock(html, key, inner) {
  const open = `<!-- generated:${key} -->`, close = `<!-- /generated:${key} -->`;
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a < 0 || b < a) throw new Error(`index.html has no block for ${key}`);
  if (html.indexOf(open, a + 1) >= 0) throw new Error(`index.html has more than one block for ${key}`);
  return html.slice(0, a + open.length) + inner + html.slice(b);
}

require('mathjax').init({
  loader: { load: ['input/tex', 'output/svg'] },
  tex: { packages: ['base', 'ams'] },
  svg: { fontCache: 'local' },
}).then(MathJax => {
  const adaptor = MathJax.startup.adaptor;
  let html = fs.readFileSync(INDEX, 'utf8');
  for (const [key, { tex, alt }] of Object.entries(EQ)) {
    const node = MathJax.tex2svg(tex, { display: true });
    let svg = adaptor.outerHTML(node).match(/<svg[\s\S]*<\/svg>/)[0];
    svg = svg.replace(/<svg /, alt ? `<svg aria-label="${alt.replace(/"/g, '&quot;')}" ` : '<svg aria-hidden="true" ');
    html = replaceBlock(html, key, svg);
  }
  html = replaceBlock(html, 'FIG_DISPERSION', dispersionSVG());
  html = replaceBlock(html, 'FIG_TIMELINE', timelineSVG());
  fs.writeFileSync(INDEX, html);
  console.log('index.html regenerated:', Object.keys(EQ).length, 'equations, 2 figures');
}).catch(err => { console.error(err); process.exit(1); });
