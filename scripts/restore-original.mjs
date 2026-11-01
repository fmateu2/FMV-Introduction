// One-time conversion of the recovered Site homepage to native React JSX.
import fs from 'node:fs';
import path from 'node:path';

const source = '.recovery/original-site/dist';
const html = fs.readFileSync(path.join(source, 'index.html'), 'utf8');
const body = html.match(/<body>([\s\S]*)<\/body>/)[1];
const names = { class: 'className', for: 'htmlFor', tabindex: 'tabIndex' };
const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const jsx = body.replace(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g, token => {
  if (token.startsWith('<!--')) return '';
  if (!token.startsWith('<')) return token.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
  if (token.startsWith('</')) return token;
  const tag = token.match(/^<([\w-]+)/)[1];
  const attrs = token.slice(tag.length + 1).replace(/\/?\s*>$/, '');
  const converted = [...attrs.matchAll(/([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+)))?/g)].map(([, key, a, b, c]) => {
    let value = a ?? b ?? c;
    if (key === 'style') {
      const styles = Object.fromEntries(value.split(';').filter(Boolean).map(part => {
        const colon = part.indexOf(':');
        return [part.slice(0, colon).trim().replace(/-([a-z])/g, (_, ch) => ch.toUpperCase()), part.slice(colon + 1).trim()];
      }));
      return `style={${JSON.stringify(styles)}}`;
    }
    key = names[key] ?? (/^(data|aria)-/.test(key) ? key : key.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase()));
    return value === undefined ? `${key}={true}` : `${key}="${value}"`;
  }).join(' ');
  return `<${tag}${converted ? ' ' + converted : ''}${voidTags.has(tag) || token.endsWith('/>') ? ' /' : ''}>`;
});
fs.writeFileSync('src/App.jsx', `// Recovered from the original portfolio, saved Site version 17.\nimport React from 'react';\nimport { usePortfolioEffects } from './usePortfolioEffects.js';\n\nexport default function App() {\n  usePortfolioEffects();\n  return <>${jsx}</>;\n}\n`);
fs.copyFileSync(path.join(source, 'styles.css'), 'src/style.css');
fs.mkdirSync('public', { recursive: true });
for (const entry of fs.readdirSync(source)) {
  if (entry !== 'index.html' && entry !== 'styles.css') fs.cpSync(path.join(source, entry), path.join('public', entry), { recursive: true });
}
fs.copyFileSync(path.join(source, 'styles.css'), 'public/styles.css');
fs.writeFileSync('src/main.jsx', "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\nimport './style.css';\n\ncreateRoot(document.getElementById('root')).render(<App />);\n");
fs.writeFileSync('index.html', `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="AI &amp; Data Science student building software and exploring data. Discover my projects, technical skills and learning journey." />
    <meta name="theme-color" content="#f6f5ee" />
    <meta name="referrer" content="no-referrer" />
    <link rel="icon" type="image/svg+xml" href="/assets/favicon.svg" />
    <title>Francesc Mateu Vallespín — AI, Data &amp; Software</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`);
console.log('Restored React homepage and original case-study pages and assets.');

