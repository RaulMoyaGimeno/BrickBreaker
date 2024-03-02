import { Action } from "../actions/actions.js";
import { StartGameAction } from "../actions/startGameAction.js";
import { MaximumScores } from "../utils/maximumScores.js";
import { Modal } from "./modal.js";

export class HighScoresModal implements Modal<Action> {
  async show(): Promise<Action> {
    return new Promise((resolve) => {
      const modalContainer = $("<div>").addClass("modal-container");
      const lblMaxScores = $("<p>")
        .addClass("message")
        .text("Maximas puntuaciones");
      const scoresContainer = $("<div>").addClass("scores-container");
      const closeButton = $("<button>").addClass("button").text("Jugar");

      const scores = MaximumScores.getScores();

      const table = $("<table>").addClass("scores-table");
      const headerRow = $("<tr>").append(
        $("<th>").text("Posición"),
        $("<th>").text("Nombre"),
        $("<th>").text("Puntuación"),
        $("<th>").text("Fecha"),
      );
      table.append(headerRow);

      for (let i = 0; i < scores.length; i++) {
        const score = scores[i];
        const row = $("<tr>").append(
          $("<td>").text(i + 1),
          $("<td>").text(score.name),
          $("<td>").text(score.score),
          $("<td>").text(
            score?.date?.toString().replace("T", " ").slice(0, 16) ?? "",
          ),
        );
        table.append(row);
      }

      scoresContainer.append(table);
      modalContainer.append(lblMaxScores, scoresContainer, closeButton);

      $("body").append(modalContainer);

      closeButton.on("click", () => {
        modalContainer.remove();
        resolve(new StartGameAction());
      });
    });
  }
}
