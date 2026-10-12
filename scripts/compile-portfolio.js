const fs = require('fs');
const path = require('path');
const { generateDomainData } = require('./generate-synthetic-data');

const queueDir = path.join(__dirname, '../_job_queue');
const publicDir = path.join(__dirname, '../public');
const historyFilePath = path.join(__dirname, '../_job_queue/history_registry.json');
const templatePath = path.join(__dirname, '../resume_template.md');
const resumeOutputDir = path.join(__dirname, '../dist_resumes');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir, { recursive: true });
if (!fs.existsSync(resumeOutputDir)) fs.mkdirSync(resumeOutputDir, { recursive: true });

// 1. Initialize master history directory ledger safely
let historicalCases = [];
if (fs.existsSync(historyFilePath)) {
  try {
    historicalCases = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
  } catch (err) {
    console.warn('[Warning] Failed to parse history registry. Defaulting to empty array.');
    historicalCases = [];
  }
}

// 2. Process newly dropped job configuration models in the queue
const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json');

// Track if a brand new job was actively injected during this pipeline run
let processedSector = null;

jobFiles.forEach(file => {
  const filePath = path.join(queueDir, file);
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Dynamically capture the incoming active sector before clearing the file
    processedSector = fileData.sector;
    
    // Deduplicate by explicit Requisition ID to prevent dirty overwrites
    if (!historicalCases.some(item => item.reqId === fileData.reqId)) {
      historicalCases.unshift(fileData); // Insert newest at the absolute front
    }
    fs.unlinkSync(filePath); // Clean the staging queue file instantly
  } catch (err) {
    console.error(`[Error] Failed to process queue file ${file}:`, err.message);
  }
});

// Update the master long-term registry back onto the workspace disk
fs.writeFileSync(historyFilePath, JSON.stringify(historicalCases, null, 2));

// 3. Trigger 100k Big Data Simulation Loop safely
if (processedSector) {
  // Scenario A: A fresh job arrived, use its explicit sector profile
  generateDomainData(processedSector, 100000);
} else if (historicalCases.length > 0 && historicalCases[0].sector) {
  // Scenario B: Fallback to the latest record inside your persistent ledger
  generateDomainData(historicalCases[0].sector, 100000);
} else {
  // Scenario C: Total fallback safeguard to prevent pipeline dropout crashes
  console.log('[Factory] Staging queue empty and no historic cases found. Skipping data simulation loop.');
}

// 4. Dynamic Resume Interpolation Engine: Compiles custom CV files automatically
if (fs.existsSync(templatePath)) {
  try {
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    historicalCases.forEach(job => {
      const safeCompName = job.companyName.replace(/[^a-zA-Z0-9]/g, '_');
      const resumeFileName = `Resume_${safeCompName}_${job.reqId}.md`;
      
      // Inject the unique requisition identifier into your template links
      const tailoredResume = templateContent.replace(/{{JOB_REQ_ID}}/g, job.reqId);
      fs.writeFileSync(path.join(resumeOutputDir, resumeFileName), tailoredResume);
    });
    console.log(`[Resume Factory] Generated ${historicalCases.length} customized resume targets.`);
  } catch (err) {
    console.error('[Error] Exception inside the Resume Generation module:', err.message);
  }
}

// 5. Compile the Interactive Dashboard Frontend Architecture
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Automation Audit Hub</title>
    <script src="https://cdn.tailwindcss.com"></script>
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
            if (!reqTarget && registry.length > 0) return registry[0]; // Fallback to newest study
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

                    <!-- SECTION 2 & 3: Side-by-Side Presentation Layout Embedded Dynamically -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-slate-900/40 p-5 rounded-xl border border-rose-950/40 space-y-2 text-xs">
                            <span class="text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span> SECTION 2: Legacy Workflow Baseline (Before)
                            </span>
                            <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Unmitigated multi-tenant data drift across un-isolated databases. Manual spreadsheet reconciliation loops create compounding operational processing latency, causing stock tracking defects and severe transactional transaction lag.
                            </p>
                        </div>
                        <div class="bg-slate-900/40 p-5 rounded-xl border border-cyan-950/40 space-y-2 text-xs">
                            <span class="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-cyan-500"></span> SECTION 3: SupplyAgent Sovereign Workflow (After)
                            </span>
                            <p class="text-[11px] text-slate-400 leading-relaxed font-sans">
                                Strict middleware layer enforcement automatically maps an explicit query context table lock via tenant_id scoping constraints. Core inventory stockout triggers dispatch automatedTerm negotiation routines immediately.
                            </p>
                        </div>
                    </div>

                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-slate-800/80">
                        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <span class="text-[10px] font-mono text-slate-400 block uppercase">Before Profits</span>
                            <span class="text-sm font-bold text-rose-400 font-mono">$\${project.beforeProfits.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <span class="text-[10px] font-mono text-slate-400 block uppercase">After Profits</span>
                            <span class="text-sm font-bold text-emerald-400 font-mono">$\${project.afterProfits.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <span class="text-[10px] font-mono text-slate-400 block uppercase">Investment Cost</span>
                            <span class="text-sm font-bold text-slate-200 font-mono">$\${project.investmentCost.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-center">
                            <span class="text-[10px] font-mono text-slate-400 block uppercase">Projected ROI</span>
                            <span class="text-sm font-bold text-cyan-400 font-mono">\${roi}%</span>
                        </div>
                    </div>
                </div>
            \`;
        }

        function renderArchive() {
            const grid = document.getElementById('portfolio-grid');
            if (registry.length === 0) {
                grid.innerHTML = '<p class="text-xs text-slate-400 col-span-2">No historic case runs recorded yet.</p>';
                return;
            }
            grid.innerHTML = registry.map(item => {
                const itemRoi = (((item.afterProfits - item.beforeProfits) / item.investmentCost) * 100).toFixed(2);
                return \`
                    <div class="case-card bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-5 rounded-2xl flex flex-col justify-between space-y-4 transition-all cursor-pointer" data-search="\${item.companyName} \${item.reqId} \${item.sector}" onclick="window.location.href='?req=\${item.reqId}'">
                        <div class="space-y-2">
                            <div class="flex justify-between items-center">
                                <h3 class="text-base font-bold text-white">\${item.companyName}</h3>
                                <span class="text-[10px] font-mono bg-slate-800 text-cyan-400 px-2 py-0.5 rounded">\${item.reqId}</span>
                            </div>
                            <p class="text-xs font-semibold text-slate-300">\${item.sector} Optimization</p>
                            <p class="text-[11px] text-slate-400 line-clamp-2">\${item.painPoint}</p>
                        </div>
                        <div class="flex justify-between items-center pt-2 border-t border-slate-800/60 text-xs">
                            <span class="font-mono text-emerald-400 font-bold">ROI: \${itemRoi}%</span>
                            <span class="text-cyan-400 font-medium hover:underline text-[11px]">View Deep Trace →</span>
                        </div>
                    </div>
                \`;
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
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('[Factory] Clean data-driven web app compiled successfully.');
