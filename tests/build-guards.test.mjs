import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();

const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const walkFiles = (dirPath, allowedExtensions = new Set(['.ts', '.astro', '.md', '.mdx'])) => {
  const absDir = path.join(repoRoot, dirPath);
  if (!fs.existsSync(absDir)) return [];
  const out = [];

  const walk = (currentDir) => {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(abs);
        continue;
      }
      if (!allowedExtensions.has(path.extname(entry.name))) continue;
      out.push(path.relative(repoRoot, abs).replaceAll('\\', '/'));
    }
  };

  walk(absDir);
  return out;
};

test('No se usa namespace de config inválido', () => {
  const files = walkFiles('src');
  const offenders = [];

  for (const file of files) {
    const content = read(file);
    if (content.includes('fade-technologies:config')) offenders.push(file);
  }

  assert.equal(
    offenders.length,
    0,
    `Se encontró namespace inválido "fade-technologies:config" en:\n${offenders.join('\n')}`
  );
});

test('El sitio usa salida static sin adaptador ni rutas dinamicas', () => {
  const config = read('astro.config.ts');
  assert.match(config, /output:\s*['"]static['"]/);
  assert.doesNotMatch(config, /adapter\s*:/);
  for (const file of walkFiles('src/pages')) {
    assert.doesNotMatch(read(file), /export\s+const\s+prerender\s*=\s*false/, file);
  }
});

test('Open Graph en páginas no usa rutas locales absolutas con "/" en metadata', () => {
  const pages = walkFiles('src/pages', new Set(['.astro']));
  const offenders = [];

  for (const page of pages) {
    const content = read(page);
    const hasProblematicOgPath = /openGraph[\s\S]*images[\s\S]*url:\s*['"]\/[^'"]+['"]/.test(content);
    if (hasProblematicOgPath) offenders.push(page);
  }

  assert.equal(
    offenders.length,
    0,
    `OpenGraph con rutas "/..." detectadas. Ajustar a asset local importado o URL absoluta válida:\n${offenders.join('\n')}`
  );
});

