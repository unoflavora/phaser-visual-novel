import Transform from './Transform';

export default class ImageTransform extends Transform
{
    /**
     * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image |Phaser.GameObjects.Text} gameobject
     */
    constructor(gameobject)
    {
        super(gameobject);
    }

    /** @return {number} */
    get displayWidth()
    {return this.gameobject.displayWidth;}

    /** @return {number} */
    get displayHeight()
    {return this.gameobject.displayHeight;}

    /** @return {number} */
    get widthAspectRatio()
    {return this.gameobject.width / this.gameobject.height;}

    /** @return {number} */
    get heightAspectRatio()
    {return this.gameobject.height / this.gameobject.width;}

    /** @return {number} */
    get displayToOriginalWidthRatio()
    {return this.gameobject.displayWidth / this.gameobject.width;}

    /** @return {number} */
    get displayToOriginalHeightRatio()
    {return this.gameobject.displayHeight / this.gameobject.height;}

    /**
     * Function to set display Width
     * @param {number} width
     * @param {boolean} matchHeightToAspectRatio
     */
    setDisplayWidth(width, matchHeightToAspectRatio = false)
    {
        this.gameobject.displayWidth = width;
        if (matchHeightToAspectRatio)
        {this.setDisplayHeightToAspectRatio();}

        this.emitOnTransformUpdate();
    }

    /**
     * Function to set display width as Screen Width
     * @param {boolean} matchHeightToAspectRatio
     */
    setDisplayWidthAsScreenWidth(matchHeightToAspectRatio = false)
    {this.setDisplayWidth(this.screenUtility.width, matchHeightToAspectRatio);}

    /**
     * Function to set display Height
     * @param {number} height
     * @param {boolean} matchWidthToAspectRatio
     */
    setDisplayHeight(height, matchWidthToAspectRatio = false)
    {
        this.gameobject.displayHeight = height;
        if (matchWidthToAspectRatio)
        {this.setDisplayWidthToAspectRatio();}
        this.emitOnTransformUpdate();
    }

    /**
     * Function to set display width as Screen Height
     * @param {boolean} matchWidthToAspectRatio
     */
    setDisplayHeightAsScreenHeight(matchWidthToAspectRatio = false)
    {this.setDisplayHeight(this.screenUtility.height, matchWidthToAspectRatio);}

    /** Function to set Height to Aspect Ratio based on their Width */
    setDisplayHeightToAspectRatio()
    {this.gameobject.displayHeight = this.gameobject.displayWidth * this.heightAspectRatio;}

    /** Function to set Width to Aspect Ratio based on their Height */
    setDisplayWidthToAspectRatio()
    {this.gameobject.displayWidth = this.gameobject.displayHeight * this.widthAspectRatio;}

    /**
     * Function to set Display Size
     * @param {number} width
     * @param {number} height
     */
    setDisplaySize(width, height)
    {
        this.gameobject.setDisplaySize(width, height);
        this.emitOnTransformUpdate();
    }

    /**
     * Function to set Display Size
     * @param {number | boolean} [width] set true or false to match the width aspect ratio only
     * @param {number | boolean} [height] set true or false to match the height aspect ratio only
     */
    setCustomDisplaySize(width, height)
    {
        if (typeof (width) == 'number' && typeof (height) == 'number')
        {this.gameobject.setDisplaySize(width, height);}
        else if (typeof (width) == 'number')
        {this.setDisplayWidth(width, true);}
        else if (typeof (height) == 'number')
        {this.setDisplayHeight(height, true);}

        this.emitOnTransformUpdate();
    }

    /**
     * Function to set Display Size
     * @param {number | boolean} [width] set true or false to match the width aspect ratio only
     * @param {number | boolean} [height] set true or false to match the height aspect ratio only
     */
    setMaxCustomDisplaySize = (width, height) =>
    {
        if (typeof (width) == 'number' && typeof (height) == 'number')
        {this.setMaxPreferredDisplaySize(width, height);}
        else if (typeof (width) == 'number')
        {this.setDisplayWidth(width, true);}
        else if (typeof (height) == 'number')
        {this.setDisplayHeight(height, true);}

        this.emitOnTransformUpdate();
    };
    /** Function to set Display Size to Original */
    setToOriginalDisplaySize = () =>
    {
        this.setDisplaySize(
            this.gameobject.width * this.screenUtility.screenPercentage,
            this.gameobject.height * this.screenUtility.screenPercentage);
    };

    /**
     * Function to set Maximum Preferred Display Size
     * @param {number} maxWidth
     * @param {number} maxHeight
     */
    setMaxPreferredDisplaySize = (maxWidth, maxHeight) =>
    {
        if (maxWidth * this.heightAspectRatio > maxHeight)
        {this.setDisplayHeight(maxHeight, true);}
        else
        {this.setDisplayWidth(maxWidth, true);}
    };

    /**
     * Function to set Minimum Preferred Display Size
     * @param {number} minWidth
     * @param {number} minHeight
     */
    setMinPreferredDisplaySize = (minWidth, minHeight) =>
    {
        if (minWidth * this.heightAspectRatio < minHeight)
        {this.setDisplayHeight(minHeight, true);}
        else
        {this.setDisplayWidth(minWidth, true);}
    };

    /**
     * Function to set gameobject size to Screen Percentage (from Screen Utility Controller)
     * @param {number} percentage
     */
    setToScreenPercentage = (percentage = this.screenUtility.screenPercentage) =>
    {this.setDisplayWidth(percentage * this.gameobject.width, true);};

    /**
     * Get Display Position From Coordinate
     * @param {number} x 0 - 1
     * @param {number} y 0 - 1
     * @return {Phaser.Math.Vector2}
     */
    getDisplayPositionFromCoordinate = (x, y) =>
    {
        return new Phaser.Math.Vector2(
            this.gameobject.x + ((x - this.gameobject.originX) * this.gameobject.displayWidth),
            this.gameobject.y + ((y - this.gameobject.originY) * this.gameobject.displayHeight),
        );
    };
}
