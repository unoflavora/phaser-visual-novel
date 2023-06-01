import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image";
import PopupController from "./PopupController";
import Text from "Modules/gameobjects/Text";
import Button from "Modules/gameobjects/Button";
import SettingsView from "./popups/Settings/SettingsView";
import SettingsController from "./popups/Settings/SettingsController";


export const popupDepth = {
    default : 1000,
    alwaysOnTop: 9999,
}

export default class PopupView extends Phaser.GameObjects.Group
{
    private background! : Button;
    private settingsPopup : SettingsController;

    constructor(controller : PopupController)
    {
        super(controller.scene);
        
        const background = new Button(this.scene, 0,0, UIAsset.cover_black.key)
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);
        background.gameobject.setOrigin(0,0);
        background.gameobject.setInteractive({useHandCursor: true});
        this.background = background;        

        this.settingsPopup = new SettingsController(this.scene);
        this.settingsPopup.init();
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