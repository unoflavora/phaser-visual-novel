import { SceneInfo } from 'Definitions/SceneInfo';
import LoginView from './LoginSceneView';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import BackendController from 'Modules/core/BackendController';
import MainSceneController from 'Scenes/MainSceneController';
import AudioController from 'Modules/core/AudioController';
import ConsoleHelper from 'Modules/helpers/ConsoleHelper';

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
      AudioController.instance.play("main_button_click");
      if(username == null || confPass == null)
      {
        this.view.setErrorConfirmVisible(true);
        return;
      }
      
      this.view.setErrorConfirmVisible(false);

      ConsoleHelper.Log("Username: " +  username + " Password: " + confPass);

      var auth = await MainSceneController.instance.Login(username, confPass, this.view.isRememberMe);

      if(auth == null) return;

      ConsoleHelper.Log(auth)

      if (auth.error != null)
      {
          this.view.setErrorConfirmVisible(true);

          return;
      }

      this.scene.start(SceneInfo.homeScene.key);
    })

    this.view.registerOnForgotPasswordListener(() => {
      AudioController.instance.play("main_button_click");
      this.view.setInputActive(false);
      this.scene.launch(SceneInfo.forgotPasswordScene.key, {
        onBackButton: () => { 
          this.view.setInputActive(true);
        }
      });
    })
  }
}
