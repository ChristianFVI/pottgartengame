const player = { 
    startX: 150, startY: 350, 
    x: 150, y: 350, 
    width: 100, height: 100, 
    vx: 0, vy: 0, 
    jumpForce: 21, // Maximale Sprungkraft für extreme Höhe!
    grounded: false 
};

window.addEventListener("keydown", (e) => {
    if (gameOver || showWinMessage) return;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") triggerJump();
});

window.addEventListener("touchstart", (e) => {
    if (gameOver || showWinMessage) return;
    triggerJump();
});

window.addEventListener("mousedown", (e) => {
    if (e.target.tagName !== "BUTTON" && !gameOver && !showWinMessage) triggerJump();
});

function triggerJump() {
    if (player.grounded) {
        player.vy = -player.jumpForce;
        player.grounded = false;
    }
}
