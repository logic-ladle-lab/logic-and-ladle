/*
 * Render article HTML from authored JSON specs (produced by the workflow agents).
 *   node build/render-specs.js build/specs-a.json build/specs-b.json ...
 *
 * Each spec: { id, category, titleHtml, lead, sections:[{h2,p}x3], diagram, chart, protocols }
 * diagram: { kind:'flow', title, steps:[{main,sub,accent}] } | { kind:'compare', cards:[{title,body}] }
 * chart:   { kind:'line', title, caption, points:[[x,y]], xTicks, yTicks?, peak? } | { kind:'bars', ... }
 */
const fs = require('fs');
const path = require('path');
const { svgChart, svgBars, flowDiagram, compareGrid } = require('./components');

const ROOT = path.join(__dirname, '..');
const ACCENT = '#D4AF37';
const BAR_COLORS = [ACCENT, '#9a9a9a', '#4FC3F7'];
const clamp01 = (x) => Math.max(0, Math.min(1, Number(x)));

function renderDiagram(d) {
  if (!d) return '';
  if (d.kind === 'compare' && Array.isArray(d.cards) && d.cards.length) return compareGrid(d.cards);
  if (Array.isArray(d.steps) && d.steps.length) return flowDiagram(d.title || '', [d.steps]);
  if (Array.isArray(d.cards) && d.cards.length) return compareGrid(d.cards);
  return '';
}

function renderChart(d, id) {
  if (!d) return '';
  if (d.kind === 'bars' && Array.isArray(d.bars) && d.bars.length) {
    return svgBars({
      title: d.title, caption: d.caption,
      bars: d.bars.map((b, i) => ({
        label: b.label, value: clamp01(b.value), sub: b.sub,
        color: BAR_COLORS[i % BAR_COLORS.length],
      })),
    });
  }
  let pts = (d.points || []).map((p) => [clamp01(p[0]), clamp01(p[1])]);
  if (pts.length < 2) pts = [[0, 0.2], [0.5, 0.7], [1, 0.85]];
  return svgChart({
    uid: 'a' + id,
    title: d.title, caption: d.caption,
    series: [{ points: pts, color: ACCENT }],
    xTicks: (d.xTicks || []).map((t) => ({ at: clamp01(t.at), text: t.text })),
    yTicks: (d.yTicks || []).map((t) => ({ at: clamp01(t.at), text: t.text })),
    annotations: d.peak ? [{ x: clamp01(d.peak.at), y: clamp01(d.peak.y == null ? 1 : d.peak.y), text: d.peak.text || '' }] : [],
  });
}

function render(a) {
  const sec = a.sections || [];
  const s1 = sec[0] || { h2: '', p: '' };
  const s2 = sec[1] || { h2: '', p: '' };
  const s3 = sec[2] || { h2: '', p: '' };
  const title_text = (a.titleHtml || '').replace(/<br>/g, ' ');
  const protocols = (a.protocols || []).map((p) => `
                            <h3>${p.title}</h3>
                            <p>${p.desc}</p>`).join('');

  return `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title_text} - LOGIC & LADLE</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400&family=Roboto+Mono:wght@300;400&family=Shippori+Mincho+B1:wght@500;700&display=swap" rel="stylesheet">
    <link rel="icon" href="favicon.svg" type="image/svg+xml">
</head>
<body>
    <header>
        <div class="logo-area">
            <a href="index.html" class="site-logo">LOGIC & LADLE</a>
            <p class="site-desc">Experimental Food Science Lab.</p>
        </div>
        <nav class="site-nav">
            <a href="index.html">TOP</a>
            <a href="#">About</a>
        </nav>
    </header>

    <main class="article-container">
        <article>
            <div class="article-header header-generic">
                <span class="article-id">Exp.${a.id}</span>
                <span class="category-tag">${a.category}</span>
                <h1 class="article-main-title">${a.titleHtml}</h1>
                <p class="lead">${a.lead}</p>
            </div>

            <section>
                <h2>${s1.h2}</h2>
                <p>${s1.p}</p>
            </section>

            <section>
                <h2>${s2.h2}</h2>
                <p>${s2.p}</p>
                ${renderDiagram(a.diagram)}
            </section>

            <section>
                <h2>${s3.h2}</h2>
                <p>${s3.p}</p>
                ${renderChart(a.chart, a.id)}
            </section>

            <section>
                <h2>4.0 LABORATORY PROTOCOLS：実践メソッド</h2>
                ${protocols}
            </section>

            <div class="references">
                <h3>References & Further Reading</h3>
                <ul>
                    <li>[1] McGee, Harold. (2004). <em>On Food and Cooking</em>. Scribner.</li>
                    <li>[2] Myhrvold, Nathan. (2011). <em>Modernist Cuisine</em>. The Cooking Lab.</li>
                </ul>
            </div>
        </article>
    </main>

    <footer>
        <div class="footer-content">
            <div class="footer-logo">LOGIC & LADLE</div>
            <div class="footer-copy">&copy; 2024 All Rights Reserved.</div>
        </div>
    </footer>
</body>
</html>
`;
}

const files = process.argv.slice(2);
let specs = [];
for (const f of files) {
  const arr = JSON.parse(fs.readFileSync(f, 'utf8'));
  specs = specs.concat(Array.isArray(arr) ? arr : [arr]);
}
let n = 0;
for (const a of specs) {
  if (!a || !a.id) continue;
  fs.writeFileSync(path.join(ROOT, `article${a.id}.html`), render(a), 'utf8');
  n++;
}
console.log(`rendered ${n} articles`);
