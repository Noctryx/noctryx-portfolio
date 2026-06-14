import { useEffect, useRef } from "react";

const PARTICLE_COUNT = 80;
const CONNECTION_DISTANCE = 140;
const MOUSE_REPEL_RADIUS = 120;
const MOUSE_ATTRACT_RADIUS = 200;
const BASE_SPEED = 0.3;
const PARTICLE_COLOR = "34, 197, 94"; // rgb of green-400
const LINE_COLOR = "34, 197, 94";

function createParticle(width, height) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * BASE_SPEED,
    vy: (Math.random() - 0.5) * BASE_SPEED,
    radius: Math.random() * 1.5 + 0.5,
    opacity: Math.random() * 0.5 + 0.2,
    pulseOffset: Math.random() * Math.PI * 2,
  };
}

export function ParticleConstellation({ mousePosition }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);

  useEffect(() => {
    mouseRef.current = mousePosition;
  }, [mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reinitialize particles on resize
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas.width, canvas.height),
      );
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      timeRef.current += 0.012;
      const { width, height } = canvas;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update positions
      for (const p of particles) {
        // Mouse interaction
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < MOUSE_REPEL_RADIUS && dist > 0) {
          // Gentle repulsion close to cursor
          const force = (MOUSE_REPEL_RADIUS - dist) / MOUSE_REPEL_RADIUS;
          p.vx += (dx / dist) * force * 0.08;
          p.vy += (dy / dist) * force * 0.08;
        } else if (dist < MOUSE_ATTRACT_RADIUS && dist > MOUSE_REPEL_RADIUS) {
          // Subtle drift toward cursor at medium range
          const force =
            ((MOUSE_ATTRACT_RADIUS - dist) / MOUSE_ATTRACT_RADIUS) * 0.012;
          p.vx -= (dx / dist) * force;
          p.vy -= (dy / dist) * force;
        }

        // Speed cap
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > 1.4) {
          p.vx = (p.vx / speed) * 1.4;
          p.vy = (p.vy / speed) * 1.4;
        }

        // Slow drift back to base speed
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const pulse = Math.sin(timeRef.current + p.pulseOffset) * 0.15 + 0.85;
        const finalOpacity = p.opacity * pulse;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          p.radius * 3,
        );
        gradient.addColorStop(0, `rgba(${PARTICLE_COLOR}, ${finalOpacity})`);
        gradient.addColorStop(1, `rgba(${PARTICLE_COLOR}, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${finalOpacity * 1.4})`;
        ctx.fill();
      }

      // Draw mouse proximity burst — rune ring around cursor
      const mouseDist = 0;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, MOUSE_REPEL_RADIUS * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${LINE_COLOR}, 0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
}
