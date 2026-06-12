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
      transform: translateY(-2px);
    }


    .feature-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .feature-card p {
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
      padding: 4px 0;
      color: var(--text-dim);
    }

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

    /* ─── Playground ─── */
    .playground {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      max-width: 800px;
      margin: 0 auto;
    }

    .playground h3 {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }

    .pg-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }

    .pg-select, .pg-input {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 10px 14px;
      color: var(--text);
      font-family: var(--mono);
      font-size: 14px;
    }

    .pg-select { min-width: 200px; }
    .pg-input { flex: 1; }

    .pg-select:focus, .pg-input:focus {
      outline: none;
      border-color: var(--accent);
    }

    .pg-btn {
      padding: 10px 20px;
      background: var(--accent);
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .pg-btn:hover { background: var(--accent-light); }

    .pg-result {
      margin-top: 16px;
      background: #0d1117;
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 16px;
      font-family: var(--mono);
      font-size: 13px;
      min-height: 80px;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      color: var(--text-dim);
    }

    .pg-status {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .pg-status-200 { background: rgba(16, 185, 129, 0.2); color: var(--green); }
    .pg-status-400 { background: rgba(239, 68, 68, 0.2); color: var(--red); }

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
      .pg-row { flex-direction: column; }
      .stats { gap: 24px; }
      .features-grid { grid-template-columns: 1fr; }
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
      <p>Satu API untuk semua validasi data Indonesia. NIK, NPWP, Nomor HP, Rupiah, Bank, Wilayah Administratif — dari provinsi sampai desa.</p>
      <div class="hero-actions">
        <a href="#playground" class="btn btn-primary">Try It Out</a>
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
          
          <h3>Wilayah Administratif</h3>
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
          
          <h3>NIK (KTP)</h3>
          <p>Validasi struktural & parse NIK. Extract provinsi, tanggal lahir, gender, umur.</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/nik/validate</li>
            <li><span class="method method-get">GET</span> /v1/nik/validate?nik=...</li>
          </ul>
        </div>

        <!-- NPWP -->
        <div class="feature-card">
          
          <h3>NPWP</h3>
          <p>Validasi NPWP format lama (15 digit) dan baru (16 digit = NIK).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/npwp/validate</li>
            <li><span class="method method-get">GET</span> /v1/npwp/format?npwp=...</li>
          </ul>
        </div>

        <!-- Phone -->
        <div class="feature-card">
          
          <h3>Nomor HP</h3>
          <p>Validasi, normalisasi, dan deteksi operator (Telkomsel, Indosat, XL, dll).</p>
          <ul class="endpoint-list">
            <li><span class="method method-post">POST</span> /v1/phone/validate</li>
            <li><span class="method method-get">GET</span> /v1/phone/operator?phone=...</li>
          </ul>
        </div>

        <!-- Rupiah -->
        <div class="feature-card">
          
          <h3>Rupiah</h3>
          <p>Format, parse, dan terbilang (angka → kata bahasa Indonesia).</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span> /v1/rupiah/format?amount=...</li>
            <li><span class="method method-get">GET</span> /v1/rupiah/terbilang?amount=...</li>
            <li><span class="method method-get">GET</span> /v1/rupiah/parse?input=...</li>
          </ul>
        </div>

        <!-- Bank -->
        <div class="feature-card">
          
          <h3>Bank</h3>
          <p>Kode bank BI, cari bank, validasi nomor rekening struktural.</p>
          <ul class="endpoint-list">
            <li><span class="method method-get">GET</span> /v1/bank</li>
            <li><span class="method method-get">GET</span> /v1/bank/:code</li>
            <li><span class="method method-post">POST</span> /v1/bank/validate-account</li>
          </ul>
        </div>

        <!-- Dummy -->
        <div class="feature-card">
          
          <h3>Dummy Generator</h3>
          <p>Generate data dummy untuk testing. NIK, NPWP, nomor HP yang valid secara struktur.</p>
          <ul class="endpoint-list">
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
        // Set default body based on URL
        const url = urlEl.value;
        if (url.includes('nik')) bodyEl.value = JSON.stringify({ nik: '3201010101900001' });
        else if (url.includes('npwp')) bodyEl.value = JSON.stringify({ npwp: '012345678901234' });
        else if (url.includes('phone')) bodyEl.value = JSON.stringify({ phone: '081234567890' });
        else bodyEl.value = '{}';
      }
    });

    // Preset URLs
    const presets = {
      'GET': '/v1/rupiah/terbilang?amount=1500000',
      'POST': '/v1/nik/validate'
    };

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

    // Enter key
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
