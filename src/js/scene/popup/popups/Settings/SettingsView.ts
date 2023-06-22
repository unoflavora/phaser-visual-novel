import { AudioAsset } from "Assets/AssetLibraryAudio";
import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import { LanguageEnum } from "Definitions/Settings";
import AudioController from "Modules/core/AudioController";
import Button from "Modules/gameobjects/Button";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import Localizations from "Modules/localization/LocalizationHelper";
import MainSceneController from "Scenes/MainSceneController";
import Slider from "phaser3-rex-plugins/templates/ui/slider/Slider";

export default class SettingsView extends Phaser.GameObjects.Container
{
    private bg : Image;
    private title: Text;
    private closeBtn: Button;

    // TODO
    // Creating two button state in two button object is not ideal, but using Phaser's setTexture() method is not working
    private sfxTitle : Text;
    private sfxButton : Button;
    private sfxButtonOff : Button;
    private bgmTitle : Text;
    private bgmButton : Button;
    private bgmButtonOff : Button;

    private languagesTitle : Text;
    private currentLanguage : Button;
    private alternativeLanguage : Button;
    private currentLanguageText : Text;
    private alternativeLanguageText : Text;
    private dropdownIcon : Button;

    private logoutButton : Image;
    private logoutText : Text;
    private userId : Text;

    private slider! : Slider;
    volumeLabel!: Text;

    constructor(scene: Phaser.Scene)
    {
        super(scene);

        this.bg = new Image(scene, 0, 0, UIAsset.popup_background_with_head.key);
        this.add(this.bg.gameobject)
        this.bg.transform.setDisplayWidth(this.scene.scale.width * .4, true);

        this.title = new Text(scene, 0, 0, Localizations.text.mainMenu.settings.title, {})
        this.add(this.title.gameobject);

        this.closeBtn = new Button(scene, 0, 0, UIAsset.icon_close.key);
        this.add(this.closeBtn.gameobject);

        this.sfxTitle = new Text(scene, 0, 0, Localizations.text.mainMenu.settings.sound, {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
    
        });
        this.add(this.sfxTitle.gameobject);

        this.sfxButton = new Button(scene, 0, 0, UIAsset.icon_sfx.key);
        this.add(this.sfxButton.gameobject);

        this.sfxButtonOff = new Button(scene, 0, 0, UIAsset.icon_sfx_off.key);
        this.add(this.sfxButtonOff.gameobject);

        this.bgmButton = new Button(scene, 0, 0, UIAsset.icon_bgm.key);
        this.add(this.bgmButton.gameobject);

        this.bgmButtonOff = new Button(scene, 0, 0, UIAsset.icon_bgm_off.key);
        this.add(this.bgmButtonOff.gameobject);

        this.bgmTitle = new Text(scene, 0, 0, Localizations.text.mainMenu.settings.music, {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.bgmTitle.gameobject);

        this.languagesTitle = new Text(scene, 0, 0, "Language", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.languagesTitle.gameobject);

        this.currentLanguage = new Button(scene, 0, 0, UIAsset.bg_text_box.key);
        this.currentLanguage.transform.setDisplaySize(this.bg.transform.displayWidth * .45, this.bg.transform.displayHeight * .1);
        this.add(this.currentLanguage.gameobject);

        this.alternativeLanguage = new Button(scene, 0, 0, UIAsset.bg_text_box.key);
        this.alternativeLanguage.transform.setDisplaySize(this.currentLanguage.transform.displayWidth, this.currentLanguage.transform.displayHeight);
        this.add(this.alternativeLanguage.gameobject);

        this.currentLanguageText = new Text(scene, 0, 0, "A", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: "#ffffff",
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.currentLanguageText.gameobject);

        this.alternativeLanguageText = new Text(scene, 0, 0, "B", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: "#ffffff",
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.alternativeLanguageText.gameobject);

        this.dropdownIcon = new Button(scene, 0, 0, UIAsset.icon_dropdown.key);
        this.add(this.dropdownIcon.gameobject);

        this.currentLanguage.click.on(() => this.handleLanguageClick());
        this.dropdownIcon.click.on(() => this.handleLanguageClick());
        this.alternativeLanguage.click.on(() => this.handleLanguageClick(true));
    
        this.logoutButton = new Image(scene, 0, 0, UIAsset.button_frame_primary.key);
        this.logoutButton.transform.setDisplayWidth(this.bg.transform.displayWidth * .4, true);
        this.add(this.logoutButton.gameobject);
        this.logoutButton.gameobject.setInteractive();

        this.logoutText = new Text(scene, 0, 0, Localizations.text.mainMenu.auth.logout, {
            fontSize: this.bg.transform.displayHeight * .04,
            color: "#ffffff",
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.logoutText.gameobject);

        this.userId = new Text(scene, 0, 0, "User ID: 123456789", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.userId.gameobject);

    }

    public create()
    {
        this.title.transform.setPosition(0, this.bg.gameobject.y - this.bg.transform.displayHeight * .42);
        this.title.gameobject.setOrigin(.5);
        this.title.gameobject.setFontSize(this.bg.transform.displayHeight * .07)

        this.closeBtn.transform.setDisplayWidth(this.bg.transform.displayWidth * .12, true);
        this.closeBtn.transform.setPosition(this.bg.gameobject.x + this.bg.gameobject.displayWidth * .48, this.bg.gameobject.y - this.bg.transform.displayHeight * .42);
        this.closeBtn.gameobject.on("pointerdown", () => {
            AudioController.instance.play(AudioAsset.main_button_click.key);
        });
        this.layoutIcons();
        this.setBgmButtonsState(MainSceneController.instance.gameData.settings.isBgmOn);
        this.setSfxButtonsState(MainSceneController.instance.gameData.settings.isSfxOn);

        this.layoutLanguages();

        this.logoutButton.transform.setPosition(this.bg.gameobject.x, this.bg.gameobject.y + this.bg.gameobject.displayHeight * .27);
        
        this.logoutText.transform.setPosition(this.logoutButton.gameobject.x, this.logoutButton.gameobject.y);
        this.logoutText.gameobject.setOrigin(.5);

        this.userId.transform.setPosition(this.logoutButton.gameobject.x, this.bg.gameobject.displayHeight * .4);
        this.userId.gameobject.setOrigin(.5)

        var track = this.scene.add.image(0, 0, UIAsset.ui_slider_track.key);
        track.setDisplaySize(this.bg.transform.displayWidth * .8, this.bg.transform.displayHeight * .05);

        var indicator = this.scene.add.image(0, 0, UIAsset.ui_slider_indicator.key);
        indicator.setDisplaySize(track.displayWidth, track.displayHeight);

        var thumb = new Image(this.scene, 0, 0, UIAsset.ui_slider_thumb.key);
        thumb.transform.setDisplayHeight(this.bg.transform.displayHeight * .065, true);

        this.slider = new Slider(this.scene,{
            x: this.currentLanguage.gameobject.x + this.currentLanguage.gameobject.displayWidth * .5,
            y: this.currentLanguage.gameobject.y - this.currentLanguage.transform.displayHeight * 1.5,
            width: this.currentLanguage.gameobject.displayWidth,
            height: this.bg.transform.displayHeight * .05,
            orientation: 'x',
            track: track,
            thumb: thumb.gameobject,
            indicator: indicator,
            valuechangeCallback: (value : number) => { 
                AudioController.instance.volume = value;
            },
            value: AudioController.instance.volume
        });
        this.slider.layout()
        this.add(this.slider)

        this.volumeLabel = new Text(this.scene, 0, 0, "Volume", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.volumeLabel.gameobject);
        this.volumeLabel.transform.setPosition(this.languagesTitle.gameobject.x, this.slider.y - this.slider.displayHeight * .35);
    }

    
    public registerOnClosePopup(callback : Function)
    {
        this.closeBtn.gameobject.addListener("pointerup", () => {
            this.closePopup();
            callback()
        });
    }

    private closePopup() {
        this.alternativeLanguage.gameobject.setVisible(false);
        this.alternativeLanguageText.gameobject.setVisible(false);
        this.setVisible(false);
    }

    private handleLanguageClick(changelanguage : boolean = false)
    {

        this.alternativeLanguage.gameobject.setVisible(!this.alternativeLanguage.gameobject.visible);
        this.alternativeLanguageText.gameobject.setVisible(!this.alternativeLanguageText.gameobject.visible);
    }

    private layoutLanguages() {
        this.languagesTitle.transform.setPosition(this.sfxTitle.gameobject.x, this.sfxTitle.gameobject.y + this.bg.gameobject.displayHeight * .32);
        this.languagesTitle.gameobject.setOrigin(0, .5);

        this.currentLanguage.transform.setPosition(this.languagesTitle.gameobject.x + this.languagesTitle.gameobject.displayWidth * 1.25, this.languagesTitle.gameobject.y);
        this.currentLanguage.gameobject.setOrigin(0, .5);
       
        this.alternativeLanguage.transform.setPosition(this.currentLanguage.gameobject.x, this.currentLanguage.gameobject.y + this.currentLanguage.transform.displayHeight);
        this.alternativeLanguage.gameobject.setOrigin(0, .5);
        this.alternativeLanguage.gameobject.setVisible(false);

        this.dropdownIcon.transform.setPosition(this.currentLanguage.gameobject.x + this.currentLanguage.transform.displayWidth * .9, this.currentLanguage.gameobject.y);

        this.currentLanguageText.transform.setPosition(this.currentLanguage.gameobject.x * .8, this.currentLanguage.gameobject.y);
        this.currentLanguageText.gameobject.setOrigin(0, .5);

        this.alternativeLanguageText.transform.setPosition(this.alternativeLanguage.gameobject.x * .8, this.alternativeLanguage.gameobject.y);
        this.alternativeLanguageText.gameobject.setOrigin(0, .5);
        this.alternativeLanguageText.gameobject.setVisible(false);
        
        this.currentLanguageText.gameobject.setText(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? "English" : "Bahasa Indonesia");

        this.alternativeLanguageText.gameobject.setText(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? "Bahasa Indonesia" : "English");

    }

    private layoutIcons() {
         // Adjust this value as needed
        const iconSize = this.bg.transform.displayWidth * .15;
      
        const bgmButtonWidth = iconSize; // Adjust the width as needed
        const bgmButtonX = this.bg.gameobject.x - this.bg.gameobject.displayWidth * 0.15;
        const bgmButtonY = this.bg.gameobject.y - this.bg.gameobject.displayWidth * 0.2;
      
        const sfxButtonWidth = iconSize; // Adjust the width as needed
        const sfxButtonX = this.bg.gameobject.x + this.bg.gameobject.displayWidth * 0.15 + this.sfxTitle.gameobject.displayWidth;;
        const sfxButtonY = bgmButtonY;
      
        // Set BGM button properties
        this.sfxButton.transform.setDisplayWidth(bgmButtonWidth, true);
        this.sfxButton.transform.setPosition(bgmButtonX, bgmButtonY);
        this.sfxButtonOff.transform.setPosition(bgmButtonX, bgmButtonY);
        this.sfxButtonOff.transform.setDisplayWidth(bgmButtonWidth, true);
      
        // Set SFX title properties
        this.sfxTitle.transform.setPosition(
          bgmButtonX - bgmButtonWidth - this.sfxTitle.transform.displayWidth * 0.5,
          this.sfxButton.gameobject.y * 1.1
        );
      
        // Set SFX button properties
        this.bgmButton.transform.setDisplayWidth(sfxButtonWidth, true);
        this.bgmButton.transform.setPosition(sfxButtonX, sfxButtonY);
        this.bgmButtonOff.transform.setPosition(sfxButtonX, sfxButtonY);
        this.bgmButtonOff.transform.setDisplayWidth(sfxButtonWidth, true);
      
        // Set BGM title properties
        this.bgmTitle.transform.setPosition(
          sfxButtonX - sfxButtonWidth - this.bgmTitle.transform.displayWidth * 0.5, 
          this.bgmButton.gameobject.y * 1.1
        );
    }

    public registerOnLogout(callback : Function)
    {
        this.logoutButton.gameobject.addListener("pointerup", () => {
            callback()
            this.closeBtn.gameobject.emit("pointerup");
        });
    }

    public setUserId(userId : string)
    {
        this.userId.gameobject.setText("User ID: " + userId);
    }

    public setBgmButtonsState(isOn : boolean)
    {
        this.bgmButton.gameobject.setVisible(isOn);
        this.bgmButtonOff.gameobject.setVisible(!isOn);
    }

    public setSfxButtonsState(isOn : boolean)
    {
        this.sfxButton.gameobject.setVisible(isOn);
        this.sfxButtonOff.gameobject.setVisible(!isOn);
    }

    public registerOnBgmButtonClick(callback : Function)
    {
        this.bgmButton.gameobject.addListener("pointerdown", callback)
        this.bgmButtonOff.gameobject.addListener("pointerdown", callback)
        this.bgmTitle.gameobject.addListener("pointerdown", callback)
    }

    public registerOnSfxButtonClick(callback : Function)
    {
        this.sfxButton.gameobject.on("pointerdown", callback)
        this.sfxButtonOff.gameobject.on("pointerdown", callback)
        this.sfxTitle.gameobject.on("pointerdown", callback)
    }

    public registerOnLanguageButtonClick(callback : Function)
    {
        this.alternativeLanguage.gameobject.on("pointerdown", callback)
    }

    public onChangeLanguage()
    {
        // Set all text on this scene to the current language
        console.log(MainSceneController.instance.gameData.settings.lang)

        this.logoutText.gameobject.setText(Localizations.text.mainMenu.auth.logout);
        this.title.gameobject.setText(Localizations.text.mainMenu.settings.title);
        this.sfxTitle.gameobject.setText(Localizations.text.mainMenu.settings.sound);
        this.bgmTitle.gameobject.setText(Localizations.text.mainMenu.settings.music);
        this.languagesTitle.gameobject.setText(Localizations.text.mainMenu.settings.language);

        this.currentLanguageText.gameobject.setText(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? "English" : "Bahasa Indonesia");

        this.alternativeLanguageText.gameobject.setText(MainSceneController.instance.gameData.settings.lang == LanguageEnum.English ? "Bahasa Indonesia" : "English");
    }
}