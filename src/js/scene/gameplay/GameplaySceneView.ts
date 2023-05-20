import { FontAsset } from "Assets/AssetLibraryFont";
import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import { StoryScene } from "Definitions/StoryType";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import { Events } from "phaser";
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

export default class GameplaySceneView extends Phaser.GameObjects.Group 
{
	// UI Objects
	private sceneBg : Image;
	private nextButton: Text;
	private textBox: Image;
	private text: Text;
	
	// *Region Options
	private options: GridSizer
	private option_A : ContainerLite;
	private options_B : ContainerLite;
	private options_C : ContainerLite;
	private options_D : ContainerLite;

	private optionTextStyle = {
		fontFamily: FontAsset.adobe_caslon_pro_bold.key,
		fontSize: "24px",
		color: "#ffffff",
		align: "center"
	};
	// *endregion

	// Variables
	private padding: number = 10;
	private eventKeys = {
		OnCurrentTextComplete: "onCurrentTextComplete",
		OnOptionClicked: "onOptionClicked"
	}

	// Getter and Setters
	public get events()
	{
		return this.eventKeys;
	}

	private set nextButtonVisible(value: boolean)
	{
		this.nextButton.gameobject.visible = value;
	}

	constructor(scene : Phaser.Scene) {
		super(scene);
		scene.add.existing(this);
		this.padding = scene.scale.width * 0.015;
		
		this.sceneBg = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, BackgroundAsset.background_main.key);
		this.sceneBg.transform.setMinPreferredDisplaySize(scene.scale.width, scene.scale.height);	

		this.textBox = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.85, UIAsset.bg_text_box.key)
		this.textBox.transform.setDisplayWidth(scene.scale.width * 0.9, true);

		this.text = new Text(scene, 
			this.textBox.gameobject.x - this.textBox.gameobject.displayWidth * this.textBox.gameobject.originX + this.padding, 
			this.textBox.gameobject.y - this.textBox.gameobject.displayHeight * this.textBox.gameobject.originY + this.padding, 
			"Loading...", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: "#ffffff",
			wordWrap: {
				width: this.textBox.gameobject.displayWidth - 20,
				useAdvancedWrap: true
			}
		});

		this.nextButton = new Text(scene, 
			this.textBox.gameobject.x + this.textBox.gameobject.displayWidth * this.textBox.gameobject.originX - 10, 
			this.textBox.gameobject.y + this.textBox.gameobject.displayHeight * this.textBox.gameobject.originY - 10, "Next", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: "#ffffff",
			align: "right"
		});
		this.nextButton.gameobject.setOrigin(1);
		this.nextButton.gameobject.setInteractive({ useHandCursor: true });

		this.options = new GridSizer(scene, this.textBox.gameobject.x, this.textBox.gameobject.y, this.textBox.gameobject.displayWidth, this.textBox.gameobject.displayHeight, 
			{
				column: 2,
				row: 2,
				columnProportions: 1,
				rowProportions: 1,
				space: {
					left: 10,
					right: 10,
					top: 10,
					bottom: 10,
					column: 10,
					row: 10,
				},
				align: "center",
				expand: true
			});

		this.option_A = new ContainerLite(scene, 0, 0);
		this.createOption(scene, this.options, this.option_A, UIAsset.bg_text_box.key, "Option A");

		this.options_B = new ContainerLite(scene, 0, 0);
		this.createOption(scene, this.options, this.options_B, UIAsset.bg_text_box.key, "Option B");

		this.options_C = new ContainerLite(scene, 0, 0);
		this.createOption(scene, this.options, this.options_C, UIAsset.bg_text_box.key, "Option C");

		this.options_D = new ContainerLite(scene, 0, 0);
		this.createOption(scene, this.options, this.options_D, UIAsset.bg_text_box.key, "Option D");		
	}

	create = (depth = 0) => {
		this.setDepth(depth);

	};

	public LoadScene = (scene : StoryScene) => 
	{
		console.log(scene.id)
		this.sceneBg.gameobject.setTexture("gameplay_bg_" + scene.id);

		this.nextButton.gameobject.removeAllListeners();

		this.LoadText(scene.story);
	}

	public LoadText(text: string, paragraphIndex: number = 0) {

		this.nextButton.gameobject.once("pointerdown", () => {
			paragraphIndex++
			this.LoadText(text, paragraphIndex);
		});

		var paragraphs = text.split("\n\n");  // Split paragraphs
		if (paragraphIndex < paragraphs.length) 
		{
			this.Type(paragraphs[paragraphIndex]);
		}
		else 
		{
			this.nextButtonVisible = false;
			console.log("Text Complete")
			this.emit(this.events.OnCurrentTextComplete);
		}
	}

	private Type = (textToType : string): void => 
	{
		this.text.gameobject.setText("");
		this.nextButtonVisible = false;

		var i = 0;
		var typingEffect = setInterval(() => 
		{
			this.text.gameobject.text += textToType[i];
			i += 1;
			if (i >= textToType.length) {
				clearInterval(typingEffect);
				this.nextButtonVisible = true;
			}
		}, 20)		
	}

	createOption(scene : Phaser.Scene,  grid : GridSizer, container: ContainerLite, assetKey : string, optionText : string) {
		// Create UI within container
		var bg = new Image(scene, 0, 0, assetKey).gameobject;
		var text = new Text(scene, 0, 0, optionText, this.optionTextStyle).gameobject;

		// Add UI to container
		container.add([bg, text]);

		// Set Interactive
		container.getChildren().forEach((child) => {	
			child.setInteractive({ useHandCursor: true });
			child.on("pointerdown", () => {
				this.emit(this.events.OnOptionClicked, optionText)
			});
		});

		// Add container to grid
		grid.add(container);
		grid.layout();

		// Set Item Position and Size based on layouted container
		text.setPosition(bg.x, bg.y);
		text.setOrigin(0.5);
		bg.setDisplaySize(container.width, container.height);
	}

	setOption(optionIndex : number, optionText : string) {
		var option = this.options.getChildren()[optionIndex] as ContainerLite;

		option.setVisible(optionText != null)

		if(optionText != null)
		{
			var optionValue = option.getChildren().find
			(
				(child) => (child as Phaser.GameObjects.Text).text != null
			) as Phaser.GameObjects.Text;

			optionValue.setText(optionText);
		}
	}
	  
}
