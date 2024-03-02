import { EventType } from "../utils/enums";
import { EventListener } from "./eventListener";

export class EventEmitter {
  private listeners: EventListener[] = [];

  subscribe(listener: EventListener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: EventListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emitEvent(event: EventType): void {
    this.listeners.forEach((listener) => {
      listener.onEvent(event);
    });
  }
}
