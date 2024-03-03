import { Action } from "../../utils/actions.js";
import { ShowHistorialAction } from "../actions/showHistorialAction.js";
import { StartGameAction } from "../actions/startGameAction.js";
import { Modal } from "../../utils/modal.js";

export class GameOverModal implements Modal<Action> {
  async show(): Promise<Action> {
    return new Promise((resolve) => {
      const alertDiv = $("<div>");
      const gameOverMessage = $("<label>").text("Game Over\n");
      const botonera = $("<div>");
      const btnRestart = $("<button>").text("Volver a Jugar");
      const btnHistory = $("<button>").text("Ver Historial");

      const handleClick = (option: Action) => {
        alertDiv.remove();
        resolve(option);
      };

      btnRestart.on("click", () => handleClick(new StartGameAction()));
      btnHistory.on("click", () => handleClick(new ShowHistorialAction()));

      alertDiv.addClass("modal-container");
      gameOverMessage.addClass("message");
      botonera.addClass("button-container");
      btnRestart.addClass("button");
      btnHistory.addClass("button");

      botonera.append(btnRestart, btnHistory);

      alertDiv.append(gameOverMessage, botonera);

      $("body").append(alertDiv);
    });
  }
}
