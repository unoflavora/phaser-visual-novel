import GameplaySceneView from './GameplaySceneView';
import { SceneInfo } from 'Definition/SceneInfo';
import AudioController from 'Modules/AudioController';

export default class GameplaySceneController extends Phaser.Scene {
  constructor() {
    super({ key: SceneInfo.gameplayScene.key });
  }

  init = async (data) => {
    this.audioController = AudioController.getInstance();
    this.view = new GameplaySceneView(this);
    this.view.create(4);

    const color = new Phaser.Display.Color();
    color.random(100);
    this.add.rectangle(this.scale.width * 0.5, this.scale.height * 0.5, this.scale.width, this.scale.height, color.color);
  };

  preload = () => {};

  create = (data) => {};

  update = (time, delta) => {};
}
