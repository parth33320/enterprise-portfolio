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
  assert.ok(content.includes('api.github.com'), 'index.html should use GitHub API endpoint');
  // YouTube embed support
  assert.ok(content.includes('youtube-nocookie.com'), 'index.html should contain YouTube embed support');
  assert.ok(content.includes('extractYouTubeId'), 'index.html should contain YouTube ID extractor');
  assert.ok(content.includes('youtube-url-input'), 'index.html should contain YouTube URL input in admin modal');
  // Pin/Delete/Showcase features
  assert.ok(content.includes('Pinned Project'), 'index.html should contain Pinned Project badge');
  assert.ok(content.includes('admin-pin-btn'), 'index.html should contain admin pin button');
  assert.ok(content.includes('admin-delete-btn'), 'index.html should contain admin delete button');
  assert.ok(content.includes('togglePinProject'), 'index.html should contain togglePinProject function');
  assert.ok(content.includes('deleteProject'), 'index.html should contain deleteProject function');
  assert.ok(content.includes('renderPinnedCard'), 'index.html should contain renderPinnedCard function');
  assert.ok(content.includes('renderRegularCard'), 'index.html should contain renderRegularCard function');
  assert.ok(content.includes('Featured Projects'), 'index.html should contain Featured Projects section');
  assert.ok(content.includes('grid-cols-1 lg:grid-cols-2'), 'index.html should contain showcase grid layout');
  assert.ok(content.includes('pin-project-checkbox'), 'index.html should contain pin checkbox in admin modal');
  assert.ok(content.includes('updateAdminButtonsVisibility'), 'index.html should contain admin visibility helper');
  assert.ok(content.includes('PORTFOLIO_DATA'), 'index.html should use PORTFOLIO_DATA variable');
});

test('generated client-side script has no syntax errors', () => {
  const publicIndex = path.join(__dirname, '../public/index.html');
  const content = fs.readFileSync(publicIndex, 'utf8');
  
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'Should have inline script block');
  
  const scriptBody = scriptMatch[1];
  new Function(scriptBody); // strictly throws on any SyntaxError
  
  assert.ok(scriptBody.includes('function renderPortfolio'), 'Should contain renderPortfolio');
  assert.ok(scriptBody.includes('function extractYouTubeId'), 'Should contain extractYouTubeId');
  assert.ok(scriptBody.includes('function openTheaterModal'), 'Should contain openTheaterModal');
  assert.ok(scriptBody.includes('function togglePinProject'), 'Should contain togglePinProject');
  assert.ok(scriptBody.includes('function deleteProject'), 'Should contain deleteProject');
  assert.ok(scriptBody.includes('function renderPinnedCard'), 'Should contain renderPinnedCard');
  assert.ok(scriptBody.includes('function renderRegularCard'), 'Should contain renderRegularCard');
  assert.ok(scriptBody.includes('function updateAdminButtonsVisibility'), 'Should contain updateAdminButtonsVisibility');
});