import { Game } from "../games/game.js";
import { GameConfigurator } from "../games/gameConfigurator.js";
import { App } from "../main.js";
import { SelectDifficultyModal } from "../modals/selectDifficultyModal.js";
import { countdown } from "../timers/countdown.js";
import { Action } from "./actions.js";

export class StartGameAction implements Action {
  async act(): Promise<void> {
    const difficulty = await new SelectDifficultyModal().show();
    await countdown(3);
    let app = new App(
      new Game(500, 600, GameConfigurator.configure(difficulty)),
    );

    app.setup();
  }
}
