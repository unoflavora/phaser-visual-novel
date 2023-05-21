import Image from "Modules/gameobjects/Image";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { StoryTextController } from "./VisualNovelModules/StoryTextController";
import { PlayerOptionsController } from "./VisualNovelModules/PlayerOptionsController";
import { CharacterDisplay, QuestRespond, StoryElement } from "Definitions/StoryInterface";
import CharacterController from "./VisualNovelModules/CharacterController";

export default class GameplaySceneView extends Phaser.GameObjects.Group 
{
	// UI Objects
	private sceneBg : Image;
	private textBox: Image;
	private storyText: StoryTextController;
	private storyOptions: PlayerOptionsController;
	private characterController: CharacterController;
	
	// Variables
	private eventKeys = {
		OnStoryComplete: "onStoryComplete",
		OnPlayerResponse: "onOptionClicked",
		OnCurrentDialogueFinished: "onInteractionComplete"
	}

	// Getter and Setters
	public get events()
	{
		return this.eventKeys;
	}

	constructor(scene : Phaser.Scene) {
		super(scene);
		scene.add.existing(this);
		
		this.sceneBg = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, BackgroundAsset.background_main.key);
		this.sceneBg.transform.setMinPreferredDisplaySize(scene.scale.width, scene.scale.height);

		this.characterController = new CharacterController(scene);

		this.textBox = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.85, UIAsset.bg_text_box.key)
		this.textBox.transform.setDisplayWidth(scene.scale.width * 0.9, true);

		this.storyText = new StoryTextController(scene, this.textBox, () => this.emit(this.eventKeys.OnStoryComplete));
		this.storyText.setVisible(false);

		this.storyOptions = new PlayerOptionsController(scene, this.textBox, (text) => this.emit(this.eventKeys.OnPlayerResponse, text));
		this.storyOptions.setVisible(false);

	}

	create = (depth = 0) => {
		this.setDepth(depth);
	};

	public LoadScene = (scene : StoryElement) => 
	{
		this.sceneBg.gameobject.setTexture("gameplay_bg_" + scene.id);

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);

		this.storyText.OnTextComplete = () => {
			this.emit(this.eventKeys.OnStoryComplete)
			this.characterController.FinishTween();
		};

		this.storyText.LoadText(scene.story);

		if(scene.required != null)
		{
			this.ShowCharacter(scene.required)
		}
	}

	public ShowInteractionText(text: string, monologue: boolean = false)
	{
		if (this.storyText.IsTyping) return;

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);

		this.storyText.OnTextComplete = () => {
			this.emit(this.eventKeys.OnCurrentDialogueFinished);
			this.characterController.FinishTween();
		}

		this.storyText.LoadText(text, monologue)
	}

	public AskPlayerForResponse(respond: QuestRespond) 
	{
		this.storyText.setVisible(false);

		this.storyOptions.setVisible(true);

		for(var i = 0; i < 4; i++)
		{
			try {
				this.storyOptions.setOptionValue(i, respond.options[i].context);
			} catch {
				this.storyOptions.setOptionValue(i, "");
			}
		}
	}

	public ShowCharacter(character: CharacterDisplay)
	{
		this.characterController.LoadCharacter(character);
	}

	public HideOptions()
	{
		this.storyOptions.setVisible(false);
	}	

}
