import { Action } from "../actions/actions.js";
import { ShowHistorialAction } from "../actions/showHistorialAction.js";
import { StartGameAction } from "../actions/startGameAction.js";
import { MaximumScores } from "../utils/maximumScores.js";
import { Modal } from "./modal.js";

export class WinModal implements Modal<Action> {
  async show(score: number): Promise<Action> {
    return new Promise((resolve) => {
      const alertDiv = $("<div>");
      const congratulationsMessage = $("<label>").text(
        `¡Enhorabuena!\n Tu puntuación es: ${score}\n`,
      );
      const scoreInput = $("<input>").attr({
        type: "text",
        placeholder: "Ingrese su nombre",
        id: "playerNameInput",
      });
      const scoreButton = $("<button>").text("Guardar Puntuación");
      const botonera = $("<div>");
      const btnRestart = $("<button>").text("Volver a Jugar");
      const btnHistory = $("<button>").text("Ver Historial");

      const handleClick = (option: Action) => {
        alertDiv.remove();
        resolve(option);
      };

      btnRestart.on("click", () => handleClick(new StartGameAction()));
      btnHistory.on("click", () => handleClick(new ShowHistorialAction()));

      scoreButton.on("click", () => {
        const name = $("#playerNameInput").val() as string;
        const date = new Date();
        MaximumScores.addScore({ score, name, date });
        scoreButton.prop("disabled", true);
      });

      alertDiv.addClass("modal-container");
      congratulationsMessage.addClass("message");
      scoreInput.addClass("input");
      scoreButton.addClass("button");
      botonera.addClass("button-container");
      btnRestart.addClass("button");
      btnHistory.addClass("button");

      botonera.append(btnRestart, btnHistory);
      alertDiv.append(
        congratulationsMessage,
        scoreInput,
        scoreButton,
        botonera,
      );

      $("body").append(alertDiv);
    });
  }
}
