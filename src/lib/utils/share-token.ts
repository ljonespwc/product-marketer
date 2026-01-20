import { randomBytes } from 'crypto'

/**
 * Generate a secure share token (32-character hex string, 128-bit entropy)
 */
export function generateShareToken(): string {
  return randomBytes(16).toString('hex')
}

/**
 * Validate share token format
 */
export function isValidShareToken(token: string): boolean {
  return /^[a-f0-9]{32}$/.test(token)
}
