import { Score } from "../utils/types.js";

export class MaximumScores {
  private static SCORES = "scores";

  static addScore(score: Score): void {
    const scores = this.getScores();
    scores.push(score);
    scores.sort((a, b) => b.score - a.score);
    scores.splice(10);
    localStorage.setItem(this.SCORES, JSON.stringify(scores));
  }

  static getScores(): Score[] {
    let scores = localStorage.getItem(this.SCORES);
    return (JSON.parse(scores ?? "[]") || []) as Score[];
  }
}
