// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

import { useRouter } from "next/navigation";
import { CreateNoteButton } from "@/components/CreateNoteButton";

const mockPush = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(useRouter).mockReturnValue({ push: mockPush } as ReturnType<typeof useRouter>);
});

describe("CreateNoteButton", () => {
  it("renders 'New note' button", () => {
    render(<CreateNoteButton />);
    expect(screen.getByRole("button", { name: "New note" })).toBeInTheDocument();
  });

  it("opens modal dialog when 'New note' clicked", async () => {
    const user = userEvent.setup();
    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toBeInTheDocument();
  });

  it("closes modal when Cancel clicked", async () => {
    const user = userEvent.setup();
    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits with title and navigates to new note on success", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ id: "new-note-id" }), { status: 201 }),
    );

    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    await user.type(screen.getByLabelText("Title"), "My New Note");
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/notes/new-note-id");
    });
  });

  it("shows error message when server returns error", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 }),
    );

    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  it("shows network error message when fetch throws", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockRejectedValue(new Error("Network failure"));

    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Network error");
    });
  });

  it("disables Create button while loading", async () => {
    const user = userEvent.setup();
    // Never resolves so the loading state persists
    vi.mocked(globalThis.fetch).mockReturnValue(new Promise(() => {}));

    render(<CreateNoteButton />);
    await user.click(screen.getByRole("button", { name: "New note" }));
    await user.click(screen.getByRole("button", { name: "Create" }));

    expect(screen.getByRole("button", { name: "Creating…" })).toBeDisabled();
  });
});
