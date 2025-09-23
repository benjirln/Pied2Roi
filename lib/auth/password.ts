import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

/**
 * Hash a plaintext password using scrypt (no external dependency).
 * Output format: `<saltHex>:<hashHex>`.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

/**
 * Verify a plaintext password against a stored `<salt>:<hash>` value.
 * Uses a constant-time comparison to avoid timing attacks.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [salt, hashHex] = stored.split(":");
  if (!salt || !hashHex) {
    return false;
  }

  const hash = Buffer.from(hashHex, "hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  if (hash.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(hash, derived);
}
