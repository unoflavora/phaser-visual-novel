import RectFill 				from "Modules/a3extension/graphic_fill/rect_fill";
import Image 					from "Modules/gameobjects/Image";
import { LoadingAsset } 		from "Assets/AssetLibraryLoading";

export default class LoadingSceneView extends Phaser.GameObjects.Container {

	// UI state
	isInitiated = false;
	loadingValue = 0;
	targetLoadingValue = 0;

	// UI Items
	background: Image | undefined;
	frame: Image | undefined;
	bar: Image | undefined
	progressBar: RectFill | undefined;

	constructor(scene : Phaser.Scene) {
		super(scene);
		scene.add.existing(this);

		this.background = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, LoadingAsset.loading_bg.key);
		this.background.transform.setMinPreferredDisplaySize(scene.scale.width, scene.scale.height);
		this.add(this.background.gameobject);

		this.frame = new Image(scene, 0, 0, LoadingAsset.loading_frame.key);
		this.frame.transform.setToOriginalDisplaySize();
		this.frame.transform.setDisplayWidth(scene.scale.width * 0.9, true);
		this.add(this.frame.gameobject);
		this.frame.gameobject.setPosition(
			scene.scale.width * 0.5,
			scene.scale.height * 0.5,
		);

		this.bar = new Image(scene, this.frame.gameobject.x, this.frame.gameobject.y, LoadingAsset.loading_bar.key);
		this.bar.transform.setDisplaySize(this.frame.gameobject.displayWidth, this.frame.gameobject.displayHeight);

		this.progressBar = new RectFill(scene);
		this.progressBar.assignFillAnchor(
			this.frame.gameobject,
			this.frame.gameobject.displayWidth,
			this.frame.gameobject.displayHeight,
			false,
			false
		);

		this.bar.gameobject.setMask(this.progressBar.createGeometryMask());
		this.progressBar.visible = false;
	}

	setBar = (value : number) => 
	{
		if(this.progressBar != null)
		{
			this.progressBar.fillValue = value;
		}
	};

	setLoadingValue = (value : number) => 
	{
		this.targetLoadingValue = value;
		this.loadingValue = value;
		this.setBar(value);
	};

	/**
	 * @param {number} value
	 */
	setTargetLoadingValue = (value : number) => {
		this.targetLoadingValue = value;
	};

	update = () => {
		if (this.targetLoadingValue === this.loadingValue) return;

		this.loadingValue = Math.min(this.loadingValue + 0.05, this.targetLoadingValue);
		this.setBar(this.loadingValue);
	};
}
