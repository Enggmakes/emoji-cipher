import { describe, it, expect } from "vitest";
import { encrypt, decrypt, EMOJI_POOL } from "../lib/emojiCrypto";

describe("EmojiCipher Cryptographic Suite", () => {
  it("should have zero duplicate emojis in the pool", () => {
    const set = new Set(EMOJI_POOL);
    expect(set.size).toBe(EMOJI_POOL.length);
  });

  it("should encrypt and decrypt basic strings successfully", async () => {
    const message = "Secret meetup at midnight! 🌙";
    const password = "SuperSecretKey99!";
    const encrypted = await encrypt(message, password);
    expect(encrypted.length).toBeGreaterThan(0);
    const decrypted = await decrypt(encrypted, password);
    expect(decrypted).toBe(message);
  });

  it("should encrypt and decrypt multi-byte unicode and special characters", async () => {
    const message = "Unicode test: 🚀❤️‍🔥🌟💎 漢字 한국어 العربية Español Français 1234567890 !@#$%^&*()";
    const password = "KeyWithSymbols_@#123";
    const encrypted = await encrypt(message, password);
    const decrypted = await decrypt(encrypted, password);
    expect(decrypted).toBe(message);
  });

  it("should survive chat app simulation (stripped variation selectors \\uFE0F and added whitespace)", async () => {
    const message = "Top secret intel for agent 007: ship coordinates 42.12N, 71.05W";
    const password = "MI6SecureChannel";
    const cipher = await encrypt(message, password);

    // Simulate WhatsApp / Telegram / SMS:
    // 1. Strip variation selectors
    const stripped = cipher.replace(/\uFE0F/g, "");
    // 2. Add spaces and line breaks
    const withWhitespace = "  \n" + stripped.slice(0, 8) + " \n " + stripped.slice(8) + " \n\n ";

    const decrypted = await decrypt(withWhitespace, password);
    expect(decrypted).toBe(message);
  });

  it("should fail gracefully with clear error on wrong password", async () => {
    const message = "Confidential message";
    const cipher = await encrypt(message, "CorrectPassword");

    await expect(decrypt(cipher, "WrongPassword")).rejects.toThrow(
      /Decryption failed/i
    );
  });

  it("should reject empty inputs", async () => {
    await expect(encrypt("", "key")).rejects.toThrow();
    await expect(encrypt("msg", "")).rejects.toThrow();
    await expect(decrypt("", "key")).rejects.toThrow();
    await expect(decrypt("😀", "")).rejects.toThrow();
  });
});
