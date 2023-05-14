import { SceneInfo }            from "Definitions/SceneInfo";
import HomeSceneView            from "./HomeSceneView";


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
    }
}