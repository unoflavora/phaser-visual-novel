import { FontAsset } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";

export default class CharacterNamesController extends Phaser.GameObjects.Group
{
    private leftCharacterName : Text;
    private rightCharacterName : Text;
    private leftCharacterNameContainer : Phaser.GameObjects.Group
    private rightCharacterNameContainer : Phaser.GameObjects.Group

    constructor(scene: Phaser.Scene) {
        super(scene);

        var leftCharacterNameBox = new Image(scene, scene.scale.width * 0.2, scene.scale.height * 0.7, UIAsset.bg_text_box.key);
        this.add(leftCharacterNameBox.gameobject)
        leftCharacterNameBox.transform.setDisplayWidth(scene.scale.width * 0.25);

        this.leftCharacterName = new Text(scene, leftCharacterNameBox.gameobject.x, leftCharacterNameBox.gameobject.y, "Ifuly", {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width:leftCharacterNameBox.gameobject.displayWidth,
                useAdvancedWrap: true
            }
        });
        this.leftCharacterName.gameobject.setOrigin(0.5);
        this.add(this.leftCharacterName.gameobject)

        this.leftCharacterNameContainer = new Phaser.GameObjects.Group(scene);
        this.leftCharacterNameContainer.add(leftCharacterNameBox.gameobject);
        this.leftCharacterNameContainer.add(this.leftCharacterName.gameobject);
        this.leftCharacterNameContainer.setVisible(false);


        var rightCharacterNameBox = new Image(scene, scene.scale.width * 0.8, scene.scale.height * 0.7, UIAsset.bg_text_box.key);
        rightCharacterNameBox.transform.setDisplayWidth(scene.scale.width * 0.25);
        this.add(rightCharacterNameBox.gameobject)
        this.rightCharacterName = new Text(scene, rightCharacterNameBox.gameobject.x, rightCharacterNameBox.gameobject.y, "Ifuly", {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: "24px",
            color: "#ffffff",
            align: "center",
            wordWrap: {
                width: rightCharacterNameBox.gameobject.displayWidth,
                useAdvancedWrap: true
            }
        });
        this.rightCharacterName.gameobject.setOrigin(0.5);
        this.add(this.rightCharacterName.gameobject)

        this.rightCharacterNameContainer = new Phaser.GameObjects.Group(scene);
        this.rightCharacterNameContainer.add(rightCharacterNameBox.gameobject);
        this.rightCharacterNameContainer.add(this.rightCharacterName.gameobject);
        this.rightCharacterNameContainer.setVisible(false);
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
                this.leftCharacterName.gameobject.setText(currentCharacter.name);
                this.leftCharacterNameContainer.setVisible(true);
                this.rightCharacterNameContainer.setVisible(false);
                break;
            case 1:
                this.rightCharacterName.gameobject.setText(currentCharacter.name);
                this.rightCharacterNameContainer.setVisible(true);
                this.leftCharacterNameContainer.setVisible(false);
                break;

        }
    }
}