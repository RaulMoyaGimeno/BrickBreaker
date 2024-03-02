import { Game } from "../games/game.js";
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
  ): Power {
    const selectPower = Math.floor(Math.random() * 4);

    switch (selectPower) {
      case 0:
        return new FireBall(x, y, game, destroy);
      case 1:
        return new PlusBall(x, y, game, destroy);
      case 2:
        return new GiantPaddle(x, y, game, destroy);
      case 3:
        return new Shield(x, y, game, destroy);
      default:
        return new GiantPaddle(x, y, game, destroy);
    }
  }
}
