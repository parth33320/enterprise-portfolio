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

  const beforeCost = jobData.beforeCost || 1450000;
  const afterCosts = jobData.afterCosts || 320000;
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
        <div style="font-size: 12px; font-weight: bold; color: #38bdf8; font-family: monospace; text-transform: uppercase;">Villanova UTS Web Services Optimization</div>
        <div style="font-size: 16px; font-weight: 800; color: #ffffff;">AEM Digital Ecosystem & Portal Sync Automation</div>
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
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(Savings / Investment)</span>
      </div>
      <div style="background-color: #020617; border: 1px solid #1e293b; padding: 14px; border-radius: 12px;">
        <span style="font-size: 9px; color: #94a3b8; display: block; margin-bottom: 4px; font-weight: bold; uppercase;">EVM DELIVERABILITY</span>
        <span style="font-size: 13px; font-weight: 800; color: #38bdf8;">CPI ${jobData.cpi} | SPI ${jobData.spi}</span>
        <span style="font-size: 9px; color: #64748b; display: block; margin-top: 2px;">(${jobData.piPredictability}% Delivery Reliability)</span>
      </div>
    </div>`;
  
  await page.setContent(renderTitleCard("SECTION 1 OF 5 | EXECUTIVE BRIEF", "Executive Web Services Brief & System Target Metrics", section1Summary));
  await captureFrames(8, 600);

  // Reload application workspace Section 1 view
  await page.goto('http://localhost:3000/demo?mode=section1');
  await captureFrames(10, 650);

  // =========================================================================
  // --- SECTION 2 OF 5: TECHNICAL DEEP DIVE & ARCHITECTURE DIAGRAM ---
  // =========================================================================
  const section2Explanation = `
    <strong>Comparative System Architecture & Information Flow:</strong><br><br>
    • <strong>Legacy Architecture:</strong> Manual document copy-pasting into AEM without automated WCAG checks, causing 72h backlogs, accessibility audit faults, and mobile portal API timeouts.<br>
    • <strong>Optimized Architecture:</strong> AI Agentic AST Code Auditor validates code in <strong><20ms</strong>, paired with an Event Webhook Multi-Cast Gateway to update Modo Labs (mobile) and OneCampus (portal) instantly.`;

  await page.setContent(renderTitleCard("SECTION 2 OF 5 | SYSTEM ARCHITECTURE & DEEP DIVE", "Comparative System Architecture & Information Flow", section2Explanation));
  await captureFrames(8, 600);

  // Reload application workspace Section 2 view
  await page.goto('http://localhost:3000/demo?mode=section2');
  await captureFrames(10, 650);

  // =========================================================================
  // --- SECTION 3 OF 5: LEGACY WORKFLOW BASELINE SIMULATION ---
  // =========================================================================
  const section3Explanation = `
    <strong>Legacy Baseline Workflow Friction:</strong><br><br>
    • <strong>Manual Web Upload:</strong> Analyst copy-pastes HTML into AEM Console for villanova.edu without automated checks.<br>
    • <strong>Process Breakdown:</strong> Low text contrast (2.1:1) and missing ARIA landmarks cause WCAG audit faults; mobile/portal API payloads time out, creating a 72+ hour publishing backlog.`;

  await page.setContent(renderTitleCard("SECTION 3 OF 5 | LEGACY WORKFLOW", "Manual Upload & Accessibility Audit Failure", section3Explanation));
  await captureFrames(8, 600);

  // Navigate to local application workspace Section 3 Legacy Workflow view
  await page.goto('http://localhost:3000/demo?mode=section3');
  await captureFrames(3, 500);

  // Demonstrate Step 1: Click Manual Upload button
  await simulateClickWithRipple('#btn-manual-upload');
  await captureFrames(10, 600);

  // Demonstrate Step 2: Injected Manual Process Failure Crash
  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background-color: #020617; color: #ef4444; font-family: monospace; padding: 40px; height: 100vh; box-sizing: border-box; font-size: 13px; display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
        <div style="max-width: 850px; margin: 0 auto; border: 2px solid #dc2626; padding: 30px; border-radius: 16px; background-color: #450a0a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);">
          <div style="color: #22d3ee; font-size: 12px; font-weight: bold; text-transform: uppercase; margin-bottom: 8px;">SECTION 3 OF 5 | LEGACY WORKFLOW</div>
          <h1 style="font-size: 18px; text-transform: uppercase; margin-bottom: 16px; font-weight: bold; color: #ffffff;">🚨 MANUAL PROCESS FAILURE: AEM_PUBLISHING_ACCESSIBILITY_CRASH</h1>
          <p style="color: #fca5a5; font-size: 13px; margin-bottom: 20px; font-family: sans-serif; line-height: 1.6;">
            Manual web page upload missed low contrast text rules (2.1:1 vs required 4.5:1) and omitted ARIA landmark tags. Modo Labs mobile app and OneCampus portal API payload sync timed out.
          </p>
          <div style="color: #94a3b8; line-height: 1.6; font-size: 11px;">
            > Error: Page villanova.edu/arts-sciences publishing failed.<br>
            > 72+ hour publishing backlog created with federal digital compliance audit risk.
          </div>
          <div style="color: #ef4444; margin-top: 20px; font-weight: bold; font-size: 13px;">[ Annual Operating Waste Impact: $1,130,000 USD ]</div>
        </div>
      </div>`;
  });
  await captureFrames(10, 600);

  // =========================================================================
  // --- SECTION 4 OF 5: AI AST CODE AUDITOR & EVENT WEBHOOK ENGINE ---
  // =========================================================================
  const section4Explanation = `
    <strong>System Optimization Breakdown:</strong><br><br>
    • <strong>AI Agentic AST Code Auditor:</strong> Inspects and auto-fixes AEM Edge Delivery Services (EDS) code for 100% WCAG 2.1 AA compliance in <strong><20ms</strong>.<br>
    • <strong>Event-Driven Webhook Gateway:</strong> Automatically broadcasts JSON payloads to Modo Labs Mobile App and OneCampus Web Portal in <strong><1.5 hours</strong>.`;

  await page.setContent(renderTitleCard("SECTION 4 OF 5 | OPTIMIZED WORKFLOW", "AI Agentic AST Code Auditor + Event-Driven Webhook Engine", section4Explanation));
  await captureFrames(8, 600);

  // Reload clean application environment for Section 4 Optimized Workflow view
  await page.goto('http://localhost:3000/demo?mode=section4');
  await captureFrames(3, 500);

  // Run AI Agentic AST Audit with click ripple
  await simulateClickWithRipple('#btn-ai-ast-audit');
  await captureFrames(12, 600);

  // Run Webhook Multi-Cast Execution with click ripple
  await simulateClickWithRipple('#btn-webhook-execution');
  await captureFrames(12, 600);

  // =========================================================================
  // --- SECTION 5 OF 5: STANDALONE APPENDIX & KEY TERMS GUIDE ---
  // =========================================================================
  const section5Explanation = `
    <strong>Web Services Glossary & Solution Choice Rationale:</strong><br><br>
    • Dedicated standalone reference screen defining technical terms (WCAG, ARIA Landmarks, AEM EDS, Modo Labs, OneCampus, Payload Sync).<br>
    • Provides clear civilian accessibility for non-technical stakeholders and hiring managers.`;

  await page.setContent(renderTitleCard("SECTION 5 OF 5 | APPENDIX & KEY TERMS GUIDE", "Web Services Terminology & Solution Choice Rationale Appendix", section5Explanation));
  await captureFrames(8, 600);

  // Reload application workspace Section 5 Appendix view
  await page.goto('http://localhost:3000/demo?mode=appendix');
  await captureFrames(12, 650);

  // =========================================================================
  // --- SECTION 6 OF 6: DETAILED INNER SOFTWARE WORKINGS (PART 1 & PART 2) ---
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
