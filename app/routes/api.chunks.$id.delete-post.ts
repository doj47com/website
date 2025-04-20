import { json } from "@remix-run/node";
import { requireAuth } from '~/utils/auth.server';
import { deletePostFromChunk } from "~/utils/db.server";

export const action = async ({ params, request }) => {
  requireAuth(request);
  const id = Number(params.id);
  const url = new URL(request.url);
  const postUri = url.searchParams.get("uri");

  deletePostFromChunk(id, postUri);
  return json({ ok: true });
};

