import { SceneInfo } from 'Definitions/SceneInfo';
import ScreenUtilityController from 'Modules/ScreenUtilityController';
import AudioController from 'Modules/core/AudioController';
import LogHelper from 'Modules/helpers/LogHelper';

export default class BootSceneController extends Phaser.Scene {
  constructor() {
    super({ key: SceneInfo.bootScene.key });
  }

  create = () => {
    console.log(PROJECT_NAME);
    console.log('VERSION', PROJECT_VERSION);

    if (CONFIG.DEBUG_MODE) this.scene.launch(SceneInfo.debugScene.key);

    Promise.all([ScreenUtilityController.getInstance().init(this)])
      .then(() => this.scene.start(SceneInfo.loadingScene.key))
      .catch((err) => console.log(err));
  };
}
