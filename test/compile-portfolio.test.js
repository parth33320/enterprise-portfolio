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
  assert.ok(content.includes('Enterprise Automation Audit Hub'), 'index.html should contain page title');
});
