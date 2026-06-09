/*
 * Drive the logged-in Gemini app (free) to generate every missing background
 * for an article, saving them into instagram/backgrounds/<slug>/<bgKey>.png.
 *
 * Requires launch.js to be running (Chrome on port 9222, logged in).
 *   node instagram/browser/gemini-gen.js exp11
 *   node instagram/browser/gemini-gen.js exp11 --force   (regenerate existing)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const slug = process.argv.find((a, i) => i >= 2 && !a.startsWith('--'));
const FORCE = process.argv.includes('--force');
const PREFIX = 'Generate a photorealistic square 1:1 image for me. ';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function grabBlob(page) {
  return page.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')]
      .filter((im) => /^blob:/.test(im.currentSrc || im.src) && im.naturalWidth >= 512);
    const el = imgs[imgs.length - 1];
    if (!el) return null;
    const c = document.createElement('canvas');
    c.width = el.naturalWidth; c.height = el.naturalHeight;
    c.getContext('2d').drawImage(el, 0, 0);
    return c.toDataURL('image/png');
  });
}

async function dismissModals(page) {
  // Gemini sometimes overlays an onboarding modal that blocks the input.
  await page.evaluate(() => {
    const labels = ['後で', 'あとで', 'Later', 'No thanks', 'Not now', 'スキップ', 'Skip', '閉じる'];
    const clickables = [...document.querySelectorAll('button, [role="button"], a')];
    for (const el of clickables) {
      const t = (el.textContent || '').trim();
      if (labels.includes(t)) { el.click(); return; }
    }
  });
}

async function genOne(page, prompt, outPath) {
  await page.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded' });
  // wait for input box
  for (let i = 0; i < 30; i++) {
    const ok = await page.evaluate(() => !!document.querySelector('[role="textbox"]'));
    if (ok) break;
    await sleep(500);
  }
  await sleep(800);
  await dismissModals(page);
  await sleep(500);
  await page.evaluate(() => document.querySelector('[role="textbox"]').focus());
  await page.keyboard.type(PREFIX + prompt, { delay: 6 });
  // verify the text landed (modal could have eaten focus); retry once
  let typed = await page.evaluate(() => (document.querySelector('[role="textbox"]').textContent || '').length);
  if (typed < 10) {
    await dismissModals(page);
    await sleep(500);
    await page.evaluate(() => document.querySelector('[role="textbox"]').focus());
    await page.keyboard.type(PREFIX + prompt, { delay: 6 });
  }
  await page.keyboard.press('Enter');

  // poll up to 90s for a finished blob image
  for (let i = 0; i < 30; i++) {
    await sleep(3000);
    const data = await grabBlob(page);
    if (data) {
      fs.writeFileSync(outPath, Buffer.from(data.split(',')[1], 'base64'));
      return true;
    }
  }
  return false;
}

async function main() {
  if (!slug) throw new Error('usage: node gemini-gen.js <slug> [--force]');
  const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'articles', `${slug}.json`), 'utf8'));
  const outDir = path.join(__dirname, '..', 'backgrounds', slug);
  fs.mkdirSync(outDir, { recursive: true });

  const cards = [
    { bgKey: 'cover', prompt: data.cover.bgPrompt },
    ...data.points.map((p) => ({ bgKey: `point${p.n}`, prompt: p.bgPrompt })),
  ];

  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222', defaultViewport: null });
  try {
    const page = (await browser.pages()).filter((p) => /^https?:/.test(p.url())).pop();
    for (const c of cards) {
      const out = path.join(outDir, `${c.bgKey}.png`);
      if (!FORCE && fs.existsSync(out)) { console.log(`= skip ${c.bgKey} (exists)`); continue; }
      process.stdout.write(`• ${c.bgKey} ... `);
      const ok = await genOne(page, c.prompt, out);
      console.log(ok ? `saved ${path.relative(path.join(__dirname, '..', '..'), out)}` : 'FAILED (timeout)');
    }
  } finally {
    await browser.disconnect();
  }
}

main().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });
