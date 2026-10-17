const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runRecordingPipeline() {
  console.log('[Jules Media Engine] Initializing domain-agnostic headless recording workspace...');
  
  const queueDir = path.join(__dirname, '../_job_queue');
  const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json' && f !== 'schema.json');
  const historyPath = path.join(queueDir, 'history_registry.json');
  
  let jobData;
  if (jobFiles.length > 0) {
    jobData = JSON.parse(fs.readFileSync(path.join(queueDir, jobFiles[0]), 'utf8'));
  } else if (fs.existsSync(historyPath)) {
    const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    if (history.length > 0) {
      jobData = history[0];
    }
  }

  if (!jobData) {
    console.log('[Jules Media Engine] No job data found. Exiting media compiler.');
    return;
  }
  const targetReqId = jobData.reqId.toLowerCase();
  const targetGifName = `${targetReqId}.gif`;

  const beforeCost = jobData.beforeCost || 17700000;
  const afterCosts = jobData.afterCosts || 4500000;
  const netSavings = beforeCost - afterCosts;
  const roi = (((netSavings) / jobData.investmentCost) * 100).toFixed(2);

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
  const captureFrames = async (count, delayMs = 600) => {
    for (let i = 0; i < count; i++) {
      const framePath = path.join(frameStagingDir, `frame_${frameIdx++}.png`);
      await page.screenshot({ path: framePath });
      await new Promise(r => setTimeout(r, delayMs));
    }
  };

  const renderTitleCard = (sectionNum, title, body) => `
    <html lang="en">
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
    </head>
    <body style="background-color: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 40px; box-sizing: border-box; -webkit-font-smoothing: antialiased; overflow: hidden;">
      <div style="width: 100%; max-width: 900px; border: 1px solid #1e293b; padding: 40px; border-radius: 20px; background-color: #0f172a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6);">
        <span style="font-family: monospace; color: #22d3ee; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.12em;">${sectionNum}</span>
        <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin-top: 8px; margin-bottom: 20px; letter-spacing: -0.02em;">${title}</h1>
        <div style="font-size: 13px; color: #94a3b8; line-height: 1.7;">${body}</div>
      </div>
    </body>
    </html>`;

  // Helper to simulate human typing into an input box character-by-character
  const simulateHumanTyping = async (selector, text) => {
    await page.focus(selector);
    await page.evaluate((sel) => { document.querySelector(sel).value = ''; }, selector);
    await captureFrames(1, 400);

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      await page.type(selector, char, { delay: 120 });
      await captureFrames(1, 200);
    }
    await captureFrames(2, 400);
  };

  // Helper to simulate smooth cursor movement & click ripple animation on a button
  const simulateClickWithRipple = async (selector) => {
    const box = await page.locator(selector).boundingBox();
    if (box) {
      const clickX = box.x + box.width / 2;
      const clickY = box.y + box.height / 2;
      await page.evaluate(({ x, y }) => {
        if (typeof window.triggerRippleAt === 'function') {
          window.triggerRippleAt(x, y);
        }
      }, { x: clickX, y: clickY });
      await captureFrames(2, 300);
    }
    await page.click(selector);
  };

  // =========================================================================
  // --- SECTION 1 OF 4: SYSTEM TARGET METRICS BRIEF ---
  // =========================================================================
  const section1Summary = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 20px;">
      <div>
        <div style="font-size: 12px; font-weight: bold; color: #38bdf8; font-family: monospace; text-transform: uppercase;">${jobData.companyName}</div>
        <div style="font-size: 16px; font-weight: 800; color: #ffffff;">${jobData.sector}</div>
      </div>
      <div style="background-color: #052e16; border: 1px solid #166534; color: #4ade80; font-family: monospace; font-size: 12px; font-weight: bold; padding: 6px 14px; border-radius: 9999px;">
        +${roi}% ROI
      </div>
    </div>

    <!-- Standardized 6-KPI Chips Grid -->
    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; font-family: monospace;">
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">LEGACY OPERATING COST</span>
        <span style="font-size: 15px; font-weight: 800; color: #f87171;">$${beforeCost.toLocaleString()} / yr</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Pre-optimization manual cost)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">OPTIMIZED OPERATING COST</span>
        <span style="font-size: 15px; font-weight: 800; color: #4ade80;">$${afterCosts.toLocaleString()} / yr</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Post-optimization automated cost)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">NET ANNUAL SAVINGS</span>
        <span style="font-size: 15px; font-weight: 800; color: #38bdf8;">$${netSavings.toLocaleString()} / yr</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Legacy minus Optimized)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">SOLUTION INVESTMENT</span>
        <span style="font-size: 15px; font-weight: 800; color: #f8fafc;">$${jobData.investmentCost.toLocaleString()} USD</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Platform build & deploy cost)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">RETURN ON INVESTMENT</span>
        <span style="font-size: 15px; font-weight: 800; color: #4ade80;">+${roi}% ROI</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Annual Savings / Investment)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">EVM DELIVERABILITY</span>
        <span style="font-size: 13px; font-weight: 800; color: #38bdf8;">CPI ${jobData.cpi} | SPI ${jobData.spi}</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(${jobData.piPredictability}% Delivery Reliability)</span>
      </div>
    </div>`;
  
  await page.setContent(renderTitleCard("SECTION 1 OF 4 | AUDIT BRIEF", "M&A Workflow Optimization Framework", section1Summary));
  await captureFrames(8, 600);

  // =========================================================================
  // --- SECTION 2 OF 4: LEGACY WORKFLOW BASELINE SIMULATION ---
  // =========================================================================
  const section2Explanation = `
    <strong>Target Entity:</strong> AeroPropulsion Systems Inc. <br><br>
    <strong>Legacy Friction Breakdown:</strong><br>
    • <strong>Non-AI Search Failure:</strong> Searching 'Debt Liabilities' fails because Page 187 lists 'Subordinated Borrowing Notes'.<br>
    • <strong>Manual Processing:</strong> Analysts forced into manual PDF reading and copy-pasting numbers into Excel spreadsheets.<br>
    • <strong>Process Breakdown:</strong> Manual typing leads to missing debt figures and spreadsheet calculation crashes under deal volume.`;

  await page.setContent(renderTitleCard("SECTION 2 OF 4 | LEGACY WORKFLOW", "Non-AI Inefficient M&A Workflow Simulation", section2Explanation));
  await captureFrames(8, 600);

  // Navigate to local application workspace Section 2 Legacy Workflow view
  await page.goto('http://localhost:3000/demo?mode=section2');
  await captureFrames(3, 500);

  // Demonstrate Step 1: Human typing query and clicking Non-AI Search
  await simulateHumanTyping('#rag-query-input', 'Debt Liabilities');
  await simulateClickWithRipple('#btn-regular-search');
  await captureFrames(10, 600);

  // Demonstrate Step 2: Injected Manual Process Crash in centered viewport
  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background-color: #020617; color: #ef4444; font-family: monospace; padding: 40px; height: 100vh; box-sizing: border-box; font-size: 13px; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
        <div style="max-width: 850px; margin: 0 auto; border: 2px solid #dc2626; padding: 30px; border-radius: 16px; background-color: #450a0a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);">
          <div style="color: #22d3ee; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">SECTION 2 OF 4 | LEGACY WORKFLOW</div>
          <h1 style="font-size: 18px; text-transform: uppercase; margin-bottom: 16px; font-weight: bold; color: #ffffff;">🚨 MANUAL PROCESS FAILURE: SPREADSHEET_CALCULATION_CRASH</h1>
          <p style="color: #fca5a5; font-size: 13px; margin-bottom: 20px; font-family: sans-serif; line-height: 1.6;">
            Spreadsheet calculation broke down due to missing debt numbers and human copy-paste errors under deal volume. Target acquisition valuation failed due to undetected $42.5M subordinated debt liability.
          </p>
          <div style="color: #94a3b8; line-height: 1.6; font-size: 11px;">
            > Error: Disclosure filing 'AeroPropulsion_Notes.pdf' contains $42.5M in undetected debt liabilities.<br>
            > Non-AI keyword search failed on exact string match for 'Debt Liabilities'.
          </div>
          <div style="color: #ef4444; margin-top: 20px; font-weight: bold; font-size: 13px;">[ Annual Profit Leak Impact: $4,500,000 USD ]</div>
        </div>
      </div>`;
  });
  await captureFrames(10, 600);

  // =========================================================================
  // --- SECTION 3 OF 4: AI RAG & ONTOLOGY OPTIMIZATION RUN ---
  // =========================================================================
  const section3Explanation = `
    <strong>Target Entity:</strong> AeroPropulsion Systems Inc. <br><br>
    <strong>Optimization Breakdown:</strong><br>
    • <strong>AI RAG Search:</strong> AI RAG understands the meaning of words, so searching for 'Debt Liabilities' automatically matches 'Subordinated Borrowing Notes' ($42.5M debt).<br>
    • <strong>Ontology Engine:</strong> Connects AeroPropulsion to Lockheed's Missiles Division, triggering Division Policy #402 (3.0x Debt/EBITDA cap, $25.0M debt cap) to flag $42.5M debt (4.2x Debt/EBITDA, +$17.5M excess).`;

  await page.setContent(renderTitleCard("SECTION 3 OF 4 | OPTIMIZED WORKFLOW", "Custom AI RAG & Business Relationship Ontology Optimization", section3Explanation));
  await captureFrames(8, 600);

  // Reload clean application environment for Section 3 Optimized Workflow view
  await page.goto('http://localhost:3000/demo?mode=section3');
  await captureFrames(3, 500);

  // Type query and run AI RAG Search with click ripple
  await simulateHumanTyping('#rag-query-input', 'Debt Liabilities');
  await simulateClickWithRipple('#btn-rag-search');
  await captureFrames(12, 600);

  // Run AI Ontology Audit with click ripple
  await simulateClickWithRipple('#btn-ontology-audit');
  await captureFrames(12, 600);

  // =========================================================================
  // --- SECTION 4 OF 4: DEDICATED EXECUTIVE DEAL BRIEF & VALUATION ---
  // =========================================================================
  const section4Explanation = `
    <strong>Target Entity:</strong> AeroPropulsion Systems Inc. <br><br>
    <strong>Executive Risk Summary:</strong><br>
    • <strong>Risk Identified:</strong> Uncovered $42.5M debt (4.2x Debt/EBITDA vs. 3.0x Debt/EBITDA ($25.0M) safe cap; +$17.5M excess).<br>
    • <strong>Valuation Advice:</strong> Lower purchase price offer by $42.5M (or require seller debt payoff prior to close) to eliminate post-acquisition risk.`;

  await page.setContent(renderTitleCard("SECTION 4 OF 4 | EXECUTIVE DEAL BRIEF", "Executive M&A Deal Brief & Valuation Risk Matrix", section4Explanation));
  await captureFrames(8, 600);

  // Reload application workspace Section 4 view
  await page.goto('http://localhost:3000/demo?mode=section4');
  await captureFrames(12, 650);

  await browser.close();

  console.log('[Jules Media Engine] Compiling PNG frames into GIF using Pillow compiler...');

  [path.dirname(outputGifPublicPath), path.dirname(outputGifDocsPath)].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  });

  try {
    execSync(`python3 scripts/frame_to_gif.py "${frameStagingDir}" "${outputGifPublicPath}" 600`);
    fs.copyFileSync(outputGifPublicPath, outputGifDocsPath);
    console.log(`[Jules Media Engine] Walkthrough GIF loop successfully generated at:\n - ${outputGifPublicPath}\n - ${outputGifDocsPath}`);
  } catch (err) {
    console.error('[Jules Media Engine] Media pipeline compilation error:', err.message);
  }
}

runRecordingPipeline();
