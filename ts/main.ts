import { StartGameAction } from "./actions/startGameAction.js";
import { Game } from "./games/game.js";

export class App {
  constructor(private game: Game) {
    this.game = game;
  }

  public setup(): void {
    this.gameLoop();
  }

  private gameLoop(): void {
    const animationId = requestAnimationFrame(this.gameLoop.bind(this));
    this.game.setAnimationId(animationId);
    const over = this.game.render();
    if (over) return;
  }
}

new StartGameAction().act();
