/*
 * LOGIC & LADLE — Instagram carousel generator (hybrid)
 * ----------------------------------------------------
 * 1. Nano Banana (Gemini image model) generates a photoreal, text-free BACKGROUND.
 * 2. Puppeteer overlays crisp Japanese text (Shippori Mincho B1) via HTML/CSS,
 *    then screenshots a 1080x1080 card -> PNG.
 *
 * Why hybrid? Image models garble long Japanese text. Backgrounds = AI's strength,
 * text = HTML's strength. This guarantees correct, on-brand typography.
 *
 * Usage:
 *   node --env-file=instagram/.env instagram/generate.js exp11
 *   node --env-file=instagram/.env instagram/generate.js exp11 --model pro   (Nano Banana Pro)
 *   node --env-file=instagram/.env instagram/generate.js exp11 --card cover  (one card only)
 *   node --env-file=instagram/.env instagram/generate.js exp11 --no-ai       (reuse cached bg)
 *
 * Requires env var GEMINI_API_KEY (put it in instagram/.env — git-ignored).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const puppeteer = require('puppeteer');

// ---- config ------------------------------------------------------------
const SIZE = 1080; // Instagram square
const ROOT = path.join(__dirname, '..');
const OUT_ROOT = path.join(ROOT, 'インスタグラム用画像');
const CACHE_DIR = path.join(__dirname, '.cache');

const MODELS = {
  standard: 'gemini-2.5-flash-image',     // Nano Banana — cheap, great backgrounds
  pro: 'gemini-3-pro-image-preview',      // Nano Banana Pro — higher fidelity
};

const COLORS = { bg: '#0F0F10', text: '#F2F2F2', accent: '#D4AF37' };

// ---- args --------------------------------------------------------------
const argv = process.argv.slice(2);
const slug = argv.find((a) => !a.startsWith('--'));
const getFlag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? (argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true) : undefined;
};
const modelKey = getFlag('model') === 'pro' ? 'pro' : 'standard';
const onlyCard = getFlag('card'); // 'cover' | '1' | '2' | '3'
const noAI = !!getFlag('no-ai');

if (!slug) {
  console.error('Usage: node instagram/generate.js <slug> [--model pro] [--card cover|1|2|3] [--no-ai]');
  process.exit(1);
}

// ---- Gemini (Nano Banana) image generation -----------------------------
// Manual/browser-generated backgrounds: instagram/backgrounds/<slug>/<bgKey>.(png|jpg|jpeg|webp)
// Drop images here (e.g. generated free in the Gemini app) and they win over the API.
function findManualBackground(slug, bgKey) {
  const dir = path.join(__dirname, 'backgrounds', slug);
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const f = path.join(dir, `${bgKey}.${ext}`);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

async function generateBackground(prompt, model, slug, bgKey) {
  const manual = findManualBackground(slug, bgKey);
  if (manual) {
    console.log(`   ↳ manual background (${path.basename(manual)})`);
    return fs.readFileSync(manual);
  }

  const cacheKey = crypto.createHash('sha1').update(`${model}::${prompt}`).digest('hex').slice(0, 16);
  const cachePath = path.join(CACHE_DIR, `${cacheKey}.png`);
  if (fs.existsSync(cachePath)) {
    console.log(`   ↳ cached background (${cacheKey})`);
    return fs.readFileSync(cachePath);
  }
  if (noAI) throw new Error(`--no-ai set but no cached background for prompt (${cacheKey})`);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set (put it in instagram/.env)');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'x-goog-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['IMAGE'] },
    }),
  });
  if (!res.ok) throw new Error(`Gemini API ${res.status}: ${await res.text()}`);

  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts || [];
  const imgPart = parts.find((p) => p.inlineData || p.inline_data);
  const b64 = imgPart?.inlineData?.data || imgPart?.inline_data?.data;
  if (!b64) throw new Error('No image in Gemini response: ' + JSON.stringify(json).slice(0, 600));

  const buf = Buffer.from(b64, 'base64');
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(cachePath, buf);
  return buf;
}

// ---- HTML template -----------------------------------------------------
function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function bodyToHtml(body) {
  const lines = Array.isArray(body) ? body : String(body).split(/\n|<br\s*\/?>/);
  return lines.map((l) => esc(l.trim())).join('<br>');
}

function buildHtml(card, bgDataUri) {
  const isCover = card.kind === 'cover';
  const content = isCover
    ? `
        <h1 class="title">${bodyToHtml(card.title)}</h1>
        <p class="subtitle">${bodyToHtml(card.subtitle)}</p>`
    : `
        <div class="point-label">Point ${card.n}</div>
        <h2 class="heading">${bodyToHtml(card.heading)}</h2>
        <p class="body">${bodyToHtml(card.body)}</p>`;

  return `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@500;700&family=Roboto+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  html,body { width:${SIZE}px; height:${SIZE}px; }
  #card {
    position:relative; width:${SIZE}px; height:${SIZE}px; overflow:hidden;
    background:${COLORS.bg}; font-family:'Shippori Mincho B1', serif; color:${COLORS.text};
  }
  #card .bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
  #card .scrim {
    position:absolute; inset:0;
    background:
      linear-gradient(to bottom, rgba(0,0,0,.62) 0%, rgba(0,0,0,.30) 38%, rgba(0,0,0,.18) 60%, rgba(0,0,0,.55) 100%),
      radial-gradient(120% 90% at 50% 0%, rgba(0,0,0,.25), transparent 60%);
  }
  #card .content {
    position:absolute; left:0; right:0; top:0;
    padding:${isCover ? '150px 90px 0' : '96px 84px 0'};
    text-align:center;
  }
  .title { font-weight:700; font-size:74px; line-height:1.42; letter-spacing:.04em;
           text-shadow:0 2px 14px rgba(0,0,0,.6); }
  .subtitle { margin-top:30px; font-weight:500; font-size:33px; line-height:1.7;
              letter-spacing:.05em; opacity:.92; text-shadow:0 2px 10px rgba(0,0,0,.6); }
  .point-label { font-family:'Roboto Mono', monospace; font-weight:400; font-size:30px;
                 letter-spacing:.18em; color:${COLORS.accent}; text-shadow:0 2px 8px rgba(0,0,0,.7); }
  .heading { margin-top:18px; font-weight:700; font-size:60px; line-height:1.4;
             letter-spacing:.03em; text-shadow:0 2px 14px rgba(0,0,0,.65); }
  .body { margin-top:34px; font-weight:500; font-size:35px; line-height:1.95;
          letter-spacing:.04em; text-shadow:0 2px 10px rgba(0,0,0,.7); }
  #card .mark { position:absolute; right:46px; bottom:40px; font-size:40px;
                color:${COLORS.accent}; opacity:.9; }
  #card .brand { position:absolute; left:50px; bottom:46px; font-family:'Roboto Mono', monospace;
                 font-size:22px; letter-spacing:.22em; opacity:.6; }
</style></head>
<body>
  <div id="card">
    <img class="bg" src="${bgDataUri}">
    <div class="scrim"></div>
    <div class="content">${content}</div>
    <div class="brand">LOGIC &amp; LADLE</div>
    <div class="mark">✦</div>
  </div>
</body></html>`;
}

// ---- main --------------------------------------------------------------
async function main() {
  const dataPath = path.join(__dirname, 'articles', `${slug}.json`);
  if (!fs.existsSync(dataPath)) throw new Error(`No data file: ${dataPath}`);
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const model = MODELS[modelKey];
  console.log(`\n■ ${slug}  (model: ${model})`);

  // assemble card list: cover + points
  let cards = [
    { kind: 'cover', bgKey: 'cover', file: '1_cover.png', ...data.cover },
    ...data.points.map((p, i) => ({ kind: 'point', bgKey: `point${p.n}`, file: `${i + 2}_point${p.n}.png`, ...p })),
  ];
  if (onlyCard && onlyCard !== true) {
    cards = cards.filter((c) =>
      onlyCard === 'cover' ? c.kind === 'cover' : String(c.n) === String(onlyCard));
    if (!cards.length) throw new Error(`--card ${onlyCard} matched nothing`);
  }

  const outDir = path.join(OUT_ROOT, data.folder);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: SIZE, height: SIZE, deviceScaleFactor: 1 });

    for (const card of cards) {
      const label = card.kind === 'cover' ? 'cover' : `point${card.n}`;
      console.log(` • ${label}`);
      const bgBuf = await generateBackground(card.bgPrompt, model, slug, card.bgKey);
      const bgDataUri = `data:image/png;base64,${bgBuf.toString('base64')}`;
      const html = buildHtml(card, bgDataUri);
      await page.setContent(html, { waitUntil: 'domcontentloaded' });
      await page.evaluate(async () => {
        const f = "'Shippori Mincho B1'";
        await Promise.all([
          document.fonts.load(`700 60px ${f}`),
          document.fonts.load(`500 35px ${f}`),
          document.fonts.load(`400 30px 'Roboto Mono'`),
        ]);
        await document.fonts.ready;
      });
      const el = await page.$('#card');
      const outPath = path.join(outDir, card.file);
      await el.screenshot({ path: outPath, type: 'png' });
      console.log(`   ✓ ${path.relative(ROOT, outPath)}`);
    }
  } finally {
    await browser.close();
  }
  console.log('\n✅ done\n');
}

main().catch((e) => {
  console.error('\n✗ ' + e.message + '\n');
  process.exit(1);
});
