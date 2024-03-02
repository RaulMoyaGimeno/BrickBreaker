import { EventType } from "../utils/enums.js";
import { Power } from "./power.js";

export class FireBall extends Power {
  effect(): EventType {
    return EventType.FIREBALL;
  }
}
