/**
 * Imports an eleventa POS database (Firebird 2.5 `.fdb`) into a local SQLite file.
 *
 *   npm run db:import -- /path/to/Database.fdb
 *
 * Firebird 2.5 runs in a throwaway Docker container against a temporary copy of the
 * file, so the original is never opened. Every user table is mirrored as `raw_<table>`
 * with its original column names; `db/views.sql` then adds cleaned views on top.
 * The output is rebuilt from scratch on each run and swapped in atomically.
 */

// Firebird timestamps carry no zone. Running in UTC makes the driver's local-time Dates
// round-trip to the exact wall-clock value the POS stored, with no DST gaps.
process.env.TZ = 'UTC';

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join, resolve } from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { setTimeout as sleep } from 'node:timers/promises';
import { attachAsync, type Database } from 'node-firebird';

const FIREBIRD_IMAGE = 'jacobalberty/firebird:2.5-ss';
const FIREBIRD_PASSWORD = 'masterkey'; // throwaway container, never exposed beyond 127.0.0.1
const OUTPUT = resolve('db/eleventa.sqlite');
const VIEWS = resolve('db/views.sql');

/** Columns that never leave the POS. */
const EXCLUDED_COLUMNS = new Set(['USUARIOS.CLAVE']);

type Kind = 'int' | 'real' | 'float32' | 'date' | 'time' | 'timestamp' | 'char' | 'text' | 'blob';

interface Column {
  name: string;
  kind: Kind;
}

interface Table {
  name: string;
  columns: Column[];
}

const SQLITE_TYPE: Record<Kind, string> = {
  int: 'INTEGER',
  real: 'REAL',
  float32: 'REAL',
  date: 'TEXT',
  time: 'TEXT',
  timestamp: 'TEXT',
  char: 'TEXT',
  text: 'TEXT',
  blob: 'BLOB',
};

/** Maps an `RDB$FIELDS.RDB$FIELD_TYPE` code to how the value is stored in SQLite. */
function kindOf(type: number, scale: number, subType: number | null): Kind {
  switch (type) {
    case 7: // SMALLINT
    case 8: // INTEGER
      return 'int';
    case 16: // BIGINT, or NUMERIC/DECIMAL when scaled
      return scale < 0 ? 'real' : 'int';
    case 10: // FLOAT (single precision)
      return 'float32';
    case 27: // DOUBLE PRECISION
      return 'real';
    case 12:
      return 'date';
    case 13:
      return 'time';
    case 35:
      return 'timestamp';
    case 14: // CHAR, space padded
      return 'char';
    case 37: // VARCHAR
      return 'text';
    case 261:
      return subType === 1 ? 'text' : 'blob';
    default:
      throw new Error(`Unsupported Firebird field type ${type}`);
  }
}

function sqliteName(name: string): string {
  return `"${name.toLowerCase()}"`;
}

/** Reads a binary BLOB through the driver's fetch function. */
function readBlob(fetch: (callback: (...args: unknown[]) => void) => void): Promise<Buffer> {
  return new Promise((done, fail) => {
    fetch((err, _name, emitter) => {
      if (err) return fail(err);
      const events = emitter as NodeJS.EventEmitter;
      const chunks: Buffer[] = [];
      events.on('data', (chunk: Buffer) => chunks.push(chunk));
      events.on('end', () => done(Buffer.concat(chunks)));
      events.on('error', fail);
    });
  });
}

async function convert(value: unknown, kind: Kind): Promise<SQLInputValue> {
  if (value === null || value === undefined) return null;
  switch (kind) {
    case 'float32':
      // Drop the float32 → float64 noise (29.5 stays 29.5, 0.1 does not become 0.100000001).
      return Number((value as number).toPrecision(7));
    case 'date':
      return (value as Date).toISOString().slice(0, 10);
    case 'time':
      return (value as Date).toISOString().slice(11, 19);
    case 'timestamp':
      return (value as Date).toISOString().slice(0, 19).replace('T', ' ');
    case 'char':
      return (value as string).trimEnd();
    case 'blob':
      return typeof value === 'function'
        ? readBlob(value as Parameters<typeof readBlob>[0])
        : (value as Buffer);
    default:
      return value as SQLInputValue;
  }
}

async function readSchema(db: Database): Promise<Table[]> {
  const rows = await db.queryAsync<{
    TBL: string;
    COL: string;
    FTYPE: number;
    FSCALE: number;
    FSUB: number | null;
  }>(`
    SELECT TRIM(rf.RDB$RELATION_NAME) AS TBL, TRIM(rf.RDB$FIELD_NAME) AS COL,
           f.RDB$FIELD_TYPE AS FTYPE, f.RDB$FIELD_SCALE AS FSCALE, f.RDB$FIELD_SUB_TYPE AS FSUB
    FROM RDB$RELATION_FIELDS rf
    JOIN RDB$FIELDS f ON f.RDB$FIELD_NAME = rf.RDB$FIELD_SOURCE
    JOIN RDB$RELATIONS r ON r.RDB$RELATION_NAME = rf.RDB$RELATION_NAME
    WHERE r.RDB$SYSTEM_FLAG = 0 AND r.RDB$VIEW_BLR IS NULL
    ORDER BY rf.RDB$RELATION_NAME, rf.RDB$FIELD_POSITION`);

  const tables = new Map<string, Table>();
  for (const row of rows) {
    if (EXCLUDED_COLUMNS.has(`${row.TBL}.${row.COL}`)) continue;
    const table = tables.get(row.TBL) ?? { name: row.TBL, columns: [] };
    table.columns.push({ name: row.COL, kind: kindOf(row.FTYPE, row.FSCALE, row.FSUB) });
    tables.set(row.TBL, table);
  }
  return [...tables.values()];
}

async function copyTable(db: Database, sqlite: DatabaseSync, table: Table): Promise<number> {
  const target = sqliteName(`raw_${table.name}`);
  const columns = table.columns.map((c) => sqliteName(c.name));
  sqlite.exec(
    `CREATE TABLE ${target} (${table.columns.map((c, i) => `${columns[i]} ${SQLITE_TYPE[c.kind]}`).join(', ')})`,
  );

  const rows = await db.queryAsync<Record<string, unknown>>(
    `SELECT ${table.columns.map((c) => `"${c.name}"`).join(', ')} FROM "${table.name}"`,
  );
  const insert = sqlite.prepare(
    `INSERT INTO ${target} (${columns.join(', ')}) VALUES (${columns.map(() => '?').join(', ')})`,
  );
  sqlite.exec('BEGIN');
  for (const row of rows) {
    insert.run(...(await Promise.all(table.columns.map((c) => convert(row[c.name], c.kind)))));
  }
  sqlite.exec('COMMIT');
  return rows.length;
}

/**
 * The image boots Firebird once to set the SYSDBA password, kills it, then starts it for
 * real. Connecting during that first boot fails with an uncatchable "Connection shutdown",
 * so wait for the image's own healthcheck instead.
 */
async function waitForServer(container: string): Promise<void> {
  for (let attempt = 1; ; attempt++) {
    if (docker('inspect', '-f', '{{.State.Health.Status}}', container) === 'healthy') return;
    if (attempt >= 60) throw new Error('Firebird container did not become healthy');
    await sleep(500);
  }
}

/** Waits for the server to accept connections. */
async function connect(port: number): Promise<Database> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await attachAsync({
        host: '127.0.0.1',
        port,
        database: '/data/source.fdb',
        user: 'SYSDBA',
        password: FIREBIRD_PASSWORD,
        // The eleventa database has charset NONE; its bytes are Windows-1252 text.
        encoding: 'WIN1252',
        blobAsText: true,
      });
    } catch (err) {
      if (attempt >= 30) throw err;
      await sleep(1000);
    }
  }
}

function docker(...args: string[]): string {
  return execFileSync('docker', args, { encoding: 'utf8' }).trim();
}

async function main(): Promise<void> {
  const sourceArg = process.argv[2];
  if (!sourceArg) {
    console.error('Usage: npm run db:import -- /path/to/Database.fdb');
    process.exit(1);
  }
  const source = resolve(sourceArg);
  if (!existsSync(source)) throw new Error(`File not found: ${source}`);

  const sourceBytes = readFileSync(source);
  const sha256 = createHash('sha256').update(sourceBytes).digest('hex');

  // The container runs Firebird as its own user, so the copy must be world-writable.
  const workdir = mkdtempSync(join(tmpdir(), 'eleventa-'));
  chmodSync(workdir, 0o777);
  copyFileSync(source, join(workdir, 'source.fdb'));
  chmodSync(join(workdir, 'source.fdb'), 0o666);

  const container = `eleventa-import-${process.pid}`;
  const partial = `${OUTPUT}.partial`;
  try {
    console.log(`Starting ${FIREBIRD_IMAGE}…`);
    docker(
      'run', '-d', '--rm', '--name', container,
      '-e', `ISC_PASSWORD=${FIREBIRD_PASSWORD}`,
      '-p', '127.0.0.1::3050',
      '--health-interval', '1s',
      '-v', `${workdir}:/data`,
      FIREBIRD_IMAGE,
    ); // prettier-ignore
    const port = Number(docker('port', container, '3050/tcp').split('\n')[0].split(':').pop());

    await waitForServer(container);
    const db = await connect(port);
    const tables = await readSchema(db);

    rmSync(partial, { force: true });
    const sqlite = new DatabaseSync(partial);
    sqlite.exec(`
      CREATE TABLE import_run (imported_at TEXT, source_file TEXT, source_sha256 TEXT, source_bytes INTEGER);
      CREATE TABLE import_tables (source_table TEXT PRIMARY KEY, sqlite_table TEXT, row_count INTEGER);`);

    for (const table of tables) {
      const count = await copyTable(db, sqlite, table);
      sqlite
        .prepare('INSERT INTO import_tables VALUES (?, ?, ?)')
        .run(table.name, `raw_${table.name.toLowerCase()}`, count);
      console.log(`  ${table.name.padEnd(28)} ${String(count).padStart(7)} rows`);
    }
    await db.detachAsync();

    sqlite.exec(readFileSync(VIEWS, 'utf8'));
    sqlite
      .prepare('INSERT INTO import_run VALUES (?, ?, ?, ?)')
      .run(new Date().toISOString(), basename(source), sha256, sourceBytes.length);
    sqlite.close();
    renameSync(partial, OUTPUT);
    console.log(`Wrote ${OUTPUT}`);
  } finally {
    try {
      docker('rm', '-f', container);
    } catch {
      // container never started
    }
    rmSync(workdir, { recursive: true, force: true });
    rmSync(partial, { force: true });
  }
}

await main();
