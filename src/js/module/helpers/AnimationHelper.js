/**
 * @enum {string}
 */
export const AnimationType = {
	SEQUENCE: "SEQUENCE",
	FRAMES: "FRAMES",
	SPINE: "SPINE",
};

/**
 * @typedef AnimationInfo
 * @property {string} key
 * @property {AnimationType} type
 * @property {string} spritesheet
 * @property {number} start
 * @property {number} end
 * @property {number} frameSpeed
 * @property {boolean} loop
 * @property {number} repeatDelay
 * @property {boolean} yoyo
 */

export default class AnimationHelper {
	/**
	 * Function to create animation
	 * @param {Phaser.Scene} scene
	 * @param {string} name Animation Key
	 * @param {string} textureKey
	 * @param {Array<number>} frames
	 * @param {number} framerate
	 * @param {boolean} loop
	 * @param {number} repeatDelay
	 * @return {Phaser.Animations.Animation | false}
	 */
	static addFrames(scene, name, textureKey, frames, framerate, loop, repeatDelay = 0) {
		const frameList = frames.map((value) => {
			return {
				key: textureKey,
				frame: value,
			};
		});

		return scene.anims.create({
			key: name,
			frames: frameList,
			frameRate: framerate,
			repeat: loop,
			repeatDelay: repeatDelay ? repeatDelay : 0,
		});
	}

	/**
	 * Function to create animation from sequence
	 * @param {Phaser.Scene} scene
	 * @param {string} name
	 * @param {string} textureKey
	 * @param {number} start
	 * @param {number} end
	 * @param {number} framerate
	 * @param {boolean} loop
	 * @param {number} repeatDelay
	 * @return {Phaser.Animations.Animation | false}
	 */
	static AddSequence(scene, name, textureKey, start, end, framerate, loop, repeatDelay = 0) {
		const frames = scene.anims.generateFrameNumbers(textureKey, { start, end });

		return scene.anims.create({
			key: name,
			frames: frames,
			frameRate: framerate,
			repeat: loop,
			repeatDelay: repeatDelay ? repeatDelay : 0,
		});
	}

	/**
	 * Function to create animation from AnimationType object
	 * @param {Phaser.Scene} scene
	 * @param  {AnimationInfo} info
	 * @return {Phaser.Animations.Animation | false}
	 */
	static AddAnimation(scene, info) {
		if (info.type === AnimationType.FRAMES) {
			return this.addFrames(
				scene,
				info.key,
				info.spritesheet,
				info.frames,
				info.frameSpeed,
				info.loop,
				info.repeatDelay
			);
		} else {
			return this.AddSequence(
				scene,
				info.key,
				info.spritesheet,
				info.start,
				info.end,
				info.frameSpeed,
				info.loop,
				info.repeatDelay
			);
		}
	}

	/**
	 * Function to add several animations for one scene
	 * @param {Phaser.Scene} scene
	 * @param {Object} animationListObject Custom object containing the animations
	 */
	static AddAnimationList(scene, animationListObject) {
		for (const animKey in animationListObject) {
			if (!{}.hasOwnProperty.call(animationListObject, animKey)) continue;
			const anim = animationListObject[animKey];
			this.AddAnimation(scene, anim);
		}
	}
}
