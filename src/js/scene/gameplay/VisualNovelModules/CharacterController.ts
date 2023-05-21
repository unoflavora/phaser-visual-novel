import { CharacterDisplay } from "Definitions/StoryInterface";
import Image from "Modules/gameobjects/Image";

export default class CharacterController extends Phaser.GameObjects.Group
{
    private characters : {[key: string] : Image};

    private leftCharacter : Image | undefined;

    private rightCharacter : Image | undefined;

    private targets : {[key: string] : number} = {};

    private tweens : ((value: void | PromiseLike<void>) => void)[] = [];

    constructor(scene : Phaser.Scene) {
        super(scene);
        scene.add.existing(this);
        this.characters = {
            'Pomoro': this.createCharacter("Pomoro"),
            'Ifuly': this.createCharacter("Ifuly"),
            'Ota': this.createCharacter("Ota"),
            'Bolebole Agari Imuc': this.createCharacter("Bolebole Agari Imuc"),
            'Bolebole': this.createCharacter("Bolebole"),
            'Agari': this.createCharacter("Agari"),
            'Imuc': this.createCharacter("Imuc"),
        };
    }

    public LoadCharacter = (currentCharacter: CharacterDisplay) =>
    {
        console.log(currentCharacter)
        if (currentCharacter == null)
        {
            this.setVisible(false);
            return;
        }

        this.setVisible(true);

        if (currentCharacter.leftCharacter === "leave") 
            this.hideCharacter(characterPosition.left);
        else if (currentCharacter.leftCharacter) 
            this.showCharacter(currentCharacter.leftCharacter, characterPosition.left);
    
        if (currentCharacter.rightCharacter === "leave") 
            this.hideCharacter(characterPosition.right);
        else if (currentCharacter.rightCharacter)
            this.showCharacter(currentCharacter.rightCharacter, characterPosition.right);
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

    private setPosition(character: Image, targetX: number, posY: number, position: characterPosition) {
        character.transform.setPosition(targetX, posY);
        if (position == characterPosition.left) {
            this.leftCharacter = character;
            this.targets.left = targetX;
        } else {
            this.rightCharacter = character;
            this.targets.right = targetX;
        }
    }


    private async showCharacter(name: string, position: characterPosition) {
        let character = this.characters[name];
        let targetX: number;
        let currentCharacter = position == characterPosition.left ? this.leftCharacter : this.rightCharacter;
        if (currentCharacter && currentCharacter != character) {
            await this.hideCharacter(position);
        }

        targetX = position == characterPosition.left ? this.scene.scale.width * 0.25 : this.scene.scale.width * 0.75;
        this.setPosition(character, targetX, this.scene.scale.height * .5, position);

        this.scene.tweens.add({
            targets: character.gameobject,
            x: targetX,
            duration: 500,
            ease: 'Power2',
            onStart: function () {
                character.gameobject.setVisible(true);
            },
        });
    }
    
    private async hideCharacter(position: characterPosition) {
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
        this.leftCharacter?.gameobject.setPosition(this.targets.left, this.scene.scale.height * .5);
        this.rightCharacter?.gameobject.setPosition(this.targets.right, this.scene.scale.height * .5);
        this.tweens.filter(resolve => {resolve(); return false});
    }
}

enum characterPosition {left, right}