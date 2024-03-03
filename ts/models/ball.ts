import { EventEmitter } from "../utils/events/eventEmitter.js";
import { EventListener } from "../utils/events/eventListener.js";
import { EventType } from "../utils/enums.js";
import { BallConfig } from "../utils/types.js";
import { GameObject } from "../utils/gameObject.js";
import { Paddle } from "./paddle.js";

export class Ball extends GameObject implements EventListener {
  private static readonly DEAD = true;
  private fire = false;
  private radius: number;
  private x: number;
  private y: number;
  static SPEED = 5;
  private dx: number;
  private dy: number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    config: BallConfig,
    x?: number,
    y?: number
  ) {
    super();
    EventEmitter.getInstance().subscribe(this);
    this.ctx = ctx;
    this.radius = config.radius;
    this.dx = config.dx;
    this.dy = config.dy;
    this.x = x ?? this.ctx.canvas.width / 2;
    this.y = y ?? this.ctx.canvas.height - 80;
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
        this.y + 1 + this.dy - paddle.getY() >= 0 &&
        this.y + 1 + this.dy - paddle.getY() < this.radius + 4
      );
    }
    return false;
  }

  handleCollision(other: GameObject): void {
    if (other instanceof Paddle) {
      const paddle = other as Paddle;
      const width = paddle.isGiant()
        ? paddle.getWidth() * 1.4
        : paddle.getWidth();
      const ballX = paddle.getX() + width - this.x;
      const middle = width / 2;
      const rightSide = ballX < middle;
      let ang: number;

      if (ballX > middle - 10 && ballX < middle + 10) {
        this.calcularY();
        return;
      } else if (rightSide) {
        if (this.dx > 0) {
          ang = 90 + ((middle - ballX) / middle) * 10;
        } else {
          ang = 90 - ((middle - ballX) / middle) * 9;
        }
      } else {
        if (this.dx < 0) {
          ang = 90 + ((middle - ballX) / middle) * 10;
        } else {
          ang = 90 - ((middle - ballX) / middle) * 9;
        }
      }

      this.dx *= ang / 90;
      if ((rightSide && this.dx < 0) || (!rightSide && this.dx > 0)) {
        this.dx *= -1;
      }

      if (this.dx < -5) {
        this.dx = -5;
      }
      if (this.dx > 5) {
        this.dx = 5;
      }

      this.calcularY();
    }
  }

  onEvent(event: EventType): void {
    if (event === EventType.FIREBALL) {
      this.fire = true;
    }
  }

  public draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.fire ? "orange" : "white";
    this.ctx.fill();
    this.ctx.closePath();
  }

  public move(): boolean {
    if (
      this.x + this.dx > this.ctx.canvas.width - this.radius ||
      this.x + this.dx < this.radius
    ) {
      this.dx = -this.dx;
    }

    if (this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }
    if (this.y + this.dy > this.ctx.canvas.height - this.radius) {
      return Ball.DEAD;
    }

    this.x += this.dx;
    this.y += this.dy;
    return !Ball.DEAD;
  }

  calcularY(): void {
    this.dy = -1 * Math.sqrt(Math.pow(Ball.SPEED, 2) - Math.pow(this.dx, 2));
  }

  changeDirectionY(): void {
    this.dy = -this.dy;
    this.y += this.dy;
  }

  changeDirectionX(): void {
    this.dx = -this.dx;
    this.x += 2 * this.dx;
  }

  hasFire(): boolean {
    return this.fire;
  }

  stopFire(): void {
    this.fire = false;
  }

  getRadius(): number {
    return this.radius;
  }

  getX(): number {
    return this.x;
  }

  getY(): number {
    return this.y;
  }
}
