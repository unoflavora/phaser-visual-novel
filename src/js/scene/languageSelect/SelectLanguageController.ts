import SelectLanguageView from "./SelectLanguageView";
import AudioController from "Modules/AudioController";
import { SceneInfo } from "Definitions/SceneInfo";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import { LanguageEnum } from "Definitions/Settings";
import { gameData, setSettings } from "Modules/GameData";

export default class SelectLanguageController extends Phaser.Scene {

    // Controllers
    audioController : AudioController;

    view : SelectLanguageView | undefined;


    constructor() 
    {
        super({
            key: SceneInfo.languageSelectorScene.key      
        })

        this.audioController = AudioController.instance;

    }    

    async create() 
    {        
        this.view = new SelectLanguageView(this);

        this.view.create();
    
        this.view.registerOnLanguageClicked((lang) => this.SelectLanguage(lang))
    }

    private SelectLanguage(language : LanguageEnum) {
        this.audioController.play(AudioAsset.main_button_click.key);

        setSettings({...gameData["settings"], lang: language});
        
        this.scene.start(SceneInfo.loginScene.key);
    }
}