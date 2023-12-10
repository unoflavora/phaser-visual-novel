import { FontAsset } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import MainSceneController from "Scenes/MainSceneController";

export default class CharacterNamesController extends Phaser.GameObjects.Group
{
    private leftCharacterName : Text;
    private rightCharacterName : Text;
    private leftCharacterNameContainer : Phaser.GameObjects.Group
    private rightCharacterNameContainer : Phaser.GameObjects.Group

    private static _instance: CharacterNamesController;

    constructor(scene: Phaser.Scene, textBox: Image) {
        super(scene);

        CharacterNamesController._instance = this;

        var leftCharacterNameBox = new Image(scene, textBox.gameobject.x - textBox.gameobject.displayWidth * .5, textBox.gameobject.y - textBox.gameobject.displayHeight * .55, UIAsset.bg_text_box.key);
        leftCharacterNameBox.gameobject.setOrigin(0, 1)
        this.add(leftCharacterNameBox.gameobject)
        leftCharacterNameBox.transform.setDisplayWidth(scene.scale.width * 0.25, true);

        this.leftCharacterName = new Text(scene, leftCharacterNameBox.gameobject.x + leftCharacterNameBox.gameobject.displayWidth * .5, leftCharacterNameBox.gameobject.y - leftCharacterNameBox.gameobject.displayHeight * .5, "Ifuly", {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width:leftCharacterNameBox.gameobject.displayWidth,
                useAdvancedWrap: true
            }
        });
        this.leftCharacterName.gameobject.setFontSize(leftCharacterNameBox.gameobject.displayHeight * .4);
        this.leftCharacterName.gameobject.setOrigin(0.5);
        this.add(this.leftCharacterName.gameobject)

        this.leftCharacterNameContainer = new Phaser.GameObjects.Group(scene);
        this.leftCharacterNameContainer.add(leftCharacterNameBox.gameobject);
        this.leftCharacterNameContainer.add(this.leftCharacterName.gameobject);
        this.leftCharacterNameContainer.setVisible(false);


        var rightCharacterNameBox = new Image(scene, textBox.gameobject.x + textBox.gameobject.displayWidth * .5, textBox.gameobject.y - textBox.gameobject.displayHeight * .55, UIAsset.bg_text_box.key);
        rightCharacterNameBox.gameobject.setOrigin(1, 1)
        rightCharacterNameBox.transform.setDisplayWidth(scene.scale.width * 0.25, true);
        this.add(rightCharacterNameBox.gameobject)
        this.rightCharacterName = new Text(scene, rightCharacterNameBox.gameobject.x - rightCharacterNameBox.gameobject.displayWidth * .5, rightCharacterNameBox.gameobject.y - rightCharacterNameBox.gameobject.displayHeight * .5, "Ifuly", {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width: rightCharacterNameBox.gameobject.displayWidth,
                useAdvancedWrap: true
            }
        });
        this.rightCharacterName.gameobject.setOrigin(0.5);
        this.add(this.rightCharacterName.gameobject)
        this.rightCharacterName.gameobject.setFontSize(leftCharacterNameBox.gameobject.displayHeight * .4);

        this.rightCharacterNameContainer = new Phaser.GameObjects.Group(scene);
        this.rightCharacterNameContainer.add(rightCharacterNameBox.gameobject);
        this.rightCharacterNameContainer.add(this.rightCharacterName.gameobject);
        this.rightCharacterNameContainer.setVisible(false);
    }

    static get instance()
    {
        return this._instance;
    }

    public LoadCharacterName = (currentCharacter: CharacterDisplay) => {
        if (currentCharacter == null)
        {
            this.setVisible(false);
            return;
        }

        this.setVisible(true);

        switch(currentCharacter.position)
        {
            case -1:
            {
                this.leftCharacterName.gameobject.setText(currentCharacter.name);
                this.leftCharacterNameContainer.setVisible(true);
                this.rightCharacterNameContainer.setVisible(false);
            }
            break;

            case 1:
            {
                this.rightCharacterName.gameobject.setText(currentCharacter.name);
                this.rightCharacterNameContainer.setVisible(true);
                this.leftCharacterNameContainer.setVisible(false);
            }
            break;

        }
    }
}