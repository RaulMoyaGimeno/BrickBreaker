import { Ball } from "../models/ball.js";
import { Power } from "./power.js";

export class FireBall extends Power<Ball[]> {
  effect(balls: Ball[]): void {
    balls.forEach((ball) => (ball.fire = true));
  }
}
