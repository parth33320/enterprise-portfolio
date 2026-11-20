const { test } = require('node:test');
const assert = require('node:assert');
const { execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

test('compile-portfolio script compiles portfolio and generates index.html without syntax errors', () => {
  const scriptPath = path.join(__dirname, '../scripts/compile-portfolio.js');
  const publicIndex = path.join(__dirname, '../public/index.html');

  // Remove existing index.html if present
  if (fs.existsSync(publicIndex)) {
    fs.unlinkSync(publicIndex);
  }

  // Execute compile-portfolio script
  execSync(`node "${scriptPath}"`, { stdio: 'pipe' });

  // Verify public/index.html was generated and is non-empty
  assert.strictEqual(fs.existsSync(publicIndex), true, 'public/index.html should exist');
  const content = fs.readFileSync(publicIndex, 'utf8');
  assert.ok(content.includes('Projects Index'), 'index.html should contain new page title');
  assert.ok(content.includes('Parth Patel'), 'index.html should contain Parth Patel');
  assert.ok(content.includes('Enterprise AI & Automation Systems Engineer'), 'index.html should contain subtitle');
  assert.ok(content.includes('github.com/parth33320'), 'index.html should contain GitHub link');
  assert.ok(content.includes('mailto:parth33320@gmail.com'), 'index.html should contain Email link');
  assert.ok(!content.includes('linkedin.com'), 'index.html should NOT contain LinkedIn link');
  assert.ok(!content.includes('cdn.tailwindcss.com'), 'index.html should NOT contain Tailwind CDN');
  assert.ok(content.includes('styles.css'), 'index.html should link to styles.css');
  assert.ok(content.includes('<video'), 'index.html should contain video element for mp4 entries');
  assert.ok(content.includes('preload="none"'), 'video elements should have preload="none"');
  assert.ok(content.includes('loading="lazy"'), 'img elements should have loading="lazy"');
  assert.ok(content.includes('decoding="async"'), 'img elements should have decoding="async"');
  assert.ok(content.includes('theater-modal'), 'index.html should contain theater modal');
  assert.ok(content.includes('admin-upload-modal'), 'index.html should contain admin upload modal');
  assert.ok(content.includes('xjupload'), 'index.html should contain xjupload trigger');
  assert.ok(content.includes('stdDev'), 'index.html should contain thumbnail generation logic');
  assert.ok(content.includes('uploads.github.com'), 'index.html should use correct GitHub upload endpoint');
  // YouTube embed support
  assert.ok(content.includes('youtube-nocookie.com'), 'index.html should contain YouTube embed support');
  assert.ok(content.includes('extractYouTubeId'), 'index.html should contain YouTube ID extractor');
  assert.ok(content.includes('youtube-url-input'), 'index.html should contain YouTube URL input in admin modal');
});
