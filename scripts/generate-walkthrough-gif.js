const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runRecordingPipeline() {
  console.log('[Jules Media Engine] Initializing domain-agnostic headless recording workspace...');
  
  const queueDir = path.join(__dirname, '../_job_queue');
  const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json');
  
  if (jobFiles.length === 0) {
    console.log('[Jules Media Engine] Staging queue empty. Exiting media compiler.');
    return;
  }
  
  const jobData = JSON.parse(fs.readFileSync(path.join(queueDir, jobFiles[0]), 'utf8'));
  const targetReqId = jobData.reqId.toLowerCase();
  const targetGifName = `${targetReqId}.gif`;

  const frameStagingDir = path.join(__dirname, '../_frame_staging');
  if (fs.existsSync(frameStagingDir)) {
    fs.rmSync(frameStagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(frameStagingDir, { recursive: true });

  const outputGifPublicPath = path.join(__dirname, `../public/docs/assets/${targetGifName}`);
  const outputGifDocsPath = path.join(__dirname, `../docs/assets/${targetGifName}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  
  let frameIdx = 1000;
  const captureFrames = async (count, delayMs = 300) => {
    for (let i = 0; i < count; i++) {
      const framePath = path.join(frameStagingDir, `frame_${frameIdx++}.png`);
      await page.screenshot({ path: framePath });
      await new Promise(r => setTimeout(r, delayMs));
    }
  };

  const renderTitleCard = (sectionNum, title, body) => `
    <html lang="en">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body style="background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 40px; box-sizing: border-box; -webkit-font-smoothing: antialiased;">
      <div style="width: 100%; max-width: 850px; border: 1px solid #1e293b; padding: 40px; border-radius: 20px; background-color: #0f172a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);">
        <span style="font-family: monospace; color: #22d3ee; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em;">${sectionNum}</span>
        <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin-top: 8px; margin-bottom: 16px; letter-spacing: -0.02em;">${title}</h1>
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.7;">${body}</div>
      </div>
    </body>
    </html>`;

  // =========================================================================
  // --- SECTION 1: SYSTEM TARGET METRICS BRIEF ---
  // =========================================================================
  const roi = (((jobData.afterProfits - jobData.beforeProfits) / jobData.investmentCost) * 100).toFixed(2);
  const section1Summary = `
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 12px; margin-bottom: 12px;">
      <div><strong>Target Entity:</strong> <span style="color: #38bdf8;">${jobData.companyName}</span> (${jobData.jobTitle})</div>
      <div><strong>Industry Sector:</strong> <span style="color: #cbd5e1;">${jobData.sector}</span> (Req #${jobData.reqId})</div>
    </div>
    <div style="background-color: #020617; border: 1px solid #1e293b; padding: 16px; border-radius: 12px; font-family: monospace; font-size: 11px; line-height: 1.8;">
      • Old Process Cost / Profit Leak: <span style="color: #f87171;">$${jobData.beforeProfits.toLocaleString()} USD</span><br>
      • Recovered Profit / Annual Savings: <span style="color: #4ade80;">$${jobData.afterProfits.toLocaleString()} USD</span><br>
      • Solution Implementation Cost: <span style="color: #e2e8f0;">$${jobData.investmentCost.toLocaleString()} USD</span><br>
      • Calculated Return on Investment (ROI): <strong style="color: #38bdf8;">${roi}%</strong><br>
      • Project Performance: CPI <span style="color: #4ade80;">${jobData.cpi}</span> | SPI <span style="color: #4ade80;">${jobData.spi}</span> | Agile Delivery <span style="color: #38bdf8;">${jobData.piPredictability}%</span><br>
      • Implementation Schedule: <span style="color: #f8fafc;">${jobData.implementationSchedule}</span>
    </div>`;
  
  await page.setContent(renderTitleCard("Section 1: Audit Brief", "Enterprise Production Optimization Framework", section1Summary));
  await captureFrames(8, 400);

  // =========================================================================
  // --- SECTION 2: LEGACY WORKFLOW BASELINE SIMULATION ---
  // =========================================================================
  const section2Explanation = `
    <strong>Target Subject:</strong> AeroPropulsion Systems Inc. <br><br>
    <strong>Legacy Friction Breakdown:</strong><br>
    1. Regular keyword search (Ctrl+F) fails on target filings because it misses synonyms (searches for 'Debt Liabilities' but document lists 'Subordinated Borrowing Notes').<br>
    2. Analysts are forced into manual PDF reading and copy-pasting numbers into master Excel spreadsheets.<br>
    3. Under deal volume, manual typing leads to human formula errors, missing debt figures, and spreadsheet calculation crashes.`;

  await page.setContent(renderTitleCard("Section 2: Legacy Baseline", "Visual Simulation of Identified Process Waste (Muda)", section2Explanation));
  await captureFrames(8, 400);

  // Navigate to local application workspace
  await page.goto('http://localhost:3000/inventory');
  await captureFrames(3, 300);

  // Demonstrate Step 1: Regular Search Failure
  await page.click('#btn-regular-search');
  await captureFrames(12, 300);

  // Demonstrate Step 2: Injected Manual Process Crash
  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background-color: #000000; color: #ef4444; font-family: monospace; padding: 50px; height: 100vh; box-sizing: border-box; font-size: 13px; display: flex; flex-direction: column; justify-content: center;">
        <div style="max-width: 800px; margin: 0 auto; border: 2px solid #dc2626; padding: 30px; border-radius: 12px; background-color: #450a0a;">
          <h1 style="font-size: 20px; text-transform: uppercase; margin-bottom: 16px; font-weight: bold;">🚨 MANUAL PROCESS FAILURE: SPREADSHEET_CALCULATION_CRASH</h1>
          <p style="color: #fca5a5; font-size: 14px; margin-bottom: 20px;">
            Spreadsheet calculation broke down due to missing debt numbers and human copy-paste errors under deal volume.
          </p>
          <div style="color: #94a3b8; line-height: 1.6; font-size: 12px;">
            > Error: Unindexed document 'AeroPropulsion_Notes.pdf' contains uncaptured $42.5M debt liability.<br>
            > Relational valuation boundary dropped. Target acquisition assessment aborted.
          </div>
          <div style="color: #ef4444; margin-top: 24px; font-weight: bold;">[Annual Profit Leak Impact: $4,500,000 USD]</div>
        </div>
      </div>`;
  });
  await captureFrames(10, 400);

  // =========================================================================
  // --- SECTION 3: SOVEREIGN OPTIMIZED APPLICATION RUN ---
  // =========================================================================
  const section3Explanation = `
    <strong>Target Subject:</strong> AeroPropulsion Systems Inc. <br><br>
    <strong>Sovereign AI Countermeasure Integration:</strong><br>
    1. <strong>AI RAG Smart Search:</strong> Searches document meaning and synonyms to automatically find hidden borrowing notes.<br>
    2. <strong>AI Business Relationship Mapping (Ontology):</strong> Categorizes AeroPropulsion Systems under Lockheed's Missile Division and checks debt limits.<br>
    3. <strong>Executive Deal Brief & Valuation Chart:</strong> Renders real-time debt risk analysis and transaction pricing recommendations.`;

  await page.setContent(renderTitleCard("Section 3: Optimized State", "Deploying Custom AI RAG & Ontology Countermeasure", section3Explanation));
  await captureFrames(8, 400);

  // Reload clean application environment
  await page.goto('http://localhost:3000/inventory');
  await captureFrames(3, 300);

  // Run AI RAG Search with live terminal trace
  await page.click('#btn-rag-search');
  await captureFrames(14, 300);

  // Run AI Ontology Audit with live terminal trace
  await page.click('#btn-ontology-audit');
  await captureFrames(14, 300);

  // Smooth scroll down to view Executive Deal Brief & Interactive Chart
  await page.evaluate(() => {
    document.getElementById('executive-deal-brief-card').scrollIntoView({ behavior: 'smooth' });
  });
  await captureFrames(12, 350);

  await browser.close();

  console.log('[Jules Media Engine] Compiling PNG frames into GIF using Pillow compiler...');

  [path.dirname(outputGifPublicPath), path.dirname(outputGifDocsPath)].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  try {
    execSync(`python3 scripts/frame_to_gif.py "${frameStagingDir}" "${outputGifPublicPath}" 350`);
    fs.copyFileSync(outputGifPublicPath, outputGifDocsPath);
    console.log(`[Jules Media Engine] Walkthrough GIF loop successfully generated at:\n - ${outputGifPublicPath}\n - ${outputGifDocsPath}`);
  } catch (err) {
    console.error('[Jules Media Engine] Media pipeline compilation error:', err.message);
  }
}

runRecordingPipeline();
