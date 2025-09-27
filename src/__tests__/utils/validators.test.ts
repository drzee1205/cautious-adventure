import { describe, it, expect } from 'vitest'
import {
  isValidEmail,
  validatePassword,
  isValidMedicalLicense,
  validatePediatricAge,
  validatePediatricWeight
} from '../../utils/validators'

describe('Validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
      expect(isValidEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
      expect(isValidEmail('')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123!')
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
      expect(result.errors).toContain('Password must contain at least one number')
      expect(result.errors).toContain('Password must contain at least one special character')
    })

    it('should validate password with all requirements', () => {
      const testCases = [
        { password: 'NoNumber!', missing: 'number' },
        { password: 'nonumber123!', missing: 'uppercase letter' },
        { password: 'NOLOWER123!', missing: 'lowercase letter' },
        { password: 'NoSpecial123', missing: 'special character' }
      ]

      testCases.forEach(({ password, missing }) => {
        const result = validatePassword(password)
        expect(result.isValid).toBe(false)
        expect(result.errors.some(error => error.includes(missing))).toBe(true)
      })
    })
  })

  describe('isValidMedicalLicense', () => {
    it('should validate medical license formats', () => {
      expect(isValidMedicalLicense('MD12345')).toBe(true)
      expect(isValidMedicalLicense('ABC123456')).toBe(true)
      expect(isValidMedicalLicense('X9876')).toBe(true)
    })

    it('should reject invalid license formats', () => {
      expect(isValidMedicalLicense('12345')).toBe(false)
      expect(isValidMedicalLicense('ABCD123456789')).toBe(false)
      expect(isValidMedicalLicense('')).toBe(false)
    })
  })

  describe('validatePediatricAge', () => {
    it('should validate various age formats', () => {
      const testCases = [
        { input: 'newborn', expected: 0 },
        { input: '2 years', expected: 24 },
        { input: '18 months', expected: 18 },
        { input: '3 weeks', expected: 3 / 4.33 },
        { input: '10 days', expected: 10 / 30.44 }
      ]

      testCases.forEach(({ input, expected }) => {
        const result = validatePediatricAge(input)
        expect(result.isValid).toBe(true)
        if (expected === 0) {
          expect(result.ageInMonths).toBe(0)
        } else {
          expect(result.ageInMonths).toBeCloseTo(expected, 1)
        }
      })
    })

    it('should reject invalid age formats', () => {
      const invalidAges = ['invalid', '20 years', '-1 months', '']
      
      invalidAges.forEach(age => {
        const result = validatePediatricAge(age)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })
  })

  describe('validatePediatricWeight', () => {
    it('should validate weight in different units', () => {
      const testCases = [
        { input: '5 kg', expected: 5 },
        { input: '11 lbs', expected: 11 * 0.453592 },
        { input: '3500 g', expected: 3.5 }
      ]

      testCases.forEach(({ input, expected }) => {
        const result = validatePediatricWeight(input)
        expect(result.isValid).toBe(true)
        expect(result.weightInKg).toBeCloseTo(expected, 1)
      })
    })

    it('should reject invalid weights', () => {
      const invalidWeights = ['0.1 kg', '200 kg', 'invalid weight', '']
      
      invalidWeights.forEach(weight => {
        const result = validatePediatricWeight(weight)
        expect(result.isValid).toBe(false)
        expect(result.error).toBeDefined()
      })
    })
  })
})