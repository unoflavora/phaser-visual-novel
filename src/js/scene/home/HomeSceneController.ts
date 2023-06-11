import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import { PopupType } from "Scenes/popup/PopupController";
import MainSceneController from "Scenes/MainSceneController";
import AudioController from "Modules/core/AudioController";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import { UIAsset } from "Assets/AssetLibraryUi";
import Localizations from "Modules/localization/LocalizationHelper";


export default class HomeSceneController extends Phaser.Scene {

    view! : HomeSceneView | undefined
    eventKey : string = "";

    constructor() {
        super({
            key: SceneInfo.homeScene.key,
        });
    }

    init()
    {
        this.view = new HomeSceneView(this);
        this.view.create();

        this.eventKey = EventBus.instance.subscribe(GameEvents.languageChanged, this.onChangeLanguage.bind(this))
        this.scene.scene.events.on("shutdown", () => {
			console.log("Shutdown")
			EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);
		});

        this.view.initButton(() => 
            {
                // Start Game
                AudioController.instance.play(AudioAsset.main_button_click.key);
                if(MainSceneController.instance.initData.hasPlayed)
                {
                    MainSceneController.instance.OpenInfoPopup(
                        Localizations.text.errors.assesment_taken.title, 
                        Localizations.text.errors.assesment_taken.desc, 
                        UIAsset.icon_warning.key, 
                        () => {}, 
                        Localizations.text.interactions.close);
                    return;
                }
                this.scene.start(SceneInfo.gameplayScene.key);
            },        
            () => {
                // Open Gamelog
                if(MainSceneController.instance.initData.hasPlayed)
                {
                    MainSceneController.instance.OpenInfoPopup(
                        Localizations.text.errors.not_taken_assesment.title, 
                        Localizations.text.errors.not_taken_assesment.desc, 
                        UIAsset.icon_warning.key, () => {}, 
                        Localizations.text.interactions.close);
                    return;
                }
                AudioController.instance.play(AudioAsset.main_button_click.key);
                this.scene.launch(SceneInfo.gamelogScene.key);
            }, 
        
            () => {
                // Open Settings
                AudioController.instance.play(AudioAsset.main_button_click.key);
                MainSceneController.instance.OpenTemplatePopup(PopupType.Settings);
            })

    }
    
    private onChangeLanguage() {
        this.view?.onLanguageChange();
    }

    unload()
    {

    }
}