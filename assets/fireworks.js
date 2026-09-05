/**
 * Selvaganapathy Traders - Sun Flag Fireworks, Sivakasi
 * CINEMATIC GRAND FINALE ULTRA-HIGH-EFFECT FIREWORKS ENGINE
 * Features:
 *  1. Additive Blending (ctx.globalCompositeOperation = 'lighter') for intense blazing glow
 *  2. Expanding Shockwave Energy Rings on Shell Detonation
 *  3. 2-Stage Multi-Break Cluster Shells (Secondary Twinkle Starbursts)
 *  4. Flower Pot (Aanar) Sparkling Gold & Silver Jet Streams
 *  5. Ground Chakkar Swirling Vortex Fiery Wheels
 *  6. Golden Brocade Willow Waterfall Cascades with Sparkling Embers
 *  7. Interactive Multi-Explosion Cursor/Touch Bursts
 */

(function () {
  'use strict';

  const canvas = document.getElementById('fireworks-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 100);
  }, { passive: true });

  const rockets = [];
  const particles = [];
  const shockwaves = [];
  const fountains = [];
  const chakkars = [];

  // Ultra-Vivid High Dynamic Neon Color Palettes
  const PALETTES = [
    { name: 'Royal Gold & Ruby Sun', colors: ['#FFD700', '#FF1744', '#FF9100', '#FF3D00', '#FFE57F', '#FFFFFF'] },
    { name: 'Electric Emerald & Cyan Star', colors: ['#00E676', '#00E5FF', '#1DE9B6', '#76FF03', '#A7FFEB', '#FFFFFF'] },
    { name: 'Diwali Magenta & Cyber Violet', colors: ['#FF007F', '#D500F9', '#7C4DFF', '#FF4081', '#EA80FC', '#FFFFFF'] },
    { name: 'Golden Brocade Willow', colors: ['#FFE082', '#FFD54F', '#FFCA28', '#FFC107', '#FFA000', '#FFFFFF'] },
    { name: 'Carnival Multi-Colour', colors: ['#FF1744', '#FFEA00', '#00E676', '#00E5FF', '#D500F9', '#FF6D00', '#FFFFFF'] },
    { name: 'Diamond Sapphire & White Ice', colors: ['#00B0FF', '#40C4FF', '#80D8FF', '#FFFFFF', '#FFD700', '#FF4081'] }
  ];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function getRandomPalette() {
    return PALETTES[Math.floor(Math.random() * PALETTES.length)];
  }

  // ==========================================
  // 1. EXPANDING SHOCKWAVE ENERGY RING
  // ==========================================
  class Shockwave {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.radius = 4;
      this.maxRadius = random(60, 110);
      this.alpha = 0.85;
      this.speed = random(4.5, 7.5);
    }

    update() {
      this.radius += this.speed;
      this.alpha -= 0.045;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.stroke();

      // Soft center glow
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.globalAlpha = this.alpha * 0.35;
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================
  // 2. RISING COMET SKY ROCKET
  // ==========================================
  class Rocket {
    constructor(targetX, targetY, palette) {
      this.x = targetX ? (targetX + random(-50, 50)) : random(width * 0.15, width * 0.85);
      this.y = height + 10;
      this.targetX = targetX || (this.x + random(-80, 80));
      this.targetY = targetY || random(height * 0.10, height * 0.42);

      const angle = Math.atan2(this.targetY - this.y, this.targetX - this.x);
      const distance = Math.hypot(this.targetX - this.x, this.targetY - this.y);
      this.speed = random(8.5, 12);
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      this.distanceToTarget = distance;
      this.distanceTraveled = 0;
      this.palette = palette || getRandomPalette();
      this.color = this.palette.colors[0];
      this.trail = [];
      this.alive = true;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, size: random(2.5, 4.5) });
      if (this.trail.length > 7) this.trail.shift();

      this.x += this.vx;
      this.y += this.vy;
      this.distanceTraveled += this.speed;

      // Rocket fizzy spark trail
      if (Math.random() < 0.6) {
        particles.push(new Particle(this.x, this.y, '#FFD700', 'spark'));
      }

      if (this.y <= this.targetY || this.distanceTraveled >= this.distanceToTarget) {
        this.alive = false;
        createGrandCinematicBlast(this.x, this.y, this.palette);
      }
    }

    draw() {
      // Draw blazing golden comet tail
      for (let i = 0; i < this.trail.length; i++) {
        const pt = this.trail[i];
        const alpha = (i + 1) / this.trail.length;
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      // Glowing Rocket Head
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ==========================================
  // 3. MASTER CRACKER PARTICLE & MULTI-STAGE
  // ==========================================
  class Particle {
    constructor(x, y, color, type = 'peony', palette = null) {
      this.x = x;
      this.y = y;
      this.lastX = x;
      this.lastY = y;
      this.type = type;
      this.color = color;
      this.palette = palette;

      const angle = random(0, Math.PI * 2);
      let speed;

      if (type === 'willow') {
        speed = random(2.5, 8.5);
        this.gravity = 0.085;
        this.friction = 0.945;
        this.decay = random(0.008, 0.015); // Long hanging golden curtains
      } else if (type === 'ring') {
        speed = random(5, 7.5);
        this.gravity = 0.045;
        this.friction = 0.96;
        this.decay = random(0.013, 0.021);
      } else if (type === 'fountain') {
        // High-jetting Flower Pot Aanar
        this.x += random(-5, 5);
        const fAngle = random(-Math.PI * 0.70, -Math.PI * 0.30);
        speed = random(7, 14);
        this.vx = Math.cos(fAngle) * speed;
        this.vy = Math.sin(fAngle) * speed;
        this.gravity = 0.20;
        this.friction = 0.97;
        this.decay = random(0.018, 0.032);
        this.alpha = 1;
        this.size = random(2.5, 4.5);
        this.isTwinkle = Math.random() < 0.55;
        return;
      } else if (type === 'chakkar') {
        speed = random(3.5, 9);
        this.gravity = 0.04;
        this.friction = 0.93;
        this.decay = random(0.022, 0.042);
      } else if (type === 'spark') {
        speed = random(1.5, 4.5);
        this.gravity = 0.14;
        this.friction = 0.92;
        this.decay = random(0.035, 0.07);
      } else if (type === 'breaker') {
        // Multi-stage shell particle that pops into secondary starburst
        speed = random(4.5, 8);
        this.gravity = 0.06;
        this.friction = 0.95;
        this.decay = random(0.016, 0.024);
        this.stage = 1;
      } else {
        // Mega 360° Peony / Chrysanthemum Starburst
        speed = random(3, 9.5);
        this.gravity = 0.055;
        this.friction = 0.955;
        this.decay = random(0.011, 0.022);
      }

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.size = random(2.2, 4.2);
      this.isTwinkle = Math.random() < 0.5;
    }

    update() {
      this.lastX = this.x;
      this.lastY = this.y;

      this.vx *= this.friction;
      this.vy = this.vy * this.friction + this.gravity;

      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;

      // Multi-stage secondary explosion trigger
      if (this.type === 'breaker' && this.stage === 1 && this.alpha <= 0.45) {
        this.stage = 2;
        const subCount = Math.floor(random(4, 7));
        for (let i = 0; i < subCount; i++) {
          particles.push(new Particle(this.x, this.y, '#FFD700', 'spark'));
        }
      }
    }

    draw() {
      if (this.alpha <= 0) return;

      const currentAlpha = this.isTwinkle && Math.random() < 0.4
        ? Math.min(1, this.alpha * 1.7)
        : this.alpha;

      ctx.save();
      ctx.globalAlpha = currentAlpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Incandescent blazing diamond white core
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(this.x - 0.8, this.y - 0.8, 1.6, 1.6);
      ctx.restore();
    }
  }

  // ==========================================
  // 4. FLOWER POT (AANAR) FOUNTAIN JET
  // ==========================================
  class FlowerPotFountain {
    constructor(x, y, palette) {
      this.x = x;
      this.y = y;
      this.palette = palette || getRandomPalette();
      this.duration = random(100, 160);
      this.age = 0;
      this.alive = true;
    }

    update() {
      this.age++;
      if (this.age >= this.duration) {
        this.alive = false;
        // Finale burst from pot
        createGrandCinematicBlast(this.x, this.y - 60, this.palette);
        return;
      }

      const sparksPerFrame = Math.floor(random(3, 6));
      for (let i = 0; i < sparksPerFrame; i++) {
        const col = this.palette.colors[Math.floor(Math.random() * this.palette.colors.length)];
        particles.push(new Particle(this.x, this.y, col, 'fountain'));
      }
    }

    draw() {
      ctx.save();
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================
  // 5. GROUND CHAKKAR (SPINNING WHEEL)
  // ==========================================
  class GroundChakkar {
    constructor(x, y, palette) {
      this.x = x;
      this.y = y;
      this.palette = palette || getRandomPalette();
      this.angle = 0;
      this.rotationSpeed = 0.42;
      this.duration = random(110, 180);
      this.age = 0;
      this.alive = true;
    }

    update() {
      this.age++;
      this.angle += this.rotationSpeed;
      if (this.age >= this.duration) {
        this.alive = false;
        createGrandCinematicBlast(this.x, this.y - 30, this.palette);
        return;
      }

      for (let i = 0; i < 4; i++) {
        const emitAngle = this.angle + (i * (Math.PI * 2 / 4));
        const col = this.palette.colors[i % this.palette.colors.length];
        const p = new Particle(this.x, this.y, col, 'chakkar');
        const speed = random(4, 8.5);
        p.vx = Math.cos(emitAngle) * speed;
        p.vy = Math.sin(emitAngle) * speed;
        particles.push(p);
      }
    }

    draw() {
      ctx.save();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // ==========================================
  // CREATE SPECTACULAR GRAND CINEMATIC BLAST
  // ==========================================
  function createGrandCinematicBlast(x, y, palette) {
    const pal = palette || getRandomPalette();
    const blastType = Math.random();

    // 1. Shockwave energy ring
    shockwaves.push(new Shockwave(x, y, pal.colors[0]));

    if (blastType < 0.32) {
      // Golden Brocade Willow Cascade
      const count = Math.floor(random(65, 95));
      for (let i = 0; i < count; i++) {
        const col = pal.colors[Math.floor(Math.random() * pal.colors.length)];
        particles.push(new Particle(x, y, col, 'willow'));
      }
    } else if (blastType < 0.68) {
      // Mega 360° Multi-Colour Chrysanthemum Shell with 2-Stage Breakers
      const count = Math.floor(random(70, 105));
      for (let i = 0; i < count; i++) {
        const col = pal.colors[i % pal.colors.length];
        const pType = Math.random() < 0.35 ? 'breaker' : 'peony';
        particles.push(new Particle(x, y, col, pType, pal));
      }
      // Blazing inner white star core
      for (let j = 0; j < 22; j++) {
        particles.push(new Particle(x, y, '#FFFFFF', 'peony'));
      }
    } else {
      // Double Ring & Multi-Breaker Palm Tree Explosion
      const count = Math.floor(random(50, 75));
      for (let i = 0; i < count; i++) {
        const col = pal.colors[0];
        particles.push(new Particle(x, y, col, 'ring'));
      }
      for (let k = 0; k < 35; k++) {
        const col = pal.colors[pal.colors.length - 1];
        particles.push(new Particle(x, y, col, 'breaker', pal));
      }
    }
  }

  // ==========================================
  // INTERACTIVE TOUCH & MULTI-CLICK BURST
  // ==========================================
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button, input, select, textarea, a, #cart-drawer, #checkout-modal, #contact-modal, #pricelist-modal, #order-success-modal')) {
      return;
    }
    createGrandCinematicBlast(e.clientX, e.clientY);
    // Double sparkle echo on touch
    setTimeout(() => {
      createGrandCinematicBlast(e.clientX + random(-30, 30), e.clientY + random(-30, 30));
    }, 120);
  }, { passive: true });

  // ==========================================
  // CONTINUOUS HIGH-ENERGY AUTOMATION TIMERS
  // ==========================================
  let lastRocketLaunch = 0;
  let nextRocketInterval = 650; // Dynamic fast pace

  let lastFountainLaunch = 0;
  const fountainInterval = 2800; // Continuous Aanars

  let lastChakkarLaunch = 0;
  const chakkarInterval = 4200; // Continuous Chakkars

  function animate(timestamp) {
    requestAnimationFrame(animate);

    // Clean canvas with smooth alpha trail fade
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.fillRect(0, 0, width, height);

    // Set Additive Blending (Lighter) for hyper-intense luminous neon glow
    ctx.globalCompositeOperation = 'lighter';

    // 1. Launch Sky Rockets
    if (timestamp - lastRocketLaunch > nextRocketInterval) {
      if (rockets.length < 4) {
        rockets.push(new Rocket());
        // Exciting dual volley
        if (Math.random() < 0.5) {
          setTimeout(() => {
            if (rockets.length < 4) rockets.push(new Rocket());
          }, 180);
        }
      }
      lastRocketLaunch = timestamp;
      nextRocketInterval = random(600, 1100);
    }

    // 2. Launch Aanar Flower Pot Fountain
    if (timestamp - lastFountainLaunch > fountainInterval) {
      if (fountains.length < 2) {
        const side = Math.random() < 0.5 ? width * 0.07 : width * 0.93;
        fountains.push(new FlowerPotFountain(side, height - 12));
      }
      lastFountainLaunch = timestamp;
    }

    // 3. Launch Ground Chakkar Spinning Wheel
    if (timestamp - lastChakkarLaunch > chakkarInterval) {
      if (chakkars.length < 2) {
        const chakkarX = random(width * 0.18, width * 0.82);
        chakkars.push(new GroundChakkar(chakkarX, height - 25));
      }
      lastChakkarLaunch = timestamp;
    }

    // Update & Draw Shockwaves
    for (let s = shockwaves.length - 1; s >= 0; s--) {
      const sw = shockwaves[s];
      sw.update();
      if (sw.alpha <= 0) {
        shockwaves.splice(s, 1);
      } else {
        sw.draw();
      }
    }

    // Update & Draw Flower Pots
    for (let ft = fountains.length - 1; ft >= 0; ft--) {
      const fountain = fountains[ft];
      fountain.update();
      if (!fountain.alive) {
        fountains.splice(ft, 1);
      } else {
        fountain.draw();
      }
    }

    // Update & Draw Chakkars
    for (let c = chakkars.length - 1; c >= 0; c--) {
      const chakkar = chakkars[c];
      chakkar.update();
      if (!chakkar.alive) {
        chakkars.splice(c, 1);
      } else {
        chakkar.draw();
      }
    }

    // Update & Draw Rockets
    for (let r = rockets.length - 1; r >= 0; r--) {
      const rocket = rockets[r];
      rocket.update();
      if (!rocket.alive) {
        rockets.splice(r, 1);
      } else {
        rocket.draw();
      }
    }

    // Update & Draw Cracker Particles
    for (let p = particles.length - 1; p >= 0; p--) {
      const part = particles[p];
      part.update();
      if (part.alpha <= 0) {
        particles.splice(p, 1);
      } else {
        part.draw();
      }
    }
  }

  // Grand Opening Launch on Page Load
  setTimeout(() => {
    rockets.push(new Rocket(width * 0.25, height * 0.22));
    setTimeout(() => rockets.push(new Rocket(width * 0.75, height * 0.20)), 200);
    fountains.push(new FlowerPotFountain(width * 0.06, height - 12));
    fountains.push(new FlowerPotFountain(width * 0.94, height - 12));
  }, 200);

  requestAnimationFrame(animate);
})();
