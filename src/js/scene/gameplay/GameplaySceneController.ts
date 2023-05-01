import GameplaySceneView 		from "./GameplaySceneView";
import AudioController 			from "Modules/AudioController";
import { SceneInfo } 			from "Definition/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";

//TODO create Pause Controller
// import PauseController 			from "../../sceneModule/pause/PauseController";

export default class GameplaySceneController extends Phaser.Scene {
	constructor() {
		super({ 
			key: SceneInfo.gameplayScene.key 
		});
	}	

	// Controllers
	audioController : AudioController | undefined;
	view : GameplaySceneView | undefined;

	beforeUnloadListener = (event : Event) => 
	{		
		event.preventDefault();
	};
	/**
	 * 
	 * @param {avatarData} avatarMainCharacter 
	 */
	init = () => 
	{		
		// widow beforeUnload listener
		window.addEventListener('beforeunload', this.beforeUnloadListener, {capture: true});

		this.audioController = AudioController.getInstance();

		// this.gameController = new GameController(this);
		// this.gameController.init(avatarMainCharacter);

		// this.visualNovelController = new VisualNovelController(this);
		// this.visualNovelController.init(story, avatarMainCharacter);
		// this.visualNovelController.setInteractiveListener(true);		

		// this.quizController = new QuizController(this);
		// this.quizController.init(story);
		// this.quizController.setInteractiveListener(false);

		// this.main = Main.getInstance();
		// this.main.popUpController.lostConnectionPopup.registerPopUpOpen(() => {
		// 	this.view.setInteractiveListener(false);
        //     this.visualNovelController.setInteractiveListener(false)
		// 	this.quizController.setInteractiveListener(false);
        // });

        // this.main.popUpController.lostConnectionPopup.registerPopUpClose(() => {
        //     this.main.popUpController.lostConnectionPopup.hide();
        //     new Promise((resolve) => {
        //         setTimeout(() => {
        //             if (this.main.popUpController.isOffline) {
        //                 this.main.popUpController.lostConnectionPopup.show();
        //             }
        //             else {                        
		// 				this.view.setInteractiveListener(true);
		// 				if (this.isQuiz) {
		// 					this.quizController.setInteractiveListener(true);
		// 				}
		// 				else {
		// 					this.visualNovelController.setInteractiveListener(true)
		// 				}
        //             }
        //         }, 200);
        //     });            
        // });

		// this.miniGameController = this.main.miniGameController;
		// this.miniGameController.init(this);

		// this.pauseController = new PauseController(this);
    // this.pauseController.init();

		this.view = new GameplaySceneView(this);
		this.view.create();		
	}
}