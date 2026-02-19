import { useState, useCallback } from "react";
import { encrypt, decrypt } from "@/lib/emojiCrypto";
import { Lock, Unlock, Copy, Trash2, ArrowRightLeft, Eye, EyeOff, Check } from "lucide-react";
import EmojiRain from "@/components/EmojiRain";

const Index = () => {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleProcess = useCallback(() => {
    setError("");
    setOutput("");
    if (!input.trim() || !password.trim()) {
      setError("Both message and secret key are required.");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      try {
        const result = mode === "encrypt" ? encrypt(input, password) : decrypt(input, password);
        setOutput(result);
      } catch (e: any) {
        setError(mode === "encrypt" ? "Encryption failed. Check your input." : "Decryption failed. Wrong key or corrupted data.");
      }
      setProcessing(false);
    }, 300);
  }, [input, password, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput("");
    setPassword("");
    setOutput("");
    setError("");
  }, []);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "encrypt" ? "decrypt" : "encrypt"));
    setInput(output);
    setOutput("");
    setError("");
  }, [output]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10 overflow-hidden">
      <EmojiRain />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight glow-text">
            EmojiVault 🔐
          </h1>
          <p className="text-muted-foreground text-sm font-mono">
            Secret emoji-encrypted messaging
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="glass-panel px-5 py-2.5 flex items-center gap-2 text-sm font-mono text-foreground hover:border-primary/40 transition-all group"
          >
            {mode === "encrypt" ? (
              <Lock className="w-4 h-4 text-primary" />
            ) : (
              <Unlock className="w-4 h-4 text-secondary" />
            )}
            <span className="uppercase tracking-widest text-xs">
              {mode === "encrypt" ? "Encrypt Mode" : "Decrypt Mode"}
            </span>
            <ArrowRightLeft className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Main Panel */}
        <div className="glass-panel glow-border p-6 space-y-5">
          {/* Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              {mode === "encrypt" ? "📝 Message" : "🔤 Emoji Cipher"}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encrypt" ? "Enter your secret message..." : "Paste emoji cipher here..."}
              className="input-cyber w-full h-28 p-4 resize-none text-sm"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              🔑 Secret Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter shared secret key..."
                className="input-cyber w-full p-4 pr-12 text-sm"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleProcess}
              disabled={processing}
              className="glow-btn flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {processing ? (
                <span className="animate-pulse-glow">Processing...</span>
              ) : mode === "encrypt" ? (
                <>
                  <Lock className="w-4 h-4" /> Encrypt
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" /> Decrypt
                </>
              )}
            </button>
            <button
              onClick={handleClear}
              className="glass-panel px-4 py-3 text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
              title="Clear all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="text-destructive text-sm font-mono bg-destructive/10 border border-destructive/20 rounded-xl p-3">
              ⚠️ {error}
            </div>
          )}

          {/* Output */}
          {output && (
            <div className="space-y-2 animate-[fade-in_0.4s_ease-out]">
              <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                {mode === "encrypt" ? "🔒 Encrypted Output" : "📄 Decrypted Message"}
              </label>
              <div className="relative">
                <div className="input-cyber w-full p-4 text-sm min-h-[60px] break-all select-all whitespace-pre-wrap">
                  {output}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 glass-panel p-2 text-muted-foreground hover:text-primary transition-all"
                  title="Copy to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-xs text-primary font-mono animate-[fade-in_0.2s_ease-out]">
                  ✓ Copied to clipboard
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground font-mono opacity-60">
          All encryption runs locally • No data leaves your device
        </p>
      </div>
    </div>
  );
};

export default Index;
