import { GameDifficulty } from "../../utils/enums.js";
import { Modal } from "../../utils/modal.js";

export class SelectDifficultyModal implements Modal<GameDifficulty> {
  async show(): Promise<GameDifficulty> {
    return new Promise((resolve) => {
      const alertDiv = $("<div>");
      const difficultyMessage = $("<label>").text(
        "Seleccione la dificultad del juego\n"
      );
      const botonera = $("<div>");
      const btnEasy = $("<button>").text("Modo fácil");
      const btnNormal = $("<button>").text("Modo normal");
      const btnHard = $("<button>").text("Modo difícil");
      const btnInsane = $("<button>").text("Modo imposible");

      const handleClick = (difficulty: GameDifficulty) => {
        alertDiv.remove();
        resolve(difficulty);
      };

      btnEasy.on("click", () => handleClick(GameDifficulty.EASY));
      btnNormal.on("click", () => handleClick(GameDifficulty.NORMAL));
      btnHard.on("click", () => handleClick(GameDifficulty.HARD));
      btnInsane.on("click", () => handleClick(GameDifficulty.INSANE));

      alertDiv.addClass("modal-container");
      difficultyMessage.addClass("message");
      botonera.addClass("button-container");
      btnEasy.addClass("button");
      btnNormal.addClass("button");
      btnHard.addClass("button");
      btnInsane.addClass("button");

      botonera.append(btnEasy, btnNormal, btnHard, btnInsane);

      alertDiv.append(difficultyMessage, botonera);

      $("body").append(alertDiv);
    });
  }
}
