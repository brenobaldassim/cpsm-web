/**
 * Products tRPC Router Contracts
 * Feature: 001-build-an-application
 *
 * Procedures for product management (CRUD operations with stock tracking).
 */

import { z } from "zod"

// ============================================================================
// Input Schemas
// ============================================================================

export const createProductInput = z.object({
  name: z.string().min(1).max(255),
  priceInCents: z.number().int().positive(),
  stockQty: z.number().int().nonnegative().default(0),
})

export const updateProductInput = z.object({
  id: z.string(),
  name: z.string().min(1).max(255).optional(),
  priceInCents: z.number().int().positive().optional(),
  stockQty: z.number().int().nonnegative().optional(),
})

export const deleteProductInput = z.object({
  id: z.string(),
})

export const getProductInput = z.object({
  id: z.string(),
})

export const listProductsInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(), // Search by name
  inStockOnly: z.boolean().default(false), // Filter products with stock > 0
  sortBy: z
    .enum(["name", "priceInCents", "stockQty", "createdAt"])
    .default("name"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
})

export const checkStockInput = z.object({
  productId: z.string(),
  requestedQty: z.number().int().positive(),
})

// ============================================================================
// Output Schemas
// ============================================================================

export const productOutput = z.object({
  id: z.string(),
  name: z.string(),
  priceInCents: z.number(),
  stockQty: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const productListOutput = z.object({
  products: z.array(productOutput),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
})

export const stockCheckOutput = z.object({
  available: z.boolean(),
  currentStock: z.number(),
  requestedQty: z.number(),
})

// ============================================================================
// Procedure Definitions
// ============================================================================

/**
 * products.create
 *
 * Create a new product with initial stock.
 *
 * Input:
 *   - name: Product name (required)
 *   - priceInCents: Price in cents (positive integer)
 *   - stockQty: Initial stock quantity (non-negative, default: 0)
 *
 * Output:
 *   - product: Created product
 *
 * Errors:
 *   - BAD_REQUEST: Invalid price or stock quantity
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Valid product with stock → Success
 *   2. Valid product without stock (default 0) → Success
 *   3. Negative price → Validation error
 *   4. Zero price → Validation error
 *   5. Negative stock → Validation error
 *   6. Non-integer price → Validation error
 */
export const createProductProcedure = {
  input: createProductInput,
  output: productOutput,
}

/**
 * products.update
 *
 * Update product information (name, price, or stock).
 * Price changes only affect future sales.
 *
 * Input:
 *   - id: Product ID (required)
 *   - name: New name (optional)
 *   - priceInCents: New price (optional)
 *   - stockQty: New stock quantity (optional)
 *
 * Output:
 *   - product: Updated product
 *
 * Errors:
 *   - NOT_FOUND: Product doesn't exist
 *   - BAD_REQUEST: Invalid input
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Update name → Success
 *   2. Update price → Success (historical sales unaffected)
 *   3. Update stock → Success
 *   4. Non-existent product → NOT_FOUND
 *   5. Invalid price → Validation error
 */
export const updateProductProcedure = {
  input: updateProductInput,
  output: productOutput,
}

/**
 * products.delete
 *
 * Delete a product (only if no associated sales).
 *
 * Input:
 *   - id: Product ID
 *
 * Output:
 *   - success: boolean
 *
 * Errors:
 *   - NOT_FOUND: Product doesn't exist
 *   - CONFLICT: Product has associated sales
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Product with no sales → Success
 *   2. Product with sales → CONFLICT error
 *   3. Non-existent product → NOT_FOUND
 */
export const deleteProductProcedure = {
  input: deleteProductInput,
  output: z.object({ success: z.boolean() }),
}

/**
 * products.getById
 *
 * Get product by ID.
 *
 * Input:
 *   - id: Product ID
 *
 * Output:
 *   - product: Product details
 *
 * Errors:
 *   - NOT_FOUND: Product doesn't exist
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Existing product → Return product
 *   2. Non-existent product → NOT_FOUND
 */
export const getProductProcedure = {
  input: getProductInput,
  output: productOutput,
}

/**
 * products.list
 *
 * List products with pagination, search, and filtering.
 *
 * Input:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 20, max: 100)
 *   - search: Search term for name (optional)
 *   - inStockOnly: Filter products with stock > 0 (default: false)
 *   - sortBy: Field to sort by (default: name)
 *   - sortOrder: asc or desc (default: asc)
 *
 * Output:
 *   - products: Array of products
 *   - total: Total count
 *   - page: Current page
 *   - limit: Items per page
 *   - totalPages: Total pages
 *
 * Test Cases:
 *   1. No filters → Return paginated list
 *   2. With search → Filter by name
 *   3. inStockOnly → Only products with stock > 0
 *   4. With sorting → Return sorted results
 *   5. Empty result → Return empty array
 */
export const listProductsProcedure = {
  input: listProductsInput,
  output: productListOutput,
}

/**
 * products.checkStock
 *
 * Check if requested quantity is available in stock.
 * Used before creating sales to validate stock availability.
 *
 * Input:
 *   - productId: Product ID
 *   - requestedQty: Quantity requested
 *
 * Output:
 *   - available: boolean (true if stock sufficient)
 *   - currentStock: Current stock level
 *   - requestedQty: Requested quantity (echo)
 *
 * Errors:
 *   - NOT_FOUND: Product doesn't exist
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Sufficient stock → available: true
 *   2. Insufficient stock → available: false
 *   3. Exact stock match → available: true
 *   4. Zero stock → available: false
 *   5. Non-existent product → NOT_FOUND
 */
export const checkStockProcedure = {
  input: checkStockInput,
  output: stockCheckOutput,
}

// ============================================================================
// Contract Summary
// ============================================================================

export const productsContract = {
  create: createProductProcedure,
  update: updateProductProcedure,
  delete: deleteProductProcedure,
  getById: getProductProcedure,
  list: listProductsProcedure,
  checkStock: checkStockProcedure,
}
