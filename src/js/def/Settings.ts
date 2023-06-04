import IGameProgress from "./GameProgress"

export interface ISettings {
    lang : LanguageEnum,
    isSfxOn: boolean,
    isBgmOn: boolean
}

export interface IScores {
    emotion: number,
    response: number
}

export interface IGameData {
    progress: IGameProgress
    sessionId: string
    settings: ISettings,
    scores: IScores
}

export enum LanguageEnum { Indonesian, English }

