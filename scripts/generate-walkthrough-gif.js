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

  const beforeCost = jobData.beforeCost || 2100000;
  const afterCosts = jobData.afterCosts || 420000;
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
  // --- SECTION 1 OF 5: EXECUTIVE BRIEF & TARGET METRICS ---
  // =========================================================================
  const section1Summary = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 14px; margin-bottom: 20px;">
      <div>
        <div style="font-size: 12px; font-weight: bold; color: #38bdf8; font-family: monospace; text-transform: uppercase;">WonderBotz Client Automation Portfolio Optimization</div>
        <div style="font-size: 16px; font-weight: 800; color: #ffffff;">UiPath REFramework, Document Understanding, and Action Center Platform</div>
      </div>
      <div style="background-color: #052e16; border: 1px solid #166534; color: #4ade80; font-family: monospace; font-size: 12px; font-weight: bold; padding: 6px 14px; border-radius: 9999px;">
        +${roi}% ROI
      </div>
    </div>
    <div style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
      Automating unattended bot exception recovery, vendor PDF invoice parsing, and manager 1-click approvals across client automation portfolios.
    </div>`;
  
  // Section 1 Title Card (Clean title card - NO KPI CHIPS rendered here)
  await page.setContent(renderTitleCard("SECTION 1 OF 5 | EXECUTIVE BRIEF", "WonderBotz Technical Account Manager (UiPath) Executive Brief", section1Summary));
  await captureFrames(8, 600);

  // Reload application workspace Section 1 view (KPI Chips Grid renders exclusively inside this view)
  await page.goto('http://localhost:3000/demo?mode=section1');
  await captureFrames(10, 650);

  // =========================================================================
  // --- SECTION 2 OF 5: TECHNICAL DEEP DIVE & ARCHITECTURE DIAGRAM ---
  // =========================================================================
  const section2Explanation = `
    <strong>Comparative System Architecture & Information Flow:</strong><br><br>
    • <strong>Legacy Architecture:</strong> Unattended bot crashes force manual text log searching; unparsed vendor PDF invoices require manual typing, causing 48+ hour SLA delays.<br>
    • <strong>Optimized Architecture:</strong> UiPath REFramework handles bot health & error recovery in <strong><20ms</strong>, Document AI parses PDF invoices, and Action Center dispatches 1-click approvals.`;

  await page.setContent(renderTitleCard("SECTION 2 OF 5 | SYSTEM ARCHITECTURE & DEEP DIVE", "Comparative System Architecture & Information Flow", section2Explanation));
  await captureFrames(8, 600);

  // Reload application workspace Section 2 view
  await page.goto('http://localhost:3000/demo?mode=section2');
  await captureFrames(10, 650);

  // =========================================================================
  // --- SECTION 3 OF 5: CONSOLIDATED OPTIMIZED WORKFLOW SIMULATION ---
  // =========================================================================
  const section3Explanation = `
    <strong>Consolidated UiPath Platform & Architectural Justification (Process of Elimination):</strong><br><br>
    • <strong>UiPath REFramework + Document AI + Action Center Selected:</strong> Combines automated bot health checks, machine learning PDF invoice parsing, and 1-click human approvals.<br>
    • <strong>Elimination Reason vs Custom Scripts:</strong> Custom Python scripts lack centralized Orchestrator cloud dashboards, automated retries, enterprise audit logs, and SLA tracking.<br>
    • <strong>Elimination Reason vs Pure LLMs:</strong> Standard LLMs can make mathematical errors on financial numbers. REFramework guarantees 100% deterministic execution.`;

  // Section 3 Title Card (Contains Process of Elimination Architectural Justification)
  await page.setContent(renderTitleCard("SECTION 3 OF 5 | OPTIMIZED WORKFLOW", "Consolidated UiPath Platform & Architectural Justification", section3Explanation));
  await captureFrames(8, 600);

  // Navigate to application workspace Section 3 Consolidated View
  await page.goto('http://localhost:3000/demo?mode=section3');
  await captureFrames(3, 500);

  // Run Consolidated UiPath Workflow Execution
  await simulateClickWithRipple('#btn-run-uipath-workflow');
  await captureFrames(14, 650);

  // =========================================================================
  // --- SECTION 4 OF 5: STANDALONE APPENDIX & KEY TERMS GUIDE ---
  // =========================================================================
  const section4Explanation = `
    <strong>Web Services Glossary & Solution Choice Rationale:</strong><br><br>
    • Dedicated standalone reference screen defining technical terms (REFramework, Document Understanding, Action Center, Orchestrator).<br>
    • Provides clear civilian accessibility for non-technical stakeholders and hiring managers.`;

  await page.setContent(renderTitleCard("SECTION 4 OF 5 | APPENDIX & KEY TERMS GUIDE", "UiPath Automation Terminology & Solution Choice Rationale Appendix", section4Explanation));
  await captureFrames(8, 600);

  // Reload application workspace Section 4 Appendix view
  await page.goto('http://localhost:3000/demo?mode=appendix');
  await captureFrames(12, 650);

  // =========================================================================
  // --- SECTION 5 OF 5: DETAILED INNER SOFTWARE WORKINGS (PART 1 & PART 2) ---
  // =========================================================================
  await page.goto('http://localhost:3000/demo?mode=techdetails1');
  await captureFrames(10, 650);

  await page.goto('http://localhost:3000/demo?mode=techdetails2');
  await captureFrames(10, 650);

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
