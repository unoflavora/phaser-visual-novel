import IGameProgress from "./GameProgress"
import { TotalGameScore } from "./GameScore"

export interface ISettings {
    lang : LanguageEnum,
    isSfxOn: boolean,
    isBgmOn: boolean
}

export interface IEmotionalUnderstandingScore {
    emotion: number,
    response: number
}

export interface IResults
{
    "Working Memory" : number,
    "Spatial Reasoning": number,
    "Linguistic Comprehension" : number,
    "Numerical Reasoning" : number,
    "Logical Reasoning" : number,
    "Problem Solving" : number,
    "Auditory Processing" : number,
    "Emotional Understanding": number       
} 

export interface IGameData {
    progress: IGameProgress
    sessionId: string
    settings: ISettings,
    results : TotalGameScore | null,
}

export enum LanguageEnum { Indonesian, English }

