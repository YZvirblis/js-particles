const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let particles = [];
let particleCount = 100;
let particleSize = 3;
let gravityEnabled = true;
let collisionEnabled = true;

const controls = {
  particleCount: document.getElementById("particleCount"),
  particleSize: document.getElementById("particleSize"),
  gravity: document.getElementById("gravity"),
  collision: document.getElementById("collision"),
};

controls.particleCount.addEventListener("input", updateSettings);
controls.particleSize.addEventListener("input", updateSettings);
controls.gravity.addEventListener("change", updateSettings);
controls.collision.addEventListener("change", updateSettings);

function updateSettings() {
  particleCount = parseInt(controls.particleCount.value);
  particleSize = parseInt(controls.particleSize.value);
  gravityEnabled = controls.gravity.checked;
  collisionEnabled = controls.collision.checked;
  initParticles();
}

function initParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = Math.random() * 2 - 1;
    this.vy = Math.random() * 2 - 1;
    this.size = particleSize;
    this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
  }

  update() {
    if (gravityEnabled) {
      this.vy += 0.05; // Gravity force
    }
    this.x += this.vx;
    this.y += this.vy;

    // Prevent clipping into borders
    if (this.x - this.size < 0) {
      this.x = this.size;
      this.vx *= -1;
    }
    if (this.x + this.size > canvas.width) {
      this.x = canvas.width - this.size;
      this.vx *= -1;
    }
    if (this.y - this.size < 0) {
      this.y = this.size;
      this.vy *= -1;
    }
    if (this.y + this.size > canvas.height) {
      this.y = canvas.height - this.size;
      this.vy *= -1;
    }

    if (collisionEnabled) {
      for (let particle of particles) {
        if (particle !== this) {
          let dx = particle.x - this.x;
          let dy = particle.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.size + particle.size) {
            // Simple elastic collision response
            let angle = Math.atan2(dy, dx);
            let totalSize = this.size + particle.size;

            // Move this particle away
            this.x -= (Math.cos(angle) * (totalSize - distance)) / 2;
            this.y -= (Math.sin(angle) * (totalSize - distance)) / 2;
            this.vx *= -1;
            this.vy *= -1;

            // Move the other particle away
            particle.x += (Math.cos(angle) * (totalSize - distance)) / 2;
            particle.y += (Math.sin(angle) * (totalSize - distance)) / 2;
            particle.vx *= -1;
            particle.vy *= -1;
          }
        }
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

let lastFrameTime = 0;
const fps = 120;
const frameTime = 1000 / fps; // Time per frame in milliseconds

function animate(currentTime) {
  const deltaTime = currentTime - lastFrameTime;

  if (deltaTime >= frameTime) {
    lastFrameTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let particle of particles) {
      particle.update();
      particle.draw();
    }
  }

  requestAnimationFrame(animate);
}

// Start the animation
initParticles();
requestAnimationFrame(animate);
