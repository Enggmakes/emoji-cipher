import React, { useState, useCallback, useEffect, useMemo } from "react";
import { encrypt, decrypt } from "@/lib/emojiCrypto";
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  ArrowRightLeft,
  Eye,
  EyeOff,
  Check,
  Share2,
  Sparkles,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  Zap,
  Info,
  ExternalLink,
} from "lucide-react";
import AppleLiquidBackground from "@/components/AppleLiquidBackground";

const SAMPLE_MESSAGES = [
  { label: "Secret Note 🤫", text: "Meet me at the station coffee shop at 8:00 PM tonight. Don't be late!" },
  { label: "Secret Code 🔑", text: "Alpha project token: demo_token_alpha_9942857291847" },
  { label: "Private Pin 💳", text: "Vault Access Code: 8492-3019 • Emergency Override: 7712" },
];

function calculateKeyStrength(key: string): { score: number; label: string; color: string } {
  if (!key) return { score: 0, label: "Empty", color: "bg-slate-700" };
  let score = 0;
  if (key.length >= 6) score += 1;
  if (key.length >= 10) score += 1;
  if (/[A-Z]/.test(key) && /[a-z]/.test(key)) score += 1;
  if (/[0-9]/.test(key)) score += 1;
  if (/[^A-Za-z0-9]/.test(key)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak", color: "bg-rose-500" };
  if (score === 2) return { score: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3 || score === 4) return { score: 3, label: "Strong", color: "bg-emerald-500" };
  return { score: 4, label: "Military-Grade", color: "bg-cyan-400" };
}

function generateStrongKey(): string {
  const words = [
    "liquid", "aurora", "cipher", "quantum", "crystal", "nebula",
    "shadow", "vault", "velvet", "zenith", "cobalt", "emerald",
    "pulsar", "falcon", "solaris", "mirage", "matrix", "beacon"
  ];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(100 + Math.random() * 900);
  const sym = ["!", "@", "#", "$", "%", "&"][Math.floor(Math.random() * 6)];
  return `${w1}-${w2}-${num}${sym}`;
}

const Index: React.FC = () => {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copiedCipher, setCopiedCipher] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Auto-detect cipher from URL params (?c=... or ?cipher=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cipherFromUrl = params.get("c") || params.get("cipher");
      if (cipherFromUrl) {
        setMode("decrypt");
        setInput(decodeURIComponent(cipherFromUrl));
      }
    } catch {
      // Ignore URL parsing errors
    }
  }, []);

  // Compute key strength
  const keyStrength = useMemo(() => calculateKeyStrength(password), [password]);

  // Emoji count & input length
  const inputByteLength = useMemo(() => new TextEncoder().encode(input).length, [input]);

  const outputEmojiCount = useMemo(() => {
    if (!output || mode !== "encrypt") return 0;
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(output)).length;
  }, [output, mode]);

  const handleProcess = useCallback(async () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError(mode === "encrypt" ? "Please enter a message to encrypt." : "Please paste an emoji cipher to decrypt.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter a shared secret key.");
      return;
    }

    setProcessing(true);

    try {
      if (mode === "encrypt") {
        const result = await encrypt(input, password);
        setOutput(result);
      } else {
        const result = await decrypt(input, password);
        setOutput(result);
      }
    } catch (e: any) {
      setError(e.message || (mode === "encrypt" ? "Encryption failed. Please check your message." : "Decryption failed. Please check your key or cipher text."));
    } finally {
      setProcessing(false);
    }
  }, [input, password, mode]);

  // Handle Ctrl+Enter / Cmd+Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleProcess();
    }
  };

  const handleCopyCipher = useCallback(async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopiedCipher(true);
      setTimeout(() => setCopiedCipher(false), 2200);
    } catch {
      // Fallback
    }
  }, [output]);

  const handleCopyLink = useCallback(async () => {
    if (!output || mode !== "encrypt") return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("c", output);
      await navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch {
      // Fallback
    }
  }, [output, mode]);

  const handleNativeShare = useCallback(async () => {
    if (!output) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Secret Emoji Cipher",
          text: output,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyCipher();
    }
  }, [output, handleCopyCipher]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const toggleMode = useCallback((newMode: "encrypt" | "decrypt") => {
    if (newMode === mode) return;
    setMode(newMode);
    setInput(output);
    setOutput("");
    setError("");
  }, [mode, output]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between px-4 py-8 md:py-12 selection:bg-cyan-500/25 selection:text-cyan-200">
      <AppleLiquidBackground mode={mode} />

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-2xl mx-auto space-y-7">
        {/* Header */}
        <header className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 apple-glass-pill text-xs font-medium text-cyan-300/90 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Apple Liquid Cryptography • Zero-Knowledge</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white flex items-center justify-center gap-3">
            <span>EmojiCipher</span>
            <span className="inline-block p-1.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 border border-white/10 shadow-inner">
              {mode === "encrypt" ? (
                <Lock className="w-7 h-7 text-cyan-400" />
              ) : (
                <Unlock className="w-7 h-7 text-amber-400" />
              )}
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            Encrypt confidential messages into high-density emoji streams. 100% client-side, zero data retention.
          </p>
        </header>

        {/* Mode Selector */}
        <div className="flex justify-center">
          <nav aria-label="Cipher Mode" className="p-1 apple-glass-pill flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggleMode("encrypt")}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                mode === "encrypt"
                  ? "bg-gradient-to-r from-cyan-500/90 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt</span>
            </button>

            <button
              type="button"
              onClick={() => toggleMode("decrypt")}
              className={`px-5 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                mode === "decrypt"
                  ? "bg-gradient-to-r from-amber-500/90 to-orange-600 text-white shadow-lg shadow-amber-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Decrypt</span>
            </button>
          </nav>
        </div>

        {/* Main Card */}
        <div className="apple-glass p-6 md:p-8 space-y-6">
          {/* Sample quick picks for Encrypt mode */}
          {mode === "encrypt" && !input && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Quick test templates:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_MESSAGES.map((sample) => (
                  <button
                    key={sample.label}
                    onClick={() => {
                      setInput(sample.text);
                      if (!password) setPassword("AppleSecretKey2026!");
                    }}
                    className="apple-glass-pill px-3 py-1 text-xs text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <label htmlFor="message-input" className="flex items-center gap-1.5">
                <span>{mode === "encrypt" ? "Plaintext Message" : "Emoji Cipher Stream"}</span>
              </label>
              <span className="text-slate-400 font-mono text-[11px]">
                {mode === "encrypt" ? `${inputByteLength} bytes` : `${input.length} chars`}
              </span>
            </div>

            <textarea
              id="message-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "encrypt"
                  ? "Type or paste your secret message here..."
                  : "Paste the emoji cipher stream here (e.g. 🌊🦁⚡🌮🔮...)"
              }
              rows={4}
              className="apple-glass-input w-full p-4 text-sm leading-relaxed resize-none focus:ring-0"
            />
          </div>

          {/* Secret Key Input with Generator & Strength */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <label htmlFor="secret-key" className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Secret Key (Password)</span>
              </label>

              <button
                type="button"
                onClick={() => setPassword(generateStrongKey())}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" />
                Generate Key
              </button>
            </div>

            <div className="relative">
              <input
                id="secret-key"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter shared secret key..."
                className="apple-glass-input w-full p-3.5 pr-12 text-sm font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                title={showPassword ? "Hide key" : "Show key"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Key Strength Indicator */}
            {password && (
              <div className="flex items-center gap-2 pt-1 text-xs">
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full flex-1 rounded-full transition-all duration-300 ${
                        step <= keyStrength.score ? keyStrength.color : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  Key Strength: <strong className="text-slate-200">{keyStrength.label}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleProcess}
              disabled={processing}
              className={`apple-liquid-btn ${
                mode === "decrypt" ? "apple-liquid-btn-decrypt" : ""
              } flex-1 py-3.5 px-6 flex items-center justify-center gap-2.5 text-sm md:text-base disabled:opacity-50`}
            >
              {processing ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === "encrypt" ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Encrypt into Emojis</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Decrypt Message</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="apple-glass-icon-btn px-4 text-slate-400 hover:text-rose-400 hover:border-rose-500/30"
              title="Clear all fields"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs md:text-sm flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="text-rose-400 text-base">⚠️</span>
              <div className="space-y-1">
                <p className="font-semibold text-rose-100">Operation Error</p>
                <p className="text-rose-300/90 leading-relaxed">{error}</p>
              </div>
            </div>
          )}

          {/* Output Section */}
          {output && (
            <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{mode === "encrypt" ? "Encrypted Output" : "Decrypted Secret"}</span>
                </span>

                {mode === "encrypt" && outputEmojiCount > 0 && (
                  <span className="text-[11px] font-mono text-cyan-300 apple-glass-pill px-2.5 py-0.5">
                    {outputEmojiCount} emojis ({output.length} glyphs)
                  </span>
                )}
              </div>

              <div className="relative group">
                <div className="apple-glass-input w-full p-4 text-base md:text-lg min-h-[90px] max-h-[220px] overflow-y-auto break-words select-all font-mono leading-relaxed bg-slate-950/80 border-slate-700/50">
                  {output}
                </div>
              </div>

              {/* Action Pills */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCipher}
                  className="apple-glass-pill px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors"
                >
                  {copiedCipher ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>

                {mode === "encrypt" && (
                  <>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="apple-glass-pill px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-cyan-400">Link Copied!</span>
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy Decrypt Link</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleNativeShare}
                      className="apple-glass-pill px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white hover:border-white/20 flex items-center gap-1.5 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5 text-violet-400" />
                      <span>Share</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="apple-glass-pill p-3.5 flex items-center gap-3 text-slate-400">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">100% Local Execution</p>
              <p className="text-[11px] text-slate-400">Zero network transmission or logging.</p>
            </div>
          </div>

          <div className="apple-glass-pill p-3.5 flex items-center gap-3 text-slate-400">
            <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">966-Base Permutation</p>
              <p className="text-[11px] text-slate-400">Deterministic key-seeded shuffle.</p>
            </div>
          </div>

          <div className="apple-glass-pill p-3.5 flex items-center gap-3 text-slate-400">
            <Sparkles className="w-5 h-5 text-violet-400 shrink-0" />
            <div>
              <p className="font-semibold text-slate-200">Deflate Stream & CRC32</p>
              <p className="text-[11px] text-slate-400">Compact density & tamper detection.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400/80 space-y-1 pt-2">
          <p>EmojiCipher • End-to-End Client-Side Cryptography</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
