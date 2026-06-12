import type { Context } from 'hono';

const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nusakit API — Indonesian Data Validation API</title>
  <meta name="description" content="Free open-source API for Indonesian data validation: NIK, NPWP, Phone, Rupiah, Bank, Wilayah administratif & Kode Pos.">
  <meta name="theme-color" content="#0f172a">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f172a;
      --bg-card: #1e293b;
      --bg-card-hover: #263244;
      --accent: #3b82f6;
      --accent-light: #60a5fa;
      --accent-glow: rgba(59, 130, 246, 0.15);
      --green: #10b981;
      --green-dim: rgba(16, 185, 129, 0.15);
      --amber: #f59e0b;
      --red: #ef4444;
      --text: #f1f5f9;
      --text-dim: #94a3b8;
      --text-muted: #64748b;
      --border: #1e293b;
      --border-hover: #334155;
      --mono: 'JetBrains Mono', monospace;
      --sans: 'Inter', -apple-system, sans-serif;
    }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
    }

    a { color: var(--accent-light); text-decoration: none; transition: color 0.15s; }
    a:hover { color: var(--text); }

    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }

    /* ─── Hero ─── */
    .hero {
      position: relative;
      padding: 100px 0 72px;
      text-align: center;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -300px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 900px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 60%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border-hover);
      border-radius: 999px;
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 28px;
      letter-spacing: 0.02em;
    }

    .hero-badge .dot {
      width: 7px;
      height: 7px;
      background: var(--green);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .hero h1 {
      font-size: clamp(2.75rem, 6vw, 4.5rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.05;
      margin-bottom: 20px;
    }

    .hero h1 span {
      background: linear-gradient(135deg, var(--accent-light), #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      font-size: 1.2rem;
      color: var(--text-dim);
      max-width: 560px;
      margin: 0 auto 36px;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 13px 28px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      letter-spacing: -0.01em;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 4px 24px var(--accent-glow), inset 0 1px 0 rgba(255,255,255,0.1);
    }

    .btn-primary:hover {
      background: var(--accent-light);
      transform: translateY(-1px);
      box-shadow: 0 8px 32px var(--accent-glow);
    }

    .btn-secondary {
      background: var(--bg-card);
      color: var(--text-dim);
      border: 1px solid var(--border-hover);
    }

    .btn-secondary:hover {
      background: var(--bg-card-hover);
      color: var(--text);
      transform: translateY(-1px);
    }

    .btn svg {
      width: 16px;
      height: 16px;
      opacity: 0.8;
    }

    /* ─── Stats ─── */
    .stats {
      display: flex;
      justify-content: center;
      gap: 1px;
      margin: 0 auto 72px;
      max-width: 640px;
      background: var(--border-hover);
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid var(--border-hover);
    }

    .stat {
      flex: 1;
      text-align: center;
      padding: 28px 16px;
      background: var(--bg-card);
    }

    .stat-value {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text);
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--text-muted);
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    /* ─── Quick Start ─── */
    .quickstart {
      margin: 0 auto 80px;
      max-width: 680px;
    }

    .code-block {
      background: #0a0f1a;
      border: 1px solid var(--border-hover);
      border-radius: 14px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border-hover);
      font-size: 13px;
      color: var(--text-muted);
    }

    .code-header .dots {
      display: flex;
      gap: 6px;
    }
    .code-header .dots span {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--border-hover);
    }

    .code-body {
      padding: 20px 24px;
      font-family: var(--mono);
      font-size: 13.5px;
      line-height: 1.8;
      overflow-x: auto;
      white-space: pre;
    }

    .code-body .comment { color: var(--text-muted); }
    .code-body .string { color: #a5d6ff; }
    .code-body .keyword { color: #ff7b72; }
    .code-body .url { color: var(--green); }

    /* ─── Section ─── */
    .section { padding: 80px 0; }

    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .section-desc {
      text-align: center;
      color: var(--text-dim);
      margin-bottom: 48px;
      max-width: 520px;
      margin-left: auto;
      margin-right: auto;
    }

    /* ─── Features ─── */
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1px;
      background: var(--border-hover);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--border-hover);
    }

    .feature-card {
      background: var(--bg-card);
      padding: 32px;
      transition: background 0.2s;
    }

    .feature-card:hover {
      background: var(--bg-card-hover);
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }

    .feature-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .feature-card h3 {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .feature-card p {
      color: var(--text-dim);
      font-size: 0.875rem;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .endpoint-list {
      list-style: none;
      font-family: var(--mono);
      font-size: 12px;
    }

    .endpoint-list li {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 0;
      color: var(--text-dim);
    }

    .method {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      min-width: 36px;
      text-align: center;
      letter-spacing: 0.03em;
    }

    .method-get { background: rgba(16, 185, 129, 0.15); color: var(--green); }
    .method-post { background: rgba(59, 130, 246, 0.15); color: var(--accent-light); }

    /* ─── Playground ─── */
    .playground {
      background: var(--bg-card);
      border: 1px solid var(--border-hover);
      border-radius: 16px;
      padding: 36px;
      max-width: 780px;
      margin: 0 auto;
    }

    .playground h3 {
      font-size: 1rem;
      margin-bottom: 20px;
      font-weight: 600;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-size: 0.8rem;
    }

    .pg-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .pg-select, .pg-input {
      background: var(--bg);
      border: 1px solid var(--border-hover);
      border-radius: 8px;
      padding: 10px 14px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 13.5px;
      transition: border-color 0.15s;
    }

    .pg-select { min-width: 120px; }
    .pg-input { flex: 1; }

    .pg-select:focus, .pg-input:focus {
      outline: none;
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }

    .pg-btn {
      padding: 10px 24px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .pg-btn:hover { background: var(--accent-light); }
    .pg-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .pg-result {
      margin-top: 16px;
      background: #0a0f1a;
      border: 1px solid var(--border-hover);
      border-radius: 10px;
      padding: 20px;
      font-family: var(--mono);
      font-size: 12.5px;
      min-height: 80px;
      max-height: 320px;
      overflow-y: auto;
      white-space: pre-wrap;
      color: var(--text-dim);
      line-height: 1.7;
    }

    .pg-status {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 10px;
    }

    .pg-status-200 { background: rgba(16, 185, 129, 0.15); color: var(--green); }
    .pg-status-400 { background: rgba(239, 68, 68, 0.15); color: var(--red); }

    /* ─── Footer ─── */
    footer {
      border-top: 1px solid var(--border-hover);
      padding: 48px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    footer a { color: var(--text-dim); }
    footer a:hover { color: var(--text); }

    .footer-links {
      display: flex;
      gap: 24px;
      justify-content: center;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .footer-links a {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    .footer-credit {
      margin-top: 16px;
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* ─── Responsive ─── */
    @media (max-width: 640px) {
      .hero { padding: 64px 0 48px; }
      .hero p { font-size: 1.05rem; }
      .pg-row { flex-direction: column; }
      .stats { flex-direction: column; }
      .stat { padding: 20px; }
      .features-grid { grid-template-columns: 1fr; }
      .playground { padding: 24px; }
      .section { padding: 56px 0; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero-badge">
        <span class="dot"></span>
        Open Source · Free Forever · MIT License
      </div>
      <h1>Nusakit <span>API</span></h1>
      <p>Satu API untuk semua validasi data Indonesia. NIK, NPWP, Nomor HP, Rupiah, Bank, Wilayah Administratif — dari provinsi sampai desa.</p>
      <div class="hero-actions">
        <a href="#playground" class="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          Try It Out
        </a>
        <a href="https://github.com/muhfauziazhar/nusakit-api" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
          Star on GitHub
        </a>
        <a href="/openapi.json" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          OpenAPI Spec
        </a>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <div class="container">
    <div class="stats">
      <div class="stat">
        <div class="stat-value">38</div>
        <div class="stat-label">Provinsi</div>
      </div>
      <div class="stat">
        <div class="stat-value">514</div>
        <div class="stat-label">Kab/Kota</div>
      </div>
      <div class="stat">
        <div class="stat-value">7,285</div>
        <div class="stat-label">Kecamatan</div>
      </div>
      <div class="stat">
        <div class="stat-value">83,762</div>
        <div class="stat-label">Desa/Kelurahan</div>
      </div>
    </div>
  </div>

  <!-- Quick Start -->
  <section class="container">
    <div class="quickstart">
      <div class="code-block">
        <div class="code-header">
          <div class="dots"><span></span><span></span><span></span></div>
          <span>Quick Start</span>
        </div>
        <div class="code-body"><span class="comment"># Validate NIK</span>
curl <span class="url">https://nusakit.my.id/v1/nik/validate?nik=320101...</span>

<span class="comment"># Terbilang — angka ke kata bahasa Indonesia</span>
curl <span class="url">https://nusakit.my.id/v1/rupiah/terbilang?amount=1500000</span>
<span class="comment"># → "satu juta lima ratus ribu rupiah"</span>

<span class="comment"># Cari wilayah</span>
curl <span class="url">https://nusakit.my.id/v1/wilayah/search?q=bandung</span>

<span class="comment"># Detect operator HP</span>
curl <span class="url">https://nusakit.my.id/v1/phone/operator?phone=081234567890</span>
<span class="comment"># → { "operator": "Telkomsel", "valid": true }</span></div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">API Endpoints</h2>
      <p class="section-desc">Semua yang developer Indonesia butuhkan untuk validasi data — dalam satu API.</p>

      <div class="features-grid">
        <!-- Wilayah -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: var(--accent)"></span>
            <h3>Wilayah Administratif</h3>
          </div>
          <p>Data wilayah lengkap dari provinsi sampai desa. Sumber: Kepmendagri 2025.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span> /v1/wilayah/provinces</li>
            <li><span class="method method-get">GET</span> /v1/wilayah/regencies/:code</li>
            <li><span class="method method-get">GET</span> /v1/wilayah/districts/:code</li>
            <li><span class="method method-get">GET</span> /v1/wilayah/villages/:code</li>
            <li><span class="method method-get">GET</span> /v1/wilayah/search?q=...</li>
          </ul>
        </div>

        <!-- NIK -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: var(--green)"></span>
            <h3>NIK (KTP)</h3>
          </div>
          <p>Validasi struktural & parse NIK. Extract provinsi, tanggal lahir, gender, umur.</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/nik/validate</li>
            <li><span class="method method-get">GET</span> /v1/nik/validate?nik=...</li>
          </ul>
        </div>

        <!-- NPWP -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: var(--amber)"></span>
            <h3>NPWP</h3>
          </div>
          <p>Validasi NPWP format lama (15 digit) dan baru (16 digit = NIK).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/npwp/validate</li>
            <li><span class="method method-get">GET</span> /v1/npwp/format?npwp=...</li>
          </ul>
        </div>

        <!-- Phone -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: #8b5cf6"></span>
            <h3>Nomor HP</h3>
          </div>
          <p>Validasi, normalisasi, dan deteksi operator (Telkomsel, Indosat, XL, dll).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/phone/validate</li>
            <li><span class="method method-get">GET</span> /v1/phone/operator?phone=...</li>
          </ul>
        </div>

        <!-- Rupiah -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: #ec4899"></span>
            <h3>Rupiah</h3>
          </div>
          <p>Format, parse, dan terbilang (angka → kata bahasa Indonesia).</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span> /v1/rupiah/format?amount=...</li>
            <li><span class="method method-get">GET</span> /v1/rupiah/terbilang?amount=...</li>
            <li><span class="method method-get">GET</span> /v1/rupiah/parse?input=...</li>
          </ul>
        </div>

        <!-- Bank -->
        <div class="feature-card">
          <div class="feature-header">
            <span class="feature-dot" style="background: #14b8a6"></span>
            <h3>Bank</h3>
          </div>
          <p>Kode bank BI, cari bank, validasi nomor rekening struktural.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span> /v1/bank</li>
            <li><span class="method method-get">GET</span> /v1/bank/:code</li>
            <li><span class="method method-post">POST</span> /v1/bank/validate-account</li>
          </ul>
        </div>

        <!-- Dummy -->
        <div class="feature-card" style="grid-column: 1 / -1;">
          <div class="feature-header">
            <span class="feature-dot" style="background: var(--text-muted)"></span>
            <h3>Dummy Generator</h3>
          </div>
          <p>Generate data dummy untuk testing. NIK, NPWP, nomor HP yang valid secara struktur.</p>
          <ul class="endpoint-list" style="display: flex; gap: 24px; flex-wrap: wrap;">
            <li><span class="method method-post">POST</span> /v1/dummy/nik</li>
            <li><span class="method method-post">POST</span> /v1/dummy/phone</li>
            <li><span class="method method-post">POST</span> /v1/dummy/npwp</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Playground -->
  <section class="section" id="playground">
    <div class="container">
      <h2 class="section-title">API Playground</h2>
      <p class="section-desc">Coba langsung tanpa install apa-apa.</p>

      <div class="playground">
        <h3>Try an endpoint</h3>
        <div class="pg-row">
          <select class="pg-select" id="pg-method">
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
          <input class="pg-input" id="pg-url" placeholder="/v1/rupiah/terbilang?amount=1500000" value="/v1/rupiah/terbilang?amount=1500000">
          <button class="pg-btn" id="pg-send">Send →</button>
        </div>
        <div class="pg-row" id="pg-body-row" style="display:none">
          <input class="pg-input" id="pg-body" placeholder='{"nik": "320101..."}'>
        </div>
        <div class="pg-result" id="pg-result">Response will appear here...</div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>Nusakit API — Built by <a href="https://github.com/muhfauziazhar">Muhammad Fauzi Azhar</a></p>
      <div class="footer-links">
        <a href="https://github.com/muhfauziazhar/nusakit-api">GitHub</a>
        <a href="/openapi.json">OpenAPI Spec</a>
        <a href="/health">Health</a>
      </div>
      <p class="footer-credit">
        Data wilayah: <a href="https://github.com/cahyadsn/wilayah">cahyadsn/wilayah</a> — Kepmendagri 2025, MIT License
      </p>
    </div>
  </footer>

  <script>
    // Playground
    const methodEl = document.getElementById('pg-method');
    const urlEl = document.getElementById('pg-url');
    const bodyEl = document.getElementById('pg-body');
    const bodyRow = document.getElementById('pg-body-row');
    const resultEl = document.getElementById('pg-result');
    const sendBtn = document.getElementById('pg-send');

    methodEl.addEventListener('change', () => {
      bodyRow.style.display = methodEl.value === 'POST' ? 'flex' : 'none';
      if (methodEl.value === 'POST' && !bodyEl.value) {
        const url = urlEl.value;
        if (url.includes('nik')) bodyEl.value = JSON.stringify({ nik: '3201010101900001' });
        else if (url.includes('npwp')) bodyEl.value = JSON.stringify({ npwp: '012345678901234' });
        else if (url.includes('phone')) bodyEl.value = JSON.stringify({ phone: '081234567890' });
        else bodyEl.value = '{}';
      }
    });

    sendBtn.addEventListener('click', async () => {
      sendBtn.disabled = true;
      sendBtn.textContent = '...';
      resultEl.textContent = 'Loading...';

      try {
        const opts = { method: methodEl.value, headers: {} };
        if (methodEl.value === 'POST') {
          opts.headers['Content-Type'] = 'application/json';
          opts.body = bodyEl.value || '{}';
        }

        const res = await fetch(urlEl.value, opts);
        const data = await res.json();

        const statusClass = res.ok ? 'pg-status-200' : 'pg-status-400';
        resultEl.innerHTML = '<span class="pg-status ' + statusClass + '">' + res.status + ' ' + res.statusText + '</span>\\n' + JSON.stringify(data, null, 2);
      } catch (e) {
        resultEl.textContent = 'Error: ' + e.message;
      }

      sendBtn.disabled = false;
      sendBtn.textContent = 'Send →';
    });

    urlEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBtn.click(); });
    bodyEl.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendBtn.click(); });
  </script>
</body>
</html>`;

export function landingPage(c: Context) {
  return c.html(html, 200, {
    'Cache-Control': 'public, max-age=300',
  });
}
