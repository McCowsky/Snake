const pointBox = document.getElementById("pointBox") as HTMLParagraphElement;
const gameOver = document.getElementById("gameOver") as HTMLHeadingElement;
const win = document.getElementById("win") as HTMLHeadingElement;
const mainMenu = document.getElementById("mainMenu") as HTMLDivElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
if (ctx === null) window.alert("refresh page");
canvas.style.width = "100%";
canvas.style.height = "100%";
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const SCREEN_CENTER = { x: canvas.offsetWidth / 2, y: canvas.offsetHeight / 2 };
console.log(canvas.offsetWidth);
type CoordsSizes = {
  x: number;
  y: number;
};

let appleImage = new Image();
appleImage.src = "../../dist/img/apple.png";

let speed = 3;
let grid = 4;
let gridSize = canvas.offsetWidth / grid;
console.log(gridSize + "gridsize");
let stopGame = true;
let stopDrawFruit = false;
let fruitX = 0;
let fruitY = 0;
const spawnPoint = {
  x: Math.floor(grid / 2) * gridSize + gridSize / 10,
  y: Math.floor(grid / 2) * gridSize + gridSize / 10,
};

//console.log(gridSize);

class Snake {
  pos: CoordsSizes;
  vel: CoordsSizes;
  size: CoordsSizes;
  collision: boolean;
  constructor(pos: CoordsSizes, vel: CoordsSizes, size: CoordsSizes) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
    this.collision = false;
  }
  drawSnake() {
    ctx?.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
  moveSnake() {
    if (snakeParts[0].vel.x != 0 || snakeParts[0].vel.y != 0) {
      snakeParts.unshift(
        new Snake(
          { x: snakeParts[0].pos.x, y: snakeParts[0].pos.y },
          { x: snakeParts[0].vel.x, y: snakeParts[0].vel.y },
          { x: (gridSize * 4) / 5, y: (gridSize * 4) / 5 }
        )
      );
      snakeParts.pop();
    }
  }
  update() {
    snakeParts[0].pos.x += snakeParts[0].vel.x;
    snakeParts[0].pos.y += snakeParts[0].vel.y;
  }
}
class Fruit {
  pos: CoordsSizes;
  size: CoordsSizes;
  constructor(pos: CoordsSizes, size: CoordsSizes) {
    this.pos = pos;
    this.size = size;
  }
  randomCoords() {
    const randomX = Math.floor(Math.random() * grid + 1) * gridSize - (gridSize * 3) / 4;
    const randomY = Math.floor(Math.random() * grid + 1) * gridSize - (gridSize * 3) / 4;
    //JESLI OWOC POKRYWA SIE Z WEZEM TO GENERUJ OWOC JESZCZE RAZ

    if (canvas.offsetWidth >= 450) {
      if (
        snakeParts.some((e) => {
          return (
            e.pos.x + (gridSize * 2) / 5 === randomX + gridSize / 4 &&
            e.pos.y + (gridSize * 2) / 5 === randomY + gridSize / 4
          );
        })
      ) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");

        fruit.drawFruit();
      } else return [randomX, randomY];
    } else {
      if (
        snakeParts.some((e) => {
          return (
            Math.ceil(e.pos.x + (gridSize * 2) / 5) === randomX + gridSize / 4 &&
            Math.ceil(e.pos.y + (gridSize * 2) / 5) === randomY + gridSize / 4
          );
        })
      ) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");

        fruit.drawFruit();
      } else return [randomX, randomY];
    }
  }
  drawFruit() {
    if (!stopDrawFruit) {
      const randomCoords = this.randomCoords();

      if (randomCoords != undefined) {
        fruitX = randomCoords[0];
        fruitY = randomCoords[1];
      }
    }
    ctx?.drawImage(appleImage, fruitX, fruitY, this.size.x, this.size.x);
  }
}

class Game {
  points = 0;
  keyPress() {
    window.addEventListener(
      "keyup",
      function (e) {
        switch (e.key) {
          case "ArrowLeft": //left
            if (snakeParts[0].vel.x === gridSize) return;
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = -gridSize;
            break;
          case "ArrowUp": //up
            if (snakeParts[0].vel.y === gridSize) return;
            snakeParts[0].vel.y = -gridSize;
            snakeParts[0].vel.x = 0;
            break;
          case "ArrowRight": //right
            if (snakeParts[0].vel.x === -gridSize) return;
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = gridSize;
            break;
          case "ArrowDown": //down
            if (snakeParts[0].vel.y === -gridSize) return;
            snakeParts[0].vel.y = gridSize;
            snakeParts[0].vel.x = 0;
            break;
        }
      },
      false
    );
  }
  update() {}
  start() {
    mainMenu.classList.add("hidden");
    stopGame = false;
    game = new Game();
    snakeParts = [
      new Snake(
        { x: spawnPoint.x, y: spawnPoint.y },
        { x: 0, y: 0 },
        { x: (gridSize * 4) / 5, y: (gridSize * 4) / 5 }
      ),
    ];
    fruit = new Fruit(
      { x: gridSize - (gridSize * 3) / 4, y: gridSize - (gridSize * 3) / 4 },
      { x: gridSize / 2, y: gridSize / 2 }
    );

    game.animate();
  }
  gameOver() {
    stopGame = true;
    this.points = 0;
    pointBox.innerText = this.points.toString();
    mainMenu.classList.remove("hidden");
    gameOver.classList.remove("hidden");
  }
  win() {
    stopGame = true;
    this.points = 0;
    pointBox.innerText = this.points.toString();
    gameOver.classList.add("hidden");
    win.classList.remove("hidden");
    mainMenu.classList.remove("hidden");
  }

  addPoint() {
    this.points++;
    if (this.points === Math.pow(grid, 2) - 1) game.win();
    pointBox.innerText = this.points.toString();
    stopDrawFruit = false;

    //SPRAWDZENIE W KTORA STRONE IDZIE WONSZ, A POZNIEJ DODANIE KOLEJNEGO KAWALKA Z PRZECIWNEJ STRONY
    let snakeX = 0;
    let snakeY = 0;
    if (snakeParts[snakeParts.length - 1].vel.x === gridSize) {
      snakeX = snakeParts[snakeParts.length - 1].pos.x - gridSize;
      snakeY = snakeParts[snakeParts.length - 1].pos.y;
    }
    if (snakeParts[snakeParts.length - 1].vel.x === -gridSize) {
      snakeX = snakeParts[snakeParts.length - 1].pos.x + gridSize;
      snakeY = snakeParts[snakeParts.length - 1].pos.y;
    }
    if (snakeParts[snakeParts.length - 1].vel.y === gridSize) {
      snakeY = snakeParts[snakeParts.length - 1].pos.y - gridSize;
      snakeX = snakeParts[snakeParts.length - 1].pos.x;
    }
    if (snakeParts[snakeParts.length - 1].vel.y === -gridSize) {
      snakeY = snakeParts[snakeParts.length - 1].pos.y + gridSize;
      snakeX = snakeParts[snakeParts.length - 1].pos.x;
    }

    snakeParts.push(
      new Snake(
        { x: snakeX, y: snakeY },
        { x: 0, y: 0 },
        { x: (gridSize * 4) / 5, y: (gridSize * 4) / 5 }
      )
    );
  }

  collisionDetect() {
    snakeParts[0].collision = false;

    if (
      this.intersectWithFruit(
        snakeParts[0].pos.x,
        snakeParts[0].pos.y,
        snakeParts[0].size.x,
        snakeParts[0].size.y,
        fruitX,
        fruitY,
        fruit.size.x
      )
    ) {
      snakeParts[0].collision = true;
      game.addPoint();
    }
  }

  intersectWithFruit(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    r: number
  ) {
    if (x2 >= w1 + x1 || x1 >= r + x2 || y2 >= h1 + y1 || y1 >= r + y2) return false;
    return true;
  }
  intersectWithSnake() {
    for (let i = 4; i < snakeParts.length; i++) {
      if (
        snakeParts[0].pos.x == snakeParts[i].pos.x &&
        snakeParts[0].pos.y == snakeParts[i].pos.y
      ) {
        game.gameOver();
      }
    }
  }
  outOfBoard() {
    if (
      snakeParts[0].pos.x + gridSize / 2 < 0 ||
      snakeParts[0].pos.x + gridSize / 2 > canvas.width ||
      snakeParts[0].pos.y + gridSize / 2 < 0 ||
      snakeParts[0].pos.y + gridSize / 2 > canvas.height
    ) {
      game.gameOver();
    }
  }

  animate() {
    if (stopGame) return;
    snakeParts[0].update();
    game.collisionDetect();
    game.intersectWithSnake();
    game.outOfBoard();
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= snakeParts.length - 1; i++) snakeParts[i].drawSnake();
    snakeParts[0].moveSnake();
    fruit.drawFruit();
    stopDrawFruit = true;
    game.keyPress();
    setTimeout(game.animate, 1000 / speed);
  }
}

let game = new Game();
let snakeParts = [
  new Snake(
    { x: spawnPoint.x, y: spawnPoint.y },
    { x: 0, y: 0 },
    { x: (gridSize * 4) / 5, y: (gridSize * 4) / 5 }
  ),
];
let fruit = new Fruit(
  { x: gridSize - (gridSize * 3) / 4, y: gridSize - (gridSize * 3) / 4 },
  { x: gridSize / 2, y: gridSize / 2 }
);

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  const size = document.getElementById("size") as HTMLSelectElement;
  game.start();
});
