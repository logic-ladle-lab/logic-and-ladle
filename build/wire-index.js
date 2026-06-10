/*
 * Turn Exp.21-100 from "Coming Soon / #" into published entries in script.js:
 * sets link -> articleNN.html and a weekly date continuing from Exp.20 (2026.04.16).
 *   node build/wire-index.js
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'script.js');
let src = fs.readFileSync(file, 'utf8');

// Exp.21 = 2026-04-23, then +7 days each (Exp.20 was 2026.04.16)
const start = new Date(Date.UTC(2026, 3, 23)); // months are 0-based: 3 = April
const fmt = (d) => `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;

let changed = 0;
for (let n = 21; n <= 100; n++) {
  const d = new Date(start.getTime() + (n - 21) * 7 * 86400000);
  const date = fmt(d);
  const re = new RegExp(`(id: "Exp\\.${n}",[^\\n]*?)date: "Coming Soon", link: "#"`);
  if (re.test(src)) {
    src = src.replace(re, `$1date: "${date}", link: "article${n}.html"`);
    changed++;
  } else {
    console.warn(`! no match for Exp.${n}`);
  }
}

fs.writeFileSync(file, src, 'utf8');
console.log(`wired ${changed} entries (Exp.21-100)`);
