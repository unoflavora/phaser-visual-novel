export function assertUnreachable(_x: never): never {
    throw new Error("Make sure your switch statements are exhaustive!");
  }

export type EventHandler = () => void;

  