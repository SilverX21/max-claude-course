import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import { Database } from "bun:sqlite";

describe("db utilities", () => {
  let db: Database;

  beforeAll(() => {
    db = new Database(":memory:");
    db.run("PRAGMA foreign_keys=ON");
    db.run("CREATE TABLE test (id TEXT PRIMARY KEY, name TEXT NOT NULL)");
    db.run("INSERT INTO test VALUES ('1', 'Alice')");
    db.run("INSERT INTO test VALUES ('2', 'Bob')");
  });

  afterAll(() => {
    db.close();
  });

  it("query returns all matching rows", () => {
    const rows = db
      .query<{ id: string; name: string }, []>("SELECT * FROM test")
      .all();
    expect(rows).toHaveLength(2);
    expect(rows[0].name).toBe("Alice");
  });

  it("get returns a single row", () => {
    const row = db
      .query<{ id: string; name: string }, [string]>(
        "SELECT * FROM test WHERE id = ?"
      )
      .get("1");
    expect(row).not.toBeNull();
    expect(row?.name).toBe("Alice");
  });

  it("get returns null for missing row", () => {
    const row = db
      .query<{ id: string; name: string }, [string]>(
        "SELECT * FROM test WHERE id = ?"
      )
      .get("999");
    expect(row).toBeNull();
  });

  it("run executes mutations", () => {
    db.run("INSERT INTO test VALUES ('3', 'Charlie')");
    const row = db
      .query<{ id: string; name: string }, [string]>(
        "SELECT * FROM test WHERE id = ?"
      )
      .get("3");
    expect(row?.name).toBe("Charlie");
  });
});
