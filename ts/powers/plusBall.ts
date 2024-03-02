import { EventType } from "../utils/enums.js";
import { Power } from "./power.js";

export class PlusBall extends Power {
  effect(): EventType {
    return EventType.PLUS_BALL;
  }
}
