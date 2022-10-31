"use strict";
// const pointBox = document.getElementById("pointBox") as HTMLParagraphElement;
// const gameOver = document.getElementById("gameOver") as HTMLHeadingElement;
// const win = document.getElementById("win") as HTMLHeadingElement;
// const mainMenu = document.getElementById("mainMenu") as HTMLDivElement;
// const startButton = document.getElementById("startButton") as HTMLButtonElement;
// let appleImage = new Image();
// appleImage.src = "../../dist/img/apple.png";
class Canvas {
    constructor() {
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
        this.pointBox = document.getElementById("pointBox");
        this.gameOver = document.getElementById("gameOver");
        this.win = document.getElementById("win");
        this.title = document.getElementById("title");
        this.mainMenu = document.getElementById("mainMenu");
        this.startButton = document.getElementById("startButton");
    }
}
class Game {
    constructor(startButton) {
        this.stopGame = false;
        this.speed = 3;
        this.grid = 4;
        this.gridSize = canvas.canvas.offsetWidth / this.grid;
        this.spawnPoint = {
            x: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
            y: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
        };
        this.points = 0;
        this.animate = this.animate.bind(this);
        startButton.addEventListener("click", (e) => {
            e.preventDefault();
            const size = document.getElementById("size");
            console.log(size.value);
            //this.grid = parseInt(size.value);
            //this.gridSize = canvas.canvas.offsetWidth / this.grid;
            this.start();
        });
    }
    keyPress() {
        window.addEventListener("keyup", function (e) {
            switch (e.key) {
                case "ArrowLeft": //left
                    if (snakeParts[0].vel.x === game.gridSize)
                        return;
                    snakeParts[0].vel.y = 0;
                    snakeParts[0].vel.x = -game.gridSize;
                    break;
                case "ArrowUp": //up
                    if (snakeParts[0].vel.y === game.gridSize)
                        return;
                    snakeParts[0].vel.y = -game.gridSize;
                    snakeParts[0].vel.x = 0;
                    break;
                case "ArrowRight": //right
                    if (snakeParts[0].vel.x === -game.gridSize)
                        return;
                    snakeParts[0].vel.y = 0;
                    snakeParts[0].vel.x = game.gridSize;
                    break;
                case "ArrowDown": //down
                    if (snakeParts[0].vel.y === -game.gridSize)
                        return;
                    snakeParts[0].vel.y = game.gridSize;
                    snakeParts[0].vel.x = 0;
                    break;
            }
        }, false);
    }
    reset() {
        snakeParts.splice(1, snakeParts.length - 1);
        snakeParts[0].pos.x = game.spawnPoint.x;
        snakeParts[0].pos.y = game.spawnPoint.y;
        snakeParts[0].vel.x = 0;
        snakeParts[0].vel.y = 0;
        fruit.stopRandomFruit = false;
        fruit.drawFruit();
    }
    start() {
        this.reset();
        canvas.mainMenu.classList.add("hidden");
        this.stopGame = false;
        this.animate();
    }
    gameOver() {
        this.stopGame = true;
        this.points = 0;
        canvas.pointBox.innerText = this.points.toString();
        canvas.title.classList.add("hidden");
        canvas.win.classList.add("hidden");
        canvas.mainMenu.classList.remove("hidden");
        canvas.gameOver.classList.remove("hidden");
    }
    win() {
        this.stopGame = true;
        this.points = 0;
        canvas.pointBox.innerText = this.points.toString();
        canvas.title.classList.add("hidden");
        canvas.gameOver.classList.add("hidden");
        canvas.win.classList.remove("hidden");
        canvas.mainMenu.classList.remove("hidden");
    }
    addPoint() {
        this.points++;
        if (this.points === Math.pow(this.grid, 2) - 2)
            game.win();
        canvas.pointBox.innerText = this.points.toString();
        fruit.stopRandomFruit = false;
        //SPRAWDZENIE W KTORA STRONE IDZIE WONSZ, A POZNIEJ DODANIE KOLEJNEGO KAWALKA Z PRZECIWNEJ STRONY
        let snakeX = 0;
        let snakeY = 0;
        if (snakeParts[snakeParts.length - 1].vel.x === this.gridSize) {
            snakeX = snakeParts[snakeParts.length - 1].pos.x - this.gridSize;
            snakeY = snakeParts[snakeParts.length - 1].pos.y;
        }
        if (snakeParts[snakeParts.length - 1].vel.x === -this.gridSize) {
            snakeX = snakeParts[snakeParts.length - 1].pos.x + this.gridSize;
            snakeY = snakeParts[snakeParts.length - 1].pos.y;
        }
        if (snakeParts[snakeParts.length - 1].vel.y === this.gridSize) {
            snakeY = snakeParts[snakeParts.length - 1].pos.y - this.gridSize;
            snakeX = snakeParts[snakeParts.length - 1].pos.x;
        }
        if (snakeParts[snakeParts.length - 1].vel.y === -this.gridSize) {
            snakeY = snakeParts[snakeParts.length - 1].pos.y + this.gridSize;
            snakeX = snakeParts[snakeParts.length - 1].pos.x;
        }
        snakeParts.push(new Snake({ x: snakeX, y: snakeY }, { x: 0, y: 0 }, { x: (this.gridSize * 4) / 5, y: (this.gridSize * 4) / 5 }));
    }
    collisionDetect() {
        snakeParts[0].collision = false;
        if (this.intersectWithFruit(snakeParts[0].pos.x, snakeParts[0].pos.y, snakeParts[0].size.x, snakeParts[0].size.y, fruit.fruitX, fruit.fruitY, fruit.size.x)) {
            snakeParts[0].collision = true;
            this.addPoint();
        }
    }
    intersectWithFruit(x1, y1, w1, h1, x2, y2, r) {
        if (x2 >= w1 + x1 || x1 >= r + x2 || y2 >= h1 + y1 || y1 >= r + y2)
            return false;
        return true;
    }
    intersectWithSnake() {
        for (let i = 4; i < snakeParts.length; i++) {
            if (snakeParts[0].pos.x == snakeParts[i].pos.x &&
                snakeParts[0].pos.y == snakeParts[i].pos.y) {
                this.gameOver();
            }
        }
    }
    outOfBoard() {
        if (snakeParts[0].pos.x + this.gridSize / 2 < 0 ||
            snakeParts[0].pos.x + this.gridSize / 2 > canvas.canvas.width ||
            snakeParts[0].pos.y + this.gridSize / 2 < 0 ||
            snakeParts[0].pos.y + this.gridSize / 2 > canvas.canvas.height) {
            this.gameOver();
        }
    }
    animate() {
        var _a;
        if (this.stopGame)
            return;
        snakeParts[0].update();
        this.collisionDetect();
        this.intersectWithSnake();
        this.outOfBoard();
        (_a = canvas.ctx) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
        fruit.drawFruit();
        for (let i = 0; i <= snakeParts.length - 1; i++) {
            i === 0 ? (canvas.ctx.fillStyle = "#FF0000") : (canvas.ctx.fillStyle = "#000000");
            snakeParts[i].drawSnake();
        }
        snakeParts[0].moveSnake();
        fruit.stopRandomFruit = true;
        this.keyPress();
        setTimeout(game.animate, 1000 / game.speed);
    }
}
class Snake {
    constructor(pos, vel, size) {
        this.pos = pos;
        this.vel = vel;
        this.size = size;
        this.collision = false;
    }
    drawSnake() {
        var _a;
        (_a = canvas.ctx) === null || _a === void 0 ? void 0 : _a.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    }
    moveSnake() {
        if (snakeParts[0].vel.x != 0 || snakeParts[0].vel.y != 0) {
            snakeParts.unshift(new Snake({ x: snakeParts[0].pos.x, y: snakeParts[0].pos.y }, { x: snakeParts[0].vel.x, y: snakeParts[0].vel.y }, { x: (game.gridSize * 4) / 5, y: (game.gridSize * 4) / 5 }));
            snakeParts.pop();
        }
    }
    update() {
        snakeParts[0].pos.x += snakeParts[0].vel.x;
        snakeParts[0].pos.y += snakeParts[0].vel.y;
    }
}
class Fruit {
    constructor(pos, size) {
        this.fruitX = 0;
        this.fruitY = 0;
        this.stopRandomFruit = false;
        this.pos = pos;
        this.size = size;
    }
    getImage() {
        const appleImage = new Image();
        appleImage.src = "../../dist/img/apple.png";
        return appleImage;
    }
    randomCoords() {
        const randomX = Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
        const randomY = Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
        //JESLI OWOC POKRYWA SIE Z WEZEM TO GENERUJ OWOC JESZCZE RAZ
        if (canvas.canvas.offsetWidth >= 450) {
            if (snakeParts.some((e) => {
                return (e.pos.x + (game.gridSize * 2) / 5 === randomX + game.gridSize / 4 &&
                    e.pos.y + (game.gridSize * 2) / 5 === randomY + game.gridSize / 4);
            })) {
                fruit.drawFruit();
            }
            else
                return [randomX, randomY];
        }
        else {
            if (snakeParts.some((e) => {
                return (Math.ceil(e.pos.x + (game.gridSize * 2) / 5) ===
                    Math.ceil(randomX + game.gridSize / 4) &&
                    Math.ceil(e.pos.y + (game.gridSize * 2) / 5) ===
                        Math.ceil(randomY + game.gridSize / 4));
            })) {
                fruit.drawFruit();
            }
            else
                return [randomX, randomY];
        }
    }
    drawFruit() {
        var _a;
        if (!this.stopRandomFruit) {
            const randomCoords = this.randomCoords();
            if (randomCoords === undefined)
                return;
            this.fruitX = randomCoords[0];
            this.fruitY = randomCoords[1];
        }
        (_a = canvas.ctx) === null || _a === void 0 ? void 0 : _a.drawImage(this.getImage(), this.fruitX, this.fruitY, this.size.x, this.size.x);
    }
}
let canvas = new Canvas();
let game = new Game(canvas.startButton);
let snakeParts = [
    new Snake({ x: game.spawnPoint.x, y: game.spawnPoint.y }, { x: 0, y: 0 }, { x: (game.gridSize * 4) / 5, y: (game.gridSize * 4) / 5 }),
];
let fruit = new Fruit({
    x: game.gridSize - (game.gridSize * 3) / 4,
    y: game.gridSize - (game.gridSize * 3) / 4,
}, { x: game.gridSize / 2, y: game.gridSize / 2 });
