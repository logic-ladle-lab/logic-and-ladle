/*
 * Full-page screenshots of the site pages for visual review.
 *   node instagram/browser/shoot-articles.js            (all, desktop)
 *   node instagram/browser/shoot-articles.js 1 5 13 20  (specific articles)
 *   node instagram/browser/shoot-articles.js --mobile 1 (mobile width)
 */
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const ROOT = path.join(__dirname, '..', '..');
const OUT = path.join(ROOT, '.review');
const mobile = process.argv.includes('--mobile');
const nums = process.argv.slice(2).filter((a) => /^\d+$/.test(a)).map(Number);
const ids = (nums.length ? nums : Array.from({ length: 20 }, (_, i) => i + 1));

const fileUrl = (p) => 'file:///' + path.join(ROOT, p).replace(/\\/g, '/');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const dir = path.join(OUT, mobile ? 'mobile' : 'desktop');
  fs.mkdirSync(dir, { recursive: true });
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: mobile ? 390 : 1280, height: 1000, deviceScaleFactor: 1 });

  const pages = nums.length ? [] : [['index', 'index.html']];
  ids.forEach((n) => pages.push([`article${String(n).padStart(2, '0')}`, `article${String(n).padStart(2, '0')}.html`]));

  for (const [name, file] of pages) {
    await page.goto(fileUrl(file), { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready).catch(() => {});
    await sleep(600); // let CSS animations settle
    const out = path.join(dir, `${name}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log('✓ ' + path.relative(ROOT, out));
  }
  await browser.close();
})();
