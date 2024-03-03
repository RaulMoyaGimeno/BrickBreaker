import { EventType } from "../../utils/enums.js";
import { Power } from "./power.js";

export class Shield extends Power {
  effect(): EventType {
    return EventType.SHIELD;
  }
}
