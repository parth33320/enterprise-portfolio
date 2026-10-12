const fs = require('fs');
const path = require('path');
const { generateDomainData } = require('./generate-synthetic-data');

const queueDir = path.join(__dirname, '../_job_queue');
const publicDir = path.join(__dirname, '../public');
const historyFilePath = path.join(__dirname, '../_job_queue/history_registry.json');
const templatePath = path.join(__dirname, '../resume_template.md');
const resumeOutputDir = path.join(__dirname, '../dist_resumes');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir);
if (!fs.existsSync(resumeOutputDir)) fs.mkdirSync(resumeOutputDir);

// 1. Initialize master history directory ledger
let historicalCases = [];
if (fs.existsSync(historyFilePath)) {
  historicalCases = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
}

// 2. Switftly process newly dropped job configuration models
const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json');

jobFiles.forEach(file => {
  const filePath = path.join(queueDir, file);
  const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Deduplicate by explicit Requisition ID to prevent dirty overwrites
  if (!historicalCases.some(item => item.reqId === fileData.reqId)) {
    historicalCases.unshift(fileData); // Insert newest at the absolute front
  }
  fs.unlinkSync(filePath); // Clean the staging queue file instantly
});

fs.writeFileSync(historyFilePath, JSON.stringify(historicalCases, null, 2));

// 3. Trigger 100k Big Data Simulation loops on the active target context
if (historicalCases.length > 0) {
  generateDomainData(historicalCases[0].sector, 100000);
}

// 4. Dynamic Resume Interpolation Engine: Compiles custom CV files automatically
if (fs.existsSync(templatePath)) {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  historicalCases.forEach(job => {
    const safeCompName = job.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const resumeFileName = `Resume_${safeCompName}_${job.reqId}.md`;
    
    // Inject the specific requisition parameters into the hyper-targeted link macro
    const tailoredResume = templateContent.replace(/{{JOB_REQ_ID}}/g, job.reqId);
    fs.writeFileSync(path.join(resumeOutputDir, resumeFileName), tailoredResume);
  });
  console.log(`[Resume Factory] Generated ${historicalCases.length} customized resume targets.`);
}

// 5. Compile the Interactive Dashboard Frontend Architecture
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Automation Audit Hub</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-12 antialiased font-sans">
    <main class="max-w-5xl mx-auto space-y-12">
        
        <!-- Deep-Linked Active Showcase Target Zone -->
        <div id="active-showcase-zone" class="hidden"></div>

        <!-- Master Portfolio Archive Index -->
        <div class="space-y-6">
            <div class="border-b border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 class="text-xl font-bold text-white tracking-tight">Enterprise Orchestration Portfolio Index</h2>
                    <p class="text-xs text-slate-400">Autonomous systems built to eliminate Lean Six Sigma operational wastes across multi-tenant contexts.</p>
                </div>
                <input type="text" id="archive-search" oninput="executeFilter()" placeholder="Search Requisition, Sector, Company..." class="bg-slate-900 border border-slate-800 text-xs px-4 py-2 rounded-xl focus:outline-none focus:border-cyan-500 w-full sm:w-64">
            </div>
            <div id="portfolio-grid" class="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
        </div>
    </main>

    <script>
        const registry = ${JSON.stringify(historicalCases)};

        function getActiveProject() {
            const params = new URLSearchParams(window.location.search);
            const reqTarget = params.get('req');
            if (!reqTarget && registry.length > 0) return registry[0]; // Fallback to newest case study
            return registry.find(item => item.reqId.toLowerCase() === reqTarget.toLowerCase()) || registry[0];
        }

        function renderActiveShowcase() {
            const project = getActiveProject();
            const zone = document.getElementById('active-showcase-zone');
            if (!project) return;
            
            zone.classList.remove('hidden');
            const roi = (((project.afterProfits - project.beforeProfits) / project.investmentCost) * 100).toFixed(2);

            zone.innerHTML = \`
                <div class="bg-slate-950 border border-cyan-500/20 p-6 rounded-2xl space-y-6 shadow-2xl relative">
                    <div class="absolute -top-3 left-6 bg-cyan-600 text-slate-950 font-mono text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        Tailored Target Optimization Case Study
                    </div>
                    
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2 pt-2">
                        <div>
                            <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">ID: \${project.reqId}</span>
                            <h1 class="text-2xl font-bold mt-1 text-white">Blueprint for \${project.companyName}</h1>
                            <p class="text-xs text-slate-400 mt-0.5">Sector Boundary: \${project.sector}</p>
                        </div>
                        <div class="text-xs bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-cyan-400 font-mono">
                            PI Predictability: \${project.piPredictability}%
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div class="md:col-span-2 bg-slate-900/50 p-5 rounded-xl border border-slate-800 space-y-2 text-xs">
                            <h4 class="font-bold text-white uppercase tracking-wider flex items-center gap-1.5 text-rose-400">
                                <span class="w-2 h-2 rounded-full bg-rose-500"></span> Lean Six Sigma Waste Analysis (Muda)
                            </h4>
                            <p class="text-slate-300 leading-relaxed font-sans text-[11px]">\${project.painPoint}</p>
                        </div>
                        <div class="bg-slate-900/50 p-5 rounded-xl border border-slate-800 space-y-1 text-xs">
                            <h4 class="font-bold text-cyan-400 uppercase tracking-wider">Bleeding Edge Countermeasure</h4>
                            <p class="text-slate-400 leading-relaxed text-[11px]">\${project.solution}</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><div class="text-slate-500">Before Profits</div><div class="text-lg font-bold text-rose-400 mt-0.5">$\${project.beforeProfits.toLocaleString()}</div></div>
                        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><div class="text-slate-500">After Profits</div><div class="text-lg font-bold text-emerald-400 mt-0.5">$\${project.afterProfits.toLocaleString()}</div></div>
                        <div class="bg-slate-900 p-4 rounded-xl border border-slate-800"><div class="text-slate-500">Investment Cost</div><div class="text-lg font-bold text-white mt-0.5">$\${project.investmentCost.toLocaleString()}</div></div>
                        <div class="bg-slate-900 p-4 rounded-xl border border-cyan-800 bg-gradient-to-br from-slate-900 to-cyan-950/30"><div class="text-cyan-500">Projected ROI</div><div class="text-lg font-bold text-cyan-300 mt-0.5">\${roi}%</div></div>
                    </div>

                    <div class="bg-slate-900/40 border border-slate-800/80 p-4 rounded-xl space-y-4">
                        <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider">Functional Verification System Demo</h4>
                        <div class="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden aspect-video max-w-2xl mx-auto">
                            <img src="\${project.gifAsset}" class="w-full h-full object-cover" alt="System Verification Trace">
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderArchive() {
            const grid = document.getElementById('portfolio-grid');
            if(registry.length === 0) {
               grid.innerHTML = '<p class="text-xs text-slate-500">No historic case runs recorded yet.</p>';
               return;
            }
            grid.innerHTML = registry.map(item => {
                const itemRoi = (((item.afterProfits - item.beforeProfits) / item.investmentCost) * 100).toFixed(2);
                return \`
                    <div class="case-card bg-slate-900 p-5 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors text-xs flex flex-col justify-between gap-4" data-search="\${item.companyName} \${item.sector} \${item.reqId}">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center font-mono text-[10px]">
                                <span class="text-cyan-400 font-bold">\${item.companyName}</span>
                                <span class="text-slate-500">\${item.reqId}</span>
                            </div>
${item.sector} Systems Sync
${item.painPoint}


ROI: ${itemRoi}%
View Deep Trace →


`;
}).join('');
}
function executeFilter() {
const term = document.getElementById('archive-search').value.toLowerCase();
const cards = document.querySelectorAll('.case-card');
cards.forEach(card => {
const haystack = card.getAttribute('data-search').toLowerCase();
card.style.display = haystack.includes(term) ? 'flex' : 'none';
});
}
renderActiveShowcase();
renderArchive();


`;
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('[Factory] Dashboard surface compiled successfully.');

// Ensure this update is integrated inside your scripts/compile-portfolio.js HTML string generation block:
const sectionHtmlPatch = `
<!-- SECTION 2 & 3 Side-by-Side Presentation Layout -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="bg-slate-900/40 p-5 rounded-xl border border-rose-950/40 space-y-2">
        <span class="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> SECTION 2: Legacy Workflow Baseline (Before)
        </span>
        <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
            Unmitigated multi-tenant data drift across un-isolated databases. Manual spreadsheet reconciliation loops create compounding operational processing latency, causing stock tracking defects and severe transactional transaction lag.
        </p>
    </div>
    
    <div class="bg-slate-900/40 p-5 rounded-xl border border-cyan-950/40 space-y-2">
        <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> SECTION 3: SupplyAgent Sovereign Workflow (After)
        </span>
        <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
            Strict middleware layer enforcement automatically maps an explicit query context table lock via <code class="text-cyan-400 font-mono">tenant_id</code> scoping constraints. Core inventory stockout triggers dispatch automatedTerm negotiation routines immediately.
        </p>
    </div>
</div>`;

