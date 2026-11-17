import express from 'express';
import fs from 'fs';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const PORT = Number(process.env.PORT) || 3000;
const CSV_PATH = path.resolve(process.cwd(), 'personality_results.csv');

interface RankedEntry {
  name: string;
  score: number;
}

interface ParsedRow {
  id: string;
  userName: string;
  timestamp: string;
  ranked: RankedEntry[];
}

function normalizeName(raw: unknown): string {
  if (typeof raw !== 'string') return 'Guest';
  const trimmed = raw.trim().slice(0, 30);
  return trimmed.length === 0 ? 'Guest' : trimmed;
}

function formatTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      fields.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  fields.push(current);
  return fields;
}

function readCSVRows(): ParsedRow[] {
  if (!fs.existsSync(CSV_PATH)) {
    return [];
  }
  const content = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const rows: ParsedRow[] = [];
  for (let idx = 0; idx < lines.length; idx += 1) {
    const cols = parseCSVLine(lines[idx]);
    if (cols.length < 10) continue;
    const ranked: RankedEntry[] = [];
    for (let t = 0; t < 4; t += 1) {
      ranked.push({
        name: cols[2 + t * 2],
        score: Number.parseInt(cols[3 + t * 2], 10) || 0,
      });
    }
    rows.push({
      id: `row-${idx + 1}`,
      userName: cols[0] || 'Guest',
      timestamp: cols[1],
      ranked,
    });
  }
  return rows;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.get('/api/results', (_req, res) => {
    try {
      const rows = readCSVRows().reverse();
      res.json({ rows });
    } catch (error) {
      console.error('Failed to read CSV:', error);
      res.status(500).json({ error: 'Unable to read personality_results.csv' });
    }
  });

  app.post('/api/results', (req, res) => {
    try {
      const body = req.body as {
        userName?: unknown;
        ranked?: unknown;
      };
      if (!Array.isArray(body?.ranked) || body.ranked.length !== 4) {
        res.status(400).json({ error: 'ranked must contain 4 trait score entries' });
        return;
      }

      const validTraits = new Set(['Introvert', 'Extrovert', 'Leader', 'Creative']);
      const ranked: RankedEntry[] = [];
      let total = 0;

      for (const item of body.ranked) {
        if (
          !item ||
          typeof item !== 'object' ||
          typeof (item as RankedEntry).name !== 'string' ||
          !validTraits.has((item as RankedEntry).name) ||
          typeof (item as RankedEntry).score !== 'number' ||
          !Number.isInteger((item as RankedEntry).score) ||
          (item as RankedEntry).score < 0 ||
          (item as RankedEntry).score > 60
        ) {
          res.status(400).json({ error: 'Invalid trait score entry' });
          return;
        }
        const entry = item as RankedEntry;
        total += entry.score;
        ranked.push({ name: entry.name, score: entry.score });
      }

      if (total < 20 || total > 60) {
        res.status(400).json({ error: 'Total score across 4 traits must be between 20 and 60' });
        return;
      }

      const userName = normalizeName(body.userName);
      const safeName = userName.replace(/"/g, '""');
      const timestamp = formatTimestamp(new Date());
      const cols = [`"${safeName}"`, timestamp];
      for (const entry of ranked) {
        cols.push(entry.name, String(entry.score));
      }
      const line = `${cols.join(',')}\n`;
      fs.appendFileSync(CSV_PATH, line, 'utf8');

      const allRows = readCSVRows();
      const savedRow: ParsedRow = {
        id: `row-${allRows.length}`,
        userName,
        timestamp,
        ranked,
      };

      res.status(201).json({ saved: true, row: savedRow });
    } catch (error) {
      console.error('Failed to save CSV:', error);
      res.status(500).json({ error: 'Could not write to personality_results.csv' });
    }
  });

  app.get('/api/results/csv', (_req, res) => {
    const content = fs.existsSync(CSV_PATH) ? fs.readFileSync(CSV_PATH, 'utf8') : '';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="personality_results.csv"');
    res.send(content);
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
        hmr: hmrDisabled ? false : { server: httpServer },
        ws: { server: httpServer },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}

startServer();
