import { EventType } from "../enums";
import { EventListener } from "./eventListener";

export class EventEmitter {
  private static instance: EventEmitter | null = null;
  private listeners: EventListener[] = [];

  private constructor() {}

  static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  subscribe(listener: EventListener): void {
    this.listeners.push(listener);
  }

  unsubscribe(listener: EventListener): void {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emitEvent(event: EventType, ...args: any): void {
    this.listeners.forEach((listener) => {
      listener.onEvent(event, args);
    });
  }
}
