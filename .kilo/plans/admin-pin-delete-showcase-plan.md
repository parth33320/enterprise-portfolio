# Enterprise Portfolio: Admin Pin/Delete & Pinned Showcase Grid

## Overview
Implement three related admin features for the portfolio:
1. **Project Pinning** - Add `pinned: true` field, admin toggle, pinned badge
2. **Admin Delete Button** - Hidden delete with asset cleanup, `prompt('Type DELETE...')` confirmation
3. **Pinned Showcase Grid** - Side-by-side grid for pinned projects above the fold

---

## Current State

### Files to Modify
| File | Purpose |
|------|---------|
| `_job_queue/schema.json` | Add `pinned` field to schema |
| `_job_queue/history_registry.json` | Add `pinned: true` to first entry |
| `scripts/compile-portfolio.js` | Main implementation (HTML + client-side JS) |
| `test/compile-portfolio.test.js` | Add tests for new features |

### Current Portfolio Structure
- 5 entries in `history_registry.json`
- First entry: "Sovereign Supply Chain XR Walk" (YouTube)
- Rendered as vertical list in `#portfolio-grid` (space-y-8)
- Admin modal exists with token auth (localStorage `gh_portfolio_pat`)

---

## Design Decisions (Answered)

1. **Delete Confirmation**: `prompt('Type DELETE to permanently remove "' + item.companyName + '" from your portfolio:')` — exact match 'DELETE' required
2. **Pinned Grid Columns**: `grid-cols-1 lg:grid-cols-2 gap-6` (1 col mobile, 2 col desktop)
3. **Title Line Clamp**: `line-clamp-2` with `title="..."` tooltip on both `companyName` and `jobTitle`
4. **Asset Cleanup Scope**: Delete all unreferenced `docs/assets/` files — including `gifAsset`, `mediaAsset`, and `posterAsset` (e.g., `docs/assets/xxx-poster.jpg`)
5. **Pin Checkbox Default**: Checked by default in `#admin-upload-modal`
6. **Toast Duration**: Auto-dismiss after 4 seconds
7. **Button Icons**: Clean text labels (Pin / Unpin and Delete) or simple inline SVGs (no emoji)

---

## Critical Index Fix (Task 3.A)

**BUG**: In Task 3.A, using `.map((item, idx) => ...)` on filtered arrays gives the filtered index, NOT the original index in `PORTFOLIO_DATA`. This causes `togglePinProject` and `deleteProject` to target the wrong registry entry when filtering/searching.

**FIX**: 
1. Attach `originalIndex` before filtering: `const indexedItems = filteredItems.map(item => ({ item, originalIndex: PORTFOLIO_DATA.indexOf(item) }))`
2. Pass `originalIndex` to `togglePinProject(originalIndex)` and `deleteProject(originalIndex)`
3. Change `PORTFOLIO_DATA` from `const` to `let` so it can be reassigned after delete

---

## Current State

### Files to Modify
| File | Purpose |
|------|---------|
| `_job_queue/schema.json` | Add `pinned` field to schema |
| `_job_queue/history_registry.json` | Add `pinned: true` to first entry |
| `scripts/compile-portfolio.js` | Main implementation (HTML + client-side JS) |
| `test/compile-portfolio.test.js` | Add tests for new features |

### Current Portfolio Structure
- 5 entries in `history_registry.json`
- First entry: "Sovereign Supply Chain XR Walk" (YouTube)
- Rendered as vertical list in `#portfolio-grid` (space-y-8)
- Admin modal exists with token auth (localStorage `gh_portfolio_pat`)
- **`PORTFOLIO_DATA`** — client-side variable holding the registry array (must be declared with `let` for `deleteProject()` reassignment)

---

## Task 1: Project Pinning & Admin Pin Toggle

### Schema & Data Changes
1. **`_job_queue/schema.json`** - Add `"pinned": { "type": "boolean", "default": false }` to properties
2. **`_job_queue/history_registry.json`** - Add `"pinned": true` to entry 0 ("Sovereign Supply Chain XR Walk")

### Client-Side Changes (`scripts/compile-portfolio.js`)

#### A. Card Sorting in `renderPortfolio()`
- Partition `filteredItems` into `pinnedItems` and `regularItems` (stable sort)
- Render pinned items first, then regular items

#### B. PINNED Badge in Card Header
- Add next to REQ ID badge: `<span class="px-2 py-0.5 text-[10px] font-mono bg-amber-900/50 text-amber-300 border border-amber-800/50 rounded">PINNED</span>`
- Only show when `item.pinned === true`

#### C. Admin Pin/Unpin Button (Hidden by Default)
- Render in card header next to badges:
```html
<button type="button" onclick="togglePinProject(${originalIndex})" 
        class="admin-pin-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors" 
        data-index="${originalIndex}" title="Toggle pin">
  <span class="pin-text">Pin</span>
</button>
```
- Visibility controlled by `localStorage.getItem('gh_portfolio_pat')` check
- Updates when token saved/cleared in admin modal
- Button text toggles between "Pin" / "Unpin" based on `item.pinned`

#### D. `togglePinProject(originalIndex)` Function
1. Fetch registry via GitHub API
2. Decode with `base64ToUtf8`, flip `pinned` boolean
3. Commit back via `uploadToGitHubContents`
4. Update local `PORTFOLIO_DATA` (the `registry` variable)
5. Re-render `renderPortfolio()`
6. Call `updateAdminButtonsVisibility()` after re-render (since `renderPortfolio()` recreates card buttons in the DOM)
7. Show toast: "Pin updated — GitHub Pages deploying (~60s)" (auto-dismiss 4s)

#### E. Admin Modal: Pin Checkbox
- Add to Project Metadata section:
```html
<div class="flex items-center gap-2">
  <input type="checkbox" id="pin-project-checkbox" checked class="w-4 h-4 accent-cyan-500">
  <label class="text-xs font-mono text-slate-400">Pin this project to the top</label>
</div>
```
- Pass `pinned: pinProjectCheckbox.checked` in new entry

---

## Task 2: Hidden Admin Delete Button

### Client-Side Changes (`scripts/compile-portfolio.js`)

#### A. Delete Button in Card Header
- Render next to pin button:
```html
<button type="button" onclick="deleteProject(${originalIndex})" 
        class="admin-delete-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-800/60 transition-colors" 
        title="Delete project & asset">Delete</button>
```
- Same visibility logic as pin button (show when `gh_portfolio_pat` exists)

#### B. `deleteProject(originalIndex)` Function
1. Get item: `const item = PORTFOLIO_DATA[originalIndex]`
2. **Prompt confirmation**: `const answer = prompt('Type DELETE to permanently remove "' + item.companyName + '" from your portfolio:'); if (answer !== 'DELETE') return;`
3. Fetch registry via GitHub API, decode
4. Remove entry: `const [removed] = currentRegistry.splice(originalIndex, 1);`
4. Commit updated registry via `uploadToGitHubContents`
5. **Clean up unreferenced assets**:
   - Check `[removed.gifAsset, removed.mediaAsset, removed.posterAsset]`
   - For each path starting with `docs/assets/` (ignore `https://`):
     - Verify no other entry references it
     - Get SHA via `getFileSha(assetPath)`
     - Delete via `DELETE /repos/.../contents/${assetPath}` with `{ message, sha }`
6. Update local `PORTFOLIO_DATA` (reassign: `PORTFOLIO_DATA = currentRegistry`), re-render `renderPortfolio()`
7. Call `updateAdminButtonsVisibility()` after re-render (since `renderPortfolio()` recreates card buttons in the DOM)
8. Show toast: "Deleted — GitHub Pages updating (~60s)" (auto-dismiss 4s)

#### C. Admin Visibility Helper
- Single function `updateAdminButtonsVisibility()` that shows/hides both `.admin-pin-btn` and `.admin-delete-btn` based on `localStorage.getItem('gh_portfolio_pat')`
- Call on page load, token save, token clear

---

## Task 3: Pinned Showcase Grid (Side-by-Side Above Fold)

### `renderPortfolio()` Changes

#### A. Partition & Render (with Index Fix)
```javascript
// Attach originalIndex before partitioning
const indexedItems = filteredItems.map(item => ({
  item,
  originalIndex: PORTFOLIO_DATA.indexOf(item)
}));

const pinnedItems = indexedItems.filter(({ item }) => item.pinned === true);
const regularItems = indexedItems.filter(({ item }) => !item.pinned);

// If pinned items exist, render showcase grid first
if (pinnedItems.length > 0) {
  // Featured Projects section
  html += `
    <div class="mb-10 pb-8 border-b border-slate-800/80">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">Featured Projects</div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        ${pinnedItems.map(({ item, originalIndex }) => renderPinnedCard(item, originalIndex)).join('')}
      </div>
    </div>`;
}

// Then regular items in standard feed
html += `<div class="space-y-8">${regularItems.map(({ item, originalIndex }) => renderRegularCard(item, originalIndex)).join('')}</div>`;
```

#### B. Pinned Card Template (`renderPinnedCard`)
- Full-width card with `flex flex-col justify-between` layout
- **Title area**: `line-clamp-2` with `title="..."` tooltip on both `companyName` and `jobTitle`
- **Media container**: `aspect-video` with `mt-auto` so video players align at same height
- **Badges**: PINNED badge + REQ ID + admin buttons
- No truncation of titles (natural wrap up to 2 lines)

```html
<div class="case-card bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl shadow-2xl transition-all flex flex-col justify-between" data-search="...">
  <!-- Header with badges & admin buttons -->
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2 mb-4">
    <div class="flex flex-col gap-1">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">${companyName}</div>
      ${hasJobTitle ? `<h2 class="text-lg font-extrabold text-white font-sans mt-0.5 tracking-tight line-clamp-2" title="${jobTitle}">${jobTitle}</h2>` : ''}
    </div>
    <div class="flex items-center gap-2 flex-wrap">
      ${pinnedBadge}${reqBadge}${adminPinBtn}${adminDeleteBtn}
    </div>
  </div>
  <!-- Media with mt-auto for alignment -->
  <div class="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner relative group mt-auto">
    ${mediaHtml}
    <button class="absolute top-3 right-3 ..." onclick="openTheaterModal(...)">...</button>
  </div>
</div>
```

---

## Implementation Order

1. **Schema & Data** - Add `pinned` field, set first entry `pinned: true`
2. **Card Sorting & Pinned Badge** - Core rendering changes
3. **Admin Pin Toggle** - Button + `togglePinProject()` + modal checkbox
4. **Admin Delete Button** - Button + `deleteProject()` + asset cleanup
5. **Pinned Showcase Grid** - Partition rendering + new card template (with index fix)
6. **Admin Visibility Helper** - Single function for both buttons
7. **Tests** - Update test file
8. **Build & Verify** - `npm run build && npm run audit:bundle && npm test`

---

## Rollback Plan
```bash
git checkout HEAD -- _job_queue/schema.json _job_queue/history_registry.json scripts/compile-portfolio.js test/compile-portfolio.test.js
npm run build && npm test
```

---

## Success Criteria
- [ ] Schema validates `pinned` field
- [ ] First entry pinned by default
- [ ] Pinned items render first in showcase grid (side-by-side on lg+)
- [ ] PINNED badge visible on pinned cards
- [ ] Admin pin/unpin button works (hidden without token)
- [ ] Admin delete button works (prompt confirmation, asset cleanup)
- [ ] Asset cleanup removes unreferenced `docs/assets/` files
- [ ] Titles wrap naturally (line-clamp-2) with tooltip
- [ ] Video players align at same height (mt-auto)
- [ ] All tests pass
- [ ] Build succeeds
- [ ] Audit bundle generates