# Plan: Fix Base64 Decoding Error, Clean Up Duplicates, Replace PINNED Badge

## Overview
Fix `atob` Base64 decoding errors in `scripts/compile-portfolio.js`, remove duplicate function definitions, fix string interpolation bug, update repo audit exclusion, and replace "PINNED" text badge with transparent pushpin SVG icon.

---

## Affected Files
1. `scripts/compile-portfolio.js` - Main compilation script
2. `scripts/generate-repo-audit.js` - Repo audit generator
3. `test/compile-portfolio.test.js` - Test assertions

---

## Tasks

### 1. Fix `base64ToUtf8` Function (Node & Client-side)
**Location**: `scripts/compile-portfolio.js` lines 12-17 (Node) and lines 226-231 (client-side)

**Current Problem**: `atob()` fails on URL-safe Base64 (`-`/`_`) and missing padding (`=`).

**Fix**: Update both implementations to:
- Strip whitespace
- Convert URL-safe chars: `-` → `+`, `_` → `/`
- Restore missing `=` padding
- Then decode

```javascript
function base64ToUtf8(b64) {
    let clean = (b64 || '').replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) clean += '=';
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
}
```

### 2. Add `fetchRegistryJson` Helper (Client-side)
**Location**: Client-side script section in `scripts/compile-portfolio.js`

**Purpose**: Robustly fetch registry handling both inline content and blob fallback for large files.

**Implementation**:
```javascript
async function fetchRegistryJson() {
    const registryData = await githubApiRequest('/repos/parth33320/enterprise-portfolio/contents/_job_queue/history_registry.json');
    let rawText;
    if (registryData.content && registryData.content.trim()) {
        rawText = base64ToUtf8(registryData.content);
    } else if (registryData.sha) {
        // Large file: content is empty, fetch blob
        const blobData = await githubApiRequest(`/repos/parth33320/enterprise-portfolio/git/blobs/${registryData.sha}`);
        rawText = base64ToUtf8(blobData.content);
    } else {
        throw new Error('Registry response missing content and sha');
    }
    return { sha: registryData.sha, items: JSON.parse(rawText) };
}
```

**Usage**: Replace registry fetching in `togglePinProject`, `deleteProject`, and `publishBtn` (both YouTube and file paths).

### 3. Remove Duplicate Function Definitions (Client-side)
**Location**: Lines 291-327 in `scripts/compile-portfolio.js`

**Duplicates to Remove** (keep first occurrence at lines 233-269):
- `fileToBase64` (lines 291-301)
- `extractYouTubeId` (lines 303-323)
- `isYouTubeUrl` (lines 325-327)

### 4. Fix String Interpolation Bug in `deleteProject`
**Location**: Line 1017

**Current**: `'Deleted \${removed.companyName} — GitHub Pages updating (~60s)'` (single quotes)

**Fix**: Use backticks: `` `Deleted ${removed.companyName} — GitHub Pages updating (~60s)` ``

### 5. Update `generate-repo-audit.js` Exclusions
**Location**: `scripts/generate-repo-audit.js` line 24

**Change**: Add `!f.startsWith('.kilo/')` to filter

```javascript
.filter(f => {
    const ext = path.extname(f).toLowerCase();
    return !EXCLUDED_EXTS.has(ext) && !EXCLUDED_FILES.has(f) && !path.basename(f).startsWith('screenshot') && !f.startsWith('.kilo/');
})
```

### 6. Replace "PINNED" Text Badge with Pushpin SVG Icon
**Locations**: 
- `renderPinnedCard` line 1044
- `renderRegularCard` line 1091

**Current**: 
```javascript
const pinnedBadge = item.pinned ? `<span class="px-2 py-0.5 text-[10px] font-mono bg-amber-900/50 text-amber-300 border border-amber-800/50 rounded">PINNED</span>` : '';
```

**Replacement**:
```javascript
const pinnedBadge = item.pinned ? `<span class="inline-flex items-center justify-center text-amber-400/90 hover:text-amber-300 transition-colors shrink-0" title="Pinned Project" aria-label="Pinned Project"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3a1 1 0 0 1 .117 1.993L16 5v4.764l1.894 3.789a1 1 0 0 1 .1.331L18 14v2a1 1 0 0 1-.883.993L17 17h-4v4a1 1 0 0 1-1.993.117L11 21v-4H7a1 1 0 0 1-.993-.883L6 16v-2a1 1 0 0 1 .06-.34l.046-.107L8 9.763V5a1 1 0 0 1-.117-1.993L8 3h8z"/></svg></span>` : '';
```

### 7. Update Test Assertions
**Location**: `test/compile-portfolio.test.js` line 44

**Change**: 
- From: `assert.ok(content.includes('PINNED'), 'index.html should contain PINNED badge')`
- To: `assert.ok(content.includes('Pinned Project'), 'index.html should contain Pinned Project badge')`

### 8. Run Validation Commands
```bash
npm run build && npm run audit:bundle && npm test
```

Verify zero errors.

---

## Risk Assessment
- **Low Risk**: All changes are localized to well-defined functions
- **Medium Risk**: Registry fetching change affects three call sites; must verify all paths use new helper
- **Low Risk**: Test assertion change is straightforward

---

## Rollback Plan
If validation fails:
1. Revert `scripts/compile-portfolio.js` to git HEAD
2. Revert `scripts/generate-repo-audit.js` to git HEAD
3. Revert `test/compile-portfolio.test.js` to git HEAD
4. Re-run validation

---

## Success Criteria
- [ ] `npm run build` completes without errors
- [ ] `npm run audit:bundle` generates `docs/repo_audit.txt` without `.kilo/` files
- [ ] `npm test` passes all assertions
- [ ] Generated `public/index.html` contains pushpin SVG instead of "PINNED" text
- [ ] No duplicate function definitions in client-side script
- [ ] `deleteProject` toast message interpolates project name correctly