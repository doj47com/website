import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from '~/utils/auth.server';
import { json } from "@remix-run/node";
import { db } from '~/utils/db.server';

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
  const handle = url.searchParams.get("handle")?.trim();
  const after = url.searchParams.get("after")?.trim();
  const before = url.searchParams.get("before")?.trim();
  const offset = url.searchParams.get("offset")?.trim() || '0';
  const sort = url.searchParams.get("sort")?.trim() || 'DESC';
  const replies = url.searchParams.get("replies")?.trim() || '0';
  const likes = url.searchParams.get("likes")?.trim() || '0';
  const reposts = url.searchParams.get("reposts")?.trim() || '0';
  const quotes = url.searchParams.get("quotes")?.trim() || '0';

  /*
  if (!q) {
    return json({ results: [] });
  }
   */

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

  const atUrlRe = /^at:[/][/].*[/]app[.]bsky[.]feed[.]post[/]/;
  if (atUrlRe.test(q)) {
    return search(`SELECT json FROM posts WHERE uri = ?`, q);
  }

  const whereClauses = [];
  const whereParams = [];

  if (q) {
    const likePattern = `%${q.replace(/[%_]/g, "\\$&")}%`; // escape % and _
    whereClauses.push(`JSON LIKE ?`);
    whereParams.push(likePattern);
  }

  if (handle) {
    whereClauses.push(`handle = ?`);
    whereParams.push(handle);
  }

  if (after) {
    whereClauses.push('created_at >= ?');
    whereParams.push(after);
  }

  if (before) {
    whereClauses.push('created_at < ?');
    whereParams.push(before);
  }

  if (replies === '0') {
    whereClauses.push('(is_reply = 0 OR is_reply_to_self = 1)');
  }

  if (likes > 0) {
    whereClauses.push('likes >= ?');
    whereParams.push(likes);
  }

  if (reposts > 0) {
    whereClauses.push('reposts >= ?');
    whereParams.push(reposts);
  }

  if (quotes > 0) {
    whereClauses.push('quotes >= ?');
    whereParams.push(quotes);
  }

  const where = whereClauses.length === 0 ? '' : `WHERE ${whereClauses.join(' AND ')}`;
  return search(
    `SELECT json FROM posts ${where} ORDER BY created_at ${sort} LIMIT 100 OFFSET ${offset}`,
    ...whereParams
  );
}
