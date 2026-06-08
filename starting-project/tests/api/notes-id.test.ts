import { vi, describe, it, expect, beforeEach } from "vitest";
import { makeNote } from "../fixtures";

vi.mock("@/lib/auth", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/notes", () => ({
  getNoteById: vi.fn(),
  updateNote: vi.fn(),
  deleteNote: vi.fn(),
}));

import { GET, PUT, DELETE } from "@/app/api/notes/[id]/route";
import { getCurrentUser } from "@/lib/auth";
import { getNoteById, updateNote, deleteNote } from "@/lib/notes";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockGetNoteById = vi.mocked(getNoteById);
const mockUpdateNote = vi.mocked(updateNote);
const mockDeleteNote = vi.mocked(deleteNote);

const USER = { id: "user-1", name: "Alice", email: "alice@example.com" };
const params = Promise.resolve({ id: "note-123" });

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── GET /api/notes/[id] ──────────────────────────────────────────────────────

describe("GET /api/notes/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123");
    const res = await GET(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when note not found for user", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNoteById.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123");
    const res = await GET(req, { params });
    expect(res.status).toBe(404);
  });

  it("returns full note when found", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    const note = makeNote({ id: "note-123", title: "Found Note" });
    mockGetNoteById.mockResolvedValue(note);
    const req = new Request("http://localhost/api/notes/note-123");
    const res = await GET(req, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.title).toBe("Found Note");
    expect(body.contentJson).toBeDefined();
  });

  it("calls getNoteById with userId and noteId", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNoteById.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123");
    await GET(req, { params });
    expect(mockGetNoteById).toHaveBeenCalledWith("user-1", "note-123");
  });
});

// ─── PUT /api/notes/[id] ──────────────────────────────────────────────────────

describe("PUT /api/notes/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when note not found", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockUpdateNote.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(404);
  });

  it("updates note and returns updated note", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    const updated = makeNote({ title: "Updated" });
    mockUpdateNote.mockResolvedValue(updated);
    const req = new Request("http://localhost/api/notes/note-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Updated" }),
    });
    const res = await PUT(req, { params });
    expect(res.status).toBe(200);
    expect((await res.json()).title).toBe("Updated");
  });

  it("stringifies contentJson object when provided in body", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockUpdateNote.mockResolvedValue(makeNote());
    const contentObj = { type: "doc", content: [{ type: "text" }] };
    const req = new Request("http://localhost/api/notes/note-123", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contentJson: contentObj }),
    });
    await PUT(req, { params });
    expect(mockUpdateNote).toHaveBeenCalledWith("user-1", "note-123", {
      title: undefined,
      contentJson: JSON.stringify(contentObj),
    });
  });
});

// ─── DELETE /api/notes/[id] ───────────────────────────────────────────────────

describe("DELETE /api/notes/[id]", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when note not found for user", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNoteById.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(res.status).toBe(404);
  });

  it("calls deleteNote and returns 204 with empty body", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockGetNoteById.mockResolvedValue(makeNote());
    mockDeleteNote.mockResolvedValue(undefined);
    const req = new Request("http://localhost/api/notes/note-123", { method: "DELETE" });
    const res = await DELETE(req, { params });
    expect(mockDeleteNote).toHaveBeenCalledWith("user-1", "note-123");
    expect(res.status).toBe(204);
    expect(res.body).toBeNull();
  });
});
