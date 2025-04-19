import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from '../utils/auth.server';
import { json } from "@remix-run/node";
import Database from "better-sqlite3";
import path from "path";

// Adjust if your DB is elsewhere
const dbPath = path.resolve("doj47.sqlite");
const db = new Database(dbPath, { readonly: true });

export async function resolveHandleToDID(handle: string): Promise<string | null> {
  const url = `https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=${encodeURIComponent(handle)}`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`Failed to resolve handle: ${res.status}`);
      return null;
    }

    const data = await res.json();

    if (data.did) {
      return data.did as string;
    } else {
      console.warn(`No DID found in response for handle ${handle}`);
      return null;
    }
  } catch (err) {
    console.error(`Error resolving handle '${handle}':`, err);
    return null;
  }
}

function search(query: string, ...params: unknown[]) {
  const stmt = db.prepare(query);
  const rows = stmt.all(...params);

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

export async function loader({ request }: LoaderFunctionArgs) {
  requireAuth(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim();

  if (!q) {
    return json({ results: [] });
  }

  const bskyUrlRe = /^https:[/][/]bsky[.]app[/]profile[/]([^/]+)[/]post[/]([0-9a-z]+)$/;
  const m = bskyUrlRe.exec(q);

  if (m) {
    const profile = m[1];
    const rkey = m[2];

    let did = profile;
    // If profile is not a did, we'll need to translate it using
    // https://bsky.social/xrpc/com.atproto.identity.resolveHandle?handle=cldellow.com
    if (!profile.startsWith('did:'))
      did = await resolveHandleToDID(profile);

    const uri = `at://${did}/app.bsky.feed.post/${rkey}`;
    return search(`SELECT json FROM posts WHERE uri = ?`, uri);
  }

  const likePattern = `%${q.replace(/[%_]/g, "\\$&")}%`; // escape % and _
  return search(`SELECT json FROM posts WHERE json LIKE ? LIMIT 10`, likePattern);
}
