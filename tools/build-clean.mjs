#!/usr/bin/env node
/* 產生要部署的乾淨版：把 HTML / CSS / JS 的註解拿掉，原始碼留在 main。
   用法：node tools/build-clean.mjs <輸出目錄>                            */

import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2];
if (!out) { console.error('usage: node tools/build-clean.mjs <outdir>'); process.exit(1); }

/* 會被部署的東西；docs/、reference/、README.md、tools/ 都是工作材料，不上線。 */
const COPY = ['assets', 'CNAME', 'favicon.ico', 'index.html', 'project', 'robots.txt', 'site.webmanifest', 'sitemap.xml'];
const STRIP = { '.html': stripHtml, '.css': stripCss, '.js': stripJs };

/* ---- HTML：只吃真正的 <!-- -->，標籤屬性與 script/style 內文原樣帶過 ---- */
function stripHtml(src) {
  let res = '', i = 0;
  while (i < src.length) {
    if (src.startsWith('<!--', i)) {
      const end = src.indexOf('-->', i + 4);
      i = end === -1 ? src.length : end + 3;
      continue;
    }
    const raw = /^<(script|style)\b/i.exec(src.slice(i, i + 8));
    if (raw) {
      const tag = raw[1].toLowerCase();
      const close = src.toLowerCase().indexOf('</' + tag, i);
      const end = close === -1 ? src.length : close + tag.length + 3;
      // 內嵌的 <style>/<script> 也要去註解（project/ 的單檔頁面把 CSS、JS 都寫在 HTML 裡）
      const open = src.indexOf('>', i) + 1;
      const inner = src.slice(open, close === -1 ? src.length : close);
      res += src.slice(i, open) + STRIP[tag === 'style' ? '.css' : '.js'](inner) + src.slice(open + inner.length, end);
      i = end; continue;
    }
    if (src[i] === '<') {
      let j = i + 1;
      while (j < src.length) {
        const c = src[j];
        if (c === '"' || c === "'") { const q = src.indexOf(c, j + 1); j = q === -1 ? src.length : q + 1; continue; }
        if (c === '>') { j++; break; }
        j++;
      }
      res += src.slice(i, j); i = j; continue;
    }
    res += src[i++];
  }
  return res;
}

/* ---- CSS：字串裡的 url("data:image/svg+xml,...") 不能被當成註解 ---- */
function stripCss(src) {
  let res = '', i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      res += src.slice(i, Math.min(j + 1, src.length)); i = j + 1; continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 2; continue;
    }
    res += c; i++;
  }
  return res;
}

/* ---- JS：字串、樣板字串、正規表示式字面值都要先認出來再判斷 / ---- */
const RE_OK_BEFORE = /(^|[^\w$])(return|typeof|instanceof|new|delete|void|in|of|case|do|else|yield|await)$/;
function stripJs(src) {
  let res = '', i = 0, prev = '';           // prev = 已輸出、去掉空白的尾巴
  const regexAllowed = () => {
    const t = prev.replace(/\s+$/, '');
    if (!t) return true;
    const last = t[t.length - 1];
    if (/[\w$)\]]/.test(last)) return RE_OK_BEFORE.test(t);
    return true;
  };
  while (i < src.length) {
    const c = src[i];
    if (c === '"' || c === "'" || c === '`') {
      let j = i + 1;
      while (j < src.length && src[j] !== c) { if (src[j] === '\\') j++; j++; }
      const chunk = src.slice(i, Math.min(j + 1, src.length));
      res += chunk; prev += chunk; i = j + 1; continue;
    }
    if (c === '/' && src[i + 1] === '/') {
      const nl = src.indexOf('\n', i);
      i = nl === -1 ? src.length : nl;       // 換行本身留著
      continue;
    }
    if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 2; continue;
    }
    if (c === '/' && regexAllowed()) {
      let j = i + 1, cls = false;
      while (j < src.length) {
        const d = src[j];
        if (d === '\\') { j += 2; continue; }
        if (d === '[') cls = true;
        else if (d === ']') cls = false;
        else if (d === '/' && !cls) break;
        else if (d === '\n') { j = -1; break; }
        j++;
      }
      if (j > 0) {
        while (j + 1 < src.length && /[a-z]/.test(src[j + 1])) j++;
        const chunk = src.slice(i, j + 1);
        res += chunk; prev += chunk; i = j + 1; continue;
      }
    }
    res += c; prev = (prev + c).slice(-24); i++;
  }
  return res;
}

/* 註解拿掉之後留下的空行收乾：行尾空白去掉，連續空行併成一行。 */
function tidy(src) {
  const lines = src.split('\n').map(l => l.replace(/[ \t]+$/, ''));
  const kept = [];
  for (const l of lines) {
    if (l === '' && kept.length && kept[kept.length - 1] === '') continue;
    kept.push(l);
  }
  return kept.join('\n').replace(/^\n+/, '').replace(/\n+$/, '\n');
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const item of COPY) {
  const from = join(root, item);
  if (!existsSync(from)) { console.error('missing: ' + item); process.exit(1); }
  cpSync(from, join(out, item), { recursive: true });
}

let n = 0;
for (const rel of ['index.html', 'project/to-creators-tw.html', 'assets/css/style.css', 'assets/js/main.js']) {
  const file = join(out, rel);
  const before = readFileSync(file, 'utf8');
  const after = tidy(STRIP['.' + rel.split('.').pop()](before));
  writeFileSync(file, after);
  console.log(`${rel}: ${before.length} → ${after.length} bytes`);
  n++;
}
console.log(`stripped ${n} files → ${out}`);
