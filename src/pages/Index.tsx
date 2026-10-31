import React, { useState, useCallback, useEffect, useMemo } from "react";
import { encrypt, decrypt } from "@/lib/emojiCrypto";
import {
  Lock,
  Unlock,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  ExternalLink,
  Loader2,
} from "lucide-react";

function calculateKeyStrength(key: string): { label: string; color: string; width: string } {
  if (!key) return { label: "", color: "bg-slate-700", width: "0%" };
  let score = 0;
  if (key.length >= 6) score += 1;
  if (key.length >= 10) score += 1;
  if (/[A-Z]/.test(key) && /[a-z]/.test(key)) score += 1;
  if (/[0-9]/.test(key)) score += 1;
  if (/[^A-Za-z0-9]/.test(key)) score += 1;

  if (score <= 1) return { label: "Weak key", color: "bg-rose-500", width: "25%" };
  if (score === 2) return { label: "Moderate", color: "bg-amber-500", width: "50%" };
  if (score === 3 || score === 4) return { label: "Strong", color: "bg-emerald-500", width: "75%" };
  return { label: "Very strong", color: "bg-cyan-400", width: "100%" };
}

function generateSecureKey(): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) part1 += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 4; i++) part2 += chars[Math.floor(Math.random() * chars.length)];
  return `key-${part1}-${part2}`;
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

  // Auto-load cipher from URL (?c=... or ?cipher=...)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlCipher = params.get("c") || params.get("cipher");
      if (urlCipher) {
        setMode("decrypt");
        setInput(decodeURIComponent(urlCipher));
      }
    } catch {
      // Ignore URL errors
    }
  }, []);

  const keyStrength = useMemo(() => calculateKeyStrength(password), [password]);

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
      setError("Please enter a secret key.");
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
      setError(e.message || (mode === "encrypt" ? "Encryption failed." : "Decryption failed. Please check your key."));
    } finally {
      setProcessing(false);
    }
  }, [input, password, mode]);

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
      setTimeout(() => setCopiedCipher(false), 2000);
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
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // Fallback
    }
  }, [output, mode]);

  const handleClear = useCallback(() => {
    setInput("");
    setOutput("");
    setError("");
  }, []);

  const switchMode = useCallback((targetMode: "encrypt" | "decrypt") => {
    if (targetMode === mode) return;
    setMode(targetMode);
    setInput(output);
    setOutput("");
    setError("");
  }, [mode, output]);

  return (
    <div className="min-h-screen bg-[#090a0f] text-[#f8fafc] flex flex-col justify-between px-4 py-10 selection:bg-amber-500/30 selection:text-amber-200">
      <main className="w-full max-w-xl mx-auto space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#141720] border border-[#222633] flex items-center justify-center text-amber-400">
              {mode === "encrypt" ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5 text-sky-400" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              EmojiCipher
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            End-to-end client-side emoji encryption
          </p>
        </header>

        {/* Mode Selector */}
        <div className="flex justify-center">
          <div className="p-1 bg-[#101218] border border-[#1f232e] rounded-xl flex items-center gap-1">
            <button
              type="button"
              onClick={() => switchMode("encrypt")}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                mode === "encrypt"
                  ? "bg-[#1f232e] text-amber-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt</span>
            </button>

            <button
              type="button"
              onClick={() => switchMode("decrypt")}
              className={`px-5 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                mode === "decrypt"
                  ? "bg-[#1f232e] text-sky-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Decrypt</span>
            </button>
          </div>
        </div>

        {/* Main Panel */}
        <div className="stealth-card p-5 md:p-6 space-y-5">
          {/* Input Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium text-slate-300">
              <label htmlFor="text-input">
                {mode === "encrypt" ? "Plaintext Message" : "Emoji Cipher"}
              </label>
              <span className="text-slate-400 font-mono text-[11px]">
                {input.length} chars
              </span>
            </div>

            <textarea
              id="text-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "encrypt"
                  ? "Type or paste your message..."
                  : "Paste emoji cipher here..."
              }
              rows={4}
              className="stealth-input w-full p-3.5 text-sm font-mono leading-relaxed resize-none"
            />
          </div>

          {/* Secret Key Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-medium text-slate-300">
              <label htmlFor="key-input" className="flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                <span>Secret Key</span>
              </label>

              <button
                type="button"
                onClick={() => setPassword(generateSecureKey())}
                className="text-[11px] text-amber-400 hover:text-amber-300 transition-colors"
              >
                Generate Key
              </button>
            </div>

            <div className="relative">
              <input
                id="key-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter shared secret key..."
                className="stealth-input w-full p-3 pr-11 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Subtle Key Strength Bar */}
            {password && (
              <div className="space-y-1 pt-1">
                <div className="w-full h-1 bg-[#1a1d26] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-200 ${keyStrength.color}`}
                    style={{ width: keyStrength.width }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>{keyStrength.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleProcess}
              disabled={processing}
              className={`flex-1 py-3 px-5 text-sm flex items-center justify-center gap-2 ${
                mode === "encrypt" ? "stealth-btn-amber" : "stealth-btn-teal"
              } disabled:opacity-50`}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === "encrypt" ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Encrypt Message</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Decrypt Cipher</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleClear}
              className="stealth-icon-btn px-3.5"
              title="Clear all fields"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
              <span className="text-rose-400">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Output Section */}
          {output && (
            <div className="space-y-2.5 pt-2 border-t border-[#1f232e]">
              <div className="flex justify-between items-center text-xs font-medium text-slate-300">
                <span>{mode === "encrypt" ? "Encrypted Emojis" : "Decrypted Result"}</span>
                {mode === "encrypt" && outputEmojiCount > 0 && (
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {outputEmojiCount} emojis
                  </span>
                )}
              </div>

              <div className="stealth-input w-full p-4 text-base min-h-[90px] max-h-[220px] overflow-y-auto break-words select-all font-mono leading-relaxed bg-[#07080c]">
                {output}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCopyCipher}
                  className="px-3 py-1.5 rounded-lg bg-[#151821] border border-[#222633] text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors flex items-center gap-1.5"
                >
                  {copiedCipher ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Result</span>
                    </>
                  )}
                </button>

                {mode === "encrypt" && (
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 rounded-lg bg-[#151821] border border-[#222633] text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-amber-400 font-semibold">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        <span>Copy Decrypt Link</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-400/80 pt-2">
          <span>All encryption runs client-side in memory • Zero network logging</span>
        </footer>
      </main>
    </div>
  );
};

export default Index;
