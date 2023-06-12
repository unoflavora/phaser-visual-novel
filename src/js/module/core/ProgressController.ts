import IGameProgress from "Definitions/GameProgress";
import MainSceneController from "Scenes/MainSceneController";

export default class ProgressController 
{
    constructor() {}

    public setProgress(value : IGameProgress[keyof IGameProgress]) 
    {
        if(value == null) return;

        if("currentSceneIndex" in value) 
        {
            MainSceneController.instance.gameData.progress.emotionalUnderstanding = value;
        }

        else if(Array.isArray(value))
        {
            MainSceneController.instance.gameData.progress.playedMinigames = value;
        }

        MainSceneController.instance.SaveGameData();
    }
}