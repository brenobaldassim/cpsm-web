import { describe, it, expect } from "vitest"
import { validateCPF, cpfSchema } from "@/lib/validations"

describe("validateCPF", () => {
  describe("valid CPF", () => {
    it("should validate CPF with formatting (XXX.XXX.XXX-XX)", () => {
      expect(validateCPF("123.456.789-09")).toBe(true)
      expect(validateCPF("111.444.777-35")).toBe(true)
      expect(validateCPF("000.000.001-91")).toBe(true)
    })

    it("should validate CPF without formatting (XXXXXXXXXXX)", () => {
      expect(validateCPF("12345678909")).toBe(true)
      expect(validateCPF("11144477735")).toBe(true)
      expect(validateCPF("00000000191")).toBe(true)
    })

    it("should validate CPF with partial formatting", () => {
      expect(validateCPF("123.456.78909")).toBe(true)
      expect(validateCPF("123456789-09")).toBe(true)
    })
  })

  describe("invalid CPF - wrong check digits", () => {
    it("should reject CPF with invalid first check digit", () => {
      expect(validateCPF("123.456.789-00")).toBe(false)
      expect(validateCPF("123.456.789-10")).toBe(false)
    })

    it("should reject CPF with invalid second check digit", () => {
      expect(validateCPF("123.456.789-08")).toBe(false)
      expect(validateCPF("111.444.777-34")).toBe(false)
    })

    it("should reject CPF with both check digits wrong", () => {
      expect(validateCPF("123.456.789-99")).toBe(false)
      expect(validateCPF("000.000.001-00")).toBe(false)
    })
  })

  describe("invalid CPF - all same digit", () => {
    it("should reject CPF with all same digits", () => {
      expect(validateCPF("000.000.000-00")).toBe(false)
      expect(validateCPF("111.111.111-11")).toBe(false)
      expect(validateCPF("222.222.222-22")).toBe(false)
      expect(validateCPF("333.333.333-33")).toBe(false)
      expect(validateCPF("444.444.444-44")).toBe(false)
      expect(validateCPF("555.555.555-55")).toBe(false)
      expect(validateCPF("666.666.666-66")).toBe(false)
      expect(validateCPF("777.777.777-77")).toBe(false)
      expect(validateCPF("888.888.888-88")).toBe(false)
      expect(validateCPF("999.999.999-99")).toBe(false)
    })

    it("should reject CPF with all same digits (no formatting)", () => {
      expect(validateCPF("00000000000")).toBe(false)
      expect(validateCPF("11111111111")).toBe(false)
      expect(validateCPF("99999999999")).toBe(false)
    })
  })

  describe("invalid CPF - wrong length", () => {
    it("should reject CPF with too few digits", () => {
      expect(validateCPF("123.456.789")).toBe(false)
      expect(validateCPF("123456789")).toBe(false)
      expect(validateCPF("12345678")).toBe(false)
      expect(validateCPF("")).toBe(false)
    })

    it("should reject CPF with too many digits", () => {
      expect(validateCPF("123.456.789-099")).toBe(false)
      expect(validateCPF("123456789099")).toBe(false)
      expect(validateCPF("1234567890999")).toBe(false)
    })
  })

  describe("invalid CPF - non-numeric characters", () => {
    it("should handle non-numeric characters correctly", () => {
      // Should strip out formatting characters
      expect(validateCPF("123.456.789-09")).toBe(true)

      // Letters should result in wrong length after stripping
      expect(validateCPF("abc.def.ghi-jk")).toBe(false)
      expect(validateCPF("123.456.7AB-09")).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("should handle empty string", () => {
      expect(validateCPF("")).toBe(false)
    })

    it("should handle whitespace", () => {
      expect(validateCPF("   123.456.789-09   ")).toBe(true)
      expect(validateCPF("123 456 789 09")).toBe(true)
    })
  })
})

describe("cpfSchema (Zod validation)", () => {
  describe("valid CPF", () => {
    it("should pass Zod validation for valid CPF with formatting", () => {
      expect(cpfSchema.safeParse("123.456.789-09").success).toBe(true)
      expect(cpfSchema.safeParse("111.444.777-35").success).toBe(true)
    })

    it("should pass Zod validation for valid CPF without formatting", () => {
      expect(cpfSchema.safeParse("12345678909").success).toBe(true)
      expect(cpfSchema.safeParse("11144477735").success).toBe(true)
    })
  })

  describe("invalid CPF format", () => {
    it("should fail Zod validation for invalid format", () => {
      const result = cpfSchema.safeParse("123-456-789.09")
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Invalid CPF format")
      }
    })

    it("should fail Zod validation for wrong length", () => {
      const result = cpfSchema.safeParse("123.456.789")
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain("Invalid CPF format")
      }
    })
  })

  describe("invalid CPF check digits", () => {
    it("should fail Zod validation for wrong check digits", () => {
      const result = cpfSchema.safeParse("123.456.789-00")
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Invalid CPF check digits"
        )
      }
    })

    it("should fail Zod validation for all same digits", () => {
      const result = cpfSchema.safeParse("111.111.111-11")
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain(
          "Invalid CPF check digits"
        )
      }
    })
  })

  describe("parse and return value", () => {
    it("should return the original CPF string on success", () => {
      const result = cpfSchema.safeParse("123.456.789-09")
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toBe("123.456.789-09")
      }
    })
  })
})

describe("Real-world CPF examples", () => {
  // Note: These are known valid CPF numbers for testing purposes only
  const validCPFs = [
    "123.456.789-09",
    "111.444.777-35",
    "000.000.001-91",
    "123.456.789-10", // Actually invalid - wrong check digit
  ]

  it("should validate real CPF: 123.456.789-09", () => {
    expect(validateCPF("123.456.789-09")).toBe(true)
  })

  it("should validate real CPF: 111.444.777-35", () => {
    expect(validateCPF("111.444.777-35")).toBe(true)
  })

  it("should reject invalid real CPF: 123.456.789-10", () => {
    expect(validateCPF("123.456.789-10")).toBe(false)
  })
})
