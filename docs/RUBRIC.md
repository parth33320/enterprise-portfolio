# System Portfolio & Walkthrough Standardization Rubric (v1.0)

This document establishes the official design, presentation, UI, and terminology standards for all portfolio web assets (`public/index.html`), demonstration applications (`server.js`), and generated media walkthroughs (`scripts/generate-walkthrough-gif.js`).

---

## 1. Core Principles & Continual Learning Protocol

### **1.1 Continual Learning & Versioning**
- Every future session that modifies web assets, walkthrough scripts, or demonstration pages **MUST** read `docs/RUBRIC.md` to verify full compliance.
- When new capabilities, layout improvements, or solution patterns are merged into the repository, the active session **MUST** update `docs/RUBRIC.md` and increment the version (e.g., `v1.0` → `v1.1` → `v1.2`).
- Historical PRs, git logs, and `docs/plans/` serve as training data for future agents to continuously improve solution quality.

### **1.2 Mandatory Wireframes Before Implementation**
- Before starting any software or script implementation that affects visual UI, presentation, or media outputs, the agent **MUST** present drawn text wireframes of the BEFORE and AFTER states to the user during planning and obtain explicit confirmation.

---

## 2. Terminology & Ubiquitous Language Rules

### **2.1 Plain English Civilian Labeling**
- Internal backend variable names (e.g., `beforeCost`, `afterCosts`, `investmentCost`, `cpi`, `spi`, `piPredictability`, `reqId`) must **NEVER** be displayed raw, truncated, or unformatted.
- All financial, operational, and project metrics must be rendered as clear, plain English business labels that any non-technical civilian can understand instantly without domain confusion.

### **2.2 Surface Mirroring & Repeat Consistency Invariant**
- **Cross-Surface Mirroring**: Exact identical wording, labels, and phrases must be used across BOTH the Git Webpage (`public/index.html`) and the Walkthrough Video (`.gif`).
- **Within-Surface Repeat Consistency**: Every repeated mention of a metric, label, or concept on the webpage or in the walkthrough video must use the **exact same phrasing** as its first occurrence. No synonymous, truncated, or elongated naming variations allowed anywhere.

### **2.3 Standardized Baseline Metrics Vocabulary**
To enforce strict repeat consistency, the following canonical metric labels **MUST** be used verbatim whenever these values appear:
- `LEGACY OPERATING COST` (Pre-optimization manual workflow cost)
- `OPTIMIZED OPERATING COST` (Post-optimization automated workflow cost)
- `NET ANNUAL SAVINGS` (Calculated as `LEGACY OPERATING COST - OPTIMIZED OPERATING COST`)
- `SOLUTION INVESTMENT` (Calculated baseline cost to build, verify, and deploy the solution)
- `RETURN ON INVESTMENT` (Calculated as `(NET ANNUAL SAVINGS / SOLUTION INVESTMENT) * 100`)
- `EVM DELIVERABILITY` (Project control metrics: Cost Performance Index `CPI` and Schedule Performance Index `SPI`)
- `Debt/EBITDA` (Financial debt multiple; always written as `Debt/EBITDA`, never `EBITDA Multiple` or `Debt Ratio`)

---

## 3. Walkthrough Video Presentation Standards (`scripts/generate-walkthrough-gif.js`)

### **3.1 Mandatory 4-Section Flow**
Every generated walkthrough video **MUST** follow a standardized 4-section structure:
1. **Section 1: System Target Metrics Brief** (Title Card + Standardized 6-KPI Chips Grid)
2. **Section 2: Legacy Baseline Simulation** (Title Card + Non-AI Keyword Search Failure & Spreadsheet Crash)
3. **Section 3: Optimized State Simulation** (Title Card + AI/Automation Workspace Run)
4. **Section 4: Executive Brief & Valuation Risk Matrix** (Title Card + Dedicated Viewport Centered Executive Brief & Risk Benchmark Chart)

*Note on Solution Diversity*: Section 3 demonstrates AI RAG/Vector Search, LLM Reasoning, or Business Relationship Mapping for AI-focused jobs. For non-AI jobs where AI is overengineered, Section 3 demonstrates High-Throughput Deterministic Data Pipelines, Rule Engines, or Event-Driven Automations.

### **3.2 Complete Segregation of Title Cards**
- Every section's Title Card **MUST** be rendered on its own standalone, clean view (centered on screen, zero clutter, 100% segregated without any section application content showing at top or bottom).
- Title cards must display top step indicators: `SECTION 1 OF 4`, `SECTION 2 OF 4`, `SECTION 3 OF 4`, `SECTION 4 OF 4`.

### **3.3 Dedicated Viewport Centering Across ALL Sections**
- ALL application content frames across Section 2, Section 3, and Section 4 **MUST** be rendered with dedicated full-viewport centering (1280x720 viewport), zero page scrollbars, and zero upper/lower screen clutter.
- Section 4 (Executive Brief) **MUST NOT** show upper terminal streams, query inputs, or search buttons.

### **3.4 Context Orientation Badges**
- Every active application panel in Section 3 and Section 4 **MUST** display a top-right Context Orientation Badge indicating the active step (e.g. `SECTION 3 | OPTIMIZED STATE` or `SECTION 4 | EXECUTIVE DEAL BRIEF & VALUATION`).

### **3.5 Section 1 Standardized 6-KPI Chips Grid**
- Section 1 **MUST** use a uniform grid of 6 distinct KPI chips with high-contrast borders and clear subtitles:
  1. `LEGACY OPERATING COST`
  2. `OPTIMIZED OPERATING COST`
  3. `NET ANNUAL SAVINGS`
  4. `SOLUTION INVESTMENT`
  5. `RETURN ON INVESTMENT`
  6. `EVM DELIVERABILITY`
- Loose vertical text lists mixed with chips are strictly banned.

### **3.6 Workspace Focus & Requisition Exclusion**
- Requisition IDs (`REQ ID`) and Job Titles belong on the Git Webpage job cards directory and **MUST NOT** appear in the video walkthrough frames. Video frames must remain strictly focused on the operational workspace solution and executive metrics.

### **3.7 UI Clones / Mockups for Job SaaS Tools**
- If a target job description or requisition specifies tools, SaaS platforms, or utilities (e.g., Bloomberg Terminal, Palantir Foundry, Salesforce, Snowflake, Anaplan), the demonstration workspace application **MUST** render styled UI mockups/clones of those interfaces.

---

## 4. Git Webpage & Job Card Directory Standards (`public/index.html` & `scripts/compile-portfolio.js`)

### **4.1 Single-Line Job Card Header**
- Each job card in the directory **MUST** feature a compact single-line header strip containing:
  `Company Name • Job Title ... REQ ID: XXXXX`
- This ensures minimal vertical space is occupied when displaying multiple cards.

### **4.2 Real-time Instant Filter & Smooth Jump**
- Search input filters non-matching cards instantly as the user types.
- Pressing `Enter` or clicking the `Jump ↵` button smoothly scrolls the viewport to the top matching card.

### **4.3 Clean Empty State Container**
- When search query returns 0 matching cards (e.g., `xyz999`), the page **MUST NOT** remain blank. It must render a styled dashed container:
  `🔍 No Business Solutions Found. No matching walkthrough entries found for 'xyz999'. Try searching company name, job title, or REQ ID.`

### **4.4 Minimalist & Responsive Design**
- High-contrast slate/cyan/emerald Tailwind design.
- Fully responsive across desktop, tablet, and mobile layouts.
