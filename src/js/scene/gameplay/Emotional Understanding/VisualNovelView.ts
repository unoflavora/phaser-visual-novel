import Image from "Modules/gameobjects/Image";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { StoryTextController } from "./Modules/StoryTextController";
import { PlayerOptionsController } from "./Modules/PlayerOptionsController";
import CharacterController from "./Modules/CharacterController";
import CharacterNamesController from "./Modules/CharacterNamesController";
import Button from "Modules/gameobjects/Button";
import { LanguageEnum } from "Definitions/Settings";
import { SceneState } from "Definitions/GameProgress";
import MainSceneController from "Scenes/MainSceneController";
import Text from "Modules/gameobjects/Text";
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import Localizations from "Modules/localization/LocalizationHelper";

export default class VisualNovelView extends Phaser.GameObjects.Group 
{
	

	// UI Objects
	private sceneBg : Image;
	private textBox: Image;
	private storyText: StoryTextController;
	private storyOptions: PlayerOptionsController;
	private characterController: CharacterController;
	private characterNames: CharacterNamesController;
	private pauseButton: Button;
	private prompt! : Phaser.GameObjects.Group;
	private promptText!: Text;
	
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
		this.add(this.sceneBg.gameobject)

		this.pauseButton = new Button(scene, scene.scale.width * 0.9, scene.scale.height * 0.1, UIAsset.icon_pause.key);
		this.pauseButton.transform.setDisplayWidth(scene.scale.width * 0.05, true)
		this.add(this.pauseButton.gameobject)

		this.characterController = new CharacterController(scene);
		this.characterController.getChildren().forEach(child => this.add(child));

		this.textBox = new Image(scene, scene.scale.width * 0.5, scene.scale.height, UIAsset.bg_story_box.key)	
		this.textBox.transform.setDisplayWidth(scene.scale.width * 0.9, true);
		this.textBox.gameobject.setPosition(scene.scale.width * .5, scene.scale.height - this.textBox.gameobject.displayHeight * .5)
		this.add(this.textBox.gameobject)

		this.characterNames = new CharacterNamesController(scene, this.textBox);

		this.storyText = new StoryTextController(scene, this.textBox, () => this.emit(this.eventKeys.OnIntroComplete));
		this.storyText.setVisible(false);

		this.storyOptions = new PlayerOptionsController(scene, this.textBox, (text) => this.emit(this.eventKeys.OnPlayerChooseAnswer, text));
		this.storyOptions.setVisible(false);

		this.setupPromptText(scene);



	}

	create = (depth = 0) => {
		this.setDepth(depth);
	};

	public ShowIntroText = (bgKey: string, intro: string[]) => 
	{
		this.storyText.setVisible(true);
		this.prompt.setVisible(false);

		this.storyOptions.setVisible(false);

		this.storyText.OnTextComplete = () => {
			this.emit(this.eventKeys.OnIntroComplete)
			this.characterController.FinishTween();
		};
		
		this.storyText.LoadText(intro);
	}


	public SetBackground(bgKey: string) {
		this.sceneBg.gameobject.setTexture(bgKey);
	}

	public ShowCharacter(sceneIndex: number) {
		if(sceneIndex == -1)
		{
			this.characterController.setVisible(false);
			return;
		}
		this.characterController.LoadCharacter(sceneIndex);
		this.characterNames.setVisible(false);
	}

	public ShowCharacterResponses(responses: ResponseContext[])
	{
		if (this.storyText.IsTyping) return;
		this.prompt.setVisible(false);

		var currentResponseIndex = 0;

		this.storyText.setVisible(true);

		this.storyOptions.setVisible(false);

		this.storyText.LoadText(responses[currentResponseIndex].text);

		this.characterNames.LoadCharacterName(responses[currentResponseIndex]);

		this.storyText.OnTextComplete = () => {
			currentResponseIndex++;

			if(currentResponseIndex < responses.length)
			{
				this.storyText.LoadText(responses[currentResponseIndex].text);

				this.characterNames.LoadCharacterName(responses[currentResponseIndex]);

				return;
			}

			this.emit(this.eventKeys.OnResponseFinished);

			this.characterController.FinishTween();
		}
	}

	public AskPlayerForAnswer(respond: StoryResponse[]) 
	{
		this.storyText.setVisible(false);

		this.storyOptions.setVisible(true);

		for(var i = 0; i < 4; i++)
		{
			try {
				this.storyOptions.setOptionValue(i, respond[i].text, respond[i].info);
			} catch {
				this.storyOptions.setOptionValue(i, "", null);
			}
		}
	}

	public showPrompt(text: string)
	{
		this.prompt.setVisible(true);

		this.promptText.gameobject.setText(text);
	}


	public HideOptions()
	{
		this.storyOptions.setVisible(false);
	}
	
	public registerOnPauseButtonClicked(callback : Function)
	{
		this.pauseButton.click.on(callback);
		this.scene.events.on("shutdown", () => {
			this.pauseButton.click.removeAllListeners();
		});
	}

	private setupPromptText(scene: Phaser.Scene) {
		var promptBox = new Image(scene, this.textBox.gameobject.x, this.textBox.gameobject.y - this.textBox.gameobject.displayHeight * .55, UIAsset.bg_story_options.key);
		promptBox.gameobject.setOrigin(0.5, 1);
		this.add(promptBox.gameobject);
		promptBox.transform.setDisplaySize(this.textBox.gameobject.displayWidth * .25, this.textBox.gameobject.displayHeight * .25)

		var promptText = new Text(scene, promptBox.gameobject.x, promptBox.gameobject.y - promptBox.gameobject.displayHeight * .5, "Ifuly", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			color: FontColors.darkBrown,
			align: "center",
			wordWrap: {
				width: promptBox.gameobject.displayWidth,
				useAdvancedWrap: true
			}
		});
		promptText.gameobject.setFontSize(promptBox.gameobject.displayHeight * .3);
		promptText.gameobject.setOrigin(0.5);
		this.promptText = promptText;
		this.add(promptText.gameobject);

		var prompt = new Phaser.GameObjects.Group(scene);
		prompt.add(promptBox.gameobject);
		prompt.add(promptText.gameobject);
		prompt.setVisible(false);
		this.prompt = prompt;
	}


}
