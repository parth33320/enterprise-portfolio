# Restore & Fix YouTube Embed Support with Safe URL Parsing

## Current State Analysis

**File Status:** `scripts/compile-portfolio.js` exists but has issues:

| Issue | Location | Impact |
|-------|----------|--------|
| YouTube regex with unescaped `/` | Lines 247-248 | Template literal corrupts regex → SyntaxError in browser |
| Dead code: `uploadReleaseAsset()` | Lines 600-621 | Unused, bloats bundle |
| Dead code: `getOrCreateRelease()` | Lines 623-640 | Unused, bloats bundle |
| Dead code: `imageIcon` constant | Line 78 | Unused SVG |
| history_registry.json index 0 | `gifAsset: "docs/assets/xr-supply-chain.mp4"` | Should be YouTube URL |
| Test missing script syntax validation | test/compile-portfolio.test.js | Won't catch JS SyntaxError |

---

## Implementation Plan

### Task 1: Fix YouTube ID Extraction (Replace Regex with URL Parsing)

**File:** `scripts/compile-portfolio.js` (client-side `<script>` block)

**Replace `extractYouTubeId()` at lines 244-255** with URL-based parsing (no regex literals → no escaping issues):

```javascript
function extractYouTubeId(url) {
    if (!url) return null;
    try {
        const parsed = new URL(url.trim());
        const host = parsed.hostname.replace(/^www\./, '');
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

---

### Task 2: Remove Dead Code

**File:** `scripts/compile-portfolio.js`

1. **Delete `imageIcon` constant** (line 78) — unused
2. **Delete `uploadReleaseAsset()`** (lines 600-621) — unused since 70 MB threshold
3. **Delete `getOrCreateRelease()`** (lines 623-640) — unused since 70 MB threshold

---

### Task 3: Fix `history_registry.json` Top Entry

**File:** `_job_queue/history_registry.json`

**Entry 0** (`Sovereign Supply Chain XR Walk`):
```json
"gifAsset": "https://youtu.be/HIYQntcQqAY"
```

---

### Task 4: Add Script Syntax Validation to Tests

**File:** `test/compile-portfolio.test.js`

Add new test that extracts `<script>...</script>` from `public/index.html` and validates with `new Function()`:

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
});
```

Also add assertion to verify `renderPortfolio` exists in generated script:
```javascript
assert.ok(scriptBody.includes('function renderPortfolio'), 'Should contain renderPortfolio');
```

---

### Task 5: Verify Build & Tests

```bash
npm run build && npm test
```

**Expected:** Zero errors, all assertions pass.

---

## Validation Checklist

- [ ] `extractYouTubeId()` uses `new URL()` parsing (no regex literals)
- [ ] No `uploadReleaseAsset` / `getOrCreateRelease` in generated HTML
- [ ] No `imageIcon` in generated HTML
- [ ] `history_registry.json` index 0 has YouTube URL
- [ ] Test validates script syntax with `new Function()`
- [ ] `npm run build` succeeds
- [ ] `npm test` passes all assertions
- [ ] Generated `public/index.html` has valid JS (no SyntaxError)

---

## Rollback Plan

```bash
git checkout HEAD -- scripts/compile-portfolio.js _job_queue/history_registry.json test/compile-portfolio.test.js
npm run build && npm test
```

---

## Success Criteria

- Portfolio cards render on `https://parth33320.github.io/enterprise-portfolio/`
- Sovereign Supply Chain XR Walk shows YouTube iframe
- Theater modal works for YouTube, video, and images
- No dead code in production bundle
- CI/CD builds cleanly