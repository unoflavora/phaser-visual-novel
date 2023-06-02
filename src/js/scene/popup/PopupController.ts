import { SceneInfo } from "Definitions/SceneInfo";
import PopupView from "./PopupView";

export default class PopupController
{
    view! : PopupView;
    scene: Phaser.Scene;

    public OnClosePopup : () => void = () => {};

    public constructor(scene: Phaser.Scene)
    {
        this.scene = scene;
        this.view = new PopupView(this);
        this.view.create();
    }

    public OpenPopup(this : PopupController, popupKey : PopupType)
    {
        switch(popupKey)
        {
            case PopupType.Settings:
                this.view.openSettingsPopup();
                break;
        }
    }

    public RegisterOnClosePopup(callback : () => void)
    {
        this.view.registerOnClosePopup(callback);
    }

    public RemoveAllListeners()
    {
        this.view.removeAllListeners();
    }
}

export enum PopupType 
{
    Settings = "Settings",
}