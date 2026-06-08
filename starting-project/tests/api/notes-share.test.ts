import { vi, describe, it, expect, beforeEach } from "vitest";
import { makeNote } from "../fixtures";

vi.mock("@/lib/auth", () => ({ getCurrentUser: vi.fn() }));
vi.mock("@/lib/notes", () => ({
  setNotePublic: vi.fn(),
}));

import { POST } from "@/app/api/notes/[id]/share/route";
import { getCurrentUser } from "@/lib/auth";
import { setNotePublic } from "@/lib/notes";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockSetNotePublic = vi.mocked(setNotePublic);

const USER = { id: "user-1", name: "Alice", email: "alice@example.com" };
const params = Promise.resolve({ id: "note-123" });

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/notes/[id]/share", () => {
  it("returns 401 when unauthenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: true }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(401);
  });

  it("returns 404 when setNotePublic returns null", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockSetNotePublic.mockResolvedValue(null);
    const req = new Request("http://localhost/api/notes/note-123/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: true }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(404);
  });

  it("returns id/isPublic/publicSlug when enabling sharing", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    const note = makeNote({ id: "note-123", isPublic: true, publicSlug: "abc-slug-123" });
    mockSetNotePublic.mockResolvedValue(note);
    const req = new Request("http://localhost/api/notes/note-123/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: true }),
    });
    const res = await POST(req, { params });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ id: "note-123", isPublic: true, publicSlug: "abc-slug-123" });
  });

  it("returns isPublic=false and publicSlug=null when disabling sharing", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    const note = makeNote({ id: "note-123", isPublic: false, publicSlug: null });
    mockSetNotePublic.mockResolvedValue(note);
    const req = new Request("http://localhost/api/notes/note-123/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: false }),
    });
    const res = await POST(req, { params });
    const body = await res.json();
    expect(body).toEqual({ id: "note-123", isPublic: false, publicSlug: null });
  });

  it("calls setNotePublic with userId, noteId, and isPublic value", async () => {
    mockGetCurrentUser.mockResolvedValue(USER);
    mockSetNotePublic.mockResolvedValue(makeNote({ isPublic: true, publicSlug: "slug" }));
    const req = new Request("http://localhost/api/notes/note-123/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: true }),
    });
    await POST(req, { params });
    expect(mockSetNotePublic).toHaveBeenCalledWith("user-1", "note-123", true);
  });
});
