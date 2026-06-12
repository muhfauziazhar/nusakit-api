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
      --bg-card-hover: #334155;
      --accent: #3b82f6;
      --accent-light: #60a5fa;
      --accent-glow: rgba(59, 130, 246, 0.3);
      --green: #10b981;
      --amber: #f59e0b;
      --red: #ef4444;
      --text: #f1f5f9;
      --text-dim: #94a3b8;
      --text-muted: #64748b;
      --border: #334155;
      --mono: 'JetBrains Mono', monospace;
      --sans: 'Inter', -apple-system, sans-serif;
    }

    body {
      font-family: var(--sans);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      overflow-x: hidden;
    }

    a { color: var(--accent-light); text-decoration: none; }
    a:hover { text-decoration: underline; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }

    /* ─── Hero ─── */
    .hero {
      position: relative;
      padding: 80px 0 60px;
      text-align: center;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -200px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, var(--accent-glow) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 999px;
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 24px;
    }

    .hero-badge .dot {
      width: 8px;
      height: 8px;
      background: var(--green);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 16px;
    }

    .hero h1 span { color: var(--accent-light); }

    .hero p {
      font-size: 1.15rem;
      color: var(--text-dim);
      max-width: 640px;
      margin: 0 auto 32px;
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
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: var(--accent);
      color: white;
      box-shadow: 0 0 20px var(--accent-glow);
    }

    .btn-primary:hover {
      background: var(--accent-light);
      transform: translateY(-1px);
      text-decoration: none;
    }

    .btn-secondary {
      background: var(--bg-card);
      color: var(--text);
      border: 1px solid var(--border);
    }

    .btn-secondary:hover {
      background: var(--bg-card-hover);
      transform: translateY(-1px);
      text-decoration: none;
    }

    /* ─── Quick Start ─── */
    .quickstart {
      margin: 40px auto 60px;
      max-width: 700px;
    }

    .code-block {
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: rgba(255,255,255,0.03);
      border-bottom: 1px solid var(--border);
      font-size: 13px;
      color: var(--text-muted);
    }

    .code-header .lang {
      font-family: var(--mono);
      color: var(--text-dim);
    }

    .code-body {
      padding: 16px 20px;
      font-family: var(--mono);
      font-size: 14px;
      line-height: 1.7;
      overflow-x: auto;
      white-space: pre;
    }

    .code-body .comment { color: var(--text-muted); }
    .code-body .string { color: #a5d6ff; }
    .code-body .keyword { color: #ff7b72; }
    .code-body .url { color: var(--green); }

    /* ─── Features Grid ─── */
    .section { padding: 60px 0; }

    .section-title {
      font-size: 1.75rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
    }

    .section-desc {
      text-align: center;
      color: var(--text-dim);
      margin-bottom: 48px;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 16px;
    }

    .feature-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 28px;
      transition: all 0.2s;
    }

    .feature-card:hover {
      border-color: var(--accent);
      box-shadow: 0 0 30px rgba(59, 130, 246, 0.1);
    }

    .feature-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .feature-card .desc {
      color: var(--text-dim);
      font-size: 0.9rem;
      margin-bottom: 16px;
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
      padding: 6px 0;
      color: var(--text-dim);
    }

    .endpoint-list li .path { flex: 1; }

    .method {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      min-width: 36px;
      text-align: center;
    }

    .method-get { background: rgba(16, 185, 129, 0.2); color: var(--green); }
    .method-post { background: rgba(59, 130, 246, 0.2); color: var(--accent-light); }

    .try-btn {
      background: none;
      border: 1px solid var(--border);
      color: var(--accent-light);
      font-family: var(--mono);
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }

    .try-btn:hover {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    .try-btn.active {
      background: var(--accent);
      color: white;
      border-color: var(--accent);
    }

    /* ─── Inline Try Panel ─── */
    .try-panel {
      display: none;
      margin-top: 16px;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
    }

    .try-panel.open { display: block; }

    .try-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 14px;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
    }

    .try-panel-url {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      min-width: 0;
    }

    .try-panel-url .method-badge {
      font-size: 11px;
      font-weight: 700;
      font-family: var(--mono);
      flex-shrink: 0;
    }

    .try-panel-url .method-badge.get { color: var(--green); }
    .try-panel-url .method-badge.post { color: var(--accent-light); }

    .try-url-input {
      background: none;
      border: none;
      color: var(--text);
      font-family: var(--mono);
      font-size: 13px;
      flex: 1;
      min-width: 0;
      outline: none;
    }

    .try-send {
      padding: 6px 16px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s;
      white-space: nowrap;
    }

    .try-send:hover { background: var(--accent-light); }
    .try-send:disabled { opacity: 0.5; cursor: not-allowed; }

    .try-panel-body {
      padding: 12px 14px;
    }

    .try-params {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 12px;
    }

    .try-param-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .try-param-label {
      font-family: var(--mono);
      font-size: 11px;
      color: var(--text-muted);
      min-width: 60px;
      text-align: right;
    }

    .try-param-input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 7px 10px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 12px;
      outline: none;
      transition: border-color 0.15s;
    }

    .try-param-input:focus {
      border-color: var(--accent);
    }

    .try-result {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      font-family: var(--mono);
      font-size: 12px;
      max-height: 280px;
      overflow-y: auto;
      white-space: pre-wrap;
      color: var(--text-dim);
      line-height: 1.6;
      min-height: 40px;
    }

    .try-result .status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .try-result .status.ok { background: rgba(16, 185, 129, 0.2); color: var(--green); }
    .try-result .status.err { background: rgba(239, 68, 68, 0.2); color: var(--red); }

    /* ─── Stats ─── */
    .stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      padding: 40px 0;
      flex-wrap: wrap;
    }

    .stat { text-align: center; }
    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      color: var(--accent-light);
    }
    .stat-label {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-top: 4px;
    }

    /* ─── Footer ─── */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 0;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.85rem;
    }

    footer a { color: var(--text-dim); }

    /* ─── Responsive ─── */
    @media (max-width: 640px) {
      .hero { padding: 48px 0 40px; }
      .stats { gap: 24px; }
      .features-grid { grid-template-columns: 1fr; }
      .try-param-row { flex-direction: column; align-items: stretch; }
      .try-param-label { text-align: left; min-width: auto; }
    }
  </style>
</head>
<body>
  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <div class="hero-badge">
        <span class="dot"></span>
        Open Source &bull; Free Forever &bull; MIT License
      </div>
      <h1>Nusakit <span>API</span></h1>
      <p>Satu API untuk semua validasi data Indonesia. NIK, NPWP, Nomor HP, Rupiah, Bank, Wilayah Administratif &mdash; dari provinsi sampai desa.</p>
      <div class="hero-actions">
        <a href="https://github.com/muhfauziazhar/nusakit-api" class="btn btn-secondary">Star on GitHub</a>
        <a href="/openapi.json" class="btn btn-secondary">OpenAPI Spec</a>
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
          <span class="lang">bash</span>
          <span>Quick Start</span>
        </div>
        <div class="code-body"><span class="comment"># Validate NIK</span>
curl <span class="url">https://nusakit.my.id/v1/nik/validate?nik=320101...</span>

<span class="comment"># Terbilang &mdash; angka ke kata bahasa Indonesia</span>
curl <span class="url">https://nusakit.my.id/v1/rupiah/terbilang?amount=1500000</span>
<span class="comment"># &rarr; "satu juta lima ratus ribu rupiah"</span>

<span class="comment"># Cari wilayah</span>
curl <span class="url">https://nusakit.my.id/v1/wilayah/search?q=bandung</span>

<span class="comment"># Detect operator HP</span>
curl <span class="url">https://nusakit.my.id/v1/phone/operator?phone=081234567890</span>
<span class="comment"># &rarr; { "operator": "Telkomsel", "valid": true }</span></div>
      </div>
    </div>
  </section>

  <!-- Features -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">API Endpoints</h2>
      <p class="section-desc">Semua yang developer Indonesia butuhkan untuk validasi data &mdash; dalam satu API.</p>

      <div class="features-grid">
        <!-- Wilayah -->
        <div class="feature-card">
          <h3>Wilayah Administratif</h3>
          <p class="desc">Data wilayah lengkap dari provinsi sampai desa. Sumber: Kepmendagri 2025.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span><span class="path">/v1/wilayah/provinces</span><button class="try-btn" data-method="GET" data-path="/v1/wilayah/provinces">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/wilayah/provinces/:code</span><button class="try-btn" data-method="GET" data-path="/v1/wilayah/provinces/32" data-labels="code" data-defaults="32">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/wilayah/regencies/:code</span><button class="try-btn" data-method="GET" data-path="/v1/wilayah/regencies/3201" data-labels="code" data-defaults="3201">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/wilayah/districts/:code</span><button class="try-btn" data-method="GET" data-path="/v1/wilayah/districts/320101" data-labels="code" data-defaults="320101">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/wilayah/search?q=...</span><button class="try-btn" data-method="GET" data-path="/v1/wilayah/search?q=bandung" data-labels="q" data-defaults="bandung">Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- NIK -->
        <div class="feature-card">
          <h3>NIK (KTP)</h3>
          <p class="desc">Validasi struktural &amp; parse NIK. Extract provinsi, tanggal lahir, gender, umur.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span><span class="path">/v1/nik/validate?nik=...</span><button class="try-btn" data-method="GET" data-path="/v1/nik/validate?nik=3201010101900001" data-labels="nik" data-defaults="3201010101900001">Try</button></li>
            <li><span class="method method-post">POST</span><span class="path">/v1/nik/validate</span><button class="try-btn" data-method="POST" data-path="/v1/nik/validate" data-body='{"nik":"3201010101900001"}'>Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- NPWP -->
        <div class="feature-card">
          <h3>NPWP</h3>
          <p class="desc">Validasi NPWP format lama (15 digit) dan baru (16 digit = NIK).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span><span class="path">/v1/npwp/validate</span><button class="try-btn" data-method="POST" data-path="/v1/npwp/validate" data-body='{"npwp":"01.234.567.8-012.000"}'>Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/npwp/format?npwp=...</span><button class="try-btn" data-method="GET" data-path="/v1/npwp/format?npwp=012345678012000" data-labels="npwp" data-defaults="012345678012000">Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- Phone -->
        <div class="feature-card">
          <h3>Nomor HP</h3>
          <p class="desc">Validasi, normalisasi, dan deteksi operator (Telkomsel, Indosat, XL, dll).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span><span class="path">/v1/phone/validate</span><button class="try-btn" data-method="POST" data-path="/v1/phone/validate" data-body='{"phone":"081234567890"}'>Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/phone/operator?phone=...</span><button class="try-btn" data-method="GET" data-path="/v1/phone/operator?phone=081234567890" data-labels="phone" data-defaults="081234567890">Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- Rupiah -->
        <div class="feature-card">
          <h3>Rupiah</h3>
          <p class="desc">Format, parse, dan terbilang (angka &rarr; kata bahasa Indonesia).</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span><span class="path">/v1/rupiah/format?amount=...</span><button class="try-btn" data-method="GET" data-path="/v1/rupiah/format?amount=1500000" data-labels="amount" data-defaults="1500000">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/rupiah/terbilang?amount=...</span><button class="try-btn" data-method="GET" data-path="/v1/rupiah/terbilang?amount=1500000" data-labels="amount" data-defaults="1500000">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/rupiah/parse?input=...</span><button class="try-btn" data-method="GET" data-path="/v1/rupiah/parse?input=Rp%201.500.000" data-labels="input" data-defaults="Rp 1.500.000">Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- Bank -->
        <div class="feature-card">
          <h3>Bank</h3>
          <p class="desc">Kode bank BI, cari bank, validasi nomor rekening struktural.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span><span class="path">/v1/bank</span><button class="try-btn" data-method="GET" data-path="/v1/bank">Try</button></li>
            <li><span class="method method-get">GET</span><span class="path">/v1/bank/:code</span><button class="try-btn" data-method="GET" data-path="/v1/bank/014" data-labels="code" data-defaults="014">Try</button></li>
            <li><span class="method method-post">POST</span><span class="path">/v1/bank/validate-account</span><button class="try-btn" data-method="POST" data-path="/v1/bank/validate-account" data-body='{"bankCode":"014","accountNumber":"1234567890"}'>Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>

        <!-- Dummy -->
        <div class="feature-card">
          <h3>Dummy Generator</h3>
          <p class="desc">Generate data dummy untuk testing. NIK, NPWP, nomor HP yang valid secara struktur.</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span><span class="path">/v1/dummy/nik</span><button class="try-btn" data-method="POST" data-path="/v1/dummy/nik" data-body='{"count":3}'>Try</button></li>
            <li><span class="method method-post">POST</span><span class="path">/v1/dummy/phone</span><button class="try-btn" data-method="POST" data-path="/v1/dummy/phone" data-body='{"count":3}'>Try</button></li>
            <li><span class="method method-post">POST</span><span class="path">/v1/dummy/npwp</span><button class="try-btn" data-method="POST" data-path="/v1/dummy/npwp" data-body='{"count":3}'>Try</button></li>
          </ul>
          <div class="try-panel"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <div class="container">
      <p>Nusakit API &bull; Built by <a href="https://github.com/muhfauziazhar">Muhammad Fauzi Azhar</a></p>
      <p style="margin-top: 8px;">
        <a href="https://github.com/muhfauziazhar/nusakit-api">GitHub</a> &bull;
        <a href="/openapi.json">OpenAPI Spec</a> &bull;
        <a href="/health">Health</a>
      </p>
      <p style="margin-top: 12px; font-size: 0.75rem;">
        Data wilayah: <a href="https://github.com/cahyadsn/wilayah">cahyadsn/wilayah</a> (Kepmendagri 2025, MIT License)
      </p>
    </div>
  </footer>

  <script>
    document.querySelectorAll('.try-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.feature-card');
        const panel = card.querySelector('.try-panel');
        const isActive = btn.classList.contains('active');

        // Close all panels
        document.querySelectorAll('.try-panel.open').forEach(p => p.classList.remove('open'));
        document.querySelectorAll('.try-btn.active').forEach(b => b.classList.remove('active'));

        if (isActive) return; // toggle off

        btn.classList.add('active');
        const method = btn.dataset.method;
        const path = btn.dataset.path;
        const body = btn.dataset.body || '';
        const labels = btn.dataset.labels ? btn.dataset.labels.split(',') : [];
        const defaults = btn.dataset.defaults ? btn.dataset.defaults.split(',') : [];

        // Parse path into base + query
        const [basePath, queryStr] = path.split('?');
        const queryParams = queryStr ? Object.fromEntries(new URLSearchParams(queryStr)) : {};

        let paramsHtml = '';
        if (method === 'POST' && body) {
          paramsHtml = '<div class="try-params"><div class="try-param-row"><span class="try-param-label">body</span><input class="try-param-input try-body" value="' + body.replace(/"/g, '&quot;') + '"></div></div>';
        } else if (Object.keys(queryParams).length > 0) {
          paramsHtml = '<div class="try-params">';
          for (const [k, v] of Object.entries(queryParams)) {
            paramsHtml += '<div class="try-param-row"><span class="try-param-label">' + k + '</span><input class="try-param-input" data-param="' + k + '" value="' + v + '"></div>';
          }
          paramsHtml += '</div>';
        }

        panel.innerHTML =
          '<div class="try-panel-header">' +
            '<div class="try-panel-url">' +
              '<span class="method-badge ' + method.toLowerCase() + '">' + method + '</span>' +
              '<input class="try-url-input" value="' + path + '" readonly>' +
            '</div>' +
            '<button class="try-send">Send</button>' +
          '</div>' +
          '<div class="try-panel-body">' +
            paramsHtml +
            '<div class="try-result">Click Send to make a request</div>' +
          '</div>';

        panel.classList.add('open');

        // Wire send button
        const sendBtn = panel.querySelector('.try-send');
        sendBtn.addEventListener('click', async () => {
          sendBtn.disabled = true;
          sendBtn.textContent = '...';
          const result = panel.querySelector('.try-result');
          result.textContent = 'Loading...';

          let url = basePath;
          let fetchOpts = { method };

          if (method === 'POST' && body) {
            const bodyInput = panel.querySelector('.try-body');
            fetchOpts.headers = { 'Content-Type': 'application/json' };
            fetchOpts.body = bodyInput ? bodyInput.value : body;
          } else {
            const inputs = panel.querySelectorAll('.try-param-input[data-param]');
            const params = new URLSearchParams();
            inputs.forEach(inp => { if (inp.value) params.set(inp.dataset.param, inp.value); });
            const qs = params.toString();
            if (qs) url += '?' + qs;
          }

          try {
            const res = await fetch(url, fetchOpts);
            const data = await res.json();
            const statusClass = res.ok ? 'ok' : 'err';
            result.innerHTML = '<span class="status ' + statusClass + '">' + res.status + ' ' + res.statusText + '</span>\\n' + JSON.stringify(data, null, 2);
          } catch (e) {
            result.innerHTML = '<span class="status err">Error</span>\\n' + e.message;
          }

          sendBtn.disabled = false;
          sendBtn.textContent = 'Send';
        });
      });
    });
  </script>
</body>
</html>`;

export function landingPage(c: Context) {
  return c.html(html, 200, {
    'Cache-Control': 'public, max-age=300',
  });
}
