import type { Note } from "@/lib/notes";

export function makeNote(overrides: Partial<Note> = {}): Note {
  return {
    id: "test-note-id",
    userId: "test-user-id",
    title: "Test Note",
    contentJson: '{"type":"doc","content":[]}',
    isPublic: false,
    publicSlug: null,
    createdAt: "2024-01-01T00:00:00",
    updatedAt: "2024-01-01T00:00:00",
    deletedAt: null,
    ...overrides,
  };
}

export function makeNoteRow(overrides: Record<string, unknown> = {}) {
  return {
    id: "test-note-id",
    user_id: "test-user-id",
    title: "Test Note",
    content_json: '{"type":"doc","content":[]}',
    is_public: 0,
    public_slug: null,
    created_at: "2024-01-01T00:00:00",
    updated_at: "2024-01-01T00:00:00",
    deleted_at: null,
    ...overrides,
  };
}
