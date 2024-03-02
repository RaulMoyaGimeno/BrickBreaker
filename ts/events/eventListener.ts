import { EventType } from "../utils/enums";

export interface EventListener {
  onEvent(event: EventType): void;
}
