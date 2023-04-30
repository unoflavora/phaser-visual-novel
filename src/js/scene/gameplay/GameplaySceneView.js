export default class GameplaySceneView extends Phaser.GameObjects.Container {
	constructor(scene) {
		super(scene);
		scene.add.existing(this);
	}

	/**
	 * @param {number} depth
	 */
	create = (depth = 0) => {
		this.setDepth(depth);
	};
}
