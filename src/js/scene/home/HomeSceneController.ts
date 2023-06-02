import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import Main from "../main";
import EventBus, { GameEvents } from "Modules/GameEventBus";
import IGameData from "Modules/GameData";


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

        this.eventKey = EventBus.instance.subscribe(GameEvents.settingsChanged, this.onChangeLanguage.bind(this))

        this.view.initButton(() => 
            {
                EventBus.instance.unsubscribe(GameEvents.settingsChanged, this.eventKey)

                this.scene.start(SceneInfo.gameplayScene.key);

            },        
            () => {
                // Open Log Game
            }, 
        
            () => {
                // Open Settings
                Main.instance.OpenPopup();
            })

    }
    
    private onChangeLanguage() {
        this.view?.onLanguageChange();
    }

    unload()
    {

    }
}