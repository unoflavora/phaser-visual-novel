import { SceneInfo } from 'Definitions/SceneInfo';
import RexInputText from 'phaser3-rex-plugins/plugins/inputtext';
import LoginView from './LoginSceneView';

export default class LoginSceneController extends Phaser.Scene {
  private view!: LoginView;
  rexInputText! : RexInputText
  constructor() {

    super({ key: SceneInfo.loginScene.key });
  }

  preload() {
    // Load any assets needed for the scene here
  }

  create() {
    this.view = new LoginView(this);
    this.view.create();
    this.view.addOnConfirmPasswordListeners((pass, confPass) => {
      if(pass != confPass)
      {
        this.view.setErrorConfirmVisible(true);
        return;
      }
      
      this.view.setErrorConfirmVisible(false);
      console.log("Password: " + pass);
    })
  }
}
