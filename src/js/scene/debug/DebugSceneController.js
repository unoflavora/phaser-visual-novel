import DebugSceneView from './DebugSceneView';
import { SceneInfo } from 'Definitions/SceneInfo';

/**
 * @typedef DebugInfo
 * @property {String} key
 * @property {String} text
 */

export default class DebugSceneController extends Phaser.Scene {
  /**
   * @enum {string}
   */
  static EVENT_NAMES = {
    onInfo: 'onInfo',
    onLog: 'onLog',
  };
  EVENT_NAMES = DebugSceneController.EVENT_NAMES;

  /**
   * @type {Array<DebugInfo>}
   */
  infoList = [];

  /**
   * @type {Array<string>}
   */
  logs = [];

  constructor() {
    super({ key: SceneInfo.debugScene.key });
    DebugSceneController.instance = this;
  }

  /** @type {DebugSceneController} */
  static instance;

  /** @return {DebugSceneController} */
  static getInstance() {
    return DebugSceneController.instance;
  }

  init() {
    this.view = new DebugSceneView(this);
    this.add.existing(this.view);
    this.scale.on('resize', () => this.view.emit(this.view.EVENT_NAMES.layout), this);
    this.input.keyboard.addKey('F2').on('up', () => this.view.setVisible(!this.view.visible));

    this.events.on(this.EVENT_NAMES.onInfo, (infoList) => this.view.updateInfoText(infoList));
    this.events.on(this.EVENT_NAMES.onLog, (log) => this.view.updateDebugText(log));
    this.scene.bringToTop();
  }

  create() {
    this.updateOrCreateInfo('game_name', `${PROJECT_NAME}`);
    this.updateOrCreateInfo('version', `Version: ${PROJECT_VERSION}`);
    this.updateOrCreateInfo('connectivity', `Online Connectivity: ${!CONFIG.OFFLINE_MODE}`);
    this.updateOrCreateInfo('buildTime', `Build Time: ${BUILD_TIME}`);
    this.updateOrCreateInfo('Debug', `Press F2 to Toggle Debug Information`);
  }

  /**
   * @param {string} key
   * @param {string} text
   */
  updateOrCreateInfo(key, text) {
    if (this.infoList.some((Element) => Element.key === key)) {
      this.updateInfo(key, text);
    } else {
      this.createInfo(key, text);
    }
  }

  /**
   * @param {string} key
   * @param {string} text
   */
  updateInfo(key, text) {
    const info = this.infoList.find((Element) => Element.key === key);
    if (info === undefined) return;
    info.text = text;
    this.events.emit(this.EVENT_NAMES.onInfo, this.infoList);
  }

  /**
   * @param {string} key
   * @param {string} text
   */
  createInfo(key, text) {
    const info = {
      key: key,
      text: text,
    };
    this.infoList.push(info);
    this.events.emit(this.EVENT_NAMES.onInfo, this.infoList);
  }

  /**
   * @param {string} message
   * @param {boolean} clearPrevious
   */
  debug(message, clearPrevious = true) {
    if (clearPrevious) {
      this.logs = [];
    }

    this.logs.push(message);
    this.events.emit(this.EVENT_NAMES.onLog, this.logs);
  }
}
