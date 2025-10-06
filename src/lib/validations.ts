import { z } from 'zod'

/**
 * Validation Utilities
 *
 * Brazilian-specific validations (CPF, CEP) and common schemas.
 */

// ============================================================================
// CPF Validation
// ============================================================================

/**
 * Validates CPF (Cadastro de Pessoas Físicas - Brazilian Tax ID)
 * Format: XXX.XXX.XXX-XX or XXXXXXXXXXX
 *
 * Algorithm:
 * 1. Remove formatting
 * 2. Check length (must be 11 digits)
 * 3. Reject if all digits are the same
 * 4. Calculate and verify check digits
 */
export function validateCPF(cpf: string): boolean {
  // Remove formatting
  const cleanCPF = cpf.replace(/[^\d]/g, '')

  // Check length
  if (cleanCPF.length !== 11) return false

  // Reject if all digits are the same (e.g., 111.111.111-11)
  if (/^(\d)\1+$/.test(cleanCPF)) return false

  // Calculate first check digit
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (10 - i)
  }
  let checkDigit1 = 11 - (sum % 11)
  if (checkDigit1 >= 10) checkDigit1 = 0

  if (parseInt(cleanCPF.charAt(9)) !== checkDigit1) return false

  // Calculate second check digit
  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleanCPF.charAt(i)) * (11 - i)
  }
  let checkDigit2 = 11 - (sum % 11)
  if (checkDigit2 >= 10) checkDigit2 = 0

  return parseInt(cleanCPF.charAt(10)) === checkDigit2
}

const cpfRegex = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/

export const cpfSchema = z
  .string()
  .regex(cpfRegex, 'Invalid CPF format (expected: XXX.XXX.XXX-XX)')
  .refine(validateCPF, { message: 'Invalid CPF check digits' })

// ============================================================================
// CEP Validation
// ============================================================================

/**
 * Validates CEP (Código de Endereçamento Postal - Brazilian Postal Code)
 * Format: #####-### or ########
 */
export function validateCEP(cep: string): boolean {
  const cleanCEP = cep.replace(/[^\d]/g, '')
  return cleanCEP.length === 8
}

const cepRegex = /^\d{5}-?\d{3}$/

export const cepSchema = z
  .string()
  .regex(cepRegex, 'Invalid CEP format (expected: #####-###)')

// ============================================================================
// Address Schemas
// ============================================================================

export const brazilianStates = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

export const addressSchema = z.object({
  type: z.enum(['HOME', 'WORK']),
  street: z.string().min(1).max(255),
  number: z.string().min(1).max(20),
  city: z.string().min(1).max(100),
  state: z.enum(brazilianStates),
  cep: cepSchema,
})

// ============================================================================
// Common Schemas
// ============================================================================

export const emailSchema = z.string().email('Invalid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must not exceed 100 characters')

export const priceSchema = z
  .number()
  .int('Price must be an integer (in cents)')
  .positive('Price must be positive')

export const stockSchema = z
  .number()
  .int('Stock must be an integer')
  .nonnegative('Stock cannot be negative')
