/**
 * Unit tests for password hashing.
 * expo-crypto is mocked — tests verify behaviour (consistency, uniqueness).
 * Covers TC1 (password stored securely), TC2/TC3 (login hash comparison).
 */

jest.mock('expo-crypto', () => ({
  CryptoDigestAlgorithm: { SHA256: 'SHA-256' },
  digestStringAsync: jest.fn((_algo: string, input: string) =>
    Promise.resolve(
      // Deterministic fake hash: hex of char codes (good enough to test consistency)
      Buffer.from(input).toString('hex').padEnd(64, '0').slice(0, 64)
    )
  ),
}));

import { hashPassword } from '../src/utils/passwordUtils';

test('TC1: hashPassword returns a 64-char hex string', async () => {
  const hash = await hashPassword('myPassword123');
  expect(typeof hash).toBe('string');
  expect(hash.length).toBe(64);
});

test('TC2: same password always produces the same hash', async () => {
  const h1 = await hashPassword('correctPassword');
  const h2 = await hashPassword('correctPassword');
  expect(h1).toBe(h2);
});

test('TC3: different passwords produce different hashes', async () => {
  const h1 = await hashPassword('correct');
  const h2 = await hashPassword('incorrect');
  expect(h1).not.toBe(h2);
});

test('TC1: empty password hashes without throwing', async () => {
  await expect(hashPassword('')).resolves.toBeDefined();
});

test('TC1: password with special characters hashes without error', async () => {
  await expect(hashPassword('P@ssw0rd! #£$')).resolves.toBeDefined();
});
