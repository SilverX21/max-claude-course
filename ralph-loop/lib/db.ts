import { Database, type SQLQueryBindings } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";

const DATA_DIR = "./data";
const DB_PATH = `${DATA_DIR}/app.db`;

let db: Database | null = null;

export function getDb(): Database {
  if (db) return db;

  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  db = new Database(DB_PATH);
  db.run("PRAGMA journal_mode=WAL");
  db.run("PRAGMA foreign_keys=ON");

  return db;
}

export function query<T>(sql: string, params: SQLQueryBindings[] = []): T[] {
  return getDb().query<T, SQLQueryBindings[]>(sql).all(...params);
}

export function get<T>(
  sql: string,
  params: SQLQueryBindings[] = []
): T | undefined {
  return getDb().query<T, SQLQueryBindings[]>(sql).get(...params) ?? undefined;
}

export function run(sql: string, params: SQLQueryBindings[] = []): void {
  getDb().run(sql, params);
}
