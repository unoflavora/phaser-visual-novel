import { ISettings, LanguageEnum } from "Definitions/Settings";
import EventBus, { GameEvents } from "./GameEventBus";
import MainSceneController from "Scenes/MainSceneController";

export default class Settings 
{
    constructor() {}
    
    public setGameLanguage = (value: LanguageEnum): void => 
    {
        MainSceneController.instance.gameData.settings.lang = value
    
        EventBus.instance.publish(GameEvents.languageChanged, value);
    };

    public setSfxSettings = (sfx : boolean): void => 
    {
        MainSceneController.instance.gameData.settings.isSfxOn = sfx
    
        EventBus.instance.publish(GameEvents.sfxChanged, sfx);
    };
    
    public setBgmSettings = (bgm : boolean): void => 
    {
        MainSceneController.instance.gameData.settings.isBgmOn = bgm
    
        EventBus.instance.publish(GameEvents.bgmChanged, bgm);
    };
        
}