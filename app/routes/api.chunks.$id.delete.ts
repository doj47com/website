import { redirect } from "@remix-run/node";
import { requireAuth } from '~/utils/auth.server';
import { deleteChunk } from "~/utils/db.server";

export const action = async ({ params }) => {
  const id = Number(params.id);
  const slug = deleteChunk(id);
  return redirect("/" + slug);
};

