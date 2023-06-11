import { SceneInfo } from "Definitions/SceneInfo";
import ResultSceneView, { ResultState } from "./ResultSceneView";

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

        this.view.RegisterOnCompareBtnClick(this.OnCompareButtonClicked.bind(this));

        this.view.RegisterOnSeeDetailsBtnClick(this.OnSeeDetailsButtonClicked.bind(this));

        this.view.RegisterOnBackToHomeBtnClick(this.OnBackToHomeButtonClicked.bind(this));

        this.view.create();

    }

    OnCompareButtonClicked()
    {
        this.view.SetState(ResultState.Compare);
        this.view.SetOnbackButtonClicked(() => this.view.SetState(ResultState.Overview));
    }

 
    OnSeeDetailsButtonClicked()
    {
        this.view.SetState(ResultState.Details);
        this.view.SetOnbackButtonClicked(() => this.view.SetState(ResultState.Overview));
    }

    OnBackToHomeButtonClicked()
    {
        this.scene.start(SceneInfo.homeScene.key);
    }
}