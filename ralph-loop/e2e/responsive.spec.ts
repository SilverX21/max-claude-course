import { test, expect } from "@playwright/test";
import { nanoid } from "nanoid";
import { signUp } from "./helpers/auth";

test.describe("Responsive Design", () => {
  test("landing page renders on mobile (375px)", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Write and share notes" })
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Get started" })).toBeVisible();
  });

  test("authenticate page renders on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/authenticate");
    await expect(page.locator("#login-email")).toBeVisible();
    await expect(page.locator("#login-password")).toBeVisible();
    await expect(
      page.locator("form").getByRole("button", { name: "Log in" })
    ).toBeVisible();
  });

  test("dashboard renders on tablet (768px)", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const email = `responsive-${nanoid(6)}@example.com`;
    await signUp(page, "Responsive User", email, "password123");
    await expect(page.getByRole("heading", { name: "My Notes" })).toBeVisible();
    await expect(page.getByRole("button", { name: "New note" })).toBeVisible();
  });

  test("navigation works on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await expect(page.getByRole("link", { name: "NoteApp" })).toBeVisible();
    await expect(
      page.getByRole("navigation").getByRole("link", { name: "Log in" })
    ).toBeVisible();
  });
});
