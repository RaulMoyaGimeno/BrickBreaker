import { Paddle } from "../models/paddle.js";
import { FireBall } from "./fireBall.js";
import { GiantPaddle } from "./giantPaddle.js";
import { PlusBall } from "./plusBall.js";
import { Power } from "./power.js";
import { Shield } from "./shield.js";

export class PowerFactory {
  static createRandomPower(
    x: number,
    y: number,
    destroy: () => void,
    ctx: CanvasRenderingContext2D,
    paddle: Paddle,
  ): Power {
    const selectPower = Math.floor(Math.random() * 4);

    switch (selectPower) {
      case 0:
        return new FireBall(x, y, ctx, paddle, destroy);
      case 1:
        return new PlusBall(x, y, ctx, paddle, destroy);
      case 2:
        return new GiantPaddle(x, y, ctx, paddle, destroy);
      case 3:
        return new Shield(x, y, ctx, paddle, destroy);
      default:
        return new GiantPaddle(x, y, ctx, paddle, destroy);
    }
  }
}
