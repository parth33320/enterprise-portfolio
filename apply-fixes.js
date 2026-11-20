const fs = require('fs');

// ============================================================
// 1. Fix scripts/compile-portfolio.js
// ============================================================
let c = fs.readFileSync('scripts/compile-portfolio.js', 'utf8');

// Replace extractYouTubeId function
c = c.replace(
    /\/\/ YouTube URL helpers[\s\S]*?function isYouTubeUrl\(url\) \{/,
    `// YouTube URL helpers
        function extractYouTubeId(url) {
            if (!url) return null;
            try {
                const parsed = new URL(url.trim());
                const host = parsed.hostname.replace(/^www\\./, '');
                let id = null;
                if (host === 'youtu.be') {
                    id = parsed.pathname.split('/').filter(Boolean)[0] || null;
                } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
                    if (parsed.pathname === '/watch') {
                        id = parsed.searchParams.get('v');
                    } else if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
                        id = parsed.pathname.split('/')[2] || null;
                    }
                }
                return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
            } catch (e) {
                return null;
            }
        }

        function isYouTubeUrl(url) {`
);

// Remove imageIcon constant (line ~78)
c = c.replace(
    /const imageIcon = `[^`]*`;\s*\n/,
    ''
);

// Remove uploadReleaseAsset function
c = c.replace(
    /\s*async function uploadReleaseAsset\(releaseId, file, fileName\) \{[\s\S]*?\n\s*\}/,
    ''
);

// Remove getOrCreateRelease function
c = c.replace(
    /\s*async function getOrCreateRelease\(\) \{[\s\S]*?\n\s*\}/,
    ''
);

fs.writeFileSync('scripts/compile-portfolio.js', c);
console.log('scripts/compile-portfolio.js updated');

// ============================================================
// 2. Fix _job_queue/history_registry.json
// ============================================================
const registry = JSON.parse(fs.readFileSync('_job_queue/history_registry.json', 'utf8'));
if (registry[0] && registry[0].companyName === 'Sovereign Supply Chain XR Walk') {
    registry[0].gifAsset = 'https://youtu.be/HIYQntcQqAY';
    fs.writeFileSync('_job_queue/history_registry.json', JSON.stringify(registry, null, 2));
    console.log('_job_queue/history_registry.json updated');
}

// ============================================================
// 3. Add script syntax validation test
// ============================================================
const testFile = 'test/compile-portfolio.test.js';
let testContent = fs.readFileSync(testFile, 'utf8');

const newTest = `
test('generated client-side script has no syntax errors', () => {
  const publicIndex = path.join(__dirname, '../public/index.html');
  const content = fs.readFileSync(publicIndex, 'utf8');
  
  const scriptMatch = content.match(/<script>([\\s\\S]*?)<\\/script>/);
  assert.ok(scriptMatch, 'Should have inline script block');
  
  const scriptBody = scriptMatch[1];
  new Function(scriptBody); // throws on SyntaxError
  
  assert.ok(scriptBody.includes('function renderPortfolio'), 'Should contain renderPortfolio');
  assert.ok(scriptBody.includes('function extractYouTubeId'), 'Should contain extractYouTubeId');
  assert.ok(scriptBody.includes('function openTheaterModal'), 'Should contain openTheaterModal');
});`;

if (!testContent.includes('generated client-side script has no syntax errors')) {
    // Insert before the closing brace of the file
    testContent = testContent.replace(
        /\}\);/,
        `  ${newTest}\n});`
    );
    fs.writeFileSync(testFile, testContent);
    console.log('test/compile-portfolio.test.js updated');
}

console.log('All changes applied successfully!');