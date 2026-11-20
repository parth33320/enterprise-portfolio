# Fix YouTube Embed URL Parsing, Clean Up Dead Code, and Verify Build on `feat/fix-youtube-embed`

## Context
- Work on a new branch `feat/fix-youtube-embed` (do NOT push directly to `main`).
- `scripts/compile-portfolio.js` exists, so do NOT overwrite or reset it from old Git history—apply these targeted fixes directly.

## Current Issues

### 1. YouTube Regex Corruption in Template Literal
**File:** `scripts/compile-portfolio.js` (lines 247-248)
The regex literals inside the Node.js template literal have forward slashes that get corrupted:
```javascript
// Current (BROKEN - will produce invalid JS in generated HTML):
const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/.*[?&]v=([a-zA-Z0-9_-]{11})/
];
```

### 2. Dead Code to Remove
- `imageIcon` constant (line 78) - unused SVG
- `uploadReleaseAsset()` function (lines 600-621) - unused since 70 MB threshold
- `getOrCreateRelease()` function (lines 623-640) - unused since 70 MB threshold

### 3. Wrong Media URL for Top Card
**File:** `_job_queue/history_registry.json` (line 15)
Entry 0 (`Sovereign Supply Chain XR Walk`) has `"gifAsset": "docs/assets/xr-supply-chain.mp4"` — should be a YouTube URL.

### 4. Missing Script Syntax Validation in Tests
**File:** `test/compile-portfolio.test.js` - needs to extract and validate inline `<script>` block.

---

## Implementation Plan

### Step 1: Create Branch `feat/fix-youtube-embed`
```bash
git checkout -b feat/fix-youtube-embed
```

### Step 2: Replace `extractYouTubeId()` with Safe `new URL()` Parsing
**File:** `scripts/compile-portfolio.js` (client-side `<script>` block, lines 244-255)

Replace the regex-based `extractYouTubeId()` with URL-based parsing (no regex literals → no escaping issues):

```javascript
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
```

**Note:** The final regex `/^[a-zA-Z0-9_-]{11}$/` uses `$` not `\$` — no backslashes anywhere.

**Verify:** Card iframe renders `src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0"` and theater modal iframe renders `src="https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0"`.

---

### Step 3: Remove Dead Code
**File:** `scripts/compile-portfolio.js`

Delete these three items:
1. `imageIcon` constant (line 78) — unused SVG
2. `uploadReleaseAsset()` function (lines 600-621) — unused since 70 MB threshold
3. `getOrCreateRelease()` function (lines 623-640) — unused since 70 MB threshold

---

### Step 4: Fix Top Card Media URL in `history_registry.json`
**File:** `_job_queue/history_registry.json` (line 15)

Change entry 0 (`Sovereign Supply Chain XR Walk`):
```json
"gifAsset": "https://youtu.be/HIYQntcQqAY"
```
(Use the actual YouTube video ID for the WebXR walkthrough.)

---

### Step 5: Add Script Syntax Validation to Tests
**File:** `test/compile-portfolio.test.js`

Add a new test that extracts the inline `<script>...</script>` block from `public/index.html` and validates it with `new Function()`:

```javascript
test('generated client-side script has no syntax errors', () => {
  const publicIndex = path.join(__dirname, '../public/index.html');
  const content = fs.readFileSync(publicIndex, 'utf8');
  
  // Extract inline script content
  const scriptMatch = content.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, 'Should have inline script block');
  
  const scriptBody = scriptMatch[1];
  
  // This throws on SyntaxError
  new Function(scriptBody);
  
  // Also verify key functions exist
  assert.ok(scriptBody.includes('function renderPortfolio'), 'Should contain renderPortfolio');
  assert.ok(scriptBody.includes('function extractYouTubeId'), 'Should contain extractYouTubeId');
  assert.ok(scriptBody.includes('function openTheaterModal'), 'Should contain openTheaterModal');
});
```

---

### Step 6: Build, Test & Push Branch
```bash
npm run build && npm test
```

Verify zero errors, then commit and push to `feat/fix-youtube-embed`:
```bash
git add scripts/compile-portfolio.js _job_queue/history_registry.json test/compile-portfolio.test.js
git commit -m "fix: YouTube embed parsing, remove dead code, add script validation"
git push origin feat/fix-youtube-embed
```

---

## Validation Checklist

- [ ] `extractYouTubeId()` uses `new URL()` parsing (no regex literals in template)
- [ ] No `uploadReleaseAsset` / `getOrCreateRelease` in generated HTML
- [ ] No `imageIcon` in generated HTML
- [ ] `history_registry.json` entry 0 has YouTube URL
- [ ] Test validates script syntax with `new Function()`
- [ ] `npm run build` succeeds
- [ ] `npm test` passes all assertions
- [ ] Generated `public/index.html` has valid JS (no SyntaxError)
- [ ] YouTube iframe renders correctly for top card

---

## Rollback Plan

```bash
git checkout main
git branch -D feat/fix-youtube-embed
```

---

## Success Criteria

- Portfolio cards render on `https://parth33320.github.io/enterprise-portfolio/`
- Sovereign Supply Chain XR Walk shows YouTube iframe
- Theater modal works for YouTube, video, and images
- No dead code in production bundle
- CI/CD builds cleanly on the feature branch