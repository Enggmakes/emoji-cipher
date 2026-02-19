// Massive emoji pool (~1024 emojis) for high-density base conversion
const EMOJI_POOL = [
  // Smileys & People
  "😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩",
  "😘","😗","😚","😙","🥲","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🫡",
  "🤐","🤨","😐","😑","😶","🫥","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴",
  "😷","🤒","🤕","🤢","🤮","🥵","🥶","🥴","😵","🤯","🤠","🥳","🥸","😎","🤓","🧐",
  "😕","🫤","😟","🙁","😮","😯","😲","😳","🥺","🥹","😦","😧","😨","😰","😥","😢",
  "😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀",
  "☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀",
  "😿","😾","🙈","🙉","🙊",
  // Hearts & Symbols
  "💋","💌","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🧡","💛","💚",
  "💙","💜","🤎","🖤","🤍","💯","💢","💥","💫","💦","💨","💣","💬","💭","💤",
  // Hands & Body
  "👋","🤚","🖐️","✋","🖖","🫱","🫲","🫳","🫴","👌","🤌","🤏","✌️","🤞","🫰","🤟",
  "🤘","🤙","👈","👉","👆","🖕","👇","☝️","🫵","👍","👎","✊","👊","🤛","🤜","👏",
  "🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻",
  "👃","🧠","🫀","🫁","🦷","🦴","👀","👁️","👅","👄","🫦",
  // People
  "👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆",
  "💁","🙋","🧏","🙇","🤦","🤷","👮","🕵️","💂","🥷","👷","🫅","🤴","👸","👳","👲",
  "🧕","🤵","👰","🤰","🫃","🤱","👼","🎅","🤶","🦸","🦹","🧙","🧚","🧛","🧜","🧝",
  "🧞","🧟","🧌","💆","💇","🚶","🧍","🧎","🏃","💃","🕺","🕴️","👯","🧖","🧗","🤸",
  "⛹️","🏋️","🚴","🚵","🤼","🤽","🤾","🤺","⛷️","🏂","🏌️","🏇","🏊","🤹","🛀","🛌",
  // Animals
  "🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐵",
  "🐔","🐧","🐦","🐤","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🪱","🐛","🦋",
  "🐌","🐞","🐜","🪰","🪲","🪳","🦟","🦗","🕷️","🦂","🐢","🐍","🦎","🦖","🦕","🐙",
  "🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🪸","🐊","🐅","🐆","🦓",
  "🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦒","🦘","🦬","🐃","🐂","🐄","🐎","🐖","🐏",
  "🐑","🦙","🐐","🦌","🐕","🐩","🦮","🐈","🐓","🦃","🦤","🦚","🦜","🦢","🦩","🕊️",
  "🐇","🦝","🦨","🦡","🦫","🦦","🦥","🐁","🐀","🐿️","🦔",
  // Plants & Nature
  "🌵","🎄","🌲","🌳","🌴","🪵","🌱","🌿","☘️","🍀","🎍","🪴","🎋","🍃","🍂","🍁",
  "🍄","🐚","🪨","🌾","💐","🌷","🌹","🥀","🌺","🌸","🌼","🌻",
  // Sky & Weather
  "🌞","🌝","🌛","🌜","🌚","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌙","🌎","🌍",
  "🌏","🪐","⭐","🌟","✨","⚡","☄️","🔥","🌪️","🌈","☀️","🌤️","⛅","🌥️","☁️","🌦️",
  "🌧️","⛈️","🌩️","🌨️","❄️","☃️","⛄","🌬️","💨","🌫️","🌊",
  // Food & Drink
  "🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥",
  "🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶️","🫑","🌽","🥕","🫒","🧄","🧅","🥔","🍠",
  "🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴",
  "🌭","🍔","🍟","🍕","🫓","🥪","🥙","🧆","🌮","🌯","🫔","🥗","🥘","🫕","🥫","🍝",
  "🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🍥","🥠","🥮","🍢","🍡",
  "🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍩","🍪","🌰","🥜","🍯",
  "🥛","🍼","🫖","☕","🍵","🧃","🥤","🧋","🍶","🍺","🍻","🥂","🍷","🥃","🍸","🍹",
  "🧉","🍾","🧊",
  // Activities & Sports
  "🎃","🎄","🎆","🎇","🧨","✨","🎈","🎉","🎊","🎋","🎍","🎎","🎏","🎐","🎑","🧧",
  "🎀","🎁","🎗️","🎟️","🎫","🎖️","🏆","🏅","🥇","🥈","🥉","⚽","⚾","🥎","🏀","🏐",
  "🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","🥅","⛳","⛸️",
  "🎣","🤿","🎽","🎿","🛷","🥌","🎯","🪀","🪁","🎱","🔮","🪄","🧿","🪬","🎮","🕹️",
  "🎰","🎲","🧩","🧸","🪅","🪩","🪆","♠️","♥️","♦️","♣️","♟️","🃏","🀄","🎴",
  // Travel & Transport
  "🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🏍️","🛵",
  "🦽","🦼","🛺","🚲","🛴","🛹","🛼","🚏","🛣️","🛤️","🛞","⛽","🛞","🚨","🚥","🚦",
  "🛑","🚧","⚓","🛟","⛵","🛶","🚤","🛳️","⛴️","🛥️","🚢","✈️","🛩️","🛫","🛬","🪂",
  "💺","🚁","🚟","🚠","🚡","🛰️","🚀","🛸","🛎️","🧳","⌛","⏳","⌚","⏰","⏱️","⏲️",
  "🕰️","🗼","🗽","🗿","🏛️","🏰","🏯","🏟️","🎡","🎢","🎠","⛲","⛱️","🏖️","🏝️","🏜️",
  "🌋","⛰️","🏔️","🗻","🏕️","🛖","🏠","🏡","🏘️","🏚️","🏗️","🏭","🏢","🏬","🏣","🏤",
  "🏥","🏦","🏨","🏪","🏫","🏩","💒","🏛️","⛪","🕌","🕍","🛕","🕋","⛩️","🛤️","🗾",
  // Objects
  "📱","📲","💻","⌨️","🖥️","🖨️","🖱️","🖲️","💽","💾","💿","📀","🧮","🎥","🎞️","📽️",
  "📺","📷","📸","📹","📼","🔍","🔎","🕯️","💡","🔦","🏮","🪔","📔","📕","📖","📗",
  "📘","📙","📚","📓","📒","📃","📜","📄","📰","🗞️","📑","🔖","🏷️","💰","🪙","💴",
  "💵","💶","💷","💸","💳","🧾","💹","✉️","📧","📨","📩","📤","📥","📦","📫","📪",
  "📬","📭","📮","🗳️","✏️","✒️","🖋️","🖊️","🖌️","🖍️","📝","💼","📁","📂","🗂️","📅",
  "📆","🗒️","🗓️","📇","📈","📉","📊","📋","📌","📍","📎","🖇️","📏","📐","✂️","🗃️",
  "🗄️","🗑️","🔒","🔓","🔏","🔐","🔑","🗝️","🔨","🪓","⛏️","⚒️","🛠️","🗡️","⚔️","🔫",
  "🪃","🏹","🛡️","🪚","🔧","🪛","🔩","⚙️","🗜️","⚖️","🦯","🔗","⛓️","🪝","🧰","🧲",
  "🪜","⚗️","🧪","🧫","🧬","🔬","🔭","📡","💉","🩸","💊","🩹","🩼","🩺","🩻","🚪",
  "🛗","🪞","🪟","🛏️","🛋️","🪑","🚽","🪠","🚿","🛁","🪤","🪒","🧴","🧷","🧹","🧺",
  "🧻","🪣","🧼","🫧","🪥","🧽","🧯","🛒","🚬","⚰️","🪦","⚱️","🧿","🪬","🏺",
  // Symbols & Misc
  "🔴","🟠","🟡","🟢","🔵","🟣","🟤","⚫","⚪","🟥","🟧","🟨","🟩","🟦","🟪","🟫",
  "⬛","⬜","◼️","◻️","▪️","▫️","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔘","🔳","🔲",
];

const BASE = EMOJI_POOL.length;

// Deterministic seeded shuffle using password
function seedFromPassword(password: string): number {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
    hash = Math.imul(hash, 2654435761);
    hash = hash ^ (hash >>> 16);
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = Math.imul(s ^ (s >>> 15), s | 1);
    s ^= s + Math.imul(s ^ (s >>> 7), s | 61);
    return ((s ^ (s >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleEmojis(password: string): string[] {
  const seed = seedFromPassword(password);
  const rng = seededRandom(seed);
  const shuffled = [...EMOJI_POOL];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Convert Uint8Array to BigInt
function bytesToBigInt(bytes: Uint8Array): bigint {
  let result = 0n;
  for (const byte of bytes) {
    result = (result << 8n) | BigInt(byte);
  }
  return result;
}

// Convert BigInt back to Uint8Array
function bigIntToBytes(num: bigint): Uint8Array {
  if (num === 0n) return new Uint8Array([0]);
  const hex = num.toString(16);
  const paddedHex = hex.length % 2 ? "0" + hex : hex;
  const bytes = new Uint8Array(paddedHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(paddedHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Base conversion: BigInt → emoji sequence
function bigIntToEmojis(num: bigint, emojiSet: string[]): string {
  if (num === 0n) return emojiSet[0];
  const base = BigInt(emojiSet.length);
  const parts: string[] = [];
  while (num > 0n) {
    const remainder = Number(num % base);
    parts.unshift(emojiSet[remainder]);
    num = num / base;
  }
  return parts.join("");
}

// Emoji sequence → BigInt
function emojisToIndex(emojis: string[], emojiSet: string[]): bigint {
  const base = BigInt(emojiSet.length);
  const indexMap = new Map<string, number>();
  emojiSet.forEach((e, i) => indexMap.set(e, i));
  
  let result = 0n;
  for (const emoji of emojis) {
    const idx = indexMap.get(emoji);
    if (idx === undefined) throw new Error(`Unknown emoji: ${emoji}`);
    result = result * base + BigInt(idx);
  }
  return result;
}

// Split emoji string into individual emojis
function splitEmojis(str: string): string[] {
  const regex = /\p{Emoji_Presentation}(\u200d\p{Emoji_Presentation})*|\p{Emoji}\ufe0f?(\u200d\p{Emoji}\ufe0f?)*/gu;
  return str.match(regex) || [];
}

async function compressBytes(data: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("deflate");
  const writer = cs.writable.getWriter();
  writer.write(new Uint8Array(data) as any);
  writer.close();
  const chunks: Uint8Array[] = [];
  const reader = cs.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLen = chunks.reduce((s, c) => s + c.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

async function decompressBytes(data: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("deflate");
  const writer = ds.writable.getWriter();
  writer.write(new Uint8Array(data) as any);
  writer.close();
  const chunks: Uint8Array[] = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const totalLen = chunks.reduce((s, c) => s + c.length, 0);
  const result = new Uint8Array(totalLen);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

export async function encrypt(message: string, password: string): Promise<string> {
  if (!message || !password) throw new Error("Message and password are required");
  const emojiSet = shuffleEmojis(password);
  const encoder = new TextEncoder();
  const raw = encoder.encode(message);
  const compressed = await compressBytes(raw);
  const lenByte = new Uint8Array([(compressed.length & 0xff), (compressed.length >> 8) & 0xff]);
  const combined = new Uint8Array([...lenByte, ...compressed]);
  const bigInt = bytesToBigInt(combined);
  return bigIntToEmojis(bigInt, emojiSet);
}

export async function decrypt(emojiString: string, password: string): Promise<string> {
  if (!emojiString || !password) throw new Error("Emoji string and password are required");
  const emojiSet = shuffleEmojis(password);
  const emojis = splitEmojis(emojiString);
  const bigInt = emojisToIndex(emojis, emojiSet);
  const allBytes = bigIntToBytes(bigInt);
  const len = allBytes[0] | (allBytes[1] << 8);
  const compressedBytes = allBytes.slice(2, 2 + len);
  const decompressed = await decompressBytes(compressedBytes);
  const decoder = new TextDecoder();
  return decoder.decode(decompressed);
}
