// app/utils/auth.server.ts

import { redirect, json } from "@remix-run/node";

export function requireAuth(request: Request): void {
  const cookieHeader = request.headers.get("cookie");
  const cookies = Object.fromEntries(
    (cookieHeader || "")
      .split(";")
      .map(c => c.trim().split("=").map(decodeURIComponent))
  );

  const cookieSecret = cookies["doj47"];
  const requiredSecret = process.env.DOJ47_SECRET;

  if (!requiredSecret || cookieSecret !== requiredSecret) {
    throw new Response("Unauthorized", { status: 401, statusText: `unknown secret: ${cookieSecret}` });
  }
}

