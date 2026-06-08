import { describe, it, expect, mock, beforeAll, afterAll } from "bun:test";
import { Database } from "bun:sqlite";
import { nanoid } from "nanoid";

let testDb: Database;
const userId = nanoid();
const mockSession = {
  user: { id: userId, name: "Test", email: "test@test.com" },
  session: { id: nanoid(), userId, token: nanoid(), expiresAt: new Date() },
};

mock.module("@/lib/db", () => ({
  getDb: () => testDb,
  query: <T>(sql: string, params: unknown[] = []) =>
    testDb.query<T, unknown[]>(sql).all(...params),
  get: <T>(sql: string, params: unknown[] = []) =>
    testDb.query<T, unknown[]>(sql).get(...params) ?? undefined,
  run: (sql: string, params: unknown[] = []) => testDb.run(sql, params),
}));

mock.module("@/lib/auth", () => ({
  requireAuth: () => Promise.resolve(mockSession),
  getSession: () => Promise.resolve(mockSession),
}));

mock.module("next/cache", () => ({
  revalidatePath: () => undefined,
}));

function setupSchema(db: Database) {
  db.run("PRAGMA foreign_keys=ON");
  db.run(`CREATE TABLE user (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    createdAt TEXT NOT NULL DEFAULT (datetime('now')),
    updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE notes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content_json TEXT NOT NULL,
    is_public INTEGER NOT NULL DEFAULT 0,
    public_slug TEXT UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`);
  db.run("INSERT INTO user (id, name, email) VALUES (?, ?, ?)", [
    userId,
    "Test",
    "test@test.com",
  ]);
}

describe("notes server actions", () => {
  beforeAll(() => {
    testDb = new Database(":memory:");
    setupSchema(testDb);
  });

  afterAll(() => {
    testDb.close();
  });

  it("createNoteAction creates a note for the authenticated user", async () => {
    const { createNoteAction } = await import("@/lib/actions/notes");
    const result = await createNoteAction();
    expect("note" in result).toBe(true);
    if ("note" in result) {
      expect(result.note.userId).toBe(userId);
      expect(result.note.title).toBe("Untitled note");
    }
  });

  it("updateNoteAction updates the note title", async () => {
    const { createNoteAction, updateNoteAction } = await import(
      "@/lib/actions/notes"
    );
    const created = await createNoteAction();
    if (!("note" in created)) throw new Error("No note created");

    const updated = await updateNoteAction(created.note.id, {
      title: "Updated Title",
    });
    expect("note" in updated).toBe(true);
    if ("note" in updated) {
      expect(updated.note.title).toBe("Updated Title");
    }
  });

  it("deleteNoteAction deletes the note", async () => {
    const { createNoteAction, deleteNoteAction } = await import(
      "@/lib/actions/notes"
    );
    const created = await createNoteAction();
    if (!("note" in created)) throw new Error("No note created");

    const result = await deleteNoteAction(created.note.id);
    expect(result.success).toBe(true);
  });

  it("toggleShareAction updates isPublic and generates slug", async () => {
    const { createNoteAction, toggleShareAction } = await import(
      "@/lib/actions/notes"
    );
    const created = await createNoteAction();
    if (!("note" in created)) throw new Error("No note created");

    const shared = await toggleShareAction(created.note.id, true);
    expect("note" in shared).toBe(true);
    if ("note" in shared) {
      expect(shared.note.isPublic).toBe(true);
      expect(shared.note.publicSlug).toBeTruthy();
    }
  });
});
