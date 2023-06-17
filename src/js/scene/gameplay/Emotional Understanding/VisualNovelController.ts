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
import LoadingSceneView from "Scenes/loading/LoadingSceneView";
import { UIAsset } from "Assets/AssetLibraryUi";
import Localizations from "Modules/localization/LocalizationHelper";

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
		this.startDummyLoading();

		this.view.setVisible(true);

		var scenes: Scene[] = this.parentScene.cache.json.get(GameplayAsset.story.key);
		var currentInteraction : EventHandler = () => {};
		this.eventKey = EventBus.instance.subscribe(GameEvents.languageChanged, () => currentInteraction());

		this.parentScene.scene.scene.events.on("shutdown", () => {
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
					currentInteraction = () => {
						var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id;
						this.randomize(interaction);	
						this.view.showPrompt(Localizations.text.prompts.emotion)
						this.view.AskPlayerForAnswer(interaction);
					}
					currentInteraction();
					break;
				case SceneState.AskResponse:
					currentInteraction = () => {
						var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
						this.randomize(interaction);	
						this.view.showPrompt(Localizations.text.prompts.response)
						this.view.AskPlayerForAnswer(interaction)
					};
					currentInteraction();
					break;
				case SceneState.ResponseContext:
					this.view.HideOptions();

					var optionValue = progress.userResponses[progress.userResponses.length - 1];
					var responseData = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
					var optionIndex = responseData.findIndex(e => e.text == optionValue);

					var responseContexts = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en_contexts : scene.response_id_contexts;
					currentInteraction = () => this.view.ShowCharacterResponses(responseContexts[optionIndex]);

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
				currentInteraction = () => {
					var emotions = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id;
					this.view.showPrompt(Localizations.text.prompts.emotion)
					this.view.AskPlayerForAnswer(this.randomize(emotions))
				};
				
				currentInteraction();
				
				return;
			}

			goToNextScene.call(this);
		}

		function onPlayerChooseAnswer(this : VisualNovelController, optionValue : string) {
			console.log("user choosing this response: " + optionValue)

			if (!playerAskedForResponse)
			{
				// Submit scores and then emit progressing event MUST be in this order.
				// Otherwise score will not be saved.


				askForResponse.call(this, optionValue);

				this.parentScene.events.emit(this.onProgress, scene, SceneState.AskResponse, optionValue);

				return;
			}

			showNpcResponse.call(this, optionValue);
		}

		function askForResponse(this: VisualNovelController, optionValue: string) {
			var emotionData = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id;
			var optionIndex = emotionData.findIndex(e => e.text == optionValue);
			var score = emotionData[optionIndex].score;

			MainSceneController.instance.AddEmotionScore(score);

			currentInteraction = () => {
				var interaction = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
				this.view.showPrompt(Localizations.text.prompts.response)
				this.view.AskPlayerForAnswer(this.randomize(interaction));
			}
			currentInteraction();

			playerAskedForResponse = true;
		}

		function showNpcResponse(this: VisualNovelController, optionValue: string) {

			// Submit scores and then emit progressing event MUST be in this order.
			// Otherwise score will not be saved.
			var responseData = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id;
			var optionIndex = responseData.findIndex(e => e.text == optionValue);
			var score = responseData[optionIndex].score;

			var score = MainSceneController.instance.gameData.settings.lang == LanguageEnum.English
				? scene.response_en[optionIndex].score
				: scene.response_id[optionIndex].score;

			MainSceneController.instance.AddRespondScore(score)

			this.parentScene.events.emit(this.onProgress, scene, SceneState.ResponseContext, optionValue);

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

	private startDummyLoading() {
		var loading = new LoadingSceneView(this.parentScene, UIAsset.game_title.key, Localizations.text.loading.minigame);

		var loadingValue = 0;
		var s = setInterval(() => {
			loading.setLoadingValue(loadingValue);
			loadingValue += 0.1;

			if (loadingValue >= 1) {
				clearTimeout(s);
				loading.destroy();
			}
		}, 100);
	}

	private randomize(array : any[]) {
		var tempArray = [...array];

		for (var i = tempArray.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = tempArray[i];
			tempArray[i] = tempArray[j];
			tempArray[j] = temp;
		}

		return tempArray;
	}
	

}