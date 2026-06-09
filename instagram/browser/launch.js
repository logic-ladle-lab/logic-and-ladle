/*
 * Launch real Chrome (non-headless) with a dedicated, persistent profile and a
 * remote-debugging port, then stay alive so a human can log in once and other
 * scripts (ctl.js) can connect and drive it.
 *
 * Run in background:  node instagram/browser/launch.js
 * Then control it:    node instagram/browser/ctl.js shot out.png
 */
const puppeteer = require('puppeteer');
const path = require('path');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PROFILE = path.join(__dirname, '.profile');
const START_URL = process.argv[2] || 'https://gemini.google.com/app';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: CHROME,
    userDataDir: PROFILE,
    defaultViewport: null,
    // reduce "controlled by automated software" detection that can block Google login
    ignoreDefaultArgs: ['--enable-automation'],
    args: [
      '--remote-debugging-port=9222',
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--no-first-run',
      '--no-default-browser-check',
    ],
  });

  const pages = await browser.pages();
  const page = pages[0] || (await browser.newPage());
  await page.goto(START_URL, { waitUntil: 'domcontentloaded' }).catch(() => {});

  console.log('READY  port=9222  profile=' + PROFILE);
  console.log('URL    ' + START_URL);
  console.log('(leave this running; log in manually if prompted)');

  // keep the process (and thus the browser) alive until killed
  await new Promise(() => {});
})();
