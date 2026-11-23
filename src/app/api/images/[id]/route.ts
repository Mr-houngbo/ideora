import { NextResponse } from "next/server";
import { getSessionCookie, verifySessionToken } from "@/lib/session";
import { getProjectImage } from "@/lib/projects";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  // The proxy already guards this path; checked again here so the image
  // stays private even if the proxy is ever bypassed.
  if (!(await verifySessionToken(await getSessionCookie()))) {
    return new NextResponse(null, { status: 401 });
  }

  const { id } = await ctx.params;
  if (!UUID_RE.test(id)) {
    return new NextResponse(null, { status: 404 });
  }

  const image = await getProjectImage(id);
  if (!image) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.mimeType || "application/octet-stream",
      // URLs carry a content fingerprint (?v=), so a changed image gets a new
      // URL; the browser can keep this one indefinitely. Private: the app is
      // behind a login, so shared caches must not store it.
      "Cache-Control": "private, max-age=31536000, immutable",
    },
  });
}
