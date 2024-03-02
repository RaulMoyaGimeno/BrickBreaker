import { HighScoresModal } from "../modals/highScoresModal.js";
import { Action } from "./actions.js";

export class ShowHistorialAction implements Action {
  async act(): Promise<void> {
    let action = await new HighScoresModal().show();
    action.act();
  }
}
