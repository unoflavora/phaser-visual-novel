import GameplaySceneView 		from "./GameplaySceneView";
import AudioController 			from "Modules/AudioController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";
import Story from "Definitions/StoryType";

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
	view! : GameplaySceneView;

	// State
	IsTyping : boolean = false;

	beforeUnloadListener = (event : Event) => 
	{		
		event.preventDefault();
	};
	
	init = () => 
	{		
		window.addEventListener('beforeunload', this.beforeUnloadListener, {capture: true});

		this.audioController = AudioController.getInstance();

		this.view = new GameplaySceneView(this);
		this.view.create();		
		
		this.loadScene();
	}

	private loadScene() {
		var data: Story = this.cache.json.get(GameplayAsset.story.key);
		var currentSceneIndex = 0;
		var scene = data[currentSceneIndex];

		this.view.LoadScene(scene);

		this.view.on(this.view.events.OnCurrentTextComplete, () => {
			console.log("Scene Complete")

			if(scene.questRespond != null)
			{
				console.log("Quest Respond");
				return;
			}

			currentSceneIndex++;
				
			if(currentSceneIndex >= data.length)
			{
				console.log("Story Complete");
			}
			else
			{
				scene = data[currentSceneIndex]
				this.view.LoadScene(scene);
			}
		});
	}


}