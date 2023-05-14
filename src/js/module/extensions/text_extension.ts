import InputText from "phaser3-rex-plugins/plugins/inputtext";

/**
 * This class is a wrapper for the RexInputText class.
 * It is used to create a text input box that can be used in the game.
 */
export default class RexInputText extends InputText
{
    /**
     * The visibility button for the password input.
     */
    visibilityButton : Phaser.GameObjects.DOMElement | undefined;

    /**
     * Creates a RexInputText object.
     * @param scene The scene that this object belongs to.
     * @param x 
     * @param y 
     * @param width 
     * @param height 
     * @param config 
     */
    constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number, config : InputText.IConfig) 
    {
        super(scene, x, y, width, height, config) 
        {
            scene.add.existing(this);
        }        
    }
}

