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
type CoordsSizes = {
  x: number;
  y: number;
};

//EVENTLISTENER w CONSTRUCTORZE

// let appleImage = new Image();
// appleImage.src = "../../dist/img/apple.png";

// let speed = 3;
//let grid = 4;
//let gridSize = canvas.offsetWidth / grid;
// let stopGame = true;
// let stopRandomFruit = false;
// let fruitX = 0;
// let fruitY = 0;
// const spawnPoint = {
//   x: Math.floor(grid / 2) * gridSize + gridSize / 10,
//   y: Math.floor(grid / 2) * gridSize + gridSize / 10,
// };

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
          { x: (game.gridSize * 4) / 5, y: (game.gridSize * 4) / 5 }
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
  fruitX = 0;
  fruitY = 0;
  stopRandomFruit = false;
  pos: CoordsSizes;
  size: CoordsSizes;
  constructor(pos: CoordsSizes, size: CoordsSizes) {
    this.pos = pos;
    this.size = size;
  }
  getImage() {
    const appleImage = new Image();
    appleImage.src = "../../dist/img/apple.png";
    return appleImage;
  }
  randomCoords() {
    const randomX =
      Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
    const randomY =
      Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
    //JESLI OWOC POKRYWA SIE Z WEZEM TO GENERUJ OWOC JESZCZE RAZ
    console.log(randomX + game.gridSize / 4 + " " + randomY + game.gridSize / 4);
    if (canvas.offsetWidth >= 450) {
      if (
        snakeParts.some((e) => {
          console.log(
            "snake" +
              Math.ceil(e.pos.x + (game.gridSize * 2) / 5) +
              "  " +
              Math.ceil(e.pos.y + (game.gridSize * 2) / 5)
          );
          return (
            e.pos.x + (game.gridSize * 2) / 5 === randomX + game.gridSize / 4 &&
            e.pos.y + (game.gridSize * 2) / 5 === randomY + game.gridSize / 4
          );
        })
      ) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");

        fruit.drawFruit();
      } else return [randomX, randomY];
    } else {
      if (
        snakeParts.some((e) => {
          console.log(
            "snake" +
              Math.ceil(e.pos.x + (game.gridSize * 2) / 5) +
              "  " +
              Math.ceil(e.pos.y + (game.gridSize * 2) / 5)
          );
          return (
            Math.ceil(e.pos.x + (game.gridSize * 2) / 5) ===
              Math.ceil(randomX + game.gridSize / 4) &&
            Math.ceil(e.pos.y + (game.gridSize * 2) / 5) ===
              Math.ceil(randomY + game.gridSize / 4)
          );
        })
      ) {
        console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaa");

        fruit.drawFruit();
      } else return [randomX, randomY];
    }
  }
  drawFruit() {
    if (!this.stopRandomFruit) {
      const randomCoords = this.randomCoords();

      if (randomCoords != undefined) {
        this.fruitX = randomCoords[0];
        this.fruitY = randomCoords[1];
      }
    }
    ctx?.drawImage(this.getImage(), this.fruitX, this.fruitY, this.size.x, this.size.x);
  }
}

class Game {
  stopGame = false;
  speed = 3;
  grid = 4;
  gridSize = canvas.offsetWidth / this.grid;
  spawnPoint = {
    x: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
    y: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
  };
  points = 0;
  keyPress() {
    window.addEventListener(
      "keyup",
      function (e) {
        switch (e.key) {
          case "ArrowLeft": //left
            if (snakeParts[0].vel.x === game.gridSize) return;
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = -game.gridSize;
            break;
          case "ArrowUp": //up
            if (snakeParts[0].vel.y === game.gridSize) return;
            snakeParts[0].vel.y = -game.gridSize;
            snakeParts[0].vel.x = 0;
            break;
          case "ArrowRight": //right
            if (snakeParts[0].vel.x === -game.gridSize) return;
            snakeParts[0].vel.y = 0;
            snakeParts[0].vel.x = game.gridSize;
            break;
          case "ArrowDown": //down
            if (snakeParts[0].vel.y === -game.gridSize) return;
            snakeParts[0].vel.y = game.gridSize;
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
    game.stopGame = false;
    game = new Game();
    snakeParts = [
      new Snake(
        { x: this.spawnPoint.x, y: this.spawnPoint.y },
        { x: 0, y: 0 },
        { x: (this.gridSize * 4) / 5, y: (this.gridSize * 4) / 5 }
      ),
    ];
    fruit = new Fruit(
      {
        x: this.gridSize - (this.gridSize * 3) / 4,
        y: this.gridSize - (this.gridSize * 3) / 4,
      },
      { x: this.gridSize / 2, y: this.gridSize / 2 }
    );

    game.animate();
  }
  gameOver() {
    game.stopGame = true;
    this.points = 0;
    pointBox.innerText = this.points.toString();
    mainMenu.classList.remove("hidden");
    gameOver.classList.remove("hidden");
  }
  win() {
    game.stopGame = true;
    this.points = 0;
    pointBox.innerText = this.points.toString();
    gameOver.classList.add("hidden");
    win.classList.remove("hidden");
    mainMenu.classList.remove("hidden");
  }

  addPoint() {
    this.points++;
    if (this.points === Math.pow(this.grid, 2) - 1) game.win();
    pointBox.innerText = this.points.toString();
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

    snakeParts.push(
      new Snake(
        { x: snakeX, y: snakeY },
        { x: 0, y: 0 },
        { x: (this.gridSize * 4) / 5, y: (this.gridSize * 4) / 5 }
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
        fruit.fruitX,
        fruit.fruitY,
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
      snakeParts[0].pos.x + this.gridSize / 2 < 0 ||
      snakeParts[0].pos.x + this.gridSize / 2 > canvas.width ||
      snakeParts[0].pos.y + this.gridSize / 2 < 0 ||
      snakeParts[0].pos.y + this.gridSize / 2 > canvas.height
    ) {
      game.gameOver();
    }
  }

  animate() {
    if (game.stopGame) return;
    snakeParts[0].update();
    game.collisionDetect();
    game.intersectWithSnake();
    game.outOfBoard();
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i <= snakeParts.length - 1; i++) snakeParts[i].drawSnake();
    snakeParts[0].moveSnake();
    fruit.drawFruit();
    fruit.stopRandomFruit = true;
    game.keyPress();
    setTimeout(game.animate, 1000 / game.speed);
  }
}

let game = new Game();
let snakeParts = [
  new Snake(
    { x: game.spawnPoint.x, y: game.spawnPoint.y },
    { x: 0, y: 0 },
    { x: (game.gridSize * 4) / 5, y: (game.gridSize * 4) / 5 }
  ),
];
let fruit = new Fruit(
  {
    x: game.gridSize - (game.gridSize * 3) / 4,
    y: game.gridSize - (game.gridSize * 3) / 4,
  },
  { x: game.gridSize / 2, y: game.gridSize / 2 }
);

startButton.addEventListener("click", (e) => {
  e.preventDefault();
  const size = document.getElementById("size") as HTMLSelectElement;
  game.start();
});
