import "@testing-library/jest-dom";
import { vi } from "vitest";

globalThis.fetch = vi.fn();

vi.mock("next/headers", () => ({
  headers: vi.fn(() => new Map()),
  cookies: vi.fn(() => new Map()),
}));
