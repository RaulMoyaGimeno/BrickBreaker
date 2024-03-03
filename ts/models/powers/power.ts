import { EventEmitter } from "../../utils/events/eventEmitter.js";
import { GameObject } from "../../utils/gameObject.js";
import { Paddle } from "../paddle.js";
import { EventType } from "../../utils/enums.js";

export abstract class Power extends GameObject {
  private dy = 2;
  private radius = 3;

  constructor(
    private x: number,
    private y: number,
    private ctx: CanvasRenderingContext2D,
    private destroy: () => void
  ) {
    super();
  }

  isCollidingWith(other: GameObject): boolean {
    if (other instanceof Paddle) {
      const paddle = other as Paddle;
      const width = paddle.isGiant()
        ? paddle.getWidth() * 1.4
        : paddle.getWidth();
      return (
        this.x > paddle.getX() &&
        this.x < paddle.getX() + width &&
        this.y + this.dy - paddle.getY() >= 0 &&
        this.y + this.dy - paddle.getY() < this.radius + 4
      );
    }
    return false;
  }

  handleCollision(other: GameObject): void {
    if (other instanceof Paddle) {
      EventEmitter.getInstance().emitEvent(this.effect());
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
