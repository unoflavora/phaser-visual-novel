import { FontAsset } from "Assets/AssetLibraryFont";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";

export default class CharacterController extends Phaser.GameObjects.Group
{
    private leftCharacter : Image | undefined;

    private rightCharacter : Image | undefined;

    private tweens : ((value: void | PromiseLike<void>) => void)[] = [];

    private characters : {[key: string] : Image} = {
        'Pomoro/You': this.createCharacter("Pomoro"),

        'Ifuly': this.createCharacter("Ifuly"),
    };

    constructor(scene : Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
     }

    public LoadCharacter = (currentCharacter: CharacterDisplay) =>
    {
        console.log(currentCharacter)

        if (currentCharacter == null)
        {
            this.setVisible(false);
            return;
        }

        switch(currentCharacter.position)
        {
            case -2:
                this.fadeOut(characterPosition.left);
                break;
            case -1:
                this.fadeIn(currentCharacter.name, characterPosition.left);
                break;
            case 1:
                this.fadeIn(currentCharacter.name, characterPosition.right);
                break;
            case 2:
                this.fadeOut(characterPosition.right);
                break;
        }
    }

   
    private createCharacter(name: string) {
        var assetKey = "character_" + name.toLowerCase();
        console.log(assetKey)
        const character = new Image(this.scene, this.scene.scale.width * -0.25, this.scene.scale.height * .5, assetKey);
        character.transform.setDisplayHeight(this.scene.scale.height * 0.75, true);
        this.scene.add.existing(character.gameobject);
        character.gameobject.setVisible(false);
        return character;
    }

    private setFrom(character: Image, position: characterPosition) {

        var posX = 0;

        if (position == characterPosition.left) {
            this.leftCharacter = character;
            posX = this.scene.scale.width * -0.25;
        } else {
            this.rightCharacter = character;
            posX = this.scene.scale.width * 1.25;
        }

        character.transform.setPosition(posX, this.scene.scale.height * .5);
    }


    private async fadeIn(name: string, position: characterPosition) {
        let character = this.characters[name];
        let targetX: number;
        let currentCharacter = position == characterPosition.left ? this.leftCharacter : this.rightCharacter;

        if (currentCharacter != null) {
            if (currentCharacter == character) return;

            await this.fadeOut(position);
        }

        this.setFrom(character, position);

        targetX = position == characterPosition.left ? this.scene.scale.width * 0.25 : this.scene.scale.width * 0.75;

        await new Promise<void>(resolve => {
            this.tweens.push(resolve);

            this.scene.tweens.add({
                targets: character.gameobject,
                x: targetX,
                duration: 500,
                ease: 'Power2',
                onStart: function () {
                    character.gameobject.setVisible(true);
                },
            });
        });

      
    }
    
    private async fadeOut(position: characterPosition) {
        let character = position == characterPosition.left ? this.leftCharacter : this.rightCharacter;
        if (character == undefined) return;
        let targetX: number = position == characterPosition.left ? this.scene.scale.width * -0.25 : this.scene.scale.width * 1.25;

        await new Promise<void>(resolve => {
            this.tweens.push(resolve);

            this.scene.tweens.add({
                targets: character?.gameobject,
                x: targetX,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    character?.gameobject.setVisible(false);
                    this.tweens.splice(this.tweens.indexOf(resolve), 1);
                    resolve();
                }
            });
        });
    }
    
    public FinishTween = () => 
    {
        this.tweens.filter(resolve => {resolve(); return false});
    }
}

enum characterPosition {left, right}