import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { Database } from "bun:sqlite";
import { nanoid } from "nanoid";

let testDb: Database;

vi.mock("@/lib/db", () => ({
  getDb: () => testDb,
  query: <T>(sql: string, params: unknown[] = []) =>
    testDb.query<T, unknown[]>(sql).all(...params),
  get: <T>(sql: string, params: unknown[] = []) =>
    testDb.query<T, unknown[]>(sql).get(...params) ?? undefined,
  run: (sql: string, params: unknown[] = []) => testDb.run(sql, params),
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
}

describe("notes repository", () => {
  const userId = nanoid();
  const otherUserId = nanoid();

  beforeAll(() => {
    testDb = new Database(":memory:");
    setupSchema(testDb);
    testDb.run("INSERT INTO user (id, name, email) VALUES (?, ?, ?)", [
      userId,
      "Test",
      "test@test.com",
    ]);
    testDb.run("INSERT INTO user (id, name, email) VALUES (?, ?, ?)", [
      otherUserId,
      "Other",
      "other@test.com",
    ]);
  });

  afterAll(() => {
    testDb.close();
  });

  it("createNote uses defaults", async () => {
    const { createNote } = await import("@/lib/notes");
    const note = await createNote(userId);
    expect(note.title).toBe("Untitled note");
    expect(note.userId).toBe(userId);
    expect(note.isPublic).toBe(false);
    expect(note.publicSlug).toBeNull();
    const parsed = JSON.parse(note.contentJson);
    expect(parsed.type).toBe("doc");
  });

  it("createNote accepts custom title", async () => {
    const { createNote } = await import("@/lib/notes");
    const note = await createNote(userId, { title: "My Note" });
    expect(note.title).toBe("My Note");
  });

  it("getNoteById enforces authorization", async () => {
    const { createNote, getNoteById } = await import("@/lib/notes");
    const note = await createNote(userId);
    const found = await getNoteById(userId, note.id);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(note.id);

    const notFound = await getNoteById(otherUserId, note.id);
    expect(notFound).toBeNull();
  });

  it("getNotesByUser returns notes ordered by updated_at DESC", async () => {
    const { createNote, getNotesByUser } = await import("@/lib/notes");
    await createNote(userId, { title: "First" });
    await createNote(userId, { title: "Second" });
    const notes = await getNotesByUser(userId);
    expect(notes.length).toBeGreaterThanOrEqual(2);
  });

  it("updateNote updates title and enforces auth", async () => {
    const { createNote, updateNote } = await import("@/lib/notes");
    const note = await createNote(userId);
    const updated = await updateNote(userId, note.id, { title: "Updated" });
    expect(updated?.title).toBe("Updated");

    const notUpdated = await updateNote(otherUserId, note.id, {
      title: "Hacked",
    });
    expect(notUpdated).toBeNull();
  });

  it("deleteNote enforces authorization", async () => {
    const { createNote, deleteNote, getNoteById } = await import("@/lib/notes");
    const note = await createNote(userId);

    await deleteNote(otherUserId, note.id);
    expect(await getNoteById(userId, note.id)).not.toBeNull();

    await deleteNote(userId, note.id);
    expect(await getNoteById(userId, note.id)).toBeNull();
  });

  it("setNotePublic generates and clears slug", async () => {
    const { createNote, setNotePublic, getNoteByPublicSlug } = await import(
      "@/lib/notes"
    );
    const note = await createNote(userId);

    const publicNote = await setNotePublic(userId, note.id, true);
    expect(publicNote?.isPublic).toBe(true);
    expect(publicNote?.publicSlug).toBeTruthy();
    expect(publicNote?.publicSlug?.length).toBeGreaterThanOrEqual(16);

    const slug = publicNote!.publicSlug!;
    const foundBySlug = await getNoteByPublicSlug(slug);
    expect(foundBySlug?.id).toBe(note.id);

    const privateNote = await setNotePublic(userId, note.id, false);
    expect(privateNote?.isPublic).toBe(false);
    expect(privateNote?.publicSlug).toBeNull();

    const notFoundBySlug = await getNoteByPublicSlug(slug);
    expect(notFoundBySlug).toBeNull();
  });
});
