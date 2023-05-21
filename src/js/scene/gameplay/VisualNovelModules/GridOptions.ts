import { FontAsset } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";

export class GridOptions extends Phaser.GameObjects.Group
{
    private options: GridSizer
    private option_A: ContainerLite;
    private options_B: ContainerLite;
    private options_C: ContainerLite;
    private options_D: ContainerLite;

    onOptionClicked : (index: number) => void;

    constructor(scene: Phaser.Scene, textBox: Image, onOptionClicked : (index: number) => void) {
        super(scene);

        this.onOptionClicked = onOptionClicked;

        this.options = new GridSizer(scene, textBox.gameobject.x, textBox.gameobject.y, textBox.gameobject.displayWidth, textBox.gameobject.displayHeight, 
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

        this.add(this.options);
    
        this.option_A = new ContainerLite(scene, 0, 0);
        this.createOption(scene, this.options, this.option_A, UIAsset.bg_text_box.key, "Option A");
    
        this.options_B = new ContainerLite(scene, 0, 0);
        this.createOption(scene, this.options, this.options_B, UIAsset.bg_text_box.key, "Option B");
    
        this.options_C = new ContainerLite(scene, 0, 0);
        this.createOption(scene, this.options, this.options_C, UIAsset.bg_text_box.key, "Option C");
    
        this.options_D = new ContainerLite(scene, 0, 0);
        this.createOption(scene, this.options, this.options_D, UIAsset.bg_text_box.key, "Option D");
    }

    private createOption(scene : Phaser.Scene,  grid : GridSizer, container: ContainerLite, assetKey : string, optionText : string) {
		const optionTextStyle = {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
        };
    
        // Create UI within container
		var bg = new Image(scene, 0, 0, assetKey).gameobject;
		var text = new Text(scene, 0, 0, optionText, optionTextStyle).gameobject;

        container.setInteractive({ useHandCursor: true });

		// Add UI to container
		container.add([bg, text]);

		// Add container to grid
		grid.add(container);
		grid.layout();

		// Set Item Position and Size based on layouted container
		text.setPosition(bg.x, bg.y);
		text.setOrigin(0.5);
        text.setWordWrapWidth(container.displayWidth - 20);

		bg.setDisplaySize(container.width, container.height);

	}
  
    public setOptionValue(optionIndex : number, optionValue : string) {
        var option = this.options.getChildren()[optionIndex] as ContainerLite;
        
        option.setVisible(optionValue.length > 0)

        if(optionValue.length < 1) return;

        option.removeAllListeners()

        // Set Interactive
        option.once("pointerdown", () => {
            this.onOptionClicked(optionIndex);
        });

        var optionValueObject = option.getChildren().find
        (
            (child : Phaser.GameObjects.GameObject) => (child as Phaser.GameObjects.Text).text != null
        ) as Phaser.GameObjects.Text;
  
		optionValueObject.setText(optionValue);

        this.HandleTextSize(optionValueObject, option);
    }

    private HandleTextSize(text: Phaser.GameObjects.Text, parentBox: ContainerLite)
	{
		var initialFontSize = 24;
		text.setFontSize(initialFontSize);

		// Check if the text overflows the parent box
		while (text.displayWidth > parentBox.displayWidth || text.displayHeight > parentBox.displayHeight) {
		// Reduce the font size
		initialFontSize -= 1;
	
		// Update the font size of the Text object
		text.setFontSize(initialFontSize);
		}
	
		// Center the Text object within the parent box
		text.setPosition(parentBox.x, parentBox.y);
	}
  }
  