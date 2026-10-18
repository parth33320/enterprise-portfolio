const http = require('http');
const url = require('url');

const PORT = 3000;

function generateHtml(mode) {
  const isSection1 = mode === 'section1';
  const isSection2 = mode === 'section2';
  const isSection3 = mode === 'section3';
  const isSection4 = mode === 'section4';
  const isAppendix = mode === 'appendix';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Procurement Optimization Workspace</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    /* Custom Virtual Cursor & Click Ripple Animations */
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

  <!-- STANDARDIZED MAIN OUTER WINDOW CONTAINER -->
  <main class="max-w-5xl mx-auto space-y-6 min-h-screen flex flex-col justify-center">

    ${isSection1 ? `
    <!-- SECTION 1 CONTAINER: SYSTEM TARGET METRICS BRIEF -->
    <section id="section-1-container" class="space-y-6 py-4">
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 1 OF 5 | AUDIT BRIEF</div>
            <h1 class="text-xl font-extrabold text-white mt-1">Indirect Procurement Procure-to-Pay (P2P) Optimization</h1>
            <p class="text-xs text-slate-400 mt-1">Automating supplier quote analysis and Purchase Order execution to cut purchasing turn times from 72 hours down to 1.5 hours.</p>
          </div>
          <span class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
            +332.14% ROI
          </span>
        </div>

        <!-- Standardized 6-KPI Chips Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">LEGACY OPERATING COST</span>
            <span class="text-base font-extrabold text-rose-400">$12,400,000 / yr</span>
            <span class="text-[10px] text-slate-500 block mt-1">(Pre-optimization manual workflow cost)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">OPTIMIZED OPERATING COST</span>
            <span class="text-base font-extrabold text-emerald-400">$3,100,000 / yr</span>
            <span class="text-[10px] text-slate-500 block mt-1">(Post-optimization automated workflow cost)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">NET ANNUAL SAVINGS</span>
            <span class="text-base font-extrabold text-cyan-400">$9,300,000 / yr</span>
            <span class="text-[10px] text-slate-500 block mt-1">(Legacy minus Optimized)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">SOLUTION INVESTMENT</span>
            <span class="text-base font-extrabold text-slate-100">$2,800,000 USD</span>
            <span class="text-[10px] text-slate-500 block mt-1">(Platform build & deploy cost)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">RETURN ON INVESTMENT</span>
            <span class="text-base font-extrabold text-emerald-400">+332.14% ROI</span>
            <span class="text-[10px] text-slate-500 block mt-1">(Annual Savings / Investment)</span>
          </div>
          <div class="bg-slate-950 border border-slate-800 p-4 rounded-xl">
            <span class="text-[10px] text-slate-400 block mb-1 font-bold uppercase">EVM DELIVERABILITY</span>
            <span class="text-sm font-extrabold text-cyan-400">CPI 1.15 | SPI 1.08</span>
            <span class="text-[10px] text-slate-500 block mt-1">(96% Delivery Reliability)</span>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${isSection2 || isSection3 ? `
    <!-- SECTION 2 & 3 OUTER MAIN WINDOW -->
    <section id="workspace-container" class="space-y-4 py-2">
      <!-- TOP-LEFT SECTION LABEL & STANDARD OUTER HEADER -->
      <div class="flex justify-between items-center border-b border-slate-800 pb-3">
        <div>
          <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            ${isSection2 ? 'SECTION 2 OF 5 | LEGACY WORKFLOW' : 'SECTION 3 OF 5 | OPTIMIZED WORKFLOW'}
          </div>
          <h1 class="text-base font-extrabold text-white mt-0.5">
            ${isSection2 ? 'Legacy Baseline: Manual Supplier Quote Processing' : 'System Optimization: AI Quote Extraction Engine + SAP Deterministic Rules Engine'}
          </h1>
        </div>
      </div>

      ${isSection3 ? `
      <!-- ARCHITECTURE JUSTIFICATION PANEL (PROCESS OF ELIMINATION) -->
      <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-xs font-sans space-y-2">
        <div class="text-cyan-400 font-mono font-bold text-[11px] uppercase">Architectural Justification (Process of Elimination):</div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-slate-300">
          <div>• <strong>Unstructured Quote Parsing:</strong> Hybrid RAG (Qdrant Vector DB + BM25 Lexical Search) selected over Naive RAG & Fine-Tuning to combine semantic legal risk detection with 100% exact part number matching.</div>
          <div>• <strong>Financial Order Execution:</strong> SAP Deterministic Rules Engine selected over AI/Ontology to guarantee 100% zero-variance arithmetic and compliance during 3-Way Invoice Matching.</div>
        </div>
      </div>
      ` : ''}

      <!-- TOP DISPLAY BANNER FOR LIVE SYSTEM EXPLANATIONS -->
      <div id="status-banner" class="hidden p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg transition-all"></div>

      <!-- INNER SAP ARIBA MOCKUP WINDOW (SCOPED STRICTLY TO SOFTWARE UI) -->
      <div class="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 space-y-4 shadow-2xl relative">

        <!-- SAP Shell Bar Header Mockup -->
        <div class="bg-[#0A6ED1] text-white rounded-xl p-3 flex justify-between items-center text-xs font-sans shadow-md">
          <div class="flex items-center gap-3">
            <span class="bg-[#F0AB00] text-slate-950 font-extrabold px-2 py-0.5 rounded text-[11px] tracking-wide">SAP Ariba</span>
            <span class="font-semibold text-white/90">Sourcing & Procurement Workspace | Site 496 - Mexicali Plant</span>
          </div>
          <div class="flex items-center gap-3 text-[11px] font-mono text-white/80">
            <span>User: Sr Analyst Procurement</span>
            <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          </div>
        </div>

        <!-- SAP Module Navigation Tabs -->
        <div class="flex border-b border-slate-700/80 text-xs font-medium text-slate-300 gap-6 px-2">
          <div class="border-b-2 border-cyan-400 text-cyan-300 font-bold pb-2 cursor-pointer">1. Sourcing Events</div>
          <div class="text-slate-400 hover:text-slate-200 pb-2 cursor-pointer">2. Procure-to-Pay (P2P)</div>
          <div class="text-slate-400 hover:text-slate-200 pb-2 cursor-pointer">3. Master Contracts (LTA)</div>
        </div>

        <!-- INNER MOCKUP PANELS GRID -->
        <div class="grid grid-cols-1 ${isSection2 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4">

          <!-- LEFT INNER PANEL: SAP ARIBA SOURCING WORKSPACE -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div class="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <h2 class="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span class="w-2 h-2 rounded-full ${isSection2 ? 'bg-rose-400' : 'bg-cyan-400'}"></span>
                  ${isSection2 ? 'Manual Supplier Quote Analysis' : 'AI Supplier Quote & T&C Extraction Engine'}
                </h2>
                <p class="text-[10px] text-slate-400 mt-0.5">Requisition #PR-496-082 | CNC Carbide Inserts (Qty: 5,000 Units)</p>
              </div>
            </div>

            <!-- Sourcing Controls -->
            <div class="space-y-1.5">
              <div class="flex gap-2">
                ${isSection2 ? `<button id="btn-regular-sourcing" onclick="runManualSourcing()" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-700 font-bold">Run Manual Quote Analysis</button>` : ''}
                ${isSection3 ? `<button id="btn-ai-sourcing" onclick="runAISourcing()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run AI Quote & Terms Extraction</button>` : ''}
              </div>
            </div>

            <!-- Sourcing Results Container -->
            <div id="sourcing-search-results" class="min-h-[110px] bg-slate-900/60 border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
              <div class="text-slate-500 text-center text-[11px]">[Select sourcing mode above to evaluate supplier quotes]</div>
            </div>

            <!-- Live Terminal Stream Box (Strict Non-Clipping Height) -->
            <div class="bg-black/90 border border-slate-800 rounded-xl p-2.5 font-mono text-[10.5px] text-cyan-400 max-h-[130px] overflow-y-auto">
              <div class="text-slate-500 text-[9.5px] uppercase border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
                <span>Terminal Stream</span>
                <span id="sourcing-terminal-status" class="text-slate-600">IDLE</span>
              </div>
              <div id="sourcing-terminal-body" class="space-y-1 text-slate-300">
                <span class="text-slate-600">> Ready for quote evaluation execution...</span>
              </div>
            </div>
          </div>

          ${isSection3 ? `
          <!-- RIGHT INNER PANEL: DETERMINISTIC SAP ARIBA P2P RULE ENGINE -->
          <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-3">
            <div class="flex justify-between items-start border-b border-slate-800 pb-2">
              <div>
                <h2 class="text-xs font-bold text-white flex items-center gap-2 font-mono">
                  <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Deterministic SAP P2P Rule Engine
                </h2>
                <p class="text-[10px] text-slate-400 mt-0.5">Automated Purchase Order Creation & 3-Way Invoice Matching</p>
              </div>
            </div>

            <!-- P2P Action Controls -->
            <div class="space-y-1.5">
              <div class="flex gap-2">
                <button id="btn-p2p-execution" onclick="runP2PExecution()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run SAP P2P Auto-Execution</button>
              </div>
            </div>

            <!-- P2P Execution Results Container -->
            <div id="p2p-results" class="min-h-[110px] bg-slate-900/60 border border-slate-800 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
              <div class="text-slate-500 text-center text-[11px]">[Click button above to execute automated SAP order placement]</div>
            </div>

            <!-- Live Terminal Stream Box (Strict Non-Clipping Height) -->
            <div class="bg-black/90 border border-slate-800 rounded-xl p-2.5 font-mono text-[10.5px] text-emerald-400 max-h-[130px] overflow-y-auto">
              <div class="text-slate-500 text-[9.5px] uppercase border-b border-slate-800 pb-1 mb-1.5 flex justify-between">
                <span>Terminal Stream</span>
                <span id="p2p-terminal-status" class="text-slate-600">IDLE</span>
              </div>
              <div id="p2p-terminal-body" class="space-y-1 text-slate-300">
                <span class="text-slate-600">> Ready for automated order placement...</span>
              </div>
            </div>
          </div>
          ` : ''}

        </div>
      </div>
    </section>
    ` : ''}

    ${isSection4 ? `
    <!-- SECTION 4 CONTAINER: EXECUTIVE BRIEF -->
    <section id="section-4-container" class="py-2 space-y-3">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 4 OF 5 | EXECUTIVE DEAL BRIEF & VALUATION</div>

      <div id="executive-deal-brief-card" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl relative">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 class="text-base font-extrabold text-white tracking-tight">Executive Procurement Brief & Operational Risk Assessment</h2>
            <p class="text-xs text-slate-400 mt-0.5">Collins Aerospace - Indirect Procurement (Mexicali Site 496)</p>
          </div>
        </div>

        <!-- Risk Analysis Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
          <div class="bg-slate-950 p-3 rounded-xl border border-rose-900/50 bg-rose-950/10">
            <span class="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">Specific Risk Identified</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Unstructured supplier quote T&Cs contain hidden lead-time delays (<strong class="text-rose-400 font-mono">14 Weeks delivery</strong>) and 15% freight penalty clauses.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-amber-900/50 bg-amber-950/10">
            <span class="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Why It Matters</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Triggers factory assembly line downtime at Mexicali Site 496 and causes <strong class="text-amber-400 font-mono">$3.1 Million</strong> in unbudgeted off-contract maverick spend.
            </p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
            <span class="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">How To Eliminate Risk</span>
            <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
              Deploy AI LLM Quote Extraction to parse T&Cs in seconds, select contracted Vendor A (2-week lead time), and enforce 100% agreement leverage.
            </p>
          </div>
        </div>

        <!-- Benchmark Chart Comparison -->
        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div class="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2">
            <span class="text-slate-300 font-bold">Delivery Lead Time Benchmark Comparison (Weeks)</span>
            <span class="text-slate-500 text-[10px]">Source: SAP Ariba Analytics</span>
          </div>

          <div class="space-y-2.5 font-mono text-xs pt-1">
            <!-- Optimal Contracted Vendor -->
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">AI Recommended Vendor A (Contracted LTA Rate):</span>
                <span class="text-emerald-400 font-bold">2 Weeks Delivery (Optimal Total Cost)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-emerald-500 h-full rounded-full" style="width: 14%"></div>
              </div>
            </div>

            <!-- Manual Evaluation Vendor B -->
            <div>
              <div class="flex justify-between text-[11px] mb-1">
                <span class="text-slate-400">Manual Evaluation Vendor B (Hidden Delay Clause):</span>
                <span class="text-rose-400 font-bold">14 Weeks Delivery (12-Wk Delay Risk)</span>
              </div>
              <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
                <div class="bg-rose-500 h-full rounded-full" style="width: 100%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Banner -->
        <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 rounded-xl text-xs font-sans leading-relaxed">
          <strong>✅ Executive Recommendation:</strong> Deploy SAP Ariba AI Quote & T&C Extraction Engine to reduce purchasing turn times from 72 hours down to 1.5 hours and capture $9.3 Million in net annual indirect savings.
        </div>
      </div>
    </section>
    ` : ''}

    ${isAppendix || (!isSection1 && !isSection2 && !isSection3 && !isSection4) ? `
    <!-- SECTION 5 CONTAINER: STANDALONE KEY TERMS APPENDIX -->
    <section id="section-5-container" class="py-2 space-y-3">
      <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE</div>

      <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
        <div class="border-b border-slate-800 pb-3">
          <h2 class="text-base font-extrabold text-white tracking-tight">Procurement & System Terminology Glossary</h2>
          <p class="text-xs text-slate-400 mt-0.5">Plain English definitions for job-role acronyms and software workflow concepts</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-sans">
          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Requisition (PR):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">An internal request submitted by factory engineers asking to purchase specific tools or manufacturing supplies.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Purchase Order (PO):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">An official, legally binding contract issued to a supplier authorizing the purchase at agreed prices and delivery dates.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Goods Receipt Note (GRN):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">A document signed at the factory loading dock confirming physical delivery, item count, and quality inspection.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Vendor Invoice & Invoice Payment:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">The bill sent by the supplier requesting payment, and the final cash transfer issued after order validation.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• SAP 3-Way Match Rule:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Reconciling Purchase Order ($) == Goods Receipt (qty) == Vendor Invoice ($) before authorizing payment.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Procure-to-Pay (P2P):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">The end-to-end purchasing lifecycle starting from requisition submission down to final invoice payment.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Indirect Materials:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">Everyday factory operating supplies (cutting tools, safety gear, coolant) not built directly into the jet aircraft.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Long-Term Agreement (LTA) & Contract Table:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">A multi-year master contract locking in discounted pricing ($92/unit) stored in SAP master price tables.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Buyer & SLA Threshold:</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">The authorized Procurement Sr. Analyst executing the purchase within their delegated $100,000 release authority.</p>
          </div>

          <div class="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span class="text-cyan-400 font-mono font-bold block">• Total Cost of Ownership (TCO):</span>
            <p class="text-slate-300 text-[11.5px] leading-relaxed">The complete financial cost of a purchase, factoring in unit price, shipping surcharges, delivery lead times, and factory downtime risks.</p>
          </div>
        </div>
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

    async function typeTerminalLines(containerId, statusId, lines, statusText = "RUNNING") {
      const container = document.getElementById(containerId);
      const status = document.getElementById(statusId);
      if (!container || !status) return;
      container.innerHTML = "";
      status.innerText = statusText;
      status.className = "text-cyan-400 font-bold animate-pulse";

      for (const line of lines) {
        const div = document.createElement("div");
        div.className = "text-slate-200 font-mono text-[10.5px]";
        div.innerHTML = \`<span class="text-cyan-400">></span> \${line}\`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
        await new Promise(res => setTimeout(res, 400));
      }

      status.innerText = "COMPLETE";
      status.className = "text-emerald-400 font-bold";
    }

    function showBanner(htmlContent, bgClass) {
      const banner = document.getElementById('status-banner');
      if (!banner) return;
      banner.classList.remove('hidden');
      banner.className = "p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg " + bgClass;
      banner.innerHTML = htmlContent;
    }

    function runManualSourcing() {
      const results = document.getElementById('sourcing-search-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-1.5">
          <div class="text-rose-400 font-bold text-xs">Manual Evaluation: Requisition #PR-496-082</div>
          <div class="text-rose-300 font-extrabold text-xs border-l-2 border-rose-500 pl-2.5 py-1 bg-rose-950/20">
            ⚠️ Vendor B Selected ($88/unit), but hidden 14-week delivery clause was missed!
          </div>
          <div class="text-slate-400 text-[10.5px]">
            Manual evaluation missed fine print on Page 12 of Vendor B quote. Contracted Vendor A ($92/unit, 2-week delivery, Net 60) was bypassed.
          </div>
        </div>\`;

      typeTerminalLines('sourcing-terminal-body', 'sourcing-terminal-status', [
        "Reading 3 supplier PDF quotes manually for Requisition #PR-496-082...",
        "Analyst copy-pasting quote numbers into Excel spreadsheet...",
        "Human error: Missed fine-print 14-week lead-time clause on Page 12 of Vendor B quote.",
        "Process halted. Non-compliant vendor selected, triggering plant assembly line downtime."
      ]);

      showBanner(
        "<strong>⚠️ Manual process failed:</strong> Human quote evaluation missed fine-print lead-time penalties in PDF quotes, causing long plant downtime and $3.1M in maverick spend.",
        "border-rose-800 bg-rose-950/60 text-rose-200"
      );
    }

    function runAISourcing() {
      const results = document.getElementById('sourcing-search-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-1.5">
          <div class="text-cyan-400 font-bold text-xs">AI Extraction: Requisition #PR-496-082</div>
          <div class="text-emerald-400 font-extrabold text-xs border-l-2 border-emerald-500 pl-2.5 py-1 bg-emerald-950/20">
            RECOMMENDED: Vendor A (LTA Contracted) - $92/unit | 2-Week Delivery | Net 60 Terms
          </div>
          <div class="text-slate-300 text-[10.5px] flex gap-3 font-mono">
            <span>• Vendor B Rejected: <strong class="text-rose-400">14-Wk Lead Time Flagged</strong></span>
            <span>• TCO Evaluation: <strong class="text-emerald-300">Vendor A Optimal</strong></span>
          </div>
        </div>\`;

      typeTerminalLines('sourcing-terminal-body', 'sourcing-terminal-status', [
        "Executing Hybrid RAG (Qdrant Vector DB + BM25 Lexical Search)...",
        "Sparse Lexical Match: Exact Requisition #PR-496-082 & CNC Insert part specs.",
        "Dense Vector Search: Vendor A ($92/unit, 2-wk lead time, Net 60 terms).",
        "Dense Vector Search: Vendor B ($88/unit, 14-wk lead time, 15% freight penalty).",
        "AI Risk Alert: Vendor B rejected due to 14-week delivery delay on Page 12.",
        "Recommendation: Vendor A selected for optimal total cost of ownership (TCO)."
      ]);

      showBanner(
        "<strong>✅ AI Quote & T&C Extraction succeeded:</strong> Automatically extracted hidden lead-time risk clauses in seconds, recommending contracted Vendor A to ensure on-time delivery.",
        "border-cyan-800 bg-cyan-950/60 text-cyan-200"
      );
    }

    function runP2PExecution() {
      const results = document.getElementById('p2p-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-1.5">
          <div class="text-emerald-400 font-bold text-xs">SAP Ariba Engine: Procure-to-Pay Auto-Execution</div>
          <div class="text-emerald-300 font-extrabold text-xs border-l-2 border-emerald-500 pl-2.5 py-1 bg-emerald-950/20">
            SUCCESS: Purchase Order #PO-MX496-882 Created in <1.5 Hours
          </div>
          <div class="text-slate-300 text-[10.5px] font-mono">
            5,000 Units Carbide Inserts @ $92/unit | 3-Way Match Verified (PO = Goods Receipt = Invoice)
          </div>
        </div>\`;

      typeTerminalLines('p2p-terminal-body', 'p2p-terminal-status', [
        "Executing SAP Ariba Deterministic Rules Engine...",
        "Rule 1 Check: LTA Master Contract Table #CA-496 rate verified ($92/unit matches).",
        "Rule 2 Check: Buyer Spending Authority SLA verified ($92,000 release < $100,000 limit).",
        "Rule 3 Check: SAP 3-Way Invoice Match verified (PO $460,000 == Receipt == Invoice).",
        "SUCCESS: SAP Purchase Order #PO-MX496-882 issued in 1.5 hours (vs 72h SLA)."
      ]);

      showBanner(
        "<strong>✅ Deterministic SAP P2P Execution succeeded:</strong> Automated order placement and 3-way invoice matching in 1.5 hours, capturing $9.3M in net annual indirect savings.",
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
