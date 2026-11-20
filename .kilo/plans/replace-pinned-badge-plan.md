# Replace PINNED Text Badge with Pushpin SVG Icon

## Overview
Replace the text-based "PINNED" badge with a clean pushpin SVG icon in portfolio cards, update tests accordingly, and verify the build.

## Current State
- Two card templates use text badge: `renderPinnedCard` (line ~1044) and `renderRegularCard` (line ~1091)
- Both use `<span class="...">PINNED</span>` text badge
- Test file asserts `PINNED` text in generated HTML

## Implementation Plan

### Task 1: Update `renderPinnedCard` Function
**File:** `scripts/compile-portfolio.js` (around line 1044)
Replace the `pinnedBadge` template literal:
```javascript
const pinnedBadge = item.pinned ? `<span class="inline-flex items-center justify-center text-amber-400/90 hover:text-amber-300 transition-colors shrink-0" title="Pinned Project" aria-label="Pinned Project"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3a1 1 0 0 1 .117 1.993L16 5v4.764l1.894 3.789a1 1 0 0 1 .1.331L18 14v2a1 1 0 0 1-.883.993L17 17h-4v4a1 1 0 0 1-1.993.117L11 21v-4H7a1 1 0 0 1-.993-.883L6 16v-2a1 1 0 0 1 .06-.34l.046-.107L8 9.763V5a1 1 0 0 1-.117-1.993L8 3h8z"/></svg></span>` : '';
```

### Task 2: Update `renderRegularCard` Function
**File:** `scripts/compile-portfolio.js` (around line 1091)
Same replacement as above.

### Task 3: Update Test Assertions
**File:** `test/compile-portfolio.test.js`
Change assertion from:
```javascript
assert.ok(content.includes('PINNED'), 'index.html should contain PINNED badge');
```
To:
```javascript
assert.ok(content.includes('Pinned Project'), 'index.html should contain Pinned Project tooltip');
```

### Task 4: Build, Audit & Test
Run:
```bash
npm run build && npm run audit:bundle && npm test
```

Then push to main.

---

## Validation Checklist
- [ ] PINNED text badge replaced with pushpin SVG in both card templates
- [ ] SVG has `title="Pinned Project"` and `aria-label="Pinned Project"`
- [ ] Test assertion updated to check for "Pinned Project"
- [ ] `npm run build` succeeds
- [ ] `npm run audit:bundle` succeeds
- [ ] `npm test` passes (both tests)
- [ ] Push to main