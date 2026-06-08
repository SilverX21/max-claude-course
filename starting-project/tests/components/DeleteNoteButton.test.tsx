// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import { useRouter } from "next/navigation";
import { DeleteNoteButton } from "@/components/DeleteNoteButton";

const mockPush = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(globalThis.fetch).mockResolvedValue(new Response(null, { status: 204 }));
  vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
});

describe("DeleteNoteButton", () => {
  it("renders Delete button initially", () => {
    render(<DeleteNoteButton noteId="note-1" />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("shows 'Confirm?' text after first click", async () => {
    const user = userEvent.setup();
    render(<DeleteNoteButton noteId="note-1" />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Confirm?" })).toBeInTheDocument();
  });

  it("calls DELETE /api/notes/{id} and redirects on second click", async () => {
    const user = userEvent.setup();
    render(<DeleteNoteButton noteId="note-1" />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    await user.click(screen.getByRole("button", { name: "Confirm?" }));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith("/api/notes/note-1", { method: "DELETE" });
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("resets to 'Delete' state on blur", async () => {
    const user = userEvent.setup();
    render(<DeleteNoteButton noteId="note-1" />);

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(screen.getByRole("button", { name: "Confirm?" })).toBeInTheDocument();

    fireEvent.blur(screen.getByRole("button", { name: "Confirm?" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });
});
