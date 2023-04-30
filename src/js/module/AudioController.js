const fadeConfiguration = {
    duration: 500,
};

/**
 * This class is a module to manage Audio within the scene it initiated
 */
export default class AudioController
{
    /**
     * @type {Phaser.Scene}
     * @private
     */
    scene;
    /**
     * @type {Phaser.Sound.BaseSound}
     * @public
     */
    bgm;
    /**
     * @type {boolean}
     */
    onMute = false;

    // #region singleton
    /** @type {AudioController} */
    static instance;

    /** @return {AudioController} */
    static getInstance = () =>
    {
        if (!AudioController.instance)
        {AudioController.instance = new AudioController();}

        return AudioController.instance;
    };
    // #endregion

    /**
     * Function to Initialize Screen Utility
     * @param {Phaser.Scene} scene
     * @param {boolean} onMute
     * @return {Promise}
     */
    init = (scene, onMute = true) =>
    {
        return new Promise((resolve) =>
        {
            this.scene = scene;

            const pause = () =>
            {this.scene.sound.mute = true;};
            const resume = () =>
            {this.scene.sound.mute = this.onMute || false;};

            this.scene.game.events.addListener(Phaser.Core.Events.BLUR,
                () => {pause();}, this);

            this.scene.game.events.addListener(Phaser.Core.Events.VISIBLE,
                () => {resume();}, this);

            this.scene.game.events.addListener(Phaser.Core.Events.HIDDEN,
                () => {pause();}, this);

            this.scene.game.events.addListener(Phaser.Core.Events.FOCUS,
                () => {resume();}, this);

            this.toggleMute(onMute);
            resolve();
        });
    };

    /**
     * @param {boolean} toggle
     */
    toggleMute = (toggle = true) =>
    {this.scene.sound.mute = this.onMute = toggle;};

    /**
     * @param {string} key
     * @param {boolean} fadeIn
     */
    playBGM = (key, fadeIn = false) =>
    {
        const config = {
            loop: -1,
            volume: fadeIn ? 0 : 1,
        };

        if (this.bgm) this.stopBGM(fadeIn);
        this.bgm = this.scene.sound.add(key, config);
        this.bgm.play();

        if (!fadeIn) return;
        this.scene.tweens.add({
            ...fadeConfiguration,
            targets: this.bgm,
            volume: 1,
        });
    };

    // #region TODO : Move to Tween Helper

    /**
     * @param {object| Phaser.Tweens.Tween} target - Phaser.Tweens.Tween
     * @return {Promise}
     */
    waitUntilTweenComplete = (target) =>
    {
        return new Promise((resolve) =>
        {
            if (!target) return resolve();
            target.on('complete', () => resolve());
        });
    };
    // #endregion

    /**
     * @param {boolean} fadeOut
     */
    stopBGM = (fadeOut = false) =>
    {
        const bgm = this.bgm;
        this.bgm = undefined;
        this.waitUntilTweenComplete(this.bgmFadeTween).then(() =>
        {
            if (!bgm) return;
            if (fadeOut)
            {
                this.bgmFadeTween = this.scene.tweens.add(
                    {
                        ...fadeConfiguration,
                        targets: bgm,
                        volume: 0,
                        onComplete: () =>
                        {
                            this.bgmFadeTween = undefined;
                            this.stop(bgm.key);
                        },
                    });
            }
            else
            {this.stop(bgm.key);}
        });
    };

    /**
     * @param {number} value
     * @param {boolean} fade
     */
    setBGMVolume = (value, fade = true) =>
    {
        if (fade)
        {
            this.scene.tweens.add({
                targets: this.bgm,
                volume: value,
                duration: 300,
            });
        }
        else
        {this.bgm.volume = value;}
    };

    /**
     * @param {string} key
     * @param {boolean} checkOverlap
     */
    play = (key, checkOverlap = false) =>
    {
        if (checkOverlap && this.scene.sound.get(key)) return;
        this.scene.sound.play(key);
    };

    /**
     * @param {string} key
     */
    stop(key)
    {
        const correspondingSound = this.scene.sound.get(key);
        if (!correspondingSound) return;
        correspondingSound.stop();
        this.scene.sound.remove(correspondingSound);
    }
}
