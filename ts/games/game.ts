import { EventEmitter } from "../events/eventEmitter.js";
import { GameOverModal } from "../modals/gameOverModal.js";
import { WinModal } from "../modals/winModal.js";
import { Ball } from "../models/ball.js";
import { Brick } from "../models/brick.js";
import { Paddle } from "../models/paddle.js";
import { Power } from "../powers/power.js";
import { PowerFactory } from "../powers/powerFactory.js";
import { Counter } from "../timers/counter.js";
import { BrickStatus, EventType, GameStatus } from "../utils/enums.js";
import { GameConfig } from "../utils/types.js";
import { EventListener } from "../events/eventListener.js";

export class Game implements EventListener {
  animationId: number = 0;
  over = false;
  shield = false;
  puntuation = 0;
  private add = false;
  private counter: Counter;
  protected canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  balls: Ball[] = [];
  paddle: Paddle;
  powers: Power[] = [];

  private brickRowCount = 4;
  private readonly brickColumnCount = 9;
  private readonly brickWidth = 58;
  private readonly brickHeight = 28;
  private readonly brickPadding = 2;
  private readonly brickOffsetTop = 50;
  private readonly brickOffsetLeft = 25;
  private emitter: EventEmitter;

  private bricks: Brick[][] = [];

  constructor(
    height: number,
    width: number,
    private config: GameConfig,
  ) {
    this.canvas = $("#canvas")[0] as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.paddle = new Paddle(this.ctx);

    this.configGame();
    this.createBricks();
    this.counter = new Counter(1000, config);

    this.emitter = new EventEmitter();
    this.emitter.subscribe(this);
    this.addBall();
    this.emitter.subscribe(this.paddle);
  }

  onEvent(event: EventType): void {
    console.log(event);
    switch (event) {
      case EventType.PLUS_BALL:
        this.addBall(this.paddle.x + this.paddle.width / 2, this.paddle.y);
        break;
      case EventType.SHIELD:
        this.shield = true;
        setTimeout(() => (this.shield = false), 20000);
        break;
    }
  }

  emit(event: EventType): void {
    this.emitter.emitEvent(event);
  }

  configGame(): void {
    Paddle.SPEED = this.config.paddleSpeed;
    Ball.VELOCIDAD = this.config.ballSpeed;
    this.brickRowCount = this.config.brickRowCount;
  }

  createBricks() {
    for (let column = 0; column < this.brickColumnCount; column++) {
      this.bricks[column] = [];
      for (let row = 0; row < this.brickRowCount; row++) {
        this.bricks[column][row] = new Brick(
          this.ctx,
          column * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft,
          row * (this.brickHeight + this.brickPadding) + this.brickOffsetTop,
          this.brickWidth,
          this.brickHeight,
          this,
        );
      }
    }
  }

  addPower(x: number, y: number): void {
    const power = PowerFactory.createRandomPower(
      x,
      y,
      () => this.deletePower(this.powers.indexOf(power)),
      this,
    );
    this.powers.push(power);
  }

  deletePower(index: number): void {
    if (index >= 0 && index < this.powers.length) {
      this.powers.splice(index, 1);
    }
  }

  render(): void {
    this.clearCanvas();
    this.drawShield();
    this.moveAndDrawBalls();
    this.moveAndDrawPaddle();
    this.checkAndDrawBricks();
    this.drawPowers();
    this.updateScore();
    this.checkGameStatus();
  }

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  drawShield(): void {
    if (this.shield) {
      this.ctx.fillStyle = "blue";
      this.ctx.fillRect(0, this.canvas.height - 5, this.canvas.width, 5);
    }
  }

  moveAndDrawBalls(): void {
    this.balls = this.balls.filter((ball) => {
      const dead = ball.move();
      if (dead) {
        if (this.shield) {
          this.add = true;
          this.shield = false;
        }
        this.emitter.unsubscribe(ball);
        return false;
      } else {
        ball.draw();
        return true;
      }
    });
    if (this.add) this.addBall();
    this.add = false;
  }

  moveAndDrawPaddle(): void {
    this.paddle.move();
    this.paddle.draw();
  }

  checkAndDrawBricks(): void {
    for (let column = 0; column < this.brickColumnCount; column++) {
      for (let row = 0; row < this.brickRowCount; row++) {
        const brick = this.bricks[column][row];
        if (brick.status === BrickStatus.BROKEN) {
          continue;
        }
        this.balls.forEach(
          (ball) => (this.puntuation += brick.checkCollision(ball)),
        );
        brick.draw();
      }
    }
  }

  drawPowers(): void {
    this.powers.forEach((power) => power.draw());
  }

  updateScore(): void {
    $("#score").text(this.puntuation);
  }

  checkGameStatus(): void {
    if (this.puntuation == this.brickRowCount * this.brickColumnCount * 3) {
      this.gameOver(GameStatus.WIN);
    }

    if (this.balls.length === 0) {
      this.gameOver(GameStatus.LOSE);
    }
  }

  addBall(x?: number, y?: number): void {
    const newBall = new Ball(this.ctx, this.paddle, x, y);
    this.balls.push(newBall);
    this.emitter.subscribe(newBall);
  }

  async gameOver(status: GameStatus): Promise<void> {
    this.over = true;
    cancelAnimationFrame(this.animationId);
    this.counter.stopCounter();
    if (status == GameStatus.WIN) {
      const action = await new WinModal().show(this.finalScore());
      action.act();
    } else {
      const action = await new GameOverModal().show();
      action.act();
    }
  }

  finalScore(): number {
    let score = (this.puntuation * 300) / parseInt($("#counter")[0].innerText);
    return Math.round(score * this.config.scoreMultiplier);
  }
}
