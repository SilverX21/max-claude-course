import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getNoteById, updateNote, deleteNote } from "@/lib/notes";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [user, { id }] = await Promise.all([getCurrentUser(), params]);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await getNoteById(user.id, id);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(note);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [user, { id }, body] = await Promise.all([
    getCurrentUser(),
    params,
    request.json(),
  ]);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await updateNote(user.id, id, {
    title: body.title,
    contentJson: body.contentJson
      ? JSON.stringify(body.contentJson)
      : undefined,
  });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(note);
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const [user, { id }] = await Promise.all([getCurrentUser(), params]);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const note = await getNoteById(user.id, id);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteNote(user.id, id);
  return new NextResponse(null, { status: 204 });
}
