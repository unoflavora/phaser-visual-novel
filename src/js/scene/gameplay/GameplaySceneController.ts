import GameplaySceneView 		from "./GameplaySceneView";
import AudioController 			from "Modules/AudioController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";
import Main from "../main";
import { gameData } from "Modules/GameData";
import { LanguageEnum } from "Definitions/Settings";
import EventBus, { GameEvents } from "Modules/GameEventBus";
import { EventHandler } from "Modules/helpers/TsHelper";

//TODO create Pause Controller
// import PauseController 			from "../../sceneModule/pause/PauseController";

export default class GameplaySceneController extends Phaser.Scene {
	
	// Modules
	audioController : AudioController;

	view! : GameplaySceneView;

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

		this.view = new GameplaySceneView(this);
		this.view.create();		
		this.view.registerOnPauseButtonClicked(() => this.onPauseButtonClicked());
		
		this.playEmotionalUnderstanding();
	}

	private playEmotionalUnderstanding() {

		var scenes: Scene[] = this.cache.json.get(GameplayAsset.story.key);
		var currentInteraction : EventHandler = () => {};
		this.eventKey = EventBus.instance.subscribe(GameEvents.settingsChanged, () => currentInteraction());

		//#region Scene State
		var currentSceneIndex : number = -1;
		var scene = scenes[currentSceneIndex];
		//#endregion

		goToNextScene.call(this);

		var playerHasAskedForResponse : boolean = false;

		this.view.on(this.view.events.OnIntroComplete, OnIntroComplete.bind(this));

		this.view.on(this.view.events.OnPlayerChooseAnswer, onPlayerChooseAnswer.bind(this));

		this.view.on(this.view.events.OnResponseFinished, goToNextScene.bind(this));			

		function OnIntroComplete(this : GameplaySceneController) {
			console.log("Scene Complete");

			if(scene.has_quest)
			{
				currentInteraction = () => this.view.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.emotions_en : scene.emotions_id);
				currentInteraction();
				return;
			}

			goToNextScene.call(this);
		}


		function onPlayerChooseAnswer(this : GameplaySceneController, optionIndex : number) {

			if (!playerHasAskedForResponse)
			{
				currentInteraction = () => this.view.AskPlayerForAnswer(gameData.settings.lang == LanguageEnum.English ? scene.response_en : scene.response_id);
				currentInteraction();

				playerHasAskedForResponse = true;
	
				return;
			}

			this.view.HideOptions();

			currentInteraction = () => this.view.ShowCharacterResponses(gameData.settings.lang == LanguageEnum.English 
				? scene.response_en_contexts[optionIndex]
				: scene.response_id_contexts[optionIndex]);

			currentInteraction();
		}
		

		function goToNextScene(this: GameplaySceneController)
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

            EventBus.instance.unsubscribe(GameEvents.settingsChanged, this.eventKey)


			console.log("Scenes Complete");
		}
	}

	private onPauseButtonClicked() {
		Main.instance.OpenPopup();
	}

}