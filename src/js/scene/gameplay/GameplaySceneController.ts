import GameplaySceneView 		from "./GameplaySceneView";
import AudioController 			from "Modules/AudioController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";

//TODO create Pause Controller
// import PauseController 			from "../../sceneModule/pause/PauseController";

export default class GameplaySceneController extends Phaser.Scene {
	// Modules
	audioController : AudioController;

	view! : GameplaySceneView;

	// State
	IsTyping : boolean = false;


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
		
		this.loadScene();
	}

	private loadScene() {
		var scenes: Scene[] = this.cache.json.get(GameplayAsset.story.key);

		//#region Scene State
		var currentSceneIndex : number = 0;

		var scene = scenes[currentSceneIndex];
		//#endregion

		//#region Response State
		var currentResponses : ResponseContext[] | null = null;

		var playerHasAskedForResponse : boolean = false;
		//#endregion

		this.view.LoadScene(scene);

		this.audioController.playBGM(scene.audio);

		this.view.on(this.view.events.OnIntroComplete, OnIntroComplete.bind(this));

		this.view.on(this.view.events.OnPlayerChooseAnswer, onPlayerChooseAnswer.bind(this));

		this.view.on(this.view.events.OnResponseFinished, goToNextScene.bind(this));			

		function OnIntroComplete(this : GameplaySceneController) {
			console.log("Scene Complete");

			if(scene.has_quest)
			{
				this.view.AskPlayerForAnswer(scene.emotions_en);
				return;
			}

			goToNextScene.call(this);
		}


		function onPlayerChooseAnswer(this : GameplaySceneController, optionIndex : number) {
			console.log("Asking Player Response");

			if (!playerHasAskedForResponse)
			{
				this.view.AskPlayerForAnswer(scene.response_en);
				playerHasAskedForResponse = true;
				return;
			}

			this.view.HideOptions();

			if(scene.response_en_contexts == null) {
				OnIntroComplete.call(this);
				return;
			};

			currentResponses = scene.response_en_contexts[optionIndex];

			this.view.ShowCharacterResponses(currentResponses);
		}
		

		function goToNextScene(this: GameplaySceneController)
		{
			currentSceneIndex++;
			playerHasAskedForResponse = false;
			currentResponses = null;

			if(currentSceneIndex < scenes.length)
			{
				scene = scenes[currentSceneIndex]
				this.view.LoadScene(scene);
				this.audioController.playBGM(scene.audio);
				return;
			}

			console.log("Scenes Complete");
		}
	}


}