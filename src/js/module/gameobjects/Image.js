import Transform from './transform/ImageTransform';

/**
 * This class is a gameobject to manage Image Type Object
 */
export default class Image
{
    /**
     * @param {Phaser.Scene} scene
     * @param {Number} x
     * @param {Number} y
     * @param {String} texture
     * @param {number} frame
     */
    constructor(scene, x, y, texture, frame = 0)
    {
        /** @private @type {Phaser.Scene} */
        this.scene = scene;

        /** @public @readonly @type {Phaser.GameObjects.Image} */
        this.gameobject = this.scene.add.image(x, y, texture, frame);

        /** @public @readonly @type {Transform} */
        this.transform = new Transform(this.gameobject);
    }
}
