import { SceneInfo } from 'Definitions/SceneInfo';
import LoginView from './LoginSceneView';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

export default class LoginSceneController extends Phaser.Scene {
  public rexUI! : RexUIPlugin;
  private view!: LoginView;

  constructor() 
  {

    super({ key: SceneInfo.loginScene.key });
  }

  preload() {
    // Load any assets needed for the scene here
  }

  create() {
    this.view = new LoginView(this);

    this.view.create(); 

    console.log(this.scene.manager.getScenes().forEach((scene) => console.log(scene.scene.key)))

    this.view.registerOnLoginListener((username, confPass) => {
      if(username == null || confPass == null)
      {
        this.view.setErrorConfirmVisible(true);
        return;
      }
      
      this.view.setErrorConfirmVisible(false);

      console.log("Username: " +  username + " Password: " + confPass);
      this.scene.start(SceneInfo.homeScene.key);
    })

    this.view.registerOnForgotPasswordListener(() => {
      console.log("Forgot Password Clicked")
      this.view.setInputActive(false);
      this.scene.launch(SceneInfo.forgotPasswordScene.key, {
        onBackButton: () => { 
          this.view.setInputActive(true);
        }
      });
    })
  }
}
