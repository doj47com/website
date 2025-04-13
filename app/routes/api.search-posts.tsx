import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import Database from "better-sqlite3";
import path from "path";

// Adjust if your DB is elsewhere
const dbPath = path.resolve("doj47.sqlite");
const db = new Database(dbPath, { readonly: true });

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    return json({ results: [] });
  }

  const stmt = db.prepare(`
    SELECT json
    FROM posts
    WHERE json LIKE ?
    LIMIT 10
  `);
  const likePattern = `%${q.replace(/[%_]/g, "\\$&")}%`; // escape % and _

  const rows = stmt.all(likePattern);

  // Optionally parse JSON if stored as strings
  const results = rows.map(row => {
    try {
      return JSON.parse(row.json);
    } catch {
      return row.json;
    }
  });

  return json({ results });
}
