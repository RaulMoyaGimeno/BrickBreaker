import { GameDifficulty } from "../utils/enums.js";
import { GameConfig } from "../utils/types.js";

export class GameConfigurator {
  static configure(difficulty: GameDifficulty): GameConfig {
    const paddleConfig = this.configurePaddle(difficulty);
    const ballConfig = this.configureBall(difficulty);
    const brickConfig = this.configureBrick(difficulty);
    const increaseBallSpeedTimeout =
      this.configureIncreaseBallSpeedTimeout(difficulty);
    const scoreMultiplier = this.configureScoreMultiplier(difficulty);

    return {
      paddleConfig,
      ballConfig,
      brickConfig,
      increaseBallSpeedTimeout,
      scoreMultiplier,
    };
  }

  private static configurePaddle(difficulty: GameDifficulty) {
    let width = 85;
    let height = 27;
    let speed = 4;

    switch (difficulty) {
      case GameDifficulty.EASY:
        speed = 6;
        break;
    }

    return { width, height, speed };
  }

  private static configureBall(difficulty: GameDifficulty) {
    let radius = 5;
    let speed = 5;
    let dx = 3;
    let dy = -4;

    switch (difficulty) {
      case GameDifficulty.INSANE:
        speed = 6;
        break;
    }

    return { radius, speed, dx, dy };
  }

  private static configureBrick(difficulty: GameDifficulty) {
    let brickRowCount = 4;
    let brickColumnCount = 9;
    let brickWidth = 58;
    let brickHeight = 28;
    let brickPadding = 2;
    let brickOffsetTop = 50;
    let brickOffsetLeft = 25;

    switch (difficulty) {
      case GameDifficulty.HARD:
      case GameDifficulty.INSANE:
        brickRowCount = 5;
        break;
    }

    return {
      brickRowCount,
      brickColumnCount,
      brickWidth,
      brickHeight,
      brickPadding,
      brickOffsetTop,
      brickOffsetLeft,
    };
  }

  private static configureIncreaseBallSpeedTimeout(difficulty: GameDifficulty) {
    let increaseBallSpeedTimeout = 8;

    switch (difficulty) {
      case GameDifficulty.EASY:
        increaseBallSpeedTimeout = 10;
        break;
      case GameDifficulty.HARD:
      case GameDifficulty.INSANE:
        increaseBallSpeedTimeout = 6;
        break;
    }

    return increaseBallSpeedTimeout;
  }

  private static configureScoreMultiplier(difficulty: GameDifficulty) {
    let scoreMultiplier = 1;

    switch (difficulty) {
      case GameDifficulty.EASY:
        scoreMultiplier = 0.8;
        break;
      case GameDifficulty.HARD:
        scoreMultiplier = 1.2;
        break;
      case GameDifficulty.INSANE:
        scoreMultiplier = 1.5;
        break;
    }

    return scoreMultiplier;
  }
}
