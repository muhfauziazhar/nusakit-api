# 🇮🇩 Nusakit API

> **Indonesian Data Validation API** — NIK, NPWP, Phone, Rupiah, Bank, Wilayah Administratif & Kode Pos.

[![Live API](https://img.shields.io/badge/API-nusakit.my.id-00b894?style=flat-square)](https://nusakit.my.id)
[![Cloudflare Workers](https://img.shields.io/badge/deploys-CF%20Workers-F6821F?style=flat-square)](https://workers.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

One API for all Indonesian data validation. Open source, free to use, powered by Cloudflare Workers.

**🔗 Live API: [nusakit.my.id](https://nusakit.my.id)**

## ✨ Features

| Module | Description |
|--------|-------------|
| 🗺️ **Wilayah** | Provinsi → Kab/Kota → Kecamatan → Desa/Kelurahan (83,762 desa, Kepmendagri 2025) |
| 📮 **Kode Pos** | Cari kode pos dari kode wilayah, atau wilayah dari kode pos |
| 🪪 **NIK** | Validasi struktural & parse KTP — extract provinsi, tanggal lahir, gender, umur |
| 📋 **NPWP** | Validasi format lama (15 digit) & baru (16 digit = NIK) |
| 📱 **Phone** | Validasi, normalisasi, deteksi operator (Telkomsel, Indosat, XL, dll) |
| 💰 **Rupiah** | Format, parse, terbilang (angka → kata bahasa Indonesia) |
| 🏦 **Bank** | Kode bank BI, search, validasi nomor rekening |
| 🧪 **Dummy** | Generator data testing — NIK, NPWP, phone yang valid secara struktur |

## 🚀 Quick Start

```bash
# Validate NIK
curl https://nusakit.my.id/v1/nik/validate?nik=3201010101900001

# Terbilang — number to Indonesian words
curl https://nusakit.my.id/v1/rupiah/terbilang?amount=1500000
# → "satu juta lima ratus ribu rupiah"

# Search wilayah
curl https://nusakit.my.id/v1/wilayah/search?q=bandung

# Find postal code for a village/kelurahan code
curl https://nusakit.my.id/v1/kodepos/wilayah/32.04.11.2001

# Reverse: which areas use postal code 40111?
curl https://nusakit.my.id/v1/kodepos/40111

# Detect phone operator
curl https://nusakit.my.id/v1/phone/operator?phone=081234567890
# → { "operator": "Telkomsel", "valid": true }

# List all banks
curl https://nusakit.my.id/v1/bank

# Generate dummy NIK for testing
curl -X POST https://nusakit.my.id/v1/dummy/nik \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'
```

## 📚 API Endpoints

### Wilayah
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/wilayah/provinces` | List all provinces |
| GET | `/v1/wilayah/provinces/:code` | Get province by code |
| GET | `/v1/wilayah/regencies/:code` | List regencies in a province |
| GET | `/v1/wilayah/districts/:code` | List districts in a regency |
| GET | `/v1/wilayah/villages/:code` | List villages in a district |
| GET | `/v1/wilayah/search?q=...` | Search any region by name |
| GET | `/v1/wilayah/lookup/:code` | Full hierarchy for a code |

### Kode Pos
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/kodepos/wilayah/:code` | Postal code for a village/kelurahan code (4-level) |
| GET | `/v1/kodepos/:postalCode` | List all areas sharing a 5-digit postal code |

### NIK
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/nik/validate` | Validate & parse NIK (JSON body: `{"nik": "..."}`) |
| GET | `/v1/nik/validate?nik=...` | Same, via query param |

### NPWP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/npwp/validate` | Validate NPWP |
| GET | `/v1/npwp/format?npwp=...` | Format NPWP to standard notation |

### Phone
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/phone/validate` | Validate & normalize phone |
| GET | `/v1/phone/operator?phone=...` | Detect carrier/operator |

### Rupiah
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/rupiah/format?amount=...` | Format number to Rp X.XXX |
| GET | `/v1/rupiah/terbilang?amount=...` | Number to Indonesian words |
| GET | `/v1/rupiah/parse?input=...` | Parse "Rp 1.500.000" → 1500000 |

### Bank
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/bank` | List all banks |
| GET | `/v1/bank/:code` | Get bank by BI code |
| POST | `/v1/bank/validate-account` | Validate account number length |

### Dummy
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v1/dummy/nik` | Generate dummy NIK(s) |
| POST | `/v1/dummy/phone` | Generate dummy phone number(s) |
| POST | `/v1/dummy/npwp` | Generate dummy NPWP(s) |

## 🛠️ Self-Host / Development

### Prerequisites
- Node.js 18+
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI
- Cloudflare account (free tier works)

### Setup

```bash
# Clone
git clone https://github.com/muhfauziazhar/nusakit-api.git
cd nusakit-api

# Install
npm install

# Create D1 database
wrangler d1 create nusakit-db
# → Copy the database_id to wrangler.toml

# Create KV namespace
wrangler kv namespace create nusakit-cache
# → Copy the id to wrangler.toml

# Apply schema
wrangler d1 execute nusakit-db --file=schema.sql --local

# Seed data (requires cahyadsn/wilayah cloned to ../cahyadsn-wilayah)
npm run build:sql
wrangler d1 execute nusakit-db --file=seed.sql --local

# (Optional) Seed kode pos (requires cahyadsn/wilayah_kodepos cloned to ../cahyadsn-wilayah_kodepos)
npm run build:kodepos
wrangler d1 execute nusakit-db --file=kodepos-seed.sql --local

# Dev server
npm run dev
# → http://localhost:8787
```

### Deploy

```bash
# Deploy to Cloudflare Workers
wrangler d1 execute nusakit-db --file=schema.sql --remote
wrangler d1 execute nusakit-db --file=seed.sql --remote
wrangler d1 execute nusakit-db --file=kodepos-seed.sql --remote  # optional, for Kode Pos
npm run deploy
```

## 📊 Data Source

| Data | Source | License |
|------|--------|---------|
| Wilayah administratif | [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah) — Kepmendagri No. 300.2.2-2138/2025 | MIT |
| Kode pos | [cahyadsn/wilayah_kodepos](https://github.com/cahyadsn/wilayah_kodepos) | MIT |
| NIK/NPWP/Phone logic | [@fauzitech/nusakit](https://github.com/muhfauziazhar/nusakit) | MIT |

## ⚠️ Disclaimer

- **NIK/NPWP validation is structural & offline.** A "valid" NIK/NPWP does not mean it's registered with Dukcapil/DJP.
- **Bank account validation checks length only.** No checksum or ownership verification.
- **Dummy data is for testing only.** Never use for real identification.
- Complies with **UU PDP No. 27/2022** — no personal data is stored or processed.

## 📄 License

MIT © [Muhammad Fauzi Azhar](https://github.com/muhfauziazhar)

## 🙏 Credits

- [cahyadsn/wilayah](https://github.com/cahyadsn/wilayah) — Indonesian administrative region data
- [Hono](https://hono.dev) — Ultrafast web framework
- [Cloudflare Workers](https://workers.cloudflare.com) — Edge computing platform
