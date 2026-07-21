import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifySession } from "@/lib/dal";
import { db } from "@/db";
import { projects } from "@/db/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await verifySession();
  const { id } = await params;

  const [row] = await db
    .select({ imageData: projects.imageData, imageMimeType: projects.imageMimeType })
    .from(projects)
    .where(eq(projects.id, id))
    .limit(1);

  if (!row?.imageData) {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(Buffer.from(row.imageData, "base64"), {
    headers: {
      "Content-Type": row.imageMimeType || "application/octet-stream",
      "Cache-Control": "private, max-age=60",
    },
  });
}
