import { GameDifficulty } from "../utils/enums.js";
import { GameConfig } from "../utils/types.js";

export class GameConfigurator {
  static configure(difficulty: GameDifficulty): GameConfig {
    const config: GameConfig = {
      ballSpeed: 5,
      paddleSpeed: 4,
      increaseBallSpeedTimeout: 8,
      brickRowCount: 4,
      scoreMultiplier: 1,
    };

    switch (difficulty) {
      case GameDifficulty.EASY:
        config.paddleSpeed = 6;
        config.increaseBallSpeedTimeout = 10;
        config.scoreMultiplier = 0.8;
        break;
      case GameDifficulty.HARD:
        config.increaseBallSpeedTimeout = 6;
        config.brickRowCount = 5;
        config.scoreMultiplier = 1.2;
        break;
      case GameDifficulty.INSANE:
        config.increaseBallSpeedTimeout = 5;
        config.brickRowCount = 5;
        config.scoreMultiplier = 1.5;
        config.ballSpeed = 6;
        break;
    }

    return config;
  }
}
