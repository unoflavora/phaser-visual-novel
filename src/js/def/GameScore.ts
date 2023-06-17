import { MinigameTypes } from "./Minigame";

export default interface GameScore
{
    performance : number,
    accuracy: number;
}

export interface SubmitScoreData
{
    wM_Accuracy: number,
    wM_Performance: number,
    sR_Accuracy: number,
    sR_Performance: number,
    lC_Accuracy: number,
    lC_Performance: number,
    nR_Accuracy: number,
    nR_Performance: number,
    lR_Accuracy: number,
    lR_Performance: number,
    pS_Accuracy: number,
    pS_Performance: number,
    aP_Accuracy: number,
    aP_Performance: number,
    eU_Accuracy: number,
    eU_Performance: number
}

export type TotalGameScore = { [key in MinigameTypes] : GameScore}