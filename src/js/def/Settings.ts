
export interface ISettings {
    lang : LanguageEnum,
    isSfxOn: boolean,
    isBgmOn: boolean
}

export interface IGameData {
    settings: ISettings
}

export enum LanguageEnum { Indonesian, English }

