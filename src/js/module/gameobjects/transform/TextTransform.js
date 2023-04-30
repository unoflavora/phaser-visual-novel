import ImageTransform from './ImageTransform';

export default class TextTransform extends ImageTransform
{
    /**
     * @param {Phaser.GameObjects.Text} gameobject
     */
    constructor( gameobject)
    {
        super(gameobject);
    }

    /**
     * @param {number} size
     */
    setFontSize(size)
    {this.gameobject.setFontSize(size * this.screenUtility.screenPercentage);}

    /**
     * @param {number} size
     * @param {number} minWidth
     * @param {number} maxWidth
     */
    setFontSizeResponsive(size, minWidth, maxWidth)
    {
        this.setFontSize(size);
        if (!minWidth && !maxWidth) return;
        if (this.displayWidth < minWidth)
        {this.setDisplayWidth(minWidth, true);}
        else if (this.displayWidth > maxWidth)
        {this.setDisplayWidth(maxWidth, true);}
    }

    /**
     * @param {number} size
     * @param {number} [width]
     */
    setFontSizeAndWidth(size, width)
    {
        this.gameobject.setFontSize(size * this.screenUtility.screenPercentage);
        this.setDisplayWidth(width, true);
    }

    /** \
     * @param {number} size
     * @param {number} [height]
     */
    setFontSizeAndHeight(size, height)
    {
        this.gameobject.setFontSize(size * this.screenUtility.screenPercentage);
        this.setDisplayHeight(height, true);
    }
}
