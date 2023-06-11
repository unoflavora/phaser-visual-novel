import { setEmotionScore, setResponseScore } from "Modules/core/GameData";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import VisualNovelView from "./VisualNovelView";
import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import { EventHandler, assertUnreachable } from "Modules/helpers/TsHelper";
import { LanguageEnum } from "Definitions/Settings";
import GameplaySceneController from "../GameplaySceneController";
import AudioController from "Modules/core/AudioController";
import MainSceneController from "Scenes/MainSceneController";
import { PopupType } from "Scenes/popup/PopupController";
import { IEmotionalUnderstandingProgress, SceneState } from "Definitions/GameProgress";

export default class VisualNovelController
{
    view : VisualNovelView;

	eventKey: string = ""

    parentScene: GameplaySceneController

    audioController : AudioController = AudioController.instance;

    public onFinishNovel : string = "VisualNovelIsFinished";

	public onProgress : string = "OnSceneComplete";
    
    constructor(scene : GameplaySceneController)
    {
        this.parentScene = scene;

        this.view = new VisualNovelView(scene);

        this.view.create();		
		
		this.view.setVisible(false);

        this.view.registerOnPauseButtonClicked(() => MainSceneController.instance.OpenTemplatePopup(PopupType.Settings));
        
    }

    public play(progress : IEmotionalUnderstandingProgress | null = null) 
	{

		this.view.setVisible(true);

		var scenes: Scene[] = this.parentScene.cache.json.get(GameplayAsset.story.key);
		var currentInteraction : EventHandler = () => {};
		this.eventKey = EventBus.instance.subscribe(GameEvents.languageChanged, () => currentInteraction());

		this.parentScene.scene.scene.events.on("shutdown", () => {
			console.log("Shutdown")
			EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);
		});

		//#region Scene State
		var currentSceneIndex : number = progress?.currentSceneIndex ?? -1;
		var scene = scenes.find(s => s.scene == currentSceneIndex)!;

		console.log(scene, progress)

		startScene.call(this)

		var playerAskedForResponse : boolean = false;

		this.view.on(this.view.events.OnIntroComplete, onFinishIntro.bind(this));

		this.view.on(this.view.events.OnPlayerChooseAnswer, onPlayerChooseAnswer.bind(this));

		this.view.on(this.view.events.OnResponseFinished, goToNextScene.bind(this));			

		function startScene(this: VisualNovelController) {
			
			if(currentSceneIndex == -1)
			{
				currentSceneIndex = -2;

				goToNextScene.call(this);

				return;
			}

			this.view.ShowCharacter(scene.scene);

			this.view.SetBackground(scene.background);

			this.audioController.playBGM(scene.audio);	

			switch (progress?.currentSceneState) {
				case SceneState.Intro:
					currentInteraction = () => this.view.ShowIntroText(scene.background, MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.intro_en : scene.intro_id);
					currentInteraction();
					break;
				case SceneState.AskEmotion:
					var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id;
					this.shuffleArray(interaction);
					currentInteraction = () => this.view.AskPlayerForAnswer(interaction);
					currentInteraction();
					break;
				case SceneState.AskResponse:
					var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
					this.shuffleArray(interaction);
					currentInteraction = () => this.view.AskPlayerForAnswer(interaction);
					currentInteraction();
					break;
				case SceneState.ResponseContext:
					this.view.HideOptions();

					var optionIndex = progress.userResponses[progress.userResponses.length - 1];

					currentInteraction = () => this.view.ShowCharacterResponses(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English
						? scene.response_en_contexts[optionIndex]
						: scene.response_id_contexts[optionIndex]);

					currentInteraction();
					break;
				default:
					goToNextScene.call(this);
			}
		}

		function onFinishIntro(this : VisualNovelController) {
			if(scene.has_quest)
			{
				this.parentScene.events.emit(this.onProgress, scene, SceneState.AskEmotion);
				var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id;
				this.shuffleArray(interaction);
				currentInteraction = () => this.view.AskPlayerForAnswer(interaction);
				
				currentInteraction();
				
				return;
			}

			goToNextScene.call(this);
		}

		function onPlayerChooseAnswer(this : VisualNovelController, optionIndex : number) {
			if (!playerAskedForResponse)
			{
				this.parentScene.events.emit(this.onProgress, scene, SceneState.AskResponse);

				askForResponse.call(this, optionIndex);

				return;
			}

			showNpcResponse.call(this, optionIndex);
		}

		function askForResponse(this: VisualNovelController, optionIndex: number) {

			var score = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English
				? scene.emotions_en[optionIndex].score
				: scene.emotions_id[optionIndex].score;

			setEmotionScore(MainSceneController.instance.gameData.scores.emotion + score);
			var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
			this.shuffleArray(interaction);
			
			currentInteraction = () => this.view.AskPlayerForAnswer(interaction);
			currentInteraction();

			playerAskedForResponse = true;
		}

		function showNpcResponse(this: VisualNovelController, optionIndex: number) {

			this.parentScene.events.emit(this.onProgress, scene, SceneState.ResponseContext, optionIndex);

			var score = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English
				? scene.response_en[optionIndex].score
				: scene.response_id[optionIndex].score;

			setResponseScore(MainSceneController.instance.gameData.scores.response + score);

			this.view.HideOptions();

			currentInteraction = () => this.view.ShowCharacterResponses(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English
				? scene.response_en_contexts[optionIndex]
				: scene.response_id_contexts[optionIndex]);
			currentInteraction();
		}

		function goToNextScene(this: VisualNovelController)
		{
			currentSceneIndex++;
			playerAskedForResponse = false;

			// + 1 for tutorial scene
			if(currentSceneIndex < scenes.length - 1)
			{
				scene = scenes.find(s => s.scene == currentSceneIndex)!;

				if(currentSceneIndex > 0) this.parentScene.events.emit(this.onProgress, scene, SceneState.Intro);

				this.view.ShowCharacter(scene.scene);
		
				this.view.SetBackground(scene.background);

				this.audioController.playBGM(scene.audio);
		
				currentInteraction = () => this.view.ShowIntroText(scene.background, MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.intro_en : scene.intro_id);
				
				currentInteraction();
				
				return;
			}

            EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey)

            this.parentScene.events.emit(this.onFinishNovel)

		}

      
	}

	shuffleArray(array : any[]) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
	}
	

}