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

export const setSettings = (value: ISettings): void => 
{
    gameData.settings = value

    EventBus.instance.publish(GameEvents.settingsChanged, value);
};
  
  

export default IGameData;
