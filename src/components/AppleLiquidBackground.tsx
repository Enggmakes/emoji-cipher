import React, { useEffect, useRef } from "react";

interface AppleLiquidBackgroundProps {
  mode: "encrypt" | "decrypt";
}

const AppleLiquidBackground: React.FC<AppleLiquidBackgroundProps> = ({ mode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = e.clientY / window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Liquid metaball orbs with organic sinusoidal floating
    const orbs = [
      {
        x: 0.25,
        y: 0.25,
        radius: 280,
        vx: 0.0006,
        vy: 0.0008,
        phase: 0,
        color1: mode === "encrypt" ? "rgba(56, 189, 248, 0.22)" : "rgba(245, 158, 11, 0.20)",
        color2: mode === "encrypt" ? "rgba(99, 102, 241, 0.0)" : "rgba(239, 68, 68, 0.0)",
      },
      {
        x: 0.75,
        y: 0.35,
        radius: 340,
        vx: -0.0007,
        vy: 0.0005,
        phase: 2,
        color1: mode === "encrypt" ? "rgba(129, 140, 248, 0.20)" : "rgba(244, 63, 94, 0.20)",
        color2: mode === "encrypt" ? "rgba(192, 132, 252, 0.0)" : "rgba(217, 70, 239, 0.0)",
      },
      {
        x: 0.5,
        y: 0.75,
        radius: 320,
        vx: 0.0005,
        vy: -0.0006,
        phase: 4,
        color1: mode === "encrypt" ? "rgba(45, 212, 191, 0.18)" : "rgba(251, 191, 36, 0.16)",
        color2: mode === "encrypt" ? "rgba(56, 189, 248, 0.0)" : "rgba(245, 158, 11, 0.0)",
      },
      {
        x: 0.8,
        y: 0.8,
        radius: 260,
        vx: -0.0005,
        vy: -0.0008,
        phase: 5,
        color1: mode === "encrypt" ? "rgba(168, 85, 247, 0.16)" : "rgba(236, 72, 153, 0.16)",
        color2: "transparent",
      },
    ];

    let t = 0;

    const render = () => {
      t += 0.015;

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep Apple OLED base
      ctx.fillStyle = "#050811";
      ctx.fillRect(0, 0, width, height);

      // Render interactive fluid liquid metaballs
      for (let i = 0; i < orbs.length; i++) {
        const orb = orbs[i];
        // Organic sinusoidal motion + mouse bias
        const posX = (orb.x + Math.sin(t * 0.7 + orb.phase) * 0.08 + (mouseRef.current.x - 0.5) * 0.12) * width;
        const posY = (orb.y + Math.cos(t * 0.8 + orb.phase) * 0.08 + (mouseRef.current.y - 0.5) * 0.12) * height;
        const radius = orb.radius + Math.sin(t + orb.phase) * 30;

        const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, Math.max(10, radius));
        gradient.addColorStop(0, orb.color1);
        gradient.addColorStop(1, orb.color2 || "transparent");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(posX, posY, Math.max(10, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      // Cursor light pool (soft Apple spotlight)
      const mouseGrad = ctx.createRadialGradient(
        mouseRef.current.x * width,
        mouseRef.current.y * height,
        0,
        mouseRef.current.x * width,
        mouseRef.current.y * height,
        350
      );
      mouseGrad.addColorStop(
        0,
        mode === "encrypt" ? "rgba(56, 189, 248, 0.10)" : "rgba(251, 146, 60, 0.09)"
      );
      mouseGrad.addColorStop(1, "transparent");
      ctx.fillStyle = mouseGrad;
      ctx.beginPath();
      ctx.arc(mouseRef.current.x * width, mouseRef.current.y * height, 350, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [mode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
      {/* Dynamic Fluid Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Apple Liquid Glass Mesh Grid / Noise */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Top subtle liquid specular glare */}
      <div className="absolute top-0 left-0 right-0 h-[380px] bg-gradient-to-b from-cyan-500/[0.04] via-indigo-500/[0.02] to-transparent blur-3xl pointer-events-none" />

      {/* Floating Liquid Glass Orbs with Specular Glaze */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/[0.08] blur-[90px] animate-pulse" style={{ animationDuration: "8s" }} />
      <div className="absolute top-1/2 -right-32 w-[480px] h-[480px] rounded-full bg-violet-500/[0.07] blur-[110px] animate-pulse" style={{ animationDuration: "10s" }} />
      <div className="absolute -bottom-24 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-500/[0.06] blur-[120px] animate-pulse" style={{ animationDuration: "12s" }} />
    </div>
  );
};

export default AppleLiquidBackground;
