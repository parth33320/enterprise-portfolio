#!/usr/bin/env node

/**
 * generate-synthetic-data.js
 * 100k Row Big Data Simulation Engine
 * Generates synthetic job records and stages them as JSON jobs in _job_queue directory.
 */

const fs = require('fs');
const path = require('path');

const JOB_QUEUE_DIR = path.join(__dirname, '..', '_job_queue');

const COMPANIES = [
  'Acme Corp', 'GlobalTech Industries', 'Apex Automation',
  'Nexus Systems', 'Enterprise Cybernetics', 'CloudScale Solutions',
  'DataMesh Labs', 'OmniHealth AI', 'FinTech Dynamics', 'Vanguard Systems'
];

const ROLES = [
  'Principal Automation Architect', 'Senior DevOps Engineer',
  'Lead Enterprise Systems Engineer', 'Full Stack Automation Developer',
  'Site Reliability Engineer', 'AI Integration Specialist'
];

const METRICS_LIST = [
  'Reduced CI/CD execution time by 45% across 200+ microservices.',
  'Automated end-to-end data ingestion pipelines handling 10M+ daily events.',
  'Achieved 99.99% system availability while cutting cloud compute costs by $120k/yr.',
  'Accelerated portfolio deployment speed by 10x using containerized runners.',
  'Optimized database queries resulting in a 3.5x throughput improvement.'
];

const DEMO_URLS = [
  '../docs/assets/final_app_demo.gif',
  'https://github.com/parth33320/enterprise-portfolio',
  'https://parth33320.github.io/enterprise-portfolio/demo'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function parseArgs() {
  const args = process.argv.slice(2);
  let count = 10; // Default count for quick staging run

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      count = parseInt(args[i + 1], 10) || count;
      i++;
    }
  }

  return { count };
}

function generateJob(id) {
  const company = getRandomElement(COMPANIES);
  const role = getRandomElement(ROLES);
  const metrics = getRandomElement(METRICS_LIST);
  const deepLink = getRandomElement(DEMO_URLS);

  return {
    job_id: `job_${String(id).padStart(6, '0')}`,
    candidate_name: 'Jules Engineer',
    job_title: role,
    company_name: company,
    target_metrics: metrics,
    deep_link_url: deepLink,
    summary: `Results-driven automation specialist targeting ${company}. Proven track record in orchestrating scalable workflows and high-throughput data engines.`,
    key_skills: 'Node.js, Python, GitHub Actions CI/CD, Docker, Kubernetes, Terraform, Big Data Processing',
    timestamp: new Date().toISOString()
  };
}

function main() {
  const { count } = parseArgs();

  console.log(`[Simulation Engine] Starting synthetic data generation... Target count: ${count}`);

  if (!fs.existsSync(JOB_QUEUE_DIR)) {
    fs.mkdirSync(JOB_QUEUE_DIR, { recursive: true });
  }

  // Generate batch jobs into _job_queue
  for (let i = 1; i <= count; i++) {
    const job = generateJob(i);
    const filePath = path.join(JOB_QUEUE_DIR, `${job.job_id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(job, null, 2), 'utf8');
  }

  console.log(`[Simulation Engine] Successfully generated ${count} synthetic job files in ${JOB_QUEUE_DIR}`);
}

if (require.main === module) {
  main();
}

module.exports = { generateJob };
