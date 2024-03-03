import { EventEmitter } from "../utils/events/eventEmitter.js";
import { GameOverModal } from "../logic/modals/gameOverModal.js";
import { WinModal } from "../logic/modals/winModal.js";
import { Ball } from "./ball.js";
import { Brick } from "./brick.js";
import { Paddle } from "./paddle.js";
import { Power } from "./powers/power.js";
import { PowerFactory } from "./powers/powerFactory.js";
import { Counter } from "../utils/timers/counter.js";
import { BrickStatus, EventType, GameStatus } from "../utils/enums.js";
import { GameConfig } from "../utils/types.js";
import { EventListener } from "../utils/events/eventListener.js";
import { CollisionManager } from "../utils/collisionManager.js";

export class Game implements EventListener {
  private animationId: number = 0;
  private shield = false;
  private score = 0;
  private add = false;
  private counter: Counter;
  protected canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private collisionManager: CollisionManager;
  private balls: Ball[] = [];
  private paddle: Paddle;
  private powers: Power[] = [];
  private bricks: Brick[][] = [];

  constructor(height: number, width: number, public config: GameConfig) {
    this.canvas = $("#canvas")[0] as HTMLCanvasElement;
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    this.paddle = new Paddle(this.ctx, config.paddleConfig);
    this.collisionManager = new CollisionManager();

    this.configGame();
    this.createBricks();
    this.counter = new Counter(1000, config.increaseBallSpeedTimeout);

    EventEmitter.getInstance().subscribe(this);
    this.addBall();
  }

  onEvent(event: EventType, args: any[]): void {
    console.log(args[0]);
    switch (event) {
      case EventType.PLUS_BALL:
        this.addBall(
          this.paddle.getX() + this.paddle.getWidth() / 2,
          this.paddle.getY()
        );
        break;
      case EventType.SHIELD:
        this.shield = true;
        setTimeout(() => (this.shield = false), 20000);
        break;
      case EventType.BRICK_BROKEN:
        this.score += this.config.brickConfig.pointsPerBroken;
        if (Math.floor(Math.random() * 7) === 6)
          this.addPower(args[0], args[1]);
    }
  }

  configGame(): void {
    Paddle.SPEED = this.config.paddleConfig.speed;
    Ball.SPEED = this.config.ballConfig.speed;
  }

  createBricks() {
    for (
      let column = 0;
      column < this.config.brickConfig.brickColumnCount;
      column++
    ) {
      this.bricks[column] = [];
      for (let row = 0; row < this.config.brickConfig.brickRowCount; row++) {
        this.bricks[column][row] = new Brick(
          this.ctx,
          column,
          row,
          this.config.brickConfig
        );
      }
    }
  }

  addPower(x: number, y: number): void {
    const power = PowerFactory.createRandomPower(
      x,
      y,
      () => this.deletePower(this.powers.indexOf(power)),
      this.ctx
    );
    this.powers.push(power);
  }

  deletePower(index: number): void {
    if (index >= 0 && index < this.powers.length) {
      this.powers.splice(index, 1);
    }
  }

  render(): boolean {
    this.clearCanvas();
    this.drawShield();
    this.moveAndDrawBalls();
    this.moveAndDrawPaddle();
    this.checkAndDrawBricks();
    this.drawPowers();
    this.checkCollisions();
    this.updateScore();
    return this.checkGameStatus();
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
        EventEmitter.getInstance().unsubscribe(ball);
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
    for (
      let column = 0;
      column < this.config.brickConfig.brickColumnCount;
      column++
    ) {
      for (let row = 0; row < this.config.brickConfig.brickRowCount; row++) {
        const brick = this.bricks[column][row];
        if (brick.status === BrickStatus.BROKEN) {
          continue;
        }
        brick.draw();
      }
    }
  }

  drawPowers(): void {
    this.powers.forEach((power) => power.draw());
  }

  checkCollisions() {
    this.collisionManager.checkCollisions([
      ...this.bricks.flatMap((row) => row),
      ...this.balls,
      ...this.powers,
      this.paddle,
    ]);
  }

  updateScore(): void {
    $("#score").text(this.score);
  }

  checkGameStatus(): boolean {
    if (
      this.score ==
      this.config.brickConfig.brickRowCount *
        this.config.brickConfig.brickColumnCount *
        this.config.brickConfig.pointsPerBroken
    ) {
      this.gameOver(GameStatus.WIN);
      return true;
    }

    if (this.balls.length === 0) {
      this.gameOver(GameStatus.LOSE);
      return true;
    }
    return false;
  }

  addBall(x?: number, y?: number): void {
    const newBall = new Ball(this.ctx, this.config.ballConfig, x, y);
    this.balls.push(newBall);
  }

  async gameOver(status: GameStatus): Promise<void> {
    this.counter.stopCounter();
    cancelAnimationFrame(this.animationId);
    if (status == GameStatus.WIN) {
      const action = await new WinModal().show(this.finalScore());
      action.act();
    } else {
      const action = await new GameOverModal().show();
      action.act();
    }
  }

  finalScore(): number {
    let score = (this.score * 300) / parseInt($("#counter")[0].innerText);
    return Math.round(score * this.config.scoreMultiplier);
  }

  setAnimationId(id: number) {
    this.animationId = id;
  }
}
