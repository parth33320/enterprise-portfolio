# System Portfolio & Walkthrough Standardization Rubric (v1.4)

This document establishes the official design, presentation, UI, terminology, architectural justification, and governance standards for all portfolio web assets (`public/index.html`), demonstration applications (`server.js`), and generated media walkthroughs (`scripts/generate-walkthrough-gif.js`).

---

## 1. Core Principles & Continual Learning Protocol

### **1.1 Continual Learning & Versioning**
- Every future session that modifies web assets, walkthrough scripts, or demonstration pages **MUST** read `docs/RUBRIC.md` to verify full compliance.
- When new capabilities, layout improvements, or solution patterns are merged into the repository, the active session **MUST** update `docs/RUBRIC.md` and increment the version (e.g., `v1.0` → `v1.1` → `v1.2` → `v1.3` → `v1.4`).
- Historical PRs, git logs, and `docs/plans/` serve as training data for future agents to continuously improve solution quality.

### **1.2 Mandatory Wireframes Before Implementation**
- Before starting any software or script implementation that affects visual UI, presentation, or media outputs, the agent **MUST** present drawn text wireframes of the BEFORE and AFTER states to the user during planning and obtain explicit confirmation.

### **1.3 Solution Choice Justification Rule (Process of Elimination & Best Practice)**
- Every job role demo **MUST** explicitly explain and justify why its specific architecture choices were selected over all existing real-world AI and automation alternatives. The walkthrough MUST detail how micro-solution components fit together to resolve small operational friction points and solve the macro profit leak.
- **Modern AI & Automation Solutions Evaluated by Process of Elimination**:
  1. **Naive Dense RAG (Vector Search Only)**:
     - *Elimination Reason*: Fails on exact keyword and ID matching (e.g., confuses part numbers or requisition IDs like `#PR-496-082` with `#PR-496-083`).
  2. **Fine-Tuned LLM (Custom Model Weights)**:
     - *Elimination Reason*: Extremely expensive to train/maintain, slow to update when supplier master contracts change, and carries high hallucination risks on exact financial numbers.
  3. **Knowledge Graph / GraphRAG / Ontologies**:
     - *Elimination Reason*: High setup overhead for unstructured single-document quote parsing; best reserved for multi-entity relationship mapping rather than fast document extraction.
  4. **Agentic Swarms (Autonomous Multi-Agent Systems)**:
     - *Elimination Reason*: Introduces non-deterministic execution loops, latency, and unpredictable financial state shifts for deterministic transactional workflows.
  5. **Pure Zero-Shot / Few-Shot LLM Prompting**:
     - *Elimination Reason*: Limited context window for multi-page contract evaluation and lacks grounding against master contract tables.
  6. **Hybrid RAG (Dense Vector Search + Sparse Lexical Keyword Search - Qdrant + BM25)**:
     - *Selected Best Practice for Unstructured Quote Parsing*: Combines dense vector embeddings (to understand legal clause risk and T&C semantics) with sparse lexical search (to match exact part numbers and requisition IDs with 100% precision).
  7. **Deterministic Rules Engine (SAP Ariba P2P Engine)**:
     - *Selected Best Practice for Order Execution & Accounting*: Guarantees 100% zero-variance arithmetic and auditability for financial commitments (Purchase Order == Goods Receipt Note == Vendor Invoice). AI is strictly prevented from executing order placement directly.

### **1.4 Mandatory Process-of-Elimination End-to-End Walkthrough Step**
- The walkthrough MUST present a step-by-step end-to-end example explaining how each optimal solution component resolves a specific micro-problem:
  - *Micro-Problem 1 (Unstructured Text & Risk)*: AI Hybrid RAG parses 14-page supplier PDF quote, extracting unit prices and flagging hidden fine-print 14-week lead-time delay clauses on Page 12.
  - *Micro-Problem 2 (Financial Reconciliations)*: Deterministic Rules Engine enforces LTA master contract rates ($92/unit), checks buyer spending limit SLA (<$100,000), and executes SAP 3-Way Invoice Match.
  - *Macro-Problem Solved (Profit Leak Elimination)*: Cuts purchasing turn times from 72 hours down to 1.5 hours, preventing factory assembly downtime and saving $9.3 Million in annual indirect spend.

### **1.5 Definition of "Completing the Project" Standard**
- "Completing the project" requires executing the entire end-to-end software factory pipeline:
  1. **Job Text Registration**: Updating `job.txt` with target requisition text.
  2. **Rubric Governance**: Updating `docs/RUBRIC.md` with session learning and rules.
  3. **Queue Synthesis**: Creating `_job_queue/<REQ_ID>.json` with job-tailored financial & operational metrics.
  4. **Workspace Demo Application**: Updating `server.js` with job-specific workflows and UI mockups.
  5. **Headless Media Recording**: Running `scripts/generate-walkthrough-gif.js` to record `<REQ_ID>.gif`.
  6. **Portfolio & Resume Compilation**: Running `scripts/compile-portfolio.js` to update `public/index.html` and compile the tailored markdown resume in `dist_resumes/`.
  7. **Frontend Verification**: Performing Playwright screenshot verification and registering media completion via `frontend_verification_complete`.

---

## 2. Terminology, Layout & Visual Standardization Rules

### **2.1 Plain English Rule & Prohibition of Explanatory Meta-Phrases**
- All UI text, terminal stream logs, status banners, and card titles **MUST** be written in simple, clear English so recruiters, hiring managers, and civilians without deep technical backgrounds understand the value immediately.
- Meta-phrases such as `"Explained in Simple English"` or `"Civilian Accessible"` **MUST NEVER** appear as text in the UI or walkthroughs. Content must simply be written cleanly without self-referential meta-labels.

### **2.2 Domain Acronym Definitions & Standalone Section 5 Appendix**
- Whenever industry or domain-specific acronyms are used (e.g., `P2P` Procure-to-Pay, `PO` Purchase Order, `PR` Purchase Requisition, `T&C` Terms & Conditions, `SLA` Service Level Agreement, `GRN` Goods Receipt Note, `LTA` Long-Term Agreement), they **MUST** be defined in a dedicated, standalone **Section 5 Appendix** view at the end of the walkthrough.
- **Standalone Appendix Rule**: The Appendix view MUST render on its own clean screen display (Section 5 of 5) without overlapping or cluttering application content from previous sections.

### **2.3 Outer Standardized Main Window vs. Inner Software UI Mockup Window**
- **Outer Main Window**: The outer main window frame MUST be 100% generic, standardized, and consistent across ALL job cards. It contains only standard title headers, top-left section labels (`SECTION X OF Y`), and high-level section explanations. It MUST NOT contain job-specific text (such as company names or requisition IDs in the outer frame).
- **Inner Software UI Mockup Window**: The software UI mockup (e.g., SAP Ariba UI clone for Procurement, or Lockheed UI clone for M&A) MUST be rendered INSIDE an inner window frame within the main window. ALL job-specific details (company name, plant site, requisition IDs, supplier names) belong strictly inside the inner software mockup window.

### **2.4 Standardized Top-Left Section Step Labels**
- Every demo slide/screen across ALL job cards MUST feature the `SECTION X OF Y` label positioned consistently in the **TOP-LEFT CORNER** of the outer main window (e.g., `SECTION 1 OF 5`, `SECTION 2 OF 5`, `SECTION 3 OF 5`, `SECTION 4 OF 5`, `SECTION 5 OF 5`).

### **2.5 Terminal Stream Formatting & Zero Clipping Guardrail**
- All terminal stream outputs in demo panels MUST be strictly contained within fixed-height containers (`max-h-[140px]` or `max-h-[160px]`) with automatic bottom-scrolling (`scrollTop = scrollHeight`), guaranteeing zero vertical clipping or bottom cutoffs in recorded video walkthroughs.

### **2.6 Zero Commingling of Previous Demo Content**
- Content from previous job role demos (e.g., "Target Entity", "M&A", "Deal Target", or "Subordinated Notes" from Lockheed) **MUST NEVER** appear in new job role demos. Each demo must be 100% cleanly scoped to the target job role.

### **2.7 Surface Mirroring & Repeat Consistency Invariant**
- **Cross-Surface Mirroring**: Exact identical wording, labels, and phrases must be used across BOTH the Git Webpage (`public/index.html`) and the Walkthrough Video (`.gif`).
- **Within-Surface Repeat Consistency**: Every repeated mention of a metric, label, or concept on the webpage or in the walkthrough video must use the **exact same phrasing** as its first occurrence.

### **2.8 Standardized Baseline Metrics Vocabulary**
The following canonical metric labels **MUST** be used verbatim whenever these values appear:
- `LEGACY OPERATING COST` (Pre-optimization manual workflow cost)
- `OPTIMIZED OPERATING COST` (Post-optimization automated workflow cost)
- `NET ANNUAL SAVINGS` (Calculated as `LEGACY OPERATING COST - OPTIMIZED OPERATING COST`)
- `SOLUTION INVESTMENT` (Calculated baseline cost to build, verify, and deploy the solution)
- `RETURN ON INVESTMENT` (Calculated as `(NET ANNUAL SAVINGS / SOLUTION INVESTMENT) * 100`)
- `EVM DELIVERABILITY` (Project control metrics: Cost Performance Index `CPI` and Schedule Performance Index `SPI`)
- `SECTION 1 OF 5 | AUDIT BRIEF`
- `SECTION 2 OF 5 | LEGACY WORKFLOW`
- `SECTION 3 OF 5 | OPTIMIZED WORKFLOW`
- `SECTION 4 OF 5 | EXECUTIVE DEAL BRIEF & VALUATION`
- `SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE`

---

## 3. Walkthrough Video Presentation Standards (`scripts/generate-walkthrough-gif.js`)

### **3.1 Mandatory 5-Section Flow & URL Mode Control**
Every generated walkthrough video **MUST** follow a standardized 5-section structure, navigated via direct URL mode parameters (`?mode=section1`, `?mode=section2`, `?mode=section3`, `?mode=section4`, `?mode=appendix`):
1. **Section 1: System Target Metrics Brief** (`?mode=section1`) (Title Card + Standardized 6-KPI Chips Grid)
2. **Section 2: Legacy Workflow Baseline Simulation** (`?mode=section2`) (Title Card + Legacy Workflow Panel with `SECTION 2 OF 5 | LEGACY WORKFLOW` Top-Left Cyan Label & Process Failure Crash)
3. **Section 3: Optimized Workflow Simulation** (`?mode=section3`) (Title Card + Side-by-Side AI & Rule Engine Panels with `SECTION 3 OF 5 | OPTIMIZED WORKFLOW` Top-Left Cyan Label)
4. **Section 4: Executive Brief & Valuation Risk Matrix** (`?mode=section4`) (Title Card + Dedicated Viewport Centered Executive Brief & Benchmark Chart with `SECTION 4 OF 5 | EXECUTIVE DEAL BRIEF & VALUATION` Top-Left Cyan Label)
5. **Section 5: Key Terms Appendix** (`?mode=appendix`) (Title Card + Standalone Glossary & Key Terms Guide with `SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE` Top-Left Cyan Label)

### **3.2 Complete Segregation of Title Cards**
- Every section's Title Card **MUST** be rendered on its own standalone, clean view (centered on screen, zero clutter, 100% segregated without any section application content showing).
- Title cards must display top step indicators: `SECTION 1 OF 5`, `SECTION 2 OF 5`, `SECTION 3 OF 5`, `SECTION 4 OF 5`, `SECTION 5 OF 5`.

### **3.3 Dedicated Viewport Centering Across ALL Sections**
- ALL application content frames across Section 1, Section 2, Section 3, Section 4, and Section 5 **MUST** be rendered with dedicated full-viewport centering (1280x720 viewport), zero page scrollbars, and zero upper/lower screen clutter.

### **3.4 Section 1 Standardized 6-KPI Chips Grid**
- Section 1 **MUST** use a uniform grid of 6 distinct KPI chips with high-contrast borders and clear subtitles:
  1. `LEGACY OPERATING COST`
  2. `OPTIMIZED OPERATING COST`
  3. `NET ANNUAL SAVINGS`
  4. `SOLUTION INVESTMENT`
  5. `RETURN ON INVESTMENT`
  6. `EVM DELIVERABILITY`

### **3.5 Workspace Focus & Requisition Exclusion**
- Requisition IDs (`REQ ID`) and Job Titles belong on the Git Webpage job cards directory and **MUST NOT** appear in the video walkthrough frames.

### **3.6 UI Clones / Mockups for Job SaaS Tools**
- If a target job description specifies tools or SaaS platforms (e.g., SAP, SAP Ariba, Oracle, Salesforce), the demonstration workspace application **MUST** render styled UI mockups/clones of those interfaces inside an inner window frame.

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
