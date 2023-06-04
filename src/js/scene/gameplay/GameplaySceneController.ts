import MiniGameController from "./MinigameController";
import AudioController 			from "Modules/core/AudioController";
import VisualNovelController from "./Emotional Understanding/VisualNovelController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { gameData } from "Modules/core/GameData";
import { MinigameTypes } from "Definitions/Minigame";

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

		this.events.on(this.emotionalUnderstanding.onFinishNovel, this.onFinishEmotionalUnderstanding.bind(this));

		this.events.on(this.minigame.eventNames.onFinishMiniGame, this.onFinishMiniGame.bind(this));

		this.minigame.loadMiniGame(MinigameTypes.MemoryOfSpades);
	}


	private onFinishEmotionalUnderstanding() {
		console.log("FINISHED NOVEL");

		console.log(gameData.scores);

		console.log("Scenes Complete");
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
				this.emotionalUnderstanding.play();
				break;
		}
	}	
}