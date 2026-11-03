const player = { 
    startX: 150, startY: 350, 
    x: 150, y: 350, 
    width: 100, height: 100, 
    vx: 0, vy: 0, 
    jumpForce: 17.5, // Leicht angepasst für die neue Widescreen-Physik
    grounded: false 
};

window.addEventListener("keydown", (e) => {
    if (gameOver || showWinMessage) return;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") triggerJump();
});

// e.preventDefault() stoppt das Handy-Kopier-Menü und die Lupe komplett
window.addEventListener("touchstart", (e) => {
    if (gameOver || showWinMessage) return;
    if (e.target.tagName !== "BUTTON") {
        e.preventDefault(); 
        triggerJump();
    }
}, { passive: false });

window.addEventListener("mousedown", (e) => {
    if (e.target.tagName !== "BUTTON" && !gameOver && !showWinMessage) {
        e.preventDefault();
        triggerJump();
    }
});

function triggerJump() {
    if (player.grounded) {
        player.vy = -player.jumpForce;
        player.grounded = false;
    }
}
