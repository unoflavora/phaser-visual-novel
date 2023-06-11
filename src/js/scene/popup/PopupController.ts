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
                this.openInfoPopup("Error", message, UIAsset.icon_error.key, this._onClosePopup, "OK");
                break;
            case PopupType.LostConnection:
                this.openLostConnectionPopup();
                break;
        }
    }
   
    public closeLostConnectionPopup()
    {
        this._onClosePopup();
    }

    public openInfoPopup(title: string, message: string, iconKey: string, onConfirm : Function, onConfirmText: string, onCancel : Function | null = null, onCancelText: string | null = null)
    {
        this.background.gameobject.setVisible(true);

        this.infoPopup.OpenPopup(title, message, iconKey, onConfirm,onConfirmText, onCancel, onCancelText);
    }

    public registerOnClosePopup(callback : Function)
    {
        this._onClosePopup = callback;

        this.settingsPopup.registerOnClosePopup(this._onClosePopup);

        this.infoPopup.registerOnClosePopup(this._onClosePopup);

    }

    private openLostConnectionPopup()
    {
        this.openInfoPopup("Lost Connection", "You are offline, please check your internet connection.", UIAsset.icon_warning.key, () => {}, "Refresh");
    }

    private openSettingsPopup() 
    {
        this.settingsPopup.OpenPopup();
    }

    
}


export enum PopupType {
    Settings = "Settings",
    Error = "Error",
    LostConnection = "LostConnection"
}