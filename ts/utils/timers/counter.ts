import { Ball } from "../../models/ball.js";
import { Paddle } from "../../models/paddle.js";

export class Counter {
  private count: number;
  private intervalId: NodeJS.Timeout;

  constructor(interval: number, increaseBallSpeedTimeout: number) {
    this.count = 0;

    this.intervalId = setInterval(() => {
      this.count++;
      if (this.count % increaseBallSpeedTimeout === 0) {
        Ball.SPEED += 0.2;
      }
      if (this.count % 30 === 0) {
        Paddle.SPEED += 0.7;
      }
      $("#counter").text(this.count);
    }, interval);
  }

  stopCounter(): void {
    clearInterval(this.intervalId);
  }
}
