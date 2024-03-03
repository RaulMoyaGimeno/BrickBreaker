export type Score = {
  score: number;
  name: string;
  date: Date;
};

export type GameConfig = {
  increaseBallSpeedTimeout: number;
  scoreMultiplier: number;
  paddleConfig: PaddleConfig;
  ballConfig: BallConfig;
  brickConfig: BrickConfig;
};

export type PaddleConfig = {
  width: number;
  height: number;
  speed: number;
};

export type BallConfig = {
  radius: number;
  speed: number;
  dx: number;
  dy: number;
};

export type BrickConfig = {
  brickRowCount: number;
  brickColumnCount: number;
  brickWidth: number;
  brickHeight: number;
  brickPadding: number;
  brickOffsetTop: number;
  brickOffsetLeft: number;
  pointsPerBroken: number;
};
