const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 20,
    speed: 4,
    dx: 0,
    dy: 0,
    angle: 0
};

const bullets = [];
const enemies = [];

const keys = {};

// Listen for key presses
window.addEventListener("keydown", (e) => keys[e.key] = true);
window.addEventListener("keyup", (e) => keys[e.key] = false);

// Listen for mouse movement
canvas.addEventListener("mousemove", (e) => {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    player.angle = angle;
});

// Listen for shooting
window.addEventListener("click", () => {
    bullets.push({
        x: player.x,
        y: player.y,
        angle: player.angle,
        speed: 7
    });
});

// Enemy Spawning
setInterval(() => {
    const side = Math.floor(Math.random() * 4);
    let x, y;

    if (side === 0) { // Left
        x = 0;
        y = Math.random() * canvas.height;
    } else if (side === 1) { // Right
        x = canvas.width;
        y = Math.random() * canvas.height;
    } else if (side === 2) { // Top
        x = Math.random() * canvas.width;
        y = 0;
    } else { // Bottom
        x = Math.random() * canvas.width;
        y = canvas.height;
    }

    enemies.push({ x, y, size: 20, speed: 2 });
}, 2000);

// Update player movement
function movePlayer() {
    player.dx = 0;
    player.dy = 0;

    if (keys["w"]) player.dy = -player.speed;
    if (keys["s"]) player.dy = player.speed;
    if (keys["a"]) player.dx = -player.speed;
    if (keys["d"]) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;
}

// Update bullets
function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        bullet.x += Math.cos(bullet.angle) * bullet.speed;
        bullet.y += Math.sin(bullet.angle) * bullet.speed;

        // Remove bullets out of bounds
        if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
            bullets.splice(i, 1);
        }
    }
}

// Move enemies towards player
function moveEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;
    }
}

// Collision detection
function checkCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        const enemy = enemies[i];

        // Check if bullet hits enemy
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];
            const dist = Math.hypot(enemy.x - bullet.x, enemy.y - bullet.y);

            if (dist < enemy.size / 2) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                break;
            }
        }

        // Check if enemy touches player
        const distToPlayer = Math.hypot(enemy.x - player.x, enemy.y - player.y);
        if (distToPlayer < player.size) {
            alert("Game Over!");
            enemies.length = 0;
            bullets.length = 0;
            player.x = canvas.width / 2;
            player.y = canvas.height / 2;
        }
    }
}

// Draw player
function drawPlayer() {
    ctx.save();
    ctx.translate(player.x, player.y);
    ctx.rotate(player.angle);
    ctx.fillStyle = "blue";
    ctx.fillRect(-player.size / 2, -player.size / 2, player.size, player.size);
    ctx.restore();
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = "yellow";
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw enemies
function drawEnemies() {
    ctx.fillStyle = "red";
    enemies.forEach(enemy => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawBullets();
    drawEnemies();
}

// Game loop
function update() {
    movePlayer();
    moveBullets();
    moveEnemies();
    checkCollisions();
    draw();
    requestAnimationFrame(update);
}

// Start game
update();
