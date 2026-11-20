# Final Pair-Programming Polish & URL Fixes

## Problem
Four targeted bugs in the client-side code serialized by `compile-portfolio.js` and one guard missing in `generate-walkthrough-gif.js`:

1. **YouTube embed URLs** — `${ytId}` missing `/embed/` segment in two places
2. **GitHub asset delete endpoint** — Uses `api.github.com` instead of `github.com` for Contents API DELETE
3. **`escapeAttr` function** — No-op replacements that don't actually escape HTML entities
4. **Standalone entry guard** — `generate-walkthrough-gif.js` crashes on entries without `reqId`

## Files to Modify
1. `scripts/compile-portfolio.js` — 4 edits inside `clientAppBootstrap` function
2. `scripts/generate-walkthrough-gif.js` — 1 edit after `if (!jobData)` check

## Exact Edits Required

### 1. Fix YouTube embed URL in `openTheaterModal` (line ~167)
```javascript
// Current (broken)
iframe.src = `https://youtube-nocookie.com${ytId}?autoplay=1&rel=0`;

// Fixed (include www. and /embed/)
iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
```

### 2. Fix YouTube embed URL in `buildMediaHtml` (line ~717)
```javascript
// Current (broken)
return `<iframe src="https://youtube-nocookie.com${ytId}?rel=0" ...`;

// Fixed (include www. and /embed/)
return `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0" ...`;
```

### 3. Fix GitHub asset delete endpoint in `deleteProject` (line ~674)
```javascript
// Current (wrong endpoint - direct fetch with github.com)
await fetch(`https://github.com${assetPath}`, {
  method: 'DELETE',
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message: `Delete unused asset: ${assetPath}`, sha })
});

// Fixed (use existing githubApiRequest helper which prepends correct host)
await githubApiRequest('/repos/parth33320/enterprise-portfolio/contents/' + assetPath, { 
  method: 'DELETE', 
  headers: { 'Content-Type': 'application/json' }, 
  body: JSON.stringify({ message: 'Delete unused asset: ' + assetPath, sha }) 
});
```

### 4. Fix `escapeAttr` function (lines ~123-129)
```javascript
// Current (no-op - replaces with same characters)
function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}

// Fixed (real HTML entity encoding with full entity names)
function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&')
    .replace(/"/g, '"')
    .replace(/</g, '<')
    .replace(/>/g, '>');
}
```

### 5. Add standalone entry guard in `generate-walkthrough-gif.js` (after line 26)
```javascript
// Current
if (!jobData) {
  console.log('[Jules Media Engine] No job data found. Exiting media compiler.');
  return;
}

// Fixed - add guard right after
if (!jobData) {
  console.log('[Jules Media Engine] No job data found. Exiting media compiler.');
  return;
}
if (!jobData.reqId) {
  console.log('[Jules Media Engine] Top entry is standalone/YouTube (no reqId). Skipping GIF recording.');
  return;
}
```

## Validation Steps
```powershell
npm run build
npm run audit:bundle
npm test
# Expect: 2 pass, 0 fail
```

## Commit & Push
```powershell
git pull origin main --rebase
git add -A
git commit -m "fix: YouTube embed URLs, GitHub delete endpoint, escapeAttr, and standalone guard"
git push origin main
```

## Risk Assessment
- **Low risk**: All changes are localized, surgical fixes
- **No behavior change** for non-YouTube entries
- **Test coverage**: Existing tests verify HTML structure and script syntax validity
- **YouTube fix**: Adds missing `www.` prefix and `/embed/` path segment required by youtube-nocookie.com
- **GitHub API fix**: Uses existing `githubApiRequest` helper (correct auth, host, headers) for Contents API DELETE
- **escapeAttr fix**: Uses proper HTML entities (`&`, `"`, `<`, `>`) to prevent XSS and broken attributes
- **Standalone guard**: Prevents crash on YouTube-only or standalone entries