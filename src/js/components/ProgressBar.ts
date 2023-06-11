import { FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";

export default class ProgressBar extends Container
{
    progressBg : Phaser.GameObjects.Image;
    progressFill : Phaser.GameObjects.Image;
    progressTitle : Phaser.GameObjects.Text;
    progressText : Phaser.GameObjects.Text;

    constructor(scene : Phaser.Scene, x: number, y : number, width : number, height : number, textColor : typeof FontColors[keyof typeof FontColors] = FontColors.darkBrown)
    {
        super(scene, x, y, width, height);
        this.scene.add.existing(this);
        this.progressBg = scene.add.image(0, 0, UIAsset.progress_bg.key);
        this.progressFill = scene.add.image(0, 0, UIAsset.progress_fill.key);


        this.progressTitle = scene.add.text(0, 0, "Title", {
            color: textColor,
            font: "700 Adobe Caslon Pro",
            lineSpacing: scene.scale.height * .005
        });
        this.progressText = scene.add.text(0, 0, "100", {
            color: textColor,
            font: "700 Adobe Caslon Pro",
            lineSpacing: scene.scale.height * .005
        });

        this.layout()
        this.add([this.progressBg, this.progressFill, this.progressTitle, this.progressText]);

    }

    private layout() {
        this.progressTitle.setFontSize(this.displayHeight * .35);
        this.progressTitle.setOrigin(0, .5);
        this.progressTitle.setPosition(this.x, this.y - this.displayHeight * .5);

        this.progressText.setFontSize(this.displayHeight * .45);
        this.progressText.setOrigin(1, .5);
        this.progressText.setPosition(this.x + this.displayWidth, this.progressTitle.y);

        this.progressBg.setDisplaySize(this.displayWidth, this.displayHeight * .5);
        this.progressBg.setOrigin(0, .5);
        this.progressBg.setPosition(this.x, this.y + this.progressTitle.displayHeight * .1);

        this.progressFill.setDisplaySize(this.progressBg.displayWidth * .5, this.progressBg.displayHeight);
        this.progressFill.setPosition(this.progressBg.x, this.progressBg.y);
        this.progressFill.setOrigin(0, .5);       
    }

    public setProgress(title: string, progress : number)
    {
        this.progressTitle.setText(title);
        this.setChildDisplaySize(this.progressFill, this.progressBg.displayWidth * progress, this.progressBg.displayHeight);
        this.progressText.setText(Math.round(progress * 100).toString());
    }
    

}

