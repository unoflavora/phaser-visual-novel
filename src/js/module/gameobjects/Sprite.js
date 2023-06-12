import Transform from './transform/ImageTransform';

/**
 * This class is a gameobject to manage Sprite Type Object
 */
export default class Sprite
{
    /**
    * @param {Phaser.Scene} scene
    * @param {Number} x
    * @param {Number} y
    * @param {String} texture
    * @param {Number} frame
    */
    constructor(scene, x, y, texture, frame = 0)
    {
        /** @private @type {Phaser.Scene} */
        this.scene = scene;

        /** @public @readonly @type {Phaser.GameObjects.Sprite} */
        this.gameobject = this.scene.add.sprite(x, y, texture, frame);

        /** @public @readonly @type {Transform} */
        this.transform = new Transform(this.gameobject);
    }
}
