# System Portfolio & Walkthrough Standardization Rubric (v2.2)

This document establishes the official design, presentation, UI, terminology, architectural justification, and governance standards for all portfolio web assets (`public/index.html`), demonstration applications (`server.js`), and generated media walkthroughs (`scripts/generate-walkthrough-gif.js`).

---

## 1. Core Principles & Continual Learning Protocol

### **1.1 Continual Learning & Versioning**
- Every future session that modifies web assets, walkthrough scripts, or demonstration pages **MUST** read `docs/RUBRIC.md` and `LESSONS_LEARNED.md` to verify full compliance.
- When new capabilities, layout improvements, or solution patterns are merged into the repository, the active session **MUST** update `docs/RUBRIC.md` and increment the version (e.g., `v2.1` → `v2.2`).
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
- Whenever industry or domain-specific acronyms, software terms, or technical phrases are used (e.g., `WCAG`, `AEM EDS`, `Modo Labs`, `OneCampus`, `ARIA Landmarks`, `Qdrant`, `BM25`, `P2P`, `PO`, `PR`, `SLA`), they **MUST** be defined in a dedicated, standalone **Section 5 Appendix** view at the end of the walkthrough.
- **Standalone Appendix Rule**: The Appendix view MUST render on its own clean screen display (Section 5 of 5) without overlapping or cluttering application content from previous sections.
- **Civilian Accessibility & Real-World Example Rule**: All definitions in the Section 5 Appendix **MUST** be written in simple, plain English without technical jargon, using concrete real-world civilian examples (e.g., explaining WCAG as "wheelchair ramps for websites" or ARIA landmarks as "Braille signs for screen readers") so that non-technical managers and civilians can understand all terms instantly.

### **2.3 Outer Standardized Main Window vs. Inner Software UI Mockup Window**
- **Outer Main Window**: The outer main window frame MUST be 100% generic, standardized, and consistent across ALL job cards. It contains only standard title headers, top-left section labels (`SECTION X OF Y`), and high-level section explanations. It MUST NOT contain job-specific text (such as company names or requisition IDs in the outer frame).
- **Inner Software UI Mockup Window**: The software UI mockup (e.g., SAP Ariba UI clone for Procurement, or Lockheed UI clone for M&A) MUST be rendered INSIDE an inner window frame within the main window. ALL job-specific details (company name, plant site, requisition IDs, supplier names) belong strictly inside the inner software mockup window.

### **2.4 Standardized Top-Left Section Step Labels**
- Every demo slide/screen across ALL job cards MUST feature the `SECTION X OF Y` label positioned consistently in the **TOP-LEFT CORNER** of the outer main window (e.g., `SECTION 1 OF 5`, `SECTION 2 OF 5`, `SECTION 3 OF 5`, `SECTION 4 OF 5`, `SECTION 5 OF 5`), completely detached and independent from any inner content box or modal card.
- The `SECTION X OF Y` label MUST maintain identical font size, font family (`font-mono`), color (`text-cyan-400`), weight (`font-bold`), and uppercase tracking across all sections and title cards.

### **2.5 Permanent Removal of Terminal Streams & Clean Expanded Panels**
- Terminal streams and raw terminal log boxes are **PERMANENTLY REMOVED** from all demo template code and workspace applications (`server.js`). Terminals do not convey useful information for executive viewers or hiring managers.
- In place of terminal streams, execution result containers **MUST** be expanded (`min-h-[160px]` / `max-h-[220px]`, with internal `overflow-y-auto`) to display clear, high-contrast operational summaries, key performance indicators, and structured outcomes without empty whitespace.

### **2.6 Universal Dynamic Text Scaling & Zero Vertical Cutoff Invariant**
- **Strict Zero-Clipping Rule**: All UI elements, cards, chips, containers, and text font sizes **MUST** be dynamically styled and sized to guarantee zero vertical clipping or bottom text cutoffs within the standard 1280x720 video walkthrough viewport frame.
- **Dynamic Font & Content Scaling**: All text font sizes (`text-[10px]` through `text-sm`) and chip containers **MUST** adjust and scale dynamically depending on surrounding content. If a slide or section contains additional descriptive text, chip sizes, text sizes, and padding (`p-2` to `p-2.5`) MUST shrink dynamically so that all content fits cleanly inside the viewport without pushing elements off-screen.

### **2.6 Zero Commingling of Previous Demo Content & Terminology**
- Content or terminology from previous job role demos (e.g., "Target Entity", "M&A", "Deal Target", "Deal Brief", or "Subordinated Notes" from Lockheed) **MUST NEVER** appear in new job role demos (such as Procurement or Engineering). Each demo must be 100% cleanly scoped to its specific target job role domain.
- **Strict Single-Job Focus Rule**: The walkthrough demo, terminal streams, and Section 5 Appendix for a job card MUST ONLY contain content and data directly related to that specific job. Referencing previous job cards or comparisons to other portfolio cards in the demo output is strictly prohibited.

### **2.11 Mandatory Executive Brief Sub-Components**
- **Executive Brief Requirements**: The Executive Brief section (`SECTION 1 OF 5 | EXECUTIVE BRIEF`) **MUST** always contain three mandatory sub-components:
  1. *Risk Analysis Matrix*: Highlighting Specific Risk Identified, Why It Matters, and How To Eliminate Risk.
  2. *Benchmark Comparison Chart*: Visualizing legacy vs optimized SLA/turn times.
  3. *Executive Recommendation*: A clear, actionable executive conclusion.

### **2.12 Technical Stack Deep Dive Appendix Section**
- **Detailed Solution Architecture Section**: Following the Appendix, an additional technical details section **MUST** be included detailing the inner software workings and technical architecture of the optimized solution stack in plain, clear English (without relying on analogies), so non-technical stakeholders can understand exactly how the software components operate under the hood.

### **2.7 Standardized Reusable UI Titles vs. Job-Specific Demo Mockups**
- Webpage job cards on Git pages MUST feature standardized, job-independent outer card containers and standard section titles (`SECTION 1 OF 5 | AUDIT BRIEF`, `SECTION 2 OF 5 | LEGACY WORKFLOW`, `SECTION 3 OF 5 | OPTIMIZED WORKFLOW`, `SECTION 4 OF 5 | EXECUTIVE BRIEF`, `SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE`).
- While outer card layouts and main section titles are standardized across all cards, the inner UI titles, software UI mockups, and specific operational data inside the inner windows MUST be built from scratch for every unique job role demo card.

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
- `SECTION 4 OF 5 | EXECUTIVE BRIEF`
- `SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE`

---

## 3. Walkthrough Video Presentation Standards (`scripts/generate-walkthrough-gif.js`)

### **3.1 Mandatory 5-Section Flow & URL Mode Control**
Every generated walkthrough video **MUST** follow a standardized 5-section structure, navigated via direct URL mode parameters (`?mode=section1`, `?mode=section2`, `?mode=section3`, `?mode=section4`, `?mode=appendix`):
1. **Section 1: System Target Metrics Brief** (`?mode=section1`) (Title Card + Standardized 6-KPI Chips Grid)
2. **Section 2: Legacy Workflow Baseline Simulation** (`?mode=section2`) (Title Card + Legacy Workflow Panel with `SECTION 2 OF 5 | LEGACY WORKFLOW` Top-Left Cyan Label & Process Failure Crash)
3. **Section 3: Optimized Workflow Simulation** (`?mode=section3`) (Title Card + Side-by-Side AI & Rule Engine Panels with `SECTION 3 OF 5 | OPTIMIZED WORKFLOW` Top-Left Cyan Label)
4. **Section 4: Executive Brief & Benchmark Analysis** (`?mode=section4`) (Title Card + Dedicated Viewport Centered Executive Brief & Benchmark Chart with `SECTION 4 OF 5 | EXECUTIVE BRIEF` Top-Left Cyan Label)
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
