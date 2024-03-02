import { EventListener } from "../events/eventListener.js";
import { EventType } from "../utils/enums.js";

export class Paddle implements EventListener {
  width = 85;
  height = 27;
  x: number;
  y: number;
  giant = false;

  private leftPressed = false;
  private rightPressed = false;

  private ctx: CanvasRenderingContext2D;

  static SPEED = 4;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.x = (this.ctx.canvas.width - this.width) / 2;
    this.y = this.ctx.canvas.height - this.height - 30;

    $(document).on({
      keydown: this.keyDownHandler.bind(this),
      keyup: this.keyUpHandler.bind(this),
    });
  }

  onEvent(event: EventType): void {
    if (event === EventType.GIANT_PADDLE_ACTIVATED) {
      this.giant = true;
      setTimeout(() => (this.giant = false), 20000);
    }
  }

  public draw(): void {
    if (this.giant) {
      this.ctx.drawImage(
        $("#paddle")[0] as CanvasImageSource,
        0,
        115 + this.height,
        this.width * 1.4,
        this.height,
        this.x,
        this.y,
        this.width * 1.4,
        this.height,
      );
    } else
      this.ctx.drawImage(
        $("#paddle")[0] as CanvasImageSource,
        0,
        115,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height,
      );
  }

  public move(): void {
    if (this.rightPressed && this.x < this.ctx.canvas.width - this.width) {
      this.x += Paddle.SPEED;
    }
    if (this.leftPressed && this.x > 0) {
      this.x -= Paddle.SPEED;
    }
  }

  private keyDownHandler(e: KeyboardEvent): void {
    if (e.key == "ArrowLeft" || e.key == "Left") {
      this.leftPressed = true;
    } else if (e.key == "ArrowRight" || e.key == "Right") {
      this.rightPressed = true;
    }
  }

  private keyUpHandler(e: KeyboardEvent): void {
    if (e.key == "ArrowLeft" || e.key == "Left") {
      this.leftPressed = false;
    } else if (e.key == "ArrowRight" || e.key == "Right") {
      this.rightPressed = false;
    }
  }
}
