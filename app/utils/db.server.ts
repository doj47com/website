import Database from "better-sqlite3";
import path from "path";

// Adjust if your DB is elsewhere
const dbPath = path.resolve("doj47.sqlite");
export const db = new Database(dbPath);

export function ensureSlug(slug: string) {
  const stmt = db.prepare(`INSERT OR IGNORE INTO slugs(slug) VALUES (?)`);
  stmt.run(slug);
}

export function createChunk(slug: string): number {
  const stmt = db.prepare(`INSERT INTO chunks(slug) VALUES(?) RETURNING id`);
  const result = stmt.get(slug);
  return result.id;
}

