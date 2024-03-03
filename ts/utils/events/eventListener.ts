import { EventType } from "../enums";

export interface EventListener {
  onEvent(event: EventType, args: any[]): void;
}
