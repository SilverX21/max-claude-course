import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { setNotePublic } from "@/lib/notes";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [user, { id }, { isPublic }] = await Promise.all([
    getCurrentUser(),
    params,
    request.json(),
  ]);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await setNotePublic(user.id, id, isPublic);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    id: note.id,
    isPublic: note.isPublic,
    publicSlug: note.publicSlug,
  });
}
