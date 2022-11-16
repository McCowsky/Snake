type CoordsSizes = {
  x: number;
  y: number;
};

type FruitElements = {
  fruitX: number;
  fruitY: number;
  stopRandomFruit: boolean;
  pos: CoordsSizes;
  size: CoordsSizes;
  getImage(): void;
  randomCoords(): void;
  drawFruit(): void;
};

type SnakeElements = {
  pos: CoordsSizes;
  vel: CoordsSizes;
  size: CoordsSizes;
  collision: boolean;
  drawSnake(): void;
  moveSnake(): void;
  update(): void;
};

type CanvasElements = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pointBox: HTMLParagraphElement;
  gameOver: HTMLHeadingElement;
  win: HTMLHeadingElement;
  title: HTMLHeadingElement;
  mainMenu: HTMLDivElement;
  startButton: HTMLButtonElement;
};

type GameElements = {
  stopGame: boolean;
  speed: number;
  grid: number;
  gridSize: number;
  spawnPoint: CoordsSizes;
  keyPress(): void;
  reset(): void;
  start(): void;
  gameOver(): void;
  win(): void;
  addPoint(): void;
  collisionDetect(): void;
  intersectWithFruit(): void;
  intersectWithSnake(): void;
  outOfBoard(): void;
  animate(): void;
};

class Canvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  pointBox: HTMLParagraphElement;
  gameOver: HTMLHeadingElement;
  win: HTMLHeadingElement;
  title: HTMLHeadingElement;
  mainMenu: HTMLDivElement;
  startButton: HTMLButtonElement;

  constructor() {
    this.canvas = this.getElement<HTMLCanvasElement>("canvas");
    this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.pointBox = this.getElement<HTMLParagraphElement>("pointBox");
    this.gameOver = this.getElement<HTMLHeadingElement>("gameOver");
    this.win = this.getElement<HTMLHeadingElement>("win");
    this.title = this.getElement<HTMLHeadingElement>("title");
    this.mainMenu = this.getElement<HTMLDivElement>("mainMenu");
    this.startButton = this.getElement<HTMLButtonElement>("startButton");
  }

  getElement<T>(Id: string) {
    const el = document.getElementById(Id);
    if (!el) {
      throw new Error(`Element with id: ${Id} does not exist.`);
    }
    return el as T;
  }
}

class Game {
  stopGame: boolean = false;
  speed: number = 3;
  grid: number = 4;
  gridSize: number = canvas.canvas.offsetWidth / this.grid;
  spawnPoint: CoordsSizes = {
    x: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
    y: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
  };
  points: number = 0;

  constructor(startButton: HTMLButtonElement) {
    this.animate = this.animate.bind(this);
    startButton.addEventListener("click", (e) => {
      e.preventDefault();
      const size = document.getElementById("size") as HTMLSelectElement;
      const speed = document.getElementById("speed") as HTMLSelectElement;

      this.speed = parseInt(speed.value);
      this.grid = parseInt(size.value);
      this.gridSize = canvas.canvas.offsetWidth / this.grid;

      this.spawnPoint = {
        x: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
        y: Math.floor(this.grid / 2) * this.gridSize + this.gridSize / 10,
      };
      snakeParts = [
        new Snake(
          { x: game.spawnPoint.x, y: game.spawnPoint.y },
          { x: 0, y: 0 },
          { x: (game.gridSize * 4) / 5, y: (game.gridSize * 4) / 5 }
        ),
      ];
      fruit = new Fruit(
        {
          x: game.gridSize - (game.gridSize * 3) / 4,
          y: game.gridSize - (game.gridSize * 3) / 4,
        },
        { x: game.gridSize / 2, y: game.gridSize / 2 }
      );
      this.start();
    });
  }

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
    if (this.points === Math.pow(this.grid, 2) - 2) game.win();
    canvas.pointBox.innerText = this.points.toString();
    fruit.stopRandomFruit = false;
    //SPRAWDZENIE W KTORA STRONE IDZIE WONSZ, A POZNIEJ DODANIE KOLEJNEGO KAWALKA Z PRZECIWNEJ STRONY
    let snakeX: number = 0;
    let snakeY: number = 0;
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
      this.addPoint();
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
        this.gameOver();
      }
    }
  }
  outOfBoard() {
    if (
      snakeParts[0].pos.x + this.gridSize / 2 < 0 ||
      snakeParts[0].pos.x + this.gridSize / 2 > canvas.canvas.width ||
      snakeParts[0].pos.y + this.gridSize / 2 < 0 ||
      snakeParts[0].pos.y + this.gridSize / 2 > canvas.canvas.height
    ) {
      this.gameOver();
    }
  }

  animate() {
    if (this.stopGame) return;
    snakeParts[0].update();
    this.collisionDetect();
    this.intersectWithSnake();
    this.outOfBoard();
    canvas.ctx?.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
    fruit.drawFruit();
    for (let i = 0; i <= snakeParts.length - 1; i++) {
      i === 0 ? (canvas.ctx.fillStyle = "#D90368") : (canvas.ctx.fillStyle = "#000000");
      snakeParts[i].drawSnake();
    }
    snakeParts[0].moveSnake();
    fruit.stopRandomFruit = true;
    this.keyPress();
    setTimeout(this.animate, 1000 / this.speed);
  }
}

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
    canvas.ctx?.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
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
  fruitX: number = 0;
  fruitY: number = 0;
  stopRandomFruit: boolean = false;
  pos: CoordsSizes;
  size: CoordsSizes;
  constructor(pos: CoordsSizes, size: CoordsSizes) {
    this.pos = pos;
    this.size = size;
  }
  getImage() {
    const appleImage = new Image();
    appleImage.src = "../../Snake/dist/img/apple.png";
    return appleImage;
  }
  randomCoords() {
    const randomX =
      Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
    const randomY =
      Math.floor(Math.random() * game.grid + 1) * game.gridSize - (game.gridSize * 3) / 4;
    //JESLI OWOC POKRYWA SIE Z WEZEM TO GENERUJ OWOC JESZCZE RAZ
    if (canvas.canvas.offsetWidth >= 450) {
      if (
        snakeParts.some((e) => {
          return (
            e.pos.x + (game.gridSize * 2) / 5 === randomX + game.gridSize / 4 &&
            e.pos.y + (game.gridSize * 2) / 5 === randomY + game.gridSize / 4
          );
        })
      ) {
        this.drawFruit();
      } else return [randomX, randomY];
    } else {
      if (
        snakeParts.some((e) => {
          return (
            Math.ceil(e.pos.x + (game.gridSize * 2) / 5) ===
              Math.ceil(randomX + game.gridSize / 4) &&
            Math.ceil(e.pos.y + (game.gridSize * 2) / 5) ===
              Math.ceil(randomY + game.gridSize / 4)
          );
        })
      ) {
        this.drawFruit();
      } else return [randomX, randomY];
    }
  }
  drawFruit() {
    if (!this.stopRandomFruit) {
      const randomCoords = this.randomCoords();
      if (randomCoords === undefined) return;
      this.fruitX = randomCoords[0];
      this.fruitY = randomCoords[1];
    }
    canvas.ctx?.drawImage(
      this.getImage(),
      this.fruitX,
      this.fruitY,
      this.size.x,
      this.size.x
    );
  }
}

let canvas: CanvasElements = new Canvas();
let game = new Game(canvas.startButton);
let snakeParts: SnakeElements[] = [];
let fruit: FruitElements;
