import { vi, describe, it, expect, beforeEach } from "vitest";
import { makeNote } from "../fixtures";

vi.mock("@/lib/auth", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/notes", () => ({
  createNote: vi.fn(),
  getNotesByUser: vi.fn(),
}));

import { GET, POST } from "@/app/api/notes/route";
import { getCurrentUser } from "@/lib/auth";
import { createNote, getNotesByUser } from "@/lib/notes";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockCreateNote = vi.mocked(createNote);
const mockGetNotesByUser = vi.mocked(getNotesByUser);

const USER = { id: "user-1", name: "Alice", email: "alice@example.com" };

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── GET /api/notes ───────────────────────────────────────────────────────────

describe("GET /api/notes", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Unauthorized" });
  });

  it("returns notes array with id/title/isPublic/updatedAt fields only", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNotesByUser.mockResolvedValue([
      makeNote({ id: "n1", title: "Note 1", isPublic: false, updatedAt: "2024-01-01" }),
      makeNote({ id: "n2", title: "Note 2", isPublic: true, updatedAt: "2024-01-02" }),
    ]);

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveLength(2);
    expect(body[0]).toEqual({
      id: "n1",
      title: "Note 1",
      isPublic: false,
      updatedAt: "2024-01-01",
    });
    expect(body[1]).toEqual({ id: "n2", title: "Note 2", isPublic: true, updatedAt: "2024-01-02" });
    // contentJson should NOT be included
    expect(body[0].contentJson).toBeUndefined();
  });

  it("returns empty array when user has no notes", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNotesByUser.mockResolvedValue([]);
    const res = await GET();
    expect(await res.json()).toEqual([]);
  });

  it("calls getNotesByUser with the authenticated user id", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNotesByUser.mockResolvedValue([]);
    await GET();
    expect(mockGetNotesByUser).toHaveBeenCalledWith("user-1");
  });
});

// ─── POST /api/notes ──────────────────────────────────────────────────────────

describe("POST /api/notes", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      body: JSON.stringify({ title: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("creates note with provided title and returns 201", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    const note = makeNote({ title: "My Note" });
    mockCreateNote.mockResolvedValue(note);

    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "My Note" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.title).toBe("My Note");
  });

  it("creates note with undefined title when body is empty", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockCreateNote.mockResolvedValue(makeNote());

    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    await POST(req);
    expect(mockCreateNote).toHaveBeenCalledWith("user-1", {
      title: undefined,
      contentJson: undefined,
    });
  });

  it("stringifies contentJson object before passing to createNote", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockCreateNote.mockResolvedValue(makeNote());

    const contentObj = { type: "doc", content: [] };
    const req = new Request("http://localhost/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentJson: contentObj }),
    });

    await POST(req);
    expect(mockCreateNote).toHaveBeenCalledWith("user-1", {
      title: undefined,
      contentJson: JSON.stringify(contentObj),
    });
  });
});
