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

export function getChunk(id: number) {
  const stmt = db.prepare(`SELECT * FROM chunks WHERE id = ?`);
  const result = stmt.get(id);
  return result;
}

export function setChunkField(id: number, field: string, value: string) {
  const stmt = db.prepare(`UPDATE chunks SET ${field} = ? WHERE id = ?`);
  stmt.run(value, id);
}

export function deleteChunk(id: number): string {
  {
    const stmt = db.prepare(`DELETE FROM chunk_tweets WHERE chunk_id = ?`);
    stmt.run(id);
  }

  const stmt = db.prepare(`DELETE FROM chunks WHERE id = ? RETURNING slug`);
  const result = stmt.get(id);
  return result.slug;
}
