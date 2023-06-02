import { IGameData, ISettings, LanguageEnum } from "Definitions/Settings";
import EventBus, { GameEvents } from "./GameEventBus";

export const gameData : IGameData = {
    settings: 
    {
        lang: LanguageEnum.Indonesian,
        isSfxOn: true,
        isBgmOn: true
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
  
  

export default IGameData;
