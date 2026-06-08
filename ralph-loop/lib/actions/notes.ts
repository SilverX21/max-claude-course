"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import {
  createNote,
  deleteNote,
  setNotePublic,
  updateNote,
} from "@/lib/notes";

const updateNoteSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  contentJson: z.string().optional(),
});

export async function createNoteAction() {
  const session = await requireAuth();
  const note = await createNote(session.user.id);
  return { note };
}

export async function updateNoteAction(
  noteId: string,
  data: { title?: string; contentJson?: string }
) {
  const session = await requireAuth();
  const parsed = updateNoteSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  const note = await updateNote(session.user.id, noteId, parsed.data);
  if (!note) {
    return { error: "Note not found" };
  }

  revalidatePath(`/notes/${noteId}`);
  return { note };
}

export async function deleteNoteAction(noteId: string) {
  const session = await requireAuth();
  await deleteNote(session.user.id, noteId);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleShareAction(noteId: string, isPublic: boolean) {
  const session = await requireAuth();
  const note = await setNotePublic(session.user.id, noteId, isPublic);
  if (!note) {
    return { error: "Note not found" };
  }

  revalidatePath(`/notes/${noteId}`);
  return { note };
}
