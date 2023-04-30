/**
 * Phaser Graphic that have additional functionality to create rect fill after assigned to an object
 */
export default class RectFill extends Phaser.GameObjects.Graphics
{
    /**
     * @param {Phaser.Scene} scene
     * @param {Phaser.Types.GameObjects.Graphics.Options} options
     */
    constructor(scene, options)
    {
        super(scene, options);
        scene.add.existing(this);
    }

    /**
     * @param {Phaser.GameObjects.Sprite} object
     * @param {number} width
     * @param {number} height
     * @param {boolean} isVertical
     * @param {boolean} isReverse
     */
    assignFillAnchor(object, width, height, isVertical, isReverse)
    {
        this.fillWidth = width;
        this.fillHeight = height;
        this.anchorMod = isReverse ? -1 : 1;
        this.fillAnchor = isReverse ?
            object.getBottomRight(null, true) :
            object.getTopLeft(null, true);

        this.orientationMod = isVertical ? {x: 1, y: 0} : {x: 0, y: 1};
    }

    /**
     * @param {number} value
     */
    set fillValue(value)
    {
        this.clear();
        this.fillStyle(0xffffff, 1);

        const xFill = Math.max(value, this.orientationMod.x);
        const yFill = Math.max(value, this.orientationMod.y);
        const resultWidth = this.fillWidth * xFill;
        const resultHeight = this.fillHeight * yFill;

        this.fillRect(this.fillAnchor.x, this.fillAnchor.y,
            resultWidth * this.anchorMod, resultHeight * this.anchorMod);
    }
}
