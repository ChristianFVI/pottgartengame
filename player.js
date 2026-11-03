const player = { 
    startX: 150, startY: 350, 
    x: 150, y: 350, 
    width: 100, height: 100, 
    vx: 0, vy: 0, 
    jumpForce: 17.5, 
    grounded: false 
};

window.addEventListener("keydown", (e) => {
    if (!gameStarted || gameOver || showWinMessage) return;
    if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") triggerJump();
});

window.addEventListener("touchstart", (e) => {
    // Wenn das Spiel noch nicht läuft, lassen wir das Event durchgehen (wichtig für den Startknopf!)
    if (!gameStarted || gameOver || showWinMessage) return;
    
    // Verhindert das Kopier-Menü des Handys, ignoriert aber Buttons
    if (e.target.tagName !== "BUTTON") {
        e.preventDefault(); 
        triggerJump();
    }
}, { passive: false });

window.addEventListener("mousedown", (e) => {
    if (!gameStarted || gameOver || showWinMessage) return;
    if (e.target.tagName !== "BUTTON") {
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
