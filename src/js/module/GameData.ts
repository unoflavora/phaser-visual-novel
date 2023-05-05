export enum LanguageEnum { Indonesian, English }

const gameData : GameData = {
    settings: 
    {
        lang: LanguageEnum.Indonesian
    }
}


interface GameData {
    settings: {
        lang : LanguageEnum
    }
}

export default gameData;
