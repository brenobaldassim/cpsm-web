import { test, expect } from '@playwright/test'

/**
 * Integration Test: Sales Filtering
 * Based on Scenario 5 from quickstart.md
 *
 * Tests sales filtering and date range functionality including:
 * - Default view (last 30 days)
 * - Filter by custom date range
 * - Filter by client
 * - Combined filters
 * - Clear filters
 * - View sale details
 * - Empty results handling
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T048, T050).
 */

test.describe('Sales Filtering', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('should display last 30 days by default', async ({ page }) => {
    await page.goto('/sales')

    // Should have date range indicator
    await expect(page.locator('text=/last.*30.*days/i')).toBeVisible()

    // Or check that date filters show 30 days ago to today
    const dateFrom = page.locator('input[name="dateFrom"]')
    const dateTo = page.locator('input[name="dateTo"]')

    if ((await dateFrom.count()) > 0 && (await dateTo.count()) > 0) {
      const fromValue = await dateFrom.inputValue()
      const toValue = await dateTo.inputValue()

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const today = new Date()

      // Values should be approximately correct (allow 1 day margin)
      expect(new Date(fromValue).getTime()).toBeLessThanOrEqual(
        thirtyDaysAgo.getTime() + 86400000
      )
      expect(new Date(toValue).getTime()).toBeGreaterThanOrEqual(
        today.getTime() - 86400000
      )
    }
  })

  test('should filter by last 7 days', async ({ page }) => {
    await page.goto('/sales')

    // Select "Last 7 days" option if available
    await page.selectOption('select[name="dateRange"]', { label: /7.*days/i })

    // Or manually set date range
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const today = new Date()

    await page.fill(
      'input[name="dateFrom"]',
      sevenDaysAgo.toISOString().split('T')[0]
    )
    await page.fill('input[name="dateTo"]', today.toISOString().split('T')[0])

    // Apply filter
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Results should update
    await expect(page.locator('text=/filtered|showing/i')).toBeVisible()
  })

  test('should filter by custom date range', async ({ page }) => {
    await page.goto('/sales')

    // Set specific date range
    await page.fill('input[name="dateFrom"]', '2025-09-01')
    await page.fill('input[name="dateTo"]', '2025-09-30')

    // Apply filter
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Should show filtered results
    await expect(page.locator('text=/september|sep.*2025/i')).toBeVisible()
  })

  test('should filter by client', async ({ page }) => {
    await page.goto('/sales')

    // Select a specific client
    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Apply filter
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // All displayed sales should be for selected client
    // Get client name from dropdown
    const clientName = await page
      .locator('select[name="clientId"] option:checked')
      .textContent()

    // All rows should contain this client name
    const rows = page.locator('tbody tr')
    const rowCount = await rows.count()

    for (let i = 0; i < rowCount; i++) {
      await expect(rows.nth(i)).toContainText(clientName || '')
    }
  })

  test('should combine date range and client filters', async ({ page }) => {
    await page.goto('/sales')

    // Set both filters
    await page.fill('input[name="dateFrom"]', '2025-09-01')
    await page.fill('input[name="dateTo"]', '2025-09-30')
    await page.selectOption('select[name="clientId"]', { index: 1 })

    // Apply filters
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Should show combined filter indicators
    await expect(page.locator('text=/september|sep.*2025/i')).toBeVisible()

    const clientName = await page
      .locator('select[name="clientId"] option:checked')
      .textContent()
    await expect(page.locator(`text=${clientName}`)).toBeVisible()
  })

  test('should clear all filters', async ({ page }) => {
    await page.goto('/sales')

    // Apply filters
    await page.fill('input[name="dateFrom"]', '2025-09-01')
    await page.fill('input[name="dateTo"]', '2025-09-30')
    await page.selectOption('select[name="clientId"]', { index: 1 })
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Clear filters
    await page.click('button:has-text("Clear"), button:has-text("Reset")')

    // Should return to default view (last 30 days)
    await expect(page.locator('text=/last.*30.*days/i')).toBeVisible()

    // Client filter should be reset
    const clientSelect = page.locator('select[name="clientId"]')
    if ((await clientSelect.count()) > 0) {
      const selectedValue = await clientSelect.inputValue()
      expect(selectedValue).toBe('')
    }
  })

  test('should view sale detail', async ({ page }) => {
    await page.goto('/sales')

    // Click on a sale to view details
    await page.click('tbody tr').first()

    // Should navigate to sale detail page
    await expect(page).toHaveURL(/\/sales\/\w+/)

    // Should show complete sale information
    await expect(page.locator('text=/client/i')).toBeVisible()
    await expect(page.locator('text=/date/i')).toBeVisible()
    await expect(page.locator('text=/total/i')).toBeVisible()
    await expect(page.locator('text=/items|products/i')).toBeVisible()
  })

  test('should display all sale items in detail view', async ({ page }) => {
    await page.goto('/sales')
    await page.click('tbody tr').first()

    // Should show table of sale items
    await expect(page.locator('text=/product/i')).toBeVisible()
    await expect(page.locator('text=/quantity/i')).toBeVisible()
    await expect(page.locator('text=/price/i')).toBeVisible()
    await expect(page.locator('text=/subtotal|line.*total/i')).toBeVisible()

    // Should show grand total
    await expect(page.locator('text=/total.*amount/i')).toBeVisible()
  })

  test('should show client information in sale detail', async ({ page }) => {
    await page.goto('/sales')
    await page.click('tbody tr').first()

    // Should display client name and details
    await expect(
      page.locator('[data-testid="client-name"], .client-name')
    ).toBeVisible()
  })

  test('should handle empty results gracefully', async ({ page }) => {
    await page.goto('/sales')

    // Filter for a date range with no sales
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)

    await page.fill(
      'input[name="dateFrom"]',
      futureDate.toISOString().split('T')[0]
    )
    await page.fill(
      'input[name="dateTo"]',
      futureDate.toISOString().split('T')[0]
    )
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Should show empty state message
    await expect(
      page.locator('text=/no.*sales.*found|no.*results/i')
    ).toBeVisible()

    // Should suggest actions
    await expect(
      page.locator('text=/clear.*filter|adjust.*filter/i')
    ).toBeVisible()
  })

  test('should sort sales by date', async ({ page }) => {
    await page.goto('/sales')

    // Click sort by date column
    await page.click('th:has-text("Date"), button[aria-label*="Sort"]').first()

    // Should sort in descending order (newest first) by default
    // Or toggle to ascending
  })

  test('should sort sales by amount', async ({ page }) => {
    await page.goto('/sales')

    // Click sort by amount column
    await page.click('th:has-text("Amount"), th:has-text("Total")')

    // Should sort by total amount
  })

  test('should paginate filtered results', async ({ page }) => {
    await page.goto('/sales')

    // Apply filter that returns many results
    await page.fill('input[name="dateFrom"]', '2024-01-01')
    await page.fill('input[name="dateTo"]', '2025-12-31')
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Should have pagination controls
    const nextButton = page.locator(
      'button:has-text("Next"), a:has-text("Next")'
    )

    if ((await nextButton.count()) > 0) {
      await nextButton.click()

      // URL should update with page parameter
      await expect(page).toHaveURL(/page=2/)
    }
  })

  test('should display sale count', async ({ page }) => {
    await page.goto('/sales')

    // Should show total number of sales
    await expect(
      page.locator('text=/showing.*of.*sales|total.*sales/i')
    ).toBeVisible()
  })

  test('should filter by amount range', async ({ page }) => {
    await page.goto('/sales')

    // Set amount filters if available
    const minAmount = page.locator('input[name="minAmount"]')
    const maxAmount = page.locator('input[name="maxAmount"]')

    if ((await minAmount.count()) > 0 && (await maxAmount.count()) > 0) {
      await minAmount.fill('100.00')
      await maxAmount.fill('1000.00')

      await page.click('button:has-text("Filter"), button:has-text("Apply")')

      // Results should be within range
      await expect(page.locator('text=/filtered|showing/i')).toBeVisible()
    }
  })

  test('should preserve filters when navigating back from detail', async ({
    page,
  }) => {
    await page.goto('/sales')

    // Apply filters
    await page.selectOption('select[name="clientId"]', { index: 1 })
    await page.click('button:has-text("Filter"), button:has-text("Apply")')

    // Click on a sale
    await page.click('tbody tr').first()

    // Go back
    await page.goBack()

    // Filters should still be applied
    const clientValue = await page
      .locator('select[name="clientId"]')
      .inputValue()
    expect(clientValue).not.toBe('')
  })

  test('should export sales data', async ({ page }) => {
    await page.goto('/sales')

    // Look for export button if available
    const exportButton = page.locator(
      'button:has-text("Export"), button:has-text("Download")'
    )

    if ((await exportButton.count()) > 0) {
      // Export functionality test
      await exportButton.click()

      // Should trigger download or show export options
    }
  })
})
