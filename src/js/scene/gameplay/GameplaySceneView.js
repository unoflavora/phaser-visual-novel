export default class GameplaySceneView extends Phaser.GameObjects.Container 
{
	constructor(scene) {
		super(scene);
		scene.add.existing(this);
	}

	create = (depth = 0) => {
		this.setDepth(depth);
	};
}
