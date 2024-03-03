import { EventEmitter } from "../events/eventEmitter.js";
import { BrickStatus, EventType } from "../utils/enums.js";
import { BrickConfig } from "../utils/types.js";
import { Ball } from "./ball.js";
import { GameObject } from "./gameObject.js";

export class Brick extends GameObject {
  public status: BrickStatus;
  private type: number;
  private x: number;
  private y: number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    column: number,
    row: number,
    private config: BrickConfig,
  ) {
    super();
    this.status = BrickStatus.ALIVE;
    this.type = Math.floor(Math.random() * 5);
    this.x =
      column * (config.brickWidth + config.brickPadding) +
      config.brickOffsetLeft;
    this.y =
      row * (config.brickHeight + config.brickPadding) + config.brickOffsetTop;
  }

  isCollidingWith(other: GameObject): boolean {
    if (this.status === BrickStatus.BROKEN) return false;

    if (other instanceof Ball) {
      const ball = other as Ball;
      console.log(ball);
      const width = this.config.brickWidth;
      const height = this.config.brickHeight;
      return (
        ball.x + ball.radius >= this.x &&
        ball.x - ball.radius <= this.x + width &&
        ball.y + ball.radius >= this.y &&
        ball.y - ball.radius <= this.y + height
      );
    }
    return false;
  }

  handleCollision(other: GameObject): void {
    if (other instanceof Ball) {
      const ball = other as Ball;
      const width = this.config.brickWidth;
      const height = this.config.brickHeight;

      if (this.status === BrickStatus.ALIVE) {
        this.status = BrickStatus.BREAKING;
      } else if (this.status === BrickStatus.BREAKING) {
        this.status = BrickStatus.BROKEN;
      }

      if (ball.fire && this.status === BrickStatus.BREAKING) {
        this.status = BrickStatus.BROKEN;
        ball.fire = false;
      }
      if (ball.y + ball.radius >= this.y && ball.y - ball.radius <= this.y) {
        ball.changeDirectionY();
      } else if (
        ball.y + ball.radius >= this.y + height &&
        ball.y - ball.radius <= this.y + height
      ) {
        ball.changeDirectionY();
      } else {
        ball.changeDirectionX();
      }

      if (this.status === BrickStatus.BROKEN) {
        EventEmitter.getInstance().emitEvent(
          EventType.BRICK_BROKEN,
          this.x + width / 2,
          this.y + height / 2,
        );
      }
    }
  }

  public draw(): void {
    const width = this.config.brickWidth;
    const height = this.config.brickHeight;
    const initY = BrickStatus.ALIVE === this.status ? 0 : height * 3 + 3;
    this.ctx.drawImage(
      $("#paddle")[0] as CanvasImageSource,
      this.type * width,
      initY,
      width,
      height,
      this.x,
      this.y,
      width,
      height,
    );
  }
}
