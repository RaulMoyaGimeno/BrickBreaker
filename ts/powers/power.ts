import { EventEmitter } from "../events/eventEmitter.js";
import { Paddle } from "../models/paddle.js";
import { EventType } from "../utils/enums.js";

export abstract class Power {
  dy = 2;
  private radius = 3;

  constructor(
    private x: number,
    private y: number,
    private ctx: CanvasRenderingContext2D,
    private paddle: Paddle,
    private destroy: () => void,
  ) {}

  public draw(): void {
    this.move();
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "yellow";
    ctx.fill();
    ctx.closePath();
  }

  private move(): void {
    const paddle = this.paddle;
    let width = paddle.width;
    if (paddle.giant) {
      width *= 1.5;
    }
    if (
      this.x > paddle.x &&
      this.x < paddle.x + width &&
      this.y + this.dy - paddle.y >= 0 &&
      this.y + this.dy - paddle.y < this.radius + 4
    ) {
      const event = this.effect();
      EventEmitter.getInstance().emitEvent(event);
      this.destroy();
    }

    this.y += this.dy;
  }

  abstract effect(): EventType;
}
