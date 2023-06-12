import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontAsset, FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import CreatePasswordController from './CreatePasswordController';
import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import Localizations from 'Modules/localization/LocalizationHelper';
import RexInputText from 'Modules/extensions/text_extension';
import { createPasswordInput } from 'Modules/extensions/text_input';
export default class CreateNewPasswordView extends Phaser.GameObjects.Container  {

    // UI OBJECTS
    private panel: Image;
    private newPasswordText: Text;
    private newPasswordBox: Image;
    private confirmNewPasswordBox: Image;
    private passwordMissMatchText: Text;
    private updatePasswordButton: Button;
    private updatePasswordButtonText: Text;
    private confirmNewPasswordText: Text;

    // DOM ELEMENTS
    private passwordInput!: Phaser.GameObjects.DOMElement;
    private confirmPasswordInput!: Phaser.GameObjects.DOMElement;
    
    // Variables
    newPassword: string = "";
    confirmPassword: string = "";
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
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.35, true);

        this.confirmNewPasswordBox = new Image(this.scene,0,0, UIAsset.bg_text_box.key);

        this.newPasswordBox = new Image (this.scene,0,0,UIAsset.bg_text_box.key);
        this.newPasswordBox.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);

        this.newPasswordText = new Text (this.scene,0,0,Localizations.text.mainMenu.auth.password, {...this.textStyle});

        this.confirmNewPasswordText = new Text(this.scene,0,0, Localizations.text.mainMenu.auth.confirm_password, {...this.textStyle});

        this.passwordMissMatchText = new Text(
            this.scene,0,0,
            "Password and Confirm Password didn't match",
            {
                color: FontColors.red,
                align: 'left',
                font: '24px bold',
            },
        ); 
            
        this.updatePasswordButton = new Button(this.scene,0,0,UIAsset.button_frame_primary.key);
        this.updatePasswordButtonText = new Text(this.scene,0,0,Localizations.text.mainMenu.auth.confirm_password);
    }

    public create = () => {

        const createNewPasswordTitle = new Text(
            this.scene,
            this.panel.gameobject.x,
            this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.315,
            Localizations.text.mainMenu.auth.create_password_title,
            {
                color: FontColors.darkBrown,
                fontStyle: "bold",
                fontSize: this.scene.scale.height * .035
            }
        );
        createNewPasswordTitle.gameobject.setOrigin(0.5);

        this.newPasswordText.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,
            createNewPasswordTitle.gameobject.y + createNewPasswordTitle.gameobject.displayHeight * 1.8)
        this.newPasswordText.gameobject.setOrigin(0, 0.5);

        this.newPasswordBox.transform.setPosition(this.panel.gameobject.x,this.newPasswordText.gameobject.y + this.newPasswordText.gameobject.displayHeight * 2)

        this.confirmNewPasswordText.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,this.newPasswordBox.gameobject.y + this.newPasswordBox.gameobject.displayHeight * 1.25)
        this.confirmNewPasswordText.gameobject.setOrigin(0, 0.5);
    
        this.confirmNewPasswordBox.transform.setPosition(this.panel.gameobject.x, this.confirmNewPasswordText.gameobject.y + this.confirmNewPasswordText.gameobject.displayHeight * 2)
        this.confirmNewPasswordBox.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);

        this.passwordMissMatchText.gameobject.setWordWrapWidth(this.newPasswordBox.gameobject.displayWidth)
        this.passwordMissMatchText.transform.setPosition(this.confirmNewPasswordBox.gameobject.x - this.confirmNewPasswordBox.gameobject.displayWidth * 0.5,
            this.confirmNewPasswordBox.gameobject.y + this.confirmNewPasswordBox.gameobject.displayHeight * 0.75)
        this.passwordMissMatchText.gameobject.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.passwordMissMatchText.gameobject.setFontSize(this.panel.gameobject.displayHeight * 0.03);
        this.passwordMissMatchText.gameobject.visible = false;
    

        this.updatePasswordButton.transform.setPosition(this.panel.gameobject.x,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .35)
        this.updatePasswordButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.45, true);

        // #region DOM Elements
        // DOM Elements should be declared on Phaser-Induced 'Create' Functions since it should be placed after UI Layouts.
        this.passwordInput = createPasswordInput(this.scene, this.newPasswordBox, (inputText, e) => {
            this.newPassword = inputText.text;
        });
        
        this.confirmPasswordInput = createPasswordInput(this.scene, this.confirmNewPasswordBox, (inputText, e) => {
            this.confirmPassword = inputText.text;
        });

        this.updatePasswordButtonText.transform.setPosition(this.confirmPasswordInput.x, this.updatePasswordButton.gameobject.y)   
        this.updatePasswordButtonText.gameobject.setOrigin(.5)
        // #endregion
    }
        
    addOnConfirmPasswordListeners(updatePasswordAction: (password : string, confirmPassword: string) => void) {
        this.updatePasswordButton.click.on(() => updatePasswordAction(this.newPassword, this.confirmPassword));
    }

    setErrorConfirmVisible(visible: boolean)
    {
        this.passwordMissMatchText.gameobject.visible = visible;
    }
}
