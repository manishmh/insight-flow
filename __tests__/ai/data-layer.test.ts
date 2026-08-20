import { isReadOnlyQuery } from "../../src/server/ai/data-layer";

describe("Data Layer Safety Validation", () => {
  it("should allow valid read-only queries", () => {
    expect(isReadOnlyQuery("SELECT * FROM users;")).toBe(true);
    expect(isReadOnlyQuery("select id, name from table")).toBe(true);
    expect(isReadOnlyQuery("WITH cte AS (SELECT * FROM a) SELECT * FROM cte;")).toBe(true);
  });

  it("should reject destructive queries", () => {
    expect(isReadOnlyQuery("DROP TABLE users;")).toBe(false);
    expect(isReadOnlyQuery("DELETE FROM users WHERE id=1;")).toBe(false);
    expect(isReadOnlyQuery("UPDATE users SET name='test';")).toBe(false);
    expect(isReadOnlyQuery("INSERT INTO users(name) VALUES('test');")).toBe(false);
    expect(isReadOnlyQuery("ALTER TABLE users DROP COLUMN name;")).toBe(false);
  });

  it("should reject multiple statements to prevent injection attacks", () => {
    expect(isReadOnlyQuery("SELECT * FROM users; DROP TABLE users;")).toBe(false);
    expect(isReadOnlyQuery("select 1; update users set x=1;")).toBe(false);
  });
});
