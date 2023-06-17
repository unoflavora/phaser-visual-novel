import { AudioAsset } from "Assets/AssetLibraryAudio";
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import AudioController from "Modules/core/AudioController";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite";
import GridSizer from "phaser3-rex-plugins/templates/ui/gridsizer/GridSizer";
import "Modules/extensions/text_sizer";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";

export class PlayerOptionsController extends Phaser.GameObjects.Group
{
    private options: GridSizer
    private optionData : optionData[] = [];

    onOptionClicked : (optionValue : string) => void;

    constructor(scene: Phaser.Scene, textBox: Image, onOptionClicked : (optionValue: string) => void) {
        super(scene);

        this.onOptionClicked = (index) => 
        {
            AudioController.instance.play(AudioAsset.main_button_click.key);
            onOptionClicked(index)
        };

        var spacing = textBox.gameobject.displayWidth * .05;
        this.options = new GridSizer(scene, textBox.gameobject.x, textBox.gameobject.y, textBox.gameobject.displayWidth, textBox.gameobject.displayHeight, 
        {
            column: 2,
            row: 2,
            columnProportions: 1,
            rowProportions: 1,
            space: {
            left: spacing * 2,
            right: spacing * 2,
            top: spacing * .5,
            bottom: spacing * .5,
            column: spacing * 2,
            row: spacing * .2,
            },
        });
        

        this.add(this.options);
        this.generateOptions();
    
    }

    private generateOptions()
    {
        var index = ["A", "B", "C", "D"]

        for(var i = 0; i < index.length; i++)
        {
            var option = new ContainerLite(this.scene, 0, 0);
            var optionData = this.createOption(this.scene, this.options, option, "Option " + index[i]);

            this.optionData.push(optionData);
        }

        this.options.layout();

    }

    private createOption(scene : Phaser.Scene,  grid : GridSizer, container: ContainerLite, optionText : string) {
		const optionTextStyle = {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: container.displayHeight * .05,
            color: FontColors.darkBrown,
            align: "center",
        };
    
        // Create UI within container
		var bg = new Image(scene, 0, 0, UIAsset.bg_story_options.key);
		var text = new Text(scene, 0, 0, optionText, optionTextStyle);

        bg.gameobject.setInteractive({ useHandCursor: true });

		// Add UI to container
		container.add([bg.gameobject, text.gameobject]);

		// Add container to grid
		grid.add(container, {
            align: "center",
            expand: true,
        });
        
		// Set Item Position and Size based on layouted container
		text.gameobject.setPosition(bg.gameobject.x, bg.gameobject.y);
		text.gameobject.setOrigin(0.5);
		bg.gameobject.setDisplaySize(container.width, container.height);

        var optionData : optionData = {
            container : container,
            image : bg,
            text : text
        }

        return optionData;
	}
  
    public setOptionValue(optionIndex : number, optionValue : string) {
        var option = this.optionData[optionIndex];
        
        option.container.setVisible(optionValue.length > 0)

        if(optionValue.length < 1) return;

        var optionValueObject = option.text;
        var optionBg = option.image

  
		optionValueObject.gameobject.setText(optionValue);

        optionBg.transform.setDisplaySize(option.container.displayWidth, option.container.displayHeight)
        optionBg.gameobject.removeAllListeners()

        // Set Interactive
        optionBg.gameobject.once("pointerdown", () => {
            this.onOptionClicked(optionValue);
        });
        optionValueObject.gameobject.setWordWrapWidth(optionBg.transform.displayWidth * .75);
        optionValueObject.gameobject.handleTextSize(optionBg.gameobject, optionBg.gameobject.displayHeight * .2, optionBg.gameobject.displayHeight * .1);
    }

  }

  type optionData = {
    container : ContainerLite,
    image : Image,
    text : Text
  }
  