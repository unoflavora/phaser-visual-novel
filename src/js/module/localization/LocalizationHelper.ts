import IGameData, {  gameData } from "Modules/core/GameData"
import EnglishText from "./language/EnglishText";
import IndonesianText from "./language/IndonesianText";
import { LanguageEnum } from "Definitions/Settings";

export default class Localizations 
{
    static get text()
    {        
        return gameData.settings.lang == LanguageEnum.English ? EnglishText : IndonesianText;
    }
    
}