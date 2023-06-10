import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import { PopupType } from "Scenes/popup/PopupController";
import MainSceneController from "Scenes/MainSceneController";
import AudioController from "Modules/core/AudioController";
import { AudioAsset } from "Assets/AssetLibraryAudio";


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
                this.scene.start(SceneInfo.gameplayScene.key);
            },        
            () => {
                // Open Gamelog
                AudioController.instance.play(AudioAsset.main_button_click.key);
                this.scene.launch(SceneInfo.gamelogScene.key);
            }, 
        
            () => {
                // Open Settings
                AudioController.instance.play(AudioAsset.main_button_click.key);
                MainSceneController.instance.OpenPopup(PopupType.Settings);
            })

    }
    
    private onChangeLanguage() {
        this.view?.onLanguageChange();
    }

    unload()
    {

    }
}