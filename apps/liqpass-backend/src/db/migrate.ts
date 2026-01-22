import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { pool } from './pool.js'

type MigrationRow = {
  version: string
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function ensureMigrationsTable(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
}

async function getAppliedVersions(): Promise<Set<string>> {
  const res = await pool.query<MigrationRow>('SELECT version FROM schema_migrations')
  return new Set(res.rows.map((r: MigrationRow) => r.version))
}

async function getMigrationFiles(): Promise<string[]> {
  const migrationsDir = path.join(__dirname, 'migrations')
  const entries = await fs.readdir(migrationsDir)
  return entries
    .filter(f => f.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b))
    .map(f => path.join(migrationsDir, f))
}

async function applyMigration(filePath: string): Promise<void> {
  const version = path.basename(filePath)
  const sql = await fs.readFile(filePath, 'utf8')

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    await client.query(sql)
    await client.query('INSERT INTO schema_migrations(version) VALUES ($1)', [version])
    await client.query('COMMIT')
    console.log(`Applied migration: ${version}`)
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }
}

async function main(): Promise<void> {
  await ensureMigrationsTable()
  const applied = await getAppliedVersions()
  const files = await getMigrationFiles()

  for (const f of files) {
    const v = path.basename(f)
    if (applied.has(v)) continue
    await applyMigration(f)
  }

  await pool.end()
}

main().catch(err => {
  console.error(err)
  process.exitCode = 1
})
