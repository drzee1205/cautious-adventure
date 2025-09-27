/**
 * Email validation
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Password strength validation
 */
export const validatePassword = (password: string): {
  isValid: boolean
  errors: string[]
} => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Medical license number validation (basic pattern)
 */
export const isValidMedicalLicense = (license: string): boolean => {
  // This is a simplified validation - real implementation would vary by jurisdiction
  const licenseRegex = /^[A-Z]{1,3}\d{4,8}$/
  return licenseRegex.test(license.toUpperCase())
}

/**
 * Phone number validation
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * URL validation
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Age validation for pediatric context
 */
export const validatePediatricAge = (age: string): {
  isValid: boolean
  ageInMonths?: number
  error?: string
} => {
  // Parse various formats: "2 years", "18 months", "3 weeks", "5 days", "newborn"
  const trimmed = age.toLowerCase().trim()
  
  if (trimmed === 'newborn' || trimmed === 'neonate') {
    return { isValid: true, ageInMonths: 0 }
  }
  
  // Match patterns like "2 years", "18 months", "3 weeks", "5 days"
  const yearMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*y(?:ear)?s?/)
  const monthMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*m(?:onth)?s?/)
  const weekMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*w(?:eek)?s?/)
  const dayMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*d(?:ay)?s?/)
  
  let ageInMonths = 0
  
  if (yearMatch) {
    ageInMonths = parseFloat(yearMatch[1]) * 12
  } else if (monthMatch) {
    ageInMonths = parseFloat(monthMatch[1])
  } else if (weekMatch) {
    ageInMonths = parseFloat(weekMatch[1]) / 4.33 // Approximate weeks to months
  } else if (dayMatch) {
    ageInMonths = parseFloat(dayMatch[1]) / 30.44 // Approximate days to months
  } else {
    return { isValid: false, error: 'Invalid age format' }
  }
  
  // Pediatric age should be under 18 years (216 months)
  if (ageInMonths > 216) {
    return { isValid: false, error: 'Age exceeds pediatric range (>18 years)' }
  }
  
  if (ageInMonths < 0) {
    return { isValid: false, error: 'Age cannot be negative' }
  }
  
  return { isValid: true, ageInMonths }
}

/**
 * Weight validation for pediatric context
 */
export const validatePediatricWeight = (weight: string): {
  isValid: boolean
  weightInKg?: number
  error?: string
} => {
  const trimmed = weight.toLowerCase().trim()
  
  // Match patterns like "5 kg", "12 lbs", "3.5kg", "7.2 pounds"
  const kgMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*kg/)
  const lbMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*(?:lb|lbs|pound|pounds)/)
  const gMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*g(?:ram|rams)?/)
  
  let weightInKg = 0
  
  if (kgMatch) {
    weightInKg = parseFloat(kgMatch[1])
  } else if (lbMatch) {
    weightInKg = parseFloat(lbMatch[1]) * 0.453592 // Convert lbs to kg
  } else if (gMatch) {
    weightInKg = parseFloat(gMatch[1]) / 1000 // Convert grams to kg
  } else {
    return { isValid: false, error: 'Invalid weight format' }
  }
  
  // Reasonable pediatric weight range (0.5kg to 150kg)
  if (weightInKg < 0.5) {
    return { isValid: false, error: 'Weight too low for pediatric range' }
  }
  
  if (weightInKg > 150) {
    return { isValid: false, error: 'Weight exceeds typical pediatric range' }
  }
  
  return { isValid: true, weightInKg }
}