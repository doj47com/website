import { json } from "@remix-run/node";
import { requireAuth } from '~/utils/auth.server';
import { setChunkField } from "~/utils/db.server";

export const action = async ({ params, request }) => {
  requireAuth(request);
  const id = Number(params.id);
  const url = new URL(request.url);
  const field = url.searchParams.get("field");
  const value = url.searchParams.get("value");

  if (!["ts", "title", "body"].includes(field ?? "")) {
    return json({ error: "Invalid field" }, { status: 400 });
  }

  setChunkField(id, field, value);
  return json({ ok: true });
};

