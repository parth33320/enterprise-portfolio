# Auto-Generate `docs/repo_audit.txt` on Every Push via GitHub Actions

## Overview
Create a lightweight script and GitHub Actions workflow so that every push to `main` or any `feat/**` branch automatically bundles all tracked non-binary source files into `docs/repo_audit.txt` and commits it back to that branch.

---

## Current State Analysis

### Repository Structure
- Node.js project with npm scripts
- GitHub Actions workflow for deployment (`.github/workflows/deploy.yml`)
- Source files: `.js`, `.json`, `.md`, `.css`, `.py`, `.html` files
- Binary assets in `docs/assets/` (GIFs) and `public/` (generated)
- Build outputs: `public/index.html`, `public/styles.css`

### Files to Include in Audit
Tracked source files (UTF-8 text):
- `scripts/*.js`, `scripts/*.py`
- `*.json` (except `package-lock.json`)
- `*.md`, `*.css`, `.html` (except generated `public/`)
- `server.js`, `*.txt`, `*.yml`
- `.github/workflows/*.yml`

### Files to Exclude
- Binary media: `.gif`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.mp4`, `.webm`, `.ico`, `.woff`, `.woff2`
- Lockfile: `package-lock.json`
- Generated build outputs: `public/index.html`, `public/styles.css`
- Self-reference: `docs/repo_audit.txt`
- Logs: `server.log`
- Screenshots: `screenshot*.png`

---

## Implementation Plan

### Task 1: Create `scripts/generate-repo-audit.js`

**Location:** `scripts/generate-repo-audit.js`

**Requirements:**
- Use only Node built-ins (`child_process`, `fs`, `path`)
- Run `git ls-files` to get all tracked files
- Filter out excluded extensions and specific files
- Sort file paths alphabetically
- Read each file as UTF-8
- Write concatenated bundle to `docs/repo_audit.txt` with `=== <filepath> ===` headers

**Pseudo-code:**
```javascript
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXCLUDED_EXTS = new Set([
  '.gif', '.png', '.jpg', '.jpeg', '.webp', '.mp4', '.webm',
  '.ico', '.woff', '.woff2'
]);
const EXCLUDED_FILES = new Set([
  'package-lock.json',
  'public/index.html',
  'public/styles.css',
  'docs/repo_audit.txt',
  'server.log'
]);

// Get all tracked files
const files = execSync('git ls-files', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(f => f)
  .filter(f => {
    const ext = path.extname(f).toLowerCase();
    return !EXCLUDED_EXTS.has(ext) && !EXCLUDED_FILES.has(f) && !path.basename(f).startsWith('screenshot');
  })
  .sort();

// Build bundle
let bundle = '';
for (const file of files) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    bundle += `=== ${file} ===\n${content}\n\n`;
  } catch (e) {
    console.warn(`Skipping ${file}: ${e.message}`);
  }
}

fs.writeFileSync('docs/repo_audit.txt', bundle);
console.log(`Generated repo_audit.txt with ${files.length} files`);
```

### Task 2: Add npm Script

**File:** `package.json`

Add to `scripts`:
```json
"audit:bundle": "node scripts/generate-repo-audit.js"
```

### Task 3: Create GitHub Actions Workflow

**File:** `.github/workflows/repo-audit.yml`

```yaml
name: Update Repo Audit

on:
  push:
    branches: [ main, 'feat/**' ]
    paths-ignore:
      - 'docs/repo_audit.txt'

permissions:
  contents: write

jobs:
  update-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout branch
        uses: actions/checkout@v4
        with:
          ref: ${{ github.ref_name }}
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Generate repo audit
        run: node scripts/generate-repo-audit.js

      - name: Commit and push if changed
        run: |
          if [ -z "$(git status --porcelain docs/repo_audit.txt)" ]; then
            echo "No changes to repo_audit.txt"
          else
            git config user.name "github-actions[bot]"
            git config user.email "github-actions[bot]@users.noreply.github.com"
            git add docs/repo_audit.txt
            git commit -m "chore: update repo_audit.txt [skip ci]"
            git push
          fi
```

### Task 4: Local Verification

Run locally to populate initial audit:
```bash
npm run audit:bundle && npm test
```

Verify:
- `docs/repo_audit.txt` exists
- Contains expected source files
- No binary files included
- `public/index.html`, `public/styles.css`, `docs/repo_audit.txt` excluded
- Headers formatted as `=== <filepath> ===`

### Task 5: Run Tests

```bash
npm test
```

Ensure existing tests still pass.

---

## Validation Checklist

- [ ] `scripts/generate-repo-audit.js` created and executable
- [ ] `npm run audit:bundle && npm test` works locally
- [ ] `docs/repo_audit.txt` generated with correct format
- [ ] Binary files excluded (GIFs, PNGs, etc.)
- [ ] Excluded files not in bundle (package-lock.json, public/index.html, public/styles.css, server.log, docs/repo_audit.txt)
- [ ] `.github/workflows/repo-audit.yml` created
- [ ] Workflow triggers on `main` and `feat/**` pushes
- [ ] `paths-ignore` prevents infinite loop
- [ ] `git status --porcelain` check handles untracked files
- [ ] `npm test` passes

---

## Rollback Plan

```bash
git rm scripts/generate-repo-audit.js
git rm .github/workflows/repo-audit.yml
# Remove "audit:bundle" from package.json
git checkout HEAD -- package.json
```

---

## Success Criteria

- [ ] Every push to `main` or `feat/**` updates `docs/repo_audit.txt`
- [ ] Single permanent URL: `https://raw.githubusercontent.com/parth33320/enterprise-portfolio/main/docs/repo_audit.txt`
- [ ] No infinite loop (workflow ignores its own commits via `paths-ignore` and `[skip ci]`)
- [ ] All existing tests pass
- [ ] Zero external dependencies added
- [ ] `npm run audit:bundle && npm test` passes locally