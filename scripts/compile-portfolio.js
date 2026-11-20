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
const jobFiles = fs
  .readdirSync(queueDir)
  .filter((f) => f.endsWith('.json') && f !== 'history_registry.json' && f !== 'schema.json');

jobFiles.forEach((file) => {
  const filePath = path.join(queueDir, file);
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (!fileData.mediaAsset && !fileData.gifAsset && fileData.reqId) {
      fileData.gifAsset = `docs/assets/${fileData.reqId.toLowerCase()}.gif`;
    }
    if (!historicalCases.some((item) => item.reqId === fileData.reqId)) {
      historicalCases.unshift(fileData);
    }
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(`[Error] Ingestion failure on ${file}:`, err.message);
  }
});

fs.writeFileSync(historyFilePath, JSON.stringify(historicalCases, null, 2));

// Generate customized resumes
if (fs.existsSync(templatePath)) {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  historicalCases.forEach((job) => {
    const safeCompName = job.companyName.replace(/[^a-zA-Z0-9]/g, '_');
    const resumeFileName = `Resume_${safeCompName}_${job.reqId || 'standalone'}.md`;
    const tailoredResume = templateContent.replace(/{{JOB_REQ_ID}}/g, job.reqId || '');
    fs.writeFileSync(path.join(resumeOutputDir, resumeFileName), tailoredResume);
  });
}

// SVG Icons
const githubIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>';
const emailIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
const expandIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>';
const closeIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
const uploadIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>';
const pinnedIcon = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 3a1 1 0 0 1 .117 1.993L16 5v4.764l1.894 3.789a1 1 0 0 1 .1.331L18 14v2a1 1 0 0 1-.883.993L17 17h-4v4a1 1 0 0 1-1.993.117L11 21v-4H7a1 1 0 0 1-.993-.883L6 16v-2a1 1 0 0 1 .06-.34l.046-.107L8 9.763V5a1 1 0 0 1-.117-1.993L8 3h8z"/></svg>';

// Client-side JS written as normal JS inside a function and serialized cleanly via .toString()
function clientAppBootstrap(initialData, expandSvg, pinSvg) {
  let PORTFOLIO_DATA = initialData;
  const EXPAND_ICON = expandSvg;
  const PINNED_ICON = pinSvg;

  function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToUtf8(b64) {
    let clean = (b64 || '').replace(/\s/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (clean.length % 4 !== 0) clean += '=';
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  async function fileToBase64(file) {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  function extractYouTubeId(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url.trim());
      const host = parsed.hostname.replace(/^www\./, '');
      let id = null;
      if (host === 'youtu.be') {
        id = parsed.pathname.split('/').filter(Boolean)[0] || null;
      } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
        if (parsed.pathname === '/watch') {
          id = parsed.searchParams.get('v');
        } else if (parsed.pathname.startsWith('/embed/') || parsed.pathname.startsWith('/shorts/')) {
          id = parsed.pathname.split('/')[2] || null;
        }
      }
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    } catch (e) {
      return null;
    }
  }

  function isYouTubeUrl(url) {
    return extractYouTubeId(url) !== null;
  }

  function escapeAttr(str) {
    return String(str || '')
      .replace(/&/g, '&' + 'amp;')
      .replace(/"/g, '&' + 'quot;')
      .replace(/</g, '&' + 'lt;')
      .replace(/>/g, '&' + 'gt;');
  }

  function updateAdminButtonsVisibility() {
    const isAdmin = !!localStorage.getItem('gh_portfolio_pat');
    document.querySelectorAll('.admin-pin-btn, .admin-delete-btn').forEach((btn) => {
      if (isAdmin) btn.classList.remove('hidden');
      else btn.classList.add('hidden');
    });
  }

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-slate-900/95 border border-slate-700 text-slate-100 text-xs font-mono px-4 py-3 rounded-xl shadow-2xl z-50';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'transition-opacity', 'duration-300');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  const theaterModal = document.getElementById('theater-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalMedia = document.getElementById('modal-media');
  const modalClose = document.getElementById('modal-close');
  let pausedInlineVideo = null;

  function openTheaterModal(title, mediaElement, isVideo, isYouTube, ytId) {
    modalTitle.textContent = title;
    modalMedia.innerHTML = '';

    if (isVideo && mediaElement && mediaElement.tagName === 'VIDEO' && !mediaElement.paused) {
      pausedInlineVideo = mediaElement;
      mediaElement.pause();
    }

    if (isYouTube) {
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`;
      iframe.className = 'w-[90vw] max-w-5xl aspect-video rounded-xl border border-slate-700';
      iframe.allow = 'autoplay; fullscreen; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = title;
      modalMedia.appendChild(iframe);
    } else if (isVideo && mediaElement) {
      const video = document.createElement('video');
      video.src = mediaElement.src;
      if (mediaElement.poster) video.poster = mediaElement.poster;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.className = 'max-h-[85vh] max-w-[92vw] rounded-xl border border-slate-700 bg-black';
      modalMedia.appendChild(video);
    } else if (mediaElement) {
      const img = document.createElement('img');
      img.src = mediaElement.src;
      img.alt = title + ' Walkthrough';
      img.className = 'max-h-[85vh] max-w-[92vw] object-contain rounded-xl border border-slate-700';
      modalMedia.appendChild(img);
    }

    theaterModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeTheaterModal() {
    const modalVideo = modalMedia.querySelector('video');
    if (modalVideo) {
      modalVideo.pause();
      modalVideo.src = '';
    }
    modalMedia.innerHTML = '';
    theaterModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (pausedInlineVideo) {
      pausedInlineVideo.play().catch(() => {});
      pausedInlineVideo = null;
    }
  }
  modalClose.addEventListener('click', closeTheaterModal);
  theaterModal.addEventListener('click', (e) => {
    if (e.target === theaterModal) closeTheaterModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !theaterModal.classList.contains('hidden')) {
      closeTheaterModal();
    }
  });
  const adminModal = document.getElementById('admin-upload-modal');
  const adminModalClose = document.getElementById('admin-modal-close');
  const ghTokenInput = document.getElementById('gh-token-input');
  const clearTokenBtn = document.getElementById('clear-token-btn');
  const mediaFileInput = document.getElementById('media-file-input');
  const youtubeUrlInput = document.getElementById('youtube-url-input');
  const thumbnailPreview = document.getElementById('thumbnail-preview');
  const thumbnailImg = document.getElementById('thumbnail-img');
  const projectTitleInput = document.getElementById('project-title-input');
  const projectSubtitleInput = document.getElementById('project-subtitle-input');
  const projectReqIdInput = document.getElementById('project-reqid-input');
  const publishBtn = document.getElementById('publish-btn');
  const statusStep = document.getElementById('status-step');
  const statusLog = document.getElementById('status-log');
  let headerClickCount = 0;
  let headerClickTimer = null;
  const savedToken = localStorage.getItem('gh_portfolio_pat');
  if (savedToken) {
    ghTokenInput.value = savedToken;
    validateToken(savedToken);
  }
  function addStatusLog(message, isError = false) {
    const div = document.createElement('div');
    div.className = isError ? 'text-rose-400' : 'text-slate-300';
    div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    statusLog.appendChild(div);
    statusLog.scrollTop = statusLog.scrollHeight;
  }
  function setStatusStep(step) {
    statusStep.textContent = step;
  }
  function validateToken(token) {
    if (token && (token.startsWith('github_pat_') || token.startsWith('ghp_') || token.length >= 20)) {
      publishBtn.disabled = false;
      addStatusLog('Token loaded ✓');
    } else {
      publishBtn.disabled = true;
    }
  }
  ghTokenInput.addEventListener('input', (e) => {
    const token = e.target.value.trim();
    if (token) {
      localStorage.setItem('gh_portfolio_pat', token);
    } else {
      localStorage.removeItem('gh_portfolio_pat');
    }
    validateToken(token);
    updateAdminButtonsVisibility();
  });
  clearTokenBtn.addEventListener('click', () => {
    ghTokenInput.value = '';
    localStorage.removeItem('gh_portfolio_pat');
    publishBtn.disabled = true;
    addStatusLog('Token cleared');
    updateAdminButtonsVisibility();
  });
  mediaFileInput.addEventListener('change', async (e) => {
    const file = mediaFileInput.files[0];
    if (!file) return;
    thumbnailPreview.classList.add('hidden');
    thumbnailImg.src = '';
    if (file.type.startsWith('video/')) {
      addStatusLog('Analyzing video for best thumbnail...');
      setStatusStep('Generating thumbnail...');
      try {
        const thumbnailDataUrl = await generateSmartThumbnail(file);
        thumbnailImg.src = thumbnailDataUrl;
        thumbnailPreview.classList.remove('hidden');
        addStatusLog('Smart thumbnail generated ✓');
        setStatusStep('Ready to publish');
      } catch (err) {
        addStatusLog('Thumbnail generation failed: ' + err.message, true);
        setStatusStep('Error');
      }
    } else if (file.type === 'image/gif') {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = Math.min(1280, img.naturalWidth || 1280);
        canvas.height = canvas.width * ((img.naturalHeight || 720) / (img.naturalWidth || 1280));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        thumbnailImg.src = canvas.toDataURL('image/jpeg', 0.85);
        thumbnailPreview.classList.remove('hidden');
        URL.revokeObjectURL(url);
        addStatusLog('GIF thumbnail generated ✓');
        setStatusStep('Ready to publish');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        addStatusLog('Failed to load GIF', true);
      };
      img.src = url;
    }
  });
  async function generateSmartThumbnail(file) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.src = url;
      video.muted = true;
      video.preload = 'metadata';
      video.crossOrigin = 'anonymous';
      video.onloadedmetadata = async () => {
        const duration = video.duration;
        if (!duration || duration < 1) {
          URL.revokeObjectURL(url);
          reject(new Error('Video too short'));
          return;
        }
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const targetWidth = 1280;
        const timestamps = [0.2, 0.35, 0.5, 0.65, 0.8].map((t) => duration * t);
        let bestFrame = null;
        let bestScore = -1;
        for (const ts of timestamps) {
          await new Promise((res, rej) => {
            video.onseeked = () => res();
            video.onerror = () => rej(new Error('Seek failed'));
            video.currentTime = ts;
          });
          canvas.width = targetWidth;
          canvas.height = targetWidth * (video.videoHeight / video.videoWidth);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imageData.data;
          let sum = 0;
          let sumSq = 0;
          let pixelCount = 0;
          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            sum += gray;
            sumSq += gray * gray;
            pixelCount++;
          }
          const mean = sum / pixelCount;
          const variance = sumSq / pixelCount - mean * mean;
          const stdDev = Math.sqrt(Math.max(0, variance));
          if (stdDev >= 18 && stdDev > bestScore) {
            bestScore = stdDev;
            bestFrame = canvas.toDataURL('image/jpeg', 0.85);
          }
        }
        URL.revokeObjectURL(url);
        if (bestFrame) {
          resolve(bestFrame);
        } else {
          video.currentTime = duration * 0.5;
          await new Promise((res) => {
            video.onseeked = res;
          });
          canvas.width = targetWidth;
          canvas.height = targetWidth * (video.videoHeight / video.videoWidth);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        }
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Video load failed'));
      };
    });
  }
  function generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80);
  }
  function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }
  async function githubApiRequest(endpoint, options = {}) {
    const token = ghTokenInput.value.trim();
    if (!token) throw new Error('No GitHub token provided');
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...options.headers
    };
    const response = await fetch(`https://api.github.com${endpoint}`, {
      ...options,
      headers
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GitHub API error (${response.status}): ${errorText}`);
    }
    return response.json();
  }
  async function uploadToGitHubContents(filePath, content, message, sha = null, isAlreadyBase64 = false) {
    const endpoint = `/repos/parth33320/enterprise-portfolio/contents/${filePath}`;
    const body = {
      message,
      content: isAlreadyBase64 ? content : utf8ToBase64(content),
      ...(sha && { sha })
    };
    return githubApiRequest(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  }
  async function getFileSha(filePath) {
    try {
      const data = await githubApiRequest(`/repos/parth33320/enterprise-portfolio/contents/${filePath}`);
      return data.sha;
    } catch (e) {
      return null;
    }
  }
  async function fetchRegistryJson() {
    const registryData = await githubApiRequest('/repos/parth33320/enterprise-portfolio/contents/_job_queue/history_registry.json');
    let rawText;
    if (registryData.content && registryData.content.trim()) {
      rawText = base64ToUtf8(registryData.content);
    } else if (registryData.sha) {
      const blobData = await githubApiRequest(`/repos/parth33320/enterprise-portfolio/git/blobs/${registryData.sha}`);
      rawText = base64ToUtf8(blobData.content);
    } else {
      throw new Error('Registry response missing content and sha');
    }
    return { sha: registryData.sha, items: JSON.parse(rawText) };
  }
  publishBtn.addEventListener('click', async () => {
    const token = ghTokenInput.value.trim();
    const file = mediaFileInput.files[0];
    const title = projectTitleInput.value.trim();
    const subtitle = projectSubtitleInput.value.trim();
    const reqId = projectReqIdInput.value.trim();
    const ytUrl = youtubeUrlInput.value.trim();
    const pinned = document.getElementById('pin-project-checkbox').checked;
    if (!token) {
      addStatusLog('Error: GitHub token required', true);
      return;
    }
    const hasFile = !!file;
    const hasYouTube = !!ytUrl && isYouTubeUrl(ytUrl);
    if (!hasFile && !hasYouTube) {
      addStatusLog('Error: Provide either a file or a valid YouTube URL', true);
      return;
    }
    if (hasFile && hasYouTube) {
      addStatusLog('Error: Provide either a file OR a YouTube URL, not both', true);
      return;
    }
    if (!title) {
      addStatusLog('Error: Project title required', true);
      return;
    }
    publishBtn.disabled = true;
    statusLog.innerHTML = '';
    try {
      if (hasYouTube) {
        setStatusStep('1/2 Updating registry (YouTube)...');
        addStatusLog('Publishing YouTube video...');
        const registry = await fetchRegistryJson();
        const newEntry = {
          companyName: title,
          sector: 'Custom Upload',
          jobTitle: subtitle || '',
          reqId: reqId || '',
          painPoint: 'Custom uploaded demonstration.',
          solution: 'Published via portfolio admin modal (YouTube).',
          beforeCost: 0,
          afterCosts: 0,
          investmentCost: 0,
          cpi: 1.0,
          spi: 1.0,
          piPredictability: 100,
          gifAsset: ytUrl,
          pinned: pinned,
          implementationSchedule: 'N/A'
        };
        const updatedRegistry = [newEntry, ...registry.items];
        await uploadToGitHubContents(
          '_job_queue/history_registry.json',
          JSON.stringify(updatedRegistry, null, 2),
          `Add demo entry: ${title}`,
          registry.sha
        );
        addStatusLog('Registry updated ✓');
        setStatusStep('2/2 Done!');
        addStatusLog('Success! GitHub Actions is deploying your live site (~60s).');
      } else {
        setStatusStep('1/4 Generating smart thumbnail...');
        addStatusLog('Starting publish pipeline...');
        const slug = generateSlug(reqId || title);
        const ext = getFileExtension(file.name);
        const mediaFileName = `${slug}.${ext}`;
        const posterFileName = `${slug}-poster.jpg`;
        const MAX_CONTENTS_API_SIZE = 70 * 1024 * 1024;
        if (file.size >= MAX_CONTENTS_API_SIZE) {
          const mb = (file.size / 1024 / 1024).toFixed(1);
          throw new Error(`File is ${mb} MB — GitHub Contents API limit is 100 MB (Base64 expands ~33%). Please compress below 70 MB.`);
        }
        setStatusStep('2/4 Uploading media...');
        addStatusLog(`Uploading ${mediaFileName} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
        const base64Content = await fileToBase64(file);
        const sha = await getFileSha(`docs/assets/${mediaFileName}`);
        await uploadToGitHubContents(`docs/assets/${mediaFileName}`, base64Content, `Add demo media: ${title}`, sha, true);
        const mediaPath = `docs/assets/${mediaFileName}`;
        addStatusLog('Repo upload complete ✓');
        setStatusStep('3/4 Uploading thumbnail...');
        addStatusLog('Uploading poster thumbnail...');
        const posterBase64 = thumbnailImg.src.split(',')[1];
        if (!posterBase64) throw new Error('No thumbnail generated');
        const posterSha = await getFileSha(`docs/assets/${posterFileName}`);
        await uploadToGitHubContents(`docs/assets/${posterFileName}`, posterBase64, `Add demo poster: ${title}`, posterSha, true);
        const posterPath = `docs/assets/${posterFileName}`;
        addStatusLog('Poster upload complete ✓');
        setStatusStep('4/4 Updating registry...');
        addStatusLog('Updating history_registry.json...');
        const registry = await fetchRegistryJson();
        const newEntry = {
          companyName: title,
          sector: 'Custom Upload',
          jobTitle: subtitle || '',
          reqId: reqId || '',
          painPoint: 'Custom uploaded demonstration.',
          solution: 'Published via portfolio admin modal.',
          beforeCost: 0,
          afterCosts: 0,
          investmentCost: 0,
          cpi: 1.0,
          spi: 1.0,
          piPredictability: 100,
          gifAsset: mediaPath,
          posterAsset: posterPath,
          pinned: pinned,
          implementationSchedule: 'N/A'
        };
        const updatedRegistry = [newEntry, ...registry.items];
        await uploadToGitHubContents(
          '_job_queue/history_registry.json',
          JSON.stringify(updatedRegistry, null, 2),
          `Add demo entry: ${title}`,
          registry.sha
        );
        addStatusLog('Registry updated ✓');
        setStatusStep('4/4 Done!');
        addStatusLog('Success! GitHub Actions is deploying your live site (~60s).');
      }
      mediaFileInput.value = '';
      youtubeUrlInput.value = '';
      projectTitleInput.value = '';
      projectSubtitleInput.value = '';
      projectReqIdInput.value = '';
      document.getElementById('pin-project-checkbox').checked = true;
      thumbnailPreview.classList.add('hidden');
      thumbnailImg.src = '';
    } catch (err) {
      addStatusLog('Error: ' + err.message, true);
      setStatusStep('Error');
      console.error(err);
    } finally {
      publishBtn.disabled = false;
    }
  });
  function openAdminModal() {
    adminModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    mediaFileInput.focus();
  }
  function closeAdminModal() {
    adminModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
  adminModalClose.addEventListener('click', closeAdminModal);
  adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) closeAdminModal();
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      openAdminModal();
    }
  });
  const searchInput = document.getElementById('archive-search');
  searchInput.addEventListener('input', (e) => {
    if (e.target.value.toLowerCase() === 'xjupload') {
      e.target.value = '';
      executeFilter(false);
      openAdminModal();
    }
  });
  document.querySelector('h1')?.addEventListener('click', () => {
    headerClickCount++;
    if (headerClickCount === 1) {
      headerClickTimer = setTimeout(() => {
        headerClickCount = 0;
      }, 2000);
    }
    if (headerClickCount >= 5) {
      clearTimeout(headerClickTimer);
      headerClickCount = 0;
      openAdminModal();
    }
  });
  async function togglePinProject(originalIndex) {
    try {
      const registry = await fetchRegistryJson();
      const currentRegistry = registry.items;
      if (originalIndex < 0 || originalIndex >= currentRegistry.length) {
        throw new Error('Invalid project index');
      }
      currentRegistry[originalIndex].pinned = !currentRegistry[originalIndex].pinned;
      await uploadToGitHubContents(
        '_job_queue/history_registry.json',
        JSON.stringify(currentRegistry, null, 2),
        `Toggle pin for ${currentRegistry[originalIndex].companyName}`,
        registry.sha
      );
      PORTFOLIO_DATA = currentRegistry;
      renderPortfolio();
      updateAdminButtonsVisibility();
      showToast(`${currentRegistry[originalIndex].pinned ? 'Pinned' : 'Unpinned'} ${currentRegistry[originalIndex].companyName} — GitHub Pages deploying (~60s)`);
    } catch (err) {
      showToast('Error: ' + err.message);
      console.error(err);
    }
  }
  async function deleteProject(originalIndex) {
    try {
      if (originalIndex < 0 || originalIndex >= PORTFOLIO_DATA.length) {
        throw new Error('Invalid project index');
      }
      const item = PORTFOLIO_DATA[originalIndex];
      const answer = prompt(`Type DELETE to permanently remove "${item.companyName}" from your portfolio:`);
      if (answer !== 'DELETE') return;
      const registry = await fetchRegistryJson();
      const currentRegistry = registry.items;
      if (originalIndex < 0 || originalIndex >= currentRegistry.length) {
        throw new Error('Invalid project index');
      }
      const [removed] = currentRegistry.splice(originalIndex, 1);
      await uploadToGitHubContents(
        '_job_queue/history_registry.json',
        JSON.stringify(currentRegistry, null, 2),
        `Remove project: ${removed.companyName}`,
        registry.sha
      );
      const assetPaths = [removed.gifAsset, removed.mediaAsset, removed.posterAsset].filter(Boolean);
      for (const assetPath of assetPaths) {
        if (!assetPath.startsWith('docs/assets/')) continue;
        const stillReferenced = currentRegistry.some(
          (entry) => entry.gifAsset === assetPath || entry.mediaAsset === assetPath || entry.posterAsset === assetPath
        );
        if (!stillReferenced) {
          const sha = await getFileSha(assetPath);
          if (sha) {
            try {
              await githubApiRequest('/repos/parth33320/enterprise-portfolio/contents/' + assetPath, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Delete unused asset: ' + assetPath, sha })
              });
            } catch (e) {
              console.warn('Failed to delete asset:', assetPath, e);
            }
          }
        }
      }
      PORTFOLIO_DATA = currentRegistry;
      renderPortfolio();
      updateAdminButtonsVisibility();
      showToast(`Deleted ${removed.companyName} — GitHub Pages updating (~60s)`);
    } catch (err) {
      showToast('Error: ' + err.message);
      console.error(err);
    }
  }
  function isVideoUrl(url) {
    if (!url) return false;
    const cleanUrl = url.split('?')[0].toLowerCase();
    return cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm');
  }
  function getMediaSource(item) {
    return item.mediaAsset || item.gifAsset || '';
  }
  function getYouTubeId(item) {
    return extractYouTubeId(getMediaSource(item));
  }
  function buildMediaHtml(item) {
    const mediaSrc = getMediaSource(item);
    const ytId = getYouTubeId(item);
    const isVideo = !ytId && isVideoUrl(mediaSrc);
    const isYouTube = !!ytId;
    const posterSrc = item.posterAsset || '';
    if (isYouTube) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${ytId}?rel=0" title="${escapeAttr(item.companyName)}" class="w-full h-full border-0" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen data-theater-youtube="${ytId}"></iframe>`;
    }
    if (isVideo) {
      return `<video src="${escapeAttr(mediaSrc)}" poster="${escapeAttr(posterSrc)}" controls playsinline preload="none" class="w-full h-full object-contain bg-black" data-theater-video="true"></video>`;
    }
    return `<img src="${escapeAttr(mediaSrc)}" loading="lazy" decoding="async" class="w-full h-full object-cover cursor-zoom-in" alt="${escapeAttr(item.companyName)} Walkthrough" data-fallback-img="true" data-theater-image="true">`;
  }
  function renderPinnedCard(item, originalIndex) {
    const reqBadge = item.reqId ? `<span class="text-slate-400 font-mono text-xs">REQ ID: <span class="text-slate-200 font-bold">${escapeAttr(item.reqId)}</span></span>` : '';
    const pinnedBadge = item.pinned ? `<span class="inline-flex items-center justify-center text-amber-400/90 hover:text-amber-300 transition-colors shrink-0" title="Pinned Project" aria-label="Pinned Project">${PINNED_ICON}</span>` : '';
    const hasJobTitle = item.jobTitle && item.jobTitle.trim() !== '';
    const mediaSrc = getMediaSource(item);
    const ytId = getYouTubeId(item);
    const isVideo = !ytId && isVideoUrl(mediaSrc);
    const isYouTube = !!ytId;
    const mediaHtml = buildMediaHtml(item);
    const adminPinBtn = `<button type="button" data-pin-index="${originalIndex}" class="admin-pin-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors" title="Toggle pin">${item.pinned ? 'Unpin' : 'Pin'}</button>`;
    const adminDeleteBtn = `<button type="button" data-delete-index="${originalIndex}" class="admin-delete-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-800/60 transition-colors" title="Delete project & asset">Delete</button>`;
    return `<div class="case-card bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl shadow-2xl transition-all flex flex-col justify-between" data-search="${escapeAttr(item.companyName)} ${escapeAttr(item.jobTitle || '')} ${escapeAttr(item.reqId || '')}"> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2 mb-4"> <div class="flex flex-col gap-1"> <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">${escapeAttr(item.companyName)}</div> ${hasJobTitle ? `<h2 class="text-lg font-bold text-white">${escapeAttr(item.jobTitle)}</h2>` : ''} </div> <div class="flex items-center gap-2 flex-wrap"> ${pinnedBadge}${reqBadge}${adminPinBtn}${adminDeleteBtn} </div> </div> <div class="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner relative group mt-auto"> ${mediaHtml} <div class="hidden absolute inset-0 flex items-center justify-center text-xs text-slate-500 bg-slate-950 font-mono"> [Walkthrough media generating in build pipeline] </div> <button type="button" data-theater-expand="true" data-is-video="${isVideo}" data-is-youtube="${isYouTube}" data-yt-id="${ytId || ''}" class="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white p-2 rounded-lg border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Theater Mode"> ${EXPAND_ICON} </button> </div> </div>`;
  }
  function renderRegularCard(item, originalIndex) {
    const reqBadge = item.reqId ? `<span class="text-slate-400 font-mono text-xs">REQ ID: <span class="text-slate-200 font-bold">${escapeAttr(item.reqId)}</span></span>` : '';
    const pinnedBadge = item.pinned ? `<span class="inline-flex items-center justify-center text-amber-400/90 hover:text-amber-300 transition-colors shrink-0" title="Pinned Project" aria-label="Pinned Project">${PINNED_ICON}</span>` : '';
    const hasJobTitle = item.jobTitle && item.jobTitle.trim() !== '';
    const mediaSrc = getMediaSource(item);
    const ytId = getYouTubeId(item);
    const isVideo = !ytId && isVideoUrl(mediaSrc);
    const isYouTube = !!ytId;
    const mediaHtml = buildMediaHtml(item);
    const adminPinBtn = `<button type="button" data-pin-index="${originalIndex}" class="admin-pin-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors" title="Toggle pin">${item.pinned ? 'Unpin' : 'Pin'}</button>`;
    const adminDeleteBtn = `<button type="button" data-delete-index="${originalIndex}" class="admin-delete-btn hidden px-2 py-0.5 rounded text-[11px] font-mono bg-red-950/80 hover:bg-red-800 text-red-300 border border-red-800/60 transition-colors" title="Delete project & asset">Delete</button>`;
    return `<div class="case-card bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 p-6 rounded-2xl space-y-5 shadow-2xl transition-all" data-search="${escapeAttr(item.companyName)} ${escapeAttr(item.jobTitle || '')} ${escapeAttr(item.reqId || '')}"> <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800/80 pb-4 gap-2"> <div> <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">${escapeAttr(item.companyName)}</div> ${hasJobTitle ? `<h2 class="text-lg font-bold text-white">${escapeAttr(item.jobTitle)}</h2>` : ''} </div> <div class="flex items-center gap-2 flex-wrap"> ${pinnedBadge}${reqBadge}${adminPinBtn}${adminDeleteBtn} </div> </div> <div class="bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden aspect-video w-full flex items-center justify-center shadow-inner relative group"> ${mediaHtml} <div class="hidden absolute inset-0 flex items-center justify-center text-xs text-slate-500 bg-slate-950 font-mono"> [Walkthrough media generating in build pipeline] </div> <button type="button" data-theater-expand="true" data-is-video="${isVideo}" data-is-youtube="${isYouTube}" data-yt-id="${ytId || ''}" class="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-800/90 text-slate-300 hover:text-white p-2 rounded-lg border border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity z-10" aria-label="Theater Mode"> ${EXPAND_ICON} </button> </div> </div>`;
  }
  function renderPortfolio() {
    const grid = document.getElementById('portfolio-grid');
    if (!PORTFOLIO_DATA || PORTFOLIO_DATA.length === 0) {
      grid.innerHTML = 'No walkthrough entries recorded in system index.';
      return;
    }
    const term = document.getElementById('archive-search').value.toLowerCase().trim();
    const filteredItems = PORTFOLIO_DATA.filter((item) => {
      const haystack = `${item.companyName} ${item.jobTitle || ''} ${item.reqId || ''}`.toLowerCase();
      return haystack.includes(term);
    });
    const indexedItems = filteredItems.map((item) => ({
      item,
      originalIndex: PORTFOLIO_DATA.indexOf(item)
    }));
    const pinnedItems = indexedItems.filter(({ item }) => item.pinned === true);
    const regularItems = indexedItems.filter(({ item }) => !item.pinned);
    if (pinnedItems.length === 0 && regularItems.length === 0) {
      grid.innerHTML = 'No walkthrough entries recorded in system index.';
      return;
    }
    let html = '';
    if (pinnedItems.length > 0) {
      html += ` <div class="mb-10 pb-8 border-b border-slate-800/80"> <div class="text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-6">Featured Projects</div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6"> ${pinnedItems.map(({ item, originalIndex }) => renderPinnedCard(item, originalIndex)).join('')} </div> </div>`;
    }
    html += `<div class="space-y-8">${regularItems.map(({ item, originalIndex }) => renderRegularCard(item, originalIndex)).join('')}</div>`;
    grid.innerHTML = html;
    document.querySelectorAll('[data-pin-index]').forEach((btn) => {
      btn.addEventListener('click', () => togglePinProject(Number(btn.dataset.pinIndex)));
    });
    document.querySelectorAll('[data-delete-index]').forEach((btn) => {
      btn.addEventListener('click', () => deleteProject(Number(btn.dataset.deleteIndex)));
    });
    document.querySelectorAll('[data-theater-expand="true"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const card = btn.closest('.case-card');
        const title = card.querySelector('.text-cyan-400').textContent + (card.querySelector('h2') ? ' - ' + card.querySelector('h2').textContent : '');
        const mediaEl = card.querySelector('video, img, iframe');
        openTheaterModal(title, mediaEl, btn.dataset.isVideo === 'true', btn.dataset.isYoutube === 'true', btn.dataset.ytId);
      });
    });
    document.querySelectorAll('[data-fallback-img="true"]').forEach((img) => {
      img.addEventListener('error', () => {
        img.style.display = 'none';
        if (img.nextElementSibling) img.nextElementSibling.style.display = 'flex';
      });
    });
    document.querySelectorAll('[data-theater-image="true"]').forEach((img) => {
      img.addEventListener('click', (e) => {
        const card = e.target.closest('.case-card');
        const title = card.querySelector('.text-cyan-400').textContent + (card.querySelector('h2') ? ' - ' + card.querySelector('h2').textContent : '');
        openTheaterModal(title, e.target, false, false, '');
      });
    });
  }
  function executeFilter(shouldJump = false) {
    const term = document.getElementById('archive-search').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.case-card');
    let visibleCount = 0;
    let firstVisibleCard = null;
    cards.forEach((card) => {
      const haystack = card.getAttribute('data-search').toLowerCase();
      const isMatch = haystack.includes(term);
      card.style.display = isMatch ? '' : 'none';
      if (isMatch) {
        visibleCount++;
        if (!firstVisibleCard) firstVisibleCard = card;
      }
    });
    let emptyStateEl = document.getElementById('search-empty-state');
    if (visibleCount === 0) {
      if (!emptyStateEl) {
        emptyStateEl = document.createElement('div');
        emptyStateEl.id = 'search-empty-state';
        emptyStateEl.className = 'bg-slate-900/40 border border-dashed border-slate-800 p-12 rounded-2xl text-center space-y-3';
        document.getElementById('portfolio-grid').appendChild(emptyStateEl);
      }
      emptyStateEl.innerHTML = `<div class="text-cyan-400 font-mono text-2xl font-bold">🔍</div> <div class="text-sm font-bold text-slate-200">No Business Solutions Found</div> <div class="text-xs text-slate-400 font-mono">No matching walkthrough entries found for "<span class="text-cyan-400">${escapeAttr(term)}</span>". Try searching company name, job title, or REQ ID.</div>`;
      emptyStateEl.style.display = 'block';
    } else if (emptyStateEl) {
      emptyStateEl.style.display = 'none';
    }
    if (shouldJump && firstVisibleCard) {
      firstVisibleCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  function handleSearchKeydown(event) {
    if (event.key === 'Enter') {
      executeFilter(true);
    }
  }
  window.executeFilter = executeFilter;
  window.handleSearchKeydown = handleSearchKeydown;
  window.openTheaterModal = openTheaterModal;
  window.togglePinProject = togglePinProject;
  window.deleteProject = deleteProject;
  window.renderPortfolio = renderPortfolio;
  window.extractYouTubeId = extractYouTubeId;
  window.updateAdminButtonsVisibility = updateAdminButtonsVisibility;
  renderPortfolio();
  updateAdminButtonsVisibility();
}
const serializedClientScript = `(${clientAppBootstrap.toString()})(${JSON.stringify(historicalCases)}, ${JSON.stringify(expandIcon)}, ${JSON.stringify(pinnedIcon)});`;
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Projects Index</title>
    <link rel="stylesheet" href="styles.css">
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
            <div class="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8 w-full md:w-auto">
                <!-- Identity Strip -->
                <div class="flex flex-col items-start md:items-center md:flex-row gap-3 md:gap-4">
                    <div class="text-center md:text-left">
                        <h1 class="text-xl font-extrabold text-white tracking-tight">Parth Patel</h1>
                        <p class="text-sm text-cyan-400 font-medium">Enterprise AI & Automation Systems Engineer</p>
                    </div>
                    <div class="flex items-center gap-4 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-800 pl-0 md:pl-4">
                        <a href="https://github.com/parth33320" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group" aria-label="GitHub" id="github-link">
                            ${githubIcon}
                            <span class="text-xs font-mono hidden sm:inline">GitHub</span>
                        </a>
                        <a href="mailto:parth33320@gmail.com" class="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors group" aria-label="Email">
                            ${emailIcon}
                            <span class="text-xs font-mono hidden sm:inline">Email</span>
                        </a>
                    </div>
                </div>
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

    <!-- Theater Mode Modal -->
    <div id="theater-modal" class="hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
        <div class="relative max-w-[92vw] max-h-[92vh] w-full h-full flex flex-col items-center">
            <div class="absolute top-4 right-4 z-10 flex items-center gap-2">
                <span id="modal-title" class="text-white font-mono text-xs bg-slate-900/80 px-3 py-1 rounded"></span>
                <button id="modal-close" class="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-700" aria-label="Close (Esc)">
                    ${closeIcon}
                </button>
            </div>
            <div id="modal-media" class="flex-1 flex items-center justify-center"></div>
        </div>
    </div>

    <!-- Admin Upload Modal -->
    <div id="admin-upload-modal" class="hidden fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
        <div class="bg-slate-900/95 border border-slate-800 rounded-2xl p-6 md:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-lg font-extrabold text-white flex items-center gap-2">${uploadIcon} Publish New Demo</h2>
                <button id="admin-modal-close" class="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg border border-slate-700" aria-label="Close">${closeIcon}</button>
            </div>
            
            <!-- GitHub Token Section -->
            <div class="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label class="block text-xs font-mono text-slate-400">GitHub Fine-Grained PAT (Contents: Read & Write)</label>
                <div class="flex gap-2">
                    <input type="password" id="gh-token-input" placeholder="github_pat_... or ghp_..." class="flex-1 bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors" aria-label="GitHub PAT">
                    <button id="clear-token-btn" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono px-3 py-3 rounded-lg border border-slate-700 transition whitespace-nowrap">Clear</button>
                </div>
                <p class="text-[10px] text-slate-500 font-mono">Token saved locally in browser. Never sent anywhere except GitHub API.</p>
            </div>

            <!-- File Upload Section -->
            <div class="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label class="block text-xs font-mono text-slate-400">Demo Video / GIF</label>
                <input type="file" id="media-file-input" accept="video/mp4,video/webm,image/gif" class="bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors w-full" aria-label="Media file">
                <div id="thumbnail-preview" class="hidden">
                    <p class="text-xs font-mono text-slate-400 mb-2">Auto-Generated Thumbnail Preview:</p>
                    <img id="thumbnail-img" src="" alt="Thumbnail preview" class="max-w-full h-auto rounded-lg border border-slate-700">
                </div>
            </div>

            <!-- YouTube URL Section -->
            <div class="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <label class="block text-xs font-mono text-slate-400">YouTube Video URL (Optional — skips file upload if provided)</label>
                <input type="url" id="youtube-url-input" placeholder="https://youtu.be/... or https://youtube.com/..." class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors" aria-label="YouTube URL">
            </div>

            <!-- Project Metadata Section -->
            <div class="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-4">
                <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1">Project / Company Title <span class="text-rose-400">*</span></label>
                    <input type="text" id="project-title-input" placeholder="e.g., Sovereign Supply Chain XR Walk" class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors" required aria-label="Project title">
                </div>
                <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1">Subtitle / Role (Optional)</label>
                    <input type="text" id="project-subtitle-input" placeholder="e.g., Hands-First Mixed Reality Inventory Co-Pilot" class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors" aria-label="Project subtitle">
                </div>
                <div>
                    <label class="block text-xs font-mono text-slate-400 mb-1">Requisition ID (Optional - leave blank for standalone)</label>
                    <input type="text" id="project-reqid-input" placeholder="e.g., WB-UIPATH-2026" class="w-full bg-slate-950 border border-slate-800 text-xs px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 text-slate-200 font-mono shadow-inner transition-colors" aria-label="Requisition ID">
                </div>
                <div class="flex items-center gap-2">
                    <input type="checkbox" id="pin-project-checkbox" checked class="w-4 h-4 accent-cyan-500">
                    <label class="text-xs font-mono text-slate-400">Pin this project to the top</label>
                </div>
            </div>

            <!-- Status Log -->
            <div class="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-xl">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-mono text-slate-400">Publish Progress</span>
                    <span id="status-step" class="text-[10px] font-mono text-cyan-400">Ready</span>
                </div>
                <div id="status-log" class="font-mono text-[10px] text-slate-500 h-24 overflow-y-auto bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                    <div class="text-slate-600">Waiting to start...</div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3">
                <button id="publish-btn" class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-mono px-4 py-3 rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    ${uploadIcon} Auto-Generate Thumbnail & Publish
                </button>
            </div>
        </div>
    </div>

    <script>
${serializedClientScript}
    </script>
</body>
</html>`;
fs.writeFileSync(path.join(publicDir, 'index.html'), htmlContent);
console.log('[Factory] Portfolio website successfully compiled with job-centric walkthrough layout.');