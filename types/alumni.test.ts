import { describe, it, expect } from 'vitest'
import { validateLinkedinUrl } from './alumni'

describe('Validation Functions', () => {
    describe('validateLinkedinUrl', () => {
        it('should return true for valid LinkedIn URLs', () => {
            expect(validateLinkedinUrl('https://www.linkedin.com/in/johndoe')).toBe(true)
            expect(validateLinkedinUrl('https://www.linkedin.com/in/johndoe123')).toBe(true)
            expect(validateLinkedinUrl('https://www.linkedin.com/in/john-doe')).toBe(true)
            expect(validateLinkedinUrl('https://www.linkedin.com/in/john_doe')).toBe(true)
            expect(validateLinkedinUrl('')).toBe(true)
            expect(validateLinkedinUrl(null)).toBe(true)
        })

        it('should return false for invalid LinkedIn URLs', () => {
            expect(validateLinkedinUrl('https://linkedin.com/in/johndoe')).toBe(false)
            expect(validateLinkedinUrl('www.linkedin.com/in/johndoe')).toBe(false)
            expect(validateLinkedinUrl('https://www.linkedin.com/in/')).toBe(false)
            expect(validateLinkedinUrl('linkedin.com/in/johndoe')).toBe(false)
            expect(validateLinkedinUrl('https://www.linkedin.com/company/test')).toBe(false)
            expect(validateLinkedinUrl('invalid-url')).toBe(false)
        })
    })
})