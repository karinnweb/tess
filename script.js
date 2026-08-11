// Confetti animation
class Confetti {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    createParticles(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 5 + Math.random() * 5;
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 2,
                life: 1,
                color: this.getRandomColor(),
                size: 5 + Math.random() * 5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }

    getRandomColor() {
        const colors = ['#ff6b6b', '#4ecdc4', '#ffd93d', '#6bcf7f', '#c084fc', '#ff9e64', '#ff5252'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        this.particles.forEach((p, index) => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // gravity
            p.life -= 0.01;
            p.rotation += p.rotationSpeed;

            if (p.life <= 0) {
                this.particles.splice(index, 1);
            }
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.globalAlpha = p.life;
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        this.draw();

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        }
    }
}

// Initialize confetti
const canvas = document.getElementById('confetti-canvas');
const confetti = new Confetti(canvas);

// Celebrate with confetti function
function celebrateWithConfetti() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Create multiple bursts
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            confetti.createParticles(centerX, centerY, 80);
            confetti.animate();
        }, i * 150);
    }

    // Play celebration sound (using Web Audio API)
    playAudio();
}

// Simple audio function for celebration
function playAudio() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Auto-play celebration on page load
window.addEventListener('load', () => {
    setTimeout(() => {
        celebrateWithConfetti();
    }, 500);
});

// Add interactivity - click anywhere to celebrate
document.addEventListener('click', (e) => {
    confetti.createParticles(e.clientX, e.clientY, 30);
    confetti.animate();
    playAudio();
});