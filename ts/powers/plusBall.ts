import { Game } from "../games/game.js";
import { Power } from "./power.js";

export class PlusBall extends Power<Game> {
  effect(game: Game): void {
    game.addBall(game.paddle.x + game.paddle.width / 2, game.paddle.y);
  }
}
