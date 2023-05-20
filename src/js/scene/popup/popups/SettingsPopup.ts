import { FontAsset, FontColors } from "Assets/AssetLibraryFont";
import { UIAsset } from "Assets/AssetLibraryUi";
import Button from "Modules/gameobjects/Button";
import Image from "Modules/gameobjects/Image";
import Text from "Modules/gameobjects/Text";
import DropDownList from "phaser3-rex-plugins/templates/ui/dropdownlist/DropDownList";

export default class SettingsPopup extends Phaser.GameObjects.Container
{
    private bg : Image;
    private title: Text;
    private closeBtn: Button;

    private sfxTitle : Text;
    private sfxButton : Button;
    private bgmTitle : Text;
    private bgmButton : Button;

    private languagesTitle : Text;
    private currentLanguage : Button;
    private alternativeLanguage : Button;
    private currentLanguageText : Text;
    private alternativeLanguageText : Text;
    private dropdownIcon : Button;

    private logoutButton : Button;
    private logoutText : Text;
    private userId : Text;

    constructor(scene: Phaser.Scene)
    {
        super(scene);

        this.bg = new Image(scene, 0, 0, UIAsset.popup_background_with_head.key);
        this.add(this.bg.gameobject)
        this.bg.transform.setDisplayWidth(this.scene.scale.width * .4, true);

        this.title = new Text(scene, 0, 0, "Settings", {})
        this.add(this.title.gameobject);

        this.closeBtn = new Button(scene, 0, 0, UIAsset.icon_close.key);
        this.add(this.closeBtn.gameobject);

        this.sfxTitle = new Text(scene, 0, 0, "Sound", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: FontColors.darkBrown,
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
    
        });
        this.add(this.sfxTitle.gameobject);

        this.sfxButton = new Button(scene, 0, 0, UIAsset.icon_bgm.key);
        this.add(this.sfxButton.gameobject);
        
        this.bgmButton = new Button(scene, 0, 0, UIAsset.icon_sfx.key);
        this.add(this.bgmButton.gameobject);

        this.bgmTitle = new Text(scene, 0, 0, "Music", {
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

        this.currentLanguageText = new Text(scene, 0, 0, "English", {
            fontSize: this.bg.transform.displayHeight * .04,
            color: "#ffffff",
            fontFamily: FontAsset.adobe_caslon_pro_bold.key
        });
        this.add(this.currentLanguageText.gameobject);

        this.alternativeLanguageText = new Text(scene, 0, 0, "Indonesian", {
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
    
        this.logoutButton = new Button(scene, 0, 0, UIAsset.button_frame_primary.key);
        this.logoutButton.transform.setDisplayWidth(this.bg.transform.displayWidth * .4, true);
        this.add(this.logoutButton.gameobject);

        this.logoutText = new Text(scene, 0, 0, "Logout", {
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
        this.title.gameobject.setFontSize(this.bg.transform.displayHeight * .072)

        this.closeBtn.transform.setDisplayWidth(this.bg.transform.displayWidth * .12, true);
        this.closeBtn.transform.setPosition(this.bg.gameobject.x + this.bg.gameobject.displayWidth * .48, this.bg.gameobject.y - this.bg.transform.displayHeight * .42);
    
        this.layoutIcons();

        this.layoutLanguages();

        this.logoutButton.transform.setPosition(this.bg.gameobject.x, this.bg.gameobject.y + this.bg.gameobject.displayHeight * .25);
        this.logoutText.transform.setPosition(this.logoutButton.gameobject.x, this.logoutButton.gameobject.y);
        this.logoutText.gameobject.setOrigin(.5);

        this.userId.transform.setPosition(this.logoutButton.gameobject.x, this.bg.gameobject.displayHeight * .4);
        this.userId.gameobject.setOrigin(.5)
    }

    
    public registerOnClosePopup(callback : Function)
    {
        this.closeBtn.click.on(() => {
            this.alternativeLanguage.gameobject.setVisible(false);
            this.alternativeLanguageText.gameobject.setVisible(false);
            callback()
        });
    }

    private handleLanguageClick(changelanguage : boolean = false)
    {

        this.alternativeLanguage.gameobject.setVisible(!this.alternativeLanguage.gameobject.visible);
        this.alternativeLanguageText.gameobject.setVisible(!this.alternativeLanguageText.gameobject.visible);
        
        if(changelanguage)
        {
            var temp = this.currentLanguageText.gameobject.text;
            this.currentLanguageText.gameobject.setText(this.alternativeLanguageText.gameobject.text);
            this.alternativeLanguageText.gameobject.setText(temp);
        }
        
        console.log("CLick")
    }

    private layoutLanguages() {
        this.languagesTitle.transform.setPosition(this.sfxTitle.gameobject.x, this.sfxTitle.gameobject.y + this.bg.gameobject.displayHeight * .25);
        this.languagesTitle.gameobject.setOrigin(0, .5);

        this.currentLanguage.transform.setPosition(this.languagesTitle.gameobject.x + this.languagesTitle.gameobject.displayWidth * 1.4, this.languagesTitle.gameobject.y);
        this.currentLanguage.gameobject.setOrigin(0, .5);
       
        this.alternativeLanguage.transform.setPosition(this.currentLanguage.gameobject.x, this.currentLanguage.gameobject.y + this.currentLanguage.transform.displayHeight);
        this.alternativeLanguage.gameobject.setOrigin(0, .5);
        this.alternativeLanguage.gameobject.setVisible(false);

        this.dropdownIcon.transform.setPosition(this.currentLanguage.gameobject.x + this.currentLanguage.transform.displayWidth * .9, this.currentLanguage.gameobject.y);

        this.currentLanguageText.transform.setPosition(this.currentLanguage.gameobject.x, this.currentLanguage.gameobject.y);
        this.currentLanguageText.gameobject.setOrigin(-.2, .5);

        this.alternativeLanguageText.transform.setPosition(this.alternativeLanguage.gameobject.x, this.alternativeLanguage.gameobject.y);
        this.alternativeLanguageText.gameobject.setOrigin(-.2, .5);
        this.alternativeLanguageText.gameobject.setVisible(false);
    }

    private layoutIcons() {
         // Adjust this value as needed
        const iconSize = this.bg.transform.displayWidth * .15;
      
        const sfxButtonWidth = iconSize; // Adjust the width as needed
        const sfxButtonX = this.bg.gameobject.x - this.bg.gameobject.displayWidth * 0.15;
        const sfxButtonY = this.bg.gameobject.y - this.bg.gameobject.displayWidth * 0.2;
      
        const bgmButtonWidth = iconSize; // Adjust the width as needed
        const bgmButtonX = this.bg.gameobject.x + this.bg.gameobject.displayWidth * 0.15 + this.sfxTitle.gameobject.displayWidth;;
        const bgmButtonY = sfxButtonY;
      
        // Set SFX button properties
        this.sfxButton.transform.setDisplayWidth(sfxButtonWidth, true);
        this.sfxButton.transform.setPosition(sfxButtonX, sfxButtonY);
      
        // Set SFX title properties
        this.sfxTitle.transform.setPosition(
          sfxButtonX - sfxButtonWidth - this.sfxTitle.transform.displayWidth * 0.5,
          this.sfxButton.gameobject.y * 1.1
        );
      
        // Set BGM button properties
        this.bgmButton.transform.setDisplayWidth(bgmButtonWidth, true);
        this.bgmButton.transform.setPosition(bgmButtonX, bgmButtonY);
      
        // Set BGM title properties
        this.bgmTitle.transform.setPosition(
          bgmButtonX - bgmButtonWidth - this.bgmTitle.transform.displayWidth * 0.5, 
          this.bgmButton.gameobject.y * 1.1
        );
      }
}