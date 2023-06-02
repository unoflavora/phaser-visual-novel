const fadeConfiguration = {
    duration: 500,
};

/**
 * This class is a module to manage Audio within the scene it initiated
 */
export default class AudioController
{
    scene! : Phaser.Scene;
    bgmFadeTween : Phaser.Tweens.Tween | undefined;
    onMute = false;
    bgm! : Phaser.Sound.BaseSound;
    private _bgmOn = true;

    private _sfxOn: boolean = true;
    
    static _instance : AudioController;

    static get instance() : AudioController
    {
        if (!AudioController._instance)
        {
            AudioController._instance = new AudioController();
        }

        return AudioController._instance;
    };

    public TurnOnBgm (isOn : boolean) {
        this._bgmOn = isOn;

        if(this.bgm == null) return;

        if(isOn && !this.bgm.isPlaying)
        {
            this.bgm.resume();
        }
        else if(!isOn && this.bgm.isPlaying)
        {
            this.bgm.pause();
        }
    }
    
    public get bgmOn()
    {
        return this._bgmOn;
    }


    public TurnOnSfx(isOn : boolean) {
        this._sfxOn = isOn;
    }

    public get sfxOn()
    {
        return this._sfxOn;
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
            volume: this._bgmOn ? 
                (fadeIn ? 0 : 1) : 0,
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

        if (!this._bgmOn)
        {
            this.bgm.stop();
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
     * @param {string} key
     * @param {boolean} checkOverlap
     */
    play = (key :string, checkOverlap = false) =>
    {
        if (checkOverlap && this.scene.sound.get(key)) return;

        if (this._sfxOn == false) return

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
