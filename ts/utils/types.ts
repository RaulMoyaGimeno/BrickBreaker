export type Score = {
  score: number;
  name: string;
  date: Date;
};

export type GameConfig = {
  ballSpeed: number;
  paddleSpeed: number;
  increaseBallSpeedTimeout: number;
  brickRowCount: number;
  scoreMultiplier: number;
};
