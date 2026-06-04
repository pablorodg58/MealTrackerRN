/**
 * Pure validation utilities — fully unit-testable without React Native.
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email.trim()) return { valid: false, error: 'Email is required' };
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email.trim()))
    return { valid: false, error: 'Invalid email address' };
  return { valid: true };
}

export function validateUsername(username: string): ValidationResult {
  if (!username.trim()) return { valid: false, error: 'Username is required' };
  if (username.trim().length < 3)
    return { valid: false, error: 'Username must be at least 3 characters' };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 6)
    return { valid: false, error: 'Password must be at least 6 characters' };
  return { valid: true };
}

export function validateScore(value: string): ValidationResult {
  if (!value.trim()) return { valid: false, error: 'Score is required' };
  const num = parseFloat(value);
  if (isNaN(num)) return { valid: false, error: 'Score must be a number' };
  if (num < 0 || num > 5) return { valid: false, error: 'Score must be between 0.0 and 5.0' };
  return { valid: true };
}

export function validateLoginForm(username: string, password: string): string | null {
  const u = validateUsername(username);
  if (!u.valid) return u.error!;
  const p = validatePassword(password);
  if (!p.valid) return p.error!;
  return null;
}

export function validateRegisterForm(
  email: string,
  username: string,
  password: string
): string | null {
  const e = validateEmail(email);
  if (!e.valid) return e.error!;
  const u = validateUsername(username);
  if (!u.valid) return u.error!;
  const p = validatePassword(password);
  if (!p.valid) return p.error!;
  return null;
}
