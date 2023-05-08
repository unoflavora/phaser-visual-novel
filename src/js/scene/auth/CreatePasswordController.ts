import CreatePasswordView from './CreatePasswordView';
import { SceneInfo } from 'Definitions/SceneInfo';
import RexInputText from 'phaser3-rex-plugins/plugins/inputtext';

export default class CreatePasswordController extends Phaser.Scene {
  private view!: CreatePasswordView;
  rexInputText! : RexInputText
  constructor() {

    super({ key: SceneInfo.createPassword.key });
  }

  preload() {
    // Load any assets needed for the scene here
  }

  create() {
    this.view = new CreatePasswordView(this);
    this.view.create();
  }
}
