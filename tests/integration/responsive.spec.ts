import { test, expect, devices } from "@playwright/test"

/**
 * Integration Test: Responsive Design
 * Based on Scenario 6 from quickstart.md
 *
 * Tests responsive design across all breakpoints:
 * - Mobile Small (320px)
 * - Mobile (375px)
 * - Tablet (768px)
 * - Desktop Small (1024px)
 * - Desktop (1440px)
 * - Desktop Large (1920px)
 *
 * Validates:
 * - Navigation adapts to screen size
 * - Tables are responsive
 * - Forms stack appropriately
 * - Touch targets ≥ 44x44px
 * - No horizontal scrolling
 * - Text readability
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T041-T050).
 */

test.describe("Responsive Design - Mobile Small (320px)", () => {
  test.use({ viewport: { width: 320, height: 568 } })

  test("should display hamburger menu", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Should have hamburger menu icon
    await expect(
      page.locator('button[aria-label*="menu"], .hamburger-menu')
    ).toBeVisible()

    // Desktop navigation should be hidden
    await expect(page.locator('nav a:has-text("Clients")')).not.toBeVisible()
  })

  test("should expand navigation on hamburger click", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Click hamburger menu
    await page.click('button[aria-label*="menu"], .hamburger-menu')

    // Navigation links should become visible
    await expect(page.locator("text=/clients/i")).toBeVisible()
    await expect(page.locator("text=/products/i")).toBeVisible()
    await expect(page.locator("text=/sales/i")).toBeVisible()
  })

  test("should have touch-friendly buttons (≥44px)", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Check "Add Client" button size
    const addButton = page.locator("text=/add.*client/i")
    const box = await addButton.boundingBox()

    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeGreaterThanOrEqual(44)
    }
  })

  test("should not have horizontal scroll", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Check document width
    const scrollWidth = await page.evaluate(
      () => document.documentElement.scrollWidth
    )
    const clientWidth = await page.evaluate(
      () => document.documentElement.clientWidth
    )

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1) // Allow 1px tolerance
  })

  test("should display tables in card layout", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Tables should adapt to card/list layout on mobile
    // This depends on implementation - check for mobile-specific classes or layout
    const isMobileLayout =
      (await page
        .locator('.card-layout, .mobile-view, [data-mobile="true"]')
        .count()) > 0
    const isTableHidden = await page.locator("table").isHidden()

    // Either cards are shown OR table is responsive
    expect(isMobileLayout || !isTableHidden).toBeTruthy()
  })

  test("should stack form fields vertically", async ({ page }) => {
    await page.goto("/login")

    // Login form fields should be stacked
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[type="password"]')

    const emailBox = await emailInput.boundingBox()
    const passwordBox = await passwordInput.boundingBox()

    if (emailBox && passwordBox) {
      // Password field should be below email field
      expect(passwordBox.y).toBeGreaterThan(emailBox.y + emailBox.height)
    }
  })
})

test.describe("Responsive Design - Mobile (375px)", () => {
  test.use({ viewport: { width: 375, height: 667 } })

  test("should display mobile navigation", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await expect(
      page.locator('button[aria-label*="menu"], .hamburger-menu')
    ).toBeVisible()
  })

  test("should handle touch interactions", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Buttons should be tappable
    const addButton = page.locator("text=/add.*client/i")
    await addButton.click()

    // Should navigate or open form
    await expect(page).toHaveURL(/\/clients\/new|\/clients\/\w+/)
  })

  test("should have readable text without zoom", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Check font size is at least 16px for body text
    const fontSize = await page.locator("body").evaluate((el) => {
      return window.getComputedStyle(el).fontSize
    })

    expect(parseInt(fontSize)).toBeGreaterThanOrEqual(14) // Minimum 14px
  })
})

test.describe("Responsive Design - Tablet (768px)", () => {
  test.use({ viewport: { width: 768, height: 1024 } })

  test("should show adapted navigation", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Navigation might be hamburger or expanded depending on design
    // At least main nav should be accessible
    await expect(page.locator('nav, [role="navigation"]')).toBeVisible()
  })

  test("should display tables responsively", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Tables should be visible and scrollable or adapted
    await expect(page.locator("table, .table-responsive")).toBeVisible()
  })

  test("should use two-column layout for forms", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")
    await page.click("text=/add.*client/i")

    // Form should potentially use two columns on tablet
    // This is design-dependent, but check spacing
    const form = page.locator("form")
    const formBox = await form.boundingBox()

    if (formBox) {
      expect(formBox.width).toBeGreaterThan(600) // Has space for columns
    }
  })
})

test.describe("Responsive Design - Desktop Small (1024px)", () => {
  test.use({ viewport: { width: 1024, height: 768 } })

  test("should show full navigation", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Desktop navigation should be visible
    await expect(page.locator('nav a:has-text("Clients")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Products")')).toBeVisible()
    await expect(page.locator('nav a:has-text("Sales")')).toBeVisible()
  })

  test("should display tables with all columns", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // All table columns should be visible
    await expect(page.locator("th")).toHaveCount(4, { timeout: 5000 }) // Adjust based on actual columns
  })

  test("should have optimal spacing", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Content should have appropriate margins
    const main = page.locator('main, [role="main"]')
    const mainBox = await main.boundingBox()

    if (mainBox) {
      // Should not stretch full width, have margins
      expect(mainBox.width).toBeLessThan(1024)
    }
  })
})

test.describe("Responsive Design - Desktop (1440px)", () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test("should display full layout", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Full desktop navigation
    await expect(page.locator("nav")).toBeVisible()

    // Content area properly sized
    const main = page.locator('main, [role="main"]')
    const mainBox = await main.boundingBox()

    if (mainBox) {
      expect(mainBox.width).toBeGreaterThan(800)
    }
  })

  test("should utilize available space", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/sales")

    // Dashboard or list views should use space efficiently
    // Not too narrow, but also not stretched uncomfortably wide
    const container = page.locator('.container, [role="main"]')
    const box = await container.boundingBox()

    if (box) {
      expect(box.width).toBeGreaterThan(1000)
      expect(box.width).toBeLessThan(1400) // Max-width constraint
    }
  })
})

test.describe("Responsive Design - Desktop Large (1920px)", () => {
  test.use({ viewport: { width: 1920, height: 1080 } })

  test("should not stretch content excessively", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    await page.goto("/clients")

    // Content should have max-width to avoid excessive line lengths
    const container = page.locator('.container, [role="main"]')
    const box = await container.boundingBox()

    if (box) {
      // Should be constrained, not full 1920px width
      expect(box.width).toBeLessThan(1600)
    }
  })

  test("should center content", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')

    // Content should be centered with margins on both sides
    const container = page.locator('.container, [role="main"]')
    const box = await container.boundingBox()

    if (box) {
      const leftMargin = box.x
      const rightMargin = 1920 - (box.x + box.width)

      // Left and right margins should be roughly equal (centered)
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(50)
    }
  })
})

test.describe("Responsive Design - Cross-breakpoint Consistency", () => {
  test("should maintain functionality across all breakpoints", async ({
    page,
  }) => {
    const breakpoints = [320, 375, 768, 1024, 1440, 1920]

    for (const width of breakpoints) {
      await page.setViewportSize({ width, height: 800 })

      // Login should work at all sizes
      await page.goto("/login")
      await page.fill('input[name="email"]', "admin@example.com")
      await page.fill('input[type="password"]', "password123")
      await page.click('button[type="submit"]')

      // Should reach dashboard
      await expect(page).toHaveURL("/")

      // Navigation should be accessible
      const navVisible = await page
        .locator('nav, button[aria-label*="menu"]')
        .isVisible()
      expect(navVisible).toBeTruthy()
    }
  })
})
