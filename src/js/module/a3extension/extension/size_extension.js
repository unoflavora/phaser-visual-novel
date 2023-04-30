// Extracting functionality of Image Transform. to only used for Size component.
// implementation are done by : Object.assign(Phaser.GameObjects.Component.Size, SizeExtension)
// mimic implementation done by rexUi methods

/**
 * @typedef SizeExtension
 * @property {SizeExtension.widthAspectRatio} widthAspectRatio
 * @property {SizeExtension.heightAspectRatio} heightAspectRatio
 * @property {SizeExtension.sizeScaleX} sizeScaleX
 * @property {SizeExtension.sizeScaleY} sizeScaleY
 * @property {SizeExtension.setDisplayWidth} setDisplayWidth
 * @property {SizeExtension.setDisplayHeight} setDisplayHeight
 * @property {SizeExtension.setDisplayHeightToAspectRatio} setDisplayHeightToAspectRatio
 * @property {SizeExtension.setDisplayWidthToAspectRatio} setDisplayWidthToAspectRatio
 * @property {SizeExtension.setMaxPreferredDisplaySize} setMaxPreferredDisplaySize
 * @property {SizeExtension.setMinPreferredDisplaySize} setMinPreferredDisplaySize
 */

/**
 * @type SizeExtension
 */
const SizeExtension = {
    /** @return {number} */
    widthAspectRatio: function()
    {return this.width / this.height;},

    /** @return {number} */
    heightAspectRatio: function()
    {return this.height / this.width;},

    /** @return {number} */
    sizeScaleX: function()
    {return this.displayWidth / this.width;},

    /** @return {number} */
    sizeScaleY: function()
    {return this.displayHeight / this.height;},

    /**
     * Function to set display Width
     * @param {number} width
     * @param {boolean} matchHeightToAspectRatio
     */
    setDisplayWidth: function(width, matchHeightToAspectRatio = false)
    {
        this.displayWidth = width;
        if (matchHeightToAspectRatio)
        {this.setDisplayHeightToAspectRatio();}
    },

    /**
     * Function to set display Height
     * @param {number} height
     * @param {boolean} matchWidthToAspectRatio
     */
    setDisplayHeight: function(height, matchWidthToAspectRatio = false)
    {
        this.displayHeight = height;
        if (matchWidthToAspectRatio)
        {this.setDisplayWidthToAspectRatio();}
    },

    /** Function to set Height to Aspect Ratio based on their Width */
    setDisplayHeightToAspectRatio: function()
    {this.displayHeight = this.displayWidth * this.heightAspectRatio();},

    /** Function to set Width to Aspect Ratio based on their Height */
    setDisplayWidthToAspectRatio: function()
    {this.displayWidth = this.displayHeight * this.widthAspectRatio();},

    /**
     * Function to set Maximum Preferred Display Size
     * @param {number} maxWidth
     * @param {number} maxHeight
     */
    setMaxPreferredDisplaySize: function(maxWidth, maxHeight)
    {
        if (maxWidth * this.heightAspectRatio() > maxHeight)
        {this.setDisplayHeight(maxHeight, true);}
        else
        {this.setDisplayWidth(maxWidth, true);}
    },

    /**
     * Function to set Minimum Preferred Display Size
     * @param {number} minWidth
     * @param {number} minHeight
     */
    setMinPreferredDisplaySize: function(minWidth, minHeight)
    {
        if (minWidth * this.heightAspectRatio() < minHeight)
        {this.setDisplayHeight(minHeight, true);}
        else
        {this.setDisplayWidth(minWidth, true);}
    },
};

export default SizeExtension;
