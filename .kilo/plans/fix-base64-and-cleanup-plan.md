# Fix Base64 Decoding Error & Clean Up Duplicate Functions

## Overview
Fix `atob` base64 decoding errors in pin/delete operations, clean up duplicate function definitions, fix template literal bug in deleteProject, and update audit script to exclude `.kilo/` directory.

## Issues Identified

### 1. Duplicate Function Definitions (Client-Side Script)
Lines 291-327 in `scripts/compile-portfolio.js` contain duplicate definitions:
- `fileToBase64` - defined at lines 234-243 and 291-301
- `extractYouTubeId` - defined at lines 246-265 and 304-323
- `isYouTubeUrl` - defined at lines 267-269 and 325-327

### 2. `base64ToUtf8` Not Bulletproof
Current implementation (line 226-231) doesn't handle:
- URL-safe base64 (`-`/`_` characters)
- Missing padding (`=`)
- GitHub API sometimes returns content via blob endpoint for large files

### 3. Missing `fetchRegistryJson` Helper
Three places fetch registry independently with duplicated logic:
- `togglePinProject` (line 930)
- `deleteProject` (line 966)
- `publishBtn` handler (lines 715, 820)

### 4. Template Literal Bug in `deleteProject`
Line 1017: `showToast('Deleted \${removed.companyName} — GitHub Pages updating (~60s)')` uses single quotes instead of backticks.

### 5. Audit Script Needs `.kilo/` Exclusion
`scripts/generate-repo-audit.js` doesn't exclude `.kilo/` directory.

---

## Implementation Plan

### Task 1: Fix `base64ToUtf8` and Add `fetchRegistryJson` Helper
**File:** `scripts/compile-portfolio.js` (client-side script section, lines 220-280)

**Changes:**
1. Update `base64ToUtf8` to handle URL-safe base64 and padding:
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

2. Add `fetchRegistryJson` helper after `getFileSha`:
```javascript
async function fetchRegistryJson() {
    const registryData = await githubApiRequest('/repos/parth33320/enterprise-portfolio/contents/_job_queue/history_registry.json');
    let rawText;
    if (registryData.content) {
        rawText = base64ToUtf8(registryData.content);
    } else {
        // Large file - fetch blob
        const blobData = await githubApiRequest(`/repos/parth33320/enterprise-portfolio/git/blobs/${registryData.sha}`);
        rawText = base64ToUtf8(blobData.content);
    }
    return { sha: registryData.sha, items: JSON.parse(rawText) };
}
```

### Task 2: Remove Duplicate Function Definitions
**File:** `scripts/compile-portfolio.js` (client-side script section, lines 291-327)

Remove the second definitions of:
- `fileToBase64` (lines 291-301)
- `extractYouTubeId` (lines 304-323)
- `isYouTubeUrl` (lines 325-327)

Keep only the first definitions (lines 234-243, 246-265, 267-269).

### Task 3: Update `togglePinProject` to Use `fetchRegistryJson`
**File:** `scripts/compile-portfolio.js` (lines 928-954)

Replace manual registry fetch with `fetchRegistryJson()` call.

### Task 4: Update `deleteProject` to Use `fetchRegistryJson` and Fix Template Literal
**File:** `scripts/compile-portfolio.js` (lines 956-1022)

1. Replace manual registry fetch with `fetchRegistryJson()` call
2. Fix line 1017: change single quotes to backticks:
```javascript
showToast(`Deleted ${removed.companyName} — GitHub Pages updating (~60s)`);
```

### Task 5: Update `publishBtn` Handler to Use `fetchRegistryJson`
**File:** `scripts/compile-portfolio.js` (lines 715, 820)

Replace manual registry fetch with `fetchRegistryJson()` call in both YouTube and file upload paths.

### Task 6: Fix `scripts/generate-repo-audit.js`
**File:** `scripts/generate-repo-audit.js` (line 24)

Add `.kilo/` exclusion:
```javascript
return !EXCLUDED_EXTS.has(ext) && !EXCLUDED_FILES.has(f) && !path.basename(f).startsWith('screenshot') && !f.startsWith('.kilo/');
```

### Task 7: Build, Audit & Test
Run:
```bash
npm run build && npm run audit:bundle && npm test
```

---

## Validation Checklist

- [ ] Duplicate function definitions removed
- [ ] `base64ToUtf8` handles URL-safe base64 and padding
- [ ] `fetchRegistryJson` helper added and used in 3 places
- [ ] `togglePinProject` uses `fetchRegistryJson`
- [ ] `deleteProject` uses `fetchRegistryJson` and template literal fixed
- [ ] `publishBtn` handler uses `fetchRegistryJson`
- [ ] `generate-repo-audit.js` excludes `.kilo/`
- [ ] `npm run build` succeeds
- [ ] `npm run audit:bundle` succeeds
- [ ] `npm test` passes (both tests)

---

## Rollback Plan
```bash
git checkout HEAD -- scripts/compile-portfolio.js scripts/generate-repo-audit.js
npm run build && npm test
```