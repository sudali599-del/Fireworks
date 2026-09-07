import React, { useEffect, useRef } from 'react';

export default function FireworksBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Festive Diwali Color Palettes
    const colorPalettes = [
      ['#ff0055', '#ff5500', '#ffcc00', '#ffffff'], // Flame Red & Gold
      ['#00f0ff', '#7000ff', '#ff00d4', '#ffffff'], // Neon Purple & Cyan
      ['#00ff66', '#00e5ff', '#ffff00', '#ffffff'], // Emerald Sparkler Green
      ['#ffd700', '#ffaa00', '#ff3300', '#ffe680'], // Pure Diwali Gold
      ['#ff3399', '#9933ff', '#33ccff', '#ffffff'], // Multi-Color Sky Shot
      ['#ff1744', '#f50057', '#d500f9', '#ffffff'], // Royal Ruby & Magenta
      ['#00e676', '#76ff03', '#ffea00', '#ffffff'], // Electric Lime & Gold
    ];

    const fireworks = [];
    const particles = [];

    class Rocket {
      constructor(startX, startY, targetX, targetY) {
        this.x = startX !== undefined ? startX : width * 0.12 + Math.random() * (width * 0.76);
        this.y = startY !== undefined ? startY : height + 15;
        this.targetX = targetX !== undefined ? targetX : width * 0.08 + Math.random() * (width * 0.84);
        this.targetY = targetY !== undefined ? targetY : height * 0.06 + Math.random() * (height * 0.44);
        this.speed = 10 + Math.random() * 6;
        this.angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
        this.trail = [];
        this.trailLength = 10;
        this.exploded = false;
        this.size = 3.5 + Math.random() * 2;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > this.trailLength) this.trail.shift();
        for (let t of this.trail) t.alpha -= 0.1;

        this.x += this.vx;
        this.y += this.vy;

        // Apex detonation
        if (this.vy < 0 && this.y <= this.targetY) {
          this.explode();
        }
      }

      explode() {
        this.exploded = true;
        // Big cracker explosion: 85 to 140 shimmering sparks
        const particleCount = 85 + Math.floor(Math.random() * 55);

        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.palette));
        }

        // Shockwave expansion ring
        for (let i = 0; i < 28; i++) {
          particles.push(new ShockwaveSpark(this.x, this.y, this.palette[0]));
        }
      }

      draw() {
        ctx.save();
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, this.size * (i / this.trail.length), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 210, 100, ${Math.max(0, pt.alpha)})`;
          ctx.shadowColor = '#ffaa00';
          ctx.shadowBlur = 10;
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.restore();
      }
    }

    class Particle {
      constructor(x, y, palette) {
        this.x = x;
        this.y = y;
        this.palette = palette;
        this.color = palette[Math.floor(Math.random() * palette.length)];
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 10;

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.955;
        this.gravity = 0.12;
        this.alpha = 1;
        this.decay = 0.01 + Math.random() * 0.014;
        this.size = 2.5 + Math.random() * 3.5;
        this.flicker = Math.random() > 0.4;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
        this.size = Math.max(0.2, this.size * 0.985);
      }

      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.flicker && Math.random() > 0.35 ? this.alpha * 0.6 : this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }
    }

    class ShockwaveSpark {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = 8 + Math.random() * 6;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = 0.026;
        this.size = 2.2;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.93;
        this.y *= 0.93;
        this.alpha -= this.decay;
      }
      draw() {
        if (this.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.restore();
      }
    }

    const launchInstantBlast = (targetX, targetY) => {
      const palette = colorPalettes[Math.floor(Math.random() * colorPalettes.length)];
      const count = 90 + Math.floor(Math.random() * 50);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(targetX, targetY, palette));
      }
      for (let i = 0; i < 24; i++) {
        particles.push(new ShockwaveSpark(targetX, targetY, palette[0]));
      }
    };

    const handleWindowClick = (e) => {
      if (e.target.closest('button, input, a, [role="button"], .no-firework')) return;
      launchInstantBlast(e.clientX, e.clientY);
    };
    window.addEventListener('click', handleWindowClick);

    let lastLaunch = 0;

    const animate = (timestamp) => {
      ctx.fillStyle = 'rgba(6, 2, 18, 0.22)';
      ctx.fillRect(0, 0, width, height);

      if (timestamp - lastLaunch > 750 + Math.random() * 650) {
        fireworks.push(new Rocket());
        if (Math.random() > 0.45) {
          setTimeout(() => {
            fireworks.push(new Rocket());
          }, 200);
        }
        lastLaunch = timestamp;
      }

      for (let i = fireworks.length - 1; i >= 0; i--) {
        const fw = fireworks[i];
        fw.update();
        fw.draw();
        if (fw.exploded) {
          fireworks.splice(i, 1);
        }
      }

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

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleWindowClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.92 }}
    />
  );
}
