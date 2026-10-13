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
  
  // Track and process the incoming active payload parameters
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
    <html lang="en">
    <body style="background-color: #020617; color: #f8fafc; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 40px; box-sizing: border-box; -webkit-font-smoothing: antialiased;">
      <div style="width: 100%; max-width: 800px; border: 1px solid #1e293b; padding: 40px; border-radius: 16px; background-color: #0f172a; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
        <span style="font-family: monospace; color: #22d3ee; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em;">${sectionNum}</span>
        <h1 style="font-size: 24px; font-weight: bold; color: #ffffff; margin-top: 6px; margin-bottom: 14px; tracking: -0.02em;">${title}</h1>
        <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin: 0;">${body}</p>
      </div>
    </body>
    </html>`;

  // =========================================================================
  // --- SECTION 1: SYSTEM TARGET METRICS BRIEF ---
  // =========================================================================
  const roi = (((jobData.afterProfits - jobData.beforeProfits) / jobData.investmentCost) * 100).toFixed(2);
  const section1Summary = `
    <strong>Target Corporate Entity:</strong> ${jobData.companyName} <br>
    <strong>Operational Sector Domain:</strong> ${jobData.sector} <br><br>
    <strong>Project Governance & Value Engineering Parameters:</strong><br>
    • Old Process Cost / Profit Leak: $${jobData.beforeProfits.toLocaleString()} USD <br>
    • Recovered Profit / Annual Savings: $${jobData.afterProfits.toLocaleString()} USD <br>
    • Solution Implementation Cost: $${jobData.investmentCost.toLocaleString()} USD <br>
    • Calculated Return on Investment (ROI): <strong>${roi}%</strong> <br>
    • Cost Performance (CPI): ${jobData.cpi} | Schedule Velocity (SPI): ${jobData.spi} <br>
    • Agile Release Delivery Accuracy (SAFe): ${jobData.piPredictability}%`;
  
  await page.setContent(renderTitleCard("Section 1: Audit Brief", "Enterprise Production Optimization Framework", section1Summary));
  await page.waitForTimeout(6500);

  // =========================================================================
  // --- SECTION 2: LEGACY WORKFLOW BASELINE SIMULATION ---
  // =========================================================================
  await page.setContent(renderTitleCard("Section 2: Legacy Baseline", "Visual Simulation of Identified Process Waste (Muda)", jobData.painPoint));
  await page.waitForTimeout(5000);

  // Navigates to local server workspace context
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
    hud.innerHTML = `<strong>⚠️ LEGACY FRICTION ENVIRONMENT INJECTED</strong><br>
                    • Status: UNOPTIMIZED_PROCESS_OVERHEAD<br>
                    • Latency: Compounding Loop Processing Latency`;
    document.body.appendChild(hud);
  });
  await page.waitForTimeout(2000);

  // Simulate slow interaction tracking scroll speeds
  await page.evaluate(() => window.scrollBy({ top: 300, behavior: 'smooth' }));
  await page.waitForTimeout(3000);

  // Trigger an clean runtime exception trace layout
  await page.evaluate(() => {
    document.body.innerHTML = `
      <div style="background-color: #000000; color: #dc2626; font-family: monospace; padding: 40px; height: 100vh; box-sizing: border-box; font-size: 13px;">
        <h1 style="font-size: 18px; text-transform: uppercase; margin-bottom: 20px;">🚨 CRITICAL RUNTIME EXCEPTION: TRANSACTION_FAILED</h1>
        <p>Internal Server Error 500 -- Core Validation Exception Trace</p>
        <p style="color: #94a3b8; margin-top: 10px;">
          > Error: Process constraint loop breach detected.<br>
          > Relational isolation boundary dropped. Context aborted.
        </p>
        <p style="color: #64748b; margin-top: 30px;">[System state execution halted. Processing waste compounding.]</p>
      </div>`;
  });
  await page.waitForTimeout(4500);

  // =========================================================================
  // --- SECTION 3: SOVEREIGN OPTIMIZED APPLICATION RUN ---
  // =========================================================================
  await page.setContent(renderTitleCard("Section 3: Optimized State", "Deploying Custom Automation Engine Countermeasure", jobData.solution));
  await page.waitForTimeout(5000);

  // Reload the clean application environment layer
  await page.goto('http://localhost:3000/inventory');
  await page.waitForTimeout(1500);

  // Precise human-speed action steps
  await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
  await page.waitForTimeout(1500);

  const inspectButton = page.locator('button[title="Inspect Details (Slide-out Pane)"]').first();
  if (await inspectButton.isVisible()) {
    await inspectButton.hover();
    await page.waitForTimeout(600);
    await inspectButton.click();
    await page.waitForTimeout(2200);

    await page.evaluate(() => {
      const pane = document.querySelector('.overflow-y-auto');
      if (pane) pane.scrollBy({ top: 250, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
  }

  const videoPath = await page.video().path();
  await context.close();
  await browser.close();

  console.log('[Jules Media Engine] Processing final video artifacts conversion steps...');
  const assetsDir = path.dirname(outputGifPath);
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  try {
    execSync(`ffmpeg -y -i "${videoPath}" -vf "fps=10,scale=800:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 "${outputGifPath}"`);
    console.log(`[Jules Media Engine] Walkthrough GIF loop successfully generated at: ${outputGifPath}`);
  } catch (err) {
    console.error('[Jules Media Engine] Media pipeline compilation error:', err.message);
  }
}

runRecordingPipeline();
