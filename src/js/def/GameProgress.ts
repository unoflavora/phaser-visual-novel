import { MinigameTypes } from "./Minigame";
import { IEmotionalUnderstandingScore } from "./Settings";

export interface IEmotionalUnderstandingProgress {
    currentSceneIndex: number;
    currentSceneState: SceneState;
    userEmotions: string[];
    userResponses: string[];
    scores: IEmotionalUnderstandingScore,
}

export default interface IGameProgress
{
    playedMinigames : MinigameTypes[],
    emotionalUnderstanding : IEmotionalUnderstandingProgress
}

export enum SceneState { Intro, AskEmotion, AskResponse, ResponseContext }