class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.resize();

        window.addEventListener('resize', () => this.resize());
        this.initStars(200); // Number of stars
        this.nebulas = [];
        this.initNebulas(3);
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initStars(count) {
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                z: Math.random() * 2 + 0.5,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: Math.random() * 0.2 + 0.05
            });
        }
    }

    initNebulas(count) {
        const colors = ['rgba(59, 130, 246, 0.1)', 'rgba(139, 92, 246, 0.1)', 'rgba(16, 185, 129, 0.05)'];
        for (let i = 0; i < count; i++) {
            this.nebulas.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 300 + 200,
                color: colors[i % colors.length],
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2
            });
        }
    }

    animate() {
        this.ctx.fillStyle = '#050810';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Draw Nebulas
        this.nebulas.forEach(nebula => {
            nebula.x += nebula.vx;
            nebula.y += nebula.vy;

            // Bounce off edges
            if (nebula.x < -nebula.radius || nebula.x > this.width + nebula.radius) nebula.vx *= -1;
            if (nebula.y < -nebula.radius || nebula.y > this.height + nebula.radius) nebula.vy *= -1;

            const gradient = this.ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.radius);
            gradient.addColorStop(0, nebula.color);
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(nebula.x, nebula.y, nebula.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.stars.forEach(star => {
            star.y -= star.speed * star.z;
            if (star.y < 0) {
                star.y = this.height;
                star.x = Math.random() * this.width;
            }
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size * star.z * 0.8, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
            if (Math.random() > 0.99) star.opacity = Math.random();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Starfield
document.addEventListener('DOMContentLoaded', () => {
    new Starfield('space-canvas');

    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-progress').style.width = scrolled + "%";
    });

    // Intersection Observer for Fade-in animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        observer.observe(section);
    });
});
