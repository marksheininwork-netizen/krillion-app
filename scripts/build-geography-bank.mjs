import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const source = 'https://download.geonames.org/export/dump/cities5000.zip';
const response = await fetch(source, { headers: { 'user-agent': 'Krillion/1.0 (question-bank build)' } });
if (!response.ok) throw new Error(\`GeoNames download failed: HTTP \${response.status}\`);

const dir = mkdtempSync(join(tmpdir(), 'krillion-geonames-'));
try {
  const archive = join(dir, 'cities5000.zip');
  writeFileSync(archive, Buffer.from(await response.arrayBuffer()));
  const text = execFileSync('unzip', ['-p', archive, 'cities5000.txt'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024
  });
  const normalize = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const rows = text.split(/\r?\n/).filter(Boolean).map(line => line.split('\t'));
  const seen = new Set();
  const cities = rows
    .filter(row => row[6] === 'P' && Number(row[14]) > 5000 && row[1])
    .sort((a, b) => Number(b[14]) - Number(a[14]))
    .filter(row => {
      const key = normalize(row[1]);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 5000);
  if (cities.length < 5000) throw new Error(\`Expected 5,000 unique cities, found \${cities.length}\`);

  const answers = cities.map((row, index) => {
    const rarity = index < 8 ? 10 : index === 4999 ? 95 : index < 1500 ? 35 : index < 3000 ? 52 : 72;
    const aliases = row[2] && normalize(row[2]) !== normalize(row[1]) ? [row[2]] : [];
    return aliases.length ? [row[1], rarity, aliases] : [row[1], rarity];
  });
  const bank = JSON.parse(readFileSync('prompts.json', 'utf8'));
  const cityPrompt = {
    id: 'cities',
    title: 'Major cities with more than 5,000 residents',
    hint: 'Type a city from the GeoNames cities5000 list',
    source,
    answers
  };
  const existing = bank.findIndex(item => item.id === 'cities');
  if (existing >= 0) bank[existing] = cityPrompt;
  else bank.push(cityPrompt);
  writeFileSync('prompts.json', JSON.stringify(bank, null, 2) + '\n');
  console.log(\`Built \${answers.length} sourced city answers; 8 Plankton and 1 One in a Krillion.\`);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
