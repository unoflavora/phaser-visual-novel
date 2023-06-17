export interface IMinigameData {
    state : "start" | "end",
    music : boolean,
    sound : boolean,
    game : string,
    score: number,
    accuracy: number,
    timeLeft: number
}


// Order of gameplay
export enum MinigameTypes {MemoryOfSpades, PuzzleBlock, GuessTheWord, EmotionalUnderstanding}
