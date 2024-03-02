import { Game } from "../games/game.js";
import { Powerable } from "../models/powerable.js";
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
    game: Game,
  ): Power<Powerable> {
    const selectPower = Math.floor(Math.random() * 4);

    switch (selectPower) {
      case 0:
        return new FireBall(x, y, game.ctx, game.paddle, destroy, game.balls);
      case 1:
        return new PlusBall(x, y, game.ctx, game.paddle, destroy, game);
      case 2:
        return new GiantPaddle(
          x,
          y,
          game.ctx,
          game.paddle,
          destroy,
          game.paddle,
        );
      case 3:
        return new Shield(x, y, game.ctx, game.paddle, destroy, game);
      default:
        return new GiantPaddle(
          x,
          y,
          game.ctx,
          game.paddle,
          destroy,
          game.paddle,
        );
    }
  }
}
