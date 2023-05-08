import GameData, { LanguageEnum } from "Modules/GameData"

import ILocalization from "./ILocalizationHelper"

import { englishText, indoText } from "./language/english";

export default class LocalizationHelper 
{
    static ui : ILocalization = GameData.settings.lang == LanguageEnum.English ? englishText : indoText;
}