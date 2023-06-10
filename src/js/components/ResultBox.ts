import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image"
import Button from "Modules/gameobjects/Button";
import Text from "Modules/gameobjects/Text"
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import { GameResults } from "Definitions/GameResults";

export default class ResultBox extends Container
{
    // UI Objects
    bg : Image;
    title: Text;
    dividerLine : Image;
    takenDate : Text;
    scoreText: Text;
    scoreNumber: Text;
    icon: Image;
    actionButton: Button;
    actionText: Text;

    private readonly textStyle = {
        color: FontColors.darkBrown,
        fontFamily: FontAsset.adobe_caslon_pro_bold.key
    };


    constructor(scene : Phaser.Scene, x : number, y: number)
    {
        super(scene, x, y)
        scene.add.existing(this)

        this.bg = new Image(scene, 0, 0, UIAsset.result_box.key);

        this.icon = new Image(scene, 0, 0, UIAsset.icon_bgm.key);

        this.title = new Text(scene, 0, 0, "Result", this.textStyle);

        this.dividerLine = new Image(scene, 0, 0, UIAsset.line_divider.key);

        this.takenDate = new Text(scene, 0, 0, "Taken on: ", this.textStyle);

        this.scoreText = new Text(scene, 0, 0, "Score ", this.textStyle);

        this.scoreNumber = new Text(scene, 0, 0, "95", this.textStyle);

        this.actionButton = new Button(scene, 0, 0, UIAsset.button_frame_primary.key);

        this.actionText = new Text(scene, 0, 0, "See Details", this.textStyle);

    }

    public layout()
    {
        this.bg.transform.setDisplayWidth(this.displayWidth, true);
        this.bg.transform.setPosition(this.x, this.y);
        this.add(this.bg.gameobject)

        var spacing = this.bg.gameobject.displayHeight * .125;

        this.icon.transform.setPosition(this.x - this.displayWidth * .38, this.y);
        this.icon.gameobject.setOrigin(.5);
        this.icon.transform.setDisplayWidth(this.displayWidth * .15, true);
        this.add(this.icon.gameobject)

        this.title.gameobject.setOrigin(0.4, .5);
        this.title.transform.setPosition(this.icon.gameobject.x + this.icon.gameobject.displayWidth, this.y - this.bg.gameobject.displayHeight * .25);
        this.title.gameobject.setFontSize(this.bg.gameobject.displayHeight * .15);
        this.add(this.title.gameobject)

        this.scoreText.transform.setPosition(this.bg.gameobject.x + this.bg.gameobject.displayWidth * .4, this.title.gameobject.y);
        this.scoreText.gameobject.setOrigin(.5);
        this.scoreText.gameobject.setFontSize(this.bg.gameobject.displayHeight * .1);
        this.add(this.scoreText.gameobject)

        this.scoreNumber.transform.setPosition(this.scoreText.gameobject.x, this.scoreText.gameobject.y + this.scoreText.gameobject.displayHeight * .5);
        this.scoreNumber.gameobject.setOrigin(.5, 0);
        this.scoreNumber.gameobject.setFontSize(this.bg.gameobject.displayHeight * .45);
        this.add(this.scoreNumber.gameobject)

        this.dividerLine.transform.setDisplaySize(this.bg.gameobject.displayWidth - this.icon.gameobject.displayWidth - this.scoreNumber.gameobject.displayWidth * 2.5, this.displayHeight * .0025);
        this.dividerLine.gameobject.setOrigin(0);
        this.dividerLine.transform.setPosition(this.title.gameobject.x - this.title.gameobject.displayWidth * .5, this.title.gameobject.y + spacing);
        this.add(this.dividerLine.gameobject)

        this.takenDate.gameobject.setFontSize(this.bg.gameobject.displayHeight * .08);
        this.takenDate.transform.setPosition(this.title.gameobject.x - this.title.gameobject.displayWidth * .45, this.dividerLine.gameobject.y + spacing);
        this.takenDate.gameobject.setOrigin(0, .5);
        this.takenDate.gameobject.setFontStyle("400");
        this.add(this.takenDate.gameobject);

        this.actionButton.transform.setPosition(this.title.gameobject.x - this.title.gameobject.displayWidth * .5, this.takenDate.gameobject.y + this.takenDate.gameobject.displayHeight * .25 + spacing);
        this.actionButton.gameobject.setOrigin(0, .25);
        this.actionButton.transform.setDisplayWidth(this.displayWidth * .12, true);
        this.add(this.actionButton.gameobject);

        this.actionText.transform.setPosition(this.actionButton.gameobject.x + this.actionButton.gameobject.displayWidth * .5, this.actionButton.gameobject.y + this.actionButton.gameobject.displayHeight * .25);
        this.actionText.gameobject.setOrigin(.5);
        this.actionText.gameobject.setFontSize(this.bg.gameobject.displayHeight * .07);
        this.actionText.gameobject.setColor(FontColors.white);
        this.add(this.actionText.gameobject);
    }

    public setResult(result: GameResults)
    {
        this.title.gameobject.setText(result.title);
        this.scoreNumber.gameobject.setText(result.score.toString());
        this.takenDate.gameobject.setText("Taken on " + result.date);
    }
}