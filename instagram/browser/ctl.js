/*
 * Connect to the already-running Chrome (launch.js) on port 9222 and drive it.
 * The browser stays open after each command (we disconnect, not close).
 *
 * Commands:
 *   node ctl.js pages                       list open tabs (index + url)
 *   node ctl.js shot <out.png> [tabIndex]   screenshot a tab (default: last)
 *   node ctl.js goto <url> [tabIndex]
 *   node ctl.js click <x> <y> [tabIndex]    mouse click at viewport coords
 *   node ctl.js type "<text>" [tabIndex]    type into focused element
 *   node ctl.js key <Key> [tabIndex]        press a key, e.g. Enter
 *   node ctl.js eval "<js>" [tabIndex]      run JS in page, print JSON result
 *   node ctl.js grab <selector> <out.png> [tabIndex]   fetch an <img> src to PNG
 */
const puppeteer = require('puppeteer');

async function main() {
  const [cmd, a1, a2, a3] = process.argv.slice(2);
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:9222',
    defaultViewport: null,
  });

  // pick target tab: last real (http) page, or explicit index
  let pages = (await browser.pages()).filter((p) => /^https?:/.test(p.url()));
  const idxArg = { shot: a2, goto: a2, click: a3, type: a2, key: a2, eval: a2, grab: a3 }[cmd];
  const idx = idxArg !== undefined && idxArg !== '' ? Number(idxArg) : pages.length - 1;
  const page = pages[idx] || pages[pages.length - 1];

  try {
    if (cmd === 'pages') {
      pages.forEach((p, i) => console.log(`${i}\t${p.url()}`));
    } else if (cmd === 'shot') {
      await page.screenshot({ path: a1 || 'shot.png' });
      console.log('shot -> ' + (a1 || 'shot.png') + '  @ ' + page.url());
    } else if (cmd === 'goto') {
      await page.goto(a1, { waitUntil: 'domcontentloaded' });
      console.log('at ' + page.url());
    } else if (cmd === 'click') {
      await page.mouse.click(Number(a1), Number(a2));
      console.log(`clicked ${a1},${a2}`);
    } else if (cmd === 'type') {
      await page.keyboard.type(a1, { delay: 12 });
      console.log('typed ' + a1.length + ' chars');
    } else if (cmd === 'key') {
      await page.keyboard.press(a1);
      console.log('pressed ' + a1);
    } else if (cmd === 'eval') {
      const r = await page.evaluate((code) => {
        // eslint-disable-next-line no-eval
        const out = eval(code);
        return out;
      }, a1);
      console.log(typeof r === 'string' ? r : JSON.stringify(r, null, 2));
    } else if (cmd === 'grab') {
      const dataUrl = await page.evaluate(async (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        if (!el.complete) await new Promise((r) => { el.onload = r; el.onerror = r; });
        // canvas works for same-origin blob: images without CORS fetch
        try {
          const c = document.createElement('canvas');
          c.width = el.naturalWidth; c.height = el.naturalHeight;
          c.getContext('2d').drawImage(el, 0, 0);
          return c.toDataURL('image/png');
        } catch (e) {
          const res = await fetch(el.currentSrc || el.src);
          const blob = await res.blob();
          return await new Promise((ok) => {
            const fr = new FileReader();
            fr.onload = () => ok(fr.result);
            fr.readAsDataURL(blob);
          });
        }
      }, a1);
      if (!dataUrl) throw new Error('no element / src for ' + a1);
      const b64 = dataUrl.split(',')[1];
      require('fs').writeFileSync(a2, Buffer.from(b64, 'base64'));
      console.log('grabbed ' + a1 + ' -> ' + a2);
    } else {
      console.log('unknown command: ' + cmd);
    }
  } finally {
    await browser.disconnect();
  }
}

main().catch((e) => {
  console.error('✗ ' + e.message);
  process.exit(1);
});
