import { EventEmitter } from 'events';
import ScreenUtilityController from 'Modules/ScreenUtilityController';

/**
 * This class is a component to manage Gameobject Transform Position Size
 */
export default class Transform {
  /** @type {ScreenUtilityController} */
  screenUtility;

  /** @public @readonly @type {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text} */
  gameobject;
  /**
   * @type {module:events.EventEmitter.EventEmitter}
   */
  event = new EventEmitter();

  /**
   * @enum {string}
   */
  eventName = {
    onTransformUpdate: 'onTransformUpdate',
  };

  /**
   * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text} gameobject
   */
  constructor(gameobject) {
    this.screenUtility = ScreenUtilityController.getInstance();
    this.gameobject = gameobject;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  setPosition = (x, y) => {
    this.gameobject.setPosition(x, y);
    this.emitOnTransformUpdate();
  };

  emitOnTransformUpdate() {
    this.event.emit(this.eventName.onTransformUpdate, this.gameobject);
  }

  /**
   * @callback transfromChangeCallback
   * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text} gameobject
   */
  /**
   * @param {transfromChangeCallback} events
   */
  registerOnTransformUpdate = (events) => {
    this.event.on(this.eventName.onTransformUpdate, events);
    this.emitOnTransformUpdate();
  };
}
