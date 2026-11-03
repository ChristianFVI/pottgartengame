const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const imgBackground = new Image(); imgBackground.src = 'hintergrund.png';
const imgPlayer = new Image();      imgPlayer.src = 'spieler.png';
const imgPlatform = new Image();    imgPlatform.src = 'plattform.png';
const imgEnemy = new Image();       imgEnemy.src = 'gegner.png';
const imgBuilding = new Image();    imgBuilding.src = 'gebaeude.png';
const imgTitle = new Image();       imgTitle.src = 'titel.png';

const bgMusic = new Audio('musik.mp3');
bgMusic.loop = true; bgMusic.volume = 0.5;

const hitSound = new Audio('treffer.mp3');
hitSound.volume = 0.6;

let imagesLoaded = { bg: false, player: false, platform: false, enemy: false, building: false };
imgBackground.onload = () => imagesLoaded.bg = true;
imgPlayer.onload = () => imagesLoaded.player = true;
imgPlatform.onload = () => imagesLoaded.platform = true;
imgEnemy.onload = () => imagesLoaded.enemy = true;
imgBuilding.onload = () => imagesLoaded.building = true;

imgTitle.onload = () => {
    document.getElementById("startScreen").style.backgroundImage = "url('titel.png')";
};

const gravity = 0.8, levelWidth = 24000; 
let lives = 3, gameOver = false, gameWon = false, gameStarted = false;
let fireworks = [], fireworkTimer = 0, showWinMessage = false;
let hitFlashTimer = 0;

let baseScrollSpeed = 4.5;
let currentScrollSpeed = 4.5;
const camera = { x: 0, y: 0 };

const checkCollision = (r1, r2) => r1.x < r2.x + r2.width && r1.x + r1.width > r2.x && r1.y < r2.y + r2.height && r1.y + r1.height > r2.y;
const checkFairEnemyCollision = (p, e) => p.x < (e.x + e.width - 25) && (p.x + p.width) > (e.x + 25) && p.y < (e.y + e.height - 15) && (p.y + p.height) > (e.y + 15);

function createExplosion(x, y) {
    const colors = ["#ff4d4d", "#4dff4d", "#4d4dff", "#ffff4d", "#ff4dff", "#4fffff"];
    const col = colors[Math.floor(Math.random() * colors.length)];
    for (let i = 0; i < 50; i++) {
        let angle = Math.random() * Math.PI * 2, spd = Math.random() * 6 + 2;
        fireworks.push({ x: x, y: y, vx: Math.cos(angle) * spd, vy: Math.sin(angle) * spd, size: Math.random() * 5 + 3, color: col, alpha: 1 });
    }
}

function startGame() {
    gameStarted = true;
    document.getElementById("startScreen").style.display = "none";
    bgMusic.play().catch(error => console.log("Audio-Fehler:", error));
}

function handlePlayerHit(enemyIndex) {
    lives--; updateUI();
    hitSound.currentTime = 0;
    hitSound.play().catch(error => console.log("Sound-Fehler:", error));
    hitFlashTimer = 20;

    if (enemyIndex !== undefined && enemyIndex !== null) enemies[enemyIndex].active = false;

    if (lives <= 0) {
        gameOver = true; bgMusic.pause();
        document.getElementById("gameOverScreen").style.display = "flex";
    } else {
        player.y = player.startY; player.vy = 0;
    }
}

function update() {
    if (!gameStarted || gameOver || showWinMessage) return;

    if (gameWon) {
        if (fireworkTimer++ % 15 === 0 && fireworkTimer < 180) {
            createExplosion(building.x + Math.random() * building.width, building.y + Math.random() * 150);
        }
        fireworks.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.alpha -= 0.01; });
        fireworks = fireworks.filter(p => p.alpha > 0);
        if (fireworkTimer >= 180) {
            showWinMessage = true;
            document.getElementById("winScreen").style.display = "flex";
        }
        return;
    }

    if (hitFlashTimer > 0) hitFlashTimer--;

    let progress = camera.x / (levelWidth - canvas.width);
    currentScrollSpeed = baseScrollSpeed + (progress * 4.0);

    let maxCameraX = levelWidth - canvas.width;
    if (camera.x < maxCameraX) {
        camera.x += currentScrollSpeed;
        player.x = camera.x + 150;
    } else {
        camera.x = maxCameraX;
        player.x += currentScrollSpeed;
    }

    player.vy += gravity; player.y += player.vy;
    player.grounded = false;

    if (checkCollision(player, mainFloor)) {
        if (player.vy > 0 && (player.y + player.height - player.vy) <= mainFloor.y + 4) {
            player.y = mainFloor.y - player.height; player.vy = 0; player.grounded = true;
        }
    }
    
    for (let i = platforms.length - 1; i >= 0; i--) {
        let plat = platforms[i];
        if (checkCollision(player, plat)) {
            if (player.vy >= 0 && (player.y + player.height - player.vy) <= plat.y + 6) {
                player.y = plat.y - player.height; player.vy = 0; player.grounded = true;
            } 
            else if (player.vy < 0 && (player.y - player.vy) >= (plat.y + plat.height - 6)) {
                player.y = plat.y + plat.height; player.vy = 0.5; 
                for (let enemy of enemies) {
                    if (enemy.active) {
                        let enemyXCenter = enemy.x + enemy.width / 2;
                        if (enemyXCenter >= plat.x - 10 && enemyXCenter <= plat.x + plat.width + 10 && Math.abs((enemy.y + enemy.height) - plat.y) < 15) {
                            enemy.active = false;
                        }
                    }
                }
                platforms.splice(i, 1); break; 
            }
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        if (!enemy.active) continue;
        enemy.x += enemy.vx;
        if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) enemy.vx *= -1;

        if (checkCollision(player, enemy) && player.vy > 0 && (player.y + player.height - player.vy) <= enemy.y + 25) {
            enemy.active = false; player.vy = -16;
        } else if (checkFairEnemyCollision(player, enemy)) {
            handlePlayerHit(i);
        }
    }

    if (checkCollision(player, building) || player.x >= building.x) {
        gameWon = true; bgMusic.pause();
        createExplosion(building.x + building.width / 2, building.y + 100);
    }
}

function updateUI() {
    let hearts = ""; for(let i=0; i<lives; i++) hearts += "❤️";
    document.getElementById("livesBoard").innerText = "Leben: " + (hearts || "💀");
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (imagesLoaded.bg) {
        let bgW = 1066; // Auf die neue Widescreen Breite angepasst
        let bgOffset = Math.floor(camera.x * 0.3) % bgW;
        for (let i = -bgW; i < canvas.width + bgW; i += bgW) {
            ctx.drawImage(imgBackground, i - bgOffset, 0, bgW, canvas.height);
        }
    }
    
    if (camera.x > (levelWidth - canvas.width - 1500)) {
        let alpha = Math.min(1, (camera.x - (levelWidth - canvas.width - 1500)) / 1500);
        ctx.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.save(); ctx.translate(-camera.x, -camera.y);
    ctx.strokeStyle = "#000000"; ctx.lineWidth = 4;

    if (imagesLoaded.building) ctx.drawImage(imgBuilding, building.x, building.y, building.width, building.height);
    else ctx.fillStyle = "#ffd700"; ctx.fillRect(building.x, building.y, building.width, building.height);
    ctx.strokeRect(building.x, building.y, building.width, building.height);

    ctx.fillStyle = "#555"; ctx.fillRect(mainFloor.x, mainFloor.y, mainFloor.width, mainFloor.height);
    ctx.strokeRect(mainFloor.x, mainFloor.y, mainFloor.width, mainFloor.height);

    for (let plat of platforms) {
        if (imagesLoaded.platform) ctx.drawImage(imgPlatform, plat.x, plat.y, plat.width, plat.height);
        else { ctx.fillStyle = "#777"; ctx.fillRect(plat.x, plat.y, plat.width, plat.height); }
        ctx.strokeRect(plat.x, plat.y, plat.width, plat.height);
    }

    for (let enemy of enemies) {
        if (!enemy.active) continue;
        if (imagesLoaded.enemy) ctx.drawImage(imgEnemy, enemy.x, enemy.y, enemy.width, enemy.height);
        else { ctx.fillStyle = "#FF4d4d"; ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height); }
        ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    if (!gameWon || fireworkTimer < 180) {
        if (imagesLoaded.player) ctx.drawImage(imgPlayer, player.x, player.y, player.width, player.height);
        else { ctx.fillStyle = "#007bff"; ctx.fillRect(player.x, player.y, player.width, player.height); }
    }

    fireworks.forEach(p => { ctx.fillStyle = p.color; ctx.globalAlpha = p.alpha; ctx.fillRect(p.x, p.y, p.size, p.size); });
    ctx.globalAlpha = 1.0; ctx.restore();

    if (hitFlashTimer > 0) {
        ctx.fillStyle = "rgba(255, 0, 0, " + (hitFlashTimer / 20) * 0.4 + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

function resetGame() { location.reload(); }
function loop() { update(); draw(); requestAnimationFrame(loop); }
loop(); updateUI();
