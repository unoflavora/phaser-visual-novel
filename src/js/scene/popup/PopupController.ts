import InfoPopupController from "./popups/Info/InfoPopupController";
import SettingsController from "./popups/Settings/SettingsController";
import Button from "Modules/gameobjects/Button";
import { UIAsset } from "Assets/AssetLibraryUi";

export default class PopupController extends Phaser.GameObjects.Container
{
    private settingsPopup : SettingsController;
    private infoPopup: InfoPopupController;
    private background : Button;
    private _onClosePopup : Function = () => {};

    public constructor(scene: Phaser.Scene)
    {
        super(scene)

        this.scene.add.existing(this);
        console.log(scene.scene.key)
                
        const background = new Button(this.scene, 0,0, UIAsset.cover_black.key)
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);
        background.gameobject.setOrigin(0,0);
        background.gameobject.setInteractive({useHandCursor: true});
        this.background = background;
        this.background.gameobject.setVisible(false);

        this.add(background.gameobject)
        this.scene.add.existing(background.gameobject);

        this.settingsPopup = new SettingsController(this);
        this.settingsPopup.init();

        this.infoPopup = new InfoPopupController(this.scene);
        this.infoPopup.init();

    }

    public OpenPopup(this : PopupController, popupKey : PopupType, message: string = "")
    {
        this.background.gameobject.setVisible(true);

        switch(popupKey)
        {
            case PopupType.Settings:
                this.openSettingsPopup();
                break;
            case PopupType.Error:
                this.openInfoPopup("Error", message, this._onClosePopup);
                break;

        }
    }

    openSettingsPopup() 
    {
        this.settingsPopup.OpenPopup();
    }

    openInfoPopup(title : string, desc : string, callback : Function, callbackOnCancel : Function | null = null)
    {
        this.infoPopup.OpenPopup(title, desc, callback, callbackOnCancel);
    }

    registerOnClosePopup(callback : Function)
    {
        this._onClosePopup = callback;

        this.settingsPopup.registerOnClosePopup(this._onClosePopup);
    }
}

export enum PopupType 
{
    Settings = "Settings",
    Error = "Error"
}