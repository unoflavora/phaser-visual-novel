import { SceneInfo } from "Definitions/SceneInfo";
import GamelogSceneView from "./GamelogSceneView";
import { GameResults } from "Definitions/GameResults";
import AudioController from "Modules/core/AudioController";
import { AudioAsset } from "Assets/AssetLibraryAudio";
import MainSceneController from "Scenes/MainSceneController";

export default class GamelogSceneController extends Phaser.Scene
{
    view! : GamelogSceneView;
    results : GameResults[] = [];
    startIndex: number = 0;

    constructor()
    {
        super({key: SceneInfo.gamelogScene.key});
    }

    init()
    {
        console.log("GamelogSceneController init");

        this.view = new GamelogSceneView(this);

        this.view.create();

        this.view.registerOnNextBtnClicked(this.OnNextButtonClicked.bind(this));
        this.view.registerOnPrevBtnClicked(this.OnPrevButtonClicked.bind(this));
        this.view.registerOnBackBtnClicked(this.OnBackButtonClicked.bind(this));
        this.view.onChangeLanguage();
        this.results = [];

        for(var i = 0; i < 8; i++)
        {
            this.results.push({
                title: "Result " + i,
                score: Math.floor(Math.random() * 100),
                date: "01 February 2023",
                id: i
            });
        }

        this.startIndex = this.view.resultBoxes.length;

        this.view.updateResults(this.results);

        this.view.setActivePrevButton(false);
    }

    private OnNextButtonClicked()
    {
        this.view.setActiveNextButton(false);
        this.view.setActivePrevButton(true);
        AudioController.instance.play(AudioAsset.main_button_click.key);

        this.view.updateResults(this.results.slice(this.view.resultBoxes.length, this.results.length));
    }

    private OnPrevButtonClicked()
    {
        AudioController.instance.play(AudioAsset.main_button_click.key);
        this.view.setActiveNextButton(true);
        this.view.setActivePrevButton(false);

        this.view.updateResults(this.results.slice(0, this.view.resultBoxes.length));
    }

    private OnBackButtonClicked()
    {
        AudioController.instance.play(AudioAsset.main_button_click.key);
        this.scene.stop();
    }

}