import { Game } from "../games/game.js";
import { BrickStatus } from "../utils/enums.js";
import { Ball } from "./ball.js";

export class Brick {
  public status: BrickStatus;
  private type: number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private width: number,
    private height: number,
    private game: Game,
  ) {
    this.status = BrickStatus.ALIVE;
    this.type = Math.floor(Math.random() * 5);
  }

  public draw(): void {
    const initY = BrickStatus.ALIVE === this.status ? 0 : this.height * 3 + 3;
    this.ctx.drawImage(
      $("#paddle")[0] as CanvasImageSource,
      this.type * this.width,
      initY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height,
    );
  }

  public checkCollision(ball: Ball): number {
    if (
      ball.x + ball.radius >= this.x &&
      ball.x - ball.radius <= this.x + this.width &&
      ball.y + ball.radius >= this.y &&
      ball.y - ball.radius <= this.y + this.height
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
        ball.y + ball.radius >= this.y + this.height &&
        ball.y - ball.radius <= this.y + this.height
      ) {
        ball.changeDirectionY();
      } else {
        ball.changeDirectionX();
      }

      if (this.status === BrickStatus.BROKEN) {
        if (Math.floor(Math.random() * 7) === 6)
          this.game.addPower(this.x + this.width / 2, this.y + this.height / 2);
      }

      return points + (this.status === BrickStatus.BROKEN ? 2 : 1);
    }
    return 0;
  }
}
