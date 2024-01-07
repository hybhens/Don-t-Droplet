// Get elements from the DOM
const player = document.getElementById('player');
const droplet = document.getElementById('droplet');
const coin = document.getElementById('coin');
const smallCoin = document.getElementById('smallCoin');
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('scoreDisplay');
const achievementDisplay = document.getElementById('achievementDisplay');
const gameOverDisplay = document.getElementById('gameOverDisplay');

// Initialize the score and other variables
let score = 0;
let coinsCollected = 0;
let dropletsDodged = 0;
let totalDroplets = 0;
let gameActive = true;

// Initialize the audio objects
const coinSound = new Audio('file:///C:/Users/PC/Downloads/CoinDDSound.mp3'); // Replace with the correct path to your coin sound
const smallCoinSound = new Audio('file:///C:/Users/PC/Downloads/SmallCoinDDSound.mp3'); // Replace with the correct path to your small coin sound
const achievementSound = new Audio('file:///C:/Users/PC/Downloads/AchievementDDSound.mp3'); // Replace with the correct path to your achievement sound
const gameOverSound = new Audio('file:///C:/Users/PC/Downloads/GameOverDDSound.mp3'); // Replace with the correct path to your game over sound

// Variables to track achievements
let achievements = {
    achievement1: false,
    achievement2: false,
    achievement3: false,
    achievement4: false,
    achievement5: false
};

// Interval variables
let dropletInterval, coinInterval, smallCoinInterval;

// Function to move the droplet
function moveDroplet() {
    droplet.style.top = '-50px'; // Start off-screen
    droplet.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 20))}px`;
    totalDroplets++; // Increment the total number of droplets
}

// Function to move the coin
function moveCoin() {
    coin.style.top = '-50px'; // Start off-screen
    coin.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 20))}px`;
}

// Function to move the small coin
function moveSmallCoin() {
    smallCoin.style.top = '-30px'; // Start off-screen
    smallCoin.style.left = `${Math.floor(Math.random() * (gameContainer.offsetWidth - 10))}px`;
}

// Function to update the score
function updateScore(value, isSmallCoin = false) {
    score += value;
    scoreDisplay.textContent = `Score: ${score}`;
    // Play the appropriate sound
    if (isSmallCoin) {
        smallCoinSound.play();
    } else {
        coinSound.play();
    }
    coinsCollected++; // Increment the coins collected
    checkForAchievements(); // Check for achievements after updating the score
}

// Function to check for collisions
function checkCollision(element) {
    let playerRect = player.getBoundingClientRect();
    let elementRect = element.getBoundingClientRect();
    return !(elementRect.left > playerRect.right || elementRect.right < playerRect.left ||
             elementRect.top > playerRect.bottom || elementRect.bottom < playerRect.top);
}

// Function to show achievement and play sound
function showAchievement(text) {
    achievementDisplay.textContent = text; // Set the text for the achievement
    achievementDisplay.style.display = 'block'; // Make the achievement display visible
    achievementSound.play(); // Play the achievement sound

    setTimeout(() => {
        achievementDisplay.style.display = 'none'; // Hide the display after 3 seconds
    }, 3000);
}

// Function to check and unlock achievements
function checkForAchievements() {
    if ((coinsCollected >= 1) && !achievements.achievement1) {
        showAchievement("Achievement Unlocked: Collected 1 coin!");
        achievements.achievement1 = true;
    }
    if ((coinsCollected >= 2) && !achievements.achievement2) {
        showAchievement("Achievement Unlocked: Collected 2 coins!");
        achievements.achievement2 = true;
    }
    if ((dropletsDodged >= 1) && !achievements.achievement3) {
        showAchievement("Achievement Unlocked: Dodged 1 droplet!");
        achievements.achievement3 = true;
    }
    if ((dropletsDodged >= 2) && !achievements.achievement4) {
        showAchievement("Achievement Unlocked: Dodged 2 droplets!");
        achievements.achievement4 = true;
    }
    if (!achievements.achievement5 && coinsCollected > 0 && dropletsDodged > 0 && (coinsCollected + dropletsDodged) === totalDroplets) {
        showAchievement("Achievement Unlocked: Collected all coins or small coins, or dodged all droplets!");
        achievements.achievement5 = true;
    }
}

// Function to show game over and stop all game elements
function showGameOver() {
    if(gameActive) {
        gameOverDisplay.style.display = 'block'; // Make the game over display visible
        gameOverSound.play();
        gameActive = false; // Mark the game as inactive
        // Clear all intervals to stop droplets, coins, and small coins
        clearInterval(dropletInterval);
        clearInterval(coinInterval);
        clearInterval(smallCoinInterval);
    }
}

// Function to reset the game
function resetGame() {
    score = 0;
    coinsCollected = 0;
    dropletsDodged = 0;
    totalDroplets = 0;
    gameActive = true;
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverDisplay.style.display = 'none'; // Hide the game over display
    achievements = { // Reset achievements
        achievement1: false,
        achievement2: false,
        achievement3: false,
        achievement4: false,
        achievement5: false
    };
    startGame(); // Restart the game
}

// Event listener for the Try Again button
document.getElementById('tryAgainButton').addEventListener('click', function() {
    resetGame();
});

// Game loop
function startGame() {
    // Clear any existing intervals before starting new ones
    clearInterval(dropletInterval);
    clearInterval(coinInterval);
    clearInterval(smallCoinInterval);
    
    moveDroplet();
    moveCoin();
    moveSmallCoin();

    // Assign intervals to the global variables
    dropletInterval = setInterval(function() {
        if (!gameActive) return;
        let dropletTop = parseInt(droplet.style.top);
        droplet.style.top = `${dropletTop + 4}px`; // Droplets move faster
        if (dropletTop > gameContainer.offsetHeight) {
            moveDroplet();
            dropletsDodged++; // Increment the droplets dodged
            checkForAchievements(); // Check for achievements after dodging a droplet
        } else if (checkCollision(droplet)) {
            showGameOver(); // Show game over instead of alert
        }
    }, 10); // Droplet interval

    coinInterval = setInterval(function() {
        if (!gameActive) return;
        let coinTop = parseInt(coin.style.top);
        coin.style.top = `${coinTop + 2}px`; // Normal speed for coins
        if (coinTop > gameContainer.offsetHeight) {
            moveCoin();
        } else if (checkCollision(coin)) {
            updateScore(10); // Regular coin increases score by 10
            moveCoin();
        }
    }, 20); // Coin interval

    smallCoinInterval = setInterval(function() {
        if (!gameActive) return;
        let smallCoinTop = parseInt(smallCoin.style.top);
        smallCoin.style.top = `${smallCoinTop + 3}px`; // Small coins move faster
        if (smallCoinTop > gameContainer.offsetHeight) {
            moveSmallCoin();
        } else if (checkCollision(smallCoin)) {
            updateScore(Math.ceil(score * 0.01), true); // Small coin increases score by 1%
            moveSmallCoin();
        }
    }, 15); // Small coin interval
}

// Event listener for player movement
window.addEventListener('keydown', function(e) {
    if (!gameActive) return; // Ignore keypresses when the game is over

    let playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue("left"));
    if (e.key === "ArrowLeft" && playerLeft > 0) {
        player.style.left = `${playerLeft - 15}px`;
    } else if (e.key === "ArrowRight" && playerLeft < (gameContainer.offsetWidth - player.offsetWidth)) {
        player.style.left = `${playerLeft + 15}px`;
    }
});

// Start the game
startGame();