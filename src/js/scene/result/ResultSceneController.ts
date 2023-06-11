import { SceneInfo } from "Definitions/SceneInfo";
import ResultSceneView from "./ResultSceneView";

export default class ResultSceneController extends Phaser.Scene
{
    view! : ResultSceneView
    
    constructor()
    {
        super({key: SceneInfo.resultScene.key});
    }

    init()
    {
        this.view = new ResultSceneView(this);

        this.view.create();

        this.view.registerOnCompareBtnClick(this.OnCompareButtonClicked.bind(this));
    }

    OnCompareButtonClicked()
    {
        this.view.compareResult(true);
        this.view.setOnBackBtnClick(() => this.view.compareResult(false));
    }
}