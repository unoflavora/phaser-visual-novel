type EventHandler<T> = (data: T) => void;

export const GameEvents = {
    settingsChanged: "gameDataChanged",
}

export default class EventBus {
  private _eventHandlers: Record<string, Array<{id: string, handler: EventHandler<any>}>> = {};
  private static _instance: EventBus;

  private constructor() {}

  public static get instance(): EventBus {
    if (!EventBus._instance) {
      EventBus._instance = new EventBus();
    }
    return EventBus._instance;
  }


  public subscribe<T>(event: string, handler: EventHandler<T>): string {
    const handlerId = generateUniqueIdentifier(); // Generate a unique identifier for the handler
    const handlers = this._eventHandlers[event] || [];
    handlers.push({ id: handlerId, handler: handler });
    this._eventHandlers[event] = handlers;

    return handlerId; // Return the handler's unique identifier
    }

    public unsubscribe(event: string, handlerId: string): void {
        const handlers = this._eventHandlers[event];
        if (handlers) {
            this._eventHandlers[event] = handlers.filter((h) => h.id !== handlerId);
        }
    }

  public publish<T>(event: string, data: T): void {
    const listeners = this._eventHandlers[event];
    if (listeners) {
      listeners.forEach((listeners) => listeners.handler(data));
    }
  }
}
function generateUniqueIdentifier() {
    return Math.random().toString(36);
}

