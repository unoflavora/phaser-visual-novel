import GameData, { LanguageEnum } from "Modules/GameData"
import EnglishText from "./language/EnglishText";
import IndonesianText from "./language/IndonesianText";

export default class Localizations 
{
    static get text()
    {        
        return GameData.settings.lang == LanguageEnum.English ? EnglishText : IndonesianText;
    }
    
}