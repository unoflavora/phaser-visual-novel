type EventHandler<T> = (data: T) => void;

export const GameEvents = {
    settingsChanged: "gameDataChanged",
}

export default class EventBus {
  private _eventHandlers: Record<string, EventHandler<any>[]> = {};
  private static _instance: EventBus;

  private constructor() {}

  public static get instance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }


  public subscribe<T>(event: string, handler: EventHandler<T>): void {
    if (!this._eventHandlers[event]) {
      this._eventHandlers[event] = [];
    }

    this._eventHandlers[event].push(handler);
  }

  public unsubscribe<T>(event: string, handler: EventHandler<T>): void {
    const handlers = this._eventHandlers[event];
    if (handlers) {
      this._eventHandlers[event] = handlers.filter((h) => h !== handler);
    }
  }

  public publish<T>(event: string, data: T): void {
    const handlers = this._eventHandlers[event];
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}
