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
      console.log("Password: " + email);
    })

    this.view.addOnBackButtonListeners(() => {
      console.log("Back Button Clicked")
      this.onBackButton();
      this.scene.stop();
    })
  }
}
