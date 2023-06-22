import AudioController from 'Modules/core/AudioController';
import ForgotPasswordView from './ForgotPasswordView';
import { SceneInfo } from 'Definitions/SceneInfo';

export default class ForgotPasswordController extends Phaser.Scene {
  private view!: ForgotPasswordView;
  private onBackButton!: () => void;

  constructor() {
    super({ key: SceneInfo.forgotPasswordScene.key });
  }

  preload() {
    // Load any assets needed for the scene here
  }

  // This is called when the scene is launched with this.scene.launch() from Login Scene Controller
  init (data: { onBackButton: () => void}) {
    this.onBackButton = data.onBackButton;
  }

  create() {
    this.view = new ForgotPasswordView(this);
    this.view.create();
    this.view.addOnConfirmPasswordListeners((email) => {

      window.open(CONFIG.RESET_PASSWORD_URL, "_blank")
      AudioController.instance.play("main_button_click");
    })

    this.view.addOnBackButtonListeners(() => {
      AudioController.instance.play("main_button_click");
      console.log("Back Button Clicked")
      this.onBackButton();
      this.scene.stop();
    })
  }
}
