import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import Localizations from 'Modules/localization/LocalizationHelper';
import "Modules/extensions/text_sizer";

export default class ForgotPasswordView extends Phaser.GameObjects.Container  {

    // UI OBJECTS
    private panel: Image;
    private backButton: Button;
    private backButtonText: Text;
    private confirmButtonText: Text;
    private confirmButton: Button;
    
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

            
        this.backButton = new Button(this.scene,0,0,UIAsset.button_frame_secondary.key);
        this.backButtonText = new Text(this.scene,0,0,Localizations.text.interactions.back);

        this.confirmButton = new Button(this.scene,0,0,UIAsset.button_frame_primary.key);
        this.confirmButtonText = new Text(this.scene,0,0, Localizations.text.mainMenu.auth.reset_password);


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
            this.panel.gameobject.y,
            Localizations.text.mainMenu.auth.forgot_password_desc,
            {
                color: FontColors.darkBrown,
                fontSize: this.scene.scale.height * .022,
                wordWrap: { width: this.panel.gameobject.displayWidth * 0.78, useAdvancedWrap: true },
                align: "center"
            }
        );
        forgotPasswordDesc.gameobject.setOrigin(0.5);
    
        this.backButton.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.backButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.35, true);
        this.backButtonText.transform.setPosition(this.backButton.gameobject.x, this.backButton.gameobject.y)   
        this.backButtonText.gameobject.setOrigin(.5)
        this.backButtonText.gameobject.handleTextSize(this.backButton.gameobject, this.scene.scale.height * .02)

        this.confirmButton.transform.setPosition(this.panel.gameobject.x + this.panel.gameobject.displayWidth * .2,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .32)
        this.confirmButton.transform.setDisplayWidth(this.backButton.transform.displayWidth, true);
        this.confirmButtonText.transform.setPosition(this.confirmButton.gameobject.x, this.confirmButton.gameobject.y)
        this.confirmButtonText.gameobject.setOrigin(.5)
        this.confirmButtonText.gameobject.handleTextSize(this.confirmButton.gameobject, this.scene.scale.height * .02)

    }
        
    addOnConfirmPasswordListeners(updatePasswordAction: (email: string) => void) {
        this.confirmButton.click.on(() => updatePasswordAction(this.emailInput));
    }

    addOnBackButtonListeners(backAction: () => void) {
        this.backButton.click.on(backAction);
    }


}
