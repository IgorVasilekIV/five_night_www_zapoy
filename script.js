const btn = document.getElementById('donateBtn');
const canvas = document.getElementById('trailCanvas');
const ctx = canvas.getContext('2d');
const explosionSound = document.getElementById('explosionSound');
const explosionOverlay = document.getElementById('explosionOverlay');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let spiders = [];
let rocketLaunched = false;

class Spider {
    constructor(x, y) {
        this.element = document.createElement('div');
        this.element.className = 'spider';
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 2 + 1;
        document.body.appendChild(this.element);
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;

        // Рисуем след
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}

function createSpider() {
    const rect = btn.getBoundingClientRect();
    const x = rect.left + rect.width/2;
    const y = rect.top + rect.height/2;
    spiders.push(new Spider(x, y));
}

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    spiders.forEach((spider, index) => {
        spider.update();
        if (spider.x < 0 || spider.x > canvas.width || 
            spider.y < 0 || spider.y > canvas.height) {
            spider.element.remove();
            spiders.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

function launchRocket() {
    if (rocketLaunched) return;
    rocketLaunched = true;

    const rocket = document.createElement('div');
    rocket.className = 'rocket';
    rocket.style.right = '-100px';
    rocket.style.top = `${Math.random() * window.innerHeight}px`;
    document.body.appendChild(rocket);

    const targetX = window.innerWidth/2;
    const targetY = window.innerHeight/2;
    
    const interval = setInterval(() => {
        const rect = rocket.getBoundingClientRect();
        const x = rect.right;
        const y = rect.top + rect.height/2;
        
        rocket.style.right = `${parseFloat(rocket.style.right) + 10}px`;
        
        // Проверка столкновения
        if (x >= targetX - 50 && x <= targetX + 50 && 
            y >= targetY - 50 && y <= targetY + 50) {
            clearInterval(interval);
            rocket.remove();
            explode();
        }
    }, 16);
}

function explode() {
    explosionSound.play();
    explosionOverlay.style.background = 'rgba(255, 255, 255, 0.9)';
    setTimeout(() => {
        explosionOverlay.style.background = 'rgba(255, 255, 255, 0)';
        rocketLaunched = false;
    }, 1000);
}

btn.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) {
        setTimeout(createSpider, i * 100);
    }
    setTimeout(launchRocket, 5000);
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();
