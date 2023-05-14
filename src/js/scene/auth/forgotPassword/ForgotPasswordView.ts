import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontAsset, FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import Localizations from 'Modules/localization/LocalizationHelper';
import { createPasswordInput, createTextInput } from 'Modules/extensions/text_input';

export default class ForgotPasswordView extends Phaser.GameObjects.Container  {

    // UI OBJECTS
    private panel: Image;
    private emailBox: Image;
    private emailBoxLabel: Text;

    private wrongEmailLabel: Text;
    private backButton: Button;
    private backButtonText: Text;
    private confirmButtonText: Text;
    private confirmButton: Button;

    // DOM ELEMENTS
    private emailInputBox!: Phaser.GameObjects.DOMElement;
    
    // Variables
    emailInput: string = "";

    textStyle =  {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .02
    }

    constructor(scene: Phaser.Scene) {
        super(scene)

        const background = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            BackgroundAsset.background_main.key,
        );
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);

        this.panel = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            UIAsset.popup_background.key,
        );
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.32, true);

        this.emailBox = new Image(this.scene,0,0, UIAsset.bg_text_box.key);
        this.emailBoxLabel = new Text(this.scene,0,0, "Email", this.textStyle);

        this.wrongEmailLabel = new Text(
            this.scene,0,0,
            Localizations.text.mainMenu.auth.invalid_email,
            {
                color: FontColors.red,
                align: 'left',
                font: '24px bold',
            },
        ); 
            
        this.backButton = new Button(this.scene,0,0,UIAsset.button_frame_secondary.key);
        this.backButtonText = new Text(this.scene,0,0,Localizations.text.back);

        this.confirmButton = new Button(this.scene,0,0,UIAsset.button_frame_primary.key);
        this.confirmButtonText = new Text(this.scene,0,0, Localizations.text.mainMenu.auth.send_email);

    }

    public create = () => {

        const forgotPasswordTitle = new Text(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.315,
            Localizations.text.mainMenu.auth.forgot_password_title,
            {
                color: FontColors.darkBrown,
                fontStyle: "bold",
                fontSize: this.scene.scale.height * .035
            }
        );
        forgotPasswordTitle.gameobject.setOrigin(0.5);

        const forgotPasswordDesc = new Text(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.15,
            Localizations.text.mainMenu.auth.forgot_password_desc,
            {
                color: FontColors.darkBrown,
                fontSize: this.scene.scale.height * .022,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.78, useAdvancedWrap: true }
            }
        );
        forgotPasswordDesc.gameobject.setOrigin(0.5);
    
        this.emailBox.transform.setPosition(this.panel.gameobject.x, this.panel.gameobject.y * 1.12)
        this.emailBox.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.75, true);
        this.emailBox.gameobject.setOrigin(0.5);
        this.emailBoxLabel.transform.setPosition(this.emailBox.gameobject.x - this.emailBox.gameobject.displayWidth * .5, this.emailBox.gameobject.y - this.emailBox.gameobject.displayWidth * 0.16)

        this.wrongEmailLabel.transform.setPosition(this.emailBox.gameobject.x - this.emailBox.gameobject.displayWidth * .5,this.emailBox.gameobject.y + this.emailBox.gameobject.displayHeight * 0.75)
        this.wrongEmailLabel.gameobject.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.wrongEmailLabel.gameobject.setFontSize(this.panel.gameobject.displayHeight * 0.03);
        this.wrongEmailLabel.gameobject.visible = false;

        this.backButton.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.backButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.35, true);
        this.backButtonText.transform.setPosition(this.backButton.gameobject.x, this.backButton.gameobject.y)   
        this.backButtonText.gameobject.setOrigin(.5)

        this.confirmButton.transform.setPosition(this.panel.gameobject.x + this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.confirmButton.transform.setDisplayWidth(this.backButton.transform.displayWidth, true);
        this.confirmButtonText.transform.setPosition(this.confirmButton.gameobject.x, this.confirmButton.gameobject.y)
        this.confirmButtonText.gameobject.setOrigin(.5)
        
        this.emailInputBox = createTextInput(this.scene, this.emailBox, (inputText, e) => {
            this.emailInput = inputText.text;
        });
    }
        
    addOnConfirmPasswordListeners(updatePasswordAction: (email: string) => void) {
        this.confirmButton.click.on(() => updatePasswordAction(this.emailInput));
    }

    addOnBackButtonListeners(backAction: () => void) {
        this.backButton.click.on(backAction);
    }


    setErrorConfirmVisible(visible: boolean)
    {
        this.wrongEmailLabel.gameobject.visible = visible;
    }
}
