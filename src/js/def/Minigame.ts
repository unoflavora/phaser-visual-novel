export interface IMinigameData {
    state : "start" | "end",
    music : boolean,
    sound : boolean,
    game : string,
    score: number,
    accuracy: number,
    timeLeft: number
}

export enum MinigameTypes { PuzzleBlock, MemoryOfSpades, GuessTheWord}
