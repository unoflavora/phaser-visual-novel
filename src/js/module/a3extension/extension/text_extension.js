import SizeExtension from './size_extension';


/**
 * @typedef {SizeExtension} TextExtension
 * @property {TextExtension.setFontSizeAndWidth} setFontSizeAndWidth
 * @property {TextExtension.setFontSizeResponsive} setFontSizeResponsive
 * @property {TextExtension.setFontSizeAndHeight} setFontSizeAndHeight
 */

/**
 * @type TextExtension
 */
const TextExtension = {
    /**
     * @param {number} size
     * @param {number} minWidth
     * @param {number} maxWidth
     */
    setFontSizeResponsive: function(size, minWidth, maxWidth)
    {
        this.setFontSize(size);
        if (!minWidth && !maxWidth) return;
        if (this.displayWidth < minWidth)
        {this.setDisplayWidth(minWidth, true);}
        else if (this.displayWidth > maxWidth)
        {this.setDisplayWidth(maxWidth, true);}
    },

    /**
     * @param {number} size
     * @param {number} [width]
     */
    setFontSizeAndWidth: function(size, width)
    {
        this.setFontSize(size);
        this.setDisplayWidth(width, true);
    },

    /**
     * @param {number} size
     * @param {number} [height]
     */
    setFontSizeAndHeight: function(size, height)
    {
        this.setFontSize(size);
        this.setDisplayHeight(height, true);
    },
    ...SizeExtension,
};
export default TextExtension;
