/**
 * Unit tests for validation utilities.
 * Covers TC1 (Registration validation), TC2/TC3 (Login validation), TC7 (score validation).
 */
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateScore,
  validateLoginForm,
  validateRegisterForm,
} from '../src/utils/validation';

// ─── TC1 — Registration validation ─────────────────────────────────────────

describe('validateEmail', () => {
  test('valid email returns valid', () => {
    expect(validateEmail('user@example.com').valid).toBe(true);
  });
  test('empty email returns error', () => {
    const r = validateEmail('');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/required/i);
  });
  test('invalid format returns error', () => {
    expect(validateEmail('not-an-email').valid).toBe(false);
    expect(validateEmail('missing@domain').valid).toBe(false);
  });
});

describe('validateUsername', () => {
  test('valid username (≥3 chars) returns valid', () => {
    expect(validateUsername('alice').valid).toBe(true);
  });
  test('empty username returns error', () => {
    expect(validateUsername('').valid).toBe(false);
  });
  test('too short username (< 3) returns error', () => {
    const r = validateUsername('ab');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/3 char/i);
  });
});

describe('validatePassword', () => {
  test('valid password (≥6 chars) returns valid', () => {
    expect(validatePassword('secret123').valid).toBe(true);
  });
  test('empty password returns error', () => {
    expect(validatePassword('').valid).toBe(false);
  });
  test('password shorter than 6 returns error', () => {
    const r = validatePassword('abc');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/6 char/i);
  });
});

// ─── TC7 — Score validation (Flavor/Price 0–5) ────────────────────────────

describe('validateScore', () => {
  test('valid score 0.0 returns valid', () => {
    expect(validateScore('0').valid).toBe(true);
  });
  test('valid score 5.0 returns valid', () => {
    expect(validateScore('5').valid).toBe(true);
  });
  test('valid decimal 4.2 returns valid', () => {
    expect(validateScore('4.2').valid).toBe(true);
  });
  test('empty string returns error', () => {
    expect(validateScore('').valid).toBe(false);
  });
  test('non-numeric returns error', () => {
    expect(validateScore('abc').valid).toBe(false);
  });
  test('score > 5 returns error', () => {
    const r = validateScore('5.1');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/0.0.*5.0/);
  });
  test('negative score returns error', () => {
    expect(validateScore('-1').valid).toBe(false);
  });
});

// ─── TC2 — Login form ─────────────────────────────────────────────────────

describe('validateLoginForm', () => {
  test('valid credentials return null (no error)', () => {
    expect(validateLoginForm('alice', 'secret123')).toBeNull();
  });
  test('empty username returns error string', () => {
    expect(validateLoginForm('', 'secret123')).toBeTruthy();
  });
  test('empty password returns error string', () => {
    expect(validateLoginForm('alice', '')).toBeTruthy();
  });
});

// ─── TC1 full form ───────────────────────────────────────────────────────

describe('validateRegisterForm', () => {
  test('all valid fields return null', () => {
    expect(validateRegisterForm('a@b.com', 'alice', 'password')).toBeNull();
  });
  test('invalid email returns error string', () => {
    expect(validateRegisterForm('bad-email', 'alice', 'password')).toBeTruthy();
  });
  test('short password returns error', () => {
    expect(validateRegisterForm('a@b.com', 'alice', '123')).toBeTruthy();
  });
});
