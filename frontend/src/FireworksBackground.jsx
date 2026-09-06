import React, { useEffect, useRef } from 'react';

/**
 * High-Attraction Ultra-Realistic Cracker Blasting & Fireworks Background
 * - Multi-stage fireworks (Peony, Chrysanthemum, Ring, Willow, Crackling)
 * - Rising rockets with sparkling trails
 * - Realistic gravity, air drag, flicker, and color decay
 * - Interactive pointer blast anywhere on screen
 */
export default function FireworksBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth || 1024);
    let height = (canvas.height = window.innerHeight || 768);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth || 1024;
      height = canvas.height = window.innerHeight || 768;
    };
    window.addEventListener('resize', handleResize);

    // Vibrant Festival Color Themes
    const palettes = [
      ['#ff0055', '#ff5500', '#ffcc00', '#ffffff', '#ff99bb'], // Festive Ruby & Gold
      ['#00f0ff', '#7000ff', '#ff00d4', '#ffffff', '#80e5ff'], // Neon Cosmic Sky
      ['#00ff66', '#00e5ff', '#ffff00', '#ffffff', '#a3ff80'], // Emerald Aurora
      ['#ffd700', '#ff8800', '#ff2200', '#fff3b0', '#ffffff'], // Sivakasi Golden Sparkle
      ['#ff1493', '#9932cc', '#00bfff', '#ffffff', '#ffb6c1'], // Royal Diwali Celebration
      ['#ff3333', '#ffaa00', '#33ff33', '#ffff33', '#ffffff'], // Multi-Color Rainbow Wala
    ];

    const rockets = [];
    const particles = [];

    class Sparkle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 2 + 1;
        this.alpha = 1;
        this.decay = Math.random() * 0.05 + 0.02;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y, palette, shellType = 'peony') {
        this.x = x;
        this.y = y;
        this.palette = palette;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        this.shellType = shellType;

        const angle = Math.random() * Math.PI * 2;
        const speed = shellType === 'willow'
          ? Math.random() * 6 + 2
          : Math.random() * 11 + 3;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.friction = shellType === 'willow' ? 0.94 : 0.96;
        this.gravity = shellType === 'willow' ? 0.18 : 0.14;
        this.alpha = 1;
        this.decay = shellType === 'willow'
          ? Math.random() * 0.01 + 0.008
          : Math.random() * 0.016 + 0.012;

        this.size = Math.random() * 3.5 + 2;
        this.flicker = Math.random() > 0.4;
        this.trail = [];
        this.trailLength = shellType === 'willow' ? 6 : 4;
        this.hasCrackled = false;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: this.alpha });
        if (this.trail.length > this.trailLength) this.trail.shift();

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;

        this.alpha -= this.decay;
        this.size = Math.max(0.3, this.size * 0.99);

        // Crackling micro explosion near decay
        if (!this.hasCrackled && this.alpha < 0.35 && Math.random() < 0.06) {
          this.hasCrackled = true;
          for (let i = 0; i < 3; i++) {
            particles.push(new Sparkle(this.x, this.y, '#ffffff'));
          }
        }
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();

        // Draw glittering motion trail
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          const tAlpha = (i / this.trail.length) * this.alpha * 0.7;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.globalAlpha = Math.max(0, tAlpha);
          ctx.shadowColor = this.color;
          ctx.shadowBlur = 6;
          ctx.fill();
        }

        // Main particle core with bright glow
        const currentAlpha = this.flicker && Math.random() > 0.35 ? this.alpha * 0.5 : this.alpha;
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 14;
        ctx.fill();

        // White hot center
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 8;
        ctx.fill();

        ctx.restore();
      }
    }

    class Rocket {
      constructor(startX, targetX, targetY) {
        this.x = startX !== undefined ? startX : width * 0.15 + Math.random() * (width * 0.7);
        this.y = height + 10;
        this.targetX = targetX !== undefined ? targetX : width * 0.1 + Math.random() * (width * 0.8);
        this.targetY = targetY !== undefined ? targetY : height * 0.05 + Math.random() * (height * 0.42);
        this.speed = 12 + Math.random() * 5;
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.palette = palettes[Math.floor(Math.random() * palettes.length)];
        this.trail = [];
        this.trailLength = 10;
        this.exploded = false;
        this.size = 4;
        const types = ['peony', 'chrysanthemum', 'willow', 'ring'];
        this.shellType = types[Math.floor(Math.random() * types.length)];
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > this.trailLength) this.trail.shift();
        for (let t of this.trail) t.alpha -= 0.1;

        this.x += this.vx;
        this.y += this.vy;

        if (this.vy < 0 && this.y <= this.targetY) {
          this.explode();
        }
      }

      explode() {
        this.exploded = true;
        const count = this.shellType === 'willow' ? 120 : 90 + Math.floor(Math.random() * 50);

        for (let i = 0; i < count; i++) {
          particles.push(new Particle(this.x, this.y, this.palette, this.shellType));
        }

        // Secondary ring explosion
        if (this.shellType === 'ring') {
          const ringPalette = ['#ffffff', '#ffd700'];
          for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const p = new Particle(this.x, this.y, ringPalette, 'peony');
            p.vx = Math.cos(angle) * 7;
            p.vy = Math.sin(angle) * 7;
            particles.push(p);
          }
        }
      }

      draw() {
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 180, 50, ${Math.max(0, pt.alpha)})`;
          ctx.shadowColor = '#ff8800';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      }
    }

    let lastLaunch = 0;

    const createInstantBlast = (x, y) => {
      const palette = palettes[Math.floor(Math.random() * palettes.length)];
      const count = 100 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y, palette, 'peony'));
      }
    };

    const animate = (timestamp) => {
      ctx.clearRect(0, 0, width, height);

      // Autonomous Festival Launches (Rapid double & triple blasts)
      if (timestamp - lastLaunch > 700 + Math.random() * 600) {
        rockets.push(new Rocket());
        if (Math.random() > 0.4) {
          setTimeout(() => {
            rockets.push(new Rocket());
          }, 180);
        }
        if (Math.random() > 0.7) {
          setTimeout(() => {
            rockets.push(new Rocket());
          }, 360);
        }
        lastLaunch = timestamp;
      }

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw();
        if (r.exploded) {
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw();
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handlePointerDown = (e) => {
      if (['INPUT', 'BUTTON', 'A', 'TEXTAREA'].includes(e.target?.tagName)) return;
      const x = e.clientX;
      const y = e.clientY;
      createInstantBlast(x, y);
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.96, pointerEvents: 'none' }}
    />
  );
}
