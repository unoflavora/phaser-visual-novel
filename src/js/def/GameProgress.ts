import { MinigameTypes } from "./Minigame";

export interface IEmotionalUnderstandingProgress {
    currentSceneIndex: number;
    currentSceneState: SceneState;
    userResponses: number[]
}

export default interface IGameProgress
{
    playedMinigames : MinigameTypes[],
    emotionalUnderstanding : IEmotionalUnderstandingProgress
}

export enum SceneState { Intro, AskEmotion, AskResponse, ResponseContext }