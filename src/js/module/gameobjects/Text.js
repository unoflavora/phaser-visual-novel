import { FontAsset } from 'Assets/AssetLibraryFont';
import Transform from './transform/TextTransform';

/**
 * This class is a gameobject to manage Text Type Object
 */
export default class Text
{
    /**
    * @param {Phaser.Scene} scene
    * @param {Number} x
    * @param {Number} y
    * @param {String} text
    * @param {Phaser.Types.GameObjects.Text.TextStyle} [style]
    */
    constructor(scene, x, y, text, style)
    {
        /** @private @type {Phaser.Scene} */
        this.scene = scene;

        /** @public @readonly @type {Phaser.GameObjects.Text} */
        this.gameobject = this.scene.add.text(x, y, text, {...style, fontFamily: FontAsset.adobe_caslon_pro_bold.key});

        /** @public @readonly @type {Transform} */
        this.transform = new Transform(this.gameobject);
    }
}