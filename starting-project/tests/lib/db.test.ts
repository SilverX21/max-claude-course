import { vi, describe, it, expect, beforeEach } from "vitest";

const { mockAll, mockGet, mockRun, mockQuery, MockDatabase } = vi.hoisted(() => {
  const mockAll = vi.fn().mockReturnValue([]);
  const mockGet = vi.fn().mockReturnValue(undefined);
  const mockRun = vi.fn();
  const mockQuery = vi.fn().mockReturnValue({ all: mockAll, get: mockGet, run: mockRun });
  const mockDbRun = vi.fn();
  const MockDatabase = vi.fn().mockImplementation(function () {
    return { query: mockQuery, run: mockDbRun };
  });
  return { mockAll, mockGet, mockRun, mockQuery, MockDatabase };
});

vi.mock("bun:sqlite", () => ({ Database: MockDatabase }));
vi.mock("fs", () => ({ mkdirSync: vi.fn() }));

import { query, get, run } from "@/lib/db";

describe("db helpers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQuery.mockReturnValue({ all: mockAll, get: mockGet, run: mockRun });
  });

  describe("query()", () => {
    it("calls db.query(sql).all() with spread params and returns result", () => {
      const rows = [{ id: "1" }, { id: "2" }];
      mockAll.mockReturnValue(rows);

      const result = query("SELECT * FROM notes WHERE user_id = ?", ["u1"]);

      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM notes WHERE user_id = ?");
      expect(mockAll).toHaveBeenCalledWith("u1");
      expect(result).toEqual(rows);
    });

    it("returns empty array when db returns no rows", () => {
      mockAll.mockReturnValue([]);
      expect(query("SELECT * FROM notes", [])).toEqual([]);
    });

    it("calls .all() with no args when params is omitted", () => {
      query("SELECT * FROM notes");
      expect(mockAll).toHaveBeenCalledWith();
    });
  });

  describe("get()", () => {
    it("calls db.query(sql).get() with spread params and returns result", () => {
      const row = { id: "1", title: "Test" };
      mockGet.mockReturnValue(row);

      const result = get("SELECT * FROM notes WHERE id = ?", ["1"]);

      expect(mockQuery).toHaveBeenCalledWith("SELECT * FROM notes WHERE id = ?");
      expect(mockGet).toHaveBeenCalledWith("1");
      expect(result).toEqual(row);
    });

    it("returns undefined when no row matches", () => {
      mockGet.mockReturnValue(undefined);
      expect(get("SELECT * FROM notes WHERE id = ?", ["missing"])).toBeUndefined();
    });

    it("calls .get() with no args when params is omitted", () => {
      get("SELECT * FROM notes LIMIT 1");
      expect(mockGet).toHaveBeenCalledWith();
    });
  });

  describe("run()", () => {
    it("calls db.query(sql).run() with spread params", () => {
      run("DELETE FROM notes WHERE id = ?", ["abc"]);
      expect(mockQuery).toHaveBeenCalledWith("DELETE FROM notes WHERE id = ?");
      expect(mockRun).toHaveBeenCalledWith("abc");
    });

    it("calls .run() with multiple params spread correctly", () => {
      run("UPDATE notes SET title = ? WHERE id = ? AND user_id = ?", ["Title", "n1", "u1"]);
      expect(mockRun).toHaveBeenCalledWith("Title", "n1", "u1");
    });

    it("calls .run() with no args when params is omitted", () => {
      run("DELETE FROM notes");
      expect(mockRun).toHaveBeenCalledWith();
    });
  });
});
