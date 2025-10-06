/**
 * Clients tRPC Router Contracts
 * Feature: 001-build-an-application
 *
 * Procedures for client management (CRUD operations).
 */

import { z } from "zod";

// ============================================================================
// Validation Helpers
// ============================================================================

/**
 * CPF validation regex and refinement
 * Format: XXX.XXX.XXX-XX or XXXXXXXXXXX
 */
const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/;

const cpfSchema = z
  .string()
  .regex(cpfRegex, "Invalid CPF format")
  .refine(
    (val) => {
      // Remove formatting
      const clean = val.replace(/[^\d]/g, "");
      if (clean.length !== 11) return false;
      if (/^(\d)\1+$/.test(clean)) return false; // All same digit

      // Validate check digits
      let sum = 0;
      for (let i = 0; i < 9; i++) {
        sum += parseInt(clean.charAt(i)) * (10 - i);
      }
      let checkDigit1 = 11 - (sum % 11);
      if (checkDigit1 >= 10) checkDigit1 = 0;
      if (parseInt(clean.charAt(9)) !== checkDigit1) return false;

      sum = 0;
      for (let i = 0; i < 10; i++) {
        sum += parseInt(clean.charAt(i)) * (11 - i);
      }
      let checkDigit2 = 11 - (sum % 11);
      if (checkDigit2 >= 10) checkDigit2 = 0;

      return parseInt(clean.charAt(10)) === checkDigit2;
    },
    { message: "Invalid CPF check digits" }
  );

/**
 * CEP validation
 * Format: #####-### or ########
 */
const cepSchema = z.string().regex(/^\d{5}-?\d{3}$/, "Invalid CEP format");

/**
 * Brazilian state codes (27 states)
 */
const brazilianStates = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;

// ============================================================================
// Input Schemas
// ============================================================================

export const addressInput = z.object({
  type: z.enum(["HOME", "WORK"]),
  street: z.string().min(1).max(255),
  number: z.string().min(1).max(20),
  city: z.string().min(1).max(100),
  state: z.enum(brazilianStates),
  cep: cepSchema,
});

export const createClientInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  cpf: cpfSchema,
  socialMedia: z.string().max(100).optional(),
  addresses: z
    .array(addressInput)
    .min(1)
    .max(2)
    .refine(
      (addresses) => {
        const types = addresses.map((a) => a.type);
        return types.length === new Set(types).size; // Ensure unique types
      },
      { message: "Cannot have duplicate address types" }
    ),
});

export const updateClientInput = z.object({
  id: z.string(),
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  socialMedia: z.string().max(100).optional(),
  addresses: z
    .array(addressInput)
    .min(1)
    .max(2)
    .optional()
    .refine(
      (addresses) => {
        if (!addresses) return true;
        const types = addresses.map((a) => a.type);
        return types.length === new Set(types).size;
      },
      { message: "Cannot have duplicate address types" }
    ),
});

export const deleteClientInput = z.object({
  id: z.string(),
});

export const getClientInput = z.object({
  id: z.string(),
});

export const listClientsInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  search: z.string().optional(), // Search by name or email
  sortBy: z
    .enum(["firstName", "lastName", "email", "createdAt"])
    .default("lastName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

// ============================================================================
// Output Schemas
// ============================================================================

export const addressOutput = z.object({
  id: z.string(),
  type: z.enum(["HOME", "WORK"]),
  street: z.string(),
  number: z.string(),
  city: z.string(),
  state: z.string(),
  cep: z.string(),
});

export const clientOutput = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  cpf: z.string(),
  socialMedia: z.string().nullable(),
  addresses: z.array(addressOutput),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const clientListOutput = z.object({
  clients: z.array(clientOutput),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
  totalPages: z.number(),
});

// ============================================================================
// Procedure Definitions
// ============================================================================

/**
 * clients.create
 *
 * Create a new client with addresses.
 *
 * Input:
 *   - firstName, lastName, email, cpf (required)
 *   - socialMedia (optional)
 *   - addresses (1-2 addresses, unique types)
 *
 * Output:
 *   - client: Created client with addresses
 *
 * Errors:
 *   - CONFLICT: CPF already exists
 *   - BAD_REQUEST: Invalid CPF/CEP format
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Valid client with 1 address → Success
 *   2. Valid client with 2 addresses (HOME + WORK) → Success
 *   3. Duplicate CPF → CONFLICT
 *   4. Invalid CPF format → Validation error
 *   5. Invalid CEP format → Validation error
 *   6. Duplicate address types → Validation error
 *   7. More than 2 addresses → Validation error
 */
export const createClientProcedure = {
  input: createClientInput,
  output: clientOutput,
};

/**
 * clients.update
 *
 * Update existing client information.
 *
 * Input:
 *   - id: Client ID (required)
 *   - firstName, lastName, email, socialMedia, addresses (optional)
 *
 * Output:
 *   - client: Updated client
 *
 * Errors:
 *   - NOT_FOUND: Client doesn't exist
 *   - BAD_REQUEST: Invalid input
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Update name → Success
 *   2. Update addresses → Success
 *   3. Non-existent client → NOT_FOUND
 *   4. Invalid address format → Validation error
 */
export const updateClientProcedure = {
  input: updateClientInput,
  output: clientOutput,
};

/**
 * clients.delete
 *
 * Delete a client (only if no associated sales).
 *
 * Input:
 *   - id: Client ID
 *
 * Output:
 *   - success: boolean
 *
 * Errors:
 *   - NOT_FOUND: Client doesn't exist
 *   - CONFLICT: Client has associated sales
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Client with no sales → Success
 *   2. Client with sales → CONFLICT error
 *   3. Non-existent client → NOT_FOUND
 */
export const deleteClientProcedure = {
  input: deleteClientInput,
  output: z.object({ success: z.boolean() }),
};

/**
 * clients.getById
 *
 * Get client by ID with addresses.
 *
 * Input:
 *   - id: Client ID
 *
 * Output:
 *   - client: Client with addresses
 *
 * Errors:
 *   - NOT_FOUND: Client doesn't exist
 *   - UNAUTHORIZED: Not authenticated
 *
 * Test Cases:
 *   1. Existing client → Return client with addresses
 *   2. Non-existent client → NOT_FOUND
 */
export const getClientProcedure = {
  input: getClientInput,
  output: clientOutput,
};

/**
 * clients.list
 *
 * List clients with pagination, search, and sorting.
 *
 * Input:
 *   - page: Page number (default: 1)
 *   - limit: Items per page (default: 20, max: 100)
 *   - search: Search term for name/email (optional)
 *   - sortBy: Field to sort by (default: lastName)
 *   - sortOrder: asc or desc (default: asc)
 *
 * Output:
 *   - clients: Array of clients
 *   - total: Total count
 *   - page: Current page
 *   - limit: Items per page
 *   - totalPages: Total pages
 *
 * Test Cases:
 *   1. No filters → Return paginated list
 *   2. With search → Filter by name/email
 *   3. With sorting → Return sorted results
 *   4. Empty result → Return empty array
 */
export const listClientsProcedure = {
  input: listClientsInput,
  output: clientListOutput,
};

// ============================================================================
// Contract Summary
// ============================================================================

export const clientsContract = {
  create: createClientProcedure,
  update: updateClientProcedure,
  delete: deleteClientProcedure,
  getById: getClientProcedure,
  list: listClientsProcedure,
};
