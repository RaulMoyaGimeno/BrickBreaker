import { EventListener } from "../events/eventListener.js";
import { EventType } from "../utils/enums.js";
import { BallConfig } from "../utils/types.js";
import { Paddle } from "./paddle.js";

export class Ball implements EventListener {
  private static readonly DEAD = true;
  fire = false;
  radius: number;
  x: number;
  y: number;
  static VELOCIDAD = 5;
  dx: number;
  dy: number;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private paddle: Paddle,
    config: BallConfig,
    x?: number,
    y?: number,
  ) {
    this.ctx = ctx;
    this.radius = config.radius;
    this.dx = config.dx;
    this.dy = config.dy;
    this.x = x ?? this.ctx.canvas.width / 2;
    this.y = y ?? this.ctx.canvas.height - 80;
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

    let width = this.paddle.width;
    if (this.paddle.giant) {
      width *= 1.4;
    }
    if (
      this.x > this.paddle.x &&
      this.x < this.paddle.x + width &&
      this.y + 1 + this.dy - this.paddle.y >= 0 &&
      this.y + 1 + this.dy - this.paddle.y < this.radius + 4
    ) {
      const ballX = this.paddle.x + width - this.x;
      const middle = width / 2;
      const rightSide = ballX < middle;
      if (ballX > middle - 10 && ballX < middle + 10) {
      } else if (rightSide) {
        let ang: number;
        if (this.dx > 0) ang = 90 + ((middle - ballX) / middle) * 10;
        else ang = 90 - ((middle - ballX) / middle) * 9;
        this.dx *= ang / 90;
        if (this.dx < 0) this.dx *= -1;
      } else {
        let ang: number;
        if (this.dx < 0) ang = 90 + ((middle - ballX) / middle) * 10;
        else ang = 90 - ((middle - ballX) / middle) * 9;
        this.dx *= ang / 90;
        if (this.dx > 0) this.dx *= -1;
      }
      if (this.dx < -5) this.dx = -5;
      if (this.dx > 5) this.dx = 5;

      this.calcularY();
    } else if (this.y + this.dy > this.ctx.canvas.height - this.radius) {
      return Ball.DEAD;
    }

    this.x += this.dx;
    this.y += this.dy;
    return !Ball.DEAD;
  }

  calcularY(): void {
    this.dy =
      -1 * Math.sqrt(Math.pow(Ball.VELOCIDAD, 2) - Math.pow(this.dx, 2));
  }

  public changeDirectionY(): void {
    this.dy = -this.dy;
    this.y += this.dy;
  }

  public changeDirectionX(): void {
    this.dx = -this.dx;
    this.x += 2 * this.dx;
  }
}
