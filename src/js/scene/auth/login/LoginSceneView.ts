import InputText from 'phaser3-rex-plugins/plugins/inputtext';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import Text from 'Modules/gameobjects/Text';
import Button from 'Modules/gameobjects/Button';
import Image from 'Modules/gameobjects/Image';
import RexInputText from 'Modules/extensions/text_extension';
import Localizations from 'Modules/localization/LocalizationHelper';
import { UIAsset } from 'Assets/AssetLibraryUi';
import { FontAsset, FontColors } from 'Assets/AssetLibraryFont';
import { BackgroundAsset } from 'Assets/AssetLibraryUi';
import { createPasswordInput, createTextInput } from 'Modules/extensions/text_input';
import Buttons from 'phaser3-rex-plugins/templates/ui/buttons/Buttons';
import LoginSceneController from './LoginSceneController';

export default class LoginView extends Phaser.GameObjects.Group  {

    // Controllers
    private controller: LoginSceneController;

    // UI OBJECTS
    private panel: Image;
    private corporateLogo: Image;
    private usernameBg: Image;
    private passwordBg: Image;
    private passwordLabel: Text;
    private wrongPasswordText: Text;
    private loginText: Text;
    private usernameLabel: Text;

    // Interactables
    private loginButton: Button;
    private rememberMeCheckbox: Image;
    private rememberMeText: Text;
    private forgotPasswordText: Text;

    // DOM ELEMENTS
    private usernameInput!: RexInputText;
    private passwordInput!: RexInputText;
    
    // Variables
    username: string = "";
    confirmPassword: string = "";
    textStyle =  {
        color: FontColors.darkBrown,
        fontStyle: "bold",
        fontSize: this.scene.scale.height * .02
    }
    isRememberMe: boolean = false;

    constructor(scene: LoginSceneController) {
        super(scene)

        this.controller = scene;
        this.setVisible(true);


        const background = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.5,
            BackgroundAsset.background_main.key,
        );
        background.transform.setDisplaySize(this.scene.scale.width, this.scene.scale.height);

        this.corporateLogo = new Image(this.scene, this.scene.scale.width * .5 ,this.scene.scale.height * .15, UIAsset.game_title.key);

        this.panel = new Image(
            this.scene,
            this.scene.scale.width * 0.5,
            this.scene.scale.height * 0.55,
            UIAsset.popup_background.key,
        );
        this.panel.transform.setDisplayWidth(this.scene.scale.width * 0.35, true);

        this.passwordBg = new Image(this.scene,0,0, UIAsset.bg_text_box.key);
        this.passwordBg.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);

        this.usernameBg = new Image (this.scene,0,0,UIAsset.bg_text_box.key);
        this.usernameBg.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.7, true);

        this.usernameLabel = new Text (this.scene,0,0,Localizations.text.mainMenu.auth.email, {...this.textStyle});

        this.passwordLabel = new Text(this.scene,0,0, Localizations.text.mainMenu.auth.password, {...this.textStyle});

        this.wrongPasswordText = new Text(
            this.scene,0,0,
            Localizations.text.mainMenu.auth.wrong_password,
            {
                color: FontColors.red,
                align: 'left',
                font: '24px bold',
            },
        ); 
             
        this.loginButton = new Button(this.scene,0,0,UIAsset.button_frame_primary.key);
        this.loginText = new Text(this.scene,0,0,Localizations.text.mainMenu.auth.login);

        this.rememberMeCheckbox = new Image(this.scene, 0,0, UIAsset.checkbox.key);
        this.rememberMeCheckbox.gameobject.setInteractive({ useHandCursor: true});
        this.rememberMeCheckbox.gameobject.on('pointerdown', () => { this.onRememberMeClicked() })

        this.rememberMeText = new Text(this.scene,0,0,Localizations.text.mainMenu.auth.remember_me, {...this.textStyle});
        this.rememberMeText.gameobject.setInteractive({ useHandCursor: true});
        this.rememberMeText.gameobject.on('pointerdown', () => { this.onRememberMeClicked() })

        this.forgotPasswordText = new Text(this.scene,0,0,Localizations.text.mainMenu.auth.forgot_password, {...this.textStyle});
        this.forgotPasswordText.gameobject.setInteractive({useHandCursor: true})
    }


    public create = () => {
    
        this.usernameLabel.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,this.panel.gameobject.y - this.panel.gameobject.displayHeight * 0.315,)
        this.usernameLabel.gameobject.setOrigin(0, 0.5);
        this.usernameBg.transform.setPosition(this.panel.gameobject.x,this.usernameLabel.gameobject.y + this.usernameLabel.gameobject.displayHeight * 2)


        this.passwordLabel.transform.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * 0.35,this.usernameBg.gameobject.y + this.usernameBg.gameobject.displayHeight * 1.25)
        this.passwordLabel.gameobject.setOrigin(0, 0.5);
        this.passwordBg.transform.setPosition(this.panel.gameobject.x, this.passwordLabel.gameobject.y + this.passwordLabel.gameobject.displayHeight * 2)
        this.passwordBg.gameobject.setOrigin(0.5, 0.5);

        this.wrongPasswordText.gameobject.setWordWrapWidth(this.usernameBg.gameobject.displayWidth)
        this.wrongPasswordText.transform.setPosition(this.passwordBg.gameobject.x - this.passwordBg.gameobject.displayWidth * .5,
            this.passwordBg.gameobject.y + this.passwordBg.gameobject.displayHeight * 0.75)
        this.wrongPasswordText.gameobject.setFontFamily(FontAsset.adobe_caslon_pro_bold.key);
        this.wrongPasswordText.gameobject.setFontSize(this.panel.gameobject.displayHeight * 0.03);
        this.wrongPasswordText.gameobject.visible = false;
    
        this.loginButton.transform.setPosition(this.panel.gameobject.x,this.panel.gameobject.y + this.panel.gameobject.displayHeight * .35)
        this.loginButton.transform.setDisplayWidth(this.panel.gameobject.displayWidth * 0.45, true);
        this.loginText.transform.setFontSize(this.loginButton.gameobject.displayHeight * 0.13);
        

        // #region DOM Elements
        // DOM Elements should be declared on Phaser-Induced 'Create' Functions since it should be placed after UI Layouts.
        this.usernameInput = createTextInput(this.scene, this.usernameBg, (inputText, e) => {
            this.username = inputText.text;
        });
        
        this.passwordInput = createPasswordInput(this.scene, this.passwordBg, (inputText, e) => {
            this.confirmPassword = inputText.text;
        });

        this.loginText.transform.setPosition(this.loginButton.gameobject.x, this.loginButton.gameobject.y)   
        this.loginText.gameobject.setOrigin(.5)
        // #endregion

        this.rememberMeCheckbox.transform.gameobject.setPosition(this.panel.gameobject.x - this.panel.gameobject.displayWidth * .35, this.passwordBg.gameobject.y + this.passwordBg.gameobject.displayHeight * 1.75);
        this.rememberMeCheckbox.gameobject.setOrigin(0, 0.5);

        this.rememberMeText.transform.gameobject.setPosition(this.rememberMeCheckbox.gameobject.x + this.rememberMeCheckbox.gameobject.displayWidth * 1.5, this.rememberMeCheckbox.gameobject.y);
        this.rememberMeText.gameobject.setOrigin(0.1, 0.5);

        this.forgotPasswordText.transform.gameobject.setPosition(this.panel.gameobject.x + this.panel.gameobject.displayWidth * .35, this.rememberMeCheckbox.gameobject.y);
        this.forgotPasswordText.gameobject.setOrigin(1, 0.5);        
    }
        
    registerOnLoginListener(updatePasswordAction: (username : string, confirmPassword: string) => void) {
        this.loginButton.click.on(() => updatePasswordAction(this.username, this.confirmPassword));
    }

    setErrorConfirmVisible(visible: boolean)
    {
        this.wrongPasswordText.gameobject.visible = visible;
    }

    registerOnForgotPasswordListener(onForgotPassword: () => void) {
        this.forgotPasswordText.gameobject.on('pointerdown', () => onForgotPassword());
    }

    setInputActive(isActive: boolean) {
        this.usernameInput.setVisible(isActive);
        this.passwordInput.setVisible(isActive);
        this.passwordInput.visibilityButton?.setVisible(isActive);
    }
    
    onRememberMeClicked(){
        console.log("remember me clicked")
        this.isRememberMe = !this.isRememberMe;
        
        if (this.isRememberMe) {
            this.rememberMeCheckbox.gameobject.setTexture(UIAsset.checkbox_checked.key);
        }
        else {
            this.rememberMeCheckbox.gameobject.setTexture(UIAsset.checkbox.key);
        }
    }
}
    
