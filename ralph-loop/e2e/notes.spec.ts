import { test, expect } from "@playwright/test";
import { nanoid } from "nanoid";
import { signUp } from "./helpers/auth";

test.describe("Notes CRUD", () => {
  test.beforeEach(async ({ page }) => {
    const email = `notes-${nanoid(6)}@example.com`;
    await signUp(page, "Notes User", email, "password123");
  });

  test("creating a new note navigates to editor", async ({ page }) => {
    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);
    await expect(page.getByPlaceholder("Note title")).toBeVisible();
  });

  test("editing note title and saving", async ({ page }) => {
    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);

    await page.fill('[placeholder="Note title"]', "My Test Note");
    await page.getByRole("button", { name: "Save" }).click();

    // Go back to dashboard and verify
    await page.getByRole("link", { name: "← Dashboard" }).click();
    await expect(page.getByText("My Test Note")).toBeVisible();
  });

  test("auto-save works after typing content", async ({ page }) => {
    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);

    await page.getByRole("textbox").nth(1).fill("Auto-save content test");
    // Wait for auto-save (1.5s debounce)
    await page.waitForTimeout(2000);
    // Should show "Saved" status briefly
    await expect(page.getByText("Saved")).toBeVisible({ timeout: 3000 });
  });

  test("delete note with confirmation", async ({ page }) => {
    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);

    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByText("Delete note?")).toBeVisible();

    await page.getByRole("button", { name: "Delete" }).nth(1).click();
    await page.waitForURL("/dashboard");
  });
});
