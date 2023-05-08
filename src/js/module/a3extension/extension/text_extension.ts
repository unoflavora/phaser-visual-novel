import InputText from "phaser3-rex-plugins/plugins/inputtext";

export default class RexInputText extends InputText
{
    constructor(scene : Phaser.Scene, x : number, y : number, width : number, height : number, config : InputText.IConfig) 
    {
        super(scene, x, y, width, height, config) 
        {
            scene.add.existing(this);
        }        
    }

}