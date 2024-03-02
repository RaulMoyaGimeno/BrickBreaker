import { Ball } from "../models/ball.js";
import { Paddle } from "../models/paddle.js";
import { GameConfig } from "../utils/types.js";

export class Counter {
  private count: number;
  private intervalId: NodeJS.Timeout;

  constructor(interval: number, config: GameConfig) {
    this.count = 0;

    this.intervalId = setInterval(() => {
      this.count++;
      if (this.count % config.increaseBallSpeedTimeout === 0) {
        Ball.VELOCIDAD += 0.2;
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
