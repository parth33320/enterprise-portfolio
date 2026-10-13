const fs = require('fs');
const path = require('path');

const queueDir = path.join(__dirname, '../_job_queue');
const publicDir = path.join(__dirname, '../public');
const historyFilePath = path.join(__dirname, '../_job_queue/history_registry.json');
const templatePath = path.join(__dirname, '../resume_template.md');
const resumeOutputDir = path.join(__dirname, '../dist_resumes');

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(queueDir)) fs.mkdirSync(queueDir, { recursive: true });
if (!fs.existsSync(resumeOutputDir)) fs.mkdirSync(resumeOutputDir, { recursive: true });

let historicalCases = [];
if (fs.existsSync(historyFilePath)) {
  try {
    historicalCases = JSON.parse(fs.readFileSync(historyFilePath, 'utf8'));
  } catch (err) {
    historicalCases = [];
  }
}

// Ingest newly generated profiles dropped by Jules
const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json');

jobFiles.forEach(file => {
  const filePath = path.join(queueDir, file);
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    fileData.gifAsset = `docs/assets/${fileData.reqId.toLowerCase()}.gif`;
    
    if (!historicalCases.some(item => item.reqId === fileData.reqId)) {
      historicalCases.unshift(fileData);
    }
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`[Error] Ingestion failure on ${file}:`, err.message);
  }
});

fs.writeFileSync(historyFilePath, JSON.stringify(historicalCases, null, 2));

// Generate the customized resume targets with macro interpolation 
if (fs.existsSync(templatePath)) {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  historicalCases.forEach(job => {
    const safeCompName = job.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const resumeFileName = `Resume_${safeCompName}_${job.reqId}.md`;
    const tailoredResume = templateContent.replace(/{{JOB_REQ_ID}}/g, job.reqId);
    fs.writeFileSync(path.join(resumeOutputDir, resumeFileName), tailoredResume);
  });
}

// Assemble frontend surface markup containing strictly metadata metrics and the GIF loop
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Enterprise Automation Audit Hub</title>
    <script src="https://tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-12 antialiased font-sans">
    <main class="max-w-5xl mx-auto space-y-8">
        
        <!-- Pinned Top Header Search Section -->
        <div class="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 class="text-xl font-bold text-white tracking-tight">System Architecture Walkthrough Index</h1>
                <p class="text-xs text-slate-400 mt-0.5">Verified solutions engineered to optimize enterprise operational margins.</p>
            </div>
            <div class="w-full md:w-72 shrink-0">
                <input type="text" id="archive-search" oninput="executeFilter()" placeholder="Search Company, Job Title, Requisition ID..." class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200">
            </div>
        </div>

        <!-- Deep-Linked Active Showcase Target Zone -->
        <div id="active-showcase-zone" class="hidden"></div>

        <!-- Master Portfolio Directory Grid -->
        <div id="portfolio-grid" class="grid grid-cols-1 gap-8"></div>
    </main>

    <script>
        const registry = ${JSON.stringify(historicalCases)};

        function getActiveProject() {
            const params = new URLSearchParams(window.location.search);
            const reqTarget = params.get('req');
            if (!reqTarget && registry.length > 0) return registry[0];
            return registry.find(item => item.reqId.toLowerCase() === reqTarget.toLowerCase()) || registry[0];
        }

        function renderActiveShowcase() {
            const project = getActiveProject();
            const zone = document.getElementById('active-showcase-zone');
            if (!project) return;
            
            zone.classList.remove('hidden');
            const roi = (((project.afterProfits - project.beforeProfits) / project.investmentCost) * 100).toFixed(2);

            zone.innerHTML = \`
                <div class="bg-slate-900/40 border border-cyan-500/20 p-6 rounded-2xl space-y-6 shadow-2xl relative">
                    <div class="absolute -top-3 left-6 bg-cyan-600 text-slate-950 font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Active Verification Target
                    </div>
                    
                    <!-- Civilian Parameter Metadata Strip -->
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2 pt-1 font-mono text-xs">
                        <div>
                            <div class="text-cyan-400 font-bold text-sm">\${project.companyName}</div>
                            <div class="text-white font-sans text-base font-bold mt-0.5">\${project.jobTitle}</div>
                            <div class="text-[11px] text-slate-500 mt-1">REQUISITION ID: <span class="text-slate-300">\${project.reqId}</span></div>
                        </div>
                        <div class="text-right text-[11px] text-slate-400 space-y-0.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                            <div>• Implementation Timeline: <span class="text-white font-bold">\${project.implementationSchedule}</span></div>
                            <div>• Release Accuracy (SAFe): <span class="text-white font-bold">\${project.piPredictability}%</span></div>
                            <div>• Budget Performance (CPI): <span class="text-white font-bold">\${project.cpi}</span></div>
                            <div>• Schedule Performance (SPI): <span class="text-white font-bold">\${project.spi}</span></div>
                        </div>
                    </div>

                    <!-- Clean Financial & Value Metrics Overlay Grid -->
                    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-500 block uppercase">Old Process Cost / Profit Leak</span>
                            <span class="text-base font-bold text-rose-400 block mt-1">\$\${project.beforeProfits.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-500 block uppercase">Recovered Profit / Savings</span>
                            <span class="text-base font-bold text-emerald-400 block mt-1">\$\${project.afterProfits.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                            <span class="text-[10px] text-slate-500 block uppercase">Solution Implementation Cost</span>
                            <span class="text-base font-bold text-slate-200 block mt-1">\$\${project.investmentCost.toLocaleString()}</span>
                        </div>
                        <div class="bg-slate-950 p-3.5 rounded-xl border border-cyan-900 bg-gradient-to-br from-slate-950 to-cyan-950/20">
                            <span class="text-[10px] text-cyan-500 block uppercase">Return on Investment (ROI)</span>
                            <span class="text-base font-bold text-cyan-300 block mt-1">\${roi}%</span>
                        </div>
                    </div>

                    <!-- Pinned Centralized Walkthrough Media Loop Container -->
                    <div class="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner relative group">
                        <img src="\${project.gifAsset}" class="w-full h-full object-cover" alt="System Verification Output Asset" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="hidden absolute inset-0 flex items-center justify-center text-xs text-slate-500 bg-slate-950 font-mono">
                            [Walking-trace animation (.gif) currently generating in branch pipeline workspace]
                        </div>
                    </div>
                </div>\`;
        }

        function renderArchive() {
            const grid = document.getElementById('portfolio-grid');
            if (registry.length === 0) {
                grid.innerHTML = '<div class="text-xs text-slate-500 font-mono p-4">No historical automation case traces recorded in ledger.</div>';
                return;
            }
            grid.innerHTML = registry.map(item => {
                const itemRoi = (((item.afterProfits - item.beforeProfits) / item.investmentCost) * 100).toFixed(2);
                return \`
                    <div class="case-card bg-slate-900/30 border border-slate-800 hover:border-cyan-500/30 p-5 rounded-2xl flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center transition-all cursor-pointer" data-search="\${item.companyName} \${item.jobTitle} \${item.reqId}" onclick="window.location.href='?req=\${item.reqId}'">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2 font-mono text-[10px]">
                                <span class="text-cyan-400 font-bold text-xs uppercase">\${item.companyName}</span>
                                <span class="text-slate-500">| REQ ID: \${item.reqId}</span>
                            </div>
                            <h3 class="text-sm font-bold text-white font-sans mt-1">\${item.jobTitle} Optimization Trace</h3>
                        </div>
                        <div class="flex justify-between items-center pt-2 border-t border-slate-800/60 font-mono text-[10px] w-full mt-2">
                            <span class="text-emerald-400 font-bold">Solution ROI: \${itemRoi}%</span>
                            <span class="text-cyan-400 font-semibold">View System Demo →</span>
                        </div>
                    </div>\`;
            }).join('');
        }

        function executeFilter() {
            const term = document.getElementById('archive-search').value.toLowerCase();
            document.querySelectorAll('.case-card').forEach(card => {
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
console.log('[Factory] Minimalist index assembled with absolute data scoping.');
