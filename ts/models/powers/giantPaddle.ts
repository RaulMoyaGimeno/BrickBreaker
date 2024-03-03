import { EventType } from "../../utils/enums.js";
import { Power } from "./power.js";

export class GiantPaddle extends Power {
  effect(): EventType {
    return EventType.GIANT_PADDLE_ACTIVATED;
  }
}
