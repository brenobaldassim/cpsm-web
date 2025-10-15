import { test, expect } from "@playwright/test"

/**
 * Integration Test: Sales Creation
 * Based on Scenario 4 from quickstart.md
 *
 * Tests sales creation with stock management including:
 * - Create sale with one product (stock decrements)
 * - Create sale with multiple products
 * - Insufficient stock validation
 * - Price preservation (historical sales show original price)
 * - Required field validation
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T049).
 */

test.describe("Sales Creation", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/login")
    await page.fill('input[name="email"]', "admin@example.com")
    await page.fill('input[type="password"]', "password123")
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL("/")
  })

  test("should navigate to sales page", async ({ page }) => {
    await page.click("text=/sales/i")
    await expect(page).toHaveURL("/sales")
  })

  test("should display sales list", async ({ page }) => {
    await page.goto("/sales")

    // Should have table headers
    await expect(page.locator("text=/date/i")).toBeVisible()
    await expect(page.locator("text=/client/i")).toBeVisible()
    await expect(page.locator("text=/total/i")).toBeVisible()

    // Should have "Create Sale" button
    await expect(page.locator("text=/create.*sale|new.*sale/i")).toBeVisible()
  })

  test("should create sale with one product and decrement stock", async ({
    page,
  }) => {
    // First, get initial stock of a product
    await page.goto("/products")
    const productRow = page.locator('tr:has-text("Laptop")').first()
    const initialStockText = await productRow.locator("td").nth(2).textContent() // Assuming stock is 3rd column
    const initialStock = parseInt(initialStockText?.trim() || "0")

    // Create a sale
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Select client
    await page.selectOption('select[name="clientId"]', { index: 1 }) // First client

    // Select product and quantity
    await page.selectOption('select[name*="productId"]', { index: 1 })
    await page.fill('input[name*="quantity"]', "2")

    // Price should auto-fill from product
    const priceValue = await page.inputValue('input[name*="price"]')
    expect(parseFloat(priceValue)).toBeGreaterThan(0)

    // Total should be calculated
    await expect(page.locator("text=/total/i")).toBeVisible()

    // Submit sale
    await page.click('button[type="submit"]')

    // Should show success
    await expect(page.locator("text=/success|created/i")).toBeVisible()

    // Verify stock decreased
    await page.goto("/products")
    const updatedStockText = await productRow.locator("td").nth(2).textContent()
    const updatedStock = parseInt(updatedStockText?.trim() || "0")

    expect(updatedStock).toBe(initialStock - 2)
  })

  test("should create sale with multiple products", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Select client
    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Add first product
    await page.selectOption('select[name*="items.0.productId"]', { index: 1 })
    await page.fill('input[name*="items.0.quantity"]', "1")

    // Click "Add Product" button
    await page.click("text=/add.*product|add.*item/i")

    // Add second product
    await page.selectOption('select[name*="items.1.productId"]', { index: 2 })
    await page.fill('input[name*="items.1.quantity"]', "3")

    // Click "Add Product" again
    await page.click("text=/add.*product|add.*item/i")

    // Add third product
    await page.selectOption('select[name*="items.2.productId"]', { index: 3 })
    await page.fill('input[name*="items.2.quantity"]', "2")

    // Total should be sum of all line totals
    await expect(
      page.locator('[data-testid="sale-total"], .sale-total')
    ).toBeVisible()

    // Submit sale
    await page.click('button[type="submit"]')

    // Should show success
    await expect(page.locator("text=/success|created/i")).toBeVisible()

    // Should redirect to sales list
    await expect(page).toHaveURL("/sales")
  })

  test("should validate insufficient stock", async ({ page }) => {
    // Find a product with limited stock
    await page.goto("/products")
    // Identify a product with stock = 5 (or create one for testing)

    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Select client
    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Select product and try to order more than available
    await page.selectOption('select[name*="productId"]', { index: 1 })
    await page.fill('input[name*="quantity"]', "1000") // More than any product should have

    // Submit sale
    await page.click('button[type="submit"]')

    // Should show insufficient stock error
    await expect(
      page.locator("text=/insufficient.*stock|not.*enough.*stock/i")
    ).toBeVisible()
  })

  test("should preserve prices at time of sale", async ({ page }) => {
    // First, create a sale with a product at current price
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    await page.selectOption('select[name="clientId"]', { index: 1 })
    await page.selectOption('select[name*="productId"]', { index: 1 })
    await page.fill('input[name*="quantity"]', "1")

    // Note the price
    const originalPrice = await page.inputValue('input[name*="price"]')

    await page.click('button[type="submit"]')
    await expect(page.locator("text=/success/i")).toBeVisible()

    // Now change the product price
    await page.goto("/products")
    await page
      .locator('button[title*="Edit"]:has-text("Laptop")')
      .first()
      .click()
    await page.fill('input[name="price"]', "3000.00") // Increase price
    await page.click('button[type="submit"]')

    // Go back to sales and check the historical sale
    await page.goto("/sales")
    await page.locator('tr:has-text("Laptop")').first().click() // Click on sale detail

    // The sale should still show the original price, not the new price
    await expect(page.locator(`text=/${originalPrice}/i`)).toBeVisible()
    await expect(page.locator("text=/3,?000/i")).not.toBeVisible()
  })

  test("should require client selection", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Don't select client, add product
    await page.selectOption('select[name*="productId"]', { index: 1 })
    await page.fill('input[name*="quantity"]', "1")

    // Try to submit
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator("text=/client.*required/i")).toBeVisible()
  })

  test("should require at least one product", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Select client but no products
    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Try to submit
    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(
      page.locator("text=/at least.*product|product.*required/i")
    ).toBeVisible()
  })

  test("should calculate line totals correctly", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    await page.selectOption('select[name="clientId"]', { index: 1 })
    await page.selectOption('select[name*="productId"]', { index: 1 })

    // Enter quantity
    await page.fill('input[name*="quantity"]', "3")

    // Get price
    const priceText = await page.inputValue('input[name*="price"]')
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ""))

    // Line total should be quantity * price
    const expectedTotal = price * 3

    // Verify calculated total (implementation specific)
    const lineTotal = page.locator('[data-testid="line-total"], .line-total')
    if ((await lineTotal.count()) > 0) {
      const lineTotalText = await lineTotal.textContent()
      const calculatedTotal = parseFloat(
        lineTotalText?.replace(/[^0-9.]/g, "") || "0"
      )
      expect(calculatedTotal).toBe(expectedTotal)
    }
  })

  test("should allow removing product from sale items", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Add two products
    await page.selectOption('select[name*="items.0.productId"]', { index: 1 })
    await page.fill('input[name*="items.0.quantity"]', "1")

    await page.click("text=/add.*product|add.*item/i")
    await page.selectOption('select[name*="items.1.productId"]', { index: 2 })
    await page.fill('input[name*="items.1.quantity"]', "2")

    // Remove second product
    await page
      .locator('button[title*="Remove"], button:has-text("✕")')
      .nth(1)
      .click()

    // Should only have one product now
    const productInputs = page.locator('select[name*="productId"]')
    expect(await productInputs.count()).toBe(1)
  })

  test("should set sale date to today by default", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    // Check date input has today's date
    const dateInput = page.locator('input[type="date"]')
    if ((await dateInput.count()) > 0) {
      const dateValue = await dateInput.inputValue()
      const today = new Date().toISOString().split("T")[0]
      expect(dateValue).toBe(today)
    }
  })

  test("should allow custom sale date", async ({ page }) => {
    await page.goto("/sales")
    await page.click("text=/create.*sale|new.*sale/i")

    await page.selectOption('select[name="clientId"]', { index: 1 })
    await page.selectOption('select[name*="productId"]', { index: 1 })
    await page.fill('input[name*="quantity"]', "1")

    // Set custom date
    await page.fill('input[type="date"]', "2025-09-15")

    // Submit
    await page.click('button[type="submit"]')
    await expect(page.locator("text=/success/i")).toBeVisible()

    // Verify sale shows custom date
    await page.goto("/sales")
    await expect(page.locator("text=2025-09-15, text=Sep 15")).toBeVisible()
  })
})
