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
const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json' && f !== 'schema.json');

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

// Assemble frontend surface markup with clean, job-centric walkthrough cards
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Solutions Index</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
    </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-4 md:p-10 antialiased font-sans">
    <main class="max-w-5xl mx-auto space-y-8">
        
        <!-- Top Header & Search Control Bar -->
        <div class="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xl backdrop-blur-sm">
            <div>
                <h1 class="text-xl font-extrabold text-white tracking-tight">Business Solutions Index</h1>
            </div>
            <div class="w-full md:w-96 shrink-0 space-y-1">
                <div class="relative">
                    <input type="text" id="archive-search" oninput="executeFilter(false)" onkeydown="handleSearchKeydown(event)" placeholder="Search Company, Job Title, Requisition ID..." class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors pr-24">
                    <button onclick="executeFilter(true)" class="absolute right-2 top-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono px-2.5 py-1.5 rounded-lg border border-slate-700 transition">Jump ↵</button>
                </div>
                <div class="text-[10px] text-slate-400 font-mono text-right">Press Enter to Jump to Top Result</div>
            </div>
        </div>

        <!-- Master Portfolio Directory Grid (Latest Case at Top) -->
        <div id="portfolio-grid" class="space-y-8"></div>
    </main>

    <script>
        const registry = ${JSON.stringify(historicalCases)};

        function renderPortfolio() {
            const grid = document.getElementById('portfolio-grid');
            if (!registry || registry.length === 0) {
                grid.innerHTML = '<div class="text-xs text-slate-500 font-mono p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800">No walkthrough entries recorded in system index.</div>';
                return;
            }

            grid.innerHTML = registry.map(item => {
                const reqBadge = item.reqId ? \`<span class="text-slate-400 font-mono text-xs">REQ ID: <span class="text-slate-200 font-bold">\${item.reqId}</span></span>\` : '';

                return \`
                    <div class="case-card bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-5 shadow-2xl transition-all" data-search="\${item.companyName} \${item.jobTitle} \${item.reqId}">

                        <!-- Clean Job Posting Header Strip -->
                        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2">
                            <div>
                                <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">\${item.companyName}</div>
                                <h2 class="text-lg font-extrabold text-white font-sans mt-0.5 tracking-tight">\${item.jobTitle}</h2>
                            </div>
                            <div>
                                \${reqBadge}
                            </div>
                        </div>

                        <!-- Walkthrough GIF Media Container -->
                        <div class="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner relative group">
                            <img src="\${item.gifAsset}" class="w-full h-full object-cover" alt="\${item.companyName} - \${item.jobTitle} Walkthrough" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                            <div class="hidden absolute inset-0 flex items-center justify-center text-xs text-slate-500 bg-slate-950 font-mono">
                                [Walkthrough animation (.gif) generating in build pipeline]
                            </div>
                        </div>
                    </div>\`;
            }).join('');
        }

        function executeFilter(shouldJump = false) {
            const term = document.getElementById('archive-search').value.toLowerCase().trim();
            const cards = document.querySelectorAll('.case-card');
            let visibleCount = 0;
            let firstVisibleCard = null;

            cards.forEach(card => {
                const haystack = card.getAttribute('data-search').toLowerCase();
                const isMatch = haystack.includes(term);
                card.style.display = isMatch ? 'block' : 'none';
                if (isMatch) {
                    visibleCount++;
                    if (!firstVisibleCard) firstVisibleCard = card;
                }
            });

            // Handle Empty State
            let emptyStateEl = document.getElementById('search-empty-state');
            if (visibleCount === 0) {
                if (!emptyStateEl) {
                    emptyStateEl = document.createElement('div');
                    emptyStateEl.id = 'search-empty-state';
                    emptyStateEl.className = 'bg-slate-900/40 border border-dashed border-slate-800 p-12 rounded-2xl text-center space-y-3';
                    document.getElementById('portfolio-grid').appendChild(emptyStateEl);
                }
                emptyStateEl.innerHTML = \`
                    <div class="text-cyan-400 font-mono text-2xl font-bold">🔍</div>
                    <div class="text-sm font-bold text-slate-200">No Business Solutions Found</div>
                    <div class="text-xs text-slate-400 font-mono">No matching walkthrough entries found for "<span class="text-cyan-400">\${term}</span>". Try searching company name, job title, or REQ ID.</div>
                \`;
                emptyStateEl.style.display = 'block';
            } else if (emptyStateEl) {
                emptyStateEl.style.display = 'none';
            }

            // Smooth Jump to Top Match if requested or on Enter
            if (shouldJump && firstVisibleCard) {
                firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        function handleSearchKeydown(event) {
            if (event.key === 'Enter') {
                executeFilter(true);
            }
        }

        renderPortfolio();
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('[Factory] Portfolio website successfully compiled with job-centric walkthrough layout.');
