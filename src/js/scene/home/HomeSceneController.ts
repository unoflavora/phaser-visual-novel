import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import Main from "../Main";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import { PopupType } from "Scenes/popup/PopupController";


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
                this.scene.start(SceneInfo.gameplayScene.key);
            },        
            () => {
                // Open Log Game
            }, 
        
            () => {
                // Open Settings
                Main.instance.OpenPopup(PopupType.Settings);
            })

    }
    
    private onChangeLanguage() {
        this.view?.onLanguageChange();
    }

    unload()
    {

    }
}