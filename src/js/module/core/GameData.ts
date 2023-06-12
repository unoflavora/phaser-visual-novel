import { IGameData, ISettings, LanguageEnum } from "Definitions/Settings";
import MainSceneController from "Scenes/MainSceneController";


export const setEmotionScore = (value: number): void =>
{
    MainSceneController.instance.gameData.scores.emotion = value;
}

export const setResponseScore = (value: number): void =>
{
    MainSceneController.instance.gameData.scores.response = value;
}
  
  
export default IGameData;
