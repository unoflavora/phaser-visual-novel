import MiniGameController from "./MinigameController";
import AudioController 			from "Modules/core/AudioController";
import VisualNovelController from "./Emotional Understanding/VisualNovelController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { MinigameTypes } from "Definitions/Minigame";
import MainSceneController from "Scenes/MainSceneController";
import { SceneState } from "Definitions/GameProgress";

export default class GameplaySceneController extends Phaser.Scene {
	
	// Modules
	audioController : AudioController;

	minigame! : MiniGameController;

	emotionalUnderstanding!: VisualNovelController;

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
		
		this.emotionalUnderstanding = new VisualNovelController(this);

		this.minigame = new MiniGameController(this);

		this.playedMinigames = MainSceneController.instance.gameData.progress.playedMinigames;	

		this.events.on(this.emotionalUnderstanding.onFinishNovel, this.onFinishEmotionalUnderstanding.bind(this));

		this.events.on(this.emotionalUnderstanding.onProgress, this.onNovelProgressing.bind(this));

		this.events.on(this.minigame.eventNames.onFinishMiniGame, this.onFinishMiniGame.bind(this));


		if(this.playedMinigames.length <= 2)
		{
			// the playedMinigames is an enum that is ordered by the order of the minigames
			this.minigame.loadMiniGame(this.playedMinigames.length);
		}
		else
		{
			this.emotionalUnderstanding.play(MainSceneController.instance.gameData.progress.emotionalUnderstanding);
		}
	}

	private onNovelProgressing(scene : Scene, state: SceneState, optionValue : string)
	{
		if (scene == null) return;

		MainSceneController.instance.progress.setProgress({
			currentSceneIndex : scene.scene, 
			currentSceneState : state,
			userEmotions : state == SceneState.AskResponse ?
				[...MainSceneController.instance.gameData.progress.emotionalUnderstanding.userEmotions, optionValue]
				: MainSceneController.instance.gameData.progress.emotionalUnderstanding.userEmotions,
			userResponses : state == SceneState.ResponseContext 
				? [...MainSceneController.instance.gameData.progress.emotionalUnderstanding.userResponses, optionValue]
				: MainSceneController.instance.gameData.progress.emotionalUnderstanding.userResponses,
			scores: MainSceneController.instance.gameData.progress.emotionalUnderstanding.scores
		})

	}


	private async onFinishEmotionalUnderstanding() {
		console.log("FINISHED NOVEL");

		console.log(MainSceneController.instance.gameData.progress.emotionalUnderstanding.scores);

		await MainSceneController.instance.FinishMinigames();
	}

	private onFinishMiniGame(minigameType : MinigameTypes) 
	{
		this.playedMinigames.push(minigameType);

		MainSceneController.instance.progress.setProgress(this.playedMinigames)

		switch(minigameType) {
			case MinigameTypes.MemoryOfSpades:
				this.minigame.loadMiniGame(MinigameTypes.PuzzleBlock);
				break;
			case MinigameTypes.PuzzleBlock:
				this.minigame.loadMiniGame(MinigameTypes.GuessTheWord);
				break;
			case MinigameTypes.GuessTheWord:
				this.emotionalUnderstanding.play();
				break;
		}
	}	
}