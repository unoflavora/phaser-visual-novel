import AudioController from 'Modules/core/AudioController';
import InfoPopupView from './InfoPopupView';

export default class InfoPopupController extends Phaser.GameObjects.Group {

  
  private view!: InfoPopupView;

  constructor(scene: Phaser.Scene) {
    super(scene)
  }

  private _onClosePopup: Function = () => { };

  preload() {
    // Load any assets needed for the scene here
  }

  init() {
    this.view = new InfoPopupView(this.scene);

    this.view.layoutDefault();

    this.view.setVisible(false);
  }

  OpenPopup(title: string, message: string, iconKey: string, OnConfirm : Function, onConfirmText: string, onCancel : Function | null = null, onCancelText: string | null) {
    this.view.setVisible(true);
    
    this.view.setupInfo(title, message, iconKey, () => {
      OnConfirm();
      this.view.setVisible(false);
      this._onClosePopup();
      AudioController.instance.play("main_button_click");

    }, onConfirmText,
    () => {
      if (onCancel != null) onCancel();
      AudioController.instance.play("main_button_click");
      this.view.setVisible(false);
      this._onClosePopup();
    }, onCancelText);
  }

  registerOnClosePopup(onClosePopup: Function) 
  {
    this._onClosePopup = onClosePopup;
  }


}
