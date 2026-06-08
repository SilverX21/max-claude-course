// @vitest-environment happy-dom
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ShareToggle } from "@/components/ShareToggle";

const defaultProps = {
  noteId: "note-1",
  initialIsPublic: false,
  initialSlug: null,
  origin: "http://localhost:3000",
};

const mockWriteText = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  mockWriteText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: mockWriteText },
    configurable: true,
    writable: true,
  });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ShareToggle", () => {
  it("renders the Share checkbox", () => {
    render(<ShareToggle {...defaultProps} />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("does not show Copy link button when note is not public", () => {
    render(<ShareToggle {...defaultProps} />);
    expect(screen.queryByRole("button", { name: /copy public link/i })).not.toBeInTheDocument();
  });

  it("shows Copy link button when initialIsPublic=true and slug exists", () => {
    render(<ShareToggle {...defaultProps} initialIsPublic={true} initialSlug="abc-slug" />);
    expect(screen.getByRole("button", { name: /copy public link/i })).toBeInTheDocument();
  });

  it("toggles to public and shows Copy link button on success", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ isPublic: true, publicSlug: "new-slug" }), { status: 200 }),
    );

    render(<ShareToggle {...defaultProps} />);
    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /copy public link/i })).toBeInTheDocument();
    });
  });

  it("calls POST /api/notes/{id}/share with isPublic=true when toggling on", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ isPublic: true, publicSlug: "slug" }), { status: 200 }),
    );

    render(<ShareToggle {...defaultProps} />);
    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/notes/note-1/share",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ isPublic: true }),
        }),
      );
    });
  });

  it("copies correct URL to clipboard when Copy link clicked", async () => {
    render(<ShareToggle {...defaultProps} initialIsPublic={true} initialSlug="abc-slug" />);

    fireEvent.click(screen.getByRole("button", { name: /copy public link/i }));

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith("http://localhost:3000/p/abc-slug");
    });
  });

  it("shows 'Copied!' feedback after copying and reverts after 2 seconds", async () => {
    vi.useFakeTimers();

    render(<ShareToggle {...defaultProps} initialIsPublic={true} initialSlug="abc-slug" />);

    // Wrap click in act so React flushes state updates triggered by the clipboard promise
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /copy public link/i }));
      // Flush clipboard promise microtask
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByText("Copied!")).toBeInTheDocument();

    // Advance past the 2s reset timeout and flush resulting state update
    await act(async () => {
      vi.advanceTimersByTime(2100);
      await Promise.resolve();
    });

    expect(screen.getByText("Copy link")).toBeInTheDocument();
  });

  it("hides Copy link button when toggled back to private", async () => {
    const user = userEvent.setup();
    vi.mocked(globalThis.fetch).mockResolvedValue(
      new Response(JSON.stringify({ isPublic: false, publicSlug: null }), { status: 200 }),
    );

    render(<ShareToggle {...defaultProps} initialIsPublic={true} initialSlug="abc-slug" />);

    await user.click(screen.getByRole("checkbox"));

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /copy public link/i })).not.toBeInTheDocument();
    });
  });
});
