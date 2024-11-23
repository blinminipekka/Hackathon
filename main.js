let canTrigger = true;  // Flag to track if the event can trigger
const cooldownTime = 6 * 60 * 1000;  // 6 minutes in milliseconds
let sprite;  // Main character sprite
let burger, hotel, beach, plane;  // Other sprites
let spritePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };  // Initial position in the center
const moveSpeed = 5;  // Robot sprite movement speed
const otherSpriteSpeed = 1;  // Other sprites movement speed (slow)
let canMove = false;  // Prevent movement during sprite spawning
let spriteWidth = 150, spriteHeight = 150;  // Default size for sprites
let shakeInterval;  // For screen shaking
let gameStarted = false;  // Flag to track if the game has started

// Listen for Enter key press to start the game
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter" && !gameStarted) {
        startGame();  // Start the game
    }
    
    // Only allow arrow key movement after all sprites have spawned and `canMove` is true
    if (gameStarted && canMove) {
        if (sprite) {
            if (event.key === "ArrowDown") {
                moveSprite("down");
            } else if (event.key === "ArrowRight") {
                moveSprite("right");
            } else if (event.key === "ArrowLeft") {
                moveSprite("left");
            } else if (event.key === "ArrowUp") {
                moveSprite("up");
            }
        }
    }
});

function startGame() {
    gameStarted = true;
    document.body.innerHTML = '';  // Clear previous contents

    createRectangles();  // Add the rectangles

    // Delay sprite spawning and main robot sprite appearance
    setTimeout(() => {
        startSpriteSpawning();  // Start spawning other sprites after 6 seconds

        // Spawn the main robot sprite 8 seconds after rectangles have spawned
        setTimeout(createSprite, 8000);
    }, 1000);  // Wait 1 second to create rectangles
}

function createRectangles() {
    const directions = ['rect1', 'rect2', 'rect3', 'rect4', 'rect5', 'rect6', 'rect7', 'rect8'];

    directions.forEach((id) => {
        let rect = document.createElement("div");
        rect.classList.add("rectangle");
        rect.id = id;
        document.body.appendChild(rect);
    });
}

function createSprite() {
    sprite = document.createElement("img");
    sprite.src = "images/idle.png";  // Initially set to "idle.png"
    sprite.classList.add("sprite");
    sprite.style.zIndex = "9999999999999999999999999999999999999999";  // High z-index
    document.body.appendChild(sprite);

    sprite.style.left = `${spritePosition.x}px`;
    sprite.style.top = `${spritePosition.y}px`;

    // Allow movement only after all sprites are loaded
    canMove = true;
}

function startSpriteSpawning() {
    canMove = false;  // Disable movement while spawning other sprites

    // Spawn other sprites gradually with movement confined in an area with bouncing effect
    setTimeout(() => createConfinedMovingSprite("images/burger.png", "burger", 10, window.innerHeight - 160), 1000);
    setTimeout(() => createConfinedMovingSprite("images/hotel.png", "hotel", window.innerWidth - 160, window.innerHeight - 160), 2000);
    setTimeout(() => createConfinedMovingSprite("images/beach.png", "beach", 10, 10), 3000);
    setTimeout(() => createConfinedMovingSprite("images/plane.png", "plane", window.innerWidth - 160, 10), 4000);

    // After all sprites are spawned, start screen shaking every 2 seconds
    setTimeout(startScreenShake, 5000);
}

function createConfinedMovingSprite(src, className, initialX, initialY) {
    const element = document.createElement("img");
    element.src = src;
    element.classList.add(className);
    element.style.zIndex = "9999999999999999999999999999999999999";  // High z-index
    element.style.position = "absolute";
    element.style.left = `${initialX}px`;
    element.style.top = `${initialY}px`;
    document.body.appendChild(element);

    // Set up movement direction
    let directionX = Math.random() > 0.5 ? otherSpriteSpeed : -otherSpriteSpeed;
    let directionY = Math.random() > 0.5 ? otherSpriteSpeed : -otherSpriteSpeed;
    
    // Move the sprite in one direction until it hits an edge, then bounce
    setInterval(() => {
        let currentX = parseFloat(element.style.left);
        let currentY = parseFloat(element.style.top);

        // Check bounds and reverse direction if the element hits an edge
        if (currentX <= 0 || currentX + spriteWidth >= window.innerWidth) {
            directionX = -directionX;  // Reverse horizontal direction
        }
        if (currentY <= 0 || currentY + spriteHeight >= window.innerHeight) {
            directionY = -directionY;  // Reverse vertical direction
        }

        // Update position based on current direction
        element.style.left = `${currentX + directionX}px`;
        element.style.top = `${currentY + directionY}px`;
    }, 20);  // Update position every 20 milliseconds for smooth movement

    return element;
}

function moveSprite(direction) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const spriteWidth = sprite.width || 150;
    const spriteHeight = sprite.height || 150;

    switch(direction) {
        case "down":
            if (spritePosition.y + spriteHeight < windowHeight) {
                spritePosition.y += moveSpeed;
            }
            sprite.src = "images/idle.png";
            break;
        case "right":
            if (spritePosition.x + spriteWidth < windowWidth) {
                spritePosition.x += moveSpeed;
            }
            sprite.src = "images/right.png";
            break;
        case "left":
            if (spritePosition.x > 0) {
                spritePosition.x -= moveSpeed;
            }
            sprite.src = "images/left.png";
            break;
        case "up":
            if (spritePosition.y > 0) {
                spritePosition.y -= moveSpeed;
            }
            sprite.src = "images/up.png";
            break;
    }

    sprite.style.left = `${spritePosition.x}px`;
    sprite.style.top = `${spritePosition.y}px`;
}

function startScreenShake() {
    setInterval(() => {
        shakeInterval = setInterval(() => {
            document.body.style.transform = `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`;
        }, 50);

        // Stop shaking after 1 second
        setTimeout(() => {
            clearInterval(shakeInterval);
            document.body.style.transform = "none";
        }, 1000);
    }, 2000);  // Screen shake every 2 seconds
}
