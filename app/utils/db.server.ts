import Database from "better-sqlite3";
import path from "path";
import type { Chunk, ChunkPost } from './types';

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

export function getChunksBySlug(slug: string): Chunk[] {
  // Get each chunk, then also get each tweet.
  const rows = db.prepare(`
    SELECT
      c.id AS chunkId,
      c.slug,
      c.ts,
      c.title,
      c.body,
      cp.post_uri AS postUri,
      cp.is_live_tweet AS liveTweet,
      cp.is_news_link AS newsLink,
      p.json AS postJson
    FROM chunks c
    LEFT JOIN chunk_posts cp ON cp.chunk_id = c.id
    LEFT JOIN posts p ON cp.post_uri = p.uri
    WHERE c.slug = ?
    ORDER BY c.ts ASC, cp.rowid ASC
  `).all(slug);

  const chunksById = new Map<number, Chunk>();

  for (const row of rows) {
    let chunk = chunksById.get(row.chunkId);

    if (!chunk) {
      chunk = {
        id: row.chunkId,
        slug: row.slug,
        ts: row.ts,
        title: row.title,
        body: row.body,
        posts: [],
      };
      chunksById.set(row.chunkId, chunk);
    }

    if (row.postUri) {
      const post: ChunkPost = {
        chunkId: row.chunkId,
        postUri: row.postUri,
        liveTweet: !!row.liveTweet,
        newsLink: !!row.newsLink,
        post: JSON.parse(row.postJson ?? "null"),
      };
      chunk.posts.push(post);
    }
  }

  return Array.from(chunksById.values());
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
