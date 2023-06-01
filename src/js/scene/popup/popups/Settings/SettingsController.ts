import AudioController from "Modules/AudioController";
import SettingsView from "./SettingsView";

export default class SettingsController extends Phaser.GameObjects.Group
{
    view : SettingsView;
    
    constructor(scene : Phaser.Scene)
    {
        super(scene);

        this.view = new SettingsView(scene);
        this.scene.add.existing(this);
        this.scene.add.existing(this.view);
        this.add(this.view);

        this.view.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .5);
        this.view.create();
        this.view.setVisible(false);
    }

    public init()
    {
        this.view.registerOnSfxClick(() => {
            AudioController.instance.toggleMute(!AudioController.instance.onMute);
            
            this.view.setSfxButtonState(!AudioController.instance.onMute);
        });

        this.view.registerOnBgmClick(() => {
            console.log("BGM CLICKED")
            AudioController.instance.turnOnBgm = !AudioController.instance.muteBgm;

            this.view.setBgmButtonState(!AudioController.instance.muteBgm);
        });
    }

    public registerOnClosePopup(callback : Function)
    {
        this.view.registerOnClosePopup(callback);
    }


}