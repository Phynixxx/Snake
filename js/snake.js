let playground = document.querySelector(".playground");
let scoreElement = document.querySelector(".score");
let highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let movementX = 0, movementY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;

// Den High Score Wert aus dem local storage holen, wenn nicht vorhanden ist er Null
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;


//Foodspawn
let changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Wenn "Game over" Seite neu laden
let handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game over! Press OK to replay...");
    location.reload();
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

document.addEventListener("keydown", changeDirection);