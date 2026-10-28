# Project Lessons Learned & Decision Rationale Log

This file serves as the canonical record of architectural decisions, visual layout standards, and procedural agreements made across all Jules development sessions.

---

## 1. Mandatory Session Protocol for Future Jules Sessions

1. **Pre-Execution Reading Requirement**: Before starting any code generation or layout modifications, future Jules sessions **MUST** read the entire repository context, `docs/RUBRIC.md`, and `LESSONS_LEARNED.md`.
2. **Interactive Alignment & Wireframes**: If any proposed changes alter visual UI, media generation, or user presentation, Jules **MUST** present BEFORE and AFTER text wireframes to the user and obtain explicit confirmation before editing code.
3. **Session Append Requirement**: Upon completing a task or session, Jules **MUST** append any newly agreed architectural decisions, layout updates, and their specific rationales to `LESSONS_LEARNED.md`.

---

## 2. Key Architectural & Presentation Decisions

### **Decision 1: Permanent Removal of Terminal Streams from Demo Templates**
- **Date**: October 27, 2026
- **Decision**: Permanently eliminate terminal stream boxes, terminal status badges (`IDLE`, `RUNNING`, `COMPLETE`), and streaming log scripts from `server.js` and all walkthrough templates.
- **Rationale**: Terminal streams added technical clutter and unnecessary scrolling without conveying actionable business value to executive viewers, hiring managers, or recruiters. Removing them creates a clean, professional executive interface focused strictly on business impacts and high-contrast result summaries.

### **Decision 2: Expanded Results Panel Layout**
- **Date**: October 27, 2026
- **Decision**: Expand execution result containers (`publishing-results` and `webhook-results`) to `min-h-[180px]` / `max-h-[220px]` with internal `overflow-y-auto`.
- **Rationale**: Eliminating terminal streams left empty whitespace. Expanding result containers allows displaying clear, structured bullet points, operational status, and KPI summaries directly inside the results card without cluttering the screen or introducing empty gaps.

### **Decision 3: Universal Dynamic Font & Chip Scaling (Zero Vertical Cutoff Invariant)**
- **Date**: October 27, 2026
- **Decision**: Standardize smaller KPI chip sizing (`p-2.5` padding, `text-xs`/`text-sm` font sizes) in Section 1 and establish a strict zero-vertical-clipping invariant across all 1280x720 video walkthrough frames. All text font sizes and container padding must scale dynamically depending on surrounding content.
- **Rationale**: On slides with larger descriptive text or additional metrics, large fixed padding or font sizes caused the bottom of KPI chips or result containers to be clipped in 1280x720 recorded videos. Dynamic scaling guarantees 100% text visibility across all video walkthrough slides.

### **Decision 4: Versioning of Standardization Governance in `docs/RUBRIC.md`**
- **Date**: October 27, 2026
- **Decision**: Increment `docs/RUBRIC.md` to version `v2.2`, codifying the permanent removal of terminal stream rules, dynamic text scaling rules, and zero-cutoff viewport guarantees.
- **Rationale**: Keeps governance rules synchronized with codebase presentation outputs, ensuring automated CI/CD pipelines and future agent sessions remain compliant.

### **Decision 5: Consolidated Single-Panel Layout & Strict Terminology Rules (Rubric v2.3)**
- **Date**: March 30, 2026
- **Decision**: Update `docs/RUBRIC.md` to v2.3 to codify:
  1. **Single Consolidated Workflow Panel**: Inner software mockups use a single panel with a 3-step labeled progress bar instead of split side-by-side execution boxes.
  2. **KPI Chips Single-Location Enforcement**: 6-KPI Chips Grid renders exclusively in Section 1 Executive Brief view (`mode=section1`) and is removed from Section 1 Title Cards.
  3. **Architectural Justification Title Card Enforcement**: Process of Elimination Architectural Justification renders exclusively on Section 4 Title Cards in `scripts/generate-walkthrough-gif.js`.
  4. **Inner Mockup Space Preservation**: Tab navigation headers are eliminated to preserve vertical viewport height.
  5. **Strict Micro-Solution & Legacy Pain Terminology**: Results containers format each entry as `Micro-Solution X: [Title]`, explain what it does in simple English, and frame legacy failures strictly as `Legacy Pain:` without `"Without this,"`.
- **Rationale**: Eliminates duplication, maximizes vertical screen real estate within 1280x720 video recordings, enforces strict ubiquitous terminology, and provides clear civilian accessibility.
