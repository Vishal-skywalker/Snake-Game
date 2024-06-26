const board = document.getElementById('board');
const move = new Audio('music/move.mp3');
const foodSound = new Audio('music/food.mp3');
const gameOver = new Audio('music/gameover.mp3');
let snake = [{ x: 10, y: 10 }];
let start = { x: 10, y: 10 };
let food = {};
let speed = 200;
let now, elapsed, then = Date.now();
let inputData = { x: 0, y: 0 };
let score = 0;
let heighScore = parseInt(localStorage.getItem('heighScore')) || 0;

function randomInRange() {
    return Math.floor(Math.random() * 18 + 2);
}
const setFood = () => {
    food = { x: randomInRange(), y: randomInRange() };
}
setFood();

const createFood = () => {
    const foodElement = document.createElement('div');
    foodElement.classList.add('food');
    foodElement.style.gridRow = food.y;
    foodElement.style.gridColumn = food.x;
    board.appendChild(foodElement);
}
const setScores = () => {
    scorePanel.innerHTML = '';
    const scorecard = document.createElement('p');
    scorecard.innerHTML = 'Score - ' + score;
    const heighscorecard = document.createElement('p');
    heighscorecard.innerHTML = 'Heigh Score - ' + heighScore;
    scorePanel.appendChild(scorecard);
    scorePanel.appendChild(heighscorecard);
}
const main = () => {
    now = Date.now();
    elapsed = now - then;
    if (elapsed > speed) {
        setScores();
        then = now - (elapsed % speed);
        board.innerHTML = '';
        createFood();
        if (isGameOver(snake)) {
            // console.log('e :>> ', snake[0]);
            snake = [{ ...start }];
            inputData = { x: 0, y: 0 };
            heighScore = heighScore < score ? score : heighScore;
            setFood();
            localStorage.setItem('heighScore', heighScore.toString());
            // console.log('e :>> ', snake[0]);
            gameOver.play();
            alert('Game Over - Score - ' + score + ' heighScore - ' + heighScore);
            score = 0;
            speed = 200;
        }
        if (food.x === snake[0].x && food.y === snake[0].y) {
            // console.log('snake1 :>> ', JSON.stringify(snake));
            setFood();
            snake.unshift({ x: snake[0].x + inputData.x, y: snake[0].y + inputData.y });
            score++;
            if (speed > 160) {
                speed -= 4;
            } else if (speed > 120) {
                speed -= 2;
            } else {
                speed -= 0.25;
            }
            foodSound.play();
            // console.log('snake :>> ', JSON.stringify(snake));
        }
        for (let i = snake.length - 2; i >= 0; i--) {
            snake[i + 1] = { ...snake[i] };
        }
        snake[0].x += inputData.x;
        snake[0].y += inputData.y;
        snake.forEach((e, i) => {
            const element = document.createElement('div');
            element.classList.add(i === 0 ? 'head' : 'snakeBody');
            element.style.gridRow = e.y;
            element.style.gridColumn = e.x;
            if (i !== 0) {
                element.style.scale = 1 - 0.01*i;
            }
            board.appendChild(element);
        });
    }
    window.requestAnimationFrame(main);
}

window.requestAnimationFrame(main);
document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;
    switch (e.keyCode) {
        case 37:
            if (inputData.x !== 1) {
                inputData = { x: -1, y: 0 };
            }
            break;

        case 38:
            if (inputData.y !== 1) {
                inputData = { x: 0, y: -1 };
            }
            break;

        case 39:
            if (inputData.x !== -1) {
                inputData = { x: 1, y: 0 };
            }
            break;

        case 40:
            if (inputData.y !== -1) {
                inputData = { x: 0, y: 1 };
            }
            break;

        default:
            break;
    }
    move.play();
}

function isGameOver(snake) {
    let onBody = false;
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            onBody = true;
            break;
        }
    }
    return onBody || snake[0].x > 19 || snake[0].y > 19 || snake[0].x < 1 || snake[0].y < 1;
}

var touchstartX = 0;
var touchstartY = 0;
var touchendX = 0;
var touchendY = 0;

var gesuredZone = document.getElementById('gesuredZone');

gesuredZone.addEventListener('touchstart', function(event) {
    touchstartX = event.changedTouches[0].screenX;
    touchstartY = event.changedTouches[0].screenY;
}, false);

gesuredZone.addEventListener('touchend', function(event) {
    touchendX = event.changedTouches[0].screenX;
    touchendY = event.changedTouches[0].screenY;
    handleGesure();
}, false); 

function handleGesure() {
    const delX = Math.abs(touchendX - touchstartX);
    const delY = Math.abs(touchendY - touchstartY);
    if (touchendX < touchstartX && delX > delY) {
        checkKey({keyCode: 37});
    }else if (touchendX > touchstartX && delX > delY) {
        checkKey({keyCode: 39});
    }else if (touchendY < touchstartY && delY> delX) {
        checkKey({keyCode: 38});
    }else if (touchendY > touchstartY && delY > delX) {
        checkKey({keyCode: 40});
    }else if (touchendY == touchstartY) {
        checkKey({keyCode: 37});
    }
}