/**
 * Phaser Graphic that have special functionality to create radial fill after assigned to an object
 */
export default class RadialFill extends Phaser.GameObjects.Graphics
{
    _startDegree = 0;
    _radius = 0;
    _isClockWise = true;
    _fillValue = 0;

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
     * @param {number} radius
     * @param {number} startDegree
     * @param {boolean} isClockwise
     */
    assignFillAnchor(object, radius, startDegree, isClockwise)
    {
        this._radius = radius;
        this._startDegree = startDegree;
        this._isClockWise = isClockwise;
        // wacky way to get global space position of object center. require getBounds component
        this._fillAnchor = object.prepareBoundsOutput(object.getCenter(), true);
    }

    /**
     * @return {number}
     */
    get fillValue()
    {return this._fillValue;}

    /**
     * @param {number} value
     */
    set fillValue(value)
    {
        this._fillValue = value;
        this.clear();
        this.fillStyle(0xffffff, 1);

        const anchor = this._fillAnchor;
        this.slice(anchor.x, anchor.y,
            this._radius,
            Phaser.Math.DegToRad(this._startDegree),
            Phaser.Math.DegToRad(this._startDegree + this._fillValue * 360),
            !this._isClockWise);

        this.fillPath();
    }
}
