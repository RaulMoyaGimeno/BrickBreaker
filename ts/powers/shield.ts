import { Game } from "../games/game.js";
import { Power } from "./power.js";

export class Shield extends Power<Game> {
  effect(game: Game): void {
    game.shield = true;
    setTimeout(() => (game.shield = false), 20000);
  }
}
