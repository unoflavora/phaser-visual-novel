import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi"
import Image from "Modules/gameobjects/Image"

export default class CompletedSceneView extends Phaser.GameObjects.Group
{
    constructor(scene : Phaser.Scene)
    {
        super(scene)
    }

    create()
    {
        var bg = new Image(this.scene, 0,0, BackgroundAsset.background_main.key)
        bg.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height)
    }
}