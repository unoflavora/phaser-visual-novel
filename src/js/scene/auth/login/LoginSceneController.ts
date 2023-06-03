import { SceneInfo } from 'Definitions/SceneInfo';
import LoginView from './LoginSceneView';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import BackendController from 'Modules/core/BackendController';
import Main from 'Scenes/Main';

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

    this.view.registerOnLoginListener(async (username, confPass) => {
      if(username == null || confPass == null)
      {
        this.view.setErrorConfirmVisible(true);
        return;
      }
      
      this.view.setErrorConfirmVisible(false);

      console.log("Username: " +  username + " Password: " + confPass);

      var auth = await Main.instance.Login(username, confPass, this.view.isRememberMe);

      if(auth == null) return;

      console.log(auth)

      if (auth.error != null)
      {
          this.view.setErrorConfirmVisible(true);

          return;
      }

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
