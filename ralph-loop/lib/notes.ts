import { nanoid } from "nanoid";
import { get, query, run } from "@/lib/db";

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

export const DEFAULT_CONTENT_JSON = JSON.stringify({
  type: "doc",
  content: [{ type: "paragraph" }],
});

export function generatePublicSlug(): string {
  return nanoid(16);
}

function rowToNote(row: NoteRow): Note {
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
  const id = nanoid();
  const title = data.title ?? "Untitled note";
  const contentJson = data.contentJson ?? DEFAULT_CONTENT_JSON;

  run(
    `INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)`,
    [id, userId, title, contentJson]
  );

  const note = get<NoteRow>(
    `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
    [id, userId]
  );
  if (!note) throw new Error("Failed to create note");
  return rowToNote(note);
}

export async function getNoteById(
  userId: string,
  noteId: string
): Promise<Note | null> {
  const row = get<NoteRow>(
    `SELECT * FROM notes WHERE id = ? AND user_id = ?`,
    [noteId, userId]
  );
  return row ? rowToNote(row) : null;
}

export async function getNotesByUser(userId: string): Promise<Note[]> {
  const rows = query<NoteRow>(
    `SELECT * FROM notes WHERE user_id = ? ORDER BY updated_at DESC`,
    [userId]
  );
  return rows.map(rowToNote);
}

export async function updateNote(
  userId: string,
  noteId: string,
  data: Partial<{ title: string; contentJson: string }>
): Promise<Note | null> {
  const existing = await getNoteById(userId, noteId);
  if (!existing) return null;

  const title = data.title ?? existing.title;
  const contentJson = data.contentJson ?? existing.contentJson;

  run(
    `UPDATE notes SET title = ?, content_json = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
    [title, contentJson, noteId, userId]
  );

  return getNoteById(userId, noteId);
}

export async function deleteNote(
  userId: string,
  noteId: string
): Promise<void> {
  run(`DELETE FROM notes WHERE id = ? AND user_id = ?`, [noteId, userId]);
}

export async function setNotePublic(
  userId: string,
  noteId: string,
  isPublic: boolean
): Promise<Note | null> {
  const existing = await getNoteById(userId, noteId);
  if (!existing) return null;

  if (isPublic) {
    const slug = existing.publicSlug ?? generatePublicSlug();
    run(
      `UPDATE notes SET is_public = 1, public_slug = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [slug, noteId, userId]
    );
  } else {
    run(
      `UPDATE notes SET is_public = 0, public_slug = NULL, updated_at = datetime('now') WHERE id = ? AND user_id = ?`,
      [noteId, userId]
    );
  }

  return getNoteById(userId, noteId);
}

export async function getNoteByPublicSlug(
  slug: string
): Promise<Note | null> {
  const row = get<NoteRow>(
    `SELECT * FROM notes WHERE public_slug = ? AND is_public = 1`,
    [slug]
  );
  return row ? rowToNote(row) : null;
}
