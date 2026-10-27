const http = require('http');
const url = require('url');

const PORT = 3000;

function generateHtml(mode) {
  const isSection1 = mode === 'section1';
  const isSection2 = mode === 'section2';
  const isSection3 = mode === 'section3';
  const isSection4 = mode === 'section4';
  const isSection5 = mode === 'appendix' || mode === 'section5';
  const isSection6 = mode === 'techdetails1' || mode === 'techdetails2' || mode === 'section6';
  const techPart2 = mode === 'techdetails2';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Villanova UTS Web Services Workspace</title>
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

    ${isSection1 || (!isSection2 && !isSection3 && !isSection4 && !isSection5 && !isSection6) ? `
    <!-- SECTION 1 CONTAINER: EXECUTIVE BRIEF & TARGET METRICS -->
    <section id="section-1-container" class="space-y-4 py-2">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 1 OF 5 | EXECUTIVE BRIEF</div>
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <h1 class="text-xl font-extrabold text-white mt-1">Villanova UTS Web Services & Digital Ecosystem Optimization</h1>
            <p class="text-xs text-slate-400 mt-1">Automating AEM Edge Delivery Services (EDS) WCAG 2.1 AA accessibility checking and Modo Labs / OneCampus API payload sync.</p>
          </div>
          <span class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
            +403.57% ROI
          </span>
        </div>

        <!-- Risk Analysis Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div class="bg-slate-950 p-3 rounded-xl border border-rose-900/50 bg-rose-950/10">
            <span class="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">Specific Risk Identified</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Manual web uploading misses WCAG 2.1 AA accessibility rules and breaks mobile app (Modo Labs) and web portal (OneCampus) API payloads.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-amber-900/50 bg-amber-950/10">
            <span class="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Why It Matters</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Causes 72+ hour publishing backlogs, federal digital accessibility audit violation risks, and <strong class="text-amber-400 font-mono">$1,130,000</strong> in annual operating waste.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
            <span class="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">How To Eliminate Risk</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Deploy AI Agentic AST Code Auditor to auto-fix WCAG rules in <20ms, coupled with an Event-Driven Webhook Gateway to update mobile and portal APIs.
            </p>
          </div>
        </div>

        <!-- SLA Benchmark Comparison Chart -->
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2">
            <span class="text-slate-300 font-bold">Publishing & Multi-Platform Deployment SLA (Hours)</span>
            <span class="text-slate-500 text-[10px]">Source: Villanova UTS Operations Audit</span>
          </div>

          <div class="space-y-2.5 font-mono text-xs pt-1">
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Legacy Manual Web Analyst Upload:</span>
                <span class="text-rose-400 font-bold">72.0 Hours SLA (High Audit & Sync Risk)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-rose-500 h-full rounded-full" style="width: 100%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Optimized AI AST & Webhook Pipeline:</span>
                <span class="text-emerald-400 font-bold">1.5 Hours SLA (<20ms Code Audit)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 4%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Standardized 6-KPI Chips Grid (Compact & Dynamically Scaled to Prevent Cutoff) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2.5 font-mono">
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">LEGACY OPERATING COST</span>
            <span class="text-sm font-extrabold text-rose-400">$1,450,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Pre-optimization manual workflow)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">OPTIMIZED OPERATING COST</span>
            <span class="text-sm font-extrabold text-emerald-400">$320,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Post-optimization automated pipeline)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">NET ANNUAL SAVINGS</span>
            <span class="text-sm font-extrabold text-cyan-400">$1,130,000 / yr</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Legacy minus Optimized)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">SOLUTION INVESTMENT</span>
            <span class="text-sm font-extrabold text-slate-100">$280,000 USD</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Platform build & deploy cost)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">RETURN ON INVESTMENT</span>
            <span class="text-sm font-extrabold text-emerald-400">+403.57% ROI</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(Annual Savings / Investment)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-2.5 rounded-xl">
            <span class="text-[9.5px] text-slate-400 block mb-0.5 font-bold uppercase">EVM DELIVERABILITY</span>
            <span class="text-xs font-extrabold text-cyan-400">CPI 1.12 | SPI 1.06</span>
            <span class="text-[9px] text-slate-500 block mt-0.5">(95% Delivery Reliability)</span>
          </div>
        </div>

        <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 rounded-xl text-xs font-sans leading-relaxed">
          <strong>✅ Executive Recommendation:</strong> Deploy AI Agentic AST Code Auditor & Event-Driven Webhook Integration Engine to reduce web publishing SLA from 72 hours down to 1.5 hours and capture $1,130,000 in net annual savings.
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
          <p class="text-xs text-slate-400 mt-0.5">Villanova UTS Web Services — Comparing Legacy Manual Upload vs. Optimized AI AST & Webhook Pipeline in Plain English</p>
        </div>

        <!-- Comparative Diagrammatic Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <!-- Legacy Architecture Box -->
          <div class="bg-slate-950 p-4 rounded-xl border border-rose-900/60 bg-rose-950/10 space-y-3">
            <div class="text-rose-400 font-bold uppercase text-[11px] border-b border-rose-900/50 pb-2">
              🚨 Legacy Manual Architecture (72-Hour Backlog & High Error Rate)
            </div>

            <div class="space-y-2 text-[11px] text-slate-300">
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-rose-300 font-bold block">1. Developer Document</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Unchecked web code & content written in Word/Markdown files.</p>
              </div>
              <div class="text-center text-rose-400 font-bold">↓ (Manual Copy & Paste)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-rose-300 font-bold block">2. AEM Admin Console</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Human analyst copy-pastes HTML into AEM without automated checks.</p>
              </div>
              <div class="text-center text-rose-400 font-bold">↓ (Unverified Publish Attempt)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-rose-800/80">
                <span class="text-rose-400 font-bold block">3. Broken Webpages & API Failures</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Missing ARIA tags cause WCAG audit faults; mobile/portal API payloads time out.</p>
              </div>
            </div>
          </div>

          <!-- Optimized Architecture Box -->
          <div class="bg-slate-950 p-4 rounded-xl border border-emerald-900/60 bg-emerald-950/10 space-y-3">
            <div class="text-emerald-400 font-bold uppercase text-[11px] border-b border-emerald-900/50 pb-2">
              ✅ Optimized AI AST & Webhook Pipeline (<1.5 Hours & 100% Compliant)
            </div>

            <div class="space-y-2 text-[11px] text-slate-300">
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 font-bold block">1. AEM Edge Delivery Services (EDS)</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Developer pushes HTML/JSX content block into Git repository.</p>
              </div>
              <div class="text-center text-cyan-400 font-bold">↓ (Instant <20ms Code Audit)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-slate-800">
                <span class="text-emerald-300 font-bold block">2. AI Agentic AST Code Auditor</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Parses code nodes, calculates contrast (≥4.5:1), and auto-inserts ARIA landmark tags.</p>
              </div>
              <div class="text-center text-emerald-400 font-bold">↓ (Event Webhook Multi-Cast)</div>
              <div class="bg-slate-900 p-2.5 rounded border border-emerald-800/80">
                <span class="text-emerald-400 font-bold block">3. Modo Labs & OneCampus APIs (200 OK)</span>
                <p class="text-[10.5px] text-slate-400 font-sans mt-0.5">Event Gateway broadcasts JSON payloads to mobile app & student portal instantly.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection3 || isSection4 ? `
    <!-- SECTION 3 & 4 OUTER MAIN WINDOW -->
    <section id="workspace-container" class="space-y-4 py-2">
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            ${isSection3 ? 'SECTION 3 OF 5 | LEGACY WORKFLOW' : 'SECTION 4 OF 5 | OPTIMIZED WORKFLOW'}
          </div>
          <h1 class="text-base font-extrabold text-white mt-0.5">
            ${isSection3 ? 'Legacy Baseline: Manual Analyst Upload & Unverified Web Publishing' : 'System Optimization: AI Agentic AST Code Auditor + Event-Driven Webhook Integration Gateway'}
          </h1>
        </div>
      </div>

      ${isSection4 ? `
      <!-- ARCHITECTURAL JUSTIFICATION (PROCESS OF ELIMINATION) -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs font-sans space-y-2">
        <div class="text-cyan-400 font-mono font-bold text-[11px] uppercase">Architectural Justification (Process of Elimination):</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>• <strong>AI Code Audit & Fixing:</strong> AI Agentic AST Parser selected over LLM Fine-Tuning to auto-fix code while evaluating WCAG contrast mathematically in <20ms.</div>
          <div>• <strong>Multi-Platform Payload Sync:</strong> Event-Driven Webhooks selected over AI Agent loops for zero-error deterministic state shifts to Modo Labs & OneCampus.</div>
        </div>
      </div>
      ` : ''}

      <!-- TOP DISPLAY BANNER FOR LIVE SYSTEM EXPLANATIONS -->
      <div id="status-banner" class="hidden p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg transition-all"></div>

      <!-- INNER AEM MOCKUP WINDOW -->
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-2xl relative">

        <!-- AEM Header Bar Mockup -->
        <div class="bg-[#2C2C2C] text-white rounded-xl p-3 flex justify-between items-center text-xs font-sans shadow-md border border-slate-700">
          <div class="flex items-center gap-3">
            <span class="bg-[#FF0000] text-white font-extrabold px-2 py-0.5 rounded text-[11px] tracking-wide">Adobe AEM</span>
            <span class="font-semibold text-white/90">Cloud Service | Villanova UTS Web Console (villanova.edu)</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-mono text-white/80">
            <span>User: Associate Developer</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <div class="flex border-b border-slate-700/80 text-xs font-medium text-slate-300 gap-6 px-2">
          <div class="border-b-2 border-cyan-400 text-cyan-300 font-bold pb-2 cursor-pointer">1. Edge Delivery Services (EDS)</div>
          <div class="text-slate-400 hover:text-slate-200 pb-2 cursor-pointer">2. Modo Labs Mobile App Sync</div>
          <div class="text-slate-400 hover:text-slate-200 pb-2 cursor-pointer">3. OneCampus Web Portal Sync</div>
        </div>

        <!-- INNER MOCKUP PANELS GRID -->
        <div class="grid grid-cols-1 ${isSection3 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4">

          <!-- LEFT INNER PANEL: AEM PUBLISHING & AST AUDITOR -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div class="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <h2 class="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span class="w-2 h-2 rounded-full ${isSection3 ? 'bg-rose-400' : 'bg-cyan-400'}"></span>
                  ${isSection3 ? 'Analyst Manual Upload & Publishing' : 'AI Agentic AST Code Auditor'}
                </h2>
                <p class="text-[10px] text-slate-400 mt-0.5">Requisition #PR-2026-0343 | Page: villanova.edu/arts-sciences</p>
              </div>
            </div>

            <!-- Controls -->
            <div class="space-y-1.5">
              <div class="flex gap-2">
                ${isSection3 ? `<button id="btn-manual-upload" onclick="runManualUpload()" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-700 font-bold">Run Analyst Manual Upload</button>` : ''}
                ${isSection4 ? `<button id="btn-ai-ast-audit" onclick="runAIASTAudit()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run AI Agentic AST Audit & Auto-Fix</button>` : ''}
              </div>
            </div>

            <!-- Expanded Results Container (No Terminals, Zero Cutoff) -->
            <div id="publishing-results" class="min-h-[180px] max-h-[220px] overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
              <div class="text-slate-500 text-center text-[11px]">[Click button above to evaluate web code publishing]</div>
            </div>
          </div>

          ${isSection4 ? `
          <!-- RIGHT INNER PANEL: EVENT-DRIVEN WEBHOOK INTEGRATION GATEWAY -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div class="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <h2 class="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Event-Driven Webhook Gateway
                </h2>
                <p class="text-[10px] text-slate-400 mt-0.5">Automated Modo Labs Mobile & OneCampus Portal Multi-Cast</p>
              </div>
            </div>

            <!-- Action Controls -->
            <div class="space-y-1.5">
              <div class="flex gap-2">
                <button id="btn-webhook-execution" onclick="runWebhookExecution()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run Event Webhook Multi-Cast Sync</button>
              </div>
            </div>

            <!-- Expanded Execution Results Container (No Terminals, Zero Cutoff) -->
            <div id="webhook-results" class="min-h-[180px] max-h-[220px] overflow-y-auto bg-slate-900/60 border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
              <div class="text-slate-500 text-center text-[11px]">[Click button above to execute automated API payload broadcast]</div>
            </div>
          </div>
          ` : ''}

        </div>
      </div>
    </section>
    ` : ''}

    ${isSection5 ? `
    <!-- SECTION 5 CONTAINER: STANDALONE KEY TERMS APPENDIX -->
    <section id="section-5-container" class="py-2 space-y-3">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE</div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">Villanova UTS Web Services — Terminology & Solution Choice Rationale</h2>
          <p class="text-xs text-slate-400 mt-0.5">Plain English definitions with real-world civilian examples for software terms and architecture choices</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Analyst Manual Upload ("Copy-Pasting by Hand"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">A human developer manually copying web code into a website admin screen without automated checks, like typing a long address by hand instead of scanning a barcode.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Payload Sync ("Instant Broadcasting"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Sending updated campus news automatically over the internet to instantly update both the university phone app and student website at the exact same time without human copy-pasting.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• WCAG Accessibility ("Wheelchair Ramps for Websites"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Federal rules ensuring blind, visually impaired, or disabled students can use university web pages easily using screen-reading audio software.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• ARIA Landmarks ("Braille Signs for Screen Readers"):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Invisible web tags that tell screen-reader audio software where the navigation menu, main article, and search bar are located on a web page.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• AEM EDS (Adobe Experience Manager Edge Delivery Services):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">A high-speed website publishing engine that loads university web pages almost instantaneously across the globe.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Modo Labs & OneCampus:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Modo Labs is the official Villanova Mobile Student Phone App; OneCampus is the Villanova Student Portal website for grades and registration.</p>
          </div>
        </div>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-sans">
          <div class="text-cyan-400 font-mono font-bold uppercase text-[11px] border-b border-slate-800 pb-1">
            OPTIMAL SOLUTION CHOICE RATIONALE (PROCESS OF ELIMINATION):
          </div>
          <div class="space-y-1.5 text-slate-300 text-[11.5px]">
            <p><strong>1. Smart AI Auto-Fixing + Exact Math:</strong> The AI Agent automatically rewrites web code to fix accessibility errors, while using an exact AST math tool to guarantee zero AI hallucinations on color contrast ratios.</p>
            <p><strong>2. Ultra-Fast Execution (<20ms):</strong> Local AST code inspection runs in milliseconds on the server, avoiding slow network lag and keeping publishing turn times under 1.5 hours.</p>
            <p><strong>3. Zero Over-Engineering:</strong> Automatic web signals (webhooks) update the mobile app and portal instantly without needing complex multi-agent server clusters.</p>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection6 ? `
    <!-- SECTION 6 CONTAINER: DETAILED INNER SOFTWARE WORKINGS -->
    <section id="section-6-container" class="py-2 space-y-3">
      <div class="flex justify-between items-center">
        <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          ${techPart2 ? 'SECTION 6 OF 6 | SOFTWARE INNER WORKINGS (PART 2 OF 2)' : 'SECTION 6 OF 6 | SOFTWARE INNER WORKINGS (PART 1 OF 2)'}
        </div>
        <div class="flex gap-2">
          <a href="?mode=techdetails1" class="px-2.5 py-1 text-[11px] font-mono rounded-lg border ${!techPart2 ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}">Part 1: Engine</a>
          <a href="?mode=techdetails2" class="px-2.5 py-1 text-[11px] font-mono rounded-lg border ${techPart2 ? 'bg-cyan-950 text-cyan-300 border-cyan-500 font-bold' : 'bg-slate-900 text-slate-400 border-slate-800'}">Part 2: Webhooks</a>
        </div>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">
            ${techPart2 ? 'Event Webhook Integration Gateway & Production Resilience' : 'System Construction, Frameworks & AST Parser Mechanics'}
          </h2>
          <p class="text-xs text-slate-400 mt-0.5">Villanova UTS Web Services — Exhaustive Inner Software Architecture in Plain English</p>
        </div>

        ${!techPart2 ? `
        <!-- PART 1: STACK CONSTRUCTION & AST PARSER -->
        <div class="space-y-4 text-xs font-sans">
          <!-- Stack Construction -->
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-cyan-400 font-mono font-bold block text-[11px] uppercase">• Software Stack Construction & Component Wiring:</span>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11.5px] text-slate-300 font-mono">
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Core Backend Framework:</span>
                Node.js & Fastify async REST server.
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Code Parsing Library:</span>
                Babel AST Compiler & HTML DOM Parser.
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Database & Caching:</span>
                PostgreSQL (Audit history) & Redis (AST cache).
              </div>
              <div class="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                <span class="text-cyan-300 block font-bold">Production Readiness:</span>
                Pydantic validation, Pino logging, Docker container.
              </div>
            </div>
          </div>

          <!-- AST Mechanics Diagrammatic Layout -->
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-emerald-400 font-mono font-bold block text-[11px] uppercase">• AST Code Inspector & Rule Engine Inner Workings:</span>
            <div class="space-y-2 text-[11.5px] text-slate-300">
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Step 1: HTML Code Ingestion:</strong> Developer submits raw HTML page/component code to Fastify endpoint.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Step 2: In-Memory AST Tree Construction:</strong> Parser converts HTML string into an in-memory tree of nodes representing headings, links, and images.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Step 3: Mathematical Contrast & ARIA Validation:</strong> Evaluates RGB contrast formulas (must be ≥4.5:1) and verifies ARIA landmark nodes (<nav>, <main>, <header>) in <20ms.
              </div>
            </div>
          </div>
        </div>
        ` : `
        <!-- PART 2: AI TOOL-BINDING & WEBHOOK RESILIENCE -->
        <div class="space-y-4 text-xs font-sans">
          <!-- AI Tool Binding -->
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-cyan-400 font-mono font-bold block text-[11px] uppercase">• AI Agentic Tool-Binding & Auto-Fix Loop:</span>
            <div class="p-3 bg-slate-900 rounded border border-slate-800 space-y-2 text-[11.5px] text-slate-300">
              <p>1. <strong>Error Location Handoff:</strong> AST Inspector passes exact failing node coordinates to the AI Agent.</p>
              <p>2. <strong>Automated Code Auto-Fix:</strong> AI Agent modifies DOM hex color codes to compliant high-contrast values and inserts missing ARIA landmark attributes.</p>
              <p>3. <strong>Mathematical Re-Validation:</strong> AI Agent re-runs the AST Inspector tool to ensure 100% mathematical compliance before saving to PostgreSQL.</p>
            </div>
          </div>

          <!-- Webhook Engine Diagrammatic Layout -->
          <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span class="text-emerald-400 font-mono font-bold block text-[11px] uppercase">• Event Webhook Integration Gateway & Production Resilience:</span>
            <div class="space-y-2 text-[11.5px] text-slate-300">
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Event Multi-Cast Payload Construction:</strong> Formats JSON payloads specifically for Modo Labs Mobile REST API and OneCampus Portal REST API.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Encrypted HTTPS POST Transmission:</strong> Executes parallel API network calls with TLS encryption and bearer token authorization.
              </div>
              <div class="p-2.5 bg-slate-900 rounded border border-slate-800">
                <strong class="text-white">Production Fault Tolerance:</strong> Implements exponential backoff retries (3 attempts) and circuit breaker pattern to prevent data loss during network hiccups.
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

    function runManualUpload() {
      const results = document.getElementById('publishing-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-2 font-mono">
          <div class="text-rose-400 font-bold text-xs border-b border-rose-900/50 pb-1">Manual Upload: Requisition #PR-2026-0343</div>
          <div class="text-rose-300 font-extrabold text-xs border-l-2 border-rose-500 pl-2.5 py-1 bg-rose-950/30 rounded-r">
            ⚠️ Manual Publishing Failed: WCAG contrast rules violated & mobile portal API timed out!
          </div>
          <div class="text-slate-300 text-[11px] leading-relaxed space-y-1 font-sans">
            <p>• <strong>WCAG Audit Error:</strong> Text contrast ratio 2.1:1 fails required 4.5:1 AA threshold.</p>
            <p>• <strong>Screen Reader Fault:</strong> Missing ARIA landmark tags (&lt;nav&gt;, &lt;main&gt;) breaks screen-reader audio navigation.</p>
            <p>• <strong>API Sync Failure:</strong> Modo Labs Mobile App & OneCampus Web Portal connection timed out (504 Gateway Error).</p>
            <p class="text-rose-400 font-mono text-[10.5px] font-bold pt-1">Process halted. 72+ hour publishing backlog created; compliance risk flagged.</p>
          </div>
        </div>\`;

      showBanner(
        "<strong>⚠️ Manual upload failed:</strong> Human copy-pasting missed invisible WCAG accessibility tags and caused mobile portal sync timeouts, risking federal compliance audits.",
        "border-rose-800 bg-rose-950/60 text-rose-200"
      );
    }

    function runAIASTAudit() {
      const results = document.getElementById('publishing-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-2 font-mono">
          <div class="text-cyan-400 font-bold text-xs border-b border-slate-800 pb-1">AI Agentic AST Auditor: Requisition #PR-2026-0343</div>
          <div class="text-emerald-400 font-extrabold text-xs border-l-2 border-emerald-500 pl-2.5 py-1 bg-emerald-950/30 rounded-r">
            SUCCESS: 100% WCAG 2.1 AA Accessibility Compliant in &lt;20ms
          </div>
          <div class="text-slate-300 text-[11px] leading-relaxed space-y-1 font-sans">
            <p>• <strong>AST In-Memory DOM Inspection:</strong> Constructed DOM tree for AEM EDS component in &lt;2ms.</p>
            <p>• <strong>Auto-Fix Action:</strong> Hex color code auto-adjusted to high-contrast #0F172A (<strong class="text-emerald-300">7.1:1 ratio</strong>).</p>
            <p>• <strong>ARIA Tag Insertion:</strong> Inserted invisible landmark tags (&lt;nav&gt;, &lt;main&gt;, &lt;header&gt;).</p>
            <p class="text-emerald-400 font-mono text-[10.5px] font-bold pt-1">AST Re-Validation: 100% WCAG 2.1 AA compliance mathematically verified.</p>
          </div>
        </div>\`;

      showBanner(
        "<strong>✅ AI Agentic AST Audit succeeded:</strong> Automatically inspected and fixed WCAG accessibility code in <20ms, ensuring 100% digital compliance.",
        "border-cyan-800 bg-cyan-950/60 text-cyan-200"
      );
    }

    function runWebhookExecution() {
      const results = document.getElementById('webhook-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-2 font-mono">
          <div class="text-emerald-400 font-bold text-xs border-b border-slate-800 pb-1">Event Webhook Integration Gateway</div>
          <div class="text-emerald-300 font-extrabold text-xs border-l-2 border-emerald-500 pl-2.5 py-1 bg-emerald-950/30 rounded-r">
            SUCCESS: Multi-Platform Sync Complete in &lt;1.5 Hours
          </div>
          <div class="text-slate-300 text-[11px] leading-relaxed space-y-1 font-sans">
            <p>• <strong>Event Interception:</strong> Caught AEM 'PagePublished' event signal instantly.</p>
            <p>• <strong>Modo Labs Mobile API:</strong> Executed HTTPS POST broadcast (<strong class="text-emerald-300">200 OK - Payload Synced</strong>).</p>
            <p>• <strong>OneCampus Web Portal API:</strong> Executed HTTPS POST broadcast (<strong class="text-emerald-300">200 OK - Payload Synced</strong>).</p>
            <p class="text-cyan-400 font-mono text-[10.5px] font-bold pt-1">Deployment complete in 1.5 hours SLA | Net Savings: $1,130,000/yr</p>
          </div>
        </div>\`;

      showBanner(
        "<strong>✅ Event Webhook Multi-Cast succeeded:</strong> Automatically updated both the Modo Labs student mobile app and OneCampus web portal in <1.5 hours, capturing $1.13M in annual savings.",
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
