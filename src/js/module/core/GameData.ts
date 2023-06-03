import { IGameData, ISettings, LanguageEnum } from "Definitions/Settings";
import EventBus, { GameEvents } from "./GameEventBus";

export const gameData : IGameData = {
    sessionId: "",
    settings: 
    {
        lang: LanguageEnum.English,
        isSfxOn: true,
        isBgmOn: true
    },
    scores:
    {
        emotion: 0,
        response: 0
    }
}

export const setSfxSettings = (sfx : boolean): void => 
{
    gameData.settings.isSfxOn = sfx

    EventBus.instance.publish(GameEvents.sfxChanged, sfx);
};

export const setBgmSettings = (bgm : boolean): void => 
{
    gameData.settings.isBgmOn = bgm

    EventBus.instance.publish(GameEvents.bgmChanged, bgm);
};

export const setGameLanguage = (value: LanguageEnum): void => 
{
    gameData.settings.lang = value

    EventBus.instance.publish(GameEvents.languageChanged, value);
};

export const setEmotionScore = (value: number): void =>
{
    gameData.scores.emotion = value;
}

export const setResponseScore = (value: number): void =>
{
    gameData.scores.response = value;
}
  
  
export default IGameData;
