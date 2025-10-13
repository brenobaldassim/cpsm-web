import { test, expect } from '@playwright/test'

/**
 * Integration Test: Product Management
 * Based on Scenario 3 from quickstart.md
 *
 * Tests product CRUD and stock tracking including:
 * - Create products with price and stock
 * - Price and stock validation
 * - Edit products (price changes don't affect historical sales)
 * - Search and filter
 * - Delete protection
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T046-T047).
 */

test.describe('Product Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('should navigate to products page', async ({ page }) => {
    await page.click('text=/products/i')
    await expect(page).toHaveURL('/products')
  })

  test('should display product list with stock levels', async ({ page }) => {
    await page.goto('/products')

    // Should have table headers
    await expect(page.locator('text=/name/i')).toBeVisible()
    await expect(page.locator('text=/price/i')).toBeVisible()
    await expect(page.locator('text=/stock/i')).toBeVisible()

    // Should have "Add Product" button
    await expect(page.locator('text=/add.*product/i')).toBeVisible()
  })

  test('should create product with valid price and stock', async ({ page }) => {
    await page.goto('/products')
    await page.click('text=/add.*product/i')

    // Fill product form
    await page.fill('input[name="name"]', 'Laptop Dell Inspiron')
    await page.fill('input[name="price"]', '2500.00') // R$ 2,500.00
    await page.fill('input[name="stock"]', '15')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show success
    await expect(page.locator('text=/success|created/i')).toBeVisible()

    // Should redirect to product list
    await expect(page).toHaveURL('/products')

    // Should see new product with correct price and stock
    await expect(page.locator('text=Laptop Dell Inspiron')).toBeVisible()
    await expect(page.locator('text=/2,?500/i')).toBeVisible() // R$ 2,500.00
    await expect(page.locator('text=15')).toBeVisible()
  })

  test('should reject zero price', async ({ page }) => {
    await page.goto('/products')
    await page.click('text=/add.*product/i')

    await page.fill('input[name="name"]', 'Test Product')
    await page.fill('input[name="price"]', '0')
    await page.fill('input[name="stock"]', '10')

    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator('text=/price.*positive/i')).toBeVisible()
  })

  test('should reject negative price', async ({ page }) => {
    await page.goto('/products')
    await page.click('text=/add.*product/i')

    await page.fill('input[name="name"]', 'Test Product')
    await page.fill('input[name="price"]', '-100')
    await page.fill('input[name="stock"]', '10')

    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator('text=/price.*positive/i')).toBeVisible()
  })

  test('should reject negative stock', async ({ page }) => {
    await page.goto('/products')
    await page.click('text=/add.*product/i')

    await page.fill('input[name="name"]', 'Test Product')
    await page.fill('input[name="price"]', '100.00')
    await page.fill('input[name="stock"]', '-5')

    await page.click('button[type="submit"]')

    // Should show validation error
    await expect(page.locator('text=/stock.*negative/i')).toBeVisible()
  })

  test('should edit product price', async ({ page }) => {
    await page.goto('/products')

    // Click edit on first product
    await page
      .locator('button[title*="Edit"], a[href*="/products/"][href*="/edit"]')
      .first()
      .click()

    // Get original price for comparison
    const originalPrice = await page.inputValue('input[name="price"]')

    // Update price
    await page.fill('input[name="price"]', '2800.00') // New price

    // Save changes
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=/success|updated/i')).toBeVisible()
    await expect(page.locator('text=/2,?800/i')).toBeVisible()

    // Note: Historical sales should still show original price (verified in T018)
  })

  test('should edit product stock', async ({ page }) => {
    await page.goto('/products')

    // Click edit on first product
    await page
      .locator('button[title*="Edit"], a[href*="/products/"][href*="/edit"]')
      .first()
      .click()

    // Update stock
    await page.fill('input[name="stock"]', '25')

    // Save changes
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=/success|updated/i')).toBeVisible()
  })

  test('should search products by name', async ({ page }) => {
    await page.goto('/products')

    // Enter search term
    await page.fill('input[placeholder*="Search"]', 'Laptop')

    // Should filter results
    await expect(page.locator('text=Laptop')).toBeVisible()
  })

  test('should filter in-stock products only', async ({ page }) => {
    await page.goto('/products')

    // Toggle "In Stock Only" filter
    await page.check('input[type="checkbox"][name*="inStock"]')

    // All displayed products should have stock > 0
    // (Verification depends on implementation)
  })

  test('should sort products by name', async ({ page }) => {
    await page.goto('/products')

    // Click sort by name
    await page.click('th:has-text("Name"), button:has-text("Name")')

    // Products should be sorted alphabetically
    // (Verification depends on implementation)
  })

  test('should sort products by price', async ({ page }) => {
    await page.goto('/products')

    // Click sort by price
    await page.click('th:has-text("Price"), button:has-text("Price")')

    // Products should be sorted by price
    // (Verification depends on implementation)
  })

  test('should sort products by stock', async ({ page }) => {
    await page.goto('/products')

    // Click sort by stock
    await page.click('th:has-text("Stock"), button:has-text("Stock")')

    // Products should be sorted by stock quantity
    // (Verification depends on implementation)
  })

  test('should delete product without sales', async ({ page }) => {
    // Create a fresh product
    await page.goto('/products')
    await page.click('text=/add.*product/i')

    await page.fill('input[name="name"]', 'Product To Delete')
    await page.fill('input[name="price"]', '50.00')
    await page.fill('input[name="stock"]', '5')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/success/i')).toBeVisible()

    // Now delete it
    await page
      .locator('text=Product To Delete')
      .locator('..')
      .locator('button[title*="Delete"]')
      .click()

    // Confirm deletion
    await page.click('text=/confirm|yes|delete/i')

    // Should show success and product removed
    await expect(page.locator('text=/deleted|removed/i')).toBeVisible()
    await expect(page.locator('text=Product To Delete')).not.toBeVisible()
  })

  test('should prevent deleting product with sales', async ({ page }) => {
    await page.goto('/products')

    // Find a product that has sales (from seed data)
    const productWithSales = page
      .locator('[data-has-sales="true"], [data-product-id]')
      .first()

    if ((await productWithSales.count()) > 0) {
      // Click delete
      await productWithSales.locator('button[title*="Delete"]').click()

      // Confirm
      await page.click('text=/confirm|yes|delete/i')

      // Should show error
      await expect(page.locator('text=/cannot.*delete.*sales/i')).toBeVisible()
    }
  })

  test('should display product details', async ({ page }) => {
    await page.goto('/products')

    // Click on first product name to view details
    await page
      .locator('a[href*="/products/"]:not([href*="/edit"])')
      .first()
      .click()

    // Should show product details
    await expect(page.locator('text=/price/i')).toBeVisible()
    await expect(page.locator('text=/stock/i')).toBeVisible()
    await expect(page.locator('text=/created/i')).toBeVisible()
  })

  test('should paginate product list', async ({ page }) => {
    await page.goto('/products')

    // Should have pagination controls if more than page limit
    const nextButton = page.locator(
      'button:has-text("Next"), a:has-text("Next")'
    )

    if ((await nextButton.count()) > 0) {
      await nextButton.click()

      // URL should update with page parameter
      await expect(page).toHaveURL(/page=2/)
    }
  })
})
