import Image from 'Modules/gameobjects/Image';
import { LoadingAsset } from 'Assets/AssetLibraryLoading';
import RectFill from 'Modules/a3extension/graphic_fill/rect_fill';

export default class LoadingSceneView extends Phaser.GameObjects.Container {
  /**
   * @private
   * @type {boolean}
   */
  isInitiated = false;

  /**
   * @type {number}
   */
  loadingValue = 0;

  constructor(scene) {
    super(scene);
    scene.add.existing(this);

    this.bg = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, LoadingAsset.loading_bg.key);
    this.bg.transform.setMinPreferredDisplaySize(scene.scale.width, scene.scale.height);
    this.add(this.bg.gameobject);

    this.frame = new Image(scene, 0, 0, LoadingAsset.loading_frame.key);
    this.frame.transform.setToOriginalDisplaySize();
    this.add(this.frame.gameobject);
    this.frame.gameobject.setPosition(scene.scale.width * 0.5, scene.scale.height * 0.648 + this.frame.gameobject.displayHeight * 0.5);

    this.bar = new Image(scene, this.frame.gameobject.x, this.frame.gameobject.y, LoadingAsset.loading_bar.key);
    this.bar.transform.setDisplaySize(this.frame.gameobject.displayWidth, this.frame.gameobject.displayHeight);

    this.progressBar = new RectFill(scene);
    this.progressBar.assignFillAnchor(this.frame.gameobject, this.frame.gameobject.displayWidth, this.frame.gameobject.displayHeight, false, false);

    this.bar.gameobject.setMask(this.progressBar.createGeometryMask());
    this.progressBar.visible = false;
  }

  /**
   * @param {number} value
   */
  setBar = (value) => {
    this.progressBar.fillValue = value;
  };

  /**
   * @param {number} value
   */
  setLoadingValue = (value) => {
    this.targetLoadingValue = value;
    this.loadingValue = value;
    this.setBar(value);
  };

  /**
   * @param {number} value
   */
  setTargetLoadingValue = (value) => {
    this.targetLoadingValue = value;
  };

  update = (...args) => {
    if (this.targetLoadingValue === this.loadingValue) return;

    this.loadingValue = Math.min(this.loadingValue + 0.05, this.targetLoadingValue);
    this.setBar(this.loadingValue);
  };
}
