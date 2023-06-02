import Image from "Modules/gameobjects/Image";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { StoryTextController } from "./VisualNovelModules/StoryTextController";
import { PlayerOptionsController } from "./VisualNovelModules/PlayerOptionsController";
import CharacterController from "./VisualNovelModules/CharacterController";
import CharacterNamesController from "./VisualNovelModules/CharacterNamesController";
import Button from "Modules/gameobjects/Button";

export default class GameplaySceneView extends Phaser.GameObjects.Group 
{
	// UI Objects
	private sceneBg : Image;
	private textBox: Image;
	private storyText: StoryTextController;
	private storyOptions: PlayerOptionsController;
	private characterController: CharacterController;
	private characterNames: CharacterNamesController;
	private pauseButton: Button;
	
	// Variables
	private eventKeys = {
		OnIntroComplete: "onStoryComplete",
		OnPlayerChooseAnswer: "onOptionClicked",
		OnResponseFinished: "onResponseFinished"
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

		this.pauseButton = new Button(scene, scene.scale.width * 0.9, scene.scale.height * 0.1, UIAsset.icon_pause.key);
		this.pauseButton.transform.setDisplayWidth(scene.scale.width * 0.08, true)

		this.characterController = new CharacterController(scene);

		this.textBox = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.85, UIAsset.bg_text_box.key)
		this.textBox.transform.setDisplayWidth(scene.scale.width * 0.9, true);

		this.characterNames = new CharacterNamesController(scene);

		this.storyText = new StoryTextController(scene, this.textBox, () => this.emit(this.eventKeys.OnIntroComplete));
		this.storyText.setVisible(false);

		this.storyOptions = new PlayerOptionsController(scene, this.textBox, (text) => this.emit(this.eventKeys.OnPlayerChooseAnswer, text));
		this.storyOptions.setVisible(false);

	}

	create = (depth = 0) => {
		this.setDepth(depth);
	};

	public LoadScene = (scene : Scene) => 
	{
		this.sceneBg.gameobject.setTexture(scene.background);

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);
		

		this.storyText.OnTextComplete = () => {
			this.emit(this.eventKeys.OnIntroComplete)
			this.characterController.FinishTween();
		};

		console.log(scene)

		this.storyText.LoadText(scene.intro_en);

		if(scene.intro_character != null)
		{
			this.ShowCharacter(scene.intro_character)
		}
	}

	public ShowCharacterResponses(responses: ResponseContext[], monologue: boolean = false)
	{
		if (this.storyText.IsTyping) return;

		var currentResponseIndex = 0;

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);

		this.storyText.LoadText(responses[currentResponseIndex].text);

		this.characterController.LoadCharacter(responses[currentResponseIndex]);

		this.characterNames.LoadCharacterName(responses[currentResponseIndex]);

		this.storyText.OnTextComplete = () => {
			currentResponseIndex++;

			if(currentResponseIndex < responses.length)
			{
				this.storyText.LoadText(responses[currentResponseIndex].text);

				this.characterController.LoadCharacter(responses[currentResponseIndex]);

				this.characterNames.LoadCharacterName(responses[currentResponseIndex]);

				return;
			}

			this.emit(this.eventKeys.OnResponseFinished);

			this.characterController.FinishTween();
		}
	}

	public AskPlayerForAnswer(respond: Response[]) 
	{
		this.storyText.setVisible(false);

		this.storyOptions.setVisible(true);

		for(var i = 0; i < 4; i++)
		{
			try {
				this.storyOptions.setOptionValue(i, respond[i].text);
			} catch {
				this.storyOptions.setOptionValue(i, "");
			}
		}
	}

	public ShowCharacter(character: CharacterDisplay[])
	{
		for(var i = 0; i < character.length; i++)
		{
			this.characterController.LoadCharacter(character[i]);
		}
	}

	public HideOptions()
	{
		this.storyOptions.setVisible(false);
	}
	
	public registerOnPauseButtonClicked(callback : Function)
	{
		this.pauseButton.click.on(callback);
	}

}
