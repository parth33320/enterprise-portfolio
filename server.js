const http = require('http');
const url = require('url');

const PORT = 3000;

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>M&A Target Intelligence Workspace</title>
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

  <main class="max-w-5xl mx-auto space-y-6">

    <!-- TOP DISPLAY BANNER FOR LIVE SYSTEM EXPLANATIONS -->
    <div id="status-banner" class="hidden p-4 rounded-xl border text-xs font-sans leading-relaxed shadow-lg transition-all"></div>

    <!-- WORKSPACE PANEL GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <!-- LEFT PANEL: RAG SMART SEARCH WORKSPACE -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative">
        <div class="flex justify-between items-start border-b border-slate-800 pb-2">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span>
              AI RAG Smart Search
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">Semantic Meaning & Synonym Vector Search vs. Standard Keyword Search</p>
          </div>
          <span class="bg-cyan-950 border border-cyan-800 text-cyan-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            SECTION 3 | AI RAG & ONTOLOGY OPTIMIZATION
          </span>
        </div>

        <!-- Search Input Controls -->
        <div class="space-y-1.5">
          <label class="block text-xs text-slate-300 font-mono">Search Target Disclosure Documents:</label>
          <div class="flex gap-2">
            <input type="text" id="rag-query-input" value="" placeholder="Type query here..." class="flex-1 bg-slate-950 border border-slate-800 text-xs px-3.5 py-2 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500">
            <button id="btn-regular-search" onclick="runRegularSearch()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono px-3 py-2 rounded-xl border border-slate-700">Non-AI Search</button>
            <button id="btn-rag-search" onclick="runRAGSearch()" class="bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run AI RAG Search</button>
          </div>
        </div>

        <!-- Search Results Container -->
        <div id="rag-search-results" class="min-h-[120px] bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
          <div class="text-slate-500 text-center">[Enter query and select search mode to test document retrieval]</div>
        </div>

        <!-- Live Terminal Stream Box -->
        <div class="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-cyan-400 min-h-[110px] overflow-hidden">
          <div class="text-slate-500 text-[10px] uppercase border-b border-slate-800 pb-1 mb-2 flex justify-between">
            <span>Terminal</span>
            <span id="rag-terminal-status" class="text-slate-600">IDLE</span>
          </div>
          <div id="rag-terminal-body" class="space-y-1 text-slate-300">
            <span class="text-slate-600">> Ready for search execution...</span>
          </div>
        </div>
      </div>


      <!-- RIGHT PANEL: ONTOLOGY BUSINESS RELATIONSHIP WORKSPACE -->
      <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg relative">
        <div class="flex justify-between items-start border-b border-slate-800 pb-2">
          <div>
            <h2 class="text-sm font-bold text-white flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
              AI Business Relationship Mapping (Ontology Engine)
            </h2>
            <p class="text-[11px] text-slate-400 mt-0.5">Corporate Structure & Defense Compliance Rule Mapping</p>
          </div>
          <span class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
            SECTION 3 | AI RAG & ONTOLOGY OPTIMIZATION
          </span>
        </div>

        <!-- Ontology Action Controls -->
        <div class="space-y-1.5">
          <label class="block text-xs text-slate-300 font-mono">Target Entity Categorization & Governance:</label>
          <div class="flex gap-2">
            <button id="btn-ontology-audit" onclick="runOntologyAudit()" class="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs font-mono px-3.5 py-2 rounded-xl transition">Run AI Ontology Audit</button>
          </div>
        </div>

        <!-- Ontology Results Container -->
        <div id="ontology-results" class="min-h-[120px] bg-slate-950 border border-slate-800/80 rounded-xl p-3 font-mono text-xs flex flex-col justify-center">
          <div class="text-slate-500 text-center">[Select rule check mode to evaluate target entity]</div>
        </div>

        <!-- Live Terminal Stream Box -->
        <div class="bg-black/90 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-emerald-400 min-h-[110px] overflow-hidden">
          <div class="text-slate-500 text-[10px] uppercase border-b border-slate-800 pb-1 mb-2 flex justify-between">
            <span>Terminal</span>
            <span id="ontology-terminal-status" class="text-slate-600">IDLE</span>
          </div>
          <div id="ontology-terminal-body" class="space-y-1 text-slate-300">
            <span class="text-slate-600">> Ready for relationship mapping...</span>
          </div>
        </div>
      </div>

    </div>

    <!-- EXECUTIVE DEAL SUMMARY & VALUATION CHART -->
    <div id="executive-deal-brief-card" class="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-2xl relative">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-3 gap-2">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-cyan-400 font-mono text-[10px] font-bold tracking-widest uppercase block">Lockheed Martin Corporate Development</span>
          </div>
          <h2 class="text-base font-extrabold text-white tracking-tight mt-0.5">Executive M&A Deal Brief: AeroPropulsion Systems Inc.</h2>
        </div>
        <div class="flex items-center gap-3">
          <span class="bg-emerald-950 border border-emerald-800 text-emerald-300 text-[9px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
            SECTION 4 | EXECUTIVE DEAL BRIEF & VALUATION
          </span>
          <div class="bg-slate-950 border border-slate-800 px-3 py-1 rounded-xl text-right font-mono text-xs">
            <span class="text-slate-400 block text-[9px]">Requisition ID:</span>
            <span class="text-cyan-300 font-bold">19075</span>
          </div>
        </div>
      </div>

      <!-- Risk Analysis Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        <div class="bg-slate-950 p-3 rounded-xl border border-rose-900/50 bg-rose-950/10">
          <span class="text-[10px] text-rose-400 font-bold block uppercase tracking-wider">Specific Risk Identified</span>
          <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
            AeroPropulsion Systems carries <strong class="text-rose-400 font-mono">$42.5 Million</strong> in hidden subordinated borrowing debt. Debt-to-EBITDA ratio is <strong class="text-rose-400 font-mono">4.2x</strong> (exceeding Lockheed's 3.0x safe limit).
          </p>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-amber-900/50 bg-amber-950/10">
          <span class="text-[10px] text-amber-400 font-bold block uppercase tracking-wider">Why It Matters</span>
          <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
            Lockheed Martin becomes legally responsible for paying this $42.5M debt post-acquisition, which directly reduces transaction profit margins.
          </p>
        </div>

        <div class="bg-slate-950 p-3 rounded-xl border border-emerald-900/50 bg-emerald-950/10">
          <span class="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">How To Eliminate Risk</span>
          <p class="text-slate-200 font-sans text-xs mt-1 leading-snug">
            Lockheed Martin can lower the acquisition offer price by $42.5 Million or mandate debt payoff prior to transaction close.
          </p>
        </div>
      </div>

      <!-- Interactive Debt & Valuation Chart Comparison -->
      <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
        <div class="flex justify-between items-center text-xs font-mono border-b border-slate-800/80 pb-2">
          <span class="text-slate-300 font-bold">Debt Liability Benchmark Comparison ($ Millions)</span>
          <span class="text-slate-500 text-[10px]">Source: AI RAG & Ontology Verification</span>
        </div>

        <div class="space-y-2.5 font-mono text-xs pt-1">
          <!-- Baseline Safe Threshold -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-slate-400">Lockheed Martin Safe Debt Baseline (3.0x EBITDA Limit):</span>
              <span class="text-emerald-400 font-bold">$25.0M</span>
            </div>
            <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
              <div class="bg-emerald-500 h-full rounded-full" style="width: 58%"></div>
            </div>
          </div>

          <!-- Actual Target Debt -->
          <div>
            <div class="flex justify-between text-[11px] mb-1">
              <span class="text-slate-400">AeroPropulsion Systems Actual Uncovered Debt:</span>
              <span class="text-rose-400 font-bold">$42.5M (Excess +$17.5M)</span>
            </div>
            <div class="w-full bg-slate-900 h-3.5 rounded-full overflow-hidden border border-slate-800">
              <div class="bg-rose-500 h-full rounded-full" style="width: 100%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Banner -->
      <div class="p-3 bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 rounded-xl text-xs font-sans leading-relaxed">
        <strong>✅ Executive Deal Recommendation:</strong> AI Relationship Mapping detected $42.5M in hidden debt for AeroPropulsion Systems. Lockheed can eliminate this profit margin risk by reducing the purchase offer by $42.5M before closing.
      </div>
    </div>

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
      banner.classList.remove('hidden');
      banner.className = "p-3.5 rounded-xl border text-xs font-sans leading-relaxed shadow-lg " + bgClass;
      banner.innerHTML = htmlContent;
    }

    function runRegularSearch() {
      const results = document.getElementById('rag-search-results');

      results.innerHTML = \`
        <div class="space-y-2">
          <div class="text-rose-400 font-bold">Query: "Debt Liabilities" | Mode: Non-AI Search</div>
          <div class="text-rose-300 font-extrabold text-sm border-l-2 border-rose-500 pl-3 py-1 bg-rose-950/20">
            0 Results Found in AeroPropulsion Systems Filings
          </div>
          <div class="text-slate-400 text-[11px]">
            Keyword match failed. Document Page 187 phrases debt as "Subordinated Borrowing Notes".
          </div>
        </div>\`;

      typeTerminalLines('rag-terminal-body', 'rag-terminal-status', [
        "Executing exact string match for 'Debt Liabilities'...",
        "Scanning 300 pages of AeroPropulsion Systems PDFs...",
        "String match failed: 'Debt Liabilities' not found.",
        "Process halted. Analyst forced to perform manual reading."
      ]);

      showBanner(
        "<strong>⚠️ Non-AI search failed</strong> because it only looks for exact words and cannot understand synonyms or different phrasing (like 'Borrowing Notes').",
        "border-rose-800 bg-rose-950/60 text-rose-200"
      );
    }

    function runRAGSearch() {
      const results = document.getElementById('rag-search-results');

      results.innerHTML = \`
        <div class="space-y-2">
          <div class="text-cyan-400 font-bold">Query: "Debt Liabilities" | Mode: AI RAG Smart Vector Search</div>
          <div class="text-emerald-400 font-extrabold text-sm border-l-2 border-emerald-500 pl-3 py-1 bg-emerald-950/20">
            Found on Page 187: "Subordinated Borrowing Notes - $42.5 Million"
          </div>
          <div class="text-slate-300 text-[11px] flex gap-4 font-mono">
            <span>• Cosine Match: <strong class="text-cyan-300">0.94</strong></span>
            <span>• Vector Chunk: <strong class="text-cyan-300">#42</strong></span>
            <span>• Semantic Meaning: <strong class="text-emerald-300">EXACT MATCH</strong></span>
          </div>
        </div>\`;

      typeTerminalLines('rag-terminal-body', 'rag-terminal-status', [
        "Indexing AeroPropulsion Systems disclosures...",
        "Generated 128 semantic vector embeddings...",
        "Executing semantic vector search for 'Debt Liabilities'...",
        "Cosine Similarity Match: 0.94 -> Chunk #42 (Page 187)",
        "Found: 'Subordinated Borrowing Notes - $42.5 Million'"
      ]);

      showBanner(
        "<strong>✅ AI RAG Search succeeded</strong> because it searches for sentence meaning and financial synonyms, finding hidden debt for AeroPropulsion Systems that regular search missed.",
        "border-cyan-800 bg-cyan-950/60 text-cyan-200"
      );
    }

    function runOntologyAudit() {
      const results = document.getElementById('ontology-results');

      results.innerHTML = \`
        <div class="space-y-2">
          <div class="text-emerald-400 font-bold">Rule Check: AI Business Relationship Mapping (Ontology Engine)</div>
          <div class="text-rose-400 font-extrabold text-sm border-l-2 border-rose-500 pl-3 py-1 bg-rose-950/20">
            FLAGGED FOR REVIEW: Debt-to-EBITDA 4.2x vs. 3.0x Sector Limit
          </div>
          <div class="text-slate-300 text-[11px] font-mono">
            Mapped Entity: AeroPropulsion Systems -> Lockheed Missiles & Fire Control Division
          </div>
        </div>\`;

      typeTerminalLines('ontology-terminal-body', 'ontology-terminal-status', [
        "Reading company structure for AeroPropulsion Systems...",
        "Semantic Triple: <AeroPropulsionSystems, subContractorOf, LockheedFireControl>",
        "Running ITAR Compliance & Financial Rule Check...",
        "FLAGGED: Debt-to-EBITDA ratio (4.2x) exceeds sector baseline (3.0x)"
      ]);

      showBanner(
        "<strong>✅ AI Relationship Mapping</strong> connects AeroPropulsion Systems to Lockheed's business rules, automatically uncovering hidden deal risks.",
        "border-emerald-800 bg-emerald-950/60 text-emerald-200"
      );
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/demo') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(htmlContent);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`[Demo Workspace Server] Running on http://localhost:${PORT}/demo`);
});
