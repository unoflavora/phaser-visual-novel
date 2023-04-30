import Transform      from './transform/ImageTransform';
import {EventEmitter} from 'events';

/**
 * This class is a gameobject to manage Sprite Type Object
 */
export default class Spine
{
    /**
     * @param {Phaser.Scene} scene
     * @param {Number} x
     * @param {Number} y
     * @param {String} texture
     * @param {string} anim
     * @param {boolean} loop
     */
    constructor(scene, x, y, texture, anim, loop)
    {
        /** @type {string} */
        this.texture = texture;

        /** @private @type {Phaser.Scene} */
        this.scene = scene;

        this.gameobject = this.scene.add.spine(x, y, texture, anim, loop);

        this.gameobject.customParams = {
            skin: 0,
            animation: 0,
            attachment: 0,
        };

        /** @public @readonly @type {Transform} */
        this.transform = new Transform(this.gameobject);

        this.event = new EventEmitter();

        this.eventName = {
            onAnimationComplete: 'onAnimationComplete',
            onClick: 'onClick',
            onPointerDown: 'onPointerDown',
            onPointerOut: 'onPointerOut',
        };

        this.gameobject.on('complete', (track) =>
        {
            this.event.emit(this.eventName.onAnimationComplete, track.animation.name);
        });
        this.isClicking = false;
        this.gameobject.on('pointerdown', () =>
        {
            this.isClicking = true;
            this.event.emit(this.eventName.onPointerDown);
        }, this);

        this.gameobject.on('pointerout', () =>
        {
            this.event.emit(this.eventName.onPointerOut);
            if (!this.isClicking)
            {
                return;
            }
            this.isClicking = false;
            this.event.emit(this.eventName.onClick);
        }, this);
    }

    click = {
        on: (event) =>
        {
            this.event.on(this.eventName.onClick, event);
        },
        once: (event) =>
        {
            this.event.once(this.eventName.onClick, event);
        },
        removeListerner: (event) =>
        {
            this.event.removeListener(this.eventName.onClick, event);
        },
        removeAllListerners: () =>
        {
            this.event.removeAllListeners(this.eventName.onClick);
        },
    };

    pointerOut = {
        on: (event) =>
        {
            this.event.on(this.eventName.onPointerOut, event);
        },
        once: (event) =>
        {
            this.event.once(this.eventName.onPointerOut, event);
        },
        removeListerner: (event) =>
        {
            this.event.removeListener(this.eventName.onPointerOut, event);
        },
        removeAllListerners: () =>
        {
            this.event.removeAllListeners(this.eventName.onPointerOut);
        },
    };

    pointerDown = {
        on: (event) =>
        {
            this.event.on(this.eventName.onPointerDown, event);
        },
        once: (event) =>
        {
            this.event.once(this.eventName.onPointerDown, event);
        },
        removeListerner: (event) =>
        {
            this.event.removeListener(this.eventName.onPointerDown, event);
        },
        removeAllListerners: () =>
        {
            this.event.removeAllListeners(this.eventName.onPointerDown);
        },
    };

    /**
     *
     * @param {boolean} active
     */
    setInteractive = (active) =>
    {
        this.gameobject.setInteractive(active);
    };

    /**
     *
     * @param {string} animation
     * @param {Function} event
     */
    registerOnceAnAnimationComplete = (animation, event) =>
    {
        const animationCheck = (animKey) =>
        {
            if (animKey == animation)
            {
                event();
                this.event.removeListener(this.eventName.onAnimationComplete, animationCheck);
            }
        };
        this.event.removeAllListeners(this.eventName.onAnimationComplete);
        this.event.on(this.eventName.onAnimationComplete, animationCheck);
    };

    /**
     * Sets the current animation for a track, discarding any queued animations.
     * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
     *
     * Animations are referenced by a unique string-based key, as defined in the Spine software.
     * @param {string} animation - The string-based key of the animation to play.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     */
    play = (animation, loop = false, ignoreIfPlaying = false) =>
    {this.gameobject.play(animation, loop, ignoreIfPlaying);};

    /**
     * @return {Array<spine.Slot>}
     */
    getSlots = () =>
    {
        return this.gameobject.skeleton.slots;
    };

    /**
     * @param {string} slotName
     * @param {string} attachmentName
     */
    setAttachment = (slotName, attachmentName) =>
    {
        this.gameobject.skeleton.setAttachment(slotName, attachmentName);
    };

    /**
     * Returns the current animation being played on the given track, if any.
     * @param {integer} [trackIndex=0] - The track to return the current animation on.
     *
     * @return {string} The current Animation on the given track, or `undefined` if there is no current animation.
     */
    getCurrentAnimation = (trackIndex) =>
    {
        return this.gameobject.getCurrentAnimation(trackIndex);
    };

    /**
     * Sets the skin used to look up attachments before looking in the defaultSkin.
     *
     * Attachments from the new skin are attached if the corresponding attachment from the
     * old skin was attached. If there was no old skin, each slot's setup mode attachment is
     * attached from the new skin.
     *
     * After changing the skin, the visible attachments can be reset to those attached in the
     * setup pose by calling setSlotsToSetupPose. Also, often apply is called before the next time
     * the skeleton is rendered to allow any attachment keys in the current animation(s) to hide
     * or show attachments from the new skin.
     * @param {string} skinName - The name of the skin to set.
     */
    setSkinByName = (skinName) =>
    {
        this.gameobject.setSkinByName(skinName);
    };

    /**
     * Sets the current animation for a track, discarding any queued animations.
     * If the formerly current track entry was never applied to a skeleton, it is replaced (not mixed from).
     *
     * Animations are referenced by a unique string-based key, as defined in the Spine software.

     * @param {integer} trackIndex - The track index to play the animation on.
     * @param {string} animationName - The string-based key of the animation to play.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {boolean} [ignoreIfPlaying=false] - If this animation is already playing then ignore this call.
     */
    setAnimation = (trackIndex, animationName, loop, ignoreIfPlaying) =>
    {
        this.gameobject.setAnimation(trackIndex, animationName, loop, ignoreIfPlaying);
    };

    /**
     * Adds an animation to be played after the current or last queued animation for a track.
     * If the track is empty, it is equivalent to calling setAnimation.
     *
     * Animations are referenced by a unique string-based key, as defined in the Spine software.
     *
     * The delay is a float. If > 0, sets delay. If <= 0, the delay set is the duration of the previous
     * track entry minus any mix duration (from the AnimationStateData) plus the specified delay
     * (ie the mix ends at (delay = 0) or before (delay < 0) the previous track entry duration).
     * If the previous entry is looping, its next loop completion is used instead of its duration.
     * @param {integer} trackIndex - The track index to add the animation to.
     * @param {string} animationName - The string-based key of the animation to add.
     * @param {boolean} [loop=false] - Should the animation be looped when played?
     * @param {integer} [delay=0] - A delay, in ms, before which this animation will start when played.
     * @return {spine.TrackEntry}
     * */
    addAnimation = (trackIndex, animationName, loop, delay) =>
    {
        return this.gameobject.addAnimation(trackIndex, animationName, loop, delay);
    };

    /**
     * Removes all animations from the track, leaving skeletons in their current pose.
     *
     * It may be desired to use setEmptyAnimation to mix the skeletons back to the setup pose,
     * rather than leaving them in their current pose.
     * @param {integer} trackIndex - The track index to add the animation to.
     * @return {Spine}
     */
    clearTrack = (trackIndex) =>
    {
        this.gameobject.state.clearTrack(trackIndex);

        return this.gameobject;
    };

    /**
     * Finds an attachment by looking in the skin and defaultSkin using the slot
     * index and attachment name. First the skin is checked and if the attachment was not found,
     * the default skin is checked.
     * @param {integer} slotIndex - The slot index to search.
     * @param {string} attachmentName - The attachment name to look for.
     * @return {spine.Attachment}
     */
    getAttachment = (slotIndex, attachmentName) =>
    {
        return this.gameobject.skeleton.getAttachment(slotIndex, attachmentName);
    };

    /**
     * Finds an attachment by looking in the skin and defaultSkin using the slot name and attachment name.
     * @param {string} slotName - The slot name to search.
     * @param {string} attachmentName - The attachment name to look for.
     * @return {spine.Attachment}
     */
    getAttachmentByName = (slotName, attachmentName) =>
    {
        return this.gameobject.getAttachmentByName(slotName, attachmentName);
    };

    /**
     * Sets the mix duration when changing from the specified animation to the other.
     * @param {string} fromName - The animation to mix from.
     * @param {string} toName - The animation to mix to.
     * @param {number} [duration] - Seconds for mixing from the previous animation to this animation.
     * Defaults to the value provided by AnimationStateData getMix
     * based on the animation before this animation (if any).
     * @return {Spine}
     */
    setMix = (fromName, toName, duration) =>
    {
        this.gameobject.setMix(fromName, toName, duration);
        return this;
    };

    /**
     * Sets the slots and draw order to their setup pose values.
     *
     * @method SpineGameObject#setSlotsToSetupPose
     * @since 3.19.0
     *
     * @return {SpineGameObject} This Game Object.
     */
    setSlotsToSetupPose = () =>
    {
        return this.gameobject.setSlotsToSetupPose();
    };

    /**
     * Sets the bones and constraints to their setup pose values.
     * @return {SpineGameObject}
     */
    setBonesToSetupPose = () =>
    {
        return this.gameobject.setBonesToSetupPose();
    };
}
