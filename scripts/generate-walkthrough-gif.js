const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function runRecordingPipeline() {
  console.log('[Jules Media Engine] Launching headless browser for Dual-State recording loop...');
  
  const queueDir = path.join(__dirname, '../_job_queue');
  const jobFiles = fs.readdirSync(queueDir).filter(f => f.endsWith('.json') && f !== 'history_registry.json');
  
  if (jobFiles.length === 0) {
    console.log('[Jules Media Engine] Staging queue empty. Exiting media compiler.');
    return;
  }
  
  const jobData = JSON.parse(fs.readFileSync(path.join(queueDir, jobFiles[0]), 'utf8'));
  const targetGifName = `${jobData.reqId.toLowerCase()}.gif`;
  const outputGifPath = path.join(__dirname, `../public/docs/assets/${targetGifName}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: path.join(__dirname, '../_video_staging'), size: { width: 1280, height: 720 } }
  });
  
  const page = await context.newPage();
  
  const renderTitleCard = (sectionNum, title, body) => `
    <html lang="en"><body style="background-color: #020617; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 40px; box-sizing: border-box;">
      <div style="max-width: 800px; border: 1px solid #1e293b; padding: 40px; border-radius: 16px; background-color: #0f172a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
        <span style="font-family: monospace; color: #22d3ee; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">${sectionNum}</span>
        <h1 style="font-size: 26px; font-weight: bold; color: #ffffff; margin-top: 6px; margin-bottom: 14px;">${title}</h1>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0;">${body}</p>
      </div>
    </body></html>`;

  // =========================================================================
  // --- SECTION 1: STRATEGIC BUSINESS BRIEF & METRICS ---
  // =========================================================================
  const roi = (((jobData.afterProfits - jobData.beforeProfits) / jobData.investmentCost) * 100).toFixed(2);
  const section1Summary = `
    <strong>Target Corporate Account:</strong> ${jobData.companyName} <br>
    <strong>Core Operational Sector:</strong> ${jobData.sector} <br><br>
    <strong>EVM Financial Target Architecture Modeling:</strong><br>
    • Baseline System Annual Profits: $${jobData.beforeProfits.toLocaleString()} USD <br>
    • Projected Optimized Annual Profits: $${jobData.afterProfits.toLocaleString()} USD <br>
    • Capital Solution Onboarding Cost: $${jobData.investmentCost.toLocaleString()} USD <br>
    • Calculated Return on Investment (ROI): <strong>${roi}%</strong> over Year 1 <br>
    • CPI Index Balance: ${jobData.cpi} | SPI Index Balance: ${jobData.spi} <br>
    • SAFe Program Increment (PI) Predictability Target: ${jobData.piPredictability}%`;
  
  await page.setContent(renderTitleCard("Section 1: Audit Brief", "Enterprise Production Optimization Architecture", section1Summary));
  await page.waitForTimeout(6500);

  // =========================================================================
  // --- SECTION 2: LEGACY WORKFLOW SIMULATION WALKTHROUGH ---
  // =========================================================================
  await page.setContent(renderTitleCard("Section 2: Legacy Baseline", "Visual Simulation of Identified Process Waste (Muda)", jobData.painPoint));
  await page.waitForTimeout(5000);

  // Boot app interface and inject simulated broken constraints via DOM injection
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    // Inject a prominent alert HUD representing the unoptimized system friction
    const hud = document.createElement('div');
    hud.style.position = 'fixed';
    hud.style.top = '70px';
    hud.style.right = '20px';
    hud.style.backgroundColor = '#450a0a';
    hud.style.border = '2px solid #b91c1c';
    hud.style.color = '#fca5a5';
    hud.style.fontFamily = 'monospace';
    hud.style.padding = '12px';
    hud.style.borderRadius = '8px';
    hud.style.zIndex = '99999';
    hud.style.fontSize = '11px';
    hud.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.3)';
    hud.innerHTML = `<strong>⚠️ LEGACY FRICTION ENVIRONMENT INJECTED</strong><br>
                    • Muda Type: Processing & Waiting Waste<br>
                    • Data Scoping: UNISOLATED_DATA_DRIFT<br>
                    • Latency: Compounding +3000ms Loop Delay`;
    document.body.appendChild(hud);

    // Corrupt table elements visually to simulate severe multi-tenant data leaks to a recruiter
    const badges = document.querySelectorAll('span');
    badges.forEach(b => {
      if(b.textContent.includes('Scoped:')) {
        b.textContent = '❌ SCOPING FAILURE: CROSS_TENANT_LEAK';
        b.style.backgroundColor = '#7f1d1d';
        b.style.color = '#fca5a5';
      }
    });
  });
  await page.waitForTimeout(2000);

  // Simulate slow, painful system interactions under high processing overhead
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(3000); // Visual hold on the lag

  // Trigger a fake unhandled system validation crash overlay
  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background-color: #000000; color: #dc2626; font-family: monospace; padding: 40px; height: 100vh; box-sizing: border-box; font-size: 13px;">
        <h1 style="font-size: 20px; text-transform: uppercase; margin-bottom: 20px;">🚨 CRITICAL RUNTIME EXCEPTION: TRANSACTION_FAILED</h1>
        <p>Internal Server Error 500 -- server/routes/inventory.js Line 84</p>
        <p style="color: #94a3b8; margin-top: 10px;">
          > Error: validateInventoryPayload constraint breached.<br>
          > Parameter 'quantity' received negative value (-500) during raw mutation loop.<br>
          > Relational isolation checks dropped out. Process execution aborted.
        </p>
        <p style="color: #64748b; margin-top: 30px;">[System state halted. Core business profit leaking out.]</p>
      </div>`;
  });
  await page.waitForTimeout(4500);

  // =========================================================================
  // --- SECTION 3: OPTIMIZED SOVEREIGN WORKFLOW APPLICATION RUN ---
  // =========================================================================
  await page.setContent(renderTitleCard("Section 3: Optimized State", "Deploying SupplyAgent Core Automation Engine", jobData.solution));
  await page.waitForTimeout(5000);

  // Reload the clean, production-grade functional server application surface
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(1500);

  // Execute precise, human-speed interaction traces (1500ms slowMo pacing)
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const inspectButton = page.locator('button[title="Inspect Details (Slide-out Pane)"]').first();
  if (await inspectButton.isVisible()) {
    await inspectButton.hover();
    await page.waitForTimeout(600);
    await inspectButton.click(); // Trigger slide-out pane transition
    await page.waitForTimeout(2200);

    // Smoothly evaluate nested components inside the slide-out pane
    await page.evaluate(() => {
      const pane = document.querySelector('.overflow-y-auto');
      if (pane) pane.scrollBy({ top: 250, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
  }

  // Finalize video recording configuration hooks
  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  // Convert raw WebM into an enterprise-grade, highly-compressed loop GIF
  console.log('[Jules Media Engine] Processing final video compilation via ffmpeg conversion metrics...');
  const assetsDir = path.dirname(outputGifPath);
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  try {
    execSync(`ffmpeg -y -i "${videoPath}" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${outputGifPath}"`);
    console.log(`[Jules Media Engine] Asset compiled successfully: ${outputGifPath}`);
  } catch (err) {
    console.error('[Jules Media Engine] Compilation exception occurred:', err.message);
  }
}
runRecordingPipeline();
