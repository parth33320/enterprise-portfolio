const http = require('http');
const url = require('url');

const PORT = 3000;

function generateHtml(mode) {
  const isSection1 = mode === 'section1';
  const isSection2 = mode === 'section2';
  const isSection3 = mode === 'section3';
  const isSection4 = mode === 'section4';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Collins Aerospace - Indirect Procurement Optimization Workspace</title>
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

  <main class="max-w-5xl mx-auto space-y-12 min-h-screen flex flex-col justify-center">

    ${isSection1 ? `
    <!-- SECTION 1 CONTAINER: SYSTEM TARGET METRICS BRIEF -->
    <section id="section-1-container" class="space-y-6 py-4">
      <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div class="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <div class="font-mono text-cyan-400 text-xs font-bold uppercase tracking-wider">Collins Aerospace (Site 496 - Mexicali)</div>
            <h1 class="text-xl font-extrabold text-white mt-1">Indirect Procurement Procure-to-Pay (P2P) Optimization</h1>
            <p class="text-xs text-slate-400 mt-1">Simple Plain English Summary: Replacing manual purchase order spreadsheets with automated SAP Ariba quote analysis to cut purchasing turn time from 72 hours down to 1.5 hours.</p>
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

        <!-- Plain English Acronym Guide -->
        <div class="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-xs space-y-1">
          <div class="text-cyan-400 font-bold font-mono text-[11px] uppercase">📖 Key Procurement Terms & Acronyms Explained in Simple English:</div>
          <div class="text-slate-300 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div>• <strong>P2P (Procure-to-Pay):</strong> The complete buying process from requesting materials to paying supplier invoices.</div>
            <div>• <strong>Indirect Materials:</strong> Everyday factory operating supplies (tools, coolant, safety gear) not built into the final aircraft.</div>
            <div>• <strong>PO (Purchase Order):</strong> Official contract sent to a supplier authorizing the purchase.</div>
            <div>• <strong>T&Cs (Terms & Conditions):</strong> Contract rules covering delivery dates, warranties, and payment deadlines.</div>
          </div>
        </div>
      </div>
    </section>
    ` : ''}

    ${!isSection1 && !isSection4 ? `
    <!-- WORKSPACE SECTION CONTAINER -->
    <section id="workspace-container" class="space-y-4 py-4">
      <!-- TOP DISPLAY BANNER FOR LIVE SYSTEM EXPLANATIONS -->
      <div id="status-banner" class="hidden p-4 rounded-xl border text-xs font-sans leading-relaxed shadow-lg transition-all"></div>

      <!-- WORKSPACE PANEL GRID -->
      <div class="grid grid-cols-1 ${isSection2 ? 'grid-cols-1' : 'md:grid-cols-2'} gap-4">

      <!-- LEFT PANEL: SAP ARIBA SOURCING & QUOTE ANALYSIS WORKSPACE -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative">
        <!-- SAP Ariba Styled Header Mockup -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded text-[10px] font-bold">SAP Ariba</span>
            <span class="text-slate-300 font-bold">Sourcing Module | Requisition #PR-496-082</span>
          </div>
          <span class="text-slate-500 text-[10px]">Site 496 - Mexicali Plant</span>
        </div>

        <div class="flex justify-between items-start border-b border-slate-800 pb-2">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full ${isSection2 ? 'bg-rose-400' : 'bg-cyan-400'}"></span>
              ${isSection2 ? 'Manual Supplier Quote & T&C Analysis' : 'AI Supplier Quote & Terms Extraction Engine'}
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">
              ${isSection2 ? 'Sourcing Package: CNC Carbide Inserts (Qty: 5,000 Units)' : 'Automated extraction of unit prices, delivery lead times, and risk clauses from supplier PDF quotes'}
            </p>
          </div>
          <span class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider shrink-0 panel-section-badge">
            ${isSection2 ? 'SECTION 2 OF 4 | LEGACY WORKFLOW' : 'SECTION 3 OF 4 | OPTIMIZED WORKFLOW'}
          </span>
        </div>

        <!-- Sourcing Controls -->
        <div class="space-y-1.5">
          <label class="block text-xs text-slate-300 font-mono">Supplier Quotes Evaluation Queue:</label>
          <div class="flex gap-2">
            ${isSection2 ? `<button id="btn-regular-sourcing" onclick="runManualSourcing()" class="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono px-3.5 py-2 rounded-xl border border-slate-700 font-bold">Run Manual Quote Analysis</button>` : ''}
            ${isSection3 ? `<button id="btn-ai-sourcing" onclick="runAISourcing()" class="w-full bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run AI Quote & Terms Extraction</button>` : ''}
          </div>
        </div>

        <!-- Sourcing Results Container -->
        <div id="sourcing-search-results" class="min-h-[120px] bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
          <div class="text-slate-500 text-center">[Select sourcing mode above to evaluate supplier quotes]</div>
        </div>

        <!-- Live Terminal Stream Box -->
        <div class="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-cyan-400 min-h-[110px] overflow-hidden">
          <div class="text-slate-500 text-[10px] uppercase border-b border-slate-800 pb-1 mb-2 flex justify-between">
            <span>Terminal Stream</span>
            <span id="sourcing-terminal-status" class="text-slate-600">IDLE</span>
          </div>
          <div id="sourcing-terminal-body" class="space-y-1 text-slate-300">
            <span class="text-slate-600">> Ready for quote evaluation execution...</span>
          </div>
        </div>
      </div>


      ${!isSection2 ? `
      <!-- RIGHT PANEL: DETERMINISTIC SAP ARIBA P2P RULE ENGINE WORKSPACE -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative">
        <!-- SAP Ariba Styled Header Mockup -->
        <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center text-xs font-mono">
          <div class="flex items-center gap-2">
            <span class="bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 px-2 py-0.5 rounded text-[10px] font-bold">SAP Ariba</span>
            <span class="text-slate-300 font-bold">P2P Auto-Execution | Purchase Order Generator</span>
          </div>
          <span class="text-slate-500 text-[10px]">Site 496 - Mexicali Plant</span>
        </div>

        <div class="flex justify-between items-start border-b border-slate-800 pb-2">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              Deterministic SAP P2P Rule Engine
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">Automated Purchase Order (PO) creation, policy compliance, and 3-way invoice matching</p>
          </div>
          <span class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider shrink-0 panel-section-badge">
            SECTION 3 OF 4 | OPTIMIZED WORKFLOW
          </span>
        </div>

        <!-- P2P Action Controls -->
        <div class="space-y-1.5">
          <label class="block text-xs text-slate-300 font-mono">SAP Procure-to-Pay Order Execution:</label>
          <div class="flex gap-2">
            <button id="btn-p2p-execution" onclick="runP2PExecution()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run SAP P2P Auto-Execution</button>
          </div>
        </div>

        <!-- P2P Execution Results Container -->
        <div id="p2p-results" class="min-h-[120px] bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
          <div class="text-slate-500 text-center">[Click button above to execute automated SAP order placement]</div>
        </div>

        <!-- Live Terminal Stream Box -->
        <div class="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400 min-h-[110px] overflow-hidden">
          <div class="text-slate-500 text-[10px] uppercase border-b border-slate-800 pb-1 mb-2 flex justify-between">
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
    </section>
    ` : ''}

    ${isSection4 || (!isSection1 && !isSection2 && !isSection3) ? `
    <!-- SECTION 4 CONTAINER: EXECUTIVE DEAL BRIEF & VALUATION MATRIX -->
    <section id="section-4-container" class="py-4">
      <div id="executive-deal-brief-card" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl relative">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-cyan-400 font-mono text-[10px] font-bold tracking-widest uppercase block">Collins Aerospace Procurement Leadership</span>
          </div>
          <h2 class="text-base font-extrabold text-white tracking-tight mt-0.5">Executive Procurement Brief: Mexicali Plant (Site 496)</h2>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            SECTION 4 OF 4 | EXECUTIVE DEAL BRIEF & VALUATION
          </span>
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

      <!-- Interactive Benchmark Chart Comparison -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2">
          <span class="text-slate-300 font-bold">Delivery Lead Time Benchmark Comparison (Weeks)</span>
          <span class="text-slate-500 text-[10px]">Source: Collins Aerospace SAP Ariba Analytics</span>
        </div>

        <div class="space-y-2.5 font-mono text-xs pt-1">
          <!-- Optimal Contracted Vendor -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-slate-400">AI Recommended Vendor A (Contracted LTA Rate):</span>
              <span class="text-emerald-400 font-bold">2 Weeks Delivery (Optimal TCO)</span>
            </div>
            <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 14%"></div>
            </div>
          </div>

          <!-- Manual Evaluation Vendor B -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-slate-400">Manual Evaluation Vendor B (Hidden Delay Clause):</span>
              <span class="text-rose-400 font-bold">14 Weeks Delivery (12-Wk Delay)</span>
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

  </main>

  <!-- CLIENT INTERACTION & RIPPLE ANIMATION SCRIPT -->
  <script>
    function triggerRippleAt(x, y) {
      const cursor = document.getElementById('virtual-cursor');
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
      container.innerHTML = "";
      status.innerText = statusText;
      status.className = "text-cyan-400 font-bold animate-pulse";

      for (const line of lines) {
        const div = document.createElement("div");
        div.className = "text-slate-200 font-mono text-[11px]";
        div.innerHTML = \`<span class="text-cyan-400">></span> \${line}\`;
        container.appendChild(div);
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
        <div class="space-y-2">
          <div class="text-rose-400 font-bold">Queue: Requisition #PR-496-082 | Mode: Manual Quote Parsing</div>
          <div class="text-rose-300 font-extrabold text-sm border-l-2 border-rose-500 pl-3 py-1 bg-rose-950/20">
            ⚠️ WARNING: Vendor B Selected ($88/unit), but hidden 14-week delivery clause was missed!
          </div>
          <div class="text-slate-400 text-[11px]">
            Manual evaluation missed hidden fine print on Page 12 of Vendor B quote. Contracted Vendor A ($92/unit, 2-week delivery, Net 60) was bypassed.
          </div>
        </div>\`;

      typeTerminalLines('sourcing-terminal-body', 'sourcing-terminal-status', [
        "Reading 3 supplier PDF quotes manually for Requisition #PR-496-082...",
        "Analyst copy-pasting pricing numbers into Excel...",
        "Human error: Missed hidden 14-week lead-time clause on Page 12 of Vendor B quote.",
        "Process halted. Wrong vendor selected, triggering factory downtime at Mexicali Site 496."
      ]);

      showBanner(
        "<strong>⚠️ Manual process failed:</strong> Human quote evaluation missed hidden fine-print lead-time penalties in PDF quotes, causing long plant downtime and $3.1M in maverick spend.",
        "border-rose-800 bg-rose-950/60 text-rose-200"
      );
    }

    function runAISourcing() {
      const results = document.getElementById('sourcing-search-results');
      if (!results) return;

      results.innerHTML = \`
        <div class="space-y-2">
          <div class="text-cyan-400 font-bold">Queue: Requisition #PR-496-082 | Mode: AI Quote & T&C Extraction Engine</div>
          <div class="text-emerald-400 font-extrabold text-sm border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/20">
            RECOMMENDED: Vendor A (LTA Contracted) - $92/unit | 2-Week Delivery | Net 60 Terms
          </div>
          <div class="text-slate-300 text-[11px] flex gap-4 font-mono">
            <span>• Vendor B Rejected: <strong class="text-rose-400">14-Wk Lead Time Flagged</strong></span>
            <span>• TCO Evaluation: <strong class="text-emerald-300">Vendor A 100% Optimal</strong></span>
          </div>
        </div>\`;

      typeTerminalLines('sourcing-terminal-body', 'sourcing-terminal-status', [
        "Parsing 3 supplier PDF quotes via AI LLM Extraction...",
        "Extracted: Vendor A ($92/unit, 2wks lead time, Net 60 terms).",
        "Extracted: Vendor B ($88/unit, 14wks lead time, 15% freight surcharge clause).",
        "AI Flagged: Vendor B rejected due to 14-week delivery risk.",
        "Sourcing Decision Matrix: Vendor A selected for optimal total cost of ownership (TCO)."
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
        <div class="space-y-2">
          <div class="text-emerald-400 font-bold">SAP Ariba Engine: Procure-to-Pay Auto-Execution</div>
          <div class="text-emerald-300 font-extrabold text-sm border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/20">
            SUCCESS: SAP Purchase Order #PO-MX496-882 Created in <1.5 Hours
          </div>
          <div class="text-slate-300 text-[11px] font-mono">
            Line Items: 5,000 Units Carbide Inserts @ $92/unit | 3-Way Match Verified (PO, Receipt, Invoice)
          </div>
        </div>\`;

      typeTerminalLines('p2p-terminal-body', 'p2p-terminal-status', [
        "Initiating SAP Ariba automated Procure-to-Pay workflow...",
        "Leveraging existing Long-Term Agreement #LTA-CA-496...",
        "Executing SAP 3-Way Match Rule Check (PO = Goods Receipt = Invoice)...",
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
