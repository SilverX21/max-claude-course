import { test, expect } from "@playwright/test";
import { nanoid } from "nanoid";

test.describe("Authentication", () => {
  test("user can sign up and is redirected to dashboard", async ({ page }) => {
    const email = `test-${nanoid(6)}@example.com`;
    await page.goto("/authenticate");
    await page.getByRole("button", { name: "Sign up" }).first().click();
    await page.fill("#signup-name", "E2E User");
    await page.fill("#signup-email", email);
    await page.fill("#signup-password", "password123");
    await page.locator("form").getByRole("button", { name: "Sign up" }).click();
    await page.waitForURL("/dashboard");
    await page.reload();
    await expect(page.getByRole("heading", { name: "My Notes" })).toBeVisible();
  });

  test("user can log in after signing up", async ({ page }) => {
    const email = `login-${nanoid(6)}@example.com`;
    // Sign up first
    await page.goto("/authenticate");
    await page.getByRole("button", { name: "Sign up" }).first().click();
    await page.fill("#signup-name", "Login User");
    await page.fill("#signup-email", email);
    await page.fill("#signup-password", "password123");
    await page.locator("form").getByRole("button", { name: "Sign up" }).click();
    await page.waitForURL("/dashboard");
    await page.reload();

    // Log out
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("/");

    // Log in
    await page.goto("/authenticate");
    await page.fill("#login-email", email);
    await page.fill("#login-password", "password123");
    await page.locator("form").getByRole("button", { name: "Log in" }).click();
    await page.waitForURL("/dashboard");
    await page.reload();
    await expect(page.getByRole("heading", { name: "My Notes" })).toBeVisible();
  });

  test("invalid credentials show error", async ({ page }) => {
    await page.goto("/authenticate");
    await page.fill("#login-email", "nobody@example.com");
    await page.fill("#login-password", "wrongpassword");
    await page.locator("form").getByRole("button", { name: "Log in" }).click();
    await expect(page.getByRole("alert")).toBeVisible();
  });

  test("logout clears session", async ({ page }) => {
    const email = `logout-${nanoid(6)}@example.com`;
    await page.goto("/authenticate");
    await page.getByRole("button", { name: "Sign up" }).first().click();
    await page.fill("#signup-name", "Logout User");
    await page.fill("#signup-email", email);
    await page.fill("#signup-password", "password123");
    await page.locator("form").getByRole("button", { name: "Sign up" }).click();
    await page.waitForURL("/dashboard");
    await page.reload();

    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("/");

    // Try to access dashboard - should redirect to authenticate
    await page.goto("/dashboard");
    await expect(page).toHaveURL("/authenticate");
  });
});
