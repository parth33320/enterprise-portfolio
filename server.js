const http = require('http');
const url = require('url');

const PORT = 3000;

function generateHtml(mode) {
  const isSection1 = mode === 'section1';
  const isSection2 = mode === 'section2';
  const isSection3 = mode === 'section3' || mode === 'section4'; // Consolidated Optimized Solution view
  const isSection4 = mode === 'appendix' || mode === 'section5';
  const isSection5 = mode === 'techdetails1' || mode === 'techdetails2' || mode === 'section6';
  const techPart2 = mode === 'techdetails2';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WonderBotz UiPath Client Services Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Virtual Cursor & Ripple Effect Animations */
    #virtual-cursor {
      position: fixed;
      width: 20px;
      height: 20px;
      pointer-events: none;
      z-index: 10000;
      transition: all 0.25s ease-out;
      transform: translate(-50%, -50%);
      display: none;
    }
    .click-ripple {
      position: fixed;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: rgba(34, 211, 238, 0.4);
      border: 2px solid #22d3ee;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%) scale(0.2);
      animation: ripple-effect 0.5s ease-out forwards;
    }
    @keyframes ripple-effect {
      0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-6 antialiased relative">

  <!-- VIRTUAL CURSOR OVERLAY -->
  <div id="virtual-cursor">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z" fill="#22d3ee" stroke="#020617" stroke-width="2" stroke-linejoin="round"/>
    </svg>
  </div>

  <!-- STANDARDIZED OUTER MAIN WINDOW CONTAINER -->
  <main class="max-w-5xl mx-auto space-y-6 min-h-screen flex flex-col justify-center">

    ${isSection1 || (!isSection2 && !isSection3 && !isSection4 && !isSection5) ? `
    <!-- SECTION 1 CONTAINER: EXECUTIVE BRIEF & TARGET METRICS -->
    <section id="section-1-container" class="space-y-4 py-2">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 1 OF 5 | EXECUTIVE BRIEF</div>
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl font-extrabold text-white mt-1">WonderBotz Client Automation Portfolio Optimization</h1>
            <p class="text-xs text-slate-400 mt-1">UiPath REFramework, Document Understanding, and Action Center Integration Platform</p>
          </div>
          <span class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
            +480.00% ROI
          </span>
        </div>

        <!-- Risk Analysis Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div class="bg-slate-950 p-3 rounded-xl border border-rose-900/50 bg-rose-950/10">
            <span class="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">Specific Risk Identified</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Unattended bot crashes, manual log searching, and unparsed vendor PDF invoices cause severe client SLA breaches.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-amber-900/50 bg-amber-950/10">
            <span class="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Why It Matters</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Causes 48+ hour SLA delays in client operations and <strong class="text-amber-400 font-mono">$1,680,000</strong> in annual operating waste.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
            <span class="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">How To Eliminate Risk</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Deploy UiPath REFramework auto-recovery, Document AI PDF parsing, and Action Center 1-click approvals.
            </p>
          </div>
        </div>

        <!-- SLA Benchmark Comparison Chart -->
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2">
            <span class="text-slate-300 font-bold">Client Automation Turn Time SLA (Hours)</span>
            <span class="text-slate-500 text-[10px]">Source: WonderBotz TAM Operations Audit</span>
          </div>

          <div class="space-y-2.5 font-mono text-xs pt-1">
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Legacy Manual Exception Handling:</span>
                <span class="text-rose-400 font-bold">48.0 Hours SLA (Manual Log Searching & Data Entry)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-rose-500 h-full rounded-full" style="width: 100%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Optimized Consolidated UiPath Platform:</span>
                <span class="text-emerald-400 font-bold">1.5 Hours SLA (<20ms REFramework Auto-Recovery)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 3.1%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Standardized 6-KPI Chips Grid (Rendered Exclusively in Section 1 View) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono">
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">LEGACY OPERATING COST</span>
            <span class="text-sm font-extrabold text-rose-400">$2,100,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Pre-optimization manual workflow)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">OPTIMIZED OPERATING COST</span>
            <span class="text-sm font-extrabold text-emerald-400">$420,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Post-optimization automated pipeline)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">NET ANNUAL SAVINGS</span>
            <span class="text-sm font-extrabold text-cyan-400">$1,680,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Legacy minus Optimized)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">SOLUTION INVESTMENT</span>
            <span class="text-sm font-extrabold text-slate-100">$350,000 USD</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Platform build & deploy cost)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">RETURN ON INVESTMENT</span>
            <span class="text-sm font-extrabold text-emerald-400">+480.00% ROI</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Annual Savings / Investment)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">EVM DELIVERABILITY</span>
            <span class="text-xs font-extrabold text-cyan-400">CPI 1.14 | SPI 1.08</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(96% Delivery Reliability)</span>
          </div>
        </div>

        <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 rounded-xl text-xs font-sans leading-relaxed">
          <strong>Executive Recommendation:</strong> Deploy UiPath REFramework Auto-Recovery, Document AI Engine, and Action Center Portal to reduce client automation turn time SLA from 48 hours down to 1.5 hours and capture $1,680,000 in net annual operational savings.
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection2 ? `
    <!-- SECTION 2 CONTAINER: TECHNICAL DEEP DIVE & ARCHITECTURE DIAGRAM -->
    <section id="section-2-container" class="space-y-4 py-2">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 2 OF 5 | SYSTEM ARCHITECTURE & DEEP DIVE</div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">Comparative System Architecture & Information Flow</h2>
          <p class="text-xs text-slate-400 mt-0.5">WonderBotz Client Services — Comparing Legacy Unattended Failures vs. Optimized Consolidated UiPath Platform</p>
        </div>

        <!-- Comparative Diagrammatic Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <!-- Legacy Architecture Box -->
          <div class="bg-slate-950 p-4 rounded-xl border border-rose-900/60 bg-rose-950/10 space-y-3">
            <div class="text-rose-400 font-bold uppercase text-[11px] border-b border-rose-900/50 pb-2">
              Legacy Manual Architecture (48-Hour Delays & High Labor Cost)
            </div>

            <div class="space-y-2 text-[11px] text-slate-300">
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-rose-300 font-bold block">1. Unhandled Bot Crashes</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Bots crash on minor app updates; managers search text logs manually.</p>
              </div>
              <div class="text-center text-rose-400 font-bold">↓ (Manual Log Investigation)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-rose-300 font-bold block">2. Rigid Text Invoice Rules</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Varying PDF layouts break text matching, forcing manual data entry.</p>
              </div>
              <div class="text-center text-rose-400 font-bold">↓ (Manual Data Entry & Approvals)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-rose-800/80">
                <span class="text-rose-400 font-bold block">3. Severe SLA Breaches</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">High-value exceptions sit unapproved in email queues for 48+ hours.</p>
              </div>
            </div>
          </div>

          <!-- Optimized Architecture Box -->
          <div class="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/10 space-y-3">
            <div class="text-emerald-400 font-bold uppercase text-[11px] border-b border-emerald-900/50 pb-2">
              Optimized Consolidated UiPath Platform (<1.5 Hours & 100% SLA)
            </div>

            <div class="space-y-2 text-[11px] text-slate-300">
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 font-bold block">1. UiPath REFramework Auto-Recovery</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">State machine handles system errors, logs state, and retries in <20ms.</p>
              </div>
              <div class="text-center text-cyan-400 font-bold">↓ (AI PDF Data Extraction)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-emerald-300 font-bold block">2. UiPath Document Understanding AI</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Machine learning parses invoice numbers, totals, and tables seamlessly.</p>
              </div>
              <div class="text-center text-emerald-400 font-bold">↓ (1-Click Manager Approval)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-emerald-800/80">
                <span class="text-emerald-400 font-bold block">3. UiPath Action Center Portal</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Managers approve low-confidence items in 1 click; bots resume instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection3 ? `
    <!-- SECTION 3 CONSOLIDATED OPTIMIZED WORKFLOW DEMO SLIDE -->
    <section id="workspace-container" class="space-y-4 py-2">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            SECTION 3 OF 5 | OPTIMIZED WORKFLOW
          </div>
          <h1 class="text-base font-extrabold text-white mt-0.5">
            Consolidated UiPath Platform: REFramework Auto-Recovery + Document AI + Action Center
          </h1>
        </div>
      </div>

      <!-- TOP DISPLAY BANNER FOR LIVE SYSTEM EXPLANATIONS -->
      <div id="status-banner" class="hidden p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg transition-all"></div>

      <!-- INNER UIPATH ORCHESTRATOR MOCKUP WINDOW (NO TAB HEADERS) -->
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-2xl relative">

        <!-- UiPath Orchestrator Header Bar Mockup -->
        <div class="bg-[#FA4616] text-white rounded-xl p-3 flex justify-between items-center text-xs font-sans shadow-md border border-orange-600">
          <div class="flex items-center gap-3">
            <span class="bg-white text-[#FA4616] font-extrabold px-2 py-0.5 rounded text-[11px] tracking-wide">UiPath</span>
            <span class="font-semibold text-white">Orchestrator Cloud | Tenant: WonderBotz-Client-Prod</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-mono text-white/90">
            <span>Role: Technical Account Manager</span>
            <span class="w-2 h-2 rounded-full bg-emerald-300 inline-block"></span>
          </div>
        </div>

        <!-- SINGLE CONSOLIDATED WORKFLOW PANEL -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">

          <!-- Labeled Workflow Progress Bar -->
          <div class="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono text-xs">
            <div class="text-slate-400 text-[10.5px] font-bold uppercase mb-2">Consolidated Execution Pipeline: Requisition #WB-UIPATH-2026</div>
            <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
              <div class="bg-cyan-950/60 border border-cyan-800 text-cyan-300 p-2 rounded-lg font-bold">
                Step 1: REFramework Check
              </div>
              <div class="bg-cyan-950/60 border border-cyan-800 text-cyan-300 p-2 rounded-lg font-bold">
                Step 2: Document AI Extraction
              </div>
              <div class="bg-cyan-950/60 border border-cyan-800 text-cyan-300 p-2 rounded-lg font-bold">
                Step 3: Action Center Approval
              </div>
            </div>
          </div>

          <!-- Single Unified Execution Button -->
          <div>
            <button id="btn-run-uipath-workflow" onclick="runConsolidatedWorkflow()" class="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono px-4 py-2.5 rounded-xl transition shadow-lg">
              Run Consolidated UiPath Workflow Execution
            </button>
          </div>

          <!-- EXPANDED RESULTS CONTAINER (NO TERMINALS, ALL MICRO & MACRO SOLUTIONS INSIDE) -->
          <div id="uipath-results" class="min-h-[220px] max-h-[260px] overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 font-mono text-xs flex flex-col justify-center">
            <div class="text-slate-500 text-center text-[11px]">[Click button above to execute consolidated UiPath automation platform]</div>
          </div>

        </div>
      </div>
    </section>
    ` : ''}

    ${isSection4 ? `
    <!-- SECTION 4 CONTAINER: STANDALONE KEY TERMS APPENDIX -->
    <section id="section-4-container" class="py-2 space-y-3">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 4 OF 5 | APPENDIX & KEY TERMS GUIDE</div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">WonderBotz UiPath Client Services — Terminology & Solution Choice Rationale</h2>
          <p class="text-xs text-slate-400 mt-0.5">Plain English definitions with real-world civilian examples for software terms and architecture choices</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• UiPath REFramework ("Automated Bot Health Monitor & Safety Guard"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">A standardized software template for running automated software bots that catches system errors automatically, retries failed steps safely, and logs bot health in real time like an automatic circuit breaker.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• UiPath Document Understanding ("Intelligent Document Reader"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">An automated software reader that extracts invoice numbers, line items, and totals from PDF files even when suppliers use completely different layout formats, like a smart digital scanner.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• UiPath Action Center ("One-Click Manager Approval Queue"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">An online manager portal where human workers review and approve high-value invoices with a single click so automated bots can resume work immediately.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• UiPath Orchestrator ("Central Command Server"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">The central cloud dashboard used to schedule, manage, and monitor all automated software bots operating across client companies.</p>
          </div>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-sans">
          <div class="text-cyan-400 font-mono font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
            OPTIMAL SOLUTION CHOICE RATIONALE (PROCESS OF ELIMINATION):
          </div>
          <div class="space-y-1.5 text-slate-300 text-[11.5px]">
            <p><strong>1. Over Custom Python/Shell Scripts:</strong> Custom scripts lack centralized cloud server monitoring, automated retries, enterprise audit logs, and SLA tracking required for customer account management.</p>
            <p><strong>2. Over Pure AI Language Models (LLMs):</strong> Standard AI language models can make calculation errors or produce unpredictable outputs when processing financial numbers. REFramework guarantees 100% deterministic arithmetic.</p>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection5 ? `
    <!-- SECTION 5 CONTAINER: DETAILED INNER SOFTWARE WORKINGS -->
    <section id="section-5-container" class="py-2 space-y-3">
      <div class="flex justify-between items-center">
        <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          ${techPart2 ? 'SECTION 5 OF 5 | SOFTWARE INNER WORKINGS (PART 2 OF 2)' : 'SECTION 5 OF 5 | SOFTWARE INNER WORKINGS (PART 1 OF 2)'}
        </div>
        <div class="flex gap-2">
          <a href="?mode=techdetails1" class="px-2.5 py-1 text-[11px] font-mono rounded-lg border ${!techPart2 ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}">Part 1: Engine</a>
          <a href="?mode=techdetails2" class="px-2.5 py-1 text-[11px] font-mono rounded-lg border ${techPart2 ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}">Part 2: Webhooks</a>
        </div>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">
            ${techPart2 ? 'Action Center Signal Webhooks & Enterprise Production Resilience' : 'UiPath REFramework State Machine & Document AI Mechanics'}
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">WonderBotz Client Services — Exhaustive Inner Software Architecture in Plain English</p>
        </div>

        ${!techPart2 ? `
        <!-- PART 1: STACK CONSTRUCTION & REFRAMEWORK -->
        <div class="space-y-4 text-xs font-sans">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-cyan-400 font-mono font-bold block text-[11px] uppercase">• Software Stack Construction & Component Wiring:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px] text-slate-300 font-mono">
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Bot State Engine:</span>
                UiPath REFramework (Robotic Enterprise Framework).
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Document Processing:</span>
                UiPath Document Understanding AI OCR Engine.
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Human Approval Portal:</span>
                UiPath Action Center REST Webhook Service.
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Cloud Server Management:</span>
                UiPath Orchestrator Cloud Console.
              </div>
            </div>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-emerald-400 font-mono font-bold block text-[11px] uppercase">• REFramework State Machine Mechanics:</span>
            <div class="space-y-2 text-[11.5px] text-slate-300">
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Init State:</strong> Reads Orchestrator asset settings, initializes applications, and verifies system connectivity.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Get Transaction Data State:</strong> Pulls next queue item from Orchestrator in real time.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Process Transaction State:</strong> Executes business steps; catches system exceptions, logs error details, and retries automatically.
              </div>
            </div>
          </div>
        </div>
        ` : `
        <!-- PART 2: ACTION CENTER & RESILIENCE -->
        <div class="space-y-4 text-xs font-sans">
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-cyan-400 font-mono font-bold block text-[11px] uppercase">• Action Center Human-in-the-Loop Webhooks:</span>
            <div class="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-[11.5px] text-slate-300">
              <p>1. <strong>Low-Confidence Detection:</strong> Document AI identifies items requiring human review and triggers an Action Center task creation signal.</p>
              <p>2. <strong>One-Click Manager Approval:</strong> Manager signs off on the item in Action Center portal.</p>
              <p>3. <strong>Resume Signal Dispatch:</strong> Action Center dispatches a webhook event signal to Orchestrator, instructing the unattended REFramework bot to resume execution.</p>
            </div>
          </div>

          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-emerald-400 font-mono font-bold block text-[11px] uppercase">• Enterprise Production Resilience & SLA Assurance:</span>
            <div class="space-y-2 text-[11.5px] text-slate-300">
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Orchestrator Centralized Logging:</strong> Stores full audit trails and transaction status for every execution step.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Automatic Error Retries:</strong> Retries transient application errors up to 3 times before escalating.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">SLA Turn Time Enforcement:</strong> Reduces client workflow processing SLA from 48 hours down to 1.5 hours guaranteed.
              </div>
            </div>
          </div>
        </div>
        `}
      </div>
    </section>
    ` : ''}

  </main>

  <!-- CLIENT INTERACTION & RIPPLE ANIMATION SCRIPT -->
  <script>
    function triggerRippleAt(x, y) {
      const cursor = document.getElementById('virtual-cursor');
      if (!cursor) return;
      cursor.style.display = 'block';
      cursor.style.left = x + 'px';
      cursor.style.top = y + 'px';

      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      document.body.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    }

    function showBanner(htmlContent, bgClass) {
      const banner = document.getElementById('status-banner');
      if (!banner) return;
      banner.classList.remove('hidden');
      banner.className = "p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg " + bgClass;
      banner.innerHTML = htmlContent;
    }

    function runConsolidatedWorkflow() {
      const results = document.getElementById('uipath-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-3 font-mono text-xs">
          <div class="text-cyan-400 font-bold border-b border-slate-800 pb-1">
            Consolidated UiPath Platform Execution: Requisition #WB-UIPATH-2026
          </div>

          <div class="space-y-2 font-sans text-[11px] leading-relaxed text-slate-200">
            <p class="border-l-2 border-emerald-400 pl-2.5 py-0.5 bg-emerald-950/20 rounded-r">
              <strong class="text-emerald-300 font-mono block">Micro-Solution 1: REFramework Automated Error Recovery & Health Checks</strong>
              Catches application errors automatically, retries transient failures up to 3 times, and logs health metrics to Orchestrator in &lt;20ms.<br>
              <span class="text-rose-300 font-bold">Legacy Pain:</span> Bot crashes force managers to search text logs manually, creating 48+ hour operational backlogs.
            </p>

            <p class="border-l-2 border-cyan-400 pl-2.5 py-0.5 bg-cyan-950/20 rounded-r">
              <strong class="text-cyan-300 font-mono block">Micro-Solution 2: Document Understanding Intelligent PDF Extraction</strong>
              Uses machine learning models to extract invoice numbers, line items, and totals across varying vendor PDF layouts with 100% precision.<br>
              <span class="text-rose-300 font-bold">Legacy Pain:</span> Non-standard vendor PDF layouts break rigid text rules, forcing manual invoice data entry.
            </p>

            <p class="border-l-2 border-emerald-400 pl-2.5 py-0.5 bg-emerald-950/20 rounded-r">
              <strong class="text-emerald-300 font-mono block">Micro-Solution 3: Action Center One-Click Human-in-the-Loop Approval</strong>
              Routes high-value exceptions directly to manager queues for 1-click review, instantly signaling unattended bots to resume execution.<br>
              <span class="text-rose-300 font-bold">Legacy Pain:</span> High-value exceptions sit unapproved in manager email inboxes indefinitely.
            </p>

            <div class="mt-2 p-2.5 bg-cyan-950/40 border border-cyan-500/40 text-cyan-200 rounded-lg font-mono text-[10.5px]">
              <strong>Macro Solution Summary:</strong> Combines REFramework error recovery, Document AI parsing, and Action Center approvals into an end-to-end automated platform, reducing client turn time SLA from 48 hours down to 1.5 hours and saving $1,680,000 annually.
            </div>
          </div>
        </div>\`;

      showBanner(
        "<strong>✅ Consolidated UiPath Execution Succeeded:</strong> Processed client automation workflow across REFramework, Document AI, and Action Center in <1.5 hours SLA, capturing $1,680,000 in annual net savings.",
        "border-emerald-800 bg-emerald-950/60 text-emerald-200"
      );
    }
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const mode = parsedUrl.query.mode;

  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/demo') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateHtml(mode));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[Demo Workspace Server] Running on http://localhost:${PORT}/demo`);
});
