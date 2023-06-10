import { UIAsset } from "Assets/AssetLibraryUi";
import Image from "Modules/gameobjects/Image"
import Button from "Modules/gameobjects/Button";
import Text from "Modules/gameobjects/Text"
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import Container from "phaser3-rex-plugins/templates/ui/container/Container";
import { GameResults } from "Definitions/GameResults";
import Localizations from "Modules/localization/LocalizationHelper";

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

        var spacing = this.displayHeight * .15;

        this.icon.transform.setPosition(this.x - this.displayWidth * .38, this.y);
        this.icon.gameobject.setOrigin(.5);
        this.icon.transform.setDisplayWidth(this.displayWidth * .15, true);

        this.title.gameobject.setOrigin(0, .5);
        this.title.transform.setPosition(this.icon.gameobject.x + this.icon.gameobject.displayWidth * .6, this.y - this.displayHeight * .2);
        this.title.gameobject.setFontSize(this.displayHeight * .15);

        this.scoreText.transform.setPosition(this.x + this.displayWidth * .4, this.title.gameobject.y);
        this.scoreText.gameobject.setOrigin(.5);
        this.scoreText.gameobject.setFontSize(this.displayHeight * .1);

        this.scoreNumber.transform.setPosition(this.scoreText.gameobject.x, this.scoreText.gameobject.y + this.scoreText.gameobject.displayHeight * .5);
        this.scoreNumber.gameobject.setOrigin(.5, 0);
        this.scoreNumber.gameobject.setFontSize(this.displayHeight * .45);

        this.dividerLine.gameobject.setOrigin(0);
        this.dividerLine.transform.setPosition(this.icon.gameobject.x + this.icon.gameobject.displayWidth * .65, this.title.gameobject.y + this.title.gameobject.displayHeight * .7);
        this.dividerLine.transform.setDisplaySize(this.displayWidth - this.icon.gameobject.displayWidth - this.scoreNumber.gameobject.displayWidth * 2.5, this.displayHeight * .0025);

        this.takenDate.gameobject.setFontSize(this.displayHeight * .08);
        this.takenDate.transform.setPosition(this.dividerLine.gameobject.x, this.dividerLine.gameobject.y + spacing * .66);
        this.takenDate.gameobject.setOrigin(0, .5);
        this.takenDate.gameobject.setFontStyle("400");

        this.actionButton.transform.setPosition(this.icon.gameobject.x + this.icon.gameobject.displayWidth * .65, this.takenDate.gameobject.y + this.takenDate.gameobject.displayHeight * .25 + spacing);
        this.actionButton.gameobject.setOrigin(.05, .5);
        this.actionButton.transform.setDisplayWidth(this.displayWidth * .12, true);

        this.actionText.transform.setPosition(this.actionButton.gameobject.x + this.actionButton.gameobject.displayWidth * .45, this.actionButton.gameobject.y);
        this.actionText.gameobject.setOrigin(.5);
        this.actionText.gameobject.setFontSize(this.displayHeight * .07);
        this.actionText.gameobject.setColor(FontColors.white);
    }

    public init()
    {
        this.layout()
        this.add(this.bg.gameobject)
        this.add(this.icon.gameobject)
        this.add(this.title.gameobject)
        this.add(this.scoreText.gameobject)
        this.add(this.scoreNumber.gameobject)
        this.add(this.dividerLine.gameobject)
        this.add(this.takenDate.gameobject);
        this.add(this.actionButton.gameobject);
        this.add(this.actionText.gameobject);

    }

    public setResult(result: GameResults)
    {
        this.title.gameobject.setText(result.title);
        this.scoreNumber.gameobject.setText(result.score.toString());
        this.takenDate.gameobject.setText(Localizations.text.mainMenu.overview.takenOn + " " + result.date);
        this.actionText.gameobject.setText(Localizations.text.mainMenu.overview.seeDetails);
        this.scoreText.gameobject.setText(Localizations.text.mainMenu.overview.score);
    }

    public setIcon(iconKey: string)
    {
        this.icon.gameobject.setTexture(iconKey);
    }
}