import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { ensureSlug, createChunk } from "~/utils/db.server"; // adjust this path to your db module

export const action: ActionFunction = async ({ request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (typeof slug === 'undefined') {
    throw new Response("Missing slug", { status: 400 });
  }

  ensureSlug(slug);
  const id = createChunk(slug);
  return redirect(`/chunks/${id}`);
};

export const loader = () => {
  throw new Response("Method Not Allowed", { status: 405 });
};
