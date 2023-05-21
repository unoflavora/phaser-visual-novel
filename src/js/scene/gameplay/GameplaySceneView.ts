import Image from "Modules/gameobjects/Image";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { TextBox } from "./VisualNovelModules/TextBox";
import { GridOptions } from "./VisualNovelModules/GridOptions";
import { QuestRespond, StoryElement } from "Definitions/StoryInterface";

export default class GameplaySceneView extends Phaser.GameObjects.Group 
{
	// UI Objects
	private sceneBg : Image;
	private textBox: Image;
	private storyText: TextBox;
	private storyOptions: GridOptions;
	
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

		this.textBox = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.85, UIAsset.bg_text_box.key)
		this.textBox.transform.setDisplayWidth(scene.scale.width * 0.9, true);

		this.storyText = new TextBox(scene, this.textBox, () => this.emit(this.eventKeys.OnStoryComplete));
		this.storyText.setVisible(false);

		this.storyOptions = new GridOptions(scene, this.textBox, (text) => this.emit(this.eventKeys.OnPlayerResponse, text));
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

		this.storyText.OnTextComplete = () => this.emit(this.eventKeys.OnStoryComplete);

		this.storyText.LoadText(scene.story);
	}

	public ShowInteractionText(text: string, monologue: boolean = false)
	{
		if (this.storyText.IsTyping) return;

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);

		this.storyText.OnTextComplete = () => this.emit(this.eventKeys.OnCurrentDialogueFinished);

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

	public HideOptions()
	{
		this.storyOptions.setVisible(false);
	}	

}
