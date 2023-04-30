// import Phaser, { GameObjects } from 'phaser'
import {EventEmitter} from 'events';

/**
 * This class is a module to manage Screen Utility
 */
export default class ScreenUtilityController
{
    /**
     * @type {Phaser.Scene}
     * @private
     */
    scene;

    /**
     * @type {number}
     * @readonly
     * @default 1080
     */
    defaultWidth = 1080;

    /**
     * @type {number}
     * @readonly
     * @default 1920
     */
    defaultHeight = 1920;

    /**
     * @type {module:events.EventEmitter.EventEmitter}
     */
    event = new EventEmitter();

    /**
     * @enum {string}
     */
    eventName = {
        onOrientationChange: 'onOrientationChange',
    };

    /** @type {ScreenUtilityController} */
    static instance;

    /** @return {ScreenUtilityController} */
    static getInstance = () =>
    {
        ScreenUtilityController.instance = ScreenUtilityController.instance ?? new ScreenUtilityController();
        return ScreenUtilityController.instance;
    };

    /**
     * Function to Initialize Screen Utility
     * @param {Phaser.Scene} scene
     * @param {number} defaultWidth
     * @param {number} defaultHeight
     * @return {Promise}
     */
    init = (scene, defaultWidth = 1080, defaultHeight = 1920) =>
    {
        return new Promise((resolve) =>
        {
            this.scene = scene;
            this.setDefaultScreenSize(defaultWidth, defaultHeight);

            window.addEventListener(
                'resize',
                () => this.event.emit(this.eventName.onOrientationChange, this.orientation),
                false);
            resolve();
        });
    };

    // #region base scale accessor //TODO : can be replaced by phaser built in scale manager
    /**
     * @public
     * @readonly
     * @return {number}
     */
    get width()
    {return this.scene.scale.width;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get height()
    {return this.scene.scale.height;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get ratio()
    {return this.width / this.height;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get centerX()
    {return this.width * .5;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get centerY()
    {return this.height * .5;}

    // #endregion

    // #region camera scroll
    /**
     * @public
     * @readonly
     * @return {number}
     */
    get left()
    {return this.scene.cameras.main.scrollX;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get right()
    {return this.width + this.scene.cameras.main.scrollX;}

    // #endregion

    // #region orientation //TODO : can be replaced by phaser built in scale manager
    /**
     * @public
     * @readonly
     * @return {boolean}
     */
    get isLandscape()
    {return window.innerWidth > window.innerHeight;}

    /**
     * @public
     * @readonly
     * @return {string | Phaser.ScaleModes}
     */
    get orientation()
    {return this.isLandscape ? Phaser.Scale.LANDSCAPE : Phaser.Scale.PORTRAIT;}

    /**
     * @return {Promise}
     */
    waitUntilPortrait = () =>
    {
        return new Promise((resolve) =>
        {
            if (this.orientation !== Phaser.Scale.LANDSCAPE) return resolve();
            this.event.once(
                this.eventName.onOrientationChange,
                (orientation) =>
                {if (orientation === Phaser.Scale.PORTRAIT) setTimeout(() => resolve(), 100);});
        });
    };

    /**
     * @param {Function} events
     */
    registerOnOrientationChange = (events) =>
    {this.event.on(this.eventName.onOrientationChange, events);};

    /**
     * @param {Function} events
     */
    removeOnOrientationChange = (events) =>
    {this.event.removeListener(this.eventName.onOrientationChange, events);};

    // #endregion

    // #region hard code number
    /**
     * Function to set default reference for screen width and height
     * @param {number} defWidth
     * @param {number} defHeight
     */
    setDefaultScreenSize = (defWidth, defHeight) =>
    {
        this.defaultWidth = defWidth;
        this.defaultHeight = defHeight;
    };


    /**
     * Screen Percentage is a value of actual screen display divided by default asset size
     * Actual screen display is taken from phaser camera width display
     * Default asset size is taken from init parameter, default to 1080
     * @public
     * @readonly
     * @return {number}
     */
    get screenPercentage()
    {return this.width / this.defaultWidth;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get notchHeight()
    {return this.height * 0.05;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get defaultHeightSpacing()
    {return this.height * 0.04;}

    /**
     * @public
     * @readonly
     * @return {number}
     */
    get defaultWidthSpacing()
    {return this.width * 0.04;}

    // #endregion
}
