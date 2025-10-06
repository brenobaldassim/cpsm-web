import { describe, it, expect } from 'vitest'
import { validateCEP, cepSchema } from '@/lib/validations'

describe('validateCEP', () => {
  describe('valid CEP', () => {
    it('should validate CEP with dash (#####-###)', () => {
      expect(validateCEP('01234-567')).toBe(true)
      expect(validateCEP('12345-678')).toBe(true)
      expect(validateCEP('00000-000')).toBe(true)
      expect(validateCEP('99999-999')).toBe(true)
    })

    it('should validate CEP without dash (########)', () => {
      expect(validateCEP('01234567')).toBe(true)
      expect(validateCEP('12345678')).toBe(true)
      expect(validateCEP('00000000')).toBe(true)
      expect(validateCEP('99999999')).toBe(true)
    })
  })

  describe('invalid CEP - wrong length', () => {
    it('should reject CEP with too few digits', () => {
      expect(validateCEP('0123-456')).toBe(false)
      expect(validateCEP('1234567')).toBe(false)
      expect(validateCEP('12345')).toBe(false)
      expect(validateCEP('')).toBe(false)
    })

    it('should reject CEP with too many digits', () => {
      expect(validateCEP('01234-5678')).toBe(false)
      expect(validateCEP('012345678')).toBe(false)
      expect(validateCEP('123456789')).toBe(false)
    })
  })

  describe('invalid CEP - non-numeric characters', () => {
    it('should reject CEP with letters', () => {
      expect(validateCEP('ABCDE-FGH')).toBe(false)
      expect(validateCEP('01A34-567')).toBe(false)
      expect(validateCEP('01234-5B7')).toBe(false)
    })

    it('should handle special characters by stripping them', () => {
      // validateCEP strips non-digits, so these pass if they have 8 digits
      expect(validateCEP('01234.567')).toBe(true) // 8 digits
      expect(validateCEP('01234/567')).toBe(true) // 8 digits
      expect(validateCEP('01234 567')).toBe(true) // 8 digits
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(validateCEP('')).toBe(false)
    })

    it('should handle whitespace around CEP', () => {
      expect(validateCEP('   01234-567   ')).toBe(true)
      expect(validateCEP('  01234567  ')).toBe(true)
    })

    it('should handle multiple dashes by stripping them', () => {
      // validateCEP strips all non-digits, counts only digits
      expect(validateCEP('01-234-567')).toBe(true) // 8 digits
      expect(validateCEP('01234--567')).toBe(true) // 8 digits
    })
  })

  describe('all zeros and all nines', () => {
    it('should accept all zeros', () => {
      expect(validateCEP('00000-000')).toBe(true)
      expect(validateCEP('00000000')).toBe(true)
    })

    it('should accept all nines', () => {
      expect(validateCEP('99999-999')).toBe(true)
      expect(validateCEP('99999999')).toBe(true)
    })
  })
})

describe('cepSchema (Zod validation)', () => {
  describe('valid CEP', () => {
    it('should pass Zod validation for valid CEP with dash', () => {
      expect(cepSchema.safeParse('01234-567').success).toBe(true)
      expect(cepSchema.safeParse('12345-678').success).toBe(true)
    })

    it('should pass Zod validation for valid CEP without dash', () => {
      expect(cepSchema.safeParse('01234567').success).toBe(true)
      expect(cepSchema.safeParse('12345678').success).toBe(true)
    })
  })

  describe('invalid CEP format', () => {
    it('should fail Zod validation for invalid format', () => {
      const result = cepSchema.safeParse('123-45678')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid CEP format')
      }
    })

    it('should fail Zod validation for wrong length', () => {
      const result = cepSchema.safeParse('1234567')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid CEP format')
      }
    })

    it('should fail Zod validation for letters', () => {
      const result = cepSchema.safeParse('01A34-567')
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid CEP format')
      }
    })
  })

  describe('parse and return value', () => {
    it('should return the original CEP string on success', () => {
      const result = cepSchema.safeParse('01234-567')
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe('01234-567')
      }
    })
  })
})

describe('Real-world CEP examples', () => {
  // Real Brazilian postal codes
  const validCEPs = [
    '01310-100', // São Paulo - Avenida Paulista
    '20040-020', // Rio de Janeiro - Centro
    '70040-902', // Brasília - Praça dos Três Poderes
    '30140-071', // Belo Horizonte - Savassi
    '40020-000', // Salvador - Centro
  ]

  it('should validate real CEP: São Paulo (01310-100)', () => {
    expect(validateCEP('01310-100')).toBe(true)
    expect(cepSchema.safeParse('01310-100').success).toBe(true)
  })

  it('should validate real CEP: Rio de Janeiro (20040-020)', () => {
    expect(validateCEP('20040-020')).toBe(true)
    expect(cepSchema.safeParse('20040-020').success).toBe(true)
  })

  it('should validate real CEP: Brasília (70040-902)', () => {
    expect(validateCEP('70040-902')).toBe(true)
    expect(cepSchema.safeParse('70040-902').success).toBe(true)
  })

  it('should validate all real CEPs without dash', () => {
    validCEPs.forEach((cep) => {
      const withoutDash = cep.replace('-', '')
      expect(validateCEP(withoutDash)).toBe(true)
      expect(cepSchema.safeParse(withoutDash).success).toBe(true)
    })
  })
})

describe('CEP format variations', () => {
  it('should accept different valid formats for same CEP', () => {
    // Same CEP, different formats
    expect(validateCEP('01234-567')).toBe(true)
    expect(validateCEP('01234567')).toBe(true)

    expect(cepSchema.safeParse('01234-567').success).toBe(true)
    expect(cepSchema.safeParse('01234567').success).toBe(true)
  })

  it('should use cepSchema for strict format validation', () => {
    // validateCEP is lenient (just counts digits)
    // cepSchema is strict (enforces format)
    expect(validateCEP('012-34567')).toBe(true) // 8 digits, validateCEP passes
    expect(cepSchema.safeParse('012-34567').success).toBe(false) // Wrong format, schema fails

    expect(validateCEP('0123-4567')).toBe(true) // 8 digits
    expect(cepSchema.safeParse('0123-4567').success).toBe(false) // Wrong format
  })
})
