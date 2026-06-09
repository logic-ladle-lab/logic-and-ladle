/*
 * Reusable on-brand visual components for LOGIC & LADLE articles.
 * - svgChart  : crisp inline-SVG line/area chart (replaces fragile CSS-skew charts)
 * - svgBars   : inline-SVG bar comparison
 * - flowDiagram / compareGrid / spectrum : styled diagrams (replace ASCII text boxes)
 *
 * Pure functions returning HTML strings. No DOM, no deps.
 */

const ACCENT = '#D4AF37';

// --- chart geometry ---
const VW = 620, VH = 320;
const M = { l: 54, r: 24, t: 22, b: 46 };
const PW = VW - M.l - M.r;
const PH = VH - M.t - M.b;
const mapX = (nx) => M.l + nx * PW;
const mapY = (ny) => M.t + (1 - ny) * PH;
const BASE_Y = mapY(0);

function smoothPath(pts) {
  // Catmull-Rom -> cubic bezier through pixel points
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || pts[i + 1];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/*
 * svgChart({ title, caption, uid, series:[{points:[[nx,ny]..], color, label, dashed, area}],
 *            xTicks:[{at,text}], yTicks:[{at,text}], annotations:[{x,y,text,color}] })
 */
function svgChart(cfg) {
  const uid = cfg.uid;
  const series = cfg.series || [];
  const gridLines = [0.25, 0.5, 0.75].map(
    (g) => `<line class="grid" x1="${M.l}" y1="${mapY(g).toFixed(1)}" x2="${VW - M.r}" y2="${mapY(g).toFixed(1)}"/>`
  ).join('');

  const defs = series.map((s, i) => {
    const c = s.color || ACCENT;
    return `<linearGradient id="g-${uid}-${i}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${c}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${c}" stop-opacity="0"/>
    </linearGradient>`;
  }).join('') +
    `<filter id="glow-${uid}" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3.5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;

  const paths = series.map((s, i) => {
    const c = s.color || ACCENT;
    const px = s.points.map(([nx, ny]) => [mapX(nx), mapY(ny)]);
    const line = smoothPath(px);
    const areaD = s.area === false ? '' :
      `${line} L ${px[px.length - 1][0].toFixed(1)} ${BASE_Y.toFixed(1)} L ${px[0][0].toFixed(1)} ${BASE_Y.toFixed(1)} Z`;
    const area = areaD ? `<path d="${areaD}" fill="url(#g-${uid}-${i})" stroke="none"/>` : '';
    const dash = s.dashed ? ' stroke-dasharray="7 6"' : '';
    return `${area}<path class="curve" d="${line}" stroke="${c}"${dash} filter="url(#glow-${uid})"/>`;
  }).join('');

  const xTicks = (cfg.xTicks || []).map(
    (t) => `<text class="axis-label" x="${mapX(t.at).toFixed(1)}" y="${VH - 22}" text-anchor="middle">${t.text}</text>`
  ).join('');
  const yTicks = (cfg.yTicks || []).map(
    (t) => `<text class="axis-label" x="${M.l - 8}" y="${(mapY(t.at) + 4).toFixed(1)}" text-anchor="end">${t.text}</text>`
  ).join('');

  const annos = (cfg.annotations || []).map((a) => {
    const x = mapX(a.x), y = mapY(a.y), c = a.color || ACCENT;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" fill="${c}"/>
      <text class="point-label" x="${x.toFixed(1)}" y="${(y - 12).toFixed(1)}" text-anchor="middle" fill="${c}">${a.text}</text>`;
  }).join('');

  const legend = series.some((s) => s.label)
    ? `<g transform="translate(${VW - M.r - 150}, ${M.t})">` +
      series.filter((s) => s.label).map((s, i) =>
        `<g transform="translate(0, ${i * 22})">
          <line x1="0" y1="0" x2="22" y2="0" stroke="${s.color || ACCENT}" stroke-width="3" ${s.dashed ? 'stroke-dasharray="6 5"' : ''}/>
          <text class="axis-label" x="28" y="4" fill="${s.color || ACCENT}">${s.label}</text>
        </g>`).join('') + `</g>`
    : '';

  return `
                <div class="visualization-container">
                    <h3>${cfg.title}</h3>
                    <svg class="chart-svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${cfg.title}">
                        <defs>${defs}</defs>
                        ${gridLines}
                        <line class="axis" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${BASE_Y}"/>
                        <line class="axis" x1="${M.l}" y1="${BASE_Y}" x2="${VW - M.r}" y2="${BASE_Y}"/>
                        ${paths}
                        ${annos}
                        ${xTicks}
                        ${yTicks}
                        ${legend}
                    </svg>
                    ${cfg.caption ? `<p class="caption">${cfg.caption}</p>` : ''}
                </div>`;
}

/* svgBars({ title, caption, bars:[{label, value 0..1, color, sub}] }) */
function svgBars(cfg) {
  const bars = cfg.bars || [];
  const n = bars.length;
  const gap = 40;
  const bw = (PW - gap * (n - 1)) / n;
  const items = bars.map((b, i) => {
    const c = b.color || ACCENT;
    const x = M.l + i * (bw + gap);
    const h = b.value * PH;
    const y = BASE_Y - h;
    return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="4" fill="${c}" fill-opacity="0.85"/>
      <text class="axis-label" x="${(x + bw / 2).toFixed(1)}" y="${VH - 22}" text-anchor="middle">${b.label}</text>
      ${b.sub ? `<text class="point-label" x="${(x + bw / 2).toFixed(1)}" y="${(y - 10).toFixed(1)}" text-anchor="middle" fill="${c}">${b.sub}</text>` : ''}`;
  }).join('');
  return `
                <div class="visualization-container">
                    <h3>${cfg.title}</h3>
                    <svg class="chart-svg" viewBox="0 0 ${VW} ${VH}" role="img" aria-label="${cfg.title}">
                        <line class="axis" x1="${M.l}" y1="${M.t}" x2="${M.l}" y2="${BASE_Y}"/>
                        <line class="axis" x1="${M.l}" y1="${BASE_Y}" x2="${VW - M.r}" y2="${BASE_Y}"/>
                        ${items}
                    </svg>
                    ${cfg.caption ? `<p class="caption">${cfg.caption}</p>` : ''}
                </div>`;
}

/* flowDiagram(title, rows) — rows: [[{main, sub, accent}, ...], ...] */
function flowDiagram(title, rows) {
  const renderRow = (nodes) => {
    const parts = [];
    nodes.forEach((node, i) => {
      if (i > 0) parts.push(`<div class="flow-arrow"><span>→</span></div>`);
      parts.push(
        `<div class="flow-node${node.accent ? ' is-accent' : ''}">
          <div class="node-main">${node.main}</div>
          ${node.sub ? `<div class="node-sub">${node.sub}</div>` : ''}
        </div>`
      );
    });
    return `<div class="flow-row">${parts.join('')}</div>`;
  };
  return `
                <div class="flow-diagram">
                    ${title ? `<div class="flow-title">${title}</div>` : ''}
                    ${rows.map(renderRow).join('')}
                </div>`;
}

/* compareGrid(cards) — cards: [{title, body}] */
function compareGrid(cards) {
  return `
                <div class="compare-grid">
                    ${cards.map((c) => `<div class="compare-card">
                        <div class="cc-title">${c.title}</div>
                        <div class="cc-body">${c.body}</div>
                    </div>`).join('')}
                </div>`;
}

/* spectrum(title, stops, labels) — horizontal gradient scale (anthocyanin) */
function spectrum(title, gradientCss, labels) {
  return `
                <div class="flow-diagram">
                    ${title ? `<div class="flow-title">${title}</div>` : ''}
                    <div style="height:28px; border-radius:6px; background:${gradientCss}; margin:4px 0 12px;"></div>
                    <div style="display:flex; justify-content:space-between; font-family:var(--font-mono); font-size:0.72rem; color:var(--color-sub);">
                        ${labels.map((l) => `<span>${l}</span>`).join('')}
                    </div>
                </div>`;
}

module.exports = { svgChart, svgBars, flowDiagram, compareGrid, spectrum };
