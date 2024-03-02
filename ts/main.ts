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
    if (this.game.over) return;
    const animationId = requestAnimationFrame(this.gameLoop.bind(this));
    this.game.render();
    this.game.animationId = animationId;
  }
}

new StartGameAction().act();
