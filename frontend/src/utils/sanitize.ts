/**
 * Security utilities for input sanitization and validation
 */

/**
 * Sanitizes user input by escaping HTML entities and removing potentially dangerous characters
 */
export function sanitizeInput(input: string, maxLength: number = 255): string {
  if (!input) return ''
  
  // Trim whitespace
  let sanitized = input.trim()
  
  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, '')
  
  // Escape HTML entities to prevent XSS
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength)
  }
  
  return sanitized
}

/**
 * Validates email format using a robust regex pattern
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false
  
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

/**
 * Validates username/store name: only letters, numbers, accents, and spaces
 */
export function isValidUsername(username: string): boolean {
  if (!username || username.length < 2 || username.length > 50) return false
  
  // Allow letters (including accented), numbers, and spaces
  const usernameRegex = /^[a-zA-Z0-9À-ÿ\s]+$/
  return usernameRegex.test(username)
}

/**
 * Validates password strength
 */
export function isValidPassword(password: string): boolean {
  // Minimum 6 characters, maximum 128 (to prevent DoS)
  return password.length >= 6 && password.length <= 128
}

/**
 * Validates Brazilian phone number format (10-11 digits)
 */
export function isValidPhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '')
  return digitsOnly.length >= 10 && digitsOnly.length <= 11
}

/**
 * Normalizes email to lowercase and trimmed
 */
export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

/**
 * Removes all non-numeric characters from phone
 */
export function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '')
}
