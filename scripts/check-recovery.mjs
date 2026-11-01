import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const homepage = fs.readFileSync('src/App.jsx', 'utf8');
const pages = ['index.html', ...fs.readdirSync('dist/projects').filter(name => name.endsWith('.html')).map(name => `projects/${name}`)];
let links = 0;
for (const page of pages) {
  const content = page === 'index.html' ? homepage : fs.readFileSync(path.join(root, page), 'utf8');
  for (const [, ref] of content.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const url = new URL(ref, `https://local.test/${page}`);
    const pathname = decodeURIComponent(url.pathname);
    const target = path.join(root, pathname === '/' ? 'index.html' : pathname);
    assert(fs.statSync(target).isFile(), `Missing file: ${page}: ${ref}`);
    if (url.hash && target.endsWith('.html')) {
      const targetContent = target === path.join(root, 'index.html') ? homepage : fs.readFileSync(target, 'utf8');
      assert(targetContent.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Missing anchor: ${page}: ${ref}`);
    }
    links++;
  }
}
let assets = 0;
const source = '.recovery/original-site/dist';
if (fs.existsSync(source)) {
  for (const file of fs.readdirSync(source, { recursive: true })) {
    const original = path.join(source, file);
    // Design files evolve; original downloadable materials remain intact.
    if (!fs.statSync(original).isFile() || !file.startsWith(`assets${path.sep}`)) continue;
    assert(fs.readFileSync(original).equals(fs.readFileSync(path.join('public', file))), `Changed original asset: ${file}`);
    assets++;
  }
}
console.log(`PASS: ${pages.length} pages, ${links} local links/anchors, ${assets} original static files unchanged.`);
