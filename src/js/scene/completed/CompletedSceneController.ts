import { SceneInfo } from "Definitions/SceneInfo";
import CompletedSceneView from "./CompletedSceneView";

export default class CompleteSceneController extends Phaser.Scene
{
    view : CompletedSceneView;

    constructor()
    {
        super({key: SceneInfo.completedScene.key})
        this.view = new CompletedSceneView(this);
    }

    init()
    {
        this.view.create();
    }
}