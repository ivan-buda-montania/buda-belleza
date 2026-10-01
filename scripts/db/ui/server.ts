/**
 * Local, read-only browser for db/eleventa.sqlite: a dashboard plus a table explorer.
 *
 *   npm run db:ui            → http://127.0.0.1:5180
 *
 * Binds to 127.0.0.1 only — the data includes costs and must not leave this machine.
 */

import { existsSync, readFileSync } from 'node:fs';
import { createServer, type ServerResponse } from 'node:http';
import { resolve } from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';

const DB_PATH = resolve('db/eleventa.sqlite');
const PAGE = resolve('scripts/db/ui/index.html');
const PORT = Number(process.env.PORT ?? 5180);
const MAX_PAGE_SIZE = 500;

if (!existsSync(DB_PATH)) {
  console.error(`${DB_PATH} not found. Run: npm run db:import -- /path/to/Database.fdb`);
  process.exit(1);
}
const db = new DatabaseSync(DB_PATH, { readOnly: true });

type Row = Record<string, SQLInputValue>;

function all(sql: string, ...params: SQLInputValue[]): Row[] {
  return db.prepare(sql).all(...params) as Row[];
}

function quote(name: string): string {
  return `"${name.replaceAll('"', '""')}"`;
}

/** Tables and views the explorer may open; anything else is rejected. */
function listObjects(): { name: string; type: string; rows: number }[] {
  return all(
    `SELECT name, type FROM sqlite_master
     WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%'
     ORDER BY type = 'table', name`,
  ).map((o) => ({
    name: String(o.name),
    type: String(o.type),
    rows: Number(all(`SELECT COUNT(*) AS n FROM ${quote(String(o.name))}`)[0].n),
  }));
}

function columnsOf(name: string): string[] {
  return all(`SELECT name FROM pragma_table_info(?)`, name).map((c) => String(c.name));
}

/** Year filter shared by every movement chart; `null` means the whole history. */
function yearClause(year: string | null): { sql: string; params: SQLInputValue[] } {
  return year && /^\d{4}$/.test(year)
    ? { sql: ' AND substr(occurred_at, 1, 4) = ?', params: [year] }
    : { sql: '', params: [] };
}

function summary(year: string | null) {
  const y = yearClause(year);
  const movements = all(
    `SELECT COUNT(*) AS movements,
            COUNT(DISTINCT product_code) AS products_moved,
            SUM(CASE WHEN type = 's' THEN quantity ELSE 0 END) AS units_out,
            SUM(product_name IS NULL) AS orphan_movements,
            MIN(occurred_at) AS first_at, MAX(occurred_at) AS last_at
     FROM inventory_movements WHERE 1 = 1${y.sql}`,
    ...y.params,
  )[0];
  const catalog = all(
    `SELECT COUNT(*) AS products, SUM(price < cost) AS below_cost,
            (SELECT price FROM products ORDER BY price LIMIT 1 OFFSET (SELECT COUNT(*) / 2 FROM products)) AS median_price
     FROM products`,
  )[0];

  return {
    years: all(
      `SELECT DISTINCT substr(occurred_at, 1, 4) AS year FROM inventory_movements ORDER BY year`,
    ).map((r) => r.year),
    kpis: { ...movements, ...catalog },
    monthlyOut: all(
      `SELECT substr(occurred_at, 1, 7) AS month, SUM(quantity) AS units
       FROM inventory_movements WHERE type = 's'${y.sql} GROUP BY month ORDER BY month`,
      ...y.params,
    ),
    byType: all(
      `SELECT ${year ? 'substr(occurred_at, 1, 7)' : 'substr(occurred_at, 1, 4)'} AS period,
              SUM(type = 's') AS s, SUM(type = 'a') AS a, SUM(type = 'e') AS e, SUM(type = 'd') AS d
       FROM inventory_movements WHERE 1 = 1${y.sql} GROUP BY period ORDER BY period`,
      ...y.params,
    ),
    topProducts: all(
      `SELECT product_code AS code, COALESCE(product_name, '(eliminado) ' || product_code) AS name,
              SUM(quantity) AS units
       FROM inventory_movements WHERE type = 's'${y.sql}
       GROUP BY product_code ORDER BY units DESC LIMIT 15`,
      ...y.params,
    ),
    departments: all(
      `SELECT COALESCE(department, '(sin departamento)') AS name, COUNT(*) AS products
       FROM products GROUP BY department_id ORDER BY products DESC`,
    ),
    priceBands: all(
      `WITH banded AS (
         SELECT CASE WHEN price < 25 THEN 0 WHEN price < 50 THEN 1 WHEN price < 100 THEN 2
                     WHEN price < 200 THEN 3 WHEN price < 500 THEN 4 WHEN price < 1000 THEN 5 ELSE 6 END AS band
         FROM products)
       SELECT band, COUNT(*) AS products FROM banded GROUP BY band ORDER BY band`,
    ),
  };
}

function rows(params: URLSearchParams) {
  const name = params.get('name') ?? '';
  if (!listObjects().some((o) => o.name === name))
    throw new HttpError(404, `Unknown table ${name}`);
  const columns = columnsOf(name);

  const q = params.get('q')?.trim();
  const where = q
    ? `WHERE ${columns.map((c) => `CAST(${quote(c)} AS TEXT) LIKE ?`).join(' OR ')}`
    : '';
  const whereParams: SQLInputValue[] = q ? columns.map(() => `%${q}%`) : [];

  const sort = params.get('sort');
  const order =
    sort && columns.includes(sort)
      ? `ORDER BY ${quote(sort)} ${params.get('dir') === 'desc' ? 'DESC' : 'ASC'}`
      : '';
  const limit = Math.min(Number(params.get('limit')) || 50, MAX_PAGE_SIZE);
  const offset = Math.max(Number(params.get('offset')) || 0, 0);

  const total = Number(
    all(`SELECT COUNT(*) AS n FROM ${quote(name)} ${where}`, ...whereParams)[0].n,
  );
  const page = all(
    `SELECT * FROM ${quote(name)} ${where} ${order} LIMIT ? OFFSET ?`,
    ...whereParams,
    limit,
    offset,
  );
  return { columns, total, rows: page.map((r) => columns.map((c) => cell(r[c]))) };
}

function cell(value: SQLInputValue): string | number | null {
  if (value instanceof Uint8Array) return `<blob ${value.byteLength} bytes>`;
  if (typeof value === 'bigint') return Number(value);
  return value as string | number | null;
}

class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function send(res: ServerResponse, status: number, body: string, type: string): void {
  res.writeHead(status, { 'content-type': type, 'cache-control': 'no-store' });
  res.end(body);
}

createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  try {
    if (url.pathname === '/')
      return send(res, 200, readFileSync(PAGE, 'utf8'), 'text/html; charset=utf-8');
    if (url.pathname === '/api/objects')
      return send(res, 200, JSON.stringify(listObjects()), 'application/json');
    if (url.pathname === '/api/summary')
      return send(
        res,
        200,
        JSON.stringify(summary(url.searchParams.get('year'))),
        'application/json',
      );
    if (url.pathname === '/api/rows')
      return send(res, 200, JSON.stringify(rows(url.searchParams)), 'application/json');
    throw new HttpError(404, 'Not found');
  } catch (err) {
    const status = err instanceof HttpError ? err.status : 500;
    send(res, status, JSON.stringify({ error: (err as Error).message }), 'application/json');
  }
}).listen(PORT, '127.0.0.1', () => {
  console.log(`eleventa data browser → http://127.0.0.1:${PORT}`);
});
