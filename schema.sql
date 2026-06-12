/**
 * D1 Database Schema for nusakit-api
 * Run: wrangler d1 execute nusakit-db --file=schema.sql
 */

-- Provinces (38 total)
CREATE TABLE IF NOT EXISTS provinces (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_provinces_name ON provinces(name);

-- Regencies / Kabupaten-Kota (~514)
CREATE TABLE IF NOT EXISTS regencies (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province_code TEXT NOT NULL,
  FOREIGN KEY (province_code) REFERENCES provinces(code)
);
CREATE INDEX IF NOT EXISTS idx_regencies_province ON regencies(province_code);
CREATE INDEX IF NOT EXISTS idx_regencies_name ON regencies(name);

-- Districts / Kecamatan (~7,285)
CREATE TABLE IF NOT EXISTS districts (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  regency_code TEXT NOT NULL,
  FOREIGN KEY (regency_code) REFERENCES regencies(code)
);
CREATE INDEX IF NOT EXISTS idx_districts_regency ON districts(regency_code);
CREATE INDEX IF NOT EXISTS idx_districts_name ON districts(name);

-- Villages / Desa-Kelurahan (~83,762)
CREATE TABLE IF NOT EXISTS villages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district_code TEXT NOT NULL,
  FOREIGN KEY (district_code) REFERENCES districts(code)
);
CREATE INDEX IF NOT EXISTS idx_villages_district ON villages(district_code);
CREATE INDEX IF NOT EXISTS idx_villages_name ON villages(name);
