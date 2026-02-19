import { useEffect, useState } from "react";

const RAIN_EMOJIS = ["🔐","🔑","🛡️","💎","⚡","🔮","🌟","✨","🔒","🗝️","💫","🧿","🪬","⭐","🔓"];

interface RainDrop {
  id: number;
  emoji: string;
  left: number;
  delay: number;
  duration: number;
  size: number;
}

const EmojiRain = () => {
  const [drops, setDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    const generated: RainDrop[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: RAIN_EMOJIS[Math.floor(Math.random() * RAIN_EMOJIS.length)],
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 8 + Math.random() * 12,
      size: 14 + Math.random() * 18,
    }));
    setDrops(generated);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden>
      {drops.map((drop) => (
        <span
          key={drop.id}
          className="absolute animate-emoji-fall opacity-0"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
            fontSize: `${drop.size}px`,
          }}
        >
          {drop.emoji}
        </span>
      ))}
      {/* Scanline overlay */}
      <div className="absolute inset-0 scanline" />
    </div>
  );
};

export default EmojiRain;
