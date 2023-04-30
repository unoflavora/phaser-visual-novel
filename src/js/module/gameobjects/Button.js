import Transform      from './transform/ImageTransform';
import {EventEmitter} from 'events';

/**
 * @typedef {Object} texturetype
 * @property {string} texture
 * @property {number} frame
 */

/**
 * @typedef {Object} texturebutton
 * @property {texturetype} normal
 * @property {texturetype} [highlight]
 * @property {texturetype} [pressed]
 * @property {texturetype} [disable]
 */

/**
 * This class is a gameobject to manage Button Type Object
 */
export default class Button
{
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} texture normal texture
     * @param {number} frame
     * @param {string} [audio]
     */
    constructor(scene, x, y, texture, frame = 0, audio)
    {
        /** @private @type {Phaser.Scene} */
        this.scene = scene;

        /** @type {Phaser.GameObjects.Container} */
        this.container = this.scene.add.container(0, 0);

        /** @public @readonly @type {Phaser.GameObjects.Image} */
        this.gameobject = this.scene.add.image(x, y, texture, frame);
        this.gameobject.setInteractive();
        this.container.add(this.gameobject);

        /** @public @readonly @type {Transform} */
        this.transform = new Transform(this.gameobject);

        /** @public @readonly @type {boolean} */
        this.isInteractive = false;

        /** @public @readonly @type {boolean} */
        this.isAudioActive = false;

        /** @private @type {texturebutton} */
        this._textures = {
            normal: {
                texture,
                frame,
            },
            pressed: {
                texture,
                frame,
            },
            highlight: {
                texture,
                frame,
            },
            disable: {
                texture,
                frame,
            },
        };

        /** @private @type {string|undefined} */
        this._audioKey = audio;

        /** @private @type {EventEmitter} */
        this._event = new EventEmitter();

        /** @private @type {boolean} */
        this._isClicking = false;

        /** @private @type {boolean} */
        this._isCursorInside = false;

        this.gameobject.setInteractive();
        this.setInteractive(true);
        this.setAudioActive(!!this._audioKey);

        this.gameobject.on('pointerover', () =>
        {
            this._isCursorInside = true;

            if (!this.isInteractive) return;

            if (!this._isClicking && this._textures.highlight)
            {
                this.gameobject.setTexture(
                    this._textures.highlight.texture,
                    this._textures.highlight.frame ? this._textures.highlight.frame : 0,
                );
            }
        });
        this.gameobject.on('pointerout', () =>
        {
            this._isCursorInside = false;
            this._isClicking = false;

            if (!this.isInteractive) return;

            try
            {
                this.gameobject.setTexture(
                    this._textures.normal.texture,
                    this._textures.normal.frame ? this._textures.normal.frame : 0,
                );
            }
            catch
            {console.warn('button out throws an exception');}
            this._event.emit('pointerout');
        });
        this.gameobject.on('pointerdown', () =>
        {
            if (!this.isInteractive) return;

            this._isClicking = true;
            try
            {
                if (this._textures.pressed)
                {
                    this.gameobject.setTexture(
                        this._textures.pressed.texture,
                        this._textures.pressed.frame ? this._textures.pressed.frame : 0,
                    );
                }
            }
            catch
            {console.warn('button down throws an exception');}


            this._event.emit('pointerdown');
        });
        this.gameobject.on('pointerup', () =>
        {
            if (!this.isInteractive) return;

            try
            {
                if (this._isCursorInside)
                {
                    if (this._textures.highlight)
                    {
                        this.gameobject.setTexture(
                            this._textures.highlight.texture,
                            this._textures.highlight.frame ? this._textures.highlight.frame : 0,
                        );
                    }
                    else
                    {
                        this.gameobject.setTexture(
                            this._textures.normal.texture,
                            this._textures.normal.frame ? this._textures.normal.frame : 0,
                        );
                    }
                }
                else
                {
                    this.gameobject.setTexture(
                        this._textures.normal.texture,
                        this._textures.normal.frame ? this._textures.normal.frame : 0,
                    );
                }

                if (this._isClicking)
                {
                    this._event.emit('click');
                    if (this.isAudioActive && this._audioKey)
                    {this.scene.game.sound.play(this._audioKey);}
                }
            }
            catch
            {console.warn('button up throws an exception');}

            this._isClicking = false;
        });
    }

    /**
     * Function to set button Interactive
     * @public
     * @param {boolean} value
     */
    setInteractive = (value) =>
    {
        this.isInteractive = value;
        if (this.isInteractive)
        {
            // this.gameobject.setInteractive();
            if (this._isCursorInside && this._textures.highlight)
            {
                this.gameobject.setTexture(this._textures.highlight.texture, this._textures.highlight.frame);
            }
            else
            {
                this.gameobject.setTexture(this._textures.normal.texture, this._textures.normal.frame);
            }
        }
        else
        {
            // /this.gameobject.disableInteractive();
            if (this._textures.disable)
            {
                this.gameobject.setTexture(
                    this._textures.disable.texture,
                    this._textures.disable.frame ? this._textures.disable.frame : 0,
                );
            }
        }
    };

    /**
     * Function to toggle Interactive
     */
    toggleInteractive = () =>
    {
        this.setInteractive(!this.isInteractive);
    };

    /**
     * Function to set audio active / not
     * @public
     * @param {boolean} value
     */
    setAudioActive = (value) =>
    {
        this.isAudioActive = value;
    };

    /**
     * Function to toggle Audio Active
     */
    toggleAudioActive = () =>
    {
        this.setAudioActive(!this.isAudioActive);
    };

    /**
     * Function to add texture based on button state
     * @param {texturetype} [pressed]
     * @param {texturetype} [highlight]
     * @param {texturetype} [disable]
     */
    addTexture = (pressed, highlight, disable) =>
    {
        if (pressed)
        {
            this._textures.pressed = pressed;
        }
        if (highlight)
        {
            this._textures.highlight = highlight;
        }
        if (disable)
        {
            this._textures.disable = disable;
        }
    };

    /**
     * @param {string} texture
     * @param {string} frame
     */
    setNormalTexture = (texture, frame = 0) =>
    {
        this.gameobject.setTexture(texture, frame);

        this._textures.normal.texture = texture;
        this._textures.normal.frame = frame;
    };

    /**
     * @param {string} texture
     * @param {string} frame
     */
    setHighlightTexture = (texture, frame = 0) =>
    {
        this._textures.highlight.texture = texture;
        this._textures.highlight.frame = frame;
    };

    /**
     * @param {string} texture
     * @param {string} frame
     */
    setPressedTexture = (texture, frame = 0) =>
    {
        this._textures.pressed.texture = texture;
        this._textures.pressed.frame = frame;
    };

    /**
     * @param {string} texture
     * @param {string} frame
     */
    setDisabledTexture = (texture, frame = 0) =>
    {
        this._textures.disable.texture = texture;
        this._textures.disable.frame = frame;
    };

    /**
     * @callback onTransformUpdateCallback
     * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text} gameobject
     */

    /**
     * @param {Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text} gameobject
     * @param {onTransformUpdateCallback} onTransformUpdate
     */
    add = (gameobject, onTransformUpdate = () => {}) =>
    {
        this.container.add(gameobject);
        this.transform.registerOnTransformUpdate(onTransformUpdate);
    };

    /**
     * @param {Array<Phaser.GameObjects.Sprite | Phaser.GameObjects.Image | Phaser.GameObjects.Text>} gameobjects
     * @param {onTransformUpdateCallback} onTransformUpdate
     */
    adds = (gameobjects, onTransformUpdate = () => {}) =>
    {
        gameobjects.forEach((Element) =>
        {
            this.add(Element, onTransformUpdate);
        });
    };

    click = {
        /**
         * Register function On Button Click
         * @param {function} event
         */
        on: (event) =>
        {
            this._event.on('click', event);
        },

        /**
         * Register function Once Button Click
         * @param {function} event
         */
        once: (event) =>
        {
            this._event.once('click', event);
        },

        /**
         * Remove function On Button Click
         * @param {function} event
         */
        off: (event) =>
        {
            this._event.off('click', event);
        },

        removeAllListeners: () =>
        {
            this._event.removeAllListeners('click');
        },
    };

    pointerDown = {
        on: (event) =>
        {
            this._event.on('pointerdown', event);
        },
    };

    pointerOut = {
        on: (event) =>
        {
            this._event.on('pointerout', event);
        },
    };

    removeAllListener = () =>
    {
        this._event.removeAllListeners('click');
    };
}
