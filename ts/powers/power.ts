import { EventEmitter } from "../events/eventEmitter.js";
import { GameObject } from "../models/gameObject.js";
import { Paddle } from "../models/paddle.js";
import { EventType } from "../utils/enums.js";

export abstract class Power extends GameObject {
  dy = 2;
  private radius = 3;

  constructor(
    private x: number,
    private y: number,
    private ctx: CanvasRenderingContext2D,
    private paddle: Paddle,
    private destroy: () => void,
  ) {
    super();
  }

  isCollidingWith(other: GameObject): boolean {
    if (other instanceof Paddle) {
      const paddle = other as Paddle;
      const width = paddle.giant ? paddle.width * 1.4 : paddle.width;
      return (
        this.x > paddle.x &&
        this.x < paddle.x + width &&
        this.y + this.dy - paddle.y >= 0 &&
        this.y + this.dy - paddle.y < this.radius + 4
      );
    }
    return false;
  }

  handleCollision(other: GameObject): void {
    if (other instanceof Paddle) {
      const event = this.effect();
      EventEmitter.getInstance().emitEvent(event);
      this.destroy();
    }
  }

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
    this.y += this.dy;
  }

  abstract effect(): EventType;
}
