import { getProjectImage, getValidShare, shareCovers } from "@/lib/share";

/** A project's image for a share link: served only if the link is valid and covers that project. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string; id: string }> }) {
  const { token, id } = await params;
  const share = await getValidShare(token);
  if (!share || !/^[0-9a-f-]{36}$/i.test(id) || !(await shareCovers(share, id))) {
    return new Response("Not found", { status: 404 });
  }
  const image = await getProjectImage(id);
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(image.data, "base64"), {
    headers: {
      "Content-Type": image.mimeType ?? "application/octet-stream",
      // Short and private: a cut link should stop showing images soon.
      "Cache-Control": "private, max-age=3600",
    },
  });
}
