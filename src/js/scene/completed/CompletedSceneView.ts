import { FontAsset, FontColors } from "Assets/AssetLibraryFont"
import { BackgroundAsset, UIAsset } from "Assets/AssetLibraryUi"
import { LanguageEnum } from "Definitions/Settings"
import Button from "Modules/gameobjects/Button"
import Image from "Modules/gameobjects/Image"
import Text from "Modules/gameobjects/Text"
import Localizations from "Modules/localization/LocalizationHelper"
import MainSceneController from "Scenes/MainSceneController"
import ContainerLite from "phaser3-rex-plugins/plugins/containerlite"

export default class CompletedSceneView extends Phaser.GameObjects.Group
{
    private _userNameText! : Text;
    private _seeAdminBtn! : Button;
    private _backToHomeBtn!: Button;
    private _dateContainer!: ContainerLite;

    constructor(scene : Phaser.Scene)
    {
        super(scene)
    }

    public layout()
    {
        var bg = new Image(this.scene, this.scene.scale.width * .5, this.scene.scale.height * .5, BackgroundAsset.background_main.key)
        bg.gameobject.setDisplaySize(this.scene.scale.width, this.scene.scale.height)
        this.add(bg.gameobject)


        var thankYouForPlayingText = new Text(this.scene, 0,0, Localizations.text.result.thankYou, {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: this.scene.scale.height * .09,
            color: FontColors.darkBrown
        });
        thankYouForPlayingText.transform.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .28)
        thankYouForPlayingText.gameobject.setOrigin(.5, 0)

        var lotharLogo = new Image(this.scene, this.scene.scale.width * .5, this.scene.scale.height * .5, UIAsset.game_title.key);
        lotharLogo.transform.setDisplayWidth(this.scene.scale.width * .12, true)
        lotharLogo.gameobject.setPosition(thankYouForPlayingText.gameobject.x - thankYouForPlayingText.gameobject.displayWidth * .15, this.scene.scale.height * .15);

        var deusLogo = new Image(this.scene, this.scene.scale.width * .5, this.scene.scale.height * .5, UIAsset.corporate_logo.key);
        deusLogo.transform.setDisplayWidth(lotharLogo.gameobject.displayWidth * .7, true)
        deusLogo.gameobject.setPosition(lotharLogo.gameobject.x + lotharLogo.gameobject.displayWidth * 1.2, lotharLogo.gameobject.y);

        var userName = new Text(this.scene, 0, this.scene.scale.height * .45, "User Full Name", {
            font: "italic 400 Adobe Caslon Pro",
            color: FontColors.darkBrown
        })
        
        userName.gameobject.setFontSize(this.scene.scale.height * .06)
        userName.gameobject.setPosition(thankYouForPlayingText.gameobject.x, this.scene.scale.height * .45)
        userName.gameobject.setOrigin(.5, 0)
        this._userNameText = userName;

        var line = new Image(this.scene,0,0, UIAsset.line_divider.key);
        line.gameobject.setPosition(userName.gameobject.x, userName.gameobject.y + userName.gameobject.displayHeight * 1.25)
        line.transform.setDisplayWidth(thankYouForPlayingText.gameobject.displayWidth)

        var finishedText = new Text(this.scene, 0, 0, Localizations.text.result.finished, {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: this.scene.scale.height * .05,
            color: FontColors.darkBrown
        })
        finishedText.gameobject.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .58)
        finishedText.gameobject.setOrigin(.5, 0)
        var finishedContainer = new ContainerLite(this.scene,this.scene.scale.width * .5, this.scene.scale.height * .7)

        var finishedOnText = new Text(this.scene, 0,0, Localizations.text.result.finishedDate, {
            font: "300 Adobe Caslon Pro",
            color: FontColors.darkBrown
        });
        finishedOnText.gameobject.setOrigin(.8, 0)
        finishedOnText.gameobject.setFontSize(this.scene.scale.height * .045)
        finishedOnText.gameobject.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .7)
        finishedContainer.add(finishedOnText.gameobject)

        var finishedDate = new Text(this.scene, 0,0, " " + this.getCurrentDate.call(this), {
            fontFamily: FontAsset.adobe_caslon_pro_bold.key,
            fontSize: this.scene.scale.height * .04,
            color: FontColors.darkBrown
        })
        finishedDate.gameobject.setOrigin(-.3, 0)
        finishedDate.gameobject.setPosition(this.scene.scale.width * .5, finishedOnText.gameobject.y * 1.005)
        finishedContainer.add(finishedDate.gameobject)

        finishedContainer.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .7)
        finishedContainer.setOrigin(.5)
        this._dateContainer = finishedContainer;

        var seeAdminPanelButton = new Button(this.scene, 0,0, UIAsset.button_frame_secondary.key)
        seeAdminPanelButton.transform.setDisplayWidth(this.scene.scale.width * .15, true)
        seeAdminPanelButton.transform.setPosition(this.scene.scale.width * .49, this.scene.scale.height * .8)
        seeAdminPanelButton.gameobject.setOrigin(1, 0)
        this._seeAdminBtn = seeAdminPanelButton;

        var seeAdminPanelText = new Text(this.scene, 0, 0, Localizations.text.interactions.seeResult, {
            font: "300 Adobe Caslon Pro",
            color: FontColors.white
        })
        seeAdminPanelText.gameobject.handleTextSize(seeAdminPanelButton.gameobject, seeAdminPanelButton.gameobject.displayHeight * .2, seeAdminPanelButton.gameobject.displayHeight * .05)
        seeAdminPanelText.gameobject.setPosition(seeAdminPanelButton.gameobject.x - seeAdminPanelButton.gameobject.displayWidth * .5, seeAdminPanelButton.gameobject.y + seeAdminPanelButton.gameobject.displayHeight * .5)
        seeAdminPanelText.gameobject.setOrigin(.5)

    
        var backToHomeButton = new Button(this.scene, 0,0, UIAsset.button_frame_primary.key)
        backToHomeButton.transform.setDisplayWidth(this.scene.scale.width * .15, true)
        backToHomeButton.transform.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .8)
        backToHomeButton.gameobject.setOrigin(0)
        this._backToHomeBtn = backToHomeButton;

        var backToHomeText = new Text(this.scene, 0, 0, Localizations.text.interactions.backToHome, {
            font: "300 Adobe Caslon Pro",
            color: FontColors.white
        })
        backToHomeText.gameobject.handleTextSize(backToHomeButton.gameobject, backToHomeButton.gameobject.displayHeight * .2, backToHomeButton.gameobject.displayHeight * .05)
        backToHomeText.gameobject.setPosition(backToHomeButton.gameobject.x + backToHomeButton.gameobject.displayWidth * .5, backToHomeButton.gameobject.y + backToHomeButton.gameobject.displayHeight * .5)
        backToHomeText.gameobject.setOrigin(.5)
    }

    public SetUserNameText(name: string)
    {
        this._userNameText.gameobject.setText(name);
        this._dateContainer.setOrigin(.5)
        this._dateContainer.setPosition(this.scene.scale.width * .5, this.scene.scale.height * .7)
    }

    public RegisterOnSeeAdminPanelClicked(func : Function)
    {
        this._seeAdminBtn.gameobject.on("pointerup", func)
    }

    public RegisterOnBackToHomeClicked(func : Function)
    {
        this._backToHomeBtn.gameobject.on("pointerup", func)
    }

    private getCurrentDate() {
        const date = new Date()
        

        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }

        if(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English)
            return date.toLocaleDateString('en-GB', options)
        
        else return date.toLocaleDateString('id-ID', options)
    }
}