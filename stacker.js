/* --- stacker.js (FIXED) --- */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restartBtn');

let width = 400;
let height = 400;
let score = 0;
let gameState = 'playing'; // 'playing' or 'gameOver'

const BLOCK_START_WIDTH = 100;
const BLOCK_HEIGHT = 20;
let currentBlock = {};
let placedBlocks = [];
let swingAngle = 0;
let swingSpeed = 0.05;

function initGame() {
    score = 0;
    scoreDisplay.innerText = score;
    gameState = 'playing';
    swingSpeed = 0.05; // Reset speed
    restartBtn.style.display = 'none'; // Hide button while playing
    placedBlocks = []; 
    
    // Base block
    placedBlocks.push({ 
        x: (width / 2) - (BLOCK_START_WIDTH / 2), 
        y: height - BLOCK_HEIGHT, 
        w: BLOCK_START_WIDTH, 
        h: BLOCK_HEIGHT, 
        color: '#f39c12' 
    });
    
    startNewBlock();
}

function startNewBlock() {
    currentBlock = {
        x: width / 2,
        y: (height - BLOCK_HEIGHT * 2) - (placedBlocks.length * BLOCK_HEIGHT),
        w: BLOCK_START_WIDTH,
        h: BLOCK_HEIGHT,
        color: '#bdc3c7'
    };
    
    // Adjust camera: If tower gets too high, shift blocks down
    if (currentBlock.y < 100) {
        placedBlocks.forEach(b => b.y += BLOCK_HEIGHT);
        currentBlock.y += BLOCK_HEIGHT;
    }
}

function update() {
    if (gameState !== 'playing') return; // STOP movement if game over

    swingAngle += swingSpeed;
    currentBlock.x = (width / 2) + Math.sin(swingAngle) * 120; 
}

function draw() {
    ctx.clearRect(0, 0, width, height);

    // Ground
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, height - 5, width, 5);

    // Placed blocks
    placedBlocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.w, block.h);
    });

    if (gameState === 'playing') {
        // Swinging block
        ctx.fillStyle = currentBlock.color;
        ctx.fillRect(currentBlock.x - currentBlock.w / 2, currentBlock.y, currentBlock.w, currentBlock.h);
        
        // Cable
        ctx.strokeStyle = '#666';
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(currentBlock.x, currentBlock.y);
        ctx.stroke();
    } else {
        // Game Over Screen
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#f39c12';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText("TOWER COLLAPSED", width / 2, height / 2 - 20);
        ctx.fillStyle = 'white';
        ctx.font = '18px Arial';
        ctx.fillText("Final Score: " + score, width / 2, height / 2 + 20);
    }
}

window.addEventListener('mousedown', () => {
    if (gameState !== 'playing') return;
    
    let topBlock = placedBlocks[placedBlocks.length - 1];
    let currentX = currentBlock.x - (currentBlock.w / 2);
    
    // Check if block lands on the one below
    if (currentX > topBlock.x + topBlock.w || currentX + currentBlock.w < topBlock.x) {
        gameState = 'gameOver';
        restartBtn.style.display = 'inline-block'; // Show restart option
    } else {
        placedBlocks.push({
            x: currentX, 
            y: currentBlock.y,
            w: currentBlock.w,
            h: BLOCK_HEIGHT,
            color: '#f39c12'
        });
        score++;
        scoreDisplay.innerText = score;
        swingSpeed += 0.005; 
        startNewBlock();
    }
});

restartBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevents the click from triggering a "drop" immediately
    initGame();
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

initGame();
gameLoop();