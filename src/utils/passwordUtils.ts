/**
 * Password hashing utility.
 * Uses expo-crypto (SHA-256) in production.
 * In test environments the module is mocked via jest.
 */

// Dynamic import avoids bundling issues when mocked in tests
export async function hashPassword(password: string): Promise<string> {
  const Crypto = await import('expo-crypto');
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}
