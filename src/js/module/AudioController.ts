const fadeConfiguration = {
    duration: 500,
};

/**
 * This class is a module to manage Audio within the scene it initiated
 */
export default class AudioController
{
    scene! : Phaser.Scene;
    bgm! : Phaser.Sound.BaseSound;
    bgmFadeTween : Phaser.Tweens.Tween | undefined;
    onMute = false;
    public muteBgm = false;

    static _instance : AudioController;

    static get instance() : AudioController
    {
        if (!AudioController._instance)
        {
            AudioController._instance = new AudioController();
        }

        return AudioController._instance;
    };

    public set turnOnBgm (value : boolean) {
        this.muteBgm = value;

        this.setBGMVolume(value ? 1 : 0, false);
    }

    
    /**
     * Function to Initialize Screen Utility
     * @param {Phaser.Scene} scene
     * @param {boolean} onMute
     * @return {Promise}
     */
    init = (scene : Phaser.Scene, onMute = true) =>
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
            () => {
                console.log("FOCUS")
                resume();
            }, this);

        this.toggleMute(onMute);
    };

    /**
     * @param {boolean} toggle
     */
    toggleMute = (toggle = true) =>
    {
        this.scene.sound.mute = this.onMute = toggle;
    };

    /**
     * @param {string} key
     * @param {boolean} fadeIn
     */
    playBGM = (key:string, fadeIn = false) =>
    {
        if(this.bgm?.key == key) return;

        const config = {
            loop: true,
            volume: fadeIn ? 0 : 1,
        };

        if (this.bgm) this.stopBGM(fadeIn);


        this.bgm = this.scene.sound.add(key, {...config});
        this.bgm.play();

        if (!fadeIn) return;
        this.scene.tweens.add({
            ...fadeConfiguration,
            targets: this.bgm,
            volume: 1,
        });

        if (this.muteBgm)
        {
            this.setBGMVolume(0);
        }
    };

    // #region TODO : Move to Tween Helper

    /**
     * @param {object| Phaser.Tweens.Tween} target - Phaser.Tweens.Tween
     * @return {Promise}
     */
    waitUntilTweenComplete = (target: Phaser.Tweens.Tween) =>
    {
        return new Promise<void>((resolve) =>
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
        this.bgm.stop();

        if(this.bgmFadeTween)
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
    setBGMVolume = (value: number, fade = true) =>
    {
        if(this.bgm == null) return;

        if (fade)
        {
            this.scene.tweens.add({
                targets: this.bgm.manager,
                volume: value,
                duration: 300,
            });
        }
        else
        {
            this.bgm.manager.volume = value;
        }
    };



    /**
     * @param {string} key
     * @param {boolean} checkOverlap
     */
    play = (key :string, checkOverlap = false) =>
    {
        if (checkOverlap && this.scene.sound.get(key)) return;
        this.scene.sound.play(key);
    };

    /**
     * @param {string} key
     */
    stop(key : string)
    {
        const correspondingSound = this.scene.sound.get(key);
        if (!correspondingSound) return;
        correspondingSound.stop();
        this.scene.sound.remove(correspondingSound);
    }
}
