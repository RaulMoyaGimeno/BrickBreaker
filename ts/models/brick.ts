import { EventEmitter } from "../events/eventEmitter.js";
import { BrickStatus, EventType } from "../utils/enums.js";
import { BrickConfig } from "../utils/types.js";
import { Ball } from "./ball.js";

export class Brick {
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
    this.status = BrickStatus.ALIVE;
    this.type = Math.floor(Math.random() * 5);
    this.x =
      column * (config.brickWidth + config.brickPadding) +
      config.brickOffsetLeft;
    this.y =
      row * (config.brickHeight + config.brickPadding) + config.brickOffsetTop;
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

  public checkCollision(ball: Ball): number {
    const width = this.config.brickWidth;
    const height = this.config.brickHeight;
    if (
      ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + width &&
      ball.y + ball.radius >= this.y &&
      ball.y - ball.radius <= this.y + height
    ) {
      if (this.status === BrickStatus.ALIVE) {
        this.status = BrickStatus.BREAKING;
      } else if (this.status === BrickStatus.BREAKING) {
        this.status = BrickStatus.BROKEN;
      }

      let points = 0;
      if (ball.fire && this.status === BrickStatus.BREAKING) {
        this.status = BrickStatus.BROKEN;
        ball.fire = false;
        points++;
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
        if (Math.floor(Math.random() * 7) === 6)
          EventEmitter.getInstance().emitEvent(
            EventType.BRICK_BROKEN,
            this.x + width / 2,
            this.y + height / 2,
          );
      }

      return points + (this.status === BrickStatus.BROKEN ? 2 : 1);
    }
    return 0;
  }
}
