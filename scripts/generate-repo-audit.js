const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXCLUDED_EXTS = new Set([
  '.gif', '.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm',
  '.ico', '.woff', '.woff2'
]);
const EXCLUDED_FILES = new Set([
  'package-lock.json',
  'public/index.html',
  'public/styles.css',
  'docs/repo_audit.txt',
  'server.log'
]);

// Get all tracked files
const files = execSync('git ls-files', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(f => f)
  .filter(f => {
    const ext = path.extname(f).toLowerCase();
    return !EXCLUDED_EXTS.has(ext) && !EXCLUDED_FILES.has(f) && !path.basename(f).startsWith('screenshot');
  })
  .sort();

// Build bundle
let bundle = '';
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    bundle += `=== ${file} ===\n${content}\n\n`;
  } catch (e) {
    console.warn(`Skipping ${file}: ${e.message}`);
  }
}

fs.writeFileSync('docs/repo_audit.txt', bundle);
console.log(`Generated repo_audit.txt with ${files.length} files`);