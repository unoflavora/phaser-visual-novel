export enum LanguageEnum { Indonesian, English }

const GameData : GameData = {
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

export default GameData;
