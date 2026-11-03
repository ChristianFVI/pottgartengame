// Der Hauptboden ist nun doppelt so lang
const mainFloor = { x: 0, y: 550, width: 24000, height: 50 };

let platforms = [];

function addDestructiblePlatform(startX, y, blockCount) {
    for (let i = 0; i < blockCount; i++) {
        platforms.push({
            x: startX + (i * 50),
            y: y,
            width: 50,
            height: 30,
            isDestructible: true
        });
    }
}

// Erste Hälfte (0 - 12.000)
addDestructiblePlatform(300, 400, 5);
addDestructiblePlatform(650, 280, 6);
addDestructiblePlatform(1100, 420, 5);
addDestructiblePlatform(1450, 300, 5);
addDestructiblePlatform(1800, 200, 6);
addDestructiblePlatform(2200, 420, 4);
addDestructiblePlatform(2500, 320, 4);
addDestructiblePlatform(2800, 220, 4);
addDestructiblePlatform(3200, 400, 6);
addDestructiblePlatform(3650, 300, 5);
addDestructiblePlatform(4100, 420, 6);
addDestructiblePlatform(4500, 300, 4);
addDestructiblePlatform(4900, 200, 7);
addDestructiblePlatform(5400, 400, 5);
addDestructiblePlatform(5800, 280, 6);
addDestructiblePlatform(6300, 420, 4);
addDestructiblePlatform(6700, 300, 5);
addDestructiblePlatform(7200, 200, 6);
addDestructiblePlatform(7700, 400, 5);
addDestructiblePlatform(8100, 280, 6);
addDestructiblePlatform(8600, 420, 4);
addDestructiblePlatform(9000, 300, 5);
addDestructiblePlatform(9500, 200, 7);
addDestructiblePlatform(10000, 400, 6);
addDestructiblePlatform(10500, 300, 5);
addDestructiblePlatform(11000, 420, 8);

// Zweite Hälfte (12.000 - 24.000) - Neue Herausforderungen
addDestructiblePlatform(11600, 300, 5);
addDestructiblePlatform(12100, 200, 6);
addDestructiblePlatform(12600, 420, 5);
addDestructiblePlatform(13100, 320, 4);
addDestructiblePlatform(13600, 220, 6);
addDestructiblePlatform(14200, 400, 5);
addDestructiblePlatform(14700, 280, 5);
addDestructiblePlatform(15200, 420, 6);
addDestructiblePlatform(15800, 300, 4);
addDestructiblePlatform(16300, 200, 7);
addDestructiblePlatform(16900, 400, 6);
addDestructiblePlatform(17400, 320, 5);
addDestructiblePlatform(18000, 220, 5);
addDestructiblePlatform(18500, 420, 6);
addDestructiblePlatform(19100, 300, 4);
addDestructiblePlatform(19600, 200, 6);
addDestructiblePlatform(20200, 400, 5);
addDestructiblePlatform(20700, 280, 6);
addDestructiblePlatform(21200, 420, 5);
addDestructiblePlatform(21700, 300, 5);
addDestructiblePlatform(22200, 200, 6);
addDestructiblePlatform(22800, 400, 8);

let coins = [];

let enemies = [
    { startX: 680, x: 680, y: 190, width: 90, height: 90, vx: 2, minX: 650, maxX: 900, active: true },
    { startX: 1470, x: 1470, y: 210, width: 90, height: 90, vx: -2, minX: 1450, maxX: 1650, active: true },
    { startX: 2220, x: 2220, y: 330, width: 90, height: 90, vx: 3, minX: 2200, maxX: 2350, active: true },
    { startX: 3220, x: 3220, y: 310, width: 90, height: 90, vx: 2, minX: 3200, maxX: 3450, active: true },
    { startX: 4150, x: 4150, y: 330, width: 90, height: 90, vx: -2, minX: 4100, maxX: 4350, active: true },
    { startX: 5450, x: 5450, y: 310, width: 90, height: 90, vx: 3, minX: 5400, maxX: 5620, active: true },
    { startX: 6750, x: 6750, y: 210, width: 90, height: 90, vx: -2, minX: 6700, maxX: 6920, active: true },
    { startX: 8150, x: 8150, y: 190, width: 90, height: 90, vx: 2.5, minX: 8100, maxX: 8350, active: true },
    { startX: 9550, x: 9550, y: 110, width: 90, height: 90, vx: -3, minX: 9500, maxX: 9800, active: true },
    { startX: 10550, x: 10550, y: 210, width: 90, height: 90, vx: 2, minX: 10500, maxX: 10720, active: true },
    // Neue Gegner in der zweiten Hälfte
    { startX: 11700, x: 11700, y: 210, width: 90, height: 90, vx: 2.5, minX: 11600, maxX: 11800, active: true },
    { startX: 12700, x: 12700, y: 330, width: 90, height: 90, vx: -2, minX: 12600, maxX: 12820, active: true },
    { startX: 13700, x: 13700, y: 130, width: 90, height: 90, vx: 3, minX: 13600, maxX: 13880, active: true },
    { startX: 14800, x: 14800, y: 190, width: 90, height: 90, vx: -2.5, minX: 14700, maxX: 14920, active: true },
    { startX: 16400, x: 16400, y: 110, width: 90, height: 90, vx: 3.5, minX: 16300, maxX: 16600, active: true },
    { startX: 18100, x: 18100, y: 130, width: 90, height: 90, vx: -2, minX: 18000, maxX: 18220, active: true },
    { startX: 19700, x: 19700, y: 110, width: 90, height: 90, vx: 3, minX: 19600, maxX: 19880, active: true },
    { startX: 20800, x: 20800, y: 190, width: 90, height: 90, vx: -2.5, minX: 20700, maxX: 20980, active: true },
    { startX: 21800, x: 21800, y: 210, width: 90, height: 90, vx: 3, minX: 21700, maxX: 21920, active: true },
    // Boden-Gegner
    { startX: 1000, x: 1000, y: 460, width: 95, height: 90, vx: 4, minX: 900, maxX: 2000, active: true },
    { startX: 3500, x: 3500, y: 460, width: 95, height: 90, vx: 4.5, minX: 3000, maxX: 5000, active: true },
    { startX: 7000, x: 7000, y: 460, width: 95, height: 90, vx: 5, minX: 6500, maxX: 8500, active: true },
    { startX: 9800, x: 9800, y: 460, width: 95, height: 90, vx: 5.5, minX: 9000, maxX: 11000, active: true },
    { startX: 13000, x: 13000, y: 460, width: 95, height: 90, vx: 5, minX: 12000, maxX: 15000, active: true },
    { startX: 17000, x: 17000, y: 460, width: 95, height: 90, vx: 5.5, minX: 16000, maxX: 19000, active: true },
    { startX: 20000, x: 20000, y: 460, width: 95, height: 90, vx: 6, minX: 19500, maxX: 22500, active: true }
];

// Steht ganz am Ende des verlängerten Levels
const building = { x: 23650, y: 200, width: 250, height: 350 };
