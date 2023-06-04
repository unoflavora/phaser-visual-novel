import SelectLanguageView from "./SelectLanguageView";
import AudioController from "Modules/core/AudioController";
import { SceneInfo } from "Definitions/SceneInfo";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import { LanguageEnum } from "Definitions/Settings";
import MainSceneController from "Scenes/MainSceneController";

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

        MainSceneController.instance.settings.setGameLanguage(language);
        
        if (localStorage.getItem("token") == null)
            this.scene.start(SceneInfo.loginScene.key);
        else
            this.scene.start(SceneInfo.homeScene.key);
    }
}