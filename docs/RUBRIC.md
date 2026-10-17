# System Portfolio & Walkthrough Standardization Rubric (v1.3)

This document establishes the official design, presentation, UI, terminology, and governance standards for all portfolio web assets (`public/index.html`), demonstration applications (`server.js`), and generated media walkthroughs (`scripts/generate-walkthrough-gif.js`).

---

## 1. Core Principles & Continual Learning Protocol

### **1.1 Continual Learning & Versioning**
- Every future session that modifies web assets, walkthrough scripts, or demonstration pages **MUST** read `docs/RUBRIC.md` to verify full compliance.
- When new capabilities, layout improvements, or solution patterns are merged into the repository, the active session **MUST** update `docs/RUBRIC.md` and increment the version (e.g., `v1.0` → `v1.1` → `v1.2` → `v1.3`).
- Historical PRs, git logs, and `docs/plans/` serve as training data for future agents to continuously improve solution quality.

### **1.2 Mandatory Wireframes Before Implementation**
- Before starting any software or script implementation that affects visual UI, presentation, or media outputs, the agent **MUST** present drawn text wireframes of the BEFORE and AFTER states to the user during planning and obtain explicit confirmation.

### **1.3 Solution Choice Justification Rule (Avoiding AI Overengineering)**
- During initial planning, the agent **MUST** explicitly justify the architecture choice:
  - **Deterministic Automation**: Preferred for exact calculations, accounting reconciliations, and rule-based workflow execution (e.g., SAP 3-way matching, PO issuance).
  - **AI (LLM / RAG / Vector Search)**: Preferred for unstructured text parsing, natural language T&C extraction, semantic search, and complex multi-document reasoning.
  - **Hybrid Architecture**: Combines deterministic rules engines for safety with AI for unstructured analytics, ensuring AI is never overengineered for purely deterministic tasks.

### **1.4 Definition of "Completing the Project" Standard**
- "Completing the project" requires executing the entire end-to-end software factory pipeline:
  1. **Job Text Registration**: Updating `job.txt` with target requisition text.
  2. **Rubric Governance**: Updating `docs/RUBRIC.md` with session learning and rules.
  3. **Queue Synthesis**: Creating `_job_queue/<REQ_ID>.json` with job-tailored financial & operational metrics.
  4. **Workspace Demo Application**: Updating `server.js` with job-specific workflows and UI mockups.
  5. **Headless Media Recording**: Running `scripts/generate-walkthrough-gif.js` to record `<REQ_ID>.gif`.
  6. **Portfolio & Resume Compilation**: Running `scripts/compile-portfolio.js` to update `public/index.html` and compile the tailored markdown resume in `dist_resumes/`.
  7. **Frontend Verification**: Performing Playwright screenshot verification and registering media completion via `frontend_verification_complete`.

---

## 2. Terminology, Plain English & Non-Technical Accessibility Rules

### **2.1 Plain English Civilian Accessibility Rule**
- All UI text, terminal stream logs, status banners, and card titles **MUST** be written in simple, clear English so recruiters, hiring managers, and civilians without deep technical backgrounds understand the value immediately.
- Technical variables and metrics (e.g., `beforeCost`, `afterCosts`, `investmentCost`, `cpi`, `spi`) must **NEVER** be displayed raw or unformatted.

### **2.2 Domain Acronym Definitions & Key Terms Appendix**
- Whenever industry or domain-specific acronyms are used (e.g., `P2P` Procure-to-Pay, `PO` Purchase Order, `PR` Purchase Requisition, `T&C` Terms & Conditions, `SLA` Service Level Agreement, `MRO` Maintenance Repair & Operations, `LTA` Long-Term Agreement), they **MUST** be accompanied by inline plain-English explanations or a dedicated "Key Terms Guide" on the screen.

### **2.3 Surface Mirroring & Repeat Consistency Invariant**
- **Cross-Surface Mirroring**: Exact identical wording, labels, and phrases must be used across BOTH the Git Webpage (`public/index.html`) and the Walkthrough Video (`.gif`).
- **Within-Surface Repeat Consistency**: Every repeated mention of a metric, label, or concept on the webpage or in the walkthrough video must use the **exact same phrasing** as its first occurrence.

### **2.4 Standardized Baseline Metrics Vocabulary**
The following canonical metric labels **MUST** be used verbatim whenever these values appear:
- `LEGACY OPERATING COST` (Pre-optimization manual workflow cost)
- `OPTIMIZED OPERATING COST` (Post-optimization automated workflow cost)
- `NET ANNUAL SAVINGS` (Calculated as `LEGACY OPERATING COST - OPTIMIZED OPERATING COST`)
- `SOLUTION INVESTMENT` (Calculated baseline cost to build, verify, and deploy the solution)
- `RETURN ON INVESTMENT` (Calculated as `(NET ANNUAL SAVINGS / SOLUTION INVESTMENT) * 100`)
- `EVM DELIVERABILITY` (Project control metrics: Cost Performance Index `CPI` and Schedule Performance Index `SPI`)
- `SECTION 1 OF 4 | AUDIT BRIEF` (Standardized label for Section 1 title card)
- `SECTION 2 OF 4 | LEGACY WORKFLOW` (Standardized label for legacy baseline workflow simulation panel)
- `SECTION 3 OF 4 | OPTIMIZED WORKFLOW` (Standardized label for optimized workflow simulation panel)
- `SECTION 4 OF 4 | EXECUTIVE DEAL BRIEF & VALUATION` (Standardized label for executive brief panel)
- All section labels across title cards and workspace panels must use the exact cyan font style (`text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider` / `color: #22d3ee`) with NO pill border or background box.

---

## 3. Walkthrough Video Presentation Standards (`scripts/generate-walkthrough-gif.js`)

### **3.1 Mandatory 4-Section Flow & URL Mode Control**
Every generated walkthrough video **MUST** follow a standardized 4-section structure, navigated via direct URL mode parameters (`?mode=section1`, `?mode=section2`, `?mode=section3`, `?mode=section4`):
1. **Section 1: System Target Metrics Brief** (`?mode=section1`) (Title Card + Standardized 6-KPI Chips Grid)
2. **Section 2: Legacy Workflow Baseline Simulation** (`?mode=section2`) (Title Card + Legacy Workflow Panel with `SECTION 2 OF 4 | LEGACY WORKFLOW` Cyan Label & Process Failure Crash)
3. **Section 3: Optimized Workflow Simulation** (`?mode=section3`) (Title Card + Side-by-Side AI & Rule Engine Panels with `SECTION 3 OF 4 | OPTIMIZED WORKFLOW` Cyan Label)
4. **Section 4: Executive Brief & Valuation Risk Matrix** (`?mode=section4`) (Title Card + Dedicated Viewport Centered Executive Brief & Benchmark Chart with `SECTION 4 OF 4 | EXECUTIVE DEAL BRIEF & VALUATION` Cyan Label)

### **3.2 Complete Segregation of Title Cards**
- Every section's Title Card **MUST** be rendered on its own standalone, clean view (centered on screen, zero clutter, 100% segregated without any section application content showing).
- Title cards must display top step indicators: `SECTION 1 OF 4`, `SECTION 2 OF 4`, `SECTION 3 OF 4`, `SECTION 4 OF 4`.

### **3.3 Dedicated Viewport Centering Across ALL Sections**
- ALL application content frames across Section 1, Section 2, Section 3, and Section 4 **MUST** be rendered with dedicated full-viewport centering (1280x720 viewport), zero page scrollbars, and zero upper/lower screen clutter.

### **3.4 Context Orientation Badges**
- Every active application panel in Section 2, Section 3, and Section 4 **MUST** display a top-right Context Orientation Label indicating the active step in cyan font style with 'OF 4' text.

### **3.5 Section 1 Standardized 6-KPI Chips Grid**
- Section 1 **MUST** use a uniform grid of 6 distinct KPI chips with high-contrast borders and clear subtitles:
  1. `LEGACY OPERATING COST`
  2. `OPTIMIZED OPERATING COST`
  3. `NET ANNUAL SAVINGS`
  4. `SOLUTION INVESTMENT`
  5. `RETURN ON INVESTMENT`
  6. `EVM DELIVERABILITY`

### **3.6 Workspace Focus & Requisition Exclusion**
- Requisition IDs (`REQ ID`) and Job Titles belong on the Git Webpage job cards directory and **MUST NOT** appear in the video walkthrough frames.

### **3.7 UI Clones / Mockups for Job SaaS Tools**
- If a target job description specifies tools or SaaS platforms (e.g., SAP, SAP Ariba, Oracle, Salesforce), the demonstration workspace application **MUST** render styled UI mockups/clones of those interfaces.

---

## 4. Git Webpage & Job Card Directory Standards (`public/index.html` & `scripts/compile-portfolio.js`)

### **4.1 Single-Line Job Card Header**
- Each job card in the directory **MUST** feature a compact single-line header strip containing:
  `Company Name • Job Title ... REQ ID: XXXXX`

### **4.2 Real-time Instant Filter & Smooth Jump**
- Search input filters non-matching cards instantly as the user types.
- Pressing `Enter` or clicking the `Jump ↵` button smoothly scrolls the viewport to the top matching card.

### **4.3 Clean Empty State Container**
- When search query returns 0 matching cards (e.g., `xyz999`), the page **MUST NOT** remain blank. It must render a styled dashed container:
  `🔍 No Business Solutions Found. No matching walkthrough entries found for 'xyz999'. Try searching company name, job title, or REQ ID.`

### **4.4 Minimalist & Responsive Design**
- High-contrast slate/cyan/emerald Tailwind design.
- Fully responsive across desktop, tablet, and mobile layouts.
