import { gameData, setEmotionScore, setResponseScore } from "Modules/core/GameData";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import VisualNovelView from "./VisualNovelView";
import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import { EventHandler } from "Modules/helpers/TsHelper";
import { LanguageEnum } from "Definitions/Settings";
import GameplaySceneController from "../GameplaySceneController";
import AudioController from "Modules/core/AudioController";
import MainSceneController from "Scenes/MainSceneController";
import { PopupType } from "Scenes/popup/PopupController";

export default class VisualNovelController
{
    view : VisualNovelView;

	eventKey: string = ""

    parentScene: GameplaySceneController

    audioController : AudioController = AudioController.instance;

    public onFinishNovel : string = "VisualNovelIsFinished";
    
    constructor(scene : GameplaySceneController)
    {
        this.parentScene = scene;

        this.view = new VisualNovelView(scene);

        this.view.create();		
		
		this.view.setVisible(false);

        this.view.registerOnPauseButtonClicked(() => MainSceneController.instance.OpenPopup(PopupType.Settings));
        
    }

    public play() {
		this.view.setVisible(true);

		var scenes: Scene[] = this.parentScene.cache.json.get(GameplayAsset.story.key);
		var currentInteraction : EventHandler = () => {};
		this.eventKey = EventBus.instance.subscribe(GameEvents.languageChanged, () => currentInteraction());
		this.parentScene.scene.scene.events.on("shutdown", () => {
			console.log("Shutdown")
			EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);
		});

		//#region Scene State
		var currentSceneIndex : number = -1;
		var scene = scenes[currentSceneIndex];
		//#endregion

		goToNextScene.call(this);

		var playerHasAskedForResponse : boolean = false;

		this.view.on(this.view.events.OnIntroComplete, OnIntroComplete.bind(this));

		this.view.on(this.view.events.OnPlayerChooseAnswer, onPlayerChooseAnswer.bind(this));

		this.view.on(this.view.events.OnResponseFinished, goToNextScene.bind(this));			

		function OnIntroComplete(this : VisualNovelController) {
			console.log("Scene Complete");

			if(scene.has_quest)
			{
				currentInteraction = () => this.view.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id);
				currentInteraction();
				return;
			}

			goToNextScene.call(this);
		}


		function onPlayerChooseAnswer(this : VisualNovelController, optionIndex : number) {
			if (!playerHasAskedForResponse)
			{
				guessForEmotion.call(this, optionIndex);
				return;
			}

			showNpcResponse.call(this, optionIndex);
		}
		

		function showNpcResponse(this: VisualNovelController, optionIndex: number) {
			var score = gameData.settings.lang == LanguageEnum.English
				? scene.response_en[optionIndex].score
				: scene.response_id[optionIndex].score;

			setResponseScore(gameData.scores.response + score);

			this.view.HideOptions();

			currentInteraction = () => this.view.ShowCharacterResponses(gameData.settings.lang == LanguageEnum.English
				? scene.response_en_contexts[optionIndex]
				: scene.response_id_contexts[optionIndex]);

			currentInteraction();
		}

		function guessForEmotion(this: VisualNovelController, optionIndex: number) {
			var score = gameData.settings.lang == LanguageEnum.English
				? scene.emotions_en[optionIndex].score
				: scene.emotions_id[optionIndex].score;

			setEmotionScore(gameData.scores.emotion + score);

			currentInteraction = () => this.view.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id);

			currentInteraction();

			playerHasAskedForResponse = true;
		}

		function goToNextScene(this: VisualNovelController)
		{
			currentSceneIndex++;
			playerHasAskedForResponse = false;

			if(currentSceneIndex < scenes.length)
			{
				scene = scenes[currentSceneIndex]

				currentInteraction = () => this.view.LoadScene(scene, gameData.settings.lang == LanguageEnum.English ? scene.intro_en : scene.intro_id);
				currentInteraction();
				this.audioController.playBGM(scene.audio);
				return;
			}

            EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey)

            this.parentScene.events.emit(this.onFinishNovel)

		}

      
	}

}