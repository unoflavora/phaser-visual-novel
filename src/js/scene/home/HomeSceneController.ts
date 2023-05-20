import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";
import Main from "../main";


export default class HomeSceneController extends Phaser.Scene {

    view! : HomeSceneView | undefined

    constructor() {
        super({
            key: SceneInfo.homeScene.key,
        });
    }

    init()
    {
        this.view = new HomeSceneView(this);
        this.view.create();
        this.view.initButton(() => {

            // Load Visual Novel
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
}