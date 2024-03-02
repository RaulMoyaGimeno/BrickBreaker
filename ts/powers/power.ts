import { Paddle } from "../models/paddle";
import { Powerable } from "../models/powerable";

export abstract class Power<T extends Powerable> {
  dy = 2;
  private radius = 3;

  constructor(
    private x: number,
    private y: number,
    private ctx: CanvasRenderingContext2D,
    private paddle: Paddle,
    private destroy: () => void,
    protected object: T,
  ) {}

  public draw(): void {
    this.move();
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "yellow";
    this.ctx.fill();
    this.ctx.closePath();
  }

  private move(): void {
    let width = this.paddle.width;
    if (this.paddle.giant) {
      width *= 1.5;
    }
    if (
      this.x > this.paddle.x &&
      this.x < this.paddle.x + width &&
      this.y + this.dy - this.paddle.y >= 0 &&
      this.y + this.dy - this.paddle.y < this.radius + 4
    ) {
      this.effect(this.object);
      this.destroy();
    }

    this.y += this.dy;
  }

  abstract effect(object: T): void;
}
