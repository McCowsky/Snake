const pointBox = document.getElementById("pointBox") as HTMLParagraphElement;
const gameOver = document.getElementById("gameOver") as HTMLHeadingElement;
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
console.log(canvas.width);

//let points = 0;
let speed = 5;
let grid = 10;
let gridSize = canvas.width / grid;
let stopGame = true;
let stopDrawFruit = false;
let fruitX = 0;
let fruitY = 0;
// window.addEventListener("resize", () => {
//   let canvas = document.getElementById(" #canvas") as HTMLCanvasElement;
//   canvas.width = window.innerWidth;

//   canvas.height = window.innerHeight;

// });
class Snake {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  size: { w: number; h: number };
  collision: boolean;
  constructor(
    pos: { x: number; y: number },
    vel: { x: number; y: number },
    size: { w: number; h: number }
  ) {
    this.pos = pos;
    this.vel = vel;
    this.size = size;
    this.collision = false;
  }
  drawSnake() {
    ctx?.fillRect(this.pos.x, this.pos.y, this.size.w, this.size.h);
  }
  moveSnake() {
    if (snakeParts[0].vel.x != 0 || snakeParts[0].vel.y != 0) {
      snakeParts.unshift(
        new Snake(
          { x: snakeParts[0].pos.x, y: snakeParts[0].pos.y },
          { x: snakeParts[0].vel.x, y: snakeParts[0].vel.y },
          { w: gridSize, h: gridSize }
        )
      );
      snakeParts.pop();
    }
  }
  update() {
    // this.pos.x += this.vel.x;
    // this.pos.y += this.vel.y;

    snakeParts[0].pos.x += snakeParts[0].vel.x;
    snakeParts[0].pos.y += snakeParts[0].vel.y;

    // const newsnakeParts = [
    //   new Snake(
    //     { x: snakeParts[0].pos.x, y: snakeParts[0].pos.y },
    //     { x: snakeParts[0].vel.x, y: snakeParts[0].vel.y },
    //     { w: gridSize, h: gridSize }
    //   ),
    // ];
    // for (let i = 1; i < snakeParts.length ; ++i) {
    //   newsnakeParts.push(snakeParts[i-1]);
    // }
    // snakeParts = newsnakeParts;
  }
}
class Fruit {
  pos: { x: number; y: number };
  size: { r: number };
  constructor(pos: { x: number; y: number }, size: { r: number }) {
    this.pos = pos;
    this.size = size;
  }
  randomCoords() {
    const randomX = Math.floor(Math.random() * grid + 1) * gridSize - gridSize / 2;

    const randomY = Math.floor(Math.random() * grid + 1) * gridSize - gridSize / 2;

    return [randomX, randomY];
  }
  drawFruit() {
    if (!stopDrawFruit) {
      const randomCoords = this.randomCoords();

      fruitX = randomCoords[0];
      fruitY = randomCoords[1];
    }
    ctx?.beginPath();
    ctx?.arc(fruitX, fruitY, this.size.r, 0, 2 * Math.PI);
    ctx?.stroke();
  }
}

class Game {
  points = 0;
  keyPress() {
    window.addEventListener(
      "keydown",
      function (e) {
        switch (e.key) {
          case "ArrowLeft": //left
            if (snakeParts[0].vel.x === gridSize) return;
            //for (let i = 0; i <= snakeParts.length - 1; i++) {
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = -gridSize;
            //}

            break;
          case "ArrowUp": //up
            if (snakeParts[0].vel.y === gridSize) return;

            // for (let i = 0; i <= snakeParts.length - 1; i++) {
            snakeParts[0].vel.y = -gridSize;
            snakeParts[0].vel.x = 0;
            // }

            break;
          case "ArrowRight": //right
            if (snakeParts[0].vel.x === -gridSize) return;

            //for (let i = 0; i <= snakeParts.length - 1; i++) {
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = gridSize;
            //}

            break;
          case "ArrowDown": //down
            if (snakeParts[0].vel.y === -gridSize) return;

            //for (let i = 0; i <= snakeParts.length - 1; i++) {
            snakeParts[0].vel.y = gridSize;
            snakeParts[0].vel.x = 0;
            //}

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
        { x: SCREEN_CENTER.x, y: SCREEN_CENTER.y },
        { x: 0, y: 0 },
        { w: gridSize, h: gridSize }
      ),
      // new Snake(
      //   { x: SCREEN_CENTER.x - gridSize, y: SCREEN_CENTER.y },
      //   { x: 0, y: 0 },
      //   { w: gridSize, h: gridSize }
      // ),
    ];
    fruit = new Fruit({ x: gridSize / 2, y: gridSize / 2 }, { r: gridSize / 2 });

    game.animate();
  }
  gameOver() {
    mainMenu.classList.remove("hidden");
    gameOver.classList.remove("hidden");
    stopGame = true;
  }
  addPoint() {
    this.points++;
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
        {
          x: snakeX,
          y: snakeY,
        },
        {
          x: 0,
          y: 0,
        },
        { w: gridSize, h: gridSize }
      )
    );
    console.log(snakeParts);
  }

  collisionDetect() {
    snakeParts[0].collision = false;

    if (
      this.intersect(
        snakeParts[0].pos.x,
        snakeParts[0].pos.y,
        snakeParts[0].size.w,
        snakeParts[0].size.h,
        fruitX,
        fruitY,
        fruit.size.r
      )
    ) {
      snakeParts[0].collision = true;
      //game.gameOver();
      game.addPoint();
    }
  }

  intersect(
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

  outOfBoard() {
    if (
      snakeParts[0].pos.x < 0 ||
      snakeParts[0].pos.x + gridSize > canvas.offsetWidth ||
      snakeParts[0].pos.y < 0 ||
      snakeParts[0].pos.y + gridSize > canvas.offsetHeight
    ) {
      game.gameOver();
    }
  }

  animate() {
    if (stopGame) return;
    // for (let i = 0; i <= snakeParts.length - 1; i++) snakeParts[i].update();
    snakeParts[0].update();
    game.collisionDetect();
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
    { x: SCREEN_CENTER.x, y: SCREEN_CENTER.y },
    { x: 0, y: 0 },
    { w: gridSize, h: gridSize }
  ),
];
let fruit = new Fruit({ x: gridSize / 2, y: gridSize / 2 }, { r: gridSize / 2 });

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  game.start();
});
