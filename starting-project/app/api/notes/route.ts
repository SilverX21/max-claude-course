import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createNote, getNotesByUser } from "@/lib/notes";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notes = await getNotesByUser(user.id);
  return NextResponse.json(
    notes.map(({ id, title, isPublic, updatedAt }) => ({ id, title, isPublic, updatedAt }))
  );
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const note = await createNote(user.id, {
    title: body.title,
    contentJson: body.contentJson ? JSON.stringify(body.contentJson) : undefined,
  });
  return NextResponse.json(note, { status: 201 });
}
