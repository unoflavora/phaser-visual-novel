import VisualNovelView 		from "./Visual Novel/VisualNovelView";
import AudioController 			from "Modules/core/AudioController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";
import { gameData, setEmotionScore, setResponseScore } from "Modules/core/GameData";
import { LanguageEnum } from "Definitions/Settings";
import EventBus, { GameEvents } from "Modules/core/GameEventBus";
import { EventHandler } from "Modules/helpers/TsHelper";
import { PopupType } from "Scenes/popup/PopupController";
import MainSceneController from "Scenes/MainSceneController";
import MiniGameController from "./MinigameController";
import { MinigameTypes } from "Definitions/Minigame";

export default class GameplaySceneController extends Phaser.Scene {
	
	// Modules
	audioController : AudioController;

	emotionalUnderstanding! : VisualNovelView;

	minigame! : MiniGameController;

	playedMinigames : MinigameTypes[] = [];

	// State
	IsTyping : boolean = false;

	eventKey: string = ""

	constructor() {
		super({ 
			key: SceneInfo.gameplayScene.key 
		});

		this.audioController = AudioController.instance;

	}	

	beforeUnloadListener = (event : Event) => 
	{		
		event.preventDefault();
	};
	
	init = async () => 
	{		
		window.addEventListener('beforeunload', this.beforeUnloadListener, {capture: true})

		this.emotionalUnderstanding = new VisualNovelView(this);
		this.emotionalUnderstanding.create();		
		this.emotionalUnderstanding.registerOnPauseButtonClicked(() => this.onPauseButtonClicked());
		this.emotionalUnderstanding.setVisible(false);

		this.minigame = new MiniGameController(this);
		this.minigame.registerOnFinishMiniGame(this.onFinishMiniGame.bind(this));
		this.minigame.loadMiniGame(MinigameTypes.MemoryOfSpades);
	}

	private playEmotionalUnderstanding() {
		this.emotionalUnderstanding.setVisible(true);

		var scenes: Scene[] = this.cache.json.get(GameplayAsset.story.key);
		var currentInteraction : EventHandler = () => {};
		this.eventKey = EventBus.instance.subscribe(GameEvents.languageChanged, () => currentInteraction());
		this.scene.scene.events.on("shutdown", () => {
			console.log("Shutdown")
			EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey);
		});

		//#region Scene State
		var currentSceneIndex : number = -1;
		var scene = scenes[currentSceneIndex];
		//#endregion

		goToNextScene.call(this);

		var playerHasAskedForResponse : boolean = false;

		this.emotionalUnderstanding.on(this.emotionalUnderstanding.events.OnIntroComplete, OnIntroComplete.bind(this));

		this.emotionalUnderstanding.on(this.emotionalUnderstanding.events.OnPlayerChooseAnswer, onPlayerChooseAnswer.bind(this));

		this.emotionalUnderstanding.on(this.emotionalUnderstanding.events.OnResponseFinished, goToNextScene.bind(this));			

		function OnIntroComplete(this : GameplaySceneController) {
			console.log("Scene Complete");

			if(scene.has_quest)
			{
				currentInteraction = () => this.emotionalUnderstanding.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id);
				currentInteraction();
				return;
			}

			goToNextScene.call(this);
		}


		function onPlayerChooseAnswer(this : GameplaySceneController, optionIndex : number) {
			if (!playerHasAskedForResponse)
			{
				guessForEmotion.call(this, optionIndex);
				return;
			}

			showNpcResponse.call(this, optionIndex);
		}
		

		function showNpcResponse(this: GameplaySceneController, optionIndex: number) {
			var score = gameData.settings.lang == LanguageEnum.English
				? scene.response_en[optionIndex].score
				: scene.response_id[optionIndex].score;

			setResponseScore(gameData.scores.response + score);

			this.emotionalUnderstanding.HideOptions();

			currentInteraction = () => this.emotionalUnderstanding.ShowCharacterResponses(gameData.settings.lang == LanguageEnum.English
				? scene.response_en_contexts[optionIndex]
				: scene.response_id_contexts[optionIndex]);

			currentInteraction();
		}

		function guessForEmotion(this: GameplaySceneController, optionIndex: number) {
			var score = gameData.settings.lang == LanguageEnum.English
				? scene.emotions_en[optionIndex].score
				: scene.emotions_id[optionIndex].score;

			setEmotionScore(gameData.scores.emotion + score);

			currentInteraction = () => this.emotionalUnderstanding.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id);

			currentInteraction();

			playerHasAskedForResponse = true;
		}

		function goToNextScene(this: GameplaySceneController)
		{
			currentSceneIndex++;
			playerHasAskedForResponse = false;

			if(currentSceneIndex < scenes.length)
			{
				scene = scenes[currentSceneIndex]

				currentInteraction = () => this.emotionalUnderstanding.LoadScene(scene, gameData.settings.lang == LanguageEnum.English ? scene.intro_en : scene.intro_id);
				currentInteraction();
				this.audioController.playBGM(scene.audio);
				return;
			}

            EventBus.instance.unsubscribe(GameEvents.languageChanged, this.eventKey)
			console.log(gameData.scores);
			console.log("Scenes Complete");
		}
	}

	private onPauseButtonClicked() {
		MainSceneController.instance.OpenPopup(PopupType.Settings);
	}

	private onFinishMiniGame(minigameType : MinigameTypes) 
	{
		this.playedMinigames.push(minigameType);

		switch(minigameType) {
			case MinigameTypes.MemoryOfSpades:
				this.minigame.loadMiniGame(MinigameTypes.PuzzleBlock);
				break;
			case MinigameTypes.PuzzleBlock:
				this.minigame.loadMiniGame(MinigameTypes.GuessTheWord);
				break;
			case MinigameTypes.GuessTheWord:
				this.playEmotionalUnderstanding();
				break;
		}
	}	
}