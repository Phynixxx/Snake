let playground = document.querySelector(".playground");
let scoreElement = document.querySelector(".score");
let highScoreElement = document.querySelector(".high-score");
let popupButton = document.querySelector(".try-again");
let popUp = document.querySelector(".popupbackground");

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let movementX = 0, movementY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let gridSize = 30;

function togglePopup() {
    popUp.classList.toggle("hidden");
}

let restartGame = () => {
    togglePopup();
    location.reload();
    initGame();
}

function resetGame() {
    gameOver = false;
    foodX = foodY = snakeX = snakeY = 15;
    movementX = movementY = 0;
    snakeBody = [];
    score = 0;
    gridSize = 30;
    clearInterval(setIntervalId);
}

// Verbindet die restartGame-Funktion mit dem "Try Again"-Button
popupButton.addEventListener("click", restartGame);

// Den High Score Wert aus dem local storage holen, wenn nicht vorhanden ist er Null
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;


//Foodspawn
let changeFoodPosition = () => {
    // nimmt eine zufällige Position innerhalb der aktuellen Spielfeldgröße
    foodX = Math.floor(Math.random() * gridSize) + 1;
    foodY = Math.floor(Math.random() * gridSize) + 1;

    // Stellt sicher, dass die Position innerhalb der Spielfeldgrenzen bleibt
    foodX = Math.max(1, Math.min(foodX, gridSize - 1));
    foodY = Math.max(1, Math.min(foodY, gridSize - 1));
}

// Wenn "Game over" Seite neu laden
let handleGameOver = () => {
    clearInterval(setIntervalId);
    togglePopup();
    resetGame()
}

//Richtungsänderung
let changeDirection = (e) => {
    if(e.key === "ArrowUp" && movementY != 1) {
        movementX = 0;
        movementY = -1;
    } else if(e.key === "ArrowDown" && movementY != -1) {
        movementX = 0;
        movementY = 1;
    } else if(e.key === "ArrowRight" && movementX != -1) {
        movementX = 1;
        movementY = 0;
    } else if(e.key === "ArrowLeft" && movementX != 1) {
        movementX = -1;
        movementY = 0;
    }
}

let initGame = () => {
   if(gameOver) return handleGameOver();

   // Aktualisiere das Rasterlayout basierend auf gridSize
   playground.style.setProperty('--grid-size', gridSize);

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    //Überrüft, ob der Kopf Food berührt
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // Essen wird zu Array von Schlangenkörper gepusht
        score++; //Addiert Score plus 1

        highScore = score >=highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;

        // Wenn score ein Vielfaches von 20 ist, verkleinert sich das Spielfeld
        if (score % 20 === 0) {
        gridSize--;
        }
    }

    for (let i = snakeBody.length -1; i > 0; i--) {
        snakeBody[i] = snakeBody[i -1]; //verschiebt jedes Körperteil auf die Position des vorherigen Körperteils
        
    }

    snakeBody[0] = [snakeX, snakeY]; //Aktualisierung der Position des Kopfes nach Verschiebung der Körperteile

    // Aktualisierung der Kopfposition entsprechend der Geschwindigkeit
    snakeX += movementX;
    snakeY += movementY;

    // Wenn der Kopf das Spielfeld verlässt - "Game over"
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {

        // Addierendes Div für jedes Körperteil
        htmlMarkup += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        //Wenn der Kopf den Körper trifft - "Game over"
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playground.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection)