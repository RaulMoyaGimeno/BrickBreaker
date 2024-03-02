import { Paddle } from "../models/paddle.js";
import { Power } from "./power.js";

export class GiantPaddle extends Power<Paddle> {
  effect(paddle: Paddle): void {
    paddle.giant = true;
    setTimeout(() => (paddle.giant = false), 10001);
  }
}
