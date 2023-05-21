import GameplaySceneView 		from "./GameplaySceneView";
import AudioController 			from "Modules/AudioController";
import { SceneInfo } 			from "Definitions/SceneInfo";
import { GameplayAsset } 		from "Assets/AssetLibraryGameplay";
import { AudioAsset } 			from "Assets/AssetLibraryAudio";
import { DialogueResponse, MonologueResponse, Story } from "Definitions/StoryInterface";

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

		var currentSceneIndex : number = 0;

		var currentResponses : (MonologueResponse | DialogueResponse)[] | null = null;

		var currentPostInteractionIndex : number = -1;

		var scene = data[currentSceneIndex];

		this.view.LoadScene(scene);

		this.view.on(this.view.events.OnStoryComplete, onStoryComplete.bind(this));

		this.view.on(this.view.events.OnPlayerResponse, onPlayerResponse.bind(this));

		this.view.on(this.view.events.OnCurrentDialogueFinished, onInteractionDialogue.bind(this));			

		function onStoryComplete(this : GameplaySceneController) {
			console.log("Story Complete");

			if(scene.questRespond != null && currentResponses == null)
			{
				this.view.AskPlayerForResponse(scene.questRespond);
				return;
			}

			currentSceneIndex++;

			if(currentSceneIndex < data.length)
			{
				console.log("Story Complete");

				scene = data[currentSceneIndex]
				this.view.LoadScene(scene);
				return;
			}

			console.log("Scenes Complete");

		}


		function onPlayerResponse(this : GameplaySceneController, optionIndex : number) {
			console.log("Asking Player Response");

			this.view.HideOptions();

			if(scene.questRespond == null) {
				onStoryComplete.call(this);
				return;
			};

			currentResponses = scene.questRespond.options[optionIndex].response;
			
			onInteractionDialogue.call(this);			
		}
		
		function onInteractionDialogue(this: GameplaySceneController) 
		{
			if(currentResponses == null) return;
			
			console.log("Interaction Ongoing");
			
			currentPostInteractionIndex++;

			if(currentPostInteractionIndex >= currentResponses.length)
			{
				console.log("Interaction Finished");

				onStoryComplete.call(this);

				currentResponses = null;

				currentPostInteractionIndex = -1;
				return;
			}

			console.log(currentResponses[currentPostInteractionIndex])

			if (currentResponses[currentPostInteractionIndex].monologue != null)
			{
				this.view.ShowInteractionText(currentResponses[currentPostInteractionIndex].monologue, true);
				this.view.ShowCharacter(currentResponses[currentPostInteractionIndex]);
			}
			else
			{
				this.view.ShowInteractionText(currentResponses[currentPostInteractionIndex].dialogue);
				this.view.ShowCharacter(currentResponses[currentPostInteractionIndex]);
			}
		}
	}


}