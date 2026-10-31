# EmojiCipher 🔐

> End-to-end client-side emoji encryption with Apple Liquid glassmorphic aesthetics. High-density, zero-knowledge emoji cryptography running 100% locally in your browser.

![EmojiCipher Preview](/public/favicon.svg)

## ✨ Highlights

- **Apple Liquid Design**: Translucent specular glassmorphic cards, fluid mesh gradient canvas, and responsive spring animations inspired by iOS 18 / Apple Vision Pro.
- **Robust 966-Base Permutation**: Uses a deduplicated pool of 966 unique Unicode emojis with deterministic password-seeded polynomial shuffle.
- **Tamper-Evident CRC32 & Deflate Stream**: Incorporates a 4-byte CRC32 integrity checksum for instant password validation, preventing corrupt decompression.
- **Cross-Platform Resilient**: Automatically normalizes Unicode Variation Selectors (`\uFE0F`), whitespace, and line breaks—allowing messages copied across WhatsApp, Telegram, iMessage, and Discord to decrypt without errors.
- **1-Click Share Links**: Generate instant decrypt links (`?c=...`) that automatically load the cipher for recipients.
- **100% Zero-Knowledge**: All encryption and decryption runs entirely in client-side memory using the native Web Streams API (`CompressionStream` / `DecompressionStream`).

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Enggmakes/emoji-cipher.git
cd emoji-cipher

# Install dependencies (pnpm recommended)
pnpm install

# Start development server
pnpm run dev
```

### Run Tests

```bash
pnpm test
```

### Build for Production

```bash
pnpm run build
```

---

## 🔒 Cryptographic Architecture

1. **Input Preprocessing**: UTF-8 encoding into raw byte buffer.
2. **Deflate Compression**: High-efficiency compression stream minimizing output emoji length.
3. **Packet Framing (v2)**:
   - `[0xEC, 0x02]` (Magic Header)
   - `[CRC32: 4 bytes]` (Uncompressed message checksum)
   - `[Payload: compressed bytes]`
4. **MSB Sentinel & BigInt Encoding**: A leading non-zero sentinel byte (`0x01`) guarantees leading `0x00` bytes are never lost during BigInt arithmetic.
5. **Deterministic Base-966 Mapping**: Converts the BigInt into an emoji sequence using the password-shuffled emoji dictionary.

---

## 🛠️ Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS + Custom Apple Liquid Glass Tokens
- **Icons**: Lucide React
- **Testing**: Vitest + Testing Library
