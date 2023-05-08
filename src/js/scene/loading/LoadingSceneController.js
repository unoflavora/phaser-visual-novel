import { SceneInfo } from 'Definitions/SceneInfo';
import { PhaserAssetLoadHelper, DomAssetLoadHelper } from 'Modules/assetLoader';
import LogHelper from 'Modules/helpers/LogHelper';
import LoadingSceneView from './LoadingSceneView';
import { LoadingAsset, GameplayAsset, FontAsset, UIAsset, BackgroundAsset, AudioAsset } from 'Assets/index';

export default class LoadingSceneController extends Phaser.Scene {
  constructor() {
    super({ key: SceneInfo.loadingScene.key });
  }

  preload = () => {
    Promise.resolve()
      .then(this.LoadFonts)
      .then(this.loadLoadingResources)
      .then(this.setupLoading)
      .then(this.loadMainResouces)
      .then(() => {
        this.load.removeAllListeners();
        this.view.setLoadingValue(1);
        this.scene.start(SceneInfo.mainScene.key);
      })
      .catch((error) => {
        LogHelper.log('ERROR', error);
      });
  };

  delay = ms => new Promise(res => setTimeout(res, ms));

  /**
   * Load font
   * @public
   * @return {Promise}
   */
  LoadFonts = () => {
    return DomAssetLoadHelper.loadFonts(Object.values(FontAsset));
  };

  /**
   * Load Boot Resources
   * @public
   * @return {Promise}
   */
  loadLoadingResources = () => {
    return new Promise((resolve) => {
      // LOAD HERE
      PhaserAssetLoadHelper.LoadAssetLibrary(this, LoadingAsset);
      this.load.once('complete', resolve);
      this.load.start();
    });
  };

  /**
   * Function after loadBootResource Complete
   * @public
   * @return {Promise}
   */
  setupLoading = () => {
    return new Promise((resolve) => {
      this.view = new LoadingSceneView(this);
      this.load.on('progress', (value) => {
        this.view.setTargetLoadingValue(value);
      });

      resolve();
    });
  };

  /**
   * Load All Resources
   * @public
   * @return {Promise}
   */
  loadMainResouces = () => {
    return new Promise((resolve) => {
      PhaserAssetLoadHelper.LoadAssetLibrary(this, UIAsset);
      PhaserAssetLoadHelper.LoadAssetLibrary(this, BackgroundAsset)
      PhaserAssetLoadHelper.LoadAssetLibrary(this, GameplayAsset);
      PhaserAssetLoadHelper.LoadAssetLibrary(this, AudioAsset)

      this.load.once('complete', resolve);
      this.load.start();
    });
  };

  update = (time, dt) => {
    if (this.view) {
      this.view.update(time, dt);
    }
  };
}
