/**
 * @typedef ButtonExtension
 * @property {boolean} isClicked
 * @property {ButtonExtension.configureTapEvent} configureTapEvent
 */

/**
 * @type ButtonExtension
 */
const ButtonExtension = {
    isClicked: false,

    configureTapEvent: function()
    {
        this.on('pointerdown', () => this.isClicked = true);
        this.on('pointerout', () => this.isClicked = false);
        this.scene.input.on('pointerup', () => this.isClicked = false);
    },
};

export default ButtonExtension;
