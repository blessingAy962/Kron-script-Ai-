import React, { useEffect, useRef, useState } from "react";
import { safeGetItem, safeSetItem } from "@/src/lib/safeStorage";

interface GlassBall {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRotation: number;
  elasticity: number; // bounce retention
  life: number; // 1.0 -> 0.0
  decay: number; // reduction rate per frame
  domElement: HTMLDivElement | null;
  glowColor: string; // Dynamic colors based on where pressed
}

// Module-level shared AudioContext for efficient state persistence and zero loading latencies
let sharedAudioCtx: AudioContext | null = null;

const playPopSound = (isInteractive: boolean) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!sharedAudioCtx) {
      sharedAudioCtx = new AudioContextClass();
    }

    if (sharedAudioCtx.state === "suspended") {
      sharedAudioCtx.resume();
    }

    const ctx = sharedAudioCtx;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    if (isInteractive) {
      // Interactive element clicks (buttons, links): gorgeous, crystal clean wood-glass pluck
      osc.type = "sine";
      osc.frequency.setValueAtTime(820, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.1);

      gainNode.gain.setValueAtTime(0.04, now); // low, non-intrusive volume
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      // General canvas/background clicks: featherlight micro bubble droplet sound
      osc.type = "sine";
      osc.frequency.setValueAtTime(1150, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.06);

      gainNode.gain.setValueAtTime(0.015, now); // ultra-low presence sound
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.start(now);
      osc.stop(now + 0.06);
    }
  } catch (err) {
    console.debug("Web Audio click output bypassed due to browser settings/gesture states:", err);
  }
};

export function TouchPhysicsCanvas() {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_touch_sound", "true");
    return saved !== "false"; // Default to enabled
  });

  const [bubblesEnabled, setBubblesEnabled] = useState<boolean>(() => {
    const saved = safeGetItem("auratech_glass_bubbles", "true");
    return saved !== "false"; // Default to enabled
  });

  const soundEnabledRef = useRef<boolean>(soundEnabled);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    safeSetItem("auratech_touch_sound", soundEnabled ? "true" : "false");
  }, [soundEnabled]);

  const bubblesEnabledRef = useRef<boolean>(bubblesEnabled);
  useEffect(() => {
    bubblesEnabledRef.current = bubblesEnabled;
    safeSetItem("auratech_glass_bubbles", bubblesEnabled ? "true" : "false");
  }, [bubblesEnabled]);

  // Synchronize on settings event toggle
  useEffect(() => {
    const handleAudioEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.enabled === "boolean") {
        setSoundEnabled(customEvent.detail.enabled);
      }
    };
    window.addEventListener("auratech_audio_toggle", handleAudioEvent);
    return () => {
      window.removeEventListener("auratech_audio_toggle", handleAudioEvent);
    };
  }, []);

  // Synchronize on bubbles event toggle
  useEffect(() => {
    const handleBubblesEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && typeof customEvent.detail.enabled === "boolean") {
        setBubblesEnabled(customEvent.detail.enabled);
      }
    };
    window.addEventListener("auratech_bubbles_toggle", handleBubblesEvent);
    return () => {
      window.removeEventListener("auratech_bubbles_toggle", handleBubblesEvent);
    };
  }, []);

  const ballsRef = useRef<GlassBall[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextIdRef = useRef<number>(1);

  useEffect(() => {
    const handleInteraction = (clientX: number, clientY: number, target: EventTarget | null) => {
      if (!containerRef.current) return;

      // Ensure clicks on the audio toggle itself do not trigger physics balls
      if (target instanceof Element && target.closest("#touch-audio-toggle")) {
        return;
      }

      // Determine size and velocity offsets based on the target element
      const isInteractive = target instanceof Element && (
        target.closest("button") || 
        target.closest("a") || 
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("textarea")
      );

      // Trigger the tactile acoustic pop sound if audio effects are toggled on
      if (soundEnabledRef.current) {
        playPopSound(!!isInteractive);
      }

      // Stop here if the user has disabled the glass bubbles physics completely
      if (!bubblesEnabledRef.current) {
        return;
      }

      // Create 1-2 glass balls based on interactive feedback strength
      const count = isInteractive ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const id = nextIdRef.current++;
        // Elegant styling based on interaction state
        const glowColor = isInteractive 
          ? "from-purple-500/40 via-indigo-400/30 to-white/40" 
          : "from-purple-400/25 via-pink-400/15 to-white/30";

        // Randomize physics characteristics for realistic diversity
        const size = isInteractive 
          ? Math.random() * 12 + 24  // Smaller 24px - 36px for snappy responsive render
          : Math.random() * 8 + 18;  // Lightweight 18px - 26px for subtle ticks

        // Launch upwards and outwards with high energy
        const angle = (Math.random() * 100 - 50) * (Math.PI / 180) - Math.PI / 2; // sharper vertical bounce
        const speed = (Math.random() * 7 + 5) * (isInteractive ? 1.2 : 1.0);
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        const ball: GlassBall = {
          id,
          x: clientX - size / 2,
          y: clientY - size / 2,
          vx,
          vy,
          size,
          rotation: Math.random() * 360,
          vRotation: (Math.random() * 5 - 2.5),
          elasticity: Math.random() * 0.1 + 0.55, // Snappier bounce
          life: 1.0,
          decay: Math.random() * 0.012 + 0.018, // Swift decay (fades away inside 0.5-0.7 seconds)
          domElement: null,
          glowColor,
        };

        // Create the physical DOM representation
        const el = document.createElement("div");
        el.id = `physics-ball-${id}`;
        // Base tailwind styling classes for perfect luxury glassy representation with absolute hardware acceleration
        el.className = `fixed pointer-events-none z-[9999] rounded-full border border-white/30 dark:border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),_0_6px_16px_rgba(168,85,247,0.12)] bg-gradient-to-tr ${ball.glowColor} will-change-transform`;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) rotate(${ball.rotation}deg)`;
        
        // Add frosted highlights inside the glass ball for organic premium lighting 
        const reflection = document.createElement("div");
        reflection.className = "absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-white/60 filter blur-[0.2px] pointer-events-none";
        el.appendChild(reflection);

        containerRef.current.appendChild(el);
        ball.domElement = el;

        ballsRef.current.push(ball);
      }

      // Keep screen-space elements strictly capped at 6 to prevent layout and render lagging
      if (ballsRef.current.length > 6) {
        const excess = ballsRef.current.splice(0, ballsRef.current.length - 6);
        excess.forEach((oldBall) => {
          if (oldBall.domElement && oldBall.domElement.parentNode) {
            oldBall.domElement.parentNode.removeChild(oldBall.domElement);
          }
        });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Direct high-performance pointer inputs (mouse, touch pens, screen taps)
      // Ignore right clicks or auxiliary clicks
      if (e.button > 0) return;
      handleInteraction(e.clientX, e.clientY, e.target);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  // Frame simulation loop running in high efficiency requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;

    const gravity = 0.32; // Organic gravity force
    const windResistance = 0.99; // Air drag / friction coefficient

    const updatePhysics = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Update positions, bounding collisions, and life decay
      const activeBalls: GlassBall[] = [];

      for (let i = 0; i < ballsRef.current.length; i++) {
        const ball = ballsRef.current[i];
        if (!ball.domElement) continue;

        // Apply environmental physics forces
        ball.vy += gravity;
        ball.vx *= windResistance;
        ball.vy *= windResistance;

        // Apply velocities
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.rotation += ball.vRotation;
        ball.life -= ball.decay;

        // Elastic collisions - Bottom screen edge
        if (ball.y + ball.size > height) {
          ball.y = height - ball.size;
          ball.vy = -Math.abs(ball.vy) * ball.elasticity;
          // Apply horizontal friction on ground bounce
          ball.vx *= 0.92;
          // Trigger slight rotation speed-up on bounce
          ball.vRotation += ball.vx * 0.2;
        }

        // Elastic collisions - Right screen edge
        if (ball.x + ball.size > width) {
          ball.x = width - ball.size;
          ball.vx = -Math.abs(ball.vx) * ball.elasticity;
        }

        // Elastic collisions - Left screen edge
        if (ball.x < 0) {
          ball.x = 0;
          ball.vx = Math.abs(ball.vx) * ball.elasticity;
        }

        // Top edge damping - optionally keep screen limits
        if (ball.y < 0) {
          ball.y = 0;
          ball.vy = Math.abs(ball.vy) * ball.elasticity;
        }

        // Render direct styles to DOM node bypasses React reconciliation lifecycle completely
        if (ball.life <= 0) {
          if (ball.domElement.parentNode) {
            ball.domElement.parentNode.removeChild(ball.domElement);
          }
        } else {
          ball.domElement.style.transform = `translate3d(${ball.x}px, ${ball.y}px, 0) rotate(${ball.rotation}deg) scale(${ball.life})`;
          ball.domElement.style.opacity = `${Math.min(1, ball.life * 1.5)}`;
          activeBalls.push(ball);
        }
      }

      ballsRef.current = activeBalls;
      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    return () => {
      cancelAnimationFrame(animationFrameId);
      // Clean up outstanding DOM element references
      ballsRef.current.forEach((ball) => {
        if (ball.domElement && ball.domElement.parentNode) {
          try {
            ball.domElement.parentNode.removeChild(ball.domElement);
          } catch (e) {}
        }
      });
      ballsRef.current = [];
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none select-none z-[9999]" 
      id="auratech-touch-physics-container"
    />
  );
}

export default TouchPhysicsCanvas;
