import type { Page } from "@playwright/test";

export async function signUp(
  page: Page,
  name: string,
  email: string,
  password: string
) {
  await page.goto("/authenticate");
  await page.getByRole("button", { name: "Sign up" }).first().click();
  await page.fill("#signup-name", name);
  await page.fill("#signup-email", email);
  await page.fill("#signup-password", password);
  await page.locator("form").getByRole("button", { name: "Sign up" }).click();
  await page.waitForURL("/dashboard");
  // Full reload to ensure server components see the session cookie
  await page.reload();
  await page.waitForSelector('button:has-text("Logout")');
}

export async function login(page: Page, email: string, password: string) {
  await page.goto("/authenticate");
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.locator("form").getByRole("button", { name: "Log in" }).click();
  await page.waitForURL("/dashboard");
  await page.reload();
}
