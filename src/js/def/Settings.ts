
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
    sessionId: string
    settings: ISettings,
    scores: IScores
}

export enum LanguageEnum { Indonesian, English }

