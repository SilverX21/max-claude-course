import { vi, describe, it, expect, beforeEach } from "vitest";
import { makeNoteRow } from "../fixtures";

vi.mock("@/lib/db", () => ({
  query: vi.fn(),
  get: vi.fn(),
  run: vi.fn(),
}));

vi.mock("nanoid", () => ({
  nanoid: vi.fn(() => "test-id-1234567x"),
}));

import { query, get, run } from "@/lib/db";
import { nanoid } from "nanoid";
import {
  createNote,
  computeNoteStats,
  getNotesByUser,
  getNoteById,
  updateNote,
  deleteNote,
  setNotePublic,
  getNoteByPublicSlug,
  getNoteStats,
} from "@/lib/notes";

const mockGet = vi.mocked(get);
const mockQuery = vi.mocked(query);
const mockRun = vi.mocked(run);
const mockNanoid = vi.mocked(nanoid);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── computeNoteStats (pure, no mocks needed) ────────────────────────────────

describe("computeNoteStats", () => {
  it("returns zeros when no notes exist", () => {
    expect(computeNoteStats(0, 0, 0)).toEqual({ total: 0, last7Days: 0, deletedPercent: 0 });
  });

  it("calculates deletedPercent as rounded integer", () => {
    expect(computeNoteStats(3, 1, 0).deletedPercent).toBe(25);
  });

  it("rounds deletedPercent for fractional values", () => {
    // 1/3 = 33.33... → rounds to 33
    expect(computeNoteStats(2, 1, 0).deletedPercent).toBe(33);
  });

  it("sets total to active count, not total ever created", () => {
    expect(computeNoteStats(5, 2, 0).total).toBe(5);
  });

  it("passes last7Days through unchanged", () => {
    expect(computeNoteStats(10, 0, 3).last7Days).toBe(3);
  });
});

// ─── createNote ──────────────────────────────────────────────────────────────

describe("createNote", () => {
  it("inserts with nanoid-generated id and returns created note", async () => {
    const row = makeNoteRow({ id: "test-id-1234567x" });
    mockGet.mockReturnValue(row);

    const note = await createNote("user-1");

    expect(mockRun).toHaveBeenCalledWith(
      "INSERT INTO notes (id, user_id, title, content_json) VALUES (?, ?, ?, ?)",
      ["test-id-1234567x", "user-1", "Untitled note", expect.any(String)],
    );
    expect(note.id).toBe("test-id-1234567x");
  });

  it("uses 'Untitled note' as default title", async () => {
    mockGet.mockReturnValue(makeNoteRow());
    await createNote("user-1");
    expect(mockRun).toHaveBeenCalledWith(expect.any(String), [
      expect.any(String),
      "user-1",
      "Untitled note",
      expect.any(String),
    ]);
  });

  it("uses custom title when provided", async () => {
    mockGet.mockReturnValue(makeNoteRow({ title: "My Note" }));
    await createNote("user-1", { title: "My Note" });
    expect(mockRun).toHaveBeenCalledWith(expect.any(String), [
      expect.any(String),
      "user-1",
      "My Note",
      expect.any(String),
    ]);
  });

  it("uses empty TipTap doc as default contentJson", async () => {
    mockGet.mockReturnValue(makeNoteRow());
    await createNote("user-1");
    const [, params] = mockRun.mock.calls[0];
    expect(params[3]).toBe(JSON.stringify({ type: "doc", content: [] }));
  });

  it("maps returned row to Note shape with isPublic boolean", async () => {
    mockGet.mockReturnValue(makeNoteRow({ is_public: 0 }));
    const note = await createNote("user-1");
    expect(note.isPublic).toBe(false);
  });
});

// ─── getNotesByUser ───────────────────────────────────────────────────────────

describe("getNotesByUser", () => {
  it("returns mapped notes array for user", async () => {
    mockQuery.mockReturnValue([makeNoteRow(), makeNoteRow({ id: "note-2" })]);
    const notes = await getNotesByUser("user-1");
    expect(notes).toHaveLength(2);
    expect(notes[0].userId).toBe("test-user-id");
  });

  it("passes userId to the query", async () => {
    mockQuery.mockReturnValue([]);
    await getNotesByUser("my-user");
    expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining("deleted_at IS NULL"), [
      "my-user",
    ]);
  });

  it("returns empty array when user has no notes", async () => {
    mockQuery.mockReturnValue([]);
    expect(await getNotesByUser("user-1")).toEqual([]);
  });
});

// ─── getNoteById ─────────────────────────────────────────────────────────────

describe("getNoteById", () => {
  it("returns mapped note when found", async () => {
    mockGet.mockReturnValue(makeNoteRow({ id: "n1", title: "Found" }));
    const note = await getNoteById("user-1", "n1");
    expect(note?.title).toBe("Found");
    expect(note?.isPublic).toBe(false);
  });

  it("returns null when note not found", async () => {
    mockGet.mockReturnValue(undefined);
    expect(await getNoteById("user-1", "missing")).toBeNull();
  });

  it("passes both noteId and userId to enforce user scoping", async () => {
    mockGet.mockReturnValue(undefined);
    await getNoteById("user-1", "note-1");
    expect(mockGet).toHaveBeenCalledWith(expect.any(String), ["note-1", "user-1"]);
  });
});

// ─── updateNote ──────────────────────────────────────────────────────────────

describe("updateNote", () => {
  it("returns null when note does not exist", async () => {
    mockGet.mockReturnValue(undefined);
    expect(await updateNote("user-1", "note-1", { title: "New" })).toBeNull();
  });

  it("runs UPDATE and re-fetches the note after update", async () => {
    const original = makeNoteRow();
    const updated = makeNoteRow({ title: "Updated" });
    mockGet.mockReturnValueOnce(original).mockReturnValueOnce(updated);

    const note = await updateNote("user-1", "test-note-id", { title: "Updated" });

    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE notes SET title"),
      expect.any(Array),
    );
    expect(note?.title).toBe("Updated");
  });

  it("preserves existing title when title not in update data", async () => {
    const row = makeNoteRow({ title: "Original" });
    mockGet.mockReturnValueOnce(row).mockReturnValueOnce(row);

    await updateNote("user-1", "test-note-id", { contentJson: '{"type":"doc"}' });

    const [, params] = mockRun.mock.calls[0];
    expect(params[0]).toBe("Original");
  });

  it("preserves existing contentJson when contentJson not in update data", async () => {
    const row = makeNoteRow({ content_json: '{"existing":true}' });
    mockGet.mockReturnValueOnce(row).mockReturnValueOnce(row);

    await updateNote("user-1", "test-note-id", { title: "New Title" });

    const [, params] = mockRun.mock.calls[0];
    expect(params[1]).toBe('{"existing":true}');
  });
});

// ─── deleteNote ──────────────────────────────────────────────────────────────

describe("deleteNote", () => {
  it("calls run with soft-delete UPDATE (sets deleted_at)", async () => {
    await deleteNote("user-1", "note-1");
    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining("SET deleted_at = datetime('now')"),
      ["note-1", "user-1"],
    );
  });
});

// ─── setNotePublic ────────────────────────────────────────────────────────────

describe("setNotePublic", () => {
  it("returns null when note does not exist", async () => {
    mockGet.mockReturnValue(undefined);
    expect(await setNotePublic("user-1", "note-1", true)).toBeNull();
  });

  it("generates new slug with nanoid when note has no existing slug", async () => {
    const row = makeNoteRow({ public_slug: null });
    const updatedRow = makeNoteRow({ public_slug: "test-id-1234567x", is_public: 1 });
    mockGet.mockReturnValueOnce(row).mockReturnValueOnce(updatedRow);

    const note = await setNotePublic("user-1", "test-note-id", true);

    expect(mockNanoid).toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalledWith(expect.stringContaining("is_public = 1"), [
      "test-id-1234567x",
      "test-note-id",
      "user-1",
    ]);
    expect(note?.publicSlug).toBe("test-id-1234567x");
  });

  it("reuses existing slug and does not call nanoid", async () => {
    const row = makeNoteRow({ public_slug: "existing-slug", is_public: 1 });
    mockGet.mockReturnValueOnce(row).mockReturnValueOnce(row);

    await setNotePublic("user-1", "test-note-id", true);

    expect(mockNanoid).not.toHaveBeenCalled();
    expect(mockRun).toHaveBeenCalledWith(expect.any(String), [
      "existing-slug",
      "test-note-id",
      "user-1",
    ]);
  });

  it("sets is_public=0 and clears public_slug when disabling", async () => {
    const row = makeNoteRow({ public_slug: "some-slug", is_public: 1 });
    const privateRow = makeNoteRow({ public_slug: null, is_public: 0 });
    mockGet.mockReturnValueOnce(row).mockReturnValueOnce(privateRow);

    const note = await setNotePublic("user-1", "test-note-id", false);

    expect(mockRun).toHaveBeenCalledWith(
      expect.stringContaining("is_public = 0, public_slug = NULL"),
      ["test-note-id", "user-1"],
    );
    expect(note?.isPublic).toBe(false);
    expect(note?.publicSlug).toBeNull();
  });
});

// ─── getNoteByPublicSlug ──────────────────────────────────────────────────────

describe("getNoteByPublicSlug", () => {
  it("returns note when slug matches a public note", async () => {
    const row = makeNoteRow({ public_slug: "abc-slug", is_public: 1 });
    mockGet.mockReturnValue(row);
    const note = await getNoteByPublicSlug("abc-slug");
    expect(note?.publicSlug).toBe("abc-slug");
    expect(note?.isPublic).toBe(true);
  });

  it("returns null when slug not found", async () => {
    mockGet.mockReturnValue(undefined);
    expect(await getNoteByPublicSlug("no-such-slug")).toBeNull();
  });

  it("queries by slug with is_public = 1 filter", async () => {
    mockGet.mockReturnValue(undefined);
    await getNoteByPublicSlug("my-slug");
    expect(mockGet).toHaveBeenCalledWith(expect.stringContaining("is_public = 1"), ["my-slug"]);
  });
});

// ─── getNoteStats ─────────────────────────────────────────────────────────────

describe("getNoteStats", () => {
  it("returns stats from db row", async () => {
    mockGet.mockReturnValue({ active: 3, deleted: 1, last7Days: 2 });
    const stats = await getNoteStats("user-1");
    expect(stats).toEqual({ total: 3, last7Days: 2, deletedPercent: 25 });
  });

  it("returns zeros when db returns undefined (no notes)", async () => {
    mockGet.mockReturnValue(undefined);
    const stats = await getNoteStats("user-1");
    expect(stats).toEqual({ total: 0, last7Days: 0, deletedPercent: 0 });
  });
});
