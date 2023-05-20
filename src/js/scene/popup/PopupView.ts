import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import PopupController from "./PopupController";
import Text from "Modules/gameobjects/Text";
import Button from "Modules/gameobjects/Button";
import SettingsPopup from "./popups/SettingsPopup";


const popupDepth = {
    default : 1000,
    alwaysOnTop: 9999,
}
export default class PopupView extends Phaser.GameObjects.Group
{
    private background! : Button;
    private settingsPopup : SettingsPopup;

    constructor(controller : PopupController)
    {
        super(controller.scene);
        
        const background = new Button(this.scene, 0,0, UIAsset.cover_black.key)
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);
        background.gameobject.setOrigin(0,0);
        background.gameobject.setInteractive({useHandCursor: true});
        this.background = background;        

        this.settingsPopup = new SettingsPopup(this.scene);
        this.scene.add.existing(this.settingsPopup);
        this.settingsPopup.setDepth(popupDepth.default);
        this.settingsPopup.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .5);
        this.settingsPopup.create();
        this.settingsPopup.setVisible(false);
    }

    create()
    {
        
    }

    openSettingsPopup() 
    {
        this.settingsPopup.setVisible(true);
    }

    registerOnClosePopup(callback : Function)
    {
        this.settingsPopup.registerOnClosePopup(callback);
    }

}