import { AssetType } from 'Modules/assetLoader/const';

/**
 * helper class to load phaser assets
 */
export default class PhaserAssetLoadHelper {
  /**
   * @param {AssetInfo} assetInfo
   * @return {string}
   */
  static assetPath(assetInfo) {
    return assetInfo.isWebFile ? assetInfo.path : CONFIG.BASE_ASSET_URL + assetInfo.path;
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} imageInfo
   */
  static LoadImage(scene, imageInfo) {
    scene.load.image(imageInfo.key, this.assetPath(imageInfo));
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {SpriteSheetInfo} spriteSheetInfo
   */
  static LoadSpriteSheet(scene, spriteSheetInfo) {
    scene.load.spritesheet(spriteSheetInfo.key, this.assetPath(spriteSheetInfo), {
      frameWidth: spriteSheetInfo.width,
      frameHeight: spriteSheetInfo.height,
    });
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} audioInfo
   */
  static LoadAudio(scene, audioInfo) {
    scene.load.audio(audioInfo.key, this.assetPath(audioInfo));
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} info
   */
  static LoadHtmlFile(scene, info) {
    scene.load.html(info.key, this.assetPath(info));
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} info
   */
  static LoadJSONFile(scene, info) {
    scene.load.json(info.key, this.assetPath(info));
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} info
   */
  static LoadText(scene, info) {
    scene.load.text(info.key, this.assetPath(info));
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {SpineInfo} info
   */
  static LoadSpine(scene, info) {
    scene.load.setPath(this.assetPath(info));
    scene.load.spine(info.key, info.json_file, info.atlas_file, true);
    scene.load.setPath('');
  }

  /**
   * @type {Array<AssetLoader>}
   */
  static AssetLoader = [
    {
      type: AssetType.STATIC,
      loadFunc: (scene, asset) => this.LoadImage(scene, asset),
    },
    {
      type: AssetType.SPRITESHEET,
      loadFunc: (scene, asset) => this.LoadSpriteSheet(scene, asset),
    },
    {
      type: AssetType.AUDIO,
      loadFunc: (scene, asset) => this.LoadAudio(scene, asset),
    },
    {
      type: AssetType.HTML,
      loadFunc: (scene, asset) => this.LoadHtmlFile(scene, asset),
    },
    {
      type: AssetType.SPINE,
      loadFunc: (scene, asset) => this.LoadSpine(scene, asset),
    },
    {
      type: AssetType.JSON,
      loadFunc: (scene, asset) => this.LoadJSONFile(scene, asset),
    },
    {
      type: AssetType.TEXT,
      loadFunc: (scene, asset) => this.LoadText(scene, asset),
    },
  ];

  /**
   * @param {Phaser.Scene} scene
   * @param {AssetInfo} asset
   */
  static LoadAsset(scene, asset) {
    if (asset.isExcluded) return;
    if (scene.textures.exists(asset.key)) return;

    const relatedLoader = this.AssetLoader.find((loaderData) => loaderData.type === asset.type);
    if (!relatedLoader) throw new Error('Trying to load Unknown Asset Type');

    relatedLoader.loadFunc(scene, asset);
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {Array<AssetInfo>} assets
   */
  static LoadAssets(scene, assets) {
    for (const asset of assets) this.LoadAsset(scene, asset);
  }

  /**
   * @param {Phaser.Scene} scene
   * @param {Object} assetsLibrary
   */
  static LoadAssetLibrary(scene, assetsLibrary) {
    this.LoadAssets(scene, Object.values(assetsLibrary));
  }
}
