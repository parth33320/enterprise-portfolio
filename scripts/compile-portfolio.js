#!/usr/bin/env node

/**
 * compile-portfolio.js
 * Core Dashboard Compiler & Resume Generation Engine
 * Processes json jobs in _job_queue, interpolates resume_template.md, and outputs to public/
 */

const fs = require('fs');
const path = require('path');

const JOB_QUEUE_DIR = path.join(__dirname, '..', '_job_queue');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const RESUME_TEMPLATE_PATH = path.join(__dirname, '..', 'resume_template.md');
const RESUME_OUTPUT_DIR = path.join(PUBLIC_DIR, 'resumes');

function loadTemplate(templatePath) {
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template file not found at ${templatePath}`);
  }
  return fs.readFileSync(templatePath, 'utf8');
}

function interpolateTemplate(template, data) {
  let result = template;
  const mappings = {
    '{{CANDIDATE_NAME}}': data.candidate_name || 'Candidate',
    '{{JOB_TITLE}}': data.job_title || 'Automation Specialist',
    '{{COMPANY_NAME}}': data.company_name || 'Target Company',
    '{{TARGET_METRICS}}': data.target_metrics || 'N/A',
    '{{DEEP_LINK_URL}}': data.deep_link_url || '#',
    '{{SUMMARY}}': data.summary || 'Professional Summary Placeholder',
    '{{KEY_SKILLS}}': data.key_skills || 'Automation, Node.js, CI/CD',
    '{{GENERATED_DATE}}': new Date().toISOString().split('T')[0]
  };

  for (const [key, val] of Object.entries(mappings)) {
    result = result.split(key).join(val);
  }

  return result;
}

function generateDashboardHtml(jobs) {
  const jobRows = jobs.map(job => `
    <tr>
      <td><code>${job.job_id}</code></td>
      <td>${job.company_name}</td>
      <td>${job.job_title}</td>
      <td>${job.target_metrics}</td>
      <td><a href="resumes/${job.job_id}.md" target="_blank">View MD Resume</a></td>
      <td><a href="${job.deep_link_url}" target="_blank">Demo Asset</a></td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Enterprise Automation Portfolio Engine</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 2rem; background: #f4f6f8; color: #1e293b; }
    header { background: #0f172a; color: #fff; padding: 1.5rem 2rem; border-radius: 8px; margin-bottom: 2rem; }
    h1 { margin: 0 0 0.5rem 0; font-size: 1.8rem; }
    p { margin: 0; color: #94a3b8; }
    .stats { display: flex; gap: 1rem; margin-bottom: 2rem; }
    .card { background: #fff; padding: 1.2rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); flex: 1; }
    .card h3 { margin: 0 0 0.5rem 0; font-size: 0.9rem; color: #64748b; text-transform: uppercase; }
    .card .val { font-size: 1.8rem; font-weight: bold; color: #0f172a; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    th, td { padding: 0.85rem 1rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-weight: 600; color: #475569; }
    tr:hover { background: #f1f5f9; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Enterprise Automation Portfolio Engine</h1>
    <p>Automated static compiler & resume generation pipeline</p>
  </header>

  <div class="stats">
    <div class="card">
      <h3>Total Ingested Jobs</h3>
      <div class="val">${jobs.length}</div>
    </div>
    <div class="card">
      <h3>Pipeline Status</h3>
      <div class="val" style="color: #16a34a;">ACTIVE</div>
    </div>
    <div class="card">
      <h3>Last Compiled</h3>
      <div class="val" style="font-size: 1rem; margin-top: 0.5rem;">${new Date().toUTCString()}</div>
    </div>
  </div>

  <h2>Processed Target Job Queue</h2>
  <table>
    <thead>
      <tr>
        <th>Job ID</th>
        <th>Target Company</th>
        <th>Role Title</th>
        <th>Target Metrics</th>
        <th>Compiled Resume</th>
        <th>Deep Link</th>
      </tr>
    </thead>
    <tbody>
      ${jobRows || '<tr><td colspan="6">No jobs found in queue.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

function main() {
  console.log('[Compiler Engine] Initializing portfolio compilation...');

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }
  if (!fs.existsSync(RESUME_OUTPUT_DIR)) {
    fs.mkdirSync(RESUME_OUTPUT_DIR, { recursive: true });
  }

  const template = loadTemplate(RESUME_TEMPLATE_PATH);

  let jobFiles = [];
  if (fs.existsSync(JOB_QUEUE_DIR)) {
    jobFiles = fs.readdirSync(JOB_QUEUE_DIR).filter(file => file.endsWith('.json'));
  }

  console.log(`[Compiler Engine] Processing ${jobFiles.length} jobs from ${JOB_QUEUE_DIR}...`);

  const processedJobs = [];

  for (const file of jobFiles) {
    try {
      const filePath = path.join(JOB_QUEUE_DIR, file);
      const rawData = fs.readFileSync(filePath, 'utf8');
      const job = JSON.parse(rawData);

      const compiledMarkdown = interpolateTemplate(template, job);
      const outputResumePath = path.join(RESUME_OUTPUT_DIR, `${job.job_id}.md`);

      fs.writeFileSync(outputResumePath, compiledMarkdown, 'utf8');
      processedJobs.push(job);
    } catch (err) {
      console.error(`[Compiler Engine] Error processing ${file}:`, err.message);
    }
  }

  // Compile Dashboard HTML
  const dashboardHtml = generateDashboardHtml(processedJobs);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'index.html'), dashboardHtml, 'utf8');

  console.log(`[Compiler Engine] Compilation complete! Dashboard output to ${path.join(PUBLIC_DIR, 'index.html')}`);
}

if (require.main === module) {
  main();
}

module.exports = { interpolateTemplate, generateDashboardHtml };
