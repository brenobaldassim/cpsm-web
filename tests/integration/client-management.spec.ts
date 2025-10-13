import { test, expect } from '@playwright/test'

/**
 * Integration Test: Client Management
 * Based on Scenario 2 from quickstart.md
 *
 * Tests complete CRUD operations for clients including:
 * - View client list
 * - Create clients with addresses (1 or 2)
 * - CPF validation
 * - Edit client information
 * - Delete clients (with/without sales)
 *
 * EXPECTED: These tests will FAIL until implementation is complete (T044-T045).
 */

test.describe('Client Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/')
  })

  test('should navigate to clients page', async ({ page }) => {
    await page.click('text=/clients/i')
    await expect(page).toHaveURL('/clients')
  })

  test('should display client list with columns', async ({ page }) => {
    await page.goto('/clients')

    // Should have table headers
    await expect(page.locator('text=/name/i')).toBeVisible()
    await expect(page.locator('text=/email/i')).toBeVisible()
    await expect(page.locator('text=/cpf/i')).toBeVisible()
    await expect(page.locator('text=/actions/i')).toBeVisible()

    // Should have "Add Client" button
    await expect(page.locator('text=/add.*client/i')).toBeVisible()
  })

  test('should create client with one HOME address', async ({ page }) => {
    await page.goto('/clients')
    await page.click('text=/add.*client/i')

    // Fill client form
    await page.fill('input[name="firstName"]', 'João')
    await page.fill('input[name="lastName"]', 'Silva')
    await page.fill('input[name="email"]', 'joao.silva@example.com')
    await page.fill('input[name="cpf"]', '123.456.789-09')
    await page.fill('input[name="socialMedia"]', '@joaosilva')

    // Fill HOME address
    await page.selectOption('select[name*="type"]', 'HOME')
    await page.fill('input[name*="street"]', 'Rua das Flores')
    await page.fill('input[name*="number"]', '123')
    await page.fill('input[name*="city"]', 'São Paulo')
    await page.selectOption('select[name*="state"]', 'SP')
    await page.fill('input[name*="cep"]', '01234-567')

    // Submit form
    await page.click('button[type="submit"]')

    // Should show success message
    await expect(page.locator('text=/success|created/i')).toBeVisible()

    // Should redirect to client list
    await expect(page).toHaveURL('/clients')

    // Should see new client in list
    await expect(page.locator('text=João Silva')).toBeVisible()
  })

  test('should create client with two addresses (HOME + WORK)', async ({
    page,
  }) => {
    await page.goto('/clients')
    await page.click('text=/add.*client/i')

    // Fill client info
    await page.fill('input[name="firstName"]', 'Maria')
    await page.fill('input[name="lastName"]', 'Santos')
    await page.fill('input[name="email"]', 'maria@example.com')
    await page.fill('input[name="cpf"]', '987.654.321-00')

    // Fill HOME address
    await page.selectOption('select[name*="addresses.0.type"]', 'HOME')
    await page.fill('input[name*="addresses.0.street"]', 'Rua A')
    await page.fill('input[name*="addresses.0.number"]', '100')
    await page.fill('input[name*="addresses.0.city"]', 'Rio de Janeiro')
    await page.selectOption('select[name*="addresses.0.state"]', 'RJ')
    await page.fill('input[name*="addresses.0.cep"]', '20000-000')

    // Click "Add Another Address"
    await page.click('text=/add.*address/i')

    // Fill WORK address
    await page.selectOption('select[name*="addresses.1.type"]', 'WORK')
    await page.fill('input[name*="addresses.1.street"]', 'Av B')
    await page.fill('input[name*="addresses.1.number"]', '200')
    await page.fill('input[name*="addresses.1.city"]', 'Rio de Janeiro')
    await page.selectOption('select[name*="addresses.1.state"]', 'RJ')
    await page.fill('input[name*="addresses.1.cep"]', '20100-000')

    // Submit
    await page.click('button[type="submit"]')

    // Verify success
    await expect(page.locator('text=/success|created/i')).toBeVisible()
    await expect(page.locator('text=Maria Santos')).toBeVisible()
  })

  test('should validate CPF format', async ({ page }) => {
    await page.goto('/clients')
    await page.click('text=/add.*client/i')

    // Fill form with invalid CPF
    await page.fill('input[name="firstName"]', 'Test')
    await page.fill('input[name="lastName"]', 'User')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="cpf"]', '123.456.789-00') // Invalid check digits

    // Fill required address
    await page.selectOption('select[name*="type"]', 'HOME')
    await page.fill('input[name*="street"]', 'Rua X')
    await page.fill('input[name*="number"]', '1')
    await page.fill('input[name*="city"]', 'São Paulo')
    await page.selectOption('select[name*="state"]', 'SP')
    await page.fill('input[name*="cep"]', '01234-567')

    // Try to submit
    await page.click('button[type="submit"]')

    // Should show CPF validation error
    await expect(page.locator('text=/invalid.*cpf/i')).toBeVisible()
  })

  test('should reject duplicate CPF', async ({ page }) => {
    // First, create a client
    await page.goto('/clients')
    await page.click('text=/add.*client/i')

    await page.fill('input[name="firstName"]', 'First')
    await page.fill('input[name="lastName"]', 'Client')
    await page.fill('input[name="email"]', 'first@example.com')
    await page.fill('input[name="cpf"]', '111.222.333-44')
    await page.selectOption('select[name*="type"]', 'HOME')
    await page.fill('input[name*="street"]', 'Rua X')
    await page.fill('input[name*="number"]', '1')
    await page.fill('input[name*="city"]', 'São Paulo')
    await page.selectOption('select[name*="state"]', 'SP')
    await page.fill('input[name*="cep"]', '01234-567')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/success/i')).toBeVisible()

    // Try to create another client with same CPF
    await page.click('text=/add.*client/i')

    await page.fill('input[name="firstName"]', 'Second')
    await page.fill('input[name="lastName"]', 'Client')
    await page.fill('input[name="email"]', 'second@example.com')
    await page.fill('input[name="cpf"]', '111.222.333-44') // Duplicate
    await page.selectOption('select[name*="type"]', 'HOME')
    await page.fill('input[name*="street"]', 'Rua Y')
    await page.fill('input[name*="number"]', '2')
    await page.fill('input[name*="city"]', 'São Paulo')
    await page.selectOption('select[name*="state"]', 'SP')
    await page.fill('input[name*="cep"]', '01234-567')
    await page.click('button[type="submit"]')

    // Should show duplicate CPF error
    await expect(page.locator('text=/cpf.*already.*registered/i')).toBeVisible()
  })

  test('should edit client information', async ({ page }) => {
    await page.goto('/clients')

    // Click edit on the first client
    await page
      .locator('button[title*="Edit"], a[href*="/clients/"][href*="/edit"]')
      .first()
      .click()

    // Update name
    await page.fill('input[name="lastName"]', 'Silva Santos')
    await page.fill('input[name="socialMedia"]', '@updated')

    // Save changes
    await page.click('button[type="submit"]')

    // Verify update
    await expect(page.locator('text=/success|updated/i')).toBeVisible()
    await expect(page.locator('text=Silva Santos')).toBeVisible()
  })

  test('should delete client without sales', async ({ page }) => {
    // Create a fresh client
    await page.goto('/clients')
    await page.click('text=/add.*client/i')

    await page.fill('input[name="firstName"]', 'ToDelete')
    await page.fill('input[name="lastName"]', 'Client')
    await page.fill('input[name="email"]', 'delete@example.com')
    await page.fill('input[name="cpf"]', '555.666.777-88')
    await page.selectOption('select[name*="type"]', 'HOME')
    await page.fill('input[name*="street"]', 'Rua X')
    await page.fill('input[name*="number"]', '1')
    await page.fill('input[name*="city"]', 'São Paulo')
    await page.selectOption('select[name*="state"]', 'SP')
    await page.fill('input[name*="cep"]', '01234-567')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=/success/i')).toBeVisible()

    // Now delete it
    await page
      .locator('text=ToDelete Client')
      .locator('..')
      .locator('button[title*="Delete"]')
      .click()

    // Confirm deletion
    await page.click('text=/confirm|yes|delete/i')

    // Should show success and client removed
    await expect(page.locator('text=/deleted|removed/i')).toBeVisible()
    await expect(page.locator('text=ToDelete Client')).not.toBeVisible()
  })

  test('should prevent deleting client with sales', async ({ page }) => {
    await page.goto('/clients')

    // Find a client that has sales (from seed data)
    const clientWithSales = page.locator('text=/client.*with.*sales/i').first()

    if ((await clientWithSales.count()) > 0) {
      // Click delete
      await clientWithSales
        .locator('..')
        .locator('button[title*="Delete"]')
        .click()

      // Confirm
      await page.click('text=/confirm|yes|delete/i')

      // Should show error
      await expect(page.locator('text=/cannot.*delete.*sales/i')).toBeVisible()
    }
  })

  test('should search clients by name', async ({ page }) => {
    await page.goto('/clients')

    // Enter search term
    await page.fill('input[placeholder*="Search"]', 'Silva')

    // Should filter results
    await expect(page.locator('text=Silva')).toBeVisible()
  })

  test('should paginate client list', async ({ page }) => {
    await page.goto('/clients')

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
