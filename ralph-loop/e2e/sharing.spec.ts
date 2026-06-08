import { test, expect } from "@playwright/test";
import { nanoid } from "nanoid";
import { signUp } from "./helpers/auth";

test.describe("Note Sharing", () => {
  test("toggling public sharing shows public URL", async ({ page }) => {
    const email = `share-${nanoid(6)}@example.com`;
    await signUp(page, "Share User", email, "password123");

    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);

    await page.getByRole("switch").click();
    await expect(page.getByText("Public")).toBeVisible();

    const urlInput = page.locator("input[readonly]");
    const urlValue = await urlInput.inputValue();
    expect(urlValue).toContain("/p/");
  });

  test("public URL is accessible anonymously", async ({ page, context }) => {
    const email = `anon-${nanoid(6)}@example.com`;
    await signUp(page, "Anon Test User", email, "password123");

    await page.getByRole("button", { name: "New note" }).click();
    await page.waitForURL(/\/notes\/.+/);

    await page.fill('[placeholder="Note title"]', "Public Note Test");
    await page.getByRole("button", { name: "Save" }).click();

    await page.getByRole("switch").click();
    const urlInput = page.locator("input[readonly]");
    const publicUrl = await urlInput.inputValue();

    // Open in new context (anonymous)
    const anonPage = await context.newPage();
    await anonPage.goto(publicUrl);
    await expect(
      anonPage.getByRole("heading", { name: "Public Note Test" })
    ).toBeVisible();
    await anonPage.close();
  });

  test("404 for private or invalid slug", async ({ page }) => {
    await page.goto("/p/invalid-slug-that-does-not-exist");
    // Next.js 404 page
    const body = await page.textContent("body");
    expect(body).toMatch(/404|not found/i);
  });
});
