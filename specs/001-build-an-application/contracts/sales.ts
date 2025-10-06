/**
 * Sales tRPC Router Contracts
 * Feature: 001-build-an-application
 *
 * Procedures for sales management with price preservation and stock tracking.
 */

import { z } from "zod";

// ============================================================================
// Input Schemas
// ============================================================================

export const saleItemInput = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const createSaleInput = z.object({
  clientId: z.string(),
  saleDate: z.date().default(() => new Date()),
  items: z.array(saleItemInput).min(1), // At least one product
});

export const getSaleInput = z.object({
  id: z.string(),
});

export const listSalesInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  clientId: z.string().optional(), // Filter by client
  dateFrom: z.date().optional(), // Filter by date range
  dateTo: z.date().optional(),
  sortBy: z.enum(["saleDate", "totalAmount", "createdAt"]).default("saleDate"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const filterSalesInput = z.object({
  startDate: z.date(),
  endDate: z.date(),
  clientId: z.string().optional(),
  minAmount: z.number().int().nonnegative().optional(), // In cents
  maxAmount: z.number().int().positive().optional(), // In cents
});

// ============================================================================
// Output Schemas
// ============================================================================

export const saleItemOutput = z.object({
  id: z.string(),
  productId: z.string(),
  productName: z.string(), // Joined from Product
  quantity: z.number(),
  priceInCents: z.number(), // Price at time of sale
  lineTotal: z.number(), // quantity × priceInCents
});

export const saleOutput = z.object({
  id: z.string(),
  clientId: z.string(),
  clientName: z.string(), // Joined from Client (firstName + lastName)
  saleDate: z.date(),
  totalAmount: z.number(), // Sum of all line totals
  items: z.array(saleItemOutput),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const saleListOutput = z.object({
  sales: z.array(saleOutput),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

export const saleSummaryOutput = z.object({
  totalSales: z.number(),
  totalRevenue: z.number(), // In cents
  averageSaleAmount: z.number(), // In cents
  periodStart: z.date(),
  periodEnd: z.date(),
});

// ============================================================================
// Procedure Definitions
// ============================================================================

/**
 * sales.create
 *
 * Create a new sale with multiple products.
 * Captures current product prices and decrements stock automatically.
 *
 * Input:
 *   - clientId: Client making the purchase (required)
 *   - saleDate: Date of sale (default: now)
 *   - items: Array of products and quantities (min: 1)
 *
 * Output:
 *   - sale: Created sale with items and calculated totals
 *
 * Errors:
 *   - NOT_FOUND: Client or product doesn't exist
 *   - CONFLICT: Insufficient stock for one or more products
 *   - BAD_REQUEST: Invalid quantities or empty items
 *   - UNAUTHORIZED: Not authenticated
 *
 * Business Logic:
 *   1. Validate client exists
 *   2. For each item:
 *      a. Validate product exists
 *      b. Check stock availability
 *      c. Capture current price
 *   3. Create sale with total amount
 *   4. Create sale items with price snapshots
 *   5. Decrement stock for each product
 *
 * Test Cases:
 *   1. Valid sale with 1 product → Success, stock decremented
 *   2. Valid sale with multiple products → Success, all stocks decremented
 *   3. Insufficient stock → CONFLICT, no changes made
 *   4. Non-existent client → NOT_FOUND
 *   5. Non-existent product → NOT_FOUND
 *   6. Zero quantity → Validation error
 *   7. Empty items array → Validation error
 *   8. Price changes after sale → Historical price preserved
 */
export const createSaleProcedure = {
  input: createSaleInput,
  output: saleOutput,
};

/**
 * sales.getById
 *
 * Get sale by ID with all items and client information.
 *
 * Input:
 *   - id: Sale ID
 *
 * Output:
 *   - sale: Sale with items, client name, and totals
 *
 * Errors:
 *   - NOT_FOUND: Sale doesn't exist
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Existing sale → Return sale with all details
 *   2. Non-existent sale → NOT_FOUND
 *   3. Verify price snapshot preserved → Match original, not current price
 */
export const getSaleProcedure = {
  input: getSaleInput,
  output: saleOutput,
};

/**
 * sales.list
 *
 * List sales with pagination and filtering.
 * Default: Last 30 days (as per requirements).
 *
 * Input:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 20, max: 100)
 *   - clientId: Filter by client (optional)
 *   - dateFrom: Start date (optional, default: 30 days ago)
 *   - dateTo: End date (optional, default: now)
 *   - sortBy: Field to sort by (default: saleDate)
 *   - sortOrder: asc or desc (default: desc - newest first)
 *
 * Output:
 *   - sales: Array of sales with items
 *   - total: Total count
 *   - page: Current page
 *   - limit: Items per page
 *   - totalPages: Total pages
 *
 * Test Cases:
 *   1. No filters → Return last 30 days, paginated
 *   2. With date range → Filter by dates
 *   3. Filter by client → Only sales for that client
 *   4. With sorting → Return sorted results
 *   5. Empty result → Return empty array
 *   6. Default behavior → Last 30 days
 */
export const listSalesProcedure = {
  input: listSalesInput,
  output: saleListOutput,
};

/**
 * sales.filter
 *
 * Advanced filtering for sales analytics.
 *
 * Input:
 *   - startDate: Start of date range (required)
 *   - endDate: End of date range (required)
 *   - clientId: Filter by client (optional)
 *   - minAmount: Minimum sale amount in cents (optional)
 *   - maxAmount: Maximum sale amount in cents (optional)
 *
 * Output:
 *   - sales: Array of matching sales
 *
 * Test Cases:
 *   1. Date range only → All sales in period
 *   2. With client filter → Sales for specific client
 *   3. With amount range → Sales within amount bounds
 *   4. All filters combined → Intersection of filters
 *   5. No matches → Empty array
 */
export const filterSalesProcedure = {
  input: filterSalesInput,
  output: z.array(saleOutput),
};

/**
 * sales.getSummary
 *
 * Get sales summary statistics for a date range.
 *
 * Input:
 *   - startDate: Start of period
 *   - endDate: End of period
 *   - clientId: Filter by client (optional)
 *
 * Output:
 *   - totalSales: Count of sales
 *   - totalRevenue: Sum of all sale amounts (in cents)
 *   - averageSaleAmount: Average sale amount (in cents)
 *   - periodStart: Start date (echo)
 *   - periodEnd: End date (echo)
 *
 * Test Cases:
 *   1. With sales in period → Return calculated statistics
 *   2. No sales in period → Return zeros
 *   3. Single sale → Correct average
 *   4. Filter by client → Statistics for that client only
 */
export const getSummaryProcedure = {
  input: z.object({
    startDate: z.date(),
    endDate: z.date(),
    clientId: z.string().optional(),
  }),
  output: saleSummaryOutput,
};

// ============================================================================
// Contract Summary
// ============================================================================

export const salesContract = {
  create: createSaleProcedure,
  getById: getSaleProcedure,
  list: listSalesProcedure,
  filter: filterSalesProcedure,
  getSummary: getSummaryProcedure,
};
