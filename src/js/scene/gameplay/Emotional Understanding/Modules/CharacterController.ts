import { GameplayAsset } from "Assets/AssetLibraryGameplay";
import Image from "Modules/gameobjects/Image";

export default class CharacterController extends Phaser.GameObjects.Group
{
    private character : Image;

    private tweens : ((value: void | PromiseLike<void>) => void)[] = [];

    constructor(scene : Phaser.Scene) {
        super(scene);
        scene.add.existing(this);

        this.character = new Image(scene, scene.scale.width * .5, scene.scale.height * .5, GameplayAsset["char-story-sc_01"].key);
        this.add(this.character.gameobject)
    }

    public LoadCharacter = (currentSceneIndex : number) =>
    {
        var key = "char-story-sc_0" + currentSceneIndex;
        this.character.transform.setDisplaySize(this.scene.scale.width * 1.5, this.scene.scale.height * 1.5);
        if (GameplayAsset[key as keyof typeof GameplayAsset] == undefined) {
            this.setVisible(false);
            return;
        };

        this.fadeIn(key);
    }



    private async fadeIn(key: string) {


        this.character.gameobject.setTexture(key);

        // await this.fadeOut();

        this.character.transform.setPosition(this.scene.scale.width * .5, 0);

        await new Promise<void>(resolve => {
            this.tweens.push(resolve);

            var targetY = this.scene.scale.height * .75;

            this.scene.tweens.add({
                targets: this.character.gameobject,
                y: targetY,
                duration: 500,
                ease: 'Power2',
                onStart: () => {
                    this.character.gameobject.setVisible(true);
                },
            });
        });

      
    }
    
    private async fadeOut() {
        let character = this.character;

        if (character == undefined) return;
        let targetY: number = 0;

        await new Promise<void>(resolve => {
            this.tweens.push(resolve);

            this.scene.tweens.add({
                targets: character?.gameobject,
                y: targetY,
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