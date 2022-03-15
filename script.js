let imgArr = ["./img/Bee.jpg", "./img/Cat.jpg", "./img/Dog.png", "./img/Dragon.png", "./img/Fish.jpg", "./img/Penguin.png", "./img/Snake.jpg", "./img/Bird.jpg"];
let cardArr = [[-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1], [-1, -1]];

let gameEnded = false;
let gameStarted = false;
let name;
let timer = 0;
let selectionCount = 0;
let previousEl;
let count = 0;
let interval;

for (let i = 1; i <= 16; i++) {
    document.getElementById(`game-grid-container`).innerHTML += `<div class="grid-item" id="${i}" onclick="selectCard(this)">
    </div>`;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function setName() {
    name = document.getElementById(`input-field-name`).value;
    if (name == undefined || name == "") {
        document.getElementById(`error`).innerHTML = "Bitte geben Sie einen Namen ein.";
    } else if (name.length > 24) {
        document.getElementById(`error`).innerHTML = "Bitte gebene Sie einen Namen ein, der nicht länger als 24 Zeichen lang ist."
    } else {
        document.getElementById(`settings`).remove();
        document.getElementById(`info`).remove();
        document.getElementById(`error`).remove();
        gameStarted = true;
        startGame();
    }
}

function startGame() {
    randomizeImages();
    timeMeasurement();
}

function randomizeImages() {
    let randomNumber;
    for (let i = 1; i <= 16; i++) {
        for (let j = 1; j <= 16; j++) {
            randomNumber = Math.floor(Math.random() * 16 + 1);

            if (checkID(randomNumber)) {
                let freeI = parseInt(checkFreePos().charAt(0));
                let freeJ = parseInt(checkFreePos().charAt(1));
                console.log(freeI + " " + freeJ);

                cardArr[freeI][freeJ] = randomNumber;
            }
        }
    }
}


function selectCard(element) {
    if (gameStarted) {
        if (selectionCount % 2 == 0) {
            previousEl = element;
        }

        console.log(element);
        document.getElementById(`${element.id}`).style = `background-color: white; background-image: url("${getImage(element.id)}");`;

        setTimeout(check, 25);

        function check() {
            if (selectionCount % 2 == 1) {
                if (getImage(previousEl.id) == getImage(element.id) && (element != previousEl)) {
                    console.log(element);
                    document.getElementById(`${element.id}`).style = `background-color: white;`;
                    document.getElementById(`${previousEl.id}`).style = `background-color: white;`;
                    document.getElementById(`${element.id}`).alt = `deleted`;
                    document.getElementById(`${previousEl.id}`).alt = `deleted`;
                    document.getElementById(`${element.id}`).onclick = ``;
                    document.getElementById(`${previousEl.id}`).onclick = ``;
                    count++;

                    if (count == 8) {
                        gameEnded = true;
                        endGame();
                    }
                } else {
                    sleep(1000);
                    for (let i = 0; i < cardArr.length; i++) {
                        for (let j = 0; j < cardArr[i].length; j++) {
                            if (document.getElementById(`${cardArr[i][j]}`).alt != "deleted") {
                                document.getElementById(`${cardArr[i][j]}`).style = `background-color: cornflowerblue;`;
                            }
                        }
                    }
                }
            }
            selectionCount++;
        }
    }
}

function getImage(element) {
    for (let i = 0; i < cardArr.length; i++) {
        for (let j = 0; j < cardArr[i].length; j++) {
            if (element == cardArr[i][j]) {
                return imgArr[i];
            }
        }
    }
}

function timeMeasurement() {
    document.getElementById(`timeBox`).innerHTML = `<p id="time">0s</p>`;
    interval = setInterval(timeCount, 1000);

    function timeCount() {
        if (!gameEnded) {
            timer++;
            document.getElementById(`timeBox`).innerHTML = `<p id="time">${timer}s</p>`;
        } else {
            clearInterval(interval);
            return;
        }
    }
}

function checkID(number) {
    for (let i = 0; i < cardArr.length; i++) {
        for (let j = 0; j < cardArr[i].length; j++) {
            if (number == cardArr[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function checkFreePos() {
    for (let i = 0; i < cardArr.length; i++) {
        for (let j = 0; j < cardArr[i].length; j++) {
            if (cardArr[i][j] == -1) {
                return `${i}${j}`;
            }
        }
    }
    return false;
}

function endGame() {
    clearInterval(interval)
    let highscoresBox = document.createElement("div");
    highscoresBox.id = "highscores";
    document.getElementById(`table`).appendChild(highscoresBox);

    localStorage[localStorage.length] = JSON.stringify({
        name: `${name}`, time: `${timer}`
    });

    console.log(localStorage[localStorage.length]);

    let arr = [];
    for (let i = 0; i < localStorage.length; i++) {
        arr[i] = JSON.parse(localStorage[i]);
    }

    arr.sort((a, b) => {
        return a.time - b.time;
    });

    for (let i = 0; i < arr.length; i++) {
        localStorage[i] = JSON.stringify(arr[i]);
    }

    document.getElementById(`timeBox`).remove();
    document.getElementById(`game-grid-container`).remove();

    let highscores = document.getElementById(`highscores`);
    highscores.innerHTML = `<div class="highscore-item" style="border-bottom: 0.03vw solid black"><p class="highscore-header">Name</p></div>
    <div class="highscore-item" style="border-bottom: 0.03vw solid black; "><p class="highscore-header">Zeit</p></div>`

    for (let i = 0; i < arr.length && i < 10; i++) {
        if (i % 2 == 0) {
            highscores.innerHTML += `<div class="highscore-item" style="background-color: #f0f0f0"><p class="highscore-text">${arr[i].name}</p></div>`;
            highscores.innerHTML += `<div class="highscore-item" style="background-color: #f0f0f0"><p class="highscore-text">${arr[i].time} Sekunden</p></div>`;
        } else {
            highscores.innerHTML += `<div class="highscore-item" style="background-color: #b0e2e1"><p class="highscore-text">${arr[i].name}</p></div>`;
            highscores.innerHTML += `<div class="highscore-item" style="background-color: #b0e2e1"><p class="highscore-text">${arr[i].time} Sekunden</p></div>`;
        }
    }

    document.getElementsByTagName("body")[0].innerHTML += `<div id="restartGame" onclick="window.location.reload()"></div>`
    document.getElementById(`restartGame`).innerHTML = `<a>Spiel neustarten</a>`;
}