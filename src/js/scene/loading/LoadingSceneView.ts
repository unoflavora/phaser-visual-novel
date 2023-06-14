import RectFill 				from "Modules/a3extension/graphic_fill/rect_fill";
import Image 					from "Modules/gameobjects/Image";
import { LoadingAsset } 		from "Assets/AssetLibraryLoading";
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi";
import Text from "Modules/gameobjects/Text";
import { FontAsset } from "Assets/AssetLibraryFont";

export default class LoadingSceneView extends Phaser.GameObjects.Container {

	// UI state
	isInitiated = false;
	loadingValue = 0;
	targetLoadingValue = 0;

	// UI Items
	background: Image;
	frame: Image;
	bar: Image
	progressBar: RectFill;
	logo: Image;
	loadingText: Text;

	constructor(scene : Phaser.Scene, logo : string | null = null, loadingText : string | null = null) {
		super(scene);
		scene.add.existing(this);

		this.background = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, LoadingAsset.background_main.key);
		this.background.transform.setMinPreferredDisplaySize(scene.scale.width, scene.scale.height);
		this.add(this.background.gameobject);

		this.logo = new Image(scene, scene.scale.width * 0.5, scene.scale.height * 0.5, logo ? logo : LoadingAsset.corporate_logo.key);
		this.logo.transform.setDisplayWidth(scene.scale.width * 0.25, true);
		this.add(this.logo.gameobject)


		this.frame = new Image(scene, 0, 0, LoadingAsset.loading_frame.key);
		this.frame.transform.setToOriginalDisplaySize();
		this.frame.transform.setDisplayWidth(scene.scale.width * 0.5, false);
		this.frame.transform.setDisplayHeight(scene.scale.width * 0.04, false);

		this.add(this.frame.gameobject);
		this.frame.gameobject.setPosition(
			scene.scale.width * 0.5,
			scene.scale.height * 0.9,
		);

		this.loadingText = new Text(scene, this.frame.gameobject.x, this.frame.gameobject.y - this.frame.gameobject.displayHeight * 1.1, "Loading...", {
			fontFamily: FontAsset.adobe_caslon_pro_bold.key,
			fontSize: "24px",
			color: "#4B3B33"
		})
		if(loadingText != null) this.loadingText.gameobject.setText(loadingText)
		
		this.loadingText.gameobject.setOrigin(.5)
		this.add(this.loadingText.gameobject)

		this.bar = new Image(scene, this.frame.gameobject.x, this.frame.gameobject.y, LoadingAsset.loading_bar.key);
		this.bar.transform.setDisplaySize(this.frame.gameobject.displayWidth, this.frame.gameobject.displayHeight);
		this.add(this.bar.gameobject)
		this.loadingText.gameobject.setFontSize(this.bar.transform.displayHeight * .65)

		this.progressBar = new RectFill(scene);
		this.progressBar.assignFillAnchor(
			this.frame.gameobject,
			this.frame.gameobject.displayWidth,
			this.frame.gameobject.displayHeight,
			false,
			false
		);
		this.add(this.progressBar)

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
