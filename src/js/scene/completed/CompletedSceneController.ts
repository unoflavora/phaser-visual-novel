import { SceneInfo } from "Definitions/SceneInfo";
import CompletedSceneView from "./CompletedSceneView";
import MainSceneController from "Scenes/MainSceneController";

export default class CompleteSceneController extends Phaser.Scene
{
    view : CompletedSceneView;

    constructor()
    {
        super({key: SceneInfo.completedScene.key})
        this.view = new CompletedSceneView(this);
    }

    preload()
    {
        this.view.layout();
    }

    create()
    {  
        if(MainSceneController.instance.initData != null)
            this.view.SetUserNameText(MainSceneController.instance.initData.fullname)

        this.view.RegisterOnBackToHomeClicked(() => {
            this.scene.start(SceneInfo.homeScene.key);
        })

        this.view.RegisterOnSeeAdminPanelClicked(() => {
            window.open(CONFIG.RESULT_URL, "_blank")
        })
    }
}