// Minimal GoHighLevel API client for the setup scripts.
// Credentials come from the environment (GHL_PRIVATE_TOKEN, GHL_LOCATION_ID) or from a
// private env file outside the repo (GHL_ENV_FILE, default ~/.first-chimney-ghl.env).
// Never commit a token.
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const file = process.env.GHL_ENV_FILE ?? join(homedir(), '.first-chimney-ghl.env');
const fromFile = existsSync(file)
  ? Object.fromEntries(readFileSync(file, 'utf8').split(/\r?\n/).filter((l) => l && !l.startsWith('#') && l.includes('=')).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1)]))
  : {};
const TOKEN = process.env.GHL_PRIVATE_TOKEN ?? fromFile.GHL_PRIVATE_TOKEN;
export const LOC = process.env.GHL_LOCATION_ID ?? fromFile.GHL_LOCATION_ID;
if (!TOKEN || !LOC) throw new Error('Set GHL_PRIVATE_TOKEN and GHL_LOCATION_ID (or create the private env file).');

const H = { Authorization: `Bearer ${TOKEN}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };

/** GHL request with 3 attempts and a 5 s delay on 429/5xx. */
export async function ghl(method, path, body, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    const r = await fetch('https://services.leadconnectorhq.com' + path, { method, headers: H, body: body ? JSON.stringify(body) : undefined });
    const text = await r.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    if (r.ok) return data;
    if (r.status < 500 && r.status !== 429) throw new Error(`${method} ${path} -> ${r.status} ${text.slice(0, 300)}`);
    await new Promise((res) => setTimeout(res, 5000));
  }
  throw new Error(`${method} ${path} failed after ${tries} attempts`);
}
