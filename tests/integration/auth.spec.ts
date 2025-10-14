import { test, expect } from "@playwright/test"

/**
 * Integration Test: Authentication Flow
 * Based on Scenario 1 from quickstart.md
 *
 * Tests complete authentication workflow including:
 * - Login with valid/invalid credentials
 * - Session persistence
 * - Logout
 * - Protected route access
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T042-T043).
 */

test.describe("Authentication Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies()
  })

  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/")

    // Should be redirected to login page
    await expect(page).toHaveURL("/login")
  })

  test("should show login form", async ({ page }) => {
    await page.goto("/login")

    // Verify login form elements
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()
  })

  test("should fail login with invalid credentials", async ({ page }) => {
    await page.goto("/login")

    // Enter invalid credentials
    await page.fill('input[name="email"]', "invalid@example.com")
    await page.fill('input[type="password"]', "wrongpassword")
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator("text=/invalid.*credentials/i")).toBeVisible()

    // Should remain on login page
    await expect(page).toHaveURL("/login")
  })

  test("should succeed login with valid credentials", async ({ page }) => {
    await page.goto("/login")

    // Enter valid credentials (from seed data)
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await expect(page).toHaveURL("/")

    // Should show welcome message or user indicator
    await expect(page.locator("text=/welcome|dashboard/i")).toBeVisible()
  })

  test("should persist session across page refresh", async ({ page }) => {
    // Login first
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")

    // Refresh the page
    await page.reload()

    // Should still be on dashboard, not redirected to login
    await expect(page).toHaveURL("/")
    await expect(page.locator("text=/welcome|dashboard/i")).toBeVisible()
  })

  test("should logout and terminate session", async ({ page }) => {
    // Login first
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")

    // Click logout button
    await page.click("text=/logout/i")

    // Should redirect to login
    await expect(page).toHaveURL("/login")

    // Trying to access dashboard should redirect back to login
    await page.goto("/")
    await expect(page).toHaveURL("/login")
  })

  test("should protect routes requiring authentication", async ({ page }) => {
    // Try accessing protected routes without authentication
    const protectedRoutes = ["/clients", "/products", "/sales"]

    for (const route of protectedRoutes) {
      await page.goto(route)
      // Should be redirected to login
      await expect(page).toHaveURL("/login")
    }
  })

  test("should handle invalid email format", async ({ page }) => {
    await page.goto("/login")

    // Enter invalid email format
    await page.fill('input[name="email"]', "not-an-email")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator("text=/invalid.*email/i")).toBeVisible()
  })

  test("should handle short password", async ({ page }) => {
    await page.goto("/login")

    // Enter short password
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "short")
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator("text=/password.*8/i")).toBeVisible()
  })
})
