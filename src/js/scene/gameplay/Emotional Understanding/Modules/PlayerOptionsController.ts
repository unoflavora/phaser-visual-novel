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
import MainSceneController from "Scenes/MainSceneController";

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
        bg.gameobject.setInteractive({ useHandCursor: true });

		var text = new Text(scene, 0, 0, optionText, optionTextStyle);

        var info = new Image(scene, 0, 0, UIAsset.icon_info.key);
        info.gameobject.setOrigin(1, 0);
        info.gameobject.setInteractive({ useHandCursor: true });

		// Add UI to container
		container.add([bg.gameobject, text.gameobject, info.gameobject]);

		// Add container to grid
		grid.add(container, {
            align: "center",
            expand: true,
        });
        
		// Set Item Position and Size based on layouted container
		text.gameobject.setPosition(bg.gameobject.x, bg.gameobject.y);
		text.gameobject.setOrigin(0.5);
		bg.gameobject.setDisplaySize(container.width, container.height);
        info.transform.setDisplayWidth(bg.gameobject.displayWidth * .01, true);
        info.gameobject.setPosition(bg.gameobject.x - bg.gameobject.displayWidth * .4, bg.gameobject.y - bg.gameobject.displayHeight * .45);

        var optionData : optionData = {
            container,
            bg,
            text,
            info
        }

        return optionData;
	}
  
    public setOptionValue(optionIndex : number, optionValue : string, optionDescription : string | null) {
        var option = this.optionData[optionIndex];
        
        option.container.setVisible(optionValue.length > 0)

        if(optionValue.length < 1) return;

        var optionValueObject = option.text;
        var optionBg = option.bg
        var optionInfo = option.info;

  
		optionValueObject.gameobject.setText(optionValue);

        optionInfo.gameobject.setVisible(optionDescription != null && optionDescription.length > 0);
        optionInfo.gameobject.removeAllListeners();
        optionInfo.gameobject.on("pointerdown", () => {
            MainSceneController.instance.OpenInfoPopup(optionValue, optionDescription ?? "", UIAsset.icon_info.key, () => {}, "OK");
        });

        optionBg.transform.setDisplaySize(option.container.displayWidth, option.container.displayHeight)
        optionInfo.transform.setDisplayWidth(optionBg.gameobject.displayWidth * .15, true);
        optionInfo.gameobject.setPosition(optionBg.gameobject.x - optionBg.gameobject.displayWidth * .4, optionBg.gameobject.y - optionBg.gameobject.displayHeight * .45);

        optionBg.gameobject.removeAllListeners()

        // Set Interactive
        optionBg.gameobject.once("pointerdown", () => {
            this.onOptionClicked(optionValue);
        });
        optionValueObject.gameobject.setWordWrapWidth(optionBg.transform.displayWidth * .75);
        optionValueObject.gameobject.handleTextSize(optionBg.gameobject, optionBg.gameobject.displayHeight * .2, optionBg.gameobject.displayHeight * .18);
    }

  }

  type optionData = {
    container : ContainerLite,
    bg : Image,
    text : Text,
    info: Image;
  }
  