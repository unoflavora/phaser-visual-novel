import MainSceneController from "Scenes/MainSceneController";
import EnglishText from "./language/EnglishText";
import IndonesianText from "./language/IndonesianText";
import { LanguageEnum } from "Definitions/Settings";

export default class Localizations 
{
    static get text()
    {        
        return MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? EnglishText : IndonesianText;
    }
    
}