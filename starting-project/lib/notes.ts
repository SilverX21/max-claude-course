import { query, get, run } from "@/lib/db";
import { nanoid } from "nanoid";

export type Note = {
  id: string;
  userId: string;
  title: string;
  contentJson: string;
  isPublic: boolean;
  publicSlug: string | null;
  createdAt: string;
  updatedAt: string;
};

type NoteRow = {
  id: string;
  user_id: string;
  title: string;
  content_json: string;
  is_public: number;
  public_slug: string | null;
  created_at: string;
  updated_at: string;
};

const EMPTY_DOC = JSON.stringify({ type: "doc", content: [] });

function toNote(row: NoteRow): Note {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    contentJson: row.content_json,
    isPublic: row.is_public === 1,
    publicSlug: row.public_slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createNote(
  userId: string,
  data: { title?: string; contentJson?: string } = {}
): Promise<Note> {
  const id = nanoid(16);
  const title = data.title ?? "Untitled note";
  const contentJson = data.contentJson ?? EMPTY_DOC;
  run("INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)", [
    id,
    userId,
    title,
    contentJson,
  ]);
  return toNote(get<NoteRow>("SELECT * FROM notes WHERE id = ?", [id])!);
}

export async function getNotesByUser(userId: string): Promise<Note[]> {
  return query<NoteRow>(
    "SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC",
    [userId]
  ).map(toNote);
}

export async function getNoteById(
  userId: string,
  noteId: string
): Promise<Note | null> {
  const row = get<NoteRow>(
    "SELECT * FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );
  return row ? toNote(row) : null;
}

export async function updateNote(
  userId: string,
  noteId: string,
  data: Partial<{ title: string; contentJson: string }>
): Promise<Note | null> {
  const note = await getNoteById(userId, noteId);
  if (!note) return null;
  const title = data.title ?? note.title;
  const contentJson = data.contentJson ?? note.contentJson;
  run(
    "UPDATE notes SET title = ?, content_json = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
    [title, contentJson, noteId, userId]
  );
  return getNoteById(userId, noteId);
}

export async function deleteNote(userId: string, noteId: string): Promise<void> {
  run("DELETE FROM notes WHERE id = ? AND user_id = ?", [noteId, userId]);
}

export async function setNotePublic(
  userId: string,
  noteId: string,
  isPublic: boolean
): Promise<Note | null> {
  const note = await getNoteById(userId, noteId);
  if (!note) return null;
  if (isPublic) {
    const slug = note.publicSlug ?? nanoid(16);
    run(
      "UPDATE notes SET is_public = 1, public_slug = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
      [slug, noteId, userId]
    );
  } else {
    run(
      "UPDATE notes SET is_public = 0, public_slug = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ?",
      [noteId, userId]
    );
  }
  return getNoteById(userId, noteId);
}

export async function getNoteByPublicSlug(slug: string): Promise<Note | null> {
  const row = get<NoteRow>(
    "SELECT * FROM notes WHERE public_slug = ? AND is_public = 1",
    [slug]
  );
  return row ? toNote(row) : null;
}
